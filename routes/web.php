<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
})->name('index');

Route::post('/participant/login', [\App\Http\Controllers\ParticipantController::class , 'login'])->name('participant.login');
Route::get('/participant/logout', [\App\Http\Controllers\ParticipantController::class , 'logout'])->name('participant.logout');

Route::group(['middleware' => ['web']], function () {
    Route::get('/wheel', function () {
            if (!session()->has('participant_id')) {
                return redirect()->route('index');
            }
            $options = \App\Models\WheelOption::query()
                ->orderBy('order')
                ->get()
                ->map(fn($o) => [
                    'text' => $o->text,
                    'color' => $o->color,
                    'is_win' => (bool)$o->is_win,
                    'is_enabled' => (bool)($o->is_enabled ?? true),
                ])
                ->values()
                ->all();

            if (empty($options)) {
                $options = [
                    ['text' => 'فوز', 'color' => '#198754', 'is_win' => true],
                    ['text' => 'خسارة', 'color' => '#dc3545', 'is_win' => false],
                ];
            }

            return view('wheel', ['initialOptions' => $options]);
        }
        )->name('wheel');

        // Public Wheel API (needs session for spin)
        Route::get('/api/wheel/options', [\App\Http\Controllers\Api\WheelController::class , 'options']);
        Route::get('/api/stats', [\App\Http\Controllers\Api\WheelController::class , 'stats']);
        Route::post('/api/spin', [\App\Http\Controllers\Api\WheelController::class , 'spin']);    });

Route::group(['prefix' => 'admin'], function () {
    Route::get('/login', function () {
            return view('admin.login');
        }
        )->name('login');

        Route::post('/login', [\App\Http\Controllers\AdminAuthController::class , 'login'])->name('admin.login.submit');
        Route::post('/logout', [\App\Http\Controllers\AdminAuthController::class , 'logout'])->name('logout');

        Route::middleware('auth')->group(function () {
            Route::get('/', function () {
                    return view('admin.dashboard');
                }
                )->name('admin.dashboard');

                // Admin Management API
                Route::get('/api/options', [\App\Http\Controllers\Api\AdminController::class , 'getOptions']);
                Route::post('/api/options', [\App\Http\Controllers\Api\AdminController::class , 'saveOptions']);
                Route::get('/api/participants', [\App\Http\Controllers\Api\AdminController::class , 'participants']);
                Route::delete('/api/participants/{spinResultId}', [\App\Http\Controllers\Api\AdminController::class , 'resetParticipantSpin']);
            }
            );        });
