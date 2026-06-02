<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('email', 'customer@kidsonline.com')->first();
        if (!$customer) return;

        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $products = Product::inStock()->take(3)->get();

        foreach ($products as $i => $product) {
            $item = CartItem::updateOrCreate(
                ['cart_id' => $cart->id, 'product_id' => $product->id],
                ['quantity' => ($i + 1) * 2]
            );
            $item->forceFill(['price' => $product->current_price])->save();
        }
    }
}
