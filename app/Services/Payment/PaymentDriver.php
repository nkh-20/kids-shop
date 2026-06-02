<?php

namespace App\Services\Payment;

use App\Models\Order;

interface PaymentDriver
{
    public function process(Order $order): void;
}
