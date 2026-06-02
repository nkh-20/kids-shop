<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Support\Facades\Log;

class SendOrderConfirmation
{
    public function handle(OrderCreated $event): void
    {
        // TODO: Send email notification
        // For now, log the order confirmation
        Log::info('Order placed', [
            'order_number' => $event->order->order_number,
            'user_id' => $event->order->user_id,
            'total' => $event->order->total,
        ]);
    }
}
