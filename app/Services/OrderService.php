<?php

namespace App\Services;

use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Services\Payment\PaymentService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    private const ALLOWED_SORT_FIELDS = ['created_at', 'status', 'total', 'order_number'];

    public function __construct(
        private CartService $cartService,
        private StockService $stockService,
        private PaymentService $paymentService,
    ) {
    }

    public function checkout(int $userId, array $data): Order
    {
        return DB::transaction(function () use ($userId, $data) {
            $cart = $this->cartService->getCart($userId);

            if (!$cart || $cart->items->isEmpty()) {
                throw new \RuntimeException('Cart is empty.');
            }

            $subtotal = 0;

            foreach ($cart->items as $item) {
                $product = $item->product;

                if (!$product->isInStock()) {
                    throw new \RuntimeException("Product '{$product->name}' is out of stock.");
                }

                if (!$product->hasSufficientStock($item->quantity)) {
                    throw new \RuntimeException("Insufficient stock for '{$product->name}'. Only {$product->stock_quantity} available.");
                }

                $subtotal += $product->current_price * $item->quantity;
            }

            $orderNumber = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));

            $order = Order::create([
                'user_id' => $userId,
                'order_number' => $orderNumber,
                'shipping_address' => $data['shipping_address'],
                'notes' => $data['notes'] ?? null,
            ]);
            $order->forceFill([
                'status' => 'pending',
                'subtotal' => $subtotal,
                'total' => $subtotal,
            ])->save();

            foreach ($cart->items as $item) {
                $product = $item->product;
                $orderItem = $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                ]);
                $orderItem->forceFill(['price' => $product->current_price])->save();
            }

            $this->paymentService->process($order, $data['payment_method'] ?? 'cod');

            foreach ($cart->items as $item) {
                $this->stockService->deduct(
                    $item->product,
                    $item->quantity,
                    'order',
                    $order->id,
                    $userId
                );
            }

            $this->cartService->clearCart($userId);

            OrderCreated::dispatch($order);

            return $order->fresh()->load(['items.product', 'payment']);
        });
    }

    public function getOrders(int $userId): LengthAwarePaginator
    {
        return Order::with('items.product')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(15);
    }

    public function getOrder(int $userId, int $orderId): Order
    {
        return Order::with('items.product', 'payment')
            ->where('user_id', $userId)
            ->findOrFail($orderId);
    }

    public function getAllOrders(array $filters = []): LengthAwarePaginator
    {
        $query = Order::with('user', 'items.product', 'payment');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $searchTerm = str_replace(['%', '_'], ['\\%', '\\_'], $filters['search']);
            $query->where(function ($q) use ($searchTerm) {
                $q->where('order_number', 'like', "%{$searchTerm}%")
                    ->orWhereHas('user', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%");
                    });
            });
        }

        $sortField = in_array($filters['sort_by'] ?? '', self::ALLOWED_SORT_FIELDS)
            ? $filters['sort_by']
            : 'created_at';
        $sortOrder = in_array($filters['sort_order'] ?? '', ['asc', 'desc'])
            ? $filters['sort_order']
            : 'desc';

        return $query->orderBy($sortField, $sortOrder)->paginate($filters['per_page'] ?? 15);
    }

    public function updateStatus(int $orderId, string $status): Order
    {
        $order = Order::findOrFail($orderId);
        $order->update(['status' => $status]);

        return $order->fresh()->load(['user', 'items.product', 'payment']);
    }
}
