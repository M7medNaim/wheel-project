<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WheelOption extends Model
{
    protected $fillable = ['text', 'color', 'is_win', 'is_enabled', 'order'];

    protected $casts = [
        'is_win' => 'boolean',
        'is_enabled' => 'boolean',
    ];
}
