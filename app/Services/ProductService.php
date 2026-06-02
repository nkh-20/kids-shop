<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ProductService
{
    private const ALLOWED_SORT_FIELDS = ['name', 'price', 'created_at', 'stock_quantity', 'status'];

    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = Product::with('category');

        if (!empty($filters['search'])) {
            $searchTerm = str_replace(['%', '_'], ['\\%', '\\_'], $filters['search']);
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status'] === 'active');
        }

        if (!empty($filters['in_stock'])) {
            $query->where('stock_quantity', '>', 0);
        }

        $sortField = in_array($filters['sort_by'] ?? '', self::ALLOWED_SORT_FIELDS)
            ? $filters['sort_by']
            : 'created_at';
        $sortOrder = in_array($filters['sort_order'] ?? '', ['asc', 'desc'])
            ? $filters['sort_order']
            : 'desc';
        $perPage = $filters['per_page'] ?? 15;

        return $query->orderBy($sortField, $sortOrder)->paginate($perPage);
    }

    public function findById(int $id): Product
    {
        return Product::with('category')->findOrFail($id);
    }

    public function findBySlug(string $slug): Product
    {
        return Product::with('category')->where('slug', $slug)->firstOrFail();
    }

    public function create(array $data): Product
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return Product::create($data);
    }

    public function update(int $id, array $data): Product
    {
        $product = $this->findById($id);

        if (!empty($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $product->update($data);

        return $product->fresh()->load('category');
    }

    public function delete(int $id): void
    {
        $product = $this->findById($id);
        $product->delete();
    }

    public function getLowStock(int $threshold = 10): LengthAwarePaginator
    {
        return Product::with('category')
            ->lowStock($threshold)
            ->orderBy('stock_quantity')
            ->paginate(15);
    }
}
