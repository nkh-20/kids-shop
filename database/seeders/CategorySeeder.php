<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Toys', 'description' => 'Fun and educational toys for kids of all ages.'],
            ['name' => 'Clothing', 'description' => 'Stylish and comfortable kids clothing.'],
            ['name' => 'Books', 'description' => 'Children books for learning and entertainment.'],
            ['name' => 'School Supplies', 'description' => 'Everything your child needs for school.'],
            ['name' => 'Baby Gear', 'description' => 'Essential gear for babies and toddlers.'],
            ['name' => 'Sports & Outdoors', 'description' => 'Sports equipment and outdoor fun.'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
