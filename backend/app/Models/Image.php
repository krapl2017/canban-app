<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Card;

class Image extends Model
{
    protected $fillable = ['path', 'card_id'];

    public function card()
    {
        return $this->belongsTo(Card::class);
    }
}
