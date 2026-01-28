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
    // Pantalla image_af334f.png (Registro)
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // Valida que coincida con confirm_password
        ]);

        $user = User::create([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'reputation_points' => 0,
        ]);

        return response()->json([
            'message' => 'Usuario creado con éxito',
            'user' => $user
        ], 201);
    }

    // Pantalla image_b933b1.png (Login)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Validación: Si no existe o la clave es incorrecta
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Las credenciales son incorrectas o el usuario no existe.'
            ], 401);
        }

        // Creamos el token para la sesión distribuida
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // 1. Generar clave temporal (8 caracteres aleatorios)
        $tempPassword = Str::random(8);

        // 2. Actualizar al usuario en la base de datos
        $user->password = Hash::make($tempPassword);
        $user->save();

        // 3. Enviar el correo (Pasamos la clave en texto plano SOLO al mail)
        Mail::to($user->email)->send(new RecuperarPasswordMail($user, $tempPassword));

        return response()->json(['message' => 'Se ha enviado una clave temporal a su correo.']);
    }
    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user(); // Laravel identifica al usuario por el token
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
