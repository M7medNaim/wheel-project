<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Participant extends Model
{
    protected $fillable = ['phone'];

    public function spinResults()
    {
        return $this->hasMany(SpinResult::class);
    }
}
