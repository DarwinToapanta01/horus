<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Models\User;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Endpoint interno: el api-gateway llama aquí para validar un token Bearer
// y obtener el usuario. Usa Sanctum directamente.
Route::middleware('auth:sanctum')->get('/validate-token', function (Request $request) {
    return response()->json(['user' => $request->user()]);
});

// Rutas protegidas por el gateway (reciben X-User-Id en header)
Route::post('/change-password', [AuthController::class, 'changePassword']);
Route::get('/user', function (Request $request) {
    $userId = $request->header('X-User-Id');
    return response()->json(User::findOrFail($userId));
});
