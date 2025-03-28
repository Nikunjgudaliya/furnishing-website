<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubcategoryController;
use Inertia\Inertia;

// Public Pages
Route::get('/', function () {
    return Inertia::render('Home', [
        'user' => auth()->check() ? auth()->user() : null,
    ]);
});

Route::get('/discover', fn() => Inertia::render('Discover'));
Route::get('/about', fn() => Inertia::render('About'));
Route::get('/contact', fn() => Inertia::render('Contact'));
Route::get('/admin', fn() => Inertia::render('Admin'));
Route::get('/forget', fn() => Inertia::render('ForgetPassword'));

// Restrict login and register if already logged in
Route::middleware('guest')->group(function () {
    Route::get('/login', fn() => Inertia::render('Login'))->name('login');
    Route::get('/register', fn() => Inertia::render('Register'));
});

// User Management
Route::get('/users', [UserController::class, 'index']);
Route::post('/register', [UserController::class, 'store']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth');
Route::put('/users/{id}', [UserController::class, 'update']);
Route::get('/current-user', [UserController::class, 'getCurrentUser']);

// Password Management
Route::get('/check-email', [UserController::class, 'checkEmail']);
Route::post('/reset-password', [UserController::class, 'resetPassword']);


Route::post('/products', [ProductController::class, 'store']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/create', [ProductController::class, 'create']);
Route::get('/discover', [ProductController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);

Route::post('/subcategories', [SubcategoryController::class, 'store']);
Route::get('/categories/{id}/subcategories', [CategoryController::class, 'getSubcategories']);



