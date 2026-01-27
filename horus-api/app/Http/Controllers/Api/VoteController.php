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
            'user_id'   => 'required|exists:users,id',
            'type'      => 'required|boolean', // true = SI, false = NO
            'user_lat'  => 'required|numeric',
            'user_lng'  => 'required|numeric',
        ]);

        $report = Report::find($request->report_id);

        // --- Lógica de Cercanía (Máximo 20km para considerar "Misma Ciudad") ---
        $distance = $this->calculateDistance(
            $request->user_lat,
            $request->user_lng,
            $report->latitude,
            $report->longitude
        );

        if ($distance > 20) {
            return response()->json([
                'error' => 'Estás muy lejos. Solo puedes votar en reportes de tu propia ciudad.'
            ], 403);
        }

        // --- Guardar o actualizar el voto (evita duplicados) ---
        $vote = Vote::updateOrCreate(
            ['report_id' => $request->report_id, 'user_id' => $request->user_id],
            ['type' => $request->type]
        );

        return response()->json([
            'message' => 'Voto registrado con éxito',
            'data' => $vote
        ]);
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
