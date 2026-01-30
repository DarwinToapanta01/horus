<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $reports = Report::withCount([
            'votes as confirms' => function ($query) {
                $query->where('type', true);
            },
            'votes as rejects' => function ($query) {
                $query->where('type', false);
            }
        ])
            ->where('status', 'active')
            ->get()
            ->map(function ($report) use ($user) {
                $createdAt = Carbon::parse($report->created_at);

                //Calculamos si ya pasaron 48 horas
                $report->is_expired = $createdAt->diffInHours(Carbon::now()) >= 48;
                $report->formatted_date = $createdAt->format('d/m/Y H:i');
                $report->user_has_voted = $user
                    ? $report->votes()->where('user_id', $user->id)->exists()
                    : false;

                return $report;
            });

        // Solo enviar reportes que NO hayan expirado y que aún no tengan suficientes votos
        return response()->json($reports);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'latitude'     => 'required|numeric',
            'longitude'    => 'required|numeric',
            'radius'       => 'required|integer|min:100|max:5000',
            'danger_level' => 'required|integer|min:0|max:100',
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

    public function show($id)
    {
        try {
            // Buscamos el reporte con sus conteos de votos
            $report = Report::withCount([
                'votes as confirms' => function ($query) {
                    $query->where('type', true);
                },
                'votes as rejects' => function ($query) {
                    $query->where('type', false);
                }
            ])->find($id);

            if (!$report) {
                return response()->json(['message' => 'Reporte no encontrado'], 404);
            }

            return response()->json($report);
        } catch (\Exception $e) {
            // Esto nos ayudará a ver el error real en los logs de Laravel si falla
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
