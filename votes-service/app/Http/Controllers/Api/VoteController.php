<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'report_id' => 'required|integer',
            'type'      => 'required|boolean',
            'user_lat'  => 'required|numeric',
            'user_lng'  => 'required|numeric',
        ]);

        $userId = (int) $request->header('X-User-Id');

        // 1. ¿Ya votó en este reporte?
        if (Vote::where('report_id', $request->report_id)->where('user_id', $userId)->exists()) {
            return response()->json(['error' => 'Ya has emitido un voto para este reporte.'], 403);
        }

        // 2. Obtener ubicación del reporte desde reports-service
        $reportsUrl     = config('services.reports_service');
        $reportResponse = Http::get("$reportsUrl/api/reports/{$request->report_id}");

        if (!$reportResponse->successful()) {
            return response()->json(['error' => 'Reporte no encontrado'], 404);
        }

        $report = $reportResponse->json();

        // 3. Validar distancia con fórmula de Haversine (máx 20 km)
        $distance = $this->haversine(
            $request->user_lat, $request->user_lng,
            $report['latitude'], $report['longitude']
        );

        if ($distance > 20) {
            return response()->json(['error' => 'Estás muy lejos para validar este reporte.'], 403);
        }

        // 4. Registrar el voto
        $vote = Vote::create([
            'report_id' => $request->report_id,
            'user_id'   => $userId,
            'type'      => $request->type,
        ]);

        return response()->json(['message' => 'Voto registrado con éxito', 'data' => $vote], 201);
    }

    // Endpoint interno: conteos de votos por reporte (lo llama reports-service)
    public function counts(Request $request)
    {
        $reportIds = $request->input('report_ids', []);

        $counts = Vote::whereIn('report_id', $reportIds)
            ->selectRaw('report_id,
                SUM(CASE WHEN type = true  THEN 1 ELSE 0 END) AS confirms,
                SUM(CASE WHEN type = false THEN 1 ELSE 0 END) AS rejects')
            ->groupBy('report_id')
            ->get();

        return response()->json(['data' => $counts]);
    }

    // Endpoint interno: IDs de reportes en los que ya votó un usuario
    public function userVoted(Request $request)
    {
        $userId    = $request->input('user_id');
        $reportIds = $request->input('report_ids', []);

        $voted = Vote::where('user_id', $userId)
            ->whereIn('report_id', $reportIds)
            ->pluck('report_id')
            ->toArray();

        return response()->json(['data' => $voted]);
    }

    // Fórmula de Haversine
    private function haversine($lat1, $lon1, $lat2, $lon2): float
    {
        $R    = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a    = sin($dLat / 2) ** 2
              + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;
        return $R * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}
