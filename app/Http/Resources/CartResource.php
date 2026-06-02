<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id ?? null,
            'user_id' => $this->user_id ?? null,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'subtotal' => $this->subtotal ?? 0,
            'total' => $this->total ?? 0,
            'created_at' => $this->created_at ?? null,
        ];
    }
}