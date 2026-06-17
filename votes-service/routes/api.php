<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VoteController;

// Endpoints internos (sin auth): llamados por reports-service
Route::get('/votes/counts', [VoteController::class, 'counts']);
Route::get('/votes/user-voted', [VoteController::class, 'userVoted']);

// Rutas protegidas: el gateway ya validó el token y pasa X-User-Id
Route::middleware('gateway.auth')->group(function () {
    Route::post('/votes', [VoteController::class, 'store']);
});
