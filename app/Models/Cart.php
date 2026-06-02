<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public function getSubtotalAttribute(): float
    {
        return $this->items ? $this->items->sum(function (CartItem $item) {
            return $item->price * $item->quantity;
        }) : 0;
    }

    public function getTotalAttribute(): float
    {
        return $this->subtotal;
    }
}
