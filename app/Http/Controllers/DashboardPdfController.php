<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class DashboardPdfController extends Controller
{
    public function exportPdf(Request $request, int $assessment)
    {
        $assessment = Assessment::with(['user', 'topMajor', 'recommendationResults.major'])
            ->findOrFail($assessment);

        $compareTarget = null;
        if ($request->has('compare_to')) {
            $compareTarget = Assessment::with(['topMajor'])
                ->where('user_id', $assessment->user_id)
                ->find($request->input('compare_to'));
        }

        // Document ID
        $documentId = 'MJM-DSH-' . date('Y') . '-' . str_pad($assessment->id, 6, '0', STR_PAD_LEFT);

        // Behavioral profile data
        $behavioralProfile = $assessment->behavioral_profile ?? [];

        // Psychometric profile data
        $psychometricProfile = $assessment->psychometric_profile ?? [];

        // Criterion weights
        $criterionWeights = $assessment->criterion_weights ?? [];
        $criterionOrder = $assessment->criterion_order ?? array_keys($criterionWeights);

        // Summary data
        $summary = $assessment->summary ?? [];

        // Top 10 recommendations
        $recommendations = $assessment->recommendationResults->take(10);
        $topRecommendation = $recommendations->first();

        // Logo
        $logoPath = public_path('assets/logo-main.png');
        $logoMajormind = file_exists($logoPath)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
            : null;

        $data = [
            'assessment'          => $assessment,
            'user'                => $assessment->user,
            'behavioralProfile'   => $behavioralProfile,
            'psychometricProfile' => $psychometricProfile,
            'criterionWeights'    => $criterionWeights,
            'criterionOrder'      => $criterionOrder,
            'summary'             => $summary,
            'recommendations'     => $recommendations,
            'topRecommendation'   => $topRecommendation,
            'documentId'          => $documentId,
            'logoMajormind'       => $logoMajormind,
            'generatedAt'         => now()->timezone('Asia/Jakarta'),
            'generatedBy'         => $assessment->user->name ?? 'System',
            'consistencyRatio'    => (float) $assessment->consistency_ratio,
            'compareTarget'       => $compareTarget,
        ];

        $pdf = Pdf::loadView('pdf.dashboard-report', $data)
            ->setPaper('a4', 'portrait');

        $filename = 'MajorMind_Report_' . str_replace(' ', '_', $assessment->user->name ?? 'User') . '_' . date('Ymd_His') . '.pdf';

        return $pdf->download($filename);
    }
}
