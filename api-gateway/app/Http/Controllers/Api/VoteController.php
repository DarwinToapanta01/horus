<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use App\Models\Report;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'report_id' => 'required|exists:reports,id',
            'type'      => 'required|boolean',
            'user_lat'  => 'required|numeric',
            'user_lng'  => 'required|numeric',
        ]);

        $user = $request->user();

        // 1. COMPROBACIÓN: ¿Ya votó por este reporte?
        $exists = Vote::where('report_id', $request->report_id)
            ->where('user_id', $user->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'error' => 'Ya has emitido un voto para este reporte. No puedes votar dos veces.'
            ], 403);
        }

        $report = Report::find($request->report_id);

        // 2. Validación de distancia
        $distance = $this->calculateDistance(
            $request->user_lat,
            $request->user_lng,
            $report->latitude,
            $report->longitude
        );

        if ($distance > 20) {
            return response()->json(['error' => 'Estás muy lejos para validar este reporte.'], 403);
        }

        // 3. Crear el voto (ya sabemos que no existe)
        $vote = Vote::create([
            'report_id' => $request->report_id,
            'user_id'   => $user->id,
            'type'      => $request->type
        ]);

        return response()->json([
            'message' => 'Voto registrado con éxito',
            'data' => $vote
        ], 201);
    }

    // Fórmula de Haversine para calcular distancia en KM
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }
}
