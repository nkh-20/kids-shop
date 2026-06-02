<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Traits\ApiResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(private DashboardService $dashboardService)
    {
    }

    public function index()
    {
        $stats = $this->dashboardService->getStats();

        return $this->success($stats, 'Dashboard data retrieved successfully.');
    }
}