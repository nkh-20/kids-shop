<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
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

    public function index(Request $request)
    {
        $filters = $request->only(['status', 'search', 'sort_by', 'sort_order', 'per_page']);
        $orders = $this->orderService->getAllOrders($filters);

        return $this->paginated(
            $orders->through(fn($order) => new OrderResource($order)),
            'Orders retrieved successfully.'
        );
    }

    public function updateStatus(UpdateOrderStatusRequest $request, int $id)
    {
        $order = $this->orderService->updateStatus($id, $request->status);

        return $this->success(
            new OrderResource($order),
            'Order status updated successfully.'
        );
    }
}
