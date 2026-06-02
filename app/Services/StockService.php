<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockHistory;

class StockService
{
    public function deduct(Product $product, int $quantity, ?string $referenceType = null, ?int $referenceId = null, ?int $userId = null): void
    {
        if (!$product->hasSufficientStock($quantity)) {
            throw new \RuntimeException("Insufficient stock for product: {$product->name}");
        }

        $before = $product->stock_quantity;
        $product->decrement('stock_quantity', $quantity);
        $after = $product->fresh()->stock_quantity;

        $this->record($product->id, $userId, 'deducted', $before, $after, $referenceType, $referenceId);
    }

    public function add(Product $product, int $quantity, ?string $referenceType = null, ?int $referenceId = null, ?int $userId = null): void
    {
        $before = $product->stock_quantity;
        $product->increment('stock_quantity', $quantity);
        $after = $product->fresh()->stock_quantity;

        $this->record($product->id, $userId, 'added', $before, $after, $referenceType, $referenceId);
    }

    public function adjust(Product $product, int $newQuantity, ?int $userId = null): void
    {
        $before = $product->stock_quantity;
        $product->update(['stock_quantity' => $newQuantity]);
        $after = $product->fresh()->stock_quantity;

        $type = $after > $before ? 'added' : ($after < $before ? 'deducted' : 'adjusted');
        $this->record($product->id, $userId, $type, $before, $after);
    }

    protected function record(int $productId, ?int $userId, string $type, int $before, int $after, ?string $referenceType = null, ?int $referenceId = null): void
    {
        StockHistory::create([
            'product_id' => $productId,
            'user_id' => $userId,
            'type' => $type,
            'quantity_before' => $before,
            'quantity_after' => $after,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
        ]);
    }
}
