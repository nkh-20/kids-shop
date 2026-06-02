<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Services\StockService;

class DeductStock
{
    public function __construct(private StockService $stockService)
    {
    }

    public function handle(OrderCreated $event): void
    {
        $order = $event->order;

        foreach ($order->items as $item) {
            $this->stockService->deduct(
                $item->product,
                $item->quantity,
                'order',
                $order->id,
                $order->user_id
            );
        }
    }
}
