<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ParticipantController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^\+[0-9]{7,15}$/'],
        ]);

        $participant = Participant::where('phone', $request->phone)->first();

        if ($participant && $participant->spinResults()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'عذراً، هذا الرقم شارك بالفعل في السحب.'
            ], 422);
        }

        if (!$participant) {
            $participant = Participant::create([
                'phone' => $request->phone,
            ]);
        }

        // Use standard Laravel session for participant login
        Session::put('participant_id', $participant->id);
        Session::put('participant_phone', $participant->phone);

        return response()->json([
            'success' => true,
            'phone' => $participant->phone,
            'message' => 'تم تسجيل الدخول بنجاح'
        ]);
    }

    public function logout()
    {
        Session::forget(['participant_id', 'participant_phone']);
        return redirect()->route('index');
    }
}
