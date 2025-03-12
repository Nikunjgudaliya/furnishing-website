<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use Inertia\Inertia;

// Public Pages
Route::get('/', fn() => Inertia::render('Home'));
Route::get('/discover', fn() => Inertia::render('Discover'));
Route::get('/about', fn() => Inertia::render('About'));
Route::get('/contact', fn() => Inertia::render('Contact'));
Route::get('/login', fn() => Inertia::render('Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Register'));
Route::get('/admin', fn() => Inertia::render('Admin'));
Route::get('/forget', fn() => Inertia::render('ForgetPassword'));

// User Management
Route::get('/users', [UserController::class, 'index']);
Route::post('/register', [UserController::class, 'store']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::put('/users/{id}', [UserController::class, 'update']);

// Password Management
Route::get('/check-email', [UserController::class, 'checkEmail']);
Route::post('/reset-password', [UserController::class, 'resetPassword']);
