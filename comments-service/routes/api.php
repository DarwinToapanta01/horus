<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CommentController;

// Ruta pública (interna)
Route::get('/reports/{reportId}/comments', [CommentController::class, 'index']);

// Rutas protegidas: el gateway ya validó el token y pasa X-User-Id
Route::middleware('gateway.auth')->group(function () {
    Route::post('/comments', [CommentController::class, 'store']);
});
