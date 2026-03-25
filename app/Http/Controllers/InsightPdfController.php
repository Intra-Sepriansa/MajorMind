<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Services\Insight\AlgorithmicIntelligenceEngine;
use App\Services\Insight\CohortBenchmarkEngine;
use App\Services\Insight\EvidenceJustificationEngine;
use App\Services\Insight\NarrativeInsightEngine;
use App\Services\Insight\PredictiveSuccessEngine;
use App\Services\Insight\PsychometricValidationEngine;
use App\Services\Insight\SensitivityAnalysisEngine;
use Barryvdh\DomPDF\Facade\Pdf;

class InsightPdfController extends Controller
{
    public function exportPdf(
        int $assessment,
        AlgorithmicIntelligenceEngine $algorithmicEngine,
        PsychometricValidationEngine $psychometricEngine,
        EvidenceJustificationEngine $evidenceEngine,
        PredictiveSuccessEngine $predictiveEngine,
        SensitivityAnalysisEngine $sensitivityEngine,
        NarrativeInsightEngine $narrativeEngine,
        CohortBenchmarkEngine $cohortEngine,
    ) {
        $assessment = Assessment::with([
            'user',
            'recommendationResults.major',
        ])->findOrFail($assessment);

        $topRec = $assessment->recommendationResults->first();
        $topMajorId = $topRec?->major_id;

        // Run all 7 engines
        $algorithmic = $algorithmicEngine->analyze($assessment->id);
        $psychometric = $psychometricEngine->validate($assessment->id);
        $evidence = $topMajorId
            ? $evidenceEngine->generate($assessment->id, $topMajorId)
            : null;
        $predictive = $topMajorId
            ? $predictiveEngine->predict($assessment->id, $topMajorId)
            : null;
        $sensitivity = $sensitivityEngine->analyze($assessment->id);
        $narrative = $narrativeEngine->generate($assessment->id);
        $cohort = $cohortEngine->benchmark($assessment->id);

        // Document ID
        $documentId = 'MJM-INS-' . date('Y') . '-' . str_pad($assessment->id, 6, '0', STR_PAD_LEFT);

        // Logo
        $logoPath = public_path('assets/logo-main.png');
        $logoMajormind = file_exists($logoPath)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
            : null;

        $data = [
            'assessment'   => $assessment,
            'user'         => $assessment->user,
            'topRec'       => $topRec,
            'algorithmic'  => $algorithmic,
            'psychometric' => $psychometric,
            'evidence'     => $evidence,
            'predictive'   => $predictive,
            'sensitivity'  => $sensitivity,
            'narrative'    => $narrative,
            'cohort'       => $cohort,
            'documentId'   => $documentId,
            'logoMajormind' => $logoMajormind,
            'generatedAt'  => now()->timezone('Asia/Jakarta'),
            'generatedBy'  => $assessment->user->name ?? 'System',
        ];

        $pdf = Pdf::loadView('pdf.insight-report', $data)
            ->setPaper('a4', 'portrait');

        $filename = 'MajorMind_Insight_' . str_replace(' ', '_', $assessment->user->name ?? 'User') . '_' . date('Ymd_His') . '.pdf';

        return $pdf->download($filename);
    }
}
