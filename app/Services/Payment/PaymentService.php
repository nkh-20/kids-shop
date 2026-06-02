<?php

namespace App\Services\Payment;

use App\Models\Order;

class PaymentService
{
    private array $drivers = [];

    public function __construct()
    {
        $this->drivers['cod'] = new CodPayment();
    }

    public function register(string $method, PaymentDriver $driver): void
    {
        $this->drivers[$method] = $driver;
    }

    public function process(Order $order, string $method = 'cod'): void
    {
        $driver = $this->drivers[$method] ?? throw new \RuntimeException("Payment method '{$method}' not supported.");

        $driver->process($order);
    }
}
