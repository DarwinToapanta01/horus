<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReportController;

// Rutas públicas (internas: usadas por votes-service y comments-service)
Route::get('/reports/{id}', [ReportController::class, 'show']);

// Rutas protegidas: el gateway ya validó el token y pasa X-User-Id
Route::middleware('gateway.auth')->group(function () {
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);
});
