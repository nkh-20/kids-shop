<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    public function __construct(private OrderService $orderService)
    {
    }

    public function store(OrderRequest $request)
    {
        try {
            $order = $this->orderService->checkout(
                request()->user()->id,
                $request->validated()
            );

            return $this->success(
                new OrderResource($order),
                'Order placed successfully.',
                201
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), null, 400);
        }
    }

    public function index(Request $request)
    {
        $orders = $this->orderService->getOrders(request()->user()->id);

        return $this->paginated(
            $orders->through(fn($order) => new OrderResource($order)),
            'Orders retrieved successfully.'
        );
    }

    public function show(int $id)
    {
        $order = $this->orderService->getOrder(request()->user()->id, $id);

        return $this->success(
            new OrderResource($order),
            'Order retrieved successfully.'
        );
    }
}
