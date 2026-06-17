<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $userId    = (int) $request->header('X-User-Id');
        $reports   = Report::where('status', 'active')->get();
        $reportIds = $reports->pluck('id')->toArray();

        // Pedir conteos de votos al votes-service
        $votesUrl = config('services.votes_service');
        $countsResponse = Http::get("$votesUrl/api/votes/counts", ['report_ids' => $reportIds]);
        $counts = $countsResponse->successful() ? collect($countsResponse->json('data', [])) : collect();

        // Pedir qué reportes ya votó este usuario
        $userVotedResponse = Http::get("$votesUrl/api/votes/user-voted", [
            'user_id'    => $userId,
            'report_ids' => $reportIds,
        ]);
        $userVotedIds = $userVotedResponse->successful() ? $userVotedResponse->json('data', []) : [];

        $mapped = $reports->map(function ($report) use ($counts, $userVotedIds) {
            $createdAt      = Carbon::parse($report->created_at);
            $count          = $counts->firstWhere('report_id', $report->id);

            $report->confirms       = $count['confirms'] ?? 0;
            $report->rejects        = $count['rejects']  ?? 0;
            $report->is_expired     = $createdAt->diffInHours(Carbon::now()) >= 48;
            $report->formatted_date = $createdAt->format('d/m/Y H:i');
            $report->user_has_voted = in_array($report->id, $userVotedIds);

            return $report;
        });

        return response()->json($mapped);
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

        // user_id viene del header inyectado por el gateway
        $report = Report::create(array_merge($validated, [
            'user_id' => (int) $request->header('X-User-Id'),
            'status'  => 'active',
        ]));

        return response()->json(['message' => 'Reporte creado con éxito', 'data' => $report], 201);
    }

    // Este endpoint también lo usan internamente votes-service y comments-service
    public function show($id)
    {
        $report = Report::find($id);

        if (!$report) {
            return response()->json(['message' => 'Reporte no encontrado'], 404);
        }

        return response()->json($report);
    }
}
