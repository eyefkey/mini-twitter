<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        Log::info('Login attempt', ['email' => $request->email]);

        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            Log::error('Login validation failed', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            Log::warning('Login failed - invalid credentials', ['email' => $request->email]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        Log::info('Login successful', ['user_id' => $user->id]);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ], 200);
    }
}