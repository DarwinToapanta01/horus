<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validar los datos que vienen del mapa
        $validated = $request->validate([
            'user_id'      => 'required|exists:users,id',
            'latitude'     => 'required|numeric',
            'longitude'    => 'required|numeric',
            'radius'       => 'required|integer|min:3000|max:5000',
            'danger_level' => 'required|integer|in:0,50,100',
            'description'  => 'required|string|max:500',
        ]);

        // 2. Crear el reporte en la base de datos
        $report = Report::create($validated);

        // 3. Responder con el reporte creado (esto lo usará React para avisar a Node.js)
        return response()->json([
            'message' => 'Reporte creado con éxito',
            'data'    => $report
        ], 201);
    }

    public function index()
    {
        // Obtenemos los reportes activos incluyendo el conteo de votos tipo true (si) y false (no)
        $reports = Report::withCount([
            'votes as confirms' => function ($query) {
                $query->where('type', true);
            },
            'votes as rejects' => function ($query) {
                $query->where('type', false);
            }
        ])
            ->where('status', 'active')
            ->get();

        return response()->json(Report::where('status', 'active')->get());
    }
}
