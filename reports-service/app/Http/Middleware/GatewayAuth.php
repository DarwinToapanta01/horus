<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GatewayAuth
{
    // Los servicios internos solo verifican que el gateway haya inyectado X-User-Id
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->header('X-User-Id')) {
            return response()->json(['error' => 'Acceso no autorizado. Solo el gateway puede llamar a este servicio.'], 401);
        }

        return $next($request);
    }
}
