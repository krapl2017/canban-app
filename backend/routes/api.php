<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\ColumnController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\ImageController;

Route::get('/boards', [BoardController::class, 'index']);
Route::post('/boards', [BoardController::class, 'store']);
Route::get('/boards/{id}', [BoardController::class, 'show']);
Route::delete('/boards/{id}', [BoardController::class, 'destroy']);

Route::post('/columns', [ColumnController::class, 'store']);
Route::put('/columns/{id}', [ColumnController::class, 'update']);
Route::delete('/columns/{id}', [ColumnController::class, 'destroy']);

Route::post('/cards', [CardController::class, 'store']);
Route::put('/cards/{id}', [CardController::class, 'update']);
Route::delete('/cards/{id}', [CardController::class, 'destroy']);

Route::post('/cards/{id}/images', [ImageController::class, 'store']);
Route::delete('/images/{id}', [ImageController::class, 'destroy']);