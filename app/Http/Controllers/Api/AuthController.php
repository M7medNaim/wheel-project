<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $v = Validator::make($request->all(), [
            'phone' => 'required|string|regex:/^05[0-9]{8}$/',
        ], [
            'phone.regex' => 'رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام',
        ]);

        if ($v->fails()) {
            return response()->json(['message' => $v->errors()->first()], 422);
        }

        $phone = $request->phone;
        $participant = Participant::firstOrCreate(
            ['phone' => $phone],
            ['phone' => $phone]
        );

        $token = $participant->createToken('wheel')->plainTextToken;

        return response()->json([
            'token' => $token,
            'phone' => $phone,
        ]);
    }
}
