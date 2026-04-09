<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Column;
use App\Models\Image;

class Card extends Model
{
    protected $fillable = ['title', 'description', 'column_id'];

    public function column()
    {
        return $this->belongsTo(Column::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }
}
