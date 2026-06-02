<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponse;

    public function __construct(private CategoryService $categoryService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status']);
        $categories = $this->categoryService->list($filters);

        return $this->success(
            CategoryResource::collection($categories),
            'Categories retrieved successfully.'
        );
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated());

        return $this->success(
            new CategoryResource($category),
            'Category created successfully.',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $category = $this->categoryService->findById($id);

        return $this->success(
            new CategoryResource($category),
            'Category retrieved successfully.'
        );
    }

    public function update(CategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->categoryService->update($id, $request->validated());

        return $this->success(
            new CategoryResource($category),
            'Category updated successfully.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->categoryService->delete($id);
            return $this->success(null, 'Category deleted successfully.');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), null, 400);
        }
    }
}