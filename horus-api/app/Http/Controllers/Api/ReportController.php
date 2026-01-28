<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        // Obtenemos los reportes con sus contadores de votos
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

        // RETORNAMOS la variable que procesamos
        return response()->json($reports);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'latitude'     => 'required|numeric',
            'longitude'    => 'required|numeric',
            'radius'       => 'required|integer|min:3000|max:5000',
            'danger_level' => 'required|integer|in:0,50,100',
            'description'  => 'required|string|max:500',
        ]);

        // No pidas 'user_id' en el body por seguridad, tómalo del token
        $report = Report::create(array_merge(
            $validated,
            ['user_id' => $request->user()->id]
        ));

        return response()->json([
            'message' => 'Reporte creado con éxito',
            'data'    => $report
        ], 201);
    }
}
