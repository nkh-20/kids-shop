<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\CartSeeder;

class SeedCart extends Command
{
    protected $signature = 'cart:seed';
    protected $description = 'Seed test cart items for the customer user';

    public function handle(): int
    {
        $this->call(CartSeeder::class);
        $this->info('Cart seeded successfully. Login as customer@kidsonline.com to test.');
        return Command::SUCCESS;
    }
}
