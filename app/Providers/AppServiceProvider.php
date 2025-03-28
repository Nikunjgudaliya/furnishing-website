<?php

namespace App\Providers;
use App\Models\Category;
use Inertia\Inertia;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot() {
        Inertia::share([
            'categories' => Category::all(),
        ]);
    }
}
