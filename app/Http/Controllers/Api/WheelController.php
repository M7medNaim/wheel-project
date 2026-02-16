<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WheelOption;
use App\Models\SpinResult;
use Illuminate\Http\Request;

class WheelController extends Controller
{
    public function options()
    {
        $options = WheelOption::orderBy('order')->get()->map(fn($o) => [
        'text' => $o->text,
        'color' => $o->color,
        'is_win' => (bool)$o->is_win,
        ]);

        if ($options->isEmpty()) {
            return response()->json([
                'options' => [
                    ['text' => 'فوز', 'color' => '#198754', 'is_win' => true],
                    ['text' => 'خسارة', 'color' => '#dc3545', 'is_win' => false],
                ],
            ]);
        }

        return response()->json(['options' => $options]);
    }

    public function stats()
    {
        $count = SpinResult::distinct('participant_id')->count('participant_id');
        $winnersCount = SpinResult::where('is_win', true)->count();
        $last = SpinResult::latest()->first();

        return response()->json([
            'participants_count' => $count,
            'winners_count' => $winnersCount,
            'last_spin_at' => $last ? $last->created_at->format('Y-m-d H:i') : null,
        ]);
    }

    public function spin(Request $request)
    {
        $request->validate([
            'result_index' => 'required|integer|min:0',
            'result_text' => 'required|string',
            'color' => 'required|string|max:20',
            'is_win' => 'required|boolean',
        ]);

        $participantId = session('participant_id');
        $phone = session('participant_phone');

        if (!$participantId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        SpinResult::create([
            'participant_id' => $participantId,
            'phone' => $phone,
            'result_index' => $request->result_index,
            'result_text' => $request->result_text,
            'color' => $request->color,
            'is_win' => $request->is_win,
        ]);

        return response()->json(['success' => true]);
    }
}
