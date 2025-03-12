<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function store(Request $request){
        Product::create([
            'productname' => $request->username,
            'description' => $request->descreption,
            'price' => $request->price,
            'category'=> $request->category,
        ]);
    }
}
