<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VoteController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rutas Públicas (Cualquiera puede ver el mapa)

Route::get('/reports', [ReportController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//valide que el usuario está en la misma ciudad
Route::post('/votes', [VoteController::class, 'store']);


// Rutas Protegidas (Solo logueados pueden reportar o votar)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reports', [ReportController::class, 'store']);
    Route::post('/votes', [VoteController::class, 'store']);
});