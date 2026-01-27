<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_id' => 'required|exists:reports,id',
            'user_id'   => 'required|exists:users,id',
            'content'   => 'required|string',
            'parent_id' => 'nullable|exists:comments,id', // Si es una respuesta
        ]);

        $comment = Comment::create($validated);

        return response()->json(['message' => 'Comentario añadido', 'data' => $comment], 201);
    }
}
