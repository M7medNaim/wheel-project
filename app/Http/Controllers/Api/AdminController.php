<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WheelOption;
use App\Models\SpinResult;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getOptions()
    {
        $options = WheelOption::orderBy('order')->get();
        return response()->json([
            'options' => $options->map(fn($o) => [
                'text' => $o->text,
                'color' => $o->color,
                'is_win' => (bool)$o->is_win,
                'is_enabled' => (bool)($o->is_enabled ?? true),
            ]),
        ]);
    }

    public function saveOptions(Request $request)
    {
        $request->validate([
            'options' => 'required|array',
            'options.*.text' => 'required|string|max:100',
            'options.*.color' => 'required|string|max:20',
            'options.*.is_win' => 'boolean',
            'options.*.is_enabled' => 'boolean',
        ]);

        WheelOption::query()->delete();

        foreach ($request->options as $i => $opt) {
            WheelOption::create([
                'text' => $opt['text'],
                'color' => $opt['color'],
                'is_win' => $opt['is_win'] ?? false,
                'is_enabled' => $opt['is_enabled'] ?? true,
                'order' => $i,
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function participants()
    {
        // Fetch spin results with participant info
        $results = SpinResult::with('participant')
            ->latest()
            ->get()
            ->map(fn($r) => [
        'id' => $r->id,
        'phone' => $r->phone,
        'result_text' => $r->result_text,
        'color' => $r->color,
        'is_win' => (bool)$r->is_win,
        'created_at' => $r->created_at->setTimezone('Europe/Istanbul')->format('Y-m-d H:i'),
        ]);

        return response()->json(['participants' => $results]);
    }

    public function resetParticipantSpin(int $spinResultId)
    {
        $result = SpinResult::query()->findOrFail($spinResultId);

        SpinResult::query()
            ->where('participant_id', $result->participant_id)
            ->delete();

        return response()->json(['success' => true]);
    }
}
