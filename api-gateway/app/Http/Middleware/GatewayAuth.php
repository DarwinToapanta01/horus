<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class GatewayAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token de autenticación requerido'], 401);
        }

        try {
            // Valida el token con auth-service usando el endpoint /validate-token (auth:sanctum)
            $authUrl  = config('services.auth_service');
            $response = Http::withToken($token)->get("$authUrl/api/validate-token");

            if (!$response->successful()) {
                return response()->json(['error' => 'Token inválido o expirado'], 401);
            }

            $user = $response->json('user');

            // Inyecta la identidad del usuario para los microservicios internos
            $request->headers->set('X-User-Id',   $user['id']);
            $request->headers->set('X-User-Name', $user['name']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Servicio de autenticación no disponible'], 503);
        }

        return $next($request);
    }
}
