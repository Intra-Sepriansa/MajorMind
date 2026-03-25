<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>MajorMind Insight Report - {{ $user->name ?? 'User' }}</title>
    <style>
        @page { size: A4 portrait; margin: 8mm 12mm 10mm 12mm; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 7pt; line-height: 1.3; color: #1e293b; margin: 0; padding: 0; }
        table { border-collapse: collapse; }
        td, th { vertical-align: middle; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>

{{-- ═══════════════════════════════════════════
     PAGE 1: COVER + EXECUTIVE + ALGORITHMIC
     ═══════════════════════════════════════════ --}}

{{-- HEADER --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
    <tr>
        <td style="background-color: #1e3a8a; padding: 6px 8px; width: 35px; text-align: center;">
            @if($logoMajormind)<img src="{{ $logoMajormind }}" style="width: 24px; height: auto;">@endif
        </td>
        <td style="background-color: #1e3a8a; padding: 6px 4px; text-align: center; color: #ffffff;">
            <div style="font-size: 11pt; font-weight: bold; letter-spacing: 1px;">MAJORMIND INTELLIGENCE SYSTEM</div>
            <div style="font-size: 6.5pt; opacity: 0.8;">Laporan Analitik Komprehensif &middot; AHP-TOPSIS &middot; Profile Matching &middot; SAW Verification</div>
        </td>
        <td style="background-color: #1e3a8a; padding: 6px 8px; width: 35px; text-align: center;">
            @if($logoMajormind)<img src="{{ $logoMajormind }}" style="width: 24px; height: auto;">@endif
        </td>
    </tr>
</table>

{{-- TITLE + DOC ID --}}
<div style="text-align: center; margin-bottom: 4px;">
    <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; color: #1e3a8a;">Laporan Intelligence &amp; Validasi Ilmiah</div>
    <div style="font-size: 6pt; color: #94a3b8;">{{ $documentId }} &middot; {{ $generatedAt->translatedFormat('d F Y, H:i') }} WIB &middot; CONFIDENTIAL</div>
</div>

{{-- USER INFO ROW --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
    <tr>
        <td style="padding: 4px 8px; border: 1px solid #bfdbfe; background-color: #eff6ff; width: 34%;">
            <div style="font-size: 5.5pt; color: #3b82f6; text-transform: uppercase;">Nama</div>
            <div style="font-size: 8pt; font-weight: bold;">{{ $user->name ?? 'N/A' }}</div>
        </td>
        <td style="padding: 4px 8px; border: 1px solid #bfdbfe; background-color: #eff6ff; width: 33%;">
            <div style="font-size: 5.5pt; color: #3b82f6; text-transform: uppercase;">Rekomendasi Utama</div>
            <div style="font-size: 8pt; font-weight: bold;">{{ $topRec?->major?->name ?? 'N/A' }}</div>
        </td>
        <td style="padding: 4px 8px; border: 1px solid #bfdbfe; background-color: #eff6ff; width: 33%;">
            <div style="font-size: 5.5pt; color: #3b82f6; text-transform: uppercase;">Tanggal Assessment</div>
            <div style="font-size: 8pt; font-weight: bold;">{{ $assessment->created_at->timezone('Asia/Jakarta')->translatedFormat('d M Y') }}</div>
        </td>
    </tr>
</table>

{{-- EXECUTIVE SUMMARY --}}
@if($narrative)
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
    <tr>
        <td style="background-color: #1e3a8a; color: #ffffff; padding: 6px 10px;">
            <div style="font-size: 8pt; font-weight: bold; text-align: center; margin-bottom: 3px;">RINGKASAN INTELLIGENCE EKSEKUTIF</div>
            <div style="font-size: 6.5pt; line-height: 1.4; text-align: justify;">{{ str_replace(['**', '*'], '', $narrative['executive_summary']) }}</div>
        </td>
    </tr>
</table>
@endif

{{-- KEY STATS - 5 COLUMNS --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
    <tr>
        <td style="text-align: center; padding: 6px 4px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 20%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a8a;">{{ round($algorithmic['consensus']['overall_score'] ?? 0, 1) }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase; margin-top: 2px;">Consensus</div>
        </td>
        <td style="text-align: center; padding: 6px 4px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 20%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a8a;">{{ $psychometric['overall_reliability'] ?? 0 }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase; margin-top: 2px;">Psychometric</div>
        </td>
        <td style="text-align: center; padding: 6px 4px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 20%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a8a;">{{ round($evidence['evidence_strength']['score'] ?? 0, 1) }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase; margin-top: 2px;">Evidence</div>
        </td>
        <td style="text-align: center; padding: 6px 4px; border: 1px solid #e2e8f0; background-color: #ecfdf5; border-bottom: 2px solid #059669; width: 20%;">
            <div style="font-size: 14pt; font-weight: bold; color: #059669;">{{ round($predictive['success_probability']['overall'] ?? 0, 1) }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase; margin-top: 2px;">Success</div>
        </td>
        <td style="text-align: center; padding: 6px 4px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 20%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a8a;">{{ round($sensitivity['robustness']['overall_score'] ?? 0, 1) }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase; margin-top: 2px;">Robustness</div>
        </td>
    </tr>
</table>

{{-- ALGORITHMIC CONSENSUS TABLE --}}
<div style="font-size: 8.5pt; font-weight: bold; color: #fff; background-color: #1e3a8a; padding: 4px 8px; margin-bottom: 2px;">ALGORITHMIC CONSENSUS</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7.5pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #334155; color: #fff; padding: 4px; border: 1px solid #334155; text-align: left; font-size: 7pt;">Jurusan</th>
            <th style="background-color: #334155; color: #fff; padding: 4px; border: 1px solid #334155; text-align: center; font-size: 7pt;">TOPSIS</th>
            <th style="background-color: #334155; color: #fff; padding: 4px; border: 1px solid #334155; text-align: center; font-size: 7pt;">SAW</th>
            <th style="background-color: #334155; color: #fff; padding: 4px; border: 1px solid #334155; text-align: center; font-size: 7pt;">PM</th>
            <th style="background-color: #334155; color: #fff; padding: 4px; border: 1px solid #334155; text-align: center; font-size: 7pt;">Agreement</th>
            <th style="background-color: #334155; color: #fff; padding: 4px; border: 1px solid #334155; text-align: center; font-size: 7pt;">Level</th>
        </tr>
    </thead>
    <tbody>
        @foreach(array_slice($algorithmic['consensus']['per_major'] ?? [], 0, 10) as $cm)
            @php
                $agr = $cm['agreement_score'] ?? 0;
                $agrBg = $agr >= 85 ? '#dcfce7' : ($agr >= 65 ? '#fef9c3' : ($agr >= 45 ? '#ffedd5' : '#fee2e2'));
            @endphp
            <tr>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; font-weight: bold;">{{ \Illuminate\Support\Str::limit($cm['major_name'], 25) }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center;">#{{ $cm['ranks']['topsis'] ?? '-' }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center;">#{{ $cm['ranks']['saw'] ?? '-' }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center;">#{{ $cm['ranks']['profile_matching'] ?? '-' }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; background-color: {{ $agrBg }};">{{ $agr }}%</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center; font-size: 6.5pt;">{{ $cm['consensus_level']['level'] ?? '' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- CHART: AGREEMENT SCORE BAR CHART (SVG) --}}
@php
    $chartMajors = array_slice($algorithmic['consensus']['per_major'] ?? [], 0, 8);
    $chartHeight = count($chartMajors) * 22 + 10;
@endphp
@if(count($chartMajors) > 0)
<div style="font-size: 7.5pt; font-weight: bold; color: #475569; margin-bottom: 2px;">Agreement Score Chart</div>
<svg width="100%" height="{{ $chartHeight }}px" viewBox="0 0 500 {{ $chartHeight }}" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 6px;">
    @foreach($chartMajors as $i => $cm)
        @php
            $y = $i * 22 + 2;
            $barWidth = min(($cm['agreement_score'] ?? 0) / 100 * 320, 320);
            $barColor = ($cm['agreement_score'] ?? 0) >= 85 ? '#22c55e' : (($cm['agreement_score'] ?? 0) >= 65 ? '#3b82f6' : (($cm['agreement_score'] ?? 0) >= 45 ? '#f59e0b' : '#ef4444'));
        @endphp
        <text x="0" y="{{ $y + 13 }}" font-size="9" fill="#334155" font-family="Helvetica">{{ \Illuminate\Support\Str::limit($cm['major_name'], 20) }}</text>
        <rect x="140" y="{{ $y }}" width="{{ $barWidth }}" height="18" rx="2" fill="{{ $barColor }}" opacity="0.8"/>
        <text x="{{ 140 + $barWidth + 6 }}" y="{{ $y + 13 }}" font-size="9" fill="#334155" font-weight="bold" font-family="Helvetica">{{ $cm['agreement_score'] ?? 0 }}%</text>
    @endforeach
</svg>
@endif

{{-- ═══════════════════════════════════════════
     PART 2: PSYCHOMETRIC + EVIDENCE + PREDICTIVE
     ═══════════════════════════════════════════ --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px; margin-top: 4px;">
    <tr>
        <td style="background-color: #1e3a8a; padding: 3px 8px; text-align: center; color: #ffffff;">
            <span style="font-size: 7pt; font-weight: bold;">SECTION II: PSYCHOMETRIC VALIDATION & PREDICTIVE MODELING</span>
        </td>
    </tr>
</table>

{{-- PSYCHOMETRIC VALIDATION --}}
<div style="font-size: 8.5pt; font-weight: bold; color: #fff; background-color: #581c87; padding: 4px 8px; margin-bottom: 3px;">VALIDASI PSIKOMETRIK</div>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
    <tr>
        <td style="width: 55%; vertical-align: top; padding-right: 6px;">
            {{-- RIASEC + Grit + Logic compact cards --}}
            @if(($psychometric['riasec']['available'] ?? false))
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7.5pt; margin-bottom: 4px;">
                <tr>
                    <td style="padding: 5px 8px; border: 1px solid #d8b4fe; background-color: #faf5ff; width: 30%;">
                        <div style="font-size: 6.5pt; color: #7c3aed;">Holland Code</div>
                        <div style="font-size: 12pt; font-weight: bold; color: #581c87; margin-top: 1px;">{{ $psychometric['riasec']['holland_code'] }}</div>
                    </td>
                    <td style="padding: 5px 8px; border: 1px solid #d8b4fe; background-color: #faf5ff; width: 25%;">
                        <div style="font-size: 6.5pt; color: #7c3aed;">Diferensiasi</div>
                        <div style="font-size: 10pt; font-weight: bold; margin-top: 1px;">{{ $psychometric['riasec']['differentiation']['score'] }}%</div>
                    </td>
                    <td style="padding: 5px 8px; border: 1px solid #d8b4fe; background-color: #faf5ff; width: 25%;">
                        <div style="font-size: 6.5pt; color: #7c3aed;">Reliability</div>
                        <div style="font-size: 10pt; font-weight: bold; margin-top: 1px;">{{ $psychometric['riasec']['reliability_score'] }}%</div>
                    </td>
                    <td style="padding: 5px 8px; border: 1px solid #d8b4fe; background-color: #faf5ff; width: 20%;">
                        <div style="font-size: 6.5pt; color: #7c3aed;">Overall</div>
                        <div style="font-size: 10pt; font-weight: bold; margin-top: 1px; color: {{ $psychometric['overall_reliability'] >= 70 ? '#059669' : '#d97706' }};">{{ $psychometric['overall_reliability'] }}%</div>
                    </td>
                </tr>
            </table>
            @endif

            @if(($psychometric['grit']['available'] ?? false))
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7.5pt; margin-bottom: 4px;">
                <tr>
                    <td style="padding: 5px 8px; border: 1px solid #d8b4fe; background-color: #faf5ff;">
                        <div style="font-size: 6.5pt; color: #7c3aed;">Grit</div>
                        <div style="font-size: 10pt; font-weight: bold; margin-top: 1px;">{{ $psychometric['grit']['total_score'] }}/5</div>
                    </td>
                    <td style="padding: 5px 8px; border: 1px solid #d8b4fe; background-color: #faf5ff;">
                        <div style="font-size: 6.5pt; color: #7c3aed;">Level</div>
                        <div style="font-size: 8.5pt; font-weight: bold; margin-top: 1px;">{{ $psychometric['grit']['level'] }}</div>
                    </td>
                    <td style="padding: 5px 8px; border: 1px solid #d8b4fe; background-color: #faf5ff;">
                        <div style="font-size: 6.5pt; color: #7c3aed;">Persev.</div>
                        <div style="font-size: 8.5pt; font-weight: bold; margin-top: 1px;">{{ $psychometric['grit']['perseverance'] }}</div>
                    </td>
                    <td style="padding: 5px 8px; border: 1px solid #d8b4fe; background-color: #faf5ff;">
                        <div style="font-size: 6.5pt; color: #7c3aed;">Consist.</div>
                        <div style="font-size: 8.5pt; font-weight: bold; margin-top: 1px;">{{ $psychometric['grit']['consistency'] }}</div>
                    </td>
                </tr>
            </table>
            @endif

            @if(($psychometric['logic']['available'] ?? false))
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 6.5pt; margin-bottom: 3px;">
                <tr>
                    <td style="padding: 3px 6px; border: 1px solid #d8b4fe; background-color: #faf5ff;">
                        <div style="font-size: 5.5pt; color: #7c3aed;">Logic Theta</div>
                        <div style="font-size: 8pt; font-weight: bold;">{{ $psychometric['logic']['theta'] }}</div>
                    </td>
                    <td style="padding: 3px 6px; border: 1px solid #d8b4fe; background-color: #faf5ff;">
                        <div style="font-size: 5.5pt; color: #7c3aed;">SE</div>
                        <div style="font-size: 7pt; font-weight: bold;">{{ $psychometric['logic']['standard_error'] }}</div>
                    </td>
                    <td style="padding: 3px 6px; border: 1px solid #d8b4fe; background-color: #faf5ff;">
                        <div style="font-size: 5.5pt; color: #7c3aed;">CI 95%</div>
                        <div style="font-size: 7pt; font-weight: bold;">[{{ $psychometric['logic']['confidence_interval_95']['lower'] }}, {{ $psychometric['logic']['confidence_interval_95']['upper'] }}]</div>
                    </td>
                    <td style="padding: 3px 6px; border: 1px solid #d8b4fe; background-color: #faf5ff;">
                        <div style="font-size: 5.5pt; color: #7c3aed;">Level</div>
                        <div style="font-size: 7pt; font-weight: bold;">{{ $psychometric['logic']['ability_level'] }}</div>
                    </td>
                </tr>
            </table>
            @endif

            {{-- Bias Detection --}}
            @if(count($psychometric['bias_detection']['biases'] ?? []) > 0)
                @foreach($psychometric['bias_detection']['biases'] as $bias)
                    <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 2px 6px; font-size: 6pt; color: #991b1b; margin-bottom: 2px;">
                        <strong>{{ $bias['type'] }}</strong> ({{ $bias['severity'] }}) &mdash; {{ $bias['detail'] }}
                    </div>
                @endforeach
            @else
                <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 2px 6px; font-size: 6pt; color: #14532d;">
                    Tidak Ada Bias &mdash; Quality: {{ $psychometric['bias_detection']['data_quality_score'] ?? 0 }}%
                </div>
            @endif
        </td>
        <td style="width: 45%; vertical-align: top; padding-left: 4px;">
            {{-- RIASEC RADAR CHART (SVG) --}}
            @if(($psychometric['riasec']['available'] ?? false))
                @php
                    $riasecScores = $psychometric['riasec']['scores'] ?? [];
                    $riasecKeys = array_keys($riasecScores);
                    $riasecCount = count($riasecKeys);
                    $centerX = 100; $centerY = 95; $radius = 75;
                @endphp
                <div style="font-size: 6.5pt; font-weight: bold; color: #581c87; text-align: center; margin-bottom: 1px;">RIASEC Radar Chart</div>
                <svg width="200" height="195" viewBox="0 0 200 195" xmlns="http://www.w3.org/2000/svg">
                    {{-- Grid circles --}}
                    @foreach([0.25, 0.5, 0.75, 1.0] as $pct)
                        <circle cx="{{ $centerX }}" cy="{{ $centerY }}" r="{{ $radius * $pct }}" fill="none" stroke="#e2e8f0" stroke-width="0.5"/>
                    @endforeach

                    {{-- Axis lines + labels --}}
                    @foreach($riasecKeys as $i => $key)
                        @php
                            $angle = ($i / $riasecCount) * 2 * M_PI - M_PI / 2;
                            $x = $centerX + $radius * cos($angle);
                            $y = $centerY + $radius * sin($angle);
                            $lx = $centerX + ($radius + 12) * cos($angle);
                            $ly = $centerY + ($radius + 12) * sin($angle);
                        @endphp
                        <line x1="{{ $centerX }}" y1="{{ $centerY }}" x2="{{ $x }}" y2="{{ $y }}" stroke="#cbd5e1" stroke-width="0.5"/>
                        <text x="{{ $lx }}" y="{{ $ly + 3 }}" text-anchor="middle" font-size="7" fill="#581c87" font-weight="bold" font-family="Helvetica">{{ strtoupper(substr($key, 0, 1)) }}</text>
                    @endforeach

                    {{-- Data polygon --}}
                    @php
                        $maxScore = max(array_values($riasecScores)) ?: 100;
                        $points = '';
                        foreach ($riasecKeys as $i => $key) {
                            $angle = ($i / $riasecCount) * 2 * M_PI - M_PI / 2;
                            $val = ($riasecScores[$key] ?? 0) / $maxScore;
                            $px = $centerX + $radius * $val * cos($angle);
                            $py = $centerY + $radius * $val * sin($angle);
                            $points .= round($px, 1) . ',' . round($py, 1) . ' ';
                        }
                    @endphp
                    <polygon points="{{ trim($points) }}" fill="rgba(124,58,237,0.2)" stroke="#7c3aed" stroke-width="1.5"/>

                    {{-- Data points + values --}}
                    @foreach($riasecKeys as $i => $key)
                        @php
                            $angle = ($i / $riasecCount) * 2 * M_PI - M_PI / 2;
                            $val = ($riasecScores[$key] ?? 0) / $maxScore;
                            $px = $centerX + $radius * $val * cos($angle);
                            $py = $centerY + $radius * $val * sin($angle);
                        @endphp
                        <circle cx="{{ round($px, 1) }}" cy="{{ round($py, 1) }}" r="3" fill="#7c3aed"/>
                        <text x="{{ round($px, 1) }}" y="{{ round($py, 1) - 6 }}" text-anchor="middle" font-size="6" fill="#4c1d95" font-family="Helvetica">{{ round($riasecScores[$key] ?? 0) }}</text>
                    @endforeach
                </svg>
            @endif
        </td>
    </tr>
</table>

{{-- EVIDENCE-BASED: GAP ANALYSIS --}}
@if($evidence)
<div style="font-size: 7.5pt; font-weight: bold; color: #fff; background-color: #92400e; padding: 2px 6px; margin-bottom: 2px;">EVIDENCE: GAP ANALYSIS - {{ $evidence['major']['name'] }}</div>

@php $gaps = $evidence['gap_analysis']['behavioral_gaps'] ?? []; @endphp
@if(count($gaps) > 0)
{{-- SVG Gap Chart --}}
@php $gapChartH = count($gaps) * 16 + 8; @endphp
<svg width="100%" height="{{ $gapChartH }}px" viewBox="0 0 520 {{ $gapChartH }}" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 3px;">
    @foreach($gaps as $i => $gap)
        @php
            $y = $i * 16 + 2;
            $studentW = min(($gap['student_score'] / 100) * 200, 200);
            $targetW = min(($gap['target_score'] / 100) * 200, 200);
            $gapColor = $gap['gap'] >= 0 ? '#22c55e' : ($gap['gap'] >= -10 ? '#f59e0b' : '#ef4444');
        @endphp
        <text x="0" y="{{ $y + 10 }}" font-size="7" fill="#334155" font-family="Helvetica">{{ ucfirst(str_replace('_', ' ', \Illuminate\Support\Str::limit($gap['dimension'], 15))) }}</text>
        {{-- Target bar (faded) --}}
        <rect x="115" y="{{ $y }}" width="{{ $targetW }}" height="12" rx="1" fill="#cbd5e1" opacity="0.4"/>
        {{-- Student bar --}}
        <rect x="115" y="{{ $y }}" width="{{ $studentW }}" height="12" rx="1" fill="{{ $gapColor }}" opacity="0.75"/>
        {{-- Values --}}
        <text x="{{ 115 + max($studentW, $targetW) + 4 }}" y="{{ $y + 10 }}" font-size="7" fill="#334155" font-family="Helvetica">{{ $gap['student_score'] }}/{{ $gap['target_score'] }} ({{ ($gap['gap'] >= 0 ? '+' : '') . $gap['gap'] }})</text>
        <text x="500" y="{{ $y + 10 }}" font-size="6" fill="{{ $gapColor }}" font-weight="bold" font-family="Helvetica" text-anchor="end">{{ $gap['status'] }}</text>
    @endforeach
</svg>
@endif
@endif

{{-- PREDICTIVE SUCCESS --}}
<div style="font-size: 7.5pt; font-weight: bold; color: #fff; background-color: #0e7490; padding: 2px 6px; margin-bottom: 2px;">PREDICTIVE SUCCESS</div>

@if($predictive)
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="text-align: center; padding: 10px 4px; border: 1px solid #e2e8f0; background-color: #ecfdf5; border-bottom: 2px solid #059669; width: 25%;">
            <div style="font-size: 16pt; font-weight: bold; color: #059669;">{{ round($predictive['success_probability']['overall'] ?? 0, 1) }}%</div>
            <div style="font-size: 6pt; color: #64748b; margin-top: 2px;">SUCCESS PROB.</div>
        </td>
        <td style="text-align: center; padding: 10px 4px; border: 1px solid #e2e8f0; background-color: #eff6ff; width: 25%;">
            <div style="font-size: 16pt; font-weight: bold; color: #1e3a8a;">{{ $predictive['gpa_prediction']['expected_gpa'] ?? 'N/A' }}</div>
            <div style="font-size: 6pt; color: #64748b; margin-top: 2px;">GPA ({{ $predictive['gpa_prediction']['range_min'] ?? '-' }}-{{ $predictive['gpa_prediction']['range_max'] ?? '-' }})</div>
        </td>
        <td style="text-align: center; padding: 10px 4px; border: 1px solid #e2e8f0; width: 25%; {{ ($predictive['dropout_risk']['score'] ?? 0) >= 40 ? 'background-color: #fef2f2; border-bottom: 2px solid #dc2626;' : 'background-color: #f8fafc;' }}">
            <div style="font-size: 16pt; font-weight: bold; color: {{ ($predictive['dropout_risk']['score'] ?? 0) >= 40 ? '#dc2626' : '#1e293b' }};">{{ round($predictive['dropout_risk']['score'] ?? 0, 1) }}%</div>
            <div style="font-size: 6pt; color: #64748b; margin-top: 2px;">DROPOUT RISK</div>
        </td>
        <td style="text-align: center; padding: 10px 4px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 25%;">
            <div style="font-size: 16pt; font-weight: bold; color: #1e3a8a;">{{ $sensitivity['robustness']['overall_score'] ?? 0 }}%</div>
            <div style="font-size: 6pt; color: #64748b; margin-top: 2px;">ROBUSTNESS</div>
        </td>
    </tr>
</table>

{{-- Factor Scores Chart (SVG) --}}
@php
    $factors = $predictive['success_probability']['factor_scores'] ?? [];
    $fKeys = array_keys($factors);
    $fChartH = count($fKeys) * 16 + 8;
@endphp
@if(count($fKeys) > 0)
<div style="font-size: 6.5pt; font-weight: bold; color: #0e7490; margin-bottom: 1px;">Success Factor Scores</div>
<svg width="100%" height="{{ $fChartH }}px" viewBox="0 0 500 {{ $fChartH }}" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 3px;">
    @foreach($fKeys as $i => $fk)
        @php
            $y = $i * 16 + 2;
            $fScore = is_numeric($factors[$fk]) ? $factors[$fk] : 0;
            $barW = min($fScore / 100 * 280, 280);
            $barColor = $fScore >= 80 ? '#059669' : ($fScore >= 60 ? '#3b82f6' : ($fScore >= 40 ? '#f59e0b' : '#ef4444'));
        @endphp
        <text x="0" y="{{ $y + 10 }}" font-size="7" fill="#334155" font-family="Helvetica">{{ ucwords(str_replace('_', ' ', $fk)) }}</text>
        <rect x="140" y="{{ $y }}" width="{{ $barW }}" height="12" rx="2" fill="{{ $barColor }}" opacity="0.75"/>
        <text x="{{ 140 + $barW + 4 }}" y="{{ $y + 10 }}" font-size="7" fill="#334155" font-weight="bold" font-family="Helvetica">{{ round($fScore, 1) }}%</text>
    @endforeach
</svg>
@endif
@endif

<div class="page-break"></div>

{{-- ═══════════════════════════════════════════
     PAGE 2: SENSITIVITY + DECOMPOSITION + INSIGHTS + COHORT
     ═══════════════════════════════════════════ --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
    <tr>
        <td style="background-color: #1e3a8a; padding: 4px 8px; text-align: center; color: #ffffff;">
            <span style="font-size: 8pt; font-weight: bold;">MAJORMIND INTELLIGENCE</span>
            <span style="font-size: 6.5pt; opacity: 0.7;"> &middot; {{ $documentId }} &middot; Halaman 2</span>
        </td>
    </tr>
</table>

{{-- HYBRID DECOMPOSITION --}}
<div style="font-size: 7.5pt; font-weight: bold; color: #fff; background-color: #1e3a8a; padding: 2px 6px; margin-bottom: 2px;">HYBRID DECOMPOSITION (Top 10)</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 6.5pt; margin-bottom: 3px;">
    <thead>
        <tr>
            <th style="background-color: #334155; color: #fff; padding: 2px 3px; border: 1px solid #334155; text-align: center; font-size: 5.5pt; width: 15px;">#</th>
            <th style="background-color: #334155; color: #fff; padding: 2px 3px; border: 1px solid #334155; text-align: left; font-size: 5.5pt;">Jurusan</th>
            <th style="background-color: #334155; color: #fff; padding: 2px 3px; border: 1px solid #334155; text-align: center; font-size: 5.5pt;">Final</th>
            <th style="background-color: #334155; color: #fff; padding: 2px 3px; border: 1px solid #334155; text-align: center; font-size: 5.5pt;">TOPSIS 70%</th>
            <th style="background-color: #334155; color: #fff; padding: 2px 3px; border: 1px solid #334155; text-align: center; font-size: 5.5pt;">PM 30%</th>
            <th style="background-color: #334155; color: #fff; padding: 2px 3px; border: 1px solid #334155; text-align: center; font-size: 5.5pt;">SAW</th>
            <th style="background-color: #334155; color: #fff; padding: 2px 3px; border: 1px solid #334155; text-align: center; font-size: 5.5pt;">Dom.</th>
        </tr>
    </thead>
    <tbody>
        @foreach(($algorithmic['decomposition'] ?? []) as $dec)
            <tr>
                <td style="padding: 1px 3px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">{{ $dec['rank'] }}</td>
                <td style="padding: 1px 3px; border: 1px solid #e2e8f0; font-weight: bold;">{{ \Illuminate\Support\Str::limit($dec['major_name'], 22) }}</td>
                <td style="padding: 1px 3px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: #1e3a8a;">{{ round($dec['final_score'] * 100, 1) }}%</td>
                <td style="padding: 1px 3px; border: 1px solid #e2e8f0; text-align: center;">{{ round($dec['contributions']['topsis']['raw'] * 100, 1) }}%</td>
                <td style="padding: 1px 3px; border: 1px solid #e2e8f0; text-align: center;">{{ round($dec['contributions']['profile_matching']['raw'] * 100, 1) }}%</td>
                <td style="padding: 1px 3px; border: 1px solid #e2e8f0; text-align: center;">#{{ $dec['saw_rank'] ?? '-' }}</td>
                <td style="padding: 1px 3px; border: 1px solid #e2e8f0; text-align: center; font-size: 5.5pt;">{{ strtoupper(substr($dec['dominant'], 0, 3)) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- DECOMPOSITION CHART (SVG stacked bars) --}}
@php $decData = array_slice($algorithmic['decomposition'] ?? [], 0, 8); $decH = count($decData) * 18 + 8; @endphp
@if(count($decData) > 0)
<div style="font-size: 6.5pt; font-weight: bold; color: #475569; margin-bottom: 1px;">TOPSIS vs Profile Matching Contribution</div>
<svg width="100%" height="{{ $decH }}px" viewBox="0 0 520 {{ $decH }}" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 4px;">
    @foreach($decData as $i => $d)
        @php
            $y = $i * 18 + 2;
            $tW = min($d['contributions']['topsis']['percentage'] / 100 * 300, 300);
            $pW = min($d['contributions']['profile_matching']['percentage'] / 100 * 300, 300);
        @endphp
        <text x="0" y="{{ $y + 11 }}" font-size="7" fill="#334155" font-family="Helvetica">{{ \Illuminate\Support\Str::limit($d['major_name'], 18) }}</text>
        <rect x="130" y="{{ $y }}" width="{{ $tW }}" height="14" rx="1" fill="#3b82f6" opacity="0.7"/>
        <rect x="{{ 130 + $tW }}" y="{{ $y }}" width="{{ $pW }}" height="14" rx="1" fill="#8b5cf6" opacity="0.7"/>
        <text x="{{ 130 + $tW + $pW + 4 }}" y="{{ $y + 11 }}" font-size="6" fill="#334155" font-family="Helvetica">{{ round($d['final_score'] * 100, 1) }}%</text>
    @endforeach
    {{-- Legend --}}
    <rect x="130" y="{{ $decH - 6 }}" width="8" height="5" fill="#3b82f6" opacity="0.7"/>
    <text x="140" y="{{ $decH - 1 }}" font-size="6" fill="#334155" font-family="Helvetica">TOPSIS</text>
    <rect x="180" y="{{ $decH - 6 }}" width="8" height="5" fill="#8b5cf6" opacity="0.7"/>
    <text x="190" y="{{ $decH - 1 }}" font-size="6" fill="#334155" font-family="Helvetica">Profile Matching</text>
</svg>
@endif

{{-- SENSITIVITY --}}
<div style="font-size: 8.5pt; font-weight: bold; color: #fff; background-color: #b91c1c; padding: 4px 8px; margin-bottom: 3px;">SENSITIVITY ANALYSIS</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7.5pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #991b1b; color: #fff; padding: 4px; border: 1px solid #991b1b; text-align: left; font-size: 6.5pt;">Kriteria</th>
            <th style="background-color: #991b1b; color: #fff; padding: 4px; border: 1px solid #991b1b; text-align: center; font-size: 6.5pt;">Stability</th>
            <th style="background-color: #991b1b; color: #fff; padding: 4px; border: 1px solid #991b1b; text-align: center; font-size: 6.5pt;">Reversals</th>
            <th style="background-color: #991b1b; color: #fff; padding: 4px; border: 1px solid #991b1b; text-align: center; font-size: 6.5pt;">Critical</th>
        </tr>
    </thead>
    <tbody>
        @foreach(($sensitivity['weight_sensitivity'] ?? []) as $ws)
            <tr>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; font-weight: bold;">{{ ucfirst(str_replace('_', ' ', $ws['criterion'])) }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: {{ $ws['stability_score'] >= 80 ? '#059669' : ($ws['stability_score'] >= 50 ? '#d97706' : '#dc2626') }};">{{ $ws['stability_score'] }}%</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center;">{{ $ws['reversals'] }}/6</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center; font-size: 6.5pt;">{{ $ws['critical'] ? 'YES' : 'No' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- NARRATIVE INSIGHTS --}}
<div style="font-size: 8.5pt; font-weight: bold; color: #fff; background-color: #4338ca; padding: 4px 8px; margin-bottom: 3px;">KEY INSIGHTS</div>

@if(!empty($narrative['key_takeaways']))
    @foreach($narrative['key_takeaways'] as $takeaway)
        <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; padding: 4px 8px; font-size: 7.5pt; color: #1e1b4b; margin-bottom: 2px;">
            {{ str_replace(['🎯','✅','⚠️','❌','📊'], ['>>','[OK]','[!]','[X]','[DATA]'], $takeaway['icon']) }}
            {{ str_replace(['**', '*'], '', $takeaway['text']) }}
        </div>
    @endforeach
@endif

@if(isset($narrative['confidence_statement']))
<div style="background-color: #1e3a8a; color: #ffffff; padding: 6px 10px; font-size: 7.5pt; margin-top: 4px;">
    {{ str_replace(['**', '*'], '', $narrative['confidence_statement']) }}
</div>
@endif

{{-- ═══════════════════════════════════════════
     PART 4: COHORT + SIGNATURES
     ═══════════════════════════════════════════ --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px; margin-top: 4px;">
    <tr>
        <td style="background-color: #1e3a8a; padding: 3px 8px; text-align: center; color: #ffffff;">
            <span style="font-size: 7pt; font-weight: bold;">SECTION IV: BENCHMARKING & SIGNATURES</span>
        </td>
    </tr>
</table>

{{-- COHORT BENCHMARKING --}}
<div style="font-size: 8.5pt; font-weight: bold; color: #fff; background-color: #065f46; padding: 4px 8px; margin-bottom: 3px;">COHORT BENCHMARKING ({{ $cohort['cohort_size'] ?? 0 }} profil serupa)</div>

@if(isset($cohort['cohort_position']))
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="text-align: center; padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 33%;">
            <div style="font-size: 16pt; font-weight: bold; color: #065f46;">P{{ $cohort['cohort_position']['overall_percentile'] ?? 0 }}</div>
            <div style="font-size: 6pt; color: #64748b; margin-top: 2px;">PERCENTILE</div>
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 34%;">
            <div style="font-size: 12pt; font-weight: bold;">{{ $cohort['cohort_position']['position'] ?? 'N/A' }}</div>
            <div style="font-size: 6pt; color: #64748b; margin-top: 2px;">POSITION</div>
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 33%;">
            <div style="font-size: 16pt; font-weight: bold;">{{ $cohort['cohort_size'] ?? 0 }}</div>
            <div style="font-size: 6pt; color: #64748b; margin-top: 2px;">COHORT SIZE</div>
        </td>
    </tr>
</table>
@endif

{{-- Dimension Benchmarks with SVG Chart --}}
@if(!empty($cohort['dimension_benchmarks']))
@php $benchmarks = $cohort['dimension_benchmarks']; $bmH = count($benchmarks) * 22 + 10; @endphp
<div style="font-size: 7.5pt; font-weight: bold; color: #065f46; margin-bottom: 2px;">Anda vs Cohort Mean</div>
<svg width="100%" height="{{ $bmH }}px" viewBox="0 0 520 {{ $bmH }}" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 6px;">
    @foreach($benchmarks as $i => $bm)
        @php
            $y = $i * 22 + 2;
            $userW = min(($bm['user_score'] / 100) * 250, 250);
            $meanW = min(($bm['cohort_mean'] / 100) * 250, 250);
            $userColor = $bm['percentile'] >= 75 ? '#059669' : ($bm['percentile'] >= 25 ? '#3b82f6' : '#f59e0b');
        @endphp
        <text x="0" y="{{ $y + 13 }}" font-size="8" fill="#334155" font-family="Helvetica">{{ ucfirst(str_replace('_', ' ', \Illuminate\Support\Str::limit($bm['dimension'], 14))) }}</text>
        {{-- Cohort mean (faded) --}}
        <rect x="115" y="{{ $y }}" width="{{ $meanW }}" height="18" rx="2" fill="#94a3b8" opacity="0.25"/>
        {{-- User bar --}}
        <rect x="115" y="{{ $y + 2 }}" width="{{ $userW }}" height="14" rx="2" fill="{{ $userColor }}" opacity="0.7"/>
        <text x="{{ 115 + max($userW, $meanW) + 6 }}" y="{{ $y + 13 }}" font-size="8" fill="#334155" font-family="Helvetica">{{ $bm['user_score'] }} vs {{ $bm['cohort_mean'] }} (P{{ $bm['percentile'] }})</text>
    @endforeach
</svg>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7.5pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #065f46; color: #fff; padding: 4px; border: 1px solid #065f46; text-align: left; font-size: 6.5pt;">Dimensi</th>
            <th style="background-color: #065f46; color: #fff; padding: 4px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Anda</th>
            <th style="background-color: #065f46; color: #fff; padding: 4px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Mean</th>
            <th style="background-color: #065f46; color: #fff; padding: 4px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Ptile</th>
            <th style="background-color: #065f46; color: #fff; padding: 4px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Z</th>
            <th style="background-color: #065f46; color: #fff; padding: 4px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Pos</th>
        </tr>
    </thead>
    <tbody>
        @foreach($benchmarks as $db)
            <tr>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; font-weight: bold;">{{ ucfirst(str_replace('_', ' ', $db['dimension'])) }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">{{ $db['user_score'] }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center;">{{ $db['cohort_mean'] }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: {{ $db['percentile'] >= 75 ? '#059669' : ($db['percentile'] >= 25 ? '#334155' : '#dc2626') }};">P{{ $db['percentile'] }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center;">{{ $db['z_score'] }}</td>
                <td style="padding: 3px 6px; border: 1px solid #e2e8f0; text-align: center; font-size: 6.5pt;">{{ $db['position'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@endif

{{-- Peer Insights --}}
@if(!empty($cohort['peer_insights']))
    @foreach(array_slice($cohort['peer_insights'], 0, 4) as $pi)
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 2px 6px; font-size: 6pt; color: #14532d; margin-bottom: 1px;">
            {{ str_replace(['👥','💪','📊','✅','🔍','ℹ️'], ['[PEER]','[+]','[DATA]','[OK]','[?]','[i]'], $pi['icon'] ?? '') }}
            {{ str_replace(['**', '*'], '', $pi['text']) }}
        </div>
    @endforeach
@endif

{{-- DISCLAIMER --}}
<div style="background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 3px 6px; font-size: 6pt; color: #78350f; margin-top: 6px; margin-bottom: 8px;">
    <strong>Catatan:</strong> Laporan ini dihasilkan oleh sistem komputasi algoritmik. Prediksi bersifat estimasi heuristik. Keputusan final harus mempertimbangkan faktor personal, keluarga, finansial, dan konseling profesional.
</div>

{{-- SIGNATURES --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="width: 50%; text-align: center; padding: 0 20px; vertical-align: top;">
            <div style="font-size: 6pt; color: #64748b;">{{ $generatedAt->translatedFormat('d F Y') }}</div>
            <div style="font-size: 7pt; font-weight: bold; margin-top: 1px;">Peserta Assessment</div>
            <div style="height: 35px;"></div>
            <div style="font-size: 7.5pt; font-weight: bold; text-decoration: underline;">{{ $user->name ?? 'N/A' }}</div>
            <div style="font-size: 6pt; color: #64748b;">Mahasiswa / Calon Mahasiswa</div>
        </td>
        <td style="width: 50%; text-align: center; padding: 0 20px; vertical-align: top;">
            <div style="font-size: 6pt; color: #64748b;">{{ $generatedAt->translatedFormat('d F Y') }}</div>
            <div style="font-size: 7pt; font-weight: bold; margin-top: 1px;">Diverifikasi oleh</div>
            <div style="height: 35px;"></div>
            <div style="font-size: 7.5pt; font-weight: bold; text-decoration: underline;">{{ $generatedBy }}</div>
            <div style="font-size: 6pt; color: #64748b;">Administrator MajorMind</div>
        </td>
    </tr>
</table>

{{-- FOOTER --}}
<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td style="background-color: #1e3a8a; padding: 3px 6px; font-size: 5pt; color: #ffffff; text-align: left;">
            <strong>MajorMind</strong> v2.0 &middot; Intelligence Engine &middot; CONFIDENTIAL
        </td>
        <td style="background-color: #1e3a8a; padding: 3px 6px; font-size: 5pt; color: #ffffff; text-align: center;">
            {{ $documentId }}
        </td>
        <td style="background-color: #1e3a8a; padding: 3px 6px; font-size: 5pt; color: #ffffff; text-align: right;">
            {{ $generatedAt->translatedFormat('d F Y, H:i:s') }} WIB
        </td>
    </tr>
</table>

</body>
</html>
