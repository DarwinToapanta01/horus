<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\CommentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// api.php simplificado
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);
    Route::post('/votes', [VoteController::class, 'store']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::get('/reports/{id}/comments', [CommentController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
});
