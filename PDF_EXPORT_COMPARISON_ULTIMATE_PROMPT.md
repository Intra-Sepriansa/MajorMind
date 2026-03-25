# 📄 MAJORMIND PDF EXPORT - COMPARISON MODULE: ULTIMATE PROMPT
## Professional Comparative Analysis Report with Multi-Dimensional Matrix

---

## 📖 DOCUMENT PURPOSE

Comprehensive prompt for implementing professional PDF export for the MajorMind Comparison Module. The PDF will feature side-by-side major comparison across 50+ dimensions with professional design, data tables, Pareto charts, and trade-off analysis optimized for print format.

---

## 🎯 PDF DESIGN OBJECTIVES

1. **Comparative Matrix Layout**: Side-by-side comparison of up to 5 majors
2. **Multi-Dimensional Analysis**: 50+ attributes across 7 categories
3. **Visual Trade-Offs**: Pareto frontier charts, spider plots
4. **Gap Analysis Tables**: Detailed competency gap breakdown
5. **Algorithm Breakdown**: Show how each algorithm ranks differently
6. **Decision Matrix**: Weighted scoring with adjustable priorities
7. **Professional Formatting**: Landscape A4 for wide tables

---

## 🏗️ PDF STRUCTURE: 6-PAGE LANDSCAPE REPORT

### PAGE 1: Cover & Comparison Overview
### PAGE 2-3: Multi-Dimensional Comparison Matrix (50+ attributes)
### PAGE 3-4: Algorithmic Breakdown & Consensus Analysis
### PAGE 5: Pareto Frontier & Trade-Off Visualization
### PAGE 6: Decision Recommendation & Signatures

---

## 💻 BACKEND IMPLEMENTATION

```php
// app/Http/Controllers/ComparisonController.php
<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;

class ComparisonController extends Controller
{
    public function exportPdf(Request $request)
    {
        $majorIds = $request->input('major_ids'); // Array of selected major IDs
        $assessmentId = $request->input('assessment_id');
        
        $assessment = Assessment::with('psychometricProfile')->findOrFail($assessmentId);
        $majors = Major::with(['criteria', 'universities'])->whereIn('id', $majorIds)->get();
        
        // Generate comparison matrix
        $comparisonMatrix = app(ComparisonMatrixBuilder::class)
            ->buildComparisonMatrix($majorIds, $assessment->psychometricProfile->toArray());
        
        // Generate algorithm breakdown
        $algorithmBreakdown = app(AlgorithmBreakdownAnalyzer::class)
            ->analyzeAlgorithmicDifferences($majors->toArray(), $assessment->psychometricProfile->toArray());
        
        // Generate Pareto analysis
        $paretoAnalysis = app(ParetoAnalyzer::class)
            ->calculateParetoFrontier($majors->toArray(), 'prospek_karir_score', 'biaya_kuliah_per_tahun');
        
        // Generate charts
        $paretoChart = $this->generateParetoChart($paretoAnalysis);
        $spiderChart = $this->generateSpiderChart($majors, $assessment->psychometricProfile);
        $algorithmChart = $this->generateAlgorithmBreakdownChart($algorithmBreakdown);
        
        $documentId = 'MJM-CMP-' . date('Y') . '-' . str_pad($assessmentId, 6, '0', STR_PAD_LEFT);
        $qrCode = base64_encode(QrCode::format('png')->size(150)->generate(
            route('comparison.verify', ['id' => $documentId])
        ));
        
        $data = [
            'assessment' => $assessment,
            'majors' => $majors,
            'comparisonMatrix' => $comparisonMatrix,
            'algorithmBreakdown' => $algorithmBreakdown,
            'paretoAnalysis' => $paretoAnalysis,
            'paretoChart' => $paretoChart,
            'spiderChart' => $spiderChart,
            'algorithmChart' => $algorithmChart,
            'documentId' => $documentId,
            'qrCode' => $qrCode,
            'logoMajormind' => $this->getLogoBase64('majormind'),
            'logoUniversity' => $this->getLogoBase64('university'),
            'generatedAt' => now()->timezone('Asia/Jakarta'),
            'generatedBy' => auth()->user()->name ?? 'System'
        ];
        
        $pdf = Pdf::loadView('pdf.comparison-report', $data)
            ->setPaper('a4', 'landscape') // LANDSCAPE for wide tables
            ->setOption('margin-top', '10mm')
            ->setOption('margin-bottom', '12mm')
            ->setOption('margin-left', '10mm')
            ->setOption('margin-right', '10mm');
        
        $filename = 'MajorMind_Comparison_' . implode('_vs_', $majors->pluck('code')->toArray()) . '_' . date('Ymd') . '.pdf';
        
        return $pdf->download($filename);
    }
}
```

---

## 🎨 BLADE TEMPLATE (resources/views/pdf/comparison-report.blade.php)

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>MajorMind Comparison Report</title>
    <style>
        @page { size: A4 landscape; margin: 10mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', 'Helvetica', sans-serif; font-size: 8pt; line-height: 1.3; color: #1a202c; }
        
        /* Header */
        .header { display: table; width: 100%; border-bottom: 2px solid #2c5282; padding-bottom: 8px; margin-bottom: 10px; }
        .header-logo { display: table-cell; width: 50px; vertical-align: middle; }
        .header-logo img { width: 45px; height: auto; }
        .header-text { display: table-cell; vertical-align: middle; text-align: center; padding: 0 10px; }
        .institution-name { font-size: 12pt; font-weight: bold; color: #2c5282; text-transform: uppercase; }
        .system-name { font-size: 11pt; font-weight: bold; margin-top: 2px; }
        .tagline { font-size: 8pt; font-style: italic; color: #4a5568; }
        
        /* Title */
        .title-section { text-align: center; margin: 10px 0; }
        .doc-title { font-size: 13pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; }
        .doc-subtitle { font-size: 9pt; color: #4a5568; margin-top: 3px; }
        
        /* Comparison Overview */
        .overview-grid { display: table; width: 100%; margin: 10px 0; }
        .overview-box { display: table-cell; width: 20%; padding: 8px; border: 1px solid #e2e8f0; text-align: center; background: #f7fafc; }
        .major-name { font-size: 9pt; font-weight: bold; color: #2c5282; margin-bottom: 5px; }
        .major-score { font-size: 14pt; font-weight: bold; color: #2d3748; }
        .major-rank { font-size: 7pt; color: #718096; }
        
        /* Comparison Matrix Table */
        .matrix-table { width: 100%; border-collapse: collapse; font-size: 7pt; margin: 10px 0; }
        .matrix-table th, .matrix-table td { border: 1px solid #cbd5e0; padding: 4px 3px; }
        .matrix-table th { background: #2c5282; color: white; font-weight: bold; text-align: center; }
        .matrix-table .category-header { background: #4a5568; color: white; font-weight: bold; text-align: left; font-size: 8pt; }
        .matrix-table tbody tr:nth-child(even) { background: #f7fafc; }
        .best-value { background: #d1fae5; color: #065f46; font-weight: bold; }
        .worst-value { background: #fee2e2; color: #991b1b; }
        .gap-exceed { color: #059669; font-weight: bold; }
        .gap-deficit { color: #dc2626; font-weight: bold; }
        
        /* Algorithm Breakdown */
        .algo-table { width: 100%; border-collapse: collapse; font-size: 7pt; margin: 10px 0; }
        .algo-table th, .algo-table td { border: 1px solid #cbd5e0; padding: 5px 4px; text-align: center; }
        .algo-table th { background: #1e3a8a; color: white; font-weight: bold; }
        .consensus-high { background: #d1fae5; color: #065f46; }
        .consensus-medium { background: #fef3c7; color: #92400e; }
        .consensus-low { background: #fee2e2; color: #991b1b; }
        
        /* Charts */
        .chart-container { text-align: center; margin: 12px 0; page-break-inside: avoid; }
        .chart-title { font-size: 9pt; font-weight: bold; margin-bottom: 8px; }
        .chart-image { max-width: 100%; height: auto; border: 1px solid #e2e8f0; padding: 8px; }
        
        /* Section Headers */
        .section-header { font-size: 10pt; font-weight: bold; color: #2c5282; border-left: 4px solid #2c5282; padding-left: 8px; margin: 15px 0 8px 0; }
        
        /* Footer */
        .footer { position: fixed; bottom: -10mm; left: 0; right: 0; border-top: 1px solid #e2e8f0; padding-top: 4px; font-size: 6pt; color: #a0aec0; }
        .footer-left { float: left; }
        .footer-right { float: right; }
        
        /* Utilities */
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-logo">
            @if($logoUniversity)
                <img src="{{ $logoUniversity }}" alt="Logo">
            @endif
        </div>
        <div class="header-text">
            <div class="institution-name">MajorMind Decision Support System</div>
            <div class="system-name">Laporan Analisis Komparatif Multi-Dimensi</div>
            <div class="tagline">Perbandingan Mendalam Antar Jurusan dengan 50+ Dimensi Evaluasi</div>
        </div>
        <div class="header-logo">
            @if($logoMajormind)
                <img src="{{ $logoMajormind }}" alt="MajorMind">
            @endif
        </div>
    </div>
    
    <!-- Title -->
    <div class="title-section">
        <h1 class="doc-title">Laporan Perbandingan Jurusan</h1>
        <p class="doc-subtitle">Dokumen ID: {{ $documentId }} | Tanggal: {{ $generatedAt->translatedFormat('d F Y') }}</p>
    </div>
    
    <!-- Comparison Overview -->
    <div class="overview-grid">
        @foreach($majors as $major)
        <div class="overview-box">
            <div class="major-name">{{ $major->name }}</div>
            <div class="major-score">{{ round($major->comparison_score ?? 0, 1) }}%</div>
            <div class="major-rank">Rank #{{ $major->comparison_rank ?? '-' }}</div>
        </div>
        @endforeach
    </div>
    
    <div class="page-break"></div>
    
    <!-- Multi-Dimensional Comparison Matrix -->
    <div class="section-header">📊 Matriks Perbandingan Multi-Dimensi (50+ Atribut)</div>
    
    <table class="matrix-table">
        <thead>
            <tr>
                <th style="width: 150px;">Dimensi</th>
                @if($comparisonMatrix['matrix']['academic']['dimensions']['kesiapan_akademik_threshold']['user_value'])
                <th style="width: 60px;">Nilai Anda</th>
                @endif
                @foreach($majors as $major)
                <th style="width: 80px;">{{ $major->name }}</th>
                @endforeach
                <th style="width: 80px;">Terbaik</th>
            </tr>
        </thead>
        <tbody>
            @foreach($comparisonMatrix['matrix'] as $categoryKey => $category)
            <tr>
                <td colspan="{{ 2 + count($majors) + ($comparisonMatrix['matrix']['academic']['dimensions']['kesiapan_akademik_threshold']['user_value'] ? 1 : 0) }}" 
                    class="category-header">
                    {{ strtoupper($category['category_name']) }}
                </td>
            </tr>
            @foreach($category['dimensions'] as $dimKey => $dimension)
            <tr>
                <td class="font-bold">{{ $dimension['label'] }}</td>
                @if($dimension['user_value'] !== null)
                <td class="text-center" style="background: #ebf8ff;">{{ $dimension['user_value'] }}</td>
                @endif
                @foreach($majors as $major)
                    @php
                        $value = $dimension['values'][$major->id];
                        $isBest = $value['raw'] == max(array_column($dimension['values'], 'raw'));
                        $isWorst = $value['raw'] == min(array_column($dimension['values'], 'raw'));
                    @endphp
                <td class="text-center {{ $isBest ? 'best-value' : ($isWorst ? 'worst-value' : '') }}">
                    {{ $value['formatted'] }}
                    @if($value['gap'] && $value['gap']['value'] !== null)
                        <br><span class="{{ $value['gap']['status'] == 'exceed' ? 'gap-exceed' : 'gap-deficit' }}" style="font-size: 6pt;">
                            ({{ $value['gap']['status'] == 'exceed' ? '+' : '' }}{{ $value['gap']['value'] }})
                        </span>
                    @endif
                </td>
                @endforeach
                <td class="text-center font-bold">{{ $dimension['best_major'] }}</td>
            </tr>
            @endforeach
            @endforeach
        </tbody>
    </table>
    
    <div class="page-break"></div>
    
    <!-- Algorithm Breakdown -->
    <div class="section-header">🔬 Analisis Breakdown Algoritmik</div>
    
    <table class="algo-table">
        <thead>
            <tr>
                <th>Jurusan</th>
                <th>TOPSIS (E)</th>
                <th>Profile Match</th>
                <th>TOPSIS (M)</th>
                <th>ML Predict</th>
                <th>Consensus</th>
                <th>Rank Variance</th>
            </tr>
        </thead>
        <tbody>
            @foreach($algorithmBreakdown['breakdown'] as $majorId => $breakdown)
            <tr>
                <td class="font-bold">{{ $breakdown['major_name'] }}</td>
                @foreach($breakdown['algorithm_scores'] as $algo => $scoreData)
                <td>
                    Rank #{{ $scoreData['rank'] }}<br>
                    <span style="font-size: 6pt;">({{ round($scoreData['normalized_score'] * 100, 1) }})</span>
                </td>
                @endforeach
                <td class="{{ $breakdown['consensus_score'] > 80 ? 'consensus-high' : ($breakdown['consensus_score'] > 60 ? 'consensus-medium' : 'consensus-low') }}">
                    {{ round($breakdown['consensus_score'], 1) }}%
                </td>
                <td>{{ round($breakdown['rank_variance'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    @if($algorithmChart)
    <div class="chart-container">
        <div class="chart-title">Visualisasi Perbandingan Algoritma</div>
        <img src="{{ $algorithmChart }}" alt="Algorithm Chart" class="chart-image" style="max-height: 200px;">
    </div>
    @endif
    
    <div class="page-break"></div>
    
    <!-- Pareto Frontier -->
    <div class="section-header">📈 Analisis Pareto Frontier & Trade-Off</div>
    
    @if($paretoChart)
    <div class="chart-container">
        <div class="chart-title">Pareto Frontier: {{ $paretoAnalysis['dimension_1']['label'] }} vs {{ $paretoAnalysis['dimension_2']['label'] }}</div>
        <img src="{{ $paretoChart }}" alt="Pareto Chart" class="chart-image" style="max-height: 250px;">
    </div>
    @endif
    
    @if($spiderChart)
    <div class="chart-container">
        <div class="chart-title">Spider Chart: Perbandingan Multi-Dimensi</div>
        <img src="{{ $spiderChart }}" alt="Spider Chart" class="chart-image" style="max-height: 250px;">
    </div>
    @endif
    
    <!-- Footer -->
    <div class="footer">
        <div class="footer-left">MajorMind Comparison Report | {{ $documentId }} | Confidential</div>
        <div class="footer-right">Generated: {{ $generatedAt->format('d/m/Y H:i') }} WIB</div>
    </div>
</body>
</html>
```

---

## ✅ KEY FEATURES

1. **Landscape A4 Format** - Optimal for wide comparison tables
2. **50+ Dimension Matrix** - Complete attribute comparison
3. **Gap Analysis** - Show user's gaps vs requirements
4. **Algorithm Breakdown** - Transparency in ranking differences
5. **Pareto Visualization** - Trade-off analysis charts
6. **Consensus Scoring** - Algorithm agreement metrics
7. **Professional Design** - Print-ready quality

---

*Complete implementation for MajorMind Comparison Module PDF export with multi-dimensional matrix, algorithm breakdown, and Pareto analysis in landscape format.*
