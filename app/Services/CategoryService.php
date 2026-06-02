<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Str;

class CategoryService
{
    public function list(array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = Category::withCount('products');

        if (!empty($filters['search'])) {
            $searchTerm = str_replace(['%', '_'], ['\\%', '\\_'], $filters['search']);
            $query->where('name', 'like', "%{$searchTerm}%");
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('name')->get();
    }

    public function findById(int $id): Category
    {
        return Category::withCount('products')->findOrFail($id);
    }

    public function create(array $data): Category
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return Category::create($data);
    }

    public function update(int $id, array $data): Category
    {
        $category = $this->findById($id);

        if (!empty($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        return $category->fresh();
    }

    public function delete(int $id): void
    {
        $category = $this->findById($id);

        if ($category->products()->count() > 0) {
            throw new \RuntimeException('Cannot delete category with associated products.');
        }

        $category->delete();
    }
}
