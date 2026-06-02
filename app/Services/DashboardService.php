<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class DashboardService
{
    public function getStats(): array
    {
        return [
            'total_users' => User::where('role', 'customer')->count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'revenue' => (float) Order::whereIn('status', ['delivered', 'shipped', 'processing', 'confirmed'])
                ->sum('total'),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'low_stock_products' => Product::lowStock()->count(),
            'recent_orders' => Order::with('user')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
        ];
    }
}
