<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GatewayController;

// ====================================================
// RUTAS PÚBLICAS → proxy directo al auth-service
// ====================================================
Route::post('/register',        [GatewayController::class, 'register']);
Route::post('/login',           [GatewayController::class, 'login']);
Route::post('/forgot-password', [GatewayController::class, 'forgotPassword']);

// ====================================================
// RUTAS PROTEGIDAS → el middleware GatewayAuth valida
// el token con auth-service e inyecta X-User-Id
// ====================================================
Route::middleware('gateway.auth')->group(function () {

    // Auth
    Route::get('/user',            [GatewayController::class, 'user']);
    Route::post('/change-password',[GatewayController::class, 'changePassword']);

    // Reports
    Route::get('/reports',         [GatewayController::class, 'reportsList']);
    Route::post('/reports',        [GatewayController::class, 'reportsStore']);
    Route::get('/reports/{id}',    [GatewayController::class, 'reportsShow']);

    // Votes
    Route::post('/votes',          [GatewayController::class, 'votesStore']);

    // Comments
    Route::get('/reports/{id}/comments', [GatewayController::class, 'commentsList']);
    Route::post('/comments',       [GatewayController::class, 'commentsStore']);
});
