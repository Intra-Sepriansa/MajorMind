<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Major;
use App\Services\Comparison\AlgorithmBreakdownAnalyzer;
use App\Services\Comparison\ComparisonMatrixBuilder;
use App\Services\Comparison\ParetoAnalyzer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ComparisonPdfController extends Controller
{
    public function exportPdf(
        Request $request,
        ComparisonMatrixBuilder $matrixBuilder,
        AlgorithmBreakdownAnalyzer $algoAnalyzer,
        ParetoAnalyzer $paretoAnalyzer,
    ) {
        $request->validate([
            'major_ids' => 'required|array|min:2|max:5',
            'major_ids.*' => 'integer|exists:majors,id',
        ]);

        $majorIds = $request->input('major_ids');

        $assessment = $request->user()
            ->assessments()
            ->whereNull('parent_assessment_id')
            ->latest()
            ->firstOrFail();

        $majors = Major::query()->whereIn('id', $majorIds)->get();

        // Build comparison matrix
        $comparisonMatrix = $matrixBuilder->buildComparisonMatrix(
            $majorIds,
            $assessment->behavioral_profile ?? [],
        );

        // Build spider data
        $spiderData = $matrixBuilder->buildSpiderData(
            $majorIds,
            $assessment->behavioral_profile ?? [],
        );

        // Algorithm breakdown
        $algorithmBreakdown = $algoAnalyzer->analyzeAlgorithmicDifferences(
            $majorIds,
            $assessment->behavioral_profile ?? [],
            $assessment->criterion_weights ?? [],
        );

        // Pareto analysis (default: minat_pribadi vs prospek_karier)
        $paretoAnalysis = $paretoAnalyzer->calculateParetoFrontier(
            $majorIds,
            'minat_pribadi',
            'prospek_karier',
        );

        // Recommendation results keyed by major id
        $recResults = $assessment->recommendationResults()
            ->whereIn('major_id', $majorIds)
            ->get()
            ->keyBy('major_id');

        // Document ID
        $documentId = 'MJM-CMP-' . date('Y') . '-' . str_pad($assessment->id, 6, '0', STR_PAD_LEFT);

        // Logo
        $logoPath = public_path('assets/logo-main.png');
        $logoMajormind = file_exists($logoPath)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
            : null;

        $data = [
            'assessment'          => $assessment,
            'majors'              => $majors,
            'comparisonMatrix'    => $comparisonMatrix,
            'spiderData'          => $spiderData,
            'algorithmBreakdown'  => $algorithmBreakdown,
            'paretoAnalysis'      => $paretoAnalysis,
            'recResults'          => $recResults,
            'documentId'          => $documentId,
            'logoMajormind'       => $logoMajormind,
            'generatedAt'         => now()->timezone('Asia/Jakarta'),
            'generatedBy'         => $request->user()->name ?? 'System',
        ];

        $pdf = Pdf::loadView('pdf.comparison-report', $data)
            ->setPaper('a4', 'landscape');

        $filename = 'MajorMind_Comparison_' . implode('_vs_', $majors->pluck('slug')->toArray()) . '_' . date('Ymd') . '.pdf';

        return $pdf->download($filename);
    }
}
