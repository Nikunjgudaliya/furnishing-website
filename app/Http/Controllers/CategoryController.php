<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:categories,name']);
    
        $category = Category::create(['name' => $request->name]);
    
        return response()->json([
            'success' => true,
            'category' => $category
        ]);
    }

    public function index()
    {
        return Inertia::render('ProductSection', [
            'categories' => Category::with('subcategories')->get()
        ]);
    }

    public function getSubcategories($categoryId) {
    $category = Category::with('subcategories')->find($categoryId);

    if (!$category) {
        return response()->json(['error' => 'Category not found'], 404);
    }

    return response()->json([
        'success' => true,
        'subcategories' => $category->subcategories
    ]);
}

}

