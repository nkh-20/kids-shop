<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $toys = Category::where('name', 'Toys')->first();
        $clothing = Category::where('name', 'Clothing')->first();
        $books = Category::where('name', 'Books')->first();
        $school = Category::where('name', 'School Supplies')->first();
        $baby = Category::where('name', 'Baby Gear')->first();
        $sports = Category::where('name', 'Sports & Outdoors')->first();

        $products = [
            // Toys
            ['name' => 'Building Blocks Set', 'category_id' => $toys->id, 'price' => 25000, 'stock_quantity' => 50, 'sku' => 'TOY-BLK-001'],
            ['name' => 'Remote Control Car', 'category_id' => $toys->id, 'price' => 45000, 'sale_price' => 38000, 'stock_quantity' => 30, 'sku' => 'TOY-RCC-002'],
            ['name' => 'Puzzle 1000 Pieces', 'category_id' => $toys->id, 'price' => 15000, 'stock_quantity' => 25, 'sku' => 'TOY-PZL-003'],
            ['name' => 'Teddy Bear', 'category_id' => $toys->id, 'price' => 20000, 'stock_quantity' => 0, 'sku' => 'TOY-TDY-004'],

            // Clothing
            ['name' => 'Kids T-Shirt (Cartoon Print)', 'category_id' => $clothing->id, 'price' => 12000, 'sale_price' => 9000, 'stock_quantity' => 100, 'sku' => 'CLT-TSH-001'],
            ['name' => 'Denim Jeans (Kids)', 'category_id' => $clothing->id, 'price' => 25000, 'stock_quantity' => 60, 'sku' => 'CLT-DNM-002'],
            ['name' => 'Winter Jacket', 'category_id' => $clothing->id, 'price' => 55000, 'stock_quantity' => 20, 'sku' => 'CLT-JKT-003'],
            ['name' => 'Kids Sneakers', 'category_id' => $clothing->id, 'price' => 35000, 'stock_quantity' => 40, 'sku' => 'CLT-SNK-004'],

            // Books
            ['name' => 'ABC Learning Book', 'category_id' => $books->id, 'price' => 8000, 'stock_quantity' => 80, 'sku' => 'BOK-ABC-001'],
            ['name' => 'Fairy Tales Collection', 'category_id' => $books->id, 'price' => 15000, 'stock_quantity' => 45, 'sku' => 'BOK-FTC-002'],
            ['name' => 'Science Experiment for Kids', 'category_id' => $books->id, 'price' => 18000, 'stock_quantity' => 3, 'sku' => 'BOK-SCI-003'],
            ['name' => 'Coloring Book Set', 'category_id' => $books->id, 'price' => 5000, 'stock_quantity' => 120, 'sku' => 'BOK-CLB-004'],

            // School Supplies
            ['name' => 'Backpack (Kids Size)', 'category_id' => $school->id, 'price' => 22000, 'stock_quantity' => 35, 'sku' => 'SCH-BPK-001'],
            ['name' => 'Pencil Case Set', 'category_id' => $school->id, 'price' => 8000, 'stock_quantity' => 90, 'sku' => 'SCH-PNC-002'],
            ['name' => 'Water Bottle', 'category_id' => $school->id, 'price' => 10000, 'sale_price' => 7500, 'stock_quantity' => 65, 'sku' => 'SCH-WTB-003'],

            // Baby Gear
            ['name' => 'Baby Stroller', 'category_id' => $baby->id, 'price' => 150000, 'stock_quantity' => 10, 'sku' => 'BAB-STR-001'],
            ['name' => 'Baby Feeding Set', 'category_id' => $baby->id, 'price' => 18000, 'stock_quantity' => 40, 'sku' => 'BAB-FED-002'],
            ['name' => 'Diaper Bag', 'category_id' => $baby->id, 'price' => 28000, 'stock_quantity' => 8, 'sku' => 'BAB-DBG-003'],

            // Sports & Outdoors
            ['name' => 'Kids Bicycle (16 inch)', 'category_id' => $sports->id, 'price' => 120000, 'stock_quantity' => 15, 'sku' => 'SPT-BIK-001'],
            ['name' => 'Soccer Ball', 'category_id' => $sports->id, 'price' => 15000, 'stock_quantity' => 50, 'sku' => 'SPT-SCB-002'],
            ['name' => 'Jump Rope', 'category_id' => $sports->id, 'price' => 3000, 'stock_quantity' => 200, 'sku' => 'SPT-JMP-003'],
            ['name' => 'Badminton Set', 'category_id' => $sports->id, 'price' => 25000, 'stock_quantity' => 25, 'sku' => 'SPT-BDM-004'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
