<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>MajorMind Dashboard Report - {{ $user->name ?? 'User' }}</title>
    <style>
        @page { size: A4 portrait; margin: 8mm 10mm 10mm 10mm; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 8pt; line-height: 1.3; color: #1e293b; margin: 0; padding: 0; }
        table { border-collapse: collapse; }
        td, th { vertical-align: middle; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>

{{-- ================================================================
     PAGE 1: COVER + EXECUTIVE SUMMARY + BEHAVIORAL + CRITERIA
     ================================================================ --}}

{{-- HEADER --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="background-color: #1e3a5f; padding: 8px 10px; width: 40px; text-align: center;">
            @if($logoMajormind)<img src="{{ $logoMajormind }}" style="width: 28px; height: auto;">@endif
        </td>
        <td style="background-color: #1e3a5f; padding: 8px 6px; text-align: center; color: #ffffff;">
            <div style="font-size: 12pt; font-weight: bold; letter-spacing: 1px;">MAJORMIND DECISION SUPPORT SYSTEM</div>
            <div style="font-size: 7.5pt; opacity: 0.85;">Laporan Komprehensif Rekomendasi Jurusan</div>
            <div style="font-size: 6pt; opacity: 0.6;">AHP-TOPSIS Hybrid Engine &middot; Psychometric Profiling &middot; Multi-Algorithm Consensus</div>
        </td>
        <td style="background-color: #1e3a5f; padding: 8px 10px; width: 40px; text-align: center;">
            @if($logoMajormind)<img src="{{ $logoMajormind }}" style="width: 28px; height: auto;">@endif
        </td>
    </tr>
</table>

{{-- TITLE --}}
<div style="text-align: center; margin-bottom: 6px;">
    <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; text-decoration: underline;">Laporan Rekomendasi Jurusan</div>
    <div style="font-size: 7pt; color: #64748b; margin-top: 2px;">{{ $documentId }} &middot; {{ $generatedAt->translatedFormat('d F Y, H:i') }} WIB &middot; Status: RESMI</div>
</div>

{{-- USER INFO --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="padding: 6px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; width: 50%;">
            <div style="font-size: 7pt; color: #64748b; text-transform: uppercase;">Nama Lengkap</div>
            <div style="font-size: 9pt; font-weight: bold;">{{ $user->name ?? 'N/A' }}</div>
        </td>
        <td style="padding: 6px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; width: 25%;">
            <div style="font-size: 7pt; color: #64748b; text-transform: uppercase;">CR (AHP)</div>
            <div style="font-size: 9pt; font-weight: bold;">{{ number_format($consistencyRatio, 4) }}</div>
        </td>
        <td style="padding: 6px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; width: 25%;">
            <div style="font-size: 7pt; color: #64748b; text-transform: uppercase;">Tanggal Assessment</div>
            <div style="font-size: 9pt; font-weight: bold;">{{ $assessment->created_at->timezone('Asia/Jakarta')->translatedFormat('d M Y') }}</div>
        </td>
    </tr>
</table>

{{-- EXECUTIVE SUMMARY --}}
@if($topRecommendation)
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="background-color: #1e3a5f; color: #ffffff; padding: 10px 14px;">
            <div style="font-size: 9pt; font-weight: bold; text-align: center; margin-bottom: 5px; letter-spacing: 0.5px;">RINGKASAN EKSEKUTIF</div>
            <div style="font-size: 7.5pt; line-height: 1.4; text-align: justify;">
                Berdasarkan analisis komprehensif menggunakan sistem hibrid AHP-TOPSIS dengan validasi psikometrik,
                MajorMind merekomendasikan <strong>{{ $topRecommendation->major->name }}</strong> sebagai pilihan
                optimal dengan skor kesesuaian <strong>{{ round($topRecommendation->final_score * 100, 1) }}%</strong>.
            </div>
            <div style="background-color: rgba(255,255,255,0.12); padding: 4px 8px; margin-top: 6px; text-align: center; font-size: 7.5pt; font-weight: bold;">
                Confidence: {{ round(($summary['recommendation_confidence'] ?? 0) * 100, 1) }}% &middot;
                Konsensus Algoritma: {{ round(($summary['algorithm_agreement'] ?? 0) * 100, 1) }}%
            </div>
        </td>
    </tr>
</table>
@endif

{{-- KEY STATS --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
    <tr>
        <td style="text-align: center; padding: 6px 4px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 25%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a5f;">{{ count($recommendations) }}</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">Rekomendasi</div>
        </td>
        <td style="text-align: center; padding: 6px 4px; border: 1px solid #e2e8f0; background-color: #ecfdf5; border-bottom: 2px solid #059669; width: 25%;">
            <div style="font-size: 14pt; font-weight: bold; color: #059669;">{{ $topRecommendation ? round($topRecommendation->final_score * 100, 1) . '%' : 'N/A' }}</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">Skor Tertinggi</div>
        </td>
        <td style="text-align: center; padding: 6px 4px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 25%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a5f;">{{ number_format($consistencyRatio, 4) }}</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">CR (AHP)</div>
        </td>
        <td style="text-align: center; padding: 6px 4px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 25%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a5f;">{{ round(($summary['recommendation_confidence'] ?? 0) * 100) }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">Confidence</div>
        </td>
    </tr>
</table>

{{-- BEHAVIORAL PROFILE --}}
<div style="font-size: 8pt; font-weight: bold; color: #ffffff; background-color: #166534; padding: 3px 8px; margin-bottom: 4px;">PROFIL PERILAKU &amp; PSIKOMETRIK</div>

@php
    $dimensionLabels = [
        'minat_stem' => 'Minat STEM',
        'minat_seni' => 'Minat Seni & Kreativitas',
        'minat_sosial' => 'Minat Sosial',
        'minat_manajemen' => 'Minat Manajemen',
        'daya_juang' => 'Daya Juang (Grit)',
        'logika_matematika' => 'Logika Matematika',
        'kemampuan_analitis' => 'Kemampuan Analitis',
        'konsistensi' => 'Konsistensi',
    ];
@endphp

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7.5pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 6px; border: 1px solid #1e3a5f; text-align: left; font-size: 6.5pt;">Dimensi</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 6px; border: 1px solid #1e3a5f; text-align: center; font-size: 6.5pt; width: 50px;">Skor</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 6px; border: 1px solid #1e3a5f; text-align: left; font-size: 6.5pt;">Visualisasi</th>
        </tr>
    </thead>
    <tbody>
        @foreach($behavioralProfile as $key => $value)
            <tr>
                <td style="padding: 3px 6px; border: 1px solid #cbd5e1; font-weight: bold;">{{ $dimensionLabels[$key] ?? ucwords(str_replace('_', ' ', $key)) }}</td>
                <td style="padding: 3px 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #1e3a5f;">{{ is_numeric($value) ? round($value, 1) : $value }}</td>
                <td style="padding: 3px 6px; border: 1px solid #cbd5e1;">
                    <div style="width: 100%; height: 10px; background-color: #e2e8f0; overflow: hidden;">
                        <div style="height: 10px; width: {{ is_numeric($value) ? min($value, 100) : 0 }}%; background-color: #667eea;"></div>
                    </div>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- AHP WEIGHTS --}}
<div style="font-size: 8pt; font-weight: bold; color: #ffffff; background-color: #1e3a5f; padding: 3px 8px; margin-bottom: 4px;">BOBOT KRITERIA (AHP)</div>

@php
    $criteriaLabels = [
        'minat_pribadi' => 'Minat Pribadi',
        'kemampuan_analitis' => 'Kemampuan Analitis',
        'prospek_karier' => 'Prospek Karier',
        'kesiapan_akademik' => 'Kesiapan Akademik',
    ];
@endphp

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7.5pt; margin-bottom: 4px;">
    <thead>
        <tr>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 6px; border: 1px solid #1e3a5f; text-align: left; font-size: 6.5pt;">Kriteria</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 6px; border: 1px solid #1e3a5f; text-align: center; font-size: 6.5pt; width: 50px;">Bobot</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 6px; border: 1px solid #1e3a5f; text-align: left; font-size: 6.5pt;">Prioritas</th>
        </tr>
    </thead>
    <tbody>
        @foreach($criterionOrder as $criterion)
            @php $weight = $criterionWeights[$criterion] ?? 0; @endphp
            <tr>
                <td style="padding: 3px 6px; border: 1px solid #cbd5e1; font-weight: bold;">{{ $criteriaLabels[$criterion] ?? ucwords(str_replace('_', ' ', $criterion)) }}</td>
                <td style="padding: 3px 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #1e3a5f;">{{ is_numeric($weight) ? round($weight * 100, 1) : 0 }}%</td>
                <td style="padding: 3px 6px; border: 1px solid #cbd5e1;">
                    <div style="width: 100%; height: 10px; background-color: #e2e8f0; overflow: hidden;">
                        <div style="height: 10px; width: {{ is_numeric($weight) ? ($weight * 100) : 0 }}%; background-color: #2c5282;"></div>
                    </div>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

<div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 3px 6px; font-size: 6.5pt; color: #0c4a6e; margin-bottom: 0;">
    <strong>CR: {{ number_format($consistencyRatio, 4) }}</strong> &mdash;
    @if($consistencyRatio < 0.1)
        Konsisten (CR &lt; 0.1)
    @else
        Perlu review ulang (CR &gt;= 0.1)
    @endif
</div>

{{-- PAGE BREAK --}}
<div class="page-break"></div>

{{-- ================================================================
     PAGE 2: TOP RECOMMENDATIONS + FULL RANKING TABLE
     ================================================================ --}}

{{-- HEADER REPEAT --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="background-color: #1e3a5f; padding: 4px 10px; text-align: center; color: #ffffff;">
            <span style="font-size: 8pt; font-weight: bold; letter-spacing: 0.5px;">MAJORMIND DECISION SUPPORT SYSTEM</span>
            <span style="font-size: 6pt; opacity: 0.7;"> &middot; {{ $documentId }} &middot; Halaman 2</span>
        </td>
    </tr>
</table>

<div style="font-size: 8pt; font-weight: bold; color: #ffffff; background-color: #166534; padding: 3px 8px; margin-bottom: 4px;">TOP {{ count($recommendations) }} REKOMENDASI JURUSAN</div>

{{-- TOP 3 CARDS --}}
@foreach($recommendations->take(3) as $index => $rec)
    @php
        $borderColor = $index === 0 ? '#f59e0b' : ($index === 1 ? '#94a3b8' : '#d97706');
        $bgColor = $index === 0 ? '#fffbeb' : '#ffffff';
    @endphp
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
        <tr>
            <td style="width: 28px; text-align: center; padding: 6px 4px; border: 1.5px solid {{ $borderColor }}; background-color: {{ $borderColor }}; color: #ffffff; font-size: 10pt; font-weight: bold;">
                {{ $index + 1 }}
            </td>
            <td style="padding: 6px 10px; border: 1.5px solid {{ $borderColor }}; border-left: none; background-color: {{ $bgColor }};">
                <div style="font-size: 9.5pt; font-weight: bold; color: #1e293b;">
                    {{ $rec->major->name }}
                    @if($index === 0)
                        <span style="font-size: 6.5pt; color: #f59e0b; margin-left: 4px;">REKOMENDASI UTAMA</span>
                    @endif
                </div>
                @if($rec->major->description)
                    <div style="font-size: 6.5pt; color: #64748b; margin-top: 1px;">{{ \Illuminate\Support\Str::limit($rec->major->description, 100) }}</div>
                @endif
                <div style="font-size: 6pt; color: #64748b; margin-top: 2px;">
                    TOPSIS: {{ is_numeric($rec->topsis_score) ? round($rec->topsis_score, 4) : 'N/A' }} &middot;
                    Behavioral: {{ is_numeric($rec->behavioral_score) ? round($rec->behavioral_score, 4) : 'N/A' }}
                    @if(isset($rec->meta['saw_verification']) && is_numeric($rec->meta['saw_verification']))
                        &middot; SAW: {{ round($rec->meta['saw_verification'], 4) }}
                    @endif
                </div>
            </td>
            <td style="width: 65px; text-align: center; padding: 6px 4px; border: 1.5px solid {{ $borderColor }}; border-left: none; background-color: {{ $bgColor }};">
                <div style="font-size: 14pt; font-weight: bold; color: #1e3a5f;">{{ round($rec->final_score * 100, 1) }}%</div>
            </td>
        </tr>
    </table>
@endforeach

{{-- REMAINING RECS AS TABLE --}}
@if(count($recommendations) > 3)
<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #475569; color: #ffffff; padding: 3px 4px; border: 1px solid #475569; text-align: center; width: 20px; font-size: 6pt;">#</th>
            <th style="background-color: #475569; color: #ffffff; padding: 3px 4px; border: 1px solid #475569; text-align: left; font-size: 6pt;">Jurusan</th>
            <th style="background-color: #475569; color: #ffffff; padding: 3px 4px; border: 1px solid #475569; text-align: center; font-size: 6pt;">TOPSIS</th>
            <th style="background-color: #475569; color: #ffffff; padding: 3px 4px; border: 1px solid #475569; text-align: center; font-size: 6pt;">Behavioral</th>
            <th style="background-color: #475569; color: #ffffff; padding: 3px 4px; border: 1px solid #475569; text-align: center; font-size: 6pt;">Final</th>
        </tr>
    </thead>
    <tbody>
        @foreach($recommendations->slice(3) as $index => $rec)
            <tr>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">{{ $index + 4 }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; font-weight: bold;">{{ $rec->major->name }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center;">{{ is_numeric($rec->topsis_score) ? round($rec->topsis_score, 4) : 'N/A' }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center;">{{ is_numeric($rec->behavioral_score) ? round($rec->behavioral_score, 4) : 'N/A' }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #1e3a5f;">{{ is_numeric($rec->final_score) ? round($rec->final_score * 100, 1) . '%' : 'N/A' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@endif

{{-- FULL RANKING TABLE --}}
<div style="font-size: 8pt; font-weight: bold; color: #ffffff; background-color: #1e3a5f; padding: 3px 8px; margin-bottom: 4px;">TABEL PERINGKAT LENGKAP</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 4px; border: 1px solid #1e3a5f; text-align: center; width: 20px; font-size: 6pt;">#</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 4px; border: 1px solid #1e3a5f; text-align: left; font-size: 6pt;">Jurusan</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 4px; border: 1px solid #1e3a5f; text-align: center; font-size: 6pt;">TOPSIS</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 4px; border: 1px solid #1e3a5f; text-align: center; font-size: 6pt;">Behavioral</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 4px; border: 1px solid #1e3a5f; text-align: center; font-size: 6pt;">Final Score</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 4px; border: 1px solid #1e3a5f; text-align: center; font-size: 6pt;">D+</th>
            <th style="background-color: #1e3a5f; color: #ffffff; padding: 3px 4px; border: 1px solid #1e3a5f; text-align: center; font-size: 6pt;">D-</th>
        </tr>
    </thead>
    <tbody>
        @foreach($recommendations as $index => $rec)
            <tr>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">{{ $index + 1 }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; font-weight: bold;">{{ $rec->major->name }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center;">{{ is_numeric($rec->topsis_score) ? round($rec->topsis_score, 4) : 'N/A' }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center;">{{ is_numeric($rec->behavioral_score) ? round($rec->behavioral_score, 4) : 'N/A' }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #1e3a5f;">{{ is_numeric($rec->final_score) ? round($rec->final_score * 100, 1) . '%' : 'N/A' }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center;">{{ is_numeric($rec->distance_positive) ? round($rec->distance_positive, 4) : 'N/A' }}</td>
                <td style="padding: 2px 4px; border: 1px solid #cbd5e1; text-align: center;">{{ is_numeric($rec->distance_negative) ? round($rec->distance_negative, 4) : 'N/A' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- METHODOLOGY --}}
<div style="font-size: 8pt; font-weight: bold; color: #ffffff; background-color: #581c87; padding: 3px 8px; margin-bottom: 4px;">METODOLOGI SISTEM HIBRID</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #581c87; color: #ffffff; padding: 3px 6px; border: 1px solid #581c87; text-align: left; font-size: 6pt;">Algoritma</th>
            <th style="background-color: #581c87; color: #ffffff; padding: 3px 6px; border: 1px solid #581c87; text-align: center; font-size: 6pt; width: 50px;">Peran</th>
            <th style="background-color: #581c87; color: #ffffff; padding: 3px 6px; border: 1px solid #581c87; text-align: left; font-size: 6pt;">Fungsi</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1; font-weight: bold;">TOPSIS (Euclidean)</td>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1; text-align: center;">Utama</td>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1;">Menghitung jarak ke solusi ideal berdasarkan kriteria terbobot AHP</td>
        </tr>
        <tr>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1; font-weight: bold;">Profile Matching</td>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1; text-align: center;">Pendukung</td>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1;">Analisis kesenjangan kompetensi (Core &amp; Secondary Factors)</td>
        </tr>
        <tr>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1; font-weight: bold;">SAW Verification</td>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1; text-align: center;">Verifikasi</td>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1;">Cross-check menggunakan Simple Additive Weighting</td>
        </tr>
        <tr>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1; font-weight: bold;">Behavioral Scoring</td>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1; text-align: center;">Psikometrik</td>
            <td style="padding: 2px 6px; border: 1px solid #cbd5e1;">Kesesuaian profil perilaku dengan karakteristik jurusan</td>
        </tr>
    </tbody>
</table>

{{-- DISCLAIMER + SIGNATURE --}}
<div style="background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 4px 8px; font-size: 7pt; color: #78350f; margin-bottom: 8px;">
    <strong>Catatan Penting:</strong> Laporan ini merupakan hasil analisis algoritmik berbasis data. Keputusan final harus mempertimbangkan faktor personal, keluarga, finansial, dan kondisi spesifik lainnya.
</div>

{{-- SIGNATURES --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="width: 50%; text-align: center; padding: 0 20px; vertical-align: top;">
            <div style="font-size: 7pt; color: #64748b;">{{ $generatedAt->translatedFormat('d F Y') }}</div>
            <div style="font-size: 7.5pt; font-weight: bold; margin-top: 2px;">Peserta Assessment</div>
            <div style="height: 40px;"></div>
            <div style="font-size: 8pt; font-weight: bold; text-decoration: underline;">{{ $user->name ?? 'N/A' }}</div>
            <div style="font-size: 6.5pt; color: #64748b;">Mahasiswa / Calon Mahasiswa</div>
        </td>
        <td style="width: 50%; text-align: center; padding: 0 20px; vertical-align: top;">
            <div style="font-size: 7pt; color: #64748b;">{{ $generatedAt->translatedFormat('d F Y') }}</div>
            <div style="font-size: 7.5pt; font-weight: bold; margin-top: 2px;">Diverifikasi oleh</div>
            <div style="height: 40px;"></div>
            <div style="font-size: 8pt; font-weight: bold; text-decoration: underline;">{{ $generatedBy }}</div>
            <div style="font-size: 6.5pt; color: #64748b;">Administrator MajorMind</div>
        </td>
    </tr>
</table>

{{-- FOOTER BAR --}}
<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td style="background-color: #1e3a5f; padding: 4px 8px; font-size: 5.5pt; color: #ffffff; text-align: left;">
            <strong>MajorMind</strong> v2.0 &middot; AHP-TOPSIS Hybrid Engine &middot; RESMI
        </td>
        <td style="background-color: #1e3a5f; padding: 4px 8px; font-size: 5.5pt; color: #ffffff; text-align: center;">
            {{ $documentId }}
        </td>
        <td style="background-color: #1e3a5f; padding: 4px 8px; font-size: 5.5pt; color: #ffffff; text-align: right;">
            {{ $generatedAt->translatedFormat('d F Y, H:i:s') }} WIB
        </td>
    </tr>
</table>

</body>
</html>
