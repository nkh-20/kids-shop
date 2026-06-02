<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'sku' => strtoupper(Str::random(8)),
            'category_id' => Category::factory(),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 500),
            'sale_price' => fake()->optional(0.3)->randomFloat(2, 5, 400),
            'stock_quantity' => fake()->numberBetween(0, 100),
            'image' => null,
            'status' => true,
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(fn(array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    public function onSale(): static
    {
        return $this->state(fn(array $attributes) => [
            'sale_price' => fake()->randomFloat(2, 5, $attributes['price'] - 1),
        ]);
    }
}
