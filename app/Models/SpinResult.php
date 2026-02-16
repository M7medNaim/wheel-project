<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpinResult extends Model
{
    protected $fillable = ['participant_id', 'phone', 'result_index', 'result_text', 'color', 'is_win'];

    protected $casts = [
        'is_win' => 'boolean',
    ];

    public function participant()
    {
        return $this->belongsTo(Participant::class);
    }
}
