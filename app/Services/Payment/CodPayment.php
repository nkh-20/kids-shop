<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\Payment;

class CodPayment implements PaymentDriver
{
    public function process(Order $order): void
    {
        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => 'cod',
        ]);
        $payment->forceFill([
            'status' => 'pending',
            'amount' => $order->total,
        ])->save();
    }
}
