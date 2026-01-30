<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Obtener comentarios de un reporte específico
    public function index($reportId)
    {
        $comments = Comment::with('user:id,name') // Solo traemos id y nombre del usuario
            ->where('report_id', $reportId)
            ->latest() // Los más recientes primero
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_id' => 'required|exists:reports,id',
            'content'   => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // El user_id se toma automáticamente del usuario autenticado
        $comment = Comment::create([
            'report_id' => $validated['report_id'],
            'user_id'   => $request->user()->id,
            'content'   => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        // Cargamos la relación del usuario para devolver el comentario completo al frontend
        $comment->load('user:id,name');

        return response()->json([
            'message' => 'Comentario añadido',
            'data'    => $comment
        ], 201);
    }
}
