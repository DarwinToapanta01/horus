<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CommentController extends Controller
{
    public function index($reportId)
    {
        $comments = Comment::where('report_id', $reportId)->latest()->get();
        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_id' => 'required|integer',
            'content'   => 'required|string|max:1000',
            'parent_id' => 'nullable|integer|exists:comments,id',
        ]);

        // Verificar que el reporte exista en reports-service
        $reportsUrl     = config('services.reports_service');
        $reportResponse = Http::get("$reportsUrl/api/reports/{$validated['report_id']}");

        if (!$reportResponse->successful()) {
            return response()->json(['error' => 'Reporte no encontrado'], 404);
        }

        $comment = Comment::create([
            'report_id' => $validated['report_id'],
            'user_id'   => (int) $request->header('X-User-Id'),
            'user_name' => $request->header('X-User-Name', 'Usuario'),
            'content'   => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return response()->json(['message' => 'Comentario añadido', 'data' => $comment], 201);
    }
}
