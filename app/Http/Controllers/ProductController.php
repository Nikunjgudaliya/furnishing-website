<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller {

    public function index()
    {
        $categories = Category::with('subcategories', 'products.images')->get();
        return inertia('Discover', ['categories' => $categories]);
    }

    public function create() {
        $categories = Category::all();
        return Inertia::render('ProductSection', ['categories' => $categories]);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required',
        'description' => 'required',
        'price' => 'required|numeric',
        'category_id' => 'required',
        'subcategory_id' => 'nullable|exists:subcategories,id',
        'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
    ]);

    $product = Product::create($validated);

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $path = $image->store('products', 'public');
            ProductImage::create(['product_id' => $product->id, 'image_path' => $path]);
        }
    }

    return redirect()->back()->with('success', 'Product added successfully');
}


    
}
