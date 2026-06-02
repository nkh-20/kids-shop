<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function __construct(private ProductService $productService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'category_id', 'min_price', 'max_price', 'status', 'in_stock', 'sort_by', 'sort_order', 'per_page']);
        $products = $this->productService->list($filters);

        return $this->paginated(
            $products->through(fn($product) => new ProductResource($product)),
            'Products retrieved successfully.'
        );
    }

    public function store(ProductRequest $request): JsonResponse
    {
        $product = $this->productService->create($request->validated());

        return $this->success(
            new ProductResource($product),
            'Product created successfully.',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->productService->findById($id);

        return $this->success(
            new ProductResource($product),
            'Product retrieved successfully.'
        );
    }

    public function update(ProductRequest $request, int $id): JsonResponse
    {
        $product = $this->productService->update($id, $request->validated());

        return $this->success(
            new ProductResource($product),
            'Product updated successfully.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->productService->delete($id);

        return $this->success(null, 'Product deleted successfully.');
    }

    public function lowStock(): JsonResponse
    {
        $products = $this->productService->getLowStock();

        return $this->paginated(
            $products->through(fn($product) => new ProductResource($product)),
            'Low stock products retrieved successfully.'
        );
    }
}