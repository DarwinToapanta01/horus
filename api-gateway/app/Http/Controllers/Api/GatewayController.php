<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GatewayController extends Controller
{
    // ─── Auth (público) ───────────────────────────────────────────────────────

    public function register(Request $request): JsonResponse
    {
        return $this->proxy('POST', config('services.auth_service') . '/api/register', $request);
    }

    public function login(Request $request): JsonResponse
    {
        return $this->proxy('POST', config('services.auth_service') . '/api/login', $request);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        return $this->proxy('POST', config('services.auth_service') . '/api/forgot-password', $request);
    }

    // ─── Auth (protegido) ─────────────────────────────────────────────────────

    public function user(Request $request): JsonResponse
    {
        return $this->proxyWithUser('GET', config('services.auth_service') . '/api/user', $request);
    }

    public function changePassword(Request $request): JsonResponse
    {
        return $this->proxyWithUser('POST', config('services.auth_service') . '/api/change-password', $request);
    }

    // ─── Reports ──────────────────────────────────────────────────────────────

    public function reportsList(Request $request): JsonResponse
    {
        return $this->proxyWithUser('GET', config('services.reports_service') . '/api/reports', $request);
    }

    public function reportsStore(Request $request): JsonResponse
    {
        return $this->proxyWithUser('POST', config('services.reports_service') . '/api/reports', $request);
    }

    public function reportsShow(Request $request, $id): JsonResponse
    {
        return $this->proxyWithUser('GET', config('services.reports_service') . "/api/reports/$id", $request);
    }

    // ─── Votes ────────────────────────────────────────────────────────────────

    public function votesStore(Request $request): JsonResponse
    {
        return $this->proxyWithUser('POST', config('services.votes_service') . '/api/votes', $request);
    }

    // ─── Comments ─────────────────────────────────────────────────────────────

    public function commentsList(Request $request, $id): JsonResponse
    {
        return $this->proxyWithUser('GET', config('services.comments_service') . "/api/reports/$id/comments", $request);
    }

    public function commentsStore(Request $request): JsonResponse
    {
        return $this->proxyWithUser('POST', config('services.comments_service') . '/api/comments', $request);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    // Proxy sin autenticación (rutas públicas)
    private function proxy(string $method, string $url, Request $request): JsonResponse
    {
        $response = Http::withHeaders(['Accept' => 'application/json'])
            ->send($method, $url, ['json' => $request->all()]);

        return response()->json($response->json(), $response->status());
    }

    // Proxy con headers de usuario inyectados por GatewayAuth middleware
    private function proxyWithUser(string $method, string $url, Request $request): JsonResponse
    {
        $response = Http::withHeaders([
            'Accept'       => 'application/json',
            'X-User-Id'   => $request->header('X-User-Id'),
            'X-User-Name' => $request->header('X-User-Name'),
        ])->send($method, $url, ['json' => $request->all()]);

        return response()->json($response->json(), $response->status());
    }
}
