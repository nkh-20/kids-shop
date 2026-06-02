<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Collection;

class CartService
{
    public function getOrCreateCart(int $userId): Cart
    {
        $cart = Cart::with('items.product')->where('user_id', $userId)->first();

        if (!$cart) {
            $cart = new Cart();
            $cart->user_id = $userId;
            $cart->save();
            $cart->setRelation('items', collect());
        }

        return $cart;
    }

    public function addItem(int $userId, int $productId, int $quantity): Cart
    {
        $product = Product::findOrFail($productId);

        if (!$product->isInStock()) {
            throw new \RuntimeException('Product is out of stock.');
        }

        $cart = $this->getOrCreateCart($userId);
        $existingItem = $cart->items()->where('product_id', $productId)->first();

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $quantity;

            if (!$product->hasSufficientStock($newQuantity)) {
                throw new \RuntimeException("Insufficient stock. Only {$product->stock_quantity} available.");
            }

            $existingItem->update([
                'quantity' => $newQuantity,
            ]);
            $existingItem->forceFill(['price' => $product->current_price])->save();
        } else {
            if (!$product->hasSufficientStock($quantity)) {
                throw new \RuntimeException("Insufficient stock. Only {$product->stock_quantity} available.");
            }

            $item = $cart->items()->create([
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
            $item->forceFill(['price' => $product->current_price])->save();
        }

        return $cart->fresh()->load('items.product');
    }

    public function updateItem(int $userId, int $itemId, int $quantity): Cart
    {
        $cart = $this->getOrCreateCart($userId);
        $item = $cart->items()->findOrFail($itemId);

        if ($quantity <= 0) {
            $item->delete();
            return $cart->fresh()->load('items.product');
        }

        $product = $item->product;

        if (!$product->hasSufficientStock($quantity)) {
            throw new \RuntimeException("Insufficient stock. Only {$product->stock_quantity} available.");
        }

        $item->update(['quantity' => $quantity]);

        return $cart->fresh()->load('items.product');
    }

    public function removeItem(int $userId, int $itemId): Cart
    {
        $cart = $this->getOrCreateCart($userId);
        $cart->items()->findOrFail($itemId)->delete();

        return $cart->fresh()->load('items.product');
    }

    public function clearCart(int $userId): void
    {
        $cart = Cart::where('user_id', $userId)->first();

        if ($cart) {
            $cart->items()->delete();
        }
    }

    public function getCart(int $userId): ?Cart
    {
        return Cart::with('items.product.category')
            ->where('user_id', $userId)
            ->first();
    }
}
