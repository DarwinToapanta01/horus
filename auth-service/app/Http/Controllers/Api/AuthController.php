<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\RecuperarPasswordMail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username'  => 'required|string|max:255|unique:users',
            'email'     => 'required|string|email|max:255|unique:users',
            'password'  => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'              => $request->name,
            'last_name'         => $request->last_name,
            'username'          => $request->username,
            'email'             => $request->email,
            'password'          => Hash::make($request->password),
            'reputation_points' => 0,
        ]);

        return response()->json(['message' => 'Usuario creado con éxito', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Las credenciales son incorrectas.'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $tempPassword = Str::random(8);
        $user->password = Hash::make($tempPassword);
        $user->save();

        Mail::to($user->email)->send(new RecuperarPasswordMail($user, $tempPassword));

        return response()->json(['message' => 'Se ha enviado una clave temporal a su correo.']);
    }

    // Llamado por el gateway DESPUÉS de que este mismo valida el token vía /validate-token
    // El X-User-Id viene inyectado por el gateway en el header
    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($request->header('X-User-Id'));
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
