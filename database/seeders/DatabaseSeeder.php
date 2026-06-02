<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@kidsonline.com',
            'password' => Hash::make('password'),
            'phone' => '09123456789',
            'address' => 'Admin Office, Yangon',
        ]);
        $admin->forceFill(['role' => 'admin'])->save();

        // Test customer
        $customer = User::create([
            'name' => 'Customer',
            'email' => 'customer@kidsonline.com',
            'password' => Hash::make('password'),
            'phone' => '09987654321',
            'address' => 'Customer Home, Yangon',
        ]);
        $customer->forceFill(['role' => 'customer'])->save();

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
