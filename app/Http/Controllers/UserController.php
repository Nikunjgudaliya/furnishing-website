<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    // Store a new user (Register)
    public function store(Request $request)
    {
        if (Auth::check()) {
            return redirect('/');
        }

        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('profiles', 'public');
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'image' => $imagePath,
            'status' => false, // Default status is inactive
        ]);

        return redirect()->route('login')->with('success', 'Account created successfully!');
    }

    // Get all users
    public function index()
    {
        $users = User::all()->map(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'image' => $user->image ? asset('storage/' . $user->image) : null,
            ];
        });

        return response()->json($users);
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10420',
        ]);

        $user->username = $request->username;
        $user->email = $request->email;

        if ($request->hasFile('image')) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $imagePath = $request->file('image')->store('profiles', 'public');
            $user->image = $imagePath;
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully!',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'image' => $user->image ? asset('storage/' . $user->image) : null,
            ],
        ]);
    }

    // Delete user
    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $user->delete();
            return response()->json(['message' => 'User deleted successfully']);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    // Login User
    public function login(Request $request)
    {
        if (Auth::check()) {
            return redirect('/');
        }
    
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return back()->withErrors(['email' => 'Invalid credentials']);
        }
    
        // Set user status to active on login
        $user->status = true;
        $user->save();
    
        Auth::login($user);
    
        return redirect('/');
    }
    


    // Logout User
    public function logout(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->status = false; // Set status to inactive
            $user->save();
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    // Get the currently logged-in user
    public function getCurrentUser()
    {
        if (!auth()->check()) {
            return response()->json(null, 200);
        }

        $user = auth()->user();

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'image' => $user->image ? asset('storage/' . $user->image) : null,
            'status' => $user->status,
        ]);
    }

    // Check if email exists
    public function checkEmail(Request $request)
    {
        $exists = User::where('email', $request->email)->exists();
        return response()->json(['exists' => $exists]);
    }

    // Reset password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully!']);
    }
}
