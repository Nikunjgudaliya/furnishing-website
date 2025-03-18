<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'category_id' => 'required|exists:categories,id'
    ]);

    Subcategory::create([
        'name' => $request->name,
        'category_id' => $request->category_id
    ]);

    return redirect()->back()->with([
        'success' => 'Subcategory added successfully!'
    ]);
}

    

}

