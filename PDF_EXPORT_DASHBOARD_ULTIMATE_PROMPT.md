# 📄 MAJORMIND PDF EXPORT - DASHBOARD MODULE: ULTIMATE PROMPT
## Professional PDF Report Generation with Enterprise-Grade Design

---

## 📖 DOCUMENT PURPOSE

This is the **COMPREHENSIVE PROMPT** for implementing professional PDF export functionality for the MajorMind Dashboard Module. The PDF report will feature enterprise-grade design with official letterhead, professional typography, data visualizations, and a layout optimized specifically for print/PDF format (NOT web-based styling).

---

## 🎯 PDF DESIGN OBJECTIVES

1. **Professional Letterhead**: Official university/institution header with dual logos
2. **Document Authentication**: Unique document ID, QR code verification, watermark
3. **Print-Optimized Layout**: A4 portrait, proper margins, page breaks, headers/footers
4. **Data Visualization**: Charts, graphs, radar plots embedded as images
5. **Typography Excellence**: Professional font hierarchy, proper spacing
6. **Information Architecture**: Logical sections with clear visual separation
7. **Legal Compliance**: Signatures, timestamps, confidentiality markers

---

## 🏗️ PDF STRUCTURE: 8-PAGE COMPREHENSIVE REPORT

### PAGE 1: Cover Page & Executive Summary
### PAGE 2-3: Psychometric Profile & RIASEC Analysis
### PAGE 4-5: Top 10 Recommendations with Justification
### PAGE 6: Algorithm Transparency & Methodology
### PAGE 7: Multi-Dimensional Visualizations
### PAGE 8: Actionable Next Steps & Signatures

---

## 💻 BACKEND IMPLEMENTATION

### Controller Method

```php
// app/Http/Controllers/DashboardController.php
<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class DashboardController extends Controller
{
    public function exportPdf(int $assessmentId)
    {
        $assessment = Assessment::with([
            'psychometricProfile',
            'ahpWeights',
            'recommendationResults.major',
            'user'
        ])->findOrFail($assessmentId);
        
        // Generate unique document ID
        $documentId = 'MJM-DSH-' . date('Y') . '-' . str_pad($assessmentId, 6, '0', STR_PAD_LEFT);
        
        // Generate QR Code for verification
        $qrCode = base64_encode(QrCode::format('png')
            ->size(200)
            ->generate(route('dashboard.verify', ['id' => $documentId])));
        
        // Generate charts as base64 images
        $radarChart = $this->generateRadarChart($assessment->psychometricProfile);
        $waterfallChart = $this->generateWaterfallChart($assessment->recommendationResults->first());
        $algorithmChart = $this->generateAlgorithmComparisonChart($assessment);
        
        // Load logos
        $logoPath = public_path('images/logo-majormind.png');
        $logoUniversity = public_path('images/logo-university.png');
        
        $logoMajormind = file_exists($logoPath) 
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
            : null;
            
        $logoUniv = file_exists($logoUniversity)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoUniversity))
            : null;
        
        // Prepare data
        $data = [
            'assessment' => $assessment,
            'user' => $assessment->user,
            'profile' => $assessment->psychometricProfile,
            'weights' => $assessment->ahpWeights,
            'recommendations' => $assessment->recommendationResults->take(10),
            'topRecommendation' => $assessment->recommendationResults->first(),
            'documentId' => $documentId,
            'qrCode' => $qrCode,
            'radarChart' => $radarChart,
            'waterfallChart' => $waterfallChart,
            'algorithmChart' => $algorithmChart,
            'logoMajormind' => $logoMajormind,
            'logoUniversity' => $logoUniv,
            'generatedAt' => now()->timezone('Asia/Jakarta'),
            'generatedBy' => auth()->user()->name ?? 'System',
            'watermark' => 'CONFIDENTIAL - MAJORMIND'
        ];
        
        // Generate PDF
        $pdf = Pdf::loadView('pdf.dashboard-report', $data)
            ->setPaper('a4', 'portrait')
            ->setOption('margin-top', '10mm')
            ->setOption('margin-bottom', '15mm')
            ->setOption('margin-left', '15mm')
            ->setOption('margin-right', '15mm')
            ->setOption('enable-local-file-access', true);
        
        $filename = 'MajorMind_Dashboard_Report_' . $assessment->user->name . '_' . date('Ymd_His') . '.pdf';
        
        return $pdf->download($filename);
    }

    
    private function generateRadarChart($profile): string
    {
        // Use Chart.js or similar library to generate chart
        // Return base64 encoded image
        $chartData = [
            'Realistic' => $profile->riasec_realistic,
            'Investigative' => $profile->riasec_investigative,
            'Artistic' => $profile->riasec_artistic,
            'Social' => $profile->riasec_social,
            'Enterprising' => $profile->riasec_enterprising,
            'Conventional' => $profile->riasec_conventional
        ];
        
        // Generate chart using external service or library
        // Return base64 string
        return $this->chartService->generateRadar($chartData);
    }
    
    private function generateWaterfallChart($recommendation): string
    {
        // Generate waterfall chart showing criteria contributions
        return $this->chartService->generateWaterfall($recommendation);
    }
    
    private function generateAlgorithmComparisonChart($assessment): string
    {
        // Generate algorithm comparison chart
        return $this->chartService->generateAlgorithmComparison($assessment);
    }
}
```

---

## 🎨 BLADE TEMPLATE (resources/views/pdf/dashboard-report.blade.php)

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>MajorMind Dashboard Report - {{ $user->name }}</title>
    <style>
        /* ============================================
           DOCUMENT SETUP & GLOBAL STYLES
           ============================================ */
        @page {
            size: A4 portrait;
            margin: 10mm 15mm 15mm 15mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10pt;
            line-height: 1.5;
            color: #1a202c;
            background: #ffffff;
        }
        
        .container {
            width: 100%;
            max-width: 100%;
        }
        
        /* ============================================
           PROFESSIONAL LETTERHEAD
           ============================================ */
        .header-letterhead {
            display: table;
            width: 100%;
            border-bottom: 3px double #2c5282;
            padding-bottom: 10px;
            margin-bottom: 3px;
        }
        
        .header-logo-left {
            display: table-cell;
            width: 70px;
            vertical-align: middle;
            text-align: center;
        }
        
        .header-logo-left img {
            width: 60px;
            height: auto;
        }
        
        .header-text-center {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            padding: 0 15px;
        }
        
        .header-logo-right {
            display: table-cell;
            width: 70px;
            vertical-align: middle;
            text-align: center;
        }
        
        .header-logo-right img {
            width: 60px;
            height: auto;
        }
        
        .institution-name {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #2c5282;
            letter-spacing: 0.5px;
        }
        
        .system-name {
            font-size: 13pt;
            font-weight: bold;
            color: #2d3748;
            margin-top: 2px;
        }
        
        .tagline {
            font-size: 9pt;
            font-style: italic;
            color: #4a5568;
            margin-top: 3px;
        }
        
        .contact-info {
            font-size: 8pt;
            color: #718096;
            margin-top: 4px;
            line-height: 1.3;
        }
        
        .header-separator {
            border-top: 1px solid #2c5282;
            margin-bottom: 15px;
        }
        
        /* ============================================
           WATERMARK
           ============================================ */
        .watermark {
            position: fixed;
            top: 45%;
            left: 0;
            right: 0;
            width: 100%;
            text-align: center;
            font-size: 60pt;
            font-weight: bold;
            color: rgba(44, 82, 130, 0.08);
            transform: rotate(-45deg);
            z-index: -1000;
            pointer-events: none;
        }
        
        /* ============================================
           DOCUMENT TITLE & METADATA
           ============================================ */
        .document-title-section {
            text-align: center;
            margin: 15px 0 20px 0;
            page-break-after: avoid;
        }
        
        .document-title {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #1a202c;
            text-decoration: underline;
            margin-bottom: 8px;
        }
        
        .document-subtitle {
            font-size: 11pt;
            color: #4a5568;
            font-style: italic;
        }
        
        .document-id {
            font-size: 9pt;
            color: #718096;
            margin-top: 5px;
            font-family: 'Courier New', monospace;
        }
        
        /* ============================================
           INFORMATION BOX
           ============================================ */
        .info-box {
            background: #f7fafc;
            border: 2px solid #cbd5e0;
            border-radius: 6px;
            padding: 12px 15px;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        .info-table {
            width: 100%;
            font-size: 10pt;
        }
        
        .info-table td {
            padding: 4px 0;
            vertical-align: top;
        }
        
        .info-label {
            width: 180px;
            font-weight: bold;
            color: #2d3748;
        }
        
        .info-colon {
            width: 20px;
            text-align: center;
        }
        
        .info-value {
            color: #1a202c;
            font-weight: 600;
        }
        
        /* ============================================
           SECTION HEADERS
           ============================================ */
        .section-header {
            font-size: 12pt;
            font-weight: bold;
            color: #2c5282;
            text-transform: uppercase;
            border-left: 5px solid #2c5282;
            padding-left: 10px;
            margin: 20px 0 12px 0;
            page-break-after: avoid;
        }
        
        .subsection-header {
            font-size: 11pt;
            font-weight: bold;
            color: #2d3748;
            margin: 15px 0 8px 0;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            page-break-after: avoid;
        }
        
        /* ============================================
           EXECUTIVE SUMMARY CARD
           ============================================ */
        .executive-summary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        .summary-title {
            font-size: 13pt;
            font-weight: bold;
            margin-bottom: 12px;
            text-align: center;
        }
        
        .summary-content {
            font-size: 10pt;
            line-height: 1.6;
            text-align: justify;
        }
        
        .summary-highlight {
            background: rgba(255, 255, 255, 0.2);
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            font-weight: bold;
            text-align: center;
            font-size: 11pt;
        }
        
        /* ============================================
           STATISTICS GRID
           ============================================ */
        .stats-grid {
            display: table;
            width: 100%;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        .stat-box {
            display: table-cell;
            width: 25%;
            text-align: center;
            padding: 12px 8px;
            border: 1px solid #e2e8f0;
            background: #f7fafc;
        }
        
        .stat-value {
            font-size: 18pt;
            font-weight: bold;
            color: #2c5282;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 8pt;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* ============================================
           DATA TABLES
           ============================================ */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
            font-size: 9pt;
            page-break-inside: auto;
        }
        
        .data-table thead {
            background: #2c5282;
            color: white;
        }
        
        .data-table th {
            padding: 8px 6px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #2c5282;
        }
        
        .data-table td {
            padding: 6px 6px;
            border: 1px solid #cbd5e0;
            vertical-align: middle;
        }
        
        .data-table tbody tr:nth-child(even) {
            background: #f7fafc;
        }
        
        .data-table tbody tr:hover {
            background: #edf2f7;
        }
        
        .rank-badge {
            display: inline-block;
            width: 25px;
            height: 25px;
            line-height: 25px;
            border-radius: 50%;
            text-align: center;
            font-weight: bold;
            color: white;
        }
        
        .rank-1 { background: #f6ad55; }
        .rank-2 { background: #cbd5e0; }
        .rank-3 { background: #d69e2e; }
        .rank-other { background: #a0aec0; }
        
        /* ============================================
           CHARTS & VISUALIZATIONS
           ============================================ */
        .chart-container {
            text-align: center;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        
        .chart-title {
            font-size: 10pt;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 10px;
        }
        
        .chart-image {
            max-width: 100%;
            height: auto;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 10px;
            background: white;
        }
        
        /* ============================================
           RIASEC PROFILE DISPLAY
           ============================================ */
        .riasec-grid {
            display: table;
            width: 100%;
            margin: 12px 0;
        }
        
        .riasec-item {
            display: table-cell;
            width: 16.66%;
            text-align: center;
            padding: 10px 5px;
            border: 1px solid #e2e8f0;
        }
        
        .riasec-letter {
            font-size: 16pt;
            font-weight: bold;
            color: #2c5282;
            margin-bottom: 5px;
        }
        
        .riasec-name {
            font-size: 8pt;
            color: #4a5568;
            margin-bottom: 5px;
        }
        
        .riasec-score {
            font-size: 14pt;
            font-weight: bold;
            color: #2d3748;
        }
        
        .riasec-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            margin-top: 5px;
            overflow: hidden;
        }
        
        .riasec-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px;
        }

        
        /* ============================================
           RECOMMENDATION CARDS
           ============================================ */
        .recommendation-card {
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin: 10px 0;
            page-break-inside: avoid;
        }
        
        .recommendation-card.top-pick {
            border-color: #f6ad55;
            background: #fffaf0;
        }
        
        .rec-header {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }
        
        .rec-rank {
            display: table-cell;
            width: 40px;
            vertical-align: middle;
        }
        
        .rec-title {
            display: table-cell;
            vertical-align: middle;
            font-size: 11pt;
            font-weight: bold;
            color: #2d3748;
        }
        
        .rec-score {
            display: table-cell;
            width: 80px;
            text-align: right;
            vertical-align: middle;
            font-size: 14pt;
            font-weight: bold;
            color: #2c5282;
        }
        
        .rec-details {
            font-size: 9pt;
            color: #4a5568;
            line-height: 1.4;
        }
        
        .rec-tags {
            margin-top: 8px;
        }
        
        .rec-tag {
            display: inline-block;
            padding: 3px 8px;
            background: #edf2f7;
            border-radius: 3px;
            font-size: 8pt;
            color: #2d3748;
            margin-right: 5px;
            margin-top: 3px;
        }
        
        /* ============================================
           SIGNATURE SECTION
           ============================================ */
        .signature-section {
            margin-top: 30px;
            page-break-inside: avoid;
        }
        
        .signature-table {
            width: 100%;
        }
        
        .signature-table td {
            width: 33.33%;
            text-align: center;
            vertical-align: top;
            padding: 0 10px;
        }
        
        .signature-box {
            font-size: 9pt;
        }
        
        .signature-space {
            height: 50px;
        }
        
        .signature-name {
            font-weight: bold;
            text-decoration: underline;
            font-size: 10pt;
        }
        
        .signature-title {
            font-size: 8pt;
            color: #718096;
            margin-top: 3px;
        }
        
        .qr-code-box {
            text-align: center;
        }
        
        .qr-code-box img {
            width: 80px;
            height: 80px;
            border: 1px solid #e2e8f0;
            padding: 5px;
        }
        
        .qr-label {
            font-size: 7pt;
            color: #718096;
            margin-top: 5px;
        }
        
        /* ============================================
           FOOTER
           ============================================ */
        .footer {
            position: fixed;
            bottom: -15mm;
            left: 0;
            right: 0;
            border-top: 1px solid #e2e8f0;
            padding-top: 5px;
            font-size: 7pt;
            color: #a0aec0;
        }
        
        .footer-left {
            float: left;
        }
        
        .footer-right {
            float: right;
        }
        
        .page-number:before {
            content: counter(page);
        }
        
        /* ============================================
           UTILITY CLASSES
           ============================================ */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-justify { text-align: justify; }
        .font-bold { font-weight: bold; }
        .page-break { page-break-after: always; }
        .no-break { page-break-inside: avoid; }
        
        .highlight-box {
            background: #fef5e7;
            border-left: 4px solid #f39c12;
            padding: 10px;
            margin: 10px 0;
            font-size: 9pt;
        }
        
        .note-box {
            background: #ebf8ff;
            border: 1px solid #90cdf4;
            border-radius: 4px;
            padding: 10px;
            margin: 10px 0;
            font-size: 9pt;
        }
    </style>
</head>
<body>
    <!-- Watermark -->
    <div class="watermark">{{ $watermark }}</div>
    
    <div class="container">
        <!-- ============================================
             PAGE 1: COVER & EXECUTIVE SUMMARY
             ============================================ -->
        
        <!-- Professional Letterhead -->
        <div class="header-letterhead">
            <div class="header-logo-left">
                @if($logoUniversity)
                    <img src="{{ $logoUniversity }}" alt="University Logo">
                @endif
            </div>
            <div class="header-text-center">
                <div class="institution-name">Universitas / Institusi Pendidikan</div>
                <div class="system-name">MajorMind Decision Support System</div>
                <div class="tagline">Sistem Pendukung Keputusan Pemilihan Jurusan Berbasis AI</div>
                <div class="contact-info">
                    Website: majormind.edu | Email: support@majormind.edu | Telp: (021) 1234-5678
                </div>
            </div>
            <div class="header-logo-right">
                @if($logoMajormind)
                    <img src="{{ $logoMajormind }}" alt="MajorMind Logo">
                @endif
            </div>
        </div>
        <div class="header-separator"></div>
        
        <!-- Document Title -->
        <div class="document-title-section">
            <h1 class="document-title">Laporan Komprehensif Rekomendasi Jurusan</h1>
            <p class="document-subtitle">Hasil Analisis Sistem Pendukung Keputusan Berbasis AHP-TOPSIS</p>
            <p class="document-id">Nomor Dokumen: {{ $documentId }}</p>
        </div>
        
        <!-- User Information -->
        <div class="info-box">
            <table class="info-table">
                <tr>
                    <td class="info-label">Nama Lengkap</td>
                    <td class="info-colon">:</td>
                    <td class="info-value">{{ $user->name }}</td>
                </tr>
                <tr>
                    <td class="info-label">Email</td>
                    <td class="info-colon">:</td>
                    <td class="info-value">{{ $user->email }}</td>
                </tr>
                <tr>
                    <td class="info-label">Tanggal Assessment</td>
                    <td class="info-colon">:</td>
                    <td class="info-value">{{ $assessment->created_at->timezone('Asia/Jakarta')->translatedFormat('d F Y, H:i') }} WIB</td>
                </tr>
                <tr>
                    <td class="info-label">Holland Code (RIASEC)</td>
                    <td class="info-colon">:</td>
                    <td class="info-value">{{ $profile->holland_code ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td class="info-label">Status Dokumen</td>
                    <td class="info-colon">:</td>
                    <td class="info-value"><strong>RESMI & TERVERIFIKASI</strong></td>
                </tr>
            </table>
        </div>
        
        <!-- Executive Summary -->
        <div class="executive-summary">
            <div class="summary-title">📊 RINGKASAN EKSEKUTIF</div>
            <div class="summary-content">
                Berdasarkan analisis komprehensif menggunakan sistem hibrid AHP-TOPSIS dengan validasi psikometrik, 
                MajorMind merekomendasikan <strong>{{ $topRecommendation->major->name }}</strong> sebagai pilihan 
                optimal dengan skor kesesuaian <strong>{{ round($topRecommendation->final_score * 100, 1) }}%</strong>.
                <br><br>
                Rekomendasi ini didasarkan pada evaluasi mendalam terhadap profil psikologis Anda (Holland Code: {{ $profile->holland_code }}), 
                preferensi kriteria (AHP Consistency Ratio: {{ round($weights->consistency_ratio, 3) }}), 
                dan analisis kesesuaian dengan 38 alternatif jurusan menggunakan 4 algoritma berbeda.
            </div>
            <div class="summary-highlight">
                ✓ Tingkat Kepercayaan: {{ round($topRecommendation->confidence_score ?? 85, 1) }}% | 
                Konsensus Algoritma: {{ round($topRecommendation->consensus_score ?? 90, 1) }}%
            </div>
        </div>
        
        <!-- Key Statistics -->
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-value">{{ count($recommendations) }}</div>
                <div class="stat-label">Rekomendasi</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">{{ round($topRecommendation->final_score * 100, 1) }}%</div>
                <div class="stat-label">Skor Tertinggi</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">{{ round($weights->consistency_ratio, 3) }}</div>
                <div class="stat-label">CR (AHP)</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">4</div>
                <div class="stat-label">Algoritma</div>
            </div>
        </div>
        
        <div class="page-break"></div>
        
        <!-- ============================================
             PAGE 2-3: PSYCHOMETRIC PROFILE
             ============================================ -->
        
        <div class="section-header">🧬 Profil Psikometrik RIASEC</div>
        
        <p style="font-size: 9pt; text-align: justify; margin-bottom: 12px;">
            Profil kepribadian Anda dianalisis menggunakan model Holland RIASEC (Realistic, Investigative, Artistic, 
            Social, Enterprising, Conventional) yang merupakan standar internasional dalam pemetaan minat karir.
        </p>
        
        <!-- RIASEC Grid -->
        <div class="riasec-grid">
            <div class="riasec-item">
                <div class="riasec-letter">R</div>
                <div class="riasec-name">Realistic</div>
                <div class="riasec-score">{{ $profile->riasec_realistic }}</div>
                <div class="riasec-bar">
                    <div class="riasec-bar-fill" style="width: {{ $profile->riasec_realistic }}%;"></div>
                </div>
            </div>
            <div class="riasec-item">
                <div class="riasec-letter">I</div>
                <div class="riasec-name">Investigative</div>
                <div class="riasec-score">{{ $profile->riasec_investigative }}</div>
                <div class="riasec-bar">
                    <div class="riasec-bar-fill" style="width: {{ $profile->riasec_investigative }}%;"></div>
                </div>
            </div>
            <div class="riasec-item">
                <div class="riasec-letter">A</div>
                <div class="riasec-name">Artistic</div>
                <div class="riasec-score">{{ $profile->riasec_artistic }}</div>
                <div class="riasec-bar">
                    <div class="riasec-bar-fill" style="width: {{ $profile->riasec_artistic }}%;"></div>
                </div>
            </div>
            <div class="riasec-item">
                <div class="riasec-letter">S</div>
                <div class="riasec-name">Social</div>
                <div class="riasec-score">{{ $profile->riasec_social }}</div>
                <div class="riasec-bar">
                    <div class="riasec-bar-fill" style="width: {{ $profile->riasec_social }}%;"></div>
                </div>
            </div>
            <div class="riasec-item">
                <div class="riasec-letter">E</div>
                <div class="riasec-name">Enterprising</div>
                <div class="riasec-score">{{ $profile->riasec_enterprising }}</div>
                <div class="riasec-bar">
                    <div class="riasec-bar-fill" style="width: {{ $profile->riasec_enterprising }}%;"></div>
                </div>
            </div>
            <div class="riasec-item">
                <div class="riasec-letter">C</div>
                <div class="riasec-name">Conventional</div>
                <div class="riasec-score">{{ $profile->riasec_conventional }}</div>
                <div class="riasec-bar">
                    <div class="riasec-bar-fill" style="width: {{ $profile->riasec_conventional }}%;"></div>
                </div>
            </div>
        </div>
        
        <!-- Radar Chart -->
        @if($radarChart)
        <div class="chart-container">
            <div class="chart-title">Visualisasi Profil RIASEC</div>
            <img src="{{ $radarChart }}" alt="RIASEC Radar Chart" class="chart-image" style="max-width: 400px;">
        </div>
        @endif
        
        <div class="highlight-box">
            <strong>Interpretasi Holland Code: {{ $profile->holland_code }}</strong><br>
            Kode Holland Anda menunjukkan kombinasi unik dari tipe kepribadian yang paling dominan. 
            Ini memberikan panduan kuat tentang lingkungan kerja dan bidang studi yang paling sesuai dengan karakteristik Anda.
        </div>
        
        <div class="page-break"></div>

        
        <!-- ============================================
             PAGE 4-5: TOP 10 RECOMMENDATIONS
             ============================================ -->
        
        <div class="section-header">🎯 Top 10 Rekomendasi Jurusan</div>
        
        <p style="font-size: 9pt; text-align: justify; margin-bottom: 12px;">
            Berikut adalah 10 jurusan teratas yang paling sesuai dengan profil Anda, diurutkan berdasarkan 
            skor kesesuaian yang dihitung menggunakan sistem hibrid AHP-TOPSIS-ProfileMatching-Mahalanobis.
        </p>
        
        @foreach($recommendations as $index => $rec)
        <div class="recommendation-card {{ $index === 0 ? 'top-pick' : '' }}">
            <div class="rec-header">
                <div class="rec-rank">
                    <span class="rank-badge rank-{{ $index + 1 <= 3 ? $index + 1 : 'other' }}">
                        #{{ $index + 1 }}
                    </span>
                </div>
                <div class="rec-title">
                    {{ $rec->major->name }}
                    @if($index === 0)
                        <span style="color: #f6ad55; font-size: 9pt;">★ REKOMENDASI UTAMA</span>
                    @endif
                </div>
                <div class="rec-score">
                    {{ round($rec->final_score * 100, 1) }}%
                </div>
            </div>
            <div class="rec-details">
                <strong>Kode Jurusan:</strong> {{ $rec->major->code ?? 'N/A' }}<br>
                <strong>Kategori:</strong> {{ $rec->major->category ?? 'N/A' }}<br>
                <strong>Prospek Karir:</strong> {{ $rec->major->career_outlook ?? 'N/A' }}<br>
                <strong>Tingkat Persaingan:</strong> {{ $rec->major->competition_level ?? 'N/A' }}
            </div>
            <div class="rec-tags">
                <span class="rec-tag">TOPSIS: {{ round($rec->topsis_score ?? 0, 3) }}</span>
                <span class="rec-tag">Profile Match: {{ round($rec->profile_match_score ?? 0, 3) }}</span>
                <span class="rec-tag">Consensus: {{ round($rec->consensus_score ?? 0, 1) }}%</span>
            </div>
        </div>
        @endforeach
        
        <div class="page-break"></div>
        
        <!-- ============================================
             PAGE 6: ALGORITHM TRANSPARENCY
             ============================================ -->
        
        <div class="section-header">🔬 Transparansi Algoritmik</div>
        
        <div class="subsection-header">Metodologi Sistem Hibrid</div>
        
        <p style="font-size: 9pt; text-align: justify; margin-bottom: 10px;">
            MajorMind menggunakan pendekatan hibrid yang menggabungkan 4 algoritma berbeda untuk memastikan 
            akurasi dan robustness rekomendasi:
        </p>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 30%;">Algoritma</th>
                    <th style="width: 15%;">Bobot</th>
                    <th style="width: 55%;">Fungsi</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>TOPSIS (Euclidean)</strong></td>
                    <td class="text-center">30%</td>
                    <td>Menghitung jarak ke solusi ideal berdasarkan kriteria institusional</td>
                </tr>
                <tr>
                    <td><strong>Profile Matching</strong></td>
                    <td class="text-center">25%</td>
                    <td>Analisis kesenjangan kompetensi (Core & Secondary Factors)</td>
                </tr>
                <tr>
                    <td><strong>TOPSIS (Mahalanobis)</strong></td>
                    <td class="text-center">20%</td>
                    <td>Jarak statistik dengan mempertimbangkan korelasi antar kriteria</td>
                </tr>
                <tr>
                    <td><strong>ML Prediction</strong></td>
                    <td class="text-center">25%</td>
                    <td>Prediksi keberhasilan berbasis data historis (Random Forest)</td>
                </tr>
            </tbody>
        </table>
        
        <div class="subsection-header">Bobot Kriteria (AHP)</div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Kriteria</th>
                    <th>Bobot</th>
                    <th>Prioritas</th>
                </tr>
            </thead>
            <tbody>
                @foreach($weights->weights as $criterion => $weight)
                <tr>
                    <td>{{ ucwords(str_replace('_', ' ', $criterion)) }}</td>
                    <td class="text-center font-bold">{{ round($weight * 100, 1) }}%</td>
                    <td class="text-center">
                        <div style="width: 100%; background: #e2e8f0; height: 10px; border-radius: 3px;">
                            <div style="width: {{ $weight * 100 }}%; background: #2c5282; height: 100%; border-radius: 3px;"></div>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
        <div class="note-box">
            <strong>Consistency Ratio (CR): {{ round($weights->consistency_ratio, 3) }}</strong><br>
            CR < 0.1 menunjukkan bahwa preferensi Anda konsisten secara matematis dan dapat diandalkan.
        </div>
        
        @if($algorithmChart)
        <div class="chart-container">
            <div class="chart-title">Perbandingan Hasil Antar Algoritma</div>
            <img src="{{ $algorithmChart }}" alt="Algorithm Comparison" class="chart-image">
        </div>
        @endif
        
        <div class="page-break"></div>
        
        <!-- ============================================
             PAGE 7: VISUALIZATIONS
             ============================================ -->
        
        <div class="section-header">📈 Visualisasi Multi-Dimensi</div>
        
        @if($waterfallChart)
        <div class="chart-container">
            <div class="chart-title">Kontribusi Kriteria terhadap Skor Final (Waterfall Chart)</div>
            <img src="{{ $waterfallChart }}" alt="Waterfall Chart" class="chart-image">
            <p style="font-size: 8pt; color: #718096; margin-top: 8px; text-align: center;">
                Chart ini menunjukkan bagaimana setiap kriteria berkontribusi terhadap skor akhir rekomendasi teratas
            </p>
        </div>
        @endif
        
        <div class="subsection-header">Analisis Kesesuaian Profil</div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Dimensi</th>
                    <th>Skor Anda</th>
                    <th>Requirement</th>
                    <th>Gap</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Kemampuan Logika</td>
                    <td class="text-center">{{ $profile->logic_ability }}</td>
                    <td class="text-center">{{ $topRecommendation->major->logic_threshold ?? 'N/A' }}</td>
                    <td class="text-center">{{ $profile->logic_ability - ($topRecommendation->major->logic_threshold ?? 0) }}</td>
                    <td class="text-center">
                        @if($profile->logic_ability >= ($topRecommendation->major->logic_threshold ?? 0))
                            <span style="color: #059669; font-weight: bold;">✓ Memenuhi</span>
                        @else
                            <span style="color: #dc2626; font-weight: bold;">⚠ Perlu Peningkatan</span>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td>Kesiapan Akademik</td>
                    <td class="text-center">{{ $profile->academic_readiness }}</td>
                    <td class="text-center">{{ $topRecommendation->major->academic_threshold ?? 'N/A' }}</td>
                    <td class="text-center">{{ $profile->academic_readiness - ($topRecommendation->major->academic_threshold ?? 0) }}</td>
                    <td class="text-center">
                        @if($profile->academic_readiness >= ($topRecommendation->major->academic_threshold ?? 0))
                            <span style="color: #059669; font-weight: bold;">✓ Memenuhi</span>
                        @else
                            <span style="color: #dc2626; font-weight: bold;">⚠ Perlu Peningkatan</span>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td>Grit Score</td>
                    <td class="text-center">{{ $profile->grit_score }}</td>
                    <td class="text-center">{{ $topRecommendation->major->grit_threshold ?? 'N/A' }}</td>
                    <td class="text-center">{{ $profile->grit_score - ($topRecommendation->major->grit_threshold ?? 0) }}</td>
                    <td class="text-center">
                        @if($profile->grit_score >= ($topRecommendation->major->grit_threshold ?? 0))
                            <span style="color: #059669; font-weight: bold;">✓ Memenuhi</span>
                        @else
                            <span style="color: #dc2626; font-weight: bold;">⚠ Perlu Peningkatan</span>
                        @endif
                    </td>
                </tr>
            </tbody>
        </table>
        
        <div class="page-break"></div>
        
        <!-- ============================================
             PAGE 8: ACTIONABLE NEXT STEPS & SIGNATURES
             ============================================ -->
        
        <div class="section-header">🚀 Langkah Selanjutnya</div>
        
        <div class="subsection-header">Rekomendasi Tindakan</div>
        
        <ol style="font-size: 9pt; line-height: 1.8; padding-left: 20px;">
            <li><strong>Eksplorasi Mendalam:</strong> Pelajari lebih lanjut tentang {{ $topRecommendation->major->name }} 
                melalui website universitas, brosur, dan open house.</li>
            <li><strong>Konsultasi:</strong> Diskusikan hasil ini dengan orang tua, guru BK, atau konselor pendidikan 
                untuk mendapatkan perspektif tambahan.</li>
            <li><strong>Kunjungan Kampus:</strong> Jika memungkinkan, kunjungi kampus yang menawarkan jurusan ini 
                untuk merasakan atmosfer dan fasilitas.</li>
            <li><strong>Persiapan Akademik:</strong> Fokuskan persiapan pada mata pelajaran yang relevan dengan jurusan pilihan.</li>
            <li><strong>Scenario Lab:</strong> Gunakan fitur Scenario Lab di MajorMind untuk mengeksplorasi 
                bagaimana perubahan prioritas mempengaruhi rekomendasi.</li>
            <li><strong>Comparison Module:</strong> Bandingkan jurusan-jurusan teratas secara detail menggunakan 
                fitur Comparison untuk memahami trade-offs.</li>
        </ol>
        
        <div class="highlight-box">
            <strong>⚠️ Catatan Penting:</strong><br>
            Hasil rekomendasi ini bersifat panduan berbasis data dan analisis algoritmik. Keputusan akhir tetap 
            berada di tangan Anda dengan mempertimbangkan faktor-faktor personal, keluarga, dan kondisi spesifik lainnya.
        </div>
        
        <!-- Signature Section -->
        <div class="signature-section">
            <table class="signature-table">
                <tr>
                    <td class="qr-code-box">
                        @if($qrCode)
                            <img src="data:image/png;base64,{{ $qrCode }}" alt="QR Code">
                            <div class="qr-label">Scan untuk verifikasi dokumen</div>
                        @endif
                    </td>
                    <td></td>
                    <td class="signature-box">
                        <p>{{ $generatedAt->timezone('Asia/Jakarta')->translatedFormat('d F Y') }}</p>
                        <p style="margin-top: 5px;"><strong>Diverifikasi oleh:</strong></p>
                        <div class="signature-space"></div>
                        <p class="signature-name">{{ $generatedBy }}</p>
                        <p class="signature-title">Administrator MajorMind</p>
                    </td>
                </tr>
            </table>
        </div>
        
        <div class="note-box" style="margin-top: 20px;">
            <strong>Informasi Dokumen:</strong><br>
            Dokumen ID: {{ $documentId }}<br>
            Dicetak pada: {{ $generatedAt->timezone('Asia/Jakarta')->translatedFormat('d F Y H:i:s') }} WIB<br>
            Versi Sistem: MajorMind v2.0 (AHP-TOPSIS Hybrid Engine)<br>
            Status: RESMI & TERVERIFIKASI
        </div>
        
    </div>
    
    <!-- Footer -->
    <div class="footer">
        <div class="footer-left">
            <strong>MajorMind DSS</strong> | Dokumen: {{ $documentId }} | Confidential
        </div>
        <div class="footer-right">
            Halaman <span class="page-number"></span>
        </div>
    </div>
</body>
</html>
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Backend Requirements ✓
- DomPDF library installed (`barryvdh/laravel-dompdf`)
- QR Code generator (`simplesoftwareio/simple-qrcode`)
- Chart generation service (Chart.js Node or similar)
- Image encoding utilities
- Logo assets prepared

### Frontend Trigger ✓
```typescript
// resources/js/Pages/Dashboard/AdvancedDashboard.tsx

const handleExportPDF = async () => {
  setIsExporting(true);
  try {
    const response = await axios.get(
      route('dashboard.export-pdf', { assessment: assessmentId }),
      { responseType: 'blob' }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MajorMind_Dashboard_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast.success('PDF berhasil diunduh!');
  } catch (error) {
    toast.error('Gagal mengekspor PDF');
  } finally {
    setIsExporting(false);
  }
};
```

### Route Definition ✓
```php
// routes/web.php
Route::get('/dashboard/{assessment}/export-pdf', [DashboardController::class, 'exportPdf'])
    ->name('dashboard.export-pdf')
    ->middleware(['auth']);
```

### Performance Optimization ✓
- Cache generated charts (Redis, 1 hour TTL)
- Async PDF generation for large reports
- Queue jobs for bulk exports
- Compress images before embedding
- Lazy load non-critical sections

### Quality Assurance ✓
- Test on multiple PDF readers (Adobe, Chrome, Firefox)
- Verify page breaks work correctly
- Check image quality and sizing
- Validate QR code functionality
- Test with various data scenarios
- Ensure responsive to different content lengths

---

## 🎨 DESIGN PRINCIPLES

1. **Professional Typography**: Times New Roman for body, proper hierarchy
2. **Color Scheme**: Blue (#2c5282) primary, grayscale for text, accent colors for highlights
3. **Spacing**: Generous margins, proper line-height, visual breathing room
4. **Consistency**: Uniform styling across all sections
5. **Print-Friendly**: High contrast, no web-specific effects
6. **Accessibility**: Clear labels, readable font sizes, logical structure

---

## ✅ SUCCESS CRITERIA

- PDF generates in < 5 seconds
- File size < 2MB
- All charts render correctly
- QR code scannable
- Professional appearance
- Print-ready quality
- Mobile-friendly viewing
- Legally compliant format

---

*This comprehensive prompt provides complete implementation for professional PDF export of MajorMind Dashboard reports with enterprise-grade design, official letterhead, and print-optimized layout.*
