<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Http\Resources\CartResource;
use App\Services\CartService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;

    public function __construct(private CartService $cartService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartService->getCart($request->user()->id);

        if (!$cart) {
            return $this->success(new CartResource((object) [
                'items' => [],
            ]), 'Cart is empty.');
        }

        return $this->success(
            new CartResource($cart),
            'Cart retrieved successfully.'
        );
    }

    public function add(CartRequest $request): JsonResponse
    {
        try {
            $cart = $this->cartService->addItem(
                $request->user()->id,
                $request->product_id,
                $request->quantity
            );

            return $this->success(
                new CartResource($cart),
                'Item added to cart successfully.'
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), null, 400);
        }
    }

    public function update(UpdateCartRequest $request, int $id): JsonResponse
    {
        try {
            $cart = $this->cartService->updateItem(
                $request->user()->id,
                $id,
                $request->quantity
            );

            return $this->success(
                new CartResource($cart),
                'Cart item updated successfully.'
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), null, 400);
        }
    }

    public function remove(Request $request, int $id): JsonResponse
    {
        $cart = $this->cartService->removeItem($request->user()->id, $id);

        return $this->success(
            new CartResource($cart),
            'Item removed from cart.'
        );
    }

    public function clear(Request $request): JsonResponse
    {
        $this->cartService->clearCart($request->user()->id);

        return $this->success(new CartResource((object) [
            'items' => [],
        ]), 'Cart cleared successfully.');
    }
}