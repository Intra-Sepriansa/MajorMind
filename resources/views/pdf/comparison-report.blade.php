<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>MajorMind Comparison Report</title>
    <style>
        @page { size: A4 landscape; margin: 5mm 7mm 5mm 7mm; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 6.5pt; line-height: 1.2; color: #1e293b; margin: 0; padding: 0; }
        table { border-collapse: collapse; }
        td, th { vertical-align: middle; }
    </style>
</head>
<body>

{{-- ══════════════════════════════════════════════
     HEADER BAR
     ══════════════════════════════════════════════ --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 5px;">
    <tr>
        <td style="background-color: #1e3a5f; padding: 6px 10px; width: 32px; text-align: center;">
            @if($logoMajormind)<img src="{{ $logoMajormind }}" style="width: 24px; height: auto;">@endif
        </td>
        <td style="background-color: #1e3a5f; padding: 6px 4px; text-align: center; color: #ffffff;">
            <div style="font-size: 10pt; font-weight: bold; letter-spacing: 1px;">MAJORMIND DECISION SUPPORT SYSTEM</div>
            <div style="font-size: 6.5pt; opacity: 0.85;">Laporan Analisis Komparatif Multi-Dimensi</div>
            <div style="font-size: 5.5pt; opacity: 0.6;">AHP-TOPSIS · Profile Matching · SAW</div>
        </td>
        <td style="background-color: #1e3a5f; padding: 6px 10px; width: 140px; text-align: right; color: #ffffff; font-size: 5.5pt; line-height: 1.4;">
            {{ $documentId }}<br>
            {{ $generatedAt->translatedFormat('d M Y, H:i') }} WIB<br>
            {{ $assessment->user->name ?? 'N/A' }}
        </td>
    </tr>
</table>

{{-- ══════════════════════════════════════════════
     SCORE CARDS
     ══════════════════════════════════════════════ --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 5px;">
    <tr>
        @foreach($majors as $major)
            @php $rec = $recResults[$major->id] ?? null; @endphp
            <td style="text-align: center; padding: 5px 3px; border: 1px solid #e2e8f0; {{ $rec && $rec->rank == 1 ? 'background-color: #ecfdf5; border-bottom: 3px solid #059669;' : 'background-color: #f8fafc;' }}">
                <div style="font-size: 6.5pt; font-weight: bold; color: #1e3a5f;">{{ $major->name }}</div>
                <div style="font-size: 13pt; font-weight: bold; color: #0f172a;">{{ $rec ? round($rec->final_score * 100, 1) . '%' : '—' }}</div>
                <div style="font-size: 5.5pt; color: #64748b;">
                    @if($rec && $rec->rank == 1)
                        <span style="background-color: #059669; color: #ffffff; font-size: 5pt; padding: 1px 4px; font-weight: bold;">BEST FIT</span>
                    @elseif($rec)
                        Rank #{{ $rec->rank }}
                    @else — @endif
                </div>
            </td>
        @endforeach
    </tr>
</table>

@if(isset($comparisonMatrix['highlights']['best_fit']))
    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 3px 6px; font-size: 5.5pt; color: #0c4a6e; margin-bottom: 4px;">
        <strong>Best Fit:</strong> {{ $comparisonMatrix['highlights']['best_fit']['major_name'] }} (fit score: {{ $comparisonMatrix['highlights']['best_fit']['score'] }})
    </div>
@endif

{{-- ══════════════════════════════════════════════
     SECTION 1: COMPARISON MATRIX
     ══════════════════════════════════════════════ --}}
<div style="font-size: 7pt; font-weight: bold; color: #ffffff; background-color: #166534; padding: 3px 8px; margin-bottom: 3px; letter-spacing: 0.5px;">MATRIKS PERBANDINGAN MULTI-DIMENSI</div>

@php $hasUserCol = false; @endphp
@foreach($comparisonMatrix['matrix'] as $cat)
    @foreach($cat['dimensions'] as $dim)
        @if($dim['user_value'] !== null)
            @php $hasUserCol = true; @endphp
            @break 2
        @endif
    @endforeach
@endforeach

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 6pt; margin-bottom: 4px;">
    <thead>
        <tr>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 5px; border: 1px solid #1e3a5f; text-align: left; width: 90px;">Dimensi</th>
            @if($hasUserCol)<th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center; width: 32px;">Profil</th>@endif
            @foreach($majors as $major)
                <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center;">{{ $major->name }}</th>
            @endforeach
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center; width: 48px;">Terbaik</th>
        </tr>
    </thead>
    <tbody>
        @foreach($comparisonMatrix['matrix'] as $category)
            <tr>
                <td colspan="{{ 2 + count($majors) + ($hasUserCol ? 1 : 0) }}" style="background-color: #475569; color: #ffffff; font-weight: bold; font-size: 6pt; padding: 2px 5px; border: 1px solid #475569;">{{ strtoupper($category['category_name']) }}</td>
            </tr>
            @foreach($category['dimensions'] as $dimension)
                <tr>
                    <td style="font-weight: bold; padding: 2px 5px; border: 1px solid #cbd5e1;">{{ $dimension['label'] }}</td>
                    @if($hasUserCol)
                        <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1; background-color: #eff6ff;">{{ $dimension['user_value'] !== null ? round($dimension['user_value'], 2) : '—' }}</td>
                    @endif
                    @foreach($majors as $major)
                        @php
                            $val = $dimension['values'][$major->id] ?? null;
                            $rawValues = collect($dimension['values'])->pluck('raw');
                            $isBest = $val && $val['raw'] == $rawValues->max();
                            $isWorst = $val && $val['raw'] == $rawValues->min() && $rawValues->max() != $rawValues->min();
                            $bgStyle = $isBest ? 'background-color: #dcfce7; color: #14532d; font-weight: bold;' : ($isWorst ? 'background-color: #fee2e2; color: #7f1d1d;' : '');
                        @endphp
                        <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1; {{ $bgStyle }}">{{ $val ? round($val['raw'], 2) : '—' }}@if($val && $val['gap'] !== null) <span style="font-size: 5pt; font-weight: bold; color: {{ $val['gap_status'] === 'exceed' ? '#059669' : '#dc2626' }};">({{ $val['gap_status'] === 'exceed' ? '+' : '' }}{{ $val['gap'] }})</span>@endif</td>
                    @endforeach
                    <td style="text-align: center; font-size: 5pt; font-weight: bold; color: #1e3a5f; padding: 2px 3px; border: 1px solid #cbd5e1;">{{ ($majors->firstWhere('id', $dimension['best_major_id']))->name ?? '—' }}</td>
                </tr>
            @endforeach
        @endforeach
    </tbody>
</table>

{{-- ══════════════════════════════════════════════
     SECTION 2: ALGORITHM + RECOMMENDATION
     ══════════════════════════════════════════════ --}}
<div style="font-size: 7pt; font-weight: bold; color: #ffffff; background-color: #1e3a5f; padding: 3px 8px; margin-bottom: 3px; letter-spacing: 0.5px;">ANALISIS ALGORITMIK &amp; REKOMENDASI AKHIR</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 6pt; margin-bottom: 4px;">
    <thead>
        <tr>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 5px; border: 1px solid #1e3a5f; text-align: left;">Jurusan</th>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center;">Final Score</th>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center;">TOPSIS</th>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center;">SAW</th>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center;">Profile Matching</th>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center;">Behavioral</th>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center;">Consensus</th>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center;">Rank Var.</th>
            <th style="background-color: #1e3a5f; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #1e3a5f; text-align: center;">Pareto</th>
        </tr>
    </thead>
    <tbody>
        @foreach($majors as $major)
            @php
                $rec = $recResults[$major->id] ?? null;
                $bd = $algorithmBreakdown['breakdown'][$major->id] ?? null;
                $paretoPoint = collect($paretoAnalysis['all_points'])->firstWhere('major_id', $major->id);
                $cs = $bd['consensus_score'] ?? 0;
                $conStyle = $cs > 80 ? 'background-color: #dcfce7; color: #14532d; font-weight: bold;' : ($cs > 60 ? 'background-color: #fef9c3; color: #713f12; font-weight: bold;' : 'background-color: #fee2e2; color: #7f1d1d; font-weight: bold;');
                $paretoStyle = ($paretoPoint && !$paretoPoint['is_dominated']) ? 'background-color: #dcfce7; color: #14532d; font-weight: bold;' : ($paretoPoint && $paretoPoint['is_dominated'] ? 'background-color: #fee2e2; color: #7f1d1d;' : '');
            @endphp
            <tr>
                <td style="font-weight: bold; text-align: left; padding: 2px 5px; border: 1px solid #cbd5e1;">{{ $major->name }}</td>
                <td style="font-weight: bold; color: #1e3a5f; font-size: 7pt; text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1;">{{ $rec ? round($rec->final_score * 100, 1) . '%' : '—' }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1;">#{{ $bd['algorithm_ranks']['topsis'] ?? '—' }} / {{ round($bd['algorithm_scores']['topsis'] ?? 0, 3) }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1;">#{{ $bd['algorithm_ranks']['saw'] ?? '—' }} / {{ round($bd['algorithm_scores']['saw'] ?? 0, 3) }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1;">#{{ $bd['algorithm_ranks']['profile_matching'] ?? '—' }} / {{ round($bd['algorithm_scores']['profile_matching'] ?? 0, 3) }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1;">{{ $rec ? round($rec->behavioral_score, 3) : '—' }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1; {{ $conStyle }}">{{ $bd ? round($bd['consensus_score'], 1) . '%' : '—' }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1;">{{ $bd ? round($bd['rank_variance'], 2) : '—' }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1; {{ $paretoStyle }}">{{ $paretoPoint ? ($paretoPoint['is_dominated'] ? 'Dominated' : 'Optimal') : '—' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- ══════════════════════════════════════════════
     SECTION 3: PARETO TRADE-OFF
     ══════════════════════════════════════════════ --}}
@if(!empty($paretoAnalysis['trade_off_analysis']))
<div style="font-size: 7pt; font-weight: bold; color: #ffffff; background-color: #581c87; padding: 3px 8px; margin-bottom: 3px; letter-spacing: 0.5px;">PARETO TRADE-OFF &mdash; {{ strtoupper($paretoAnalysis['dimension_1']['label']) }} vs {{ strtoupper($paretoAnalysis['dimension_2']['label']) }}</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 6pt; margin-bottom: 4px;">
    <thead>
        <tr>
            <th style="background-color: #581c87; color: #ffffff; font-size: 5.5pt; padding: 3px 5px; border: 1px solid #581c87; text-align: left;">Dari / Ke</th>
            <th style="background-color: #581c87; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #581c87; text-align: center;">Gain ({{ $paretoAnalysis['dimension_1']['label'] }})</th>
            <th style="background-color: #581c87; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #581c87; text-align: center;">Loss ({{ $paretoAnalysis['dimension_2']['label'] }})</th>
            <th style="background-color: #581c87; color: #ffffff; font-size: 5.5pt; padding: 3px 3px; border: 1px solid #581c87; text-align: center;">Trade-Off Ratio</th>
        </tr>
    </thead>
    <tbody>
        @foreach($paretoAnalysis['trade_off_analysis'] as $to)
            <tr>
                <td style="font-weight: bold; text-align: left; padding: 2px 5px; border: 1px solid #cbd5e1;">{{ $to['from_major'] }} &gt; {{ $to['to_major'] }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">+{{ $to['gain_amount'] }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1; color: #dc2626; font-weight: bold;">-{{ $to['loss_amount'] }}</td>
                <td style="text-align: center; padding: 2px 3px; border: 1px solid #cbd5e1;">{{ $to['trade_off_ratio'] ?? 'Inf' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@endif

{{-- ══════════════════════════════════════════════
     INFO BARS
     ══════════════════════════════════════════════ --}}
@if(isset($algorithmBreakdown['consensus_analysis']))
<div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 3px 6px; font-size: 5.5pt; color: #0c4a6e; margin-bottom: 3px;">
    <strong>Consensus Analysis:</strong> Average {{ $algorithmBreakdown['consensus_analysis']['average_consensus'] }}%
    (min {{ $algorithmBreakdown['consensus_analysis']['min_consensus'] }}% · max {{ $algorithmBreakdown['consensus_analysis']['max_consensus'] }}%)
    — {{ $algorithmBreakdown['consensus_analysis']['interpretation'] }}
    &nbsp;|&nbsp;
    <strong>Bobot:</strong>
    @foreach($algorithmBreakdown['algorithm_weights'] as $algo => $weight){{ strtoupper(str_replace('_', ' ', $algo)) }}: {{ round($weight * 100) }}%{{ !$loop->last ? ' · ' : '' }}@endforeach
</div>
@endif

<div style="background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 3px 6px; font-size: 5.5pt; color: #78350f; margin-bottom: 5px;">
    <strong>Catatan Penting:</strong> Laporan ini merupakan hasil analisis algoritmik multi-dimensi. Keputusan final harus mempertimbangkan faktor personal, keluarga, finansial, dan kondisi spesifik lainnya yang tidak tertangkap dalam model kuantitatif.
</div>

{{-- ══════════════════════════════════════════════
     SIGNATURE SECTION
     ══════════════════════════════════════════════ --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 5px;">
    <tr>
        <td style="width: 50%; text-align: center; padding: 0 20px; vertical-align: top;">
            <div style="font-size: 6pt; color: #64748b;">{{ $generatedAt->translatedFormat('d F Y') }}</div>
            <div style="font-size: 6.5pt; font-weight: bold; margin-top: 2px;">Peserta Assessment</div>
            <div style="height: 40px;"></div>
            <div style="font-size: 7pt; font-weight: bold; text-decoration: underline;">{{ $assessment->user->name ?? 'N/A' }}</div>
            <div style="font-size: 5.5pt; color: #64748b;">Mahasiswa / Calon Mahasiswa</div>
        </td>
        <td style="width: 50%; text-align: center; padding: 0 20px; vertical-align: top;">
            <div style="font-size: 6pt; color: #64748b;">{{ $generatedAt->translatedFormat('d F Y') }}</div>
            <div style="font-size: 6.5pt; font-weight: bold; margin-top: 2px;">Diverifikasi oleh</div>
            <div style="height: 40px;"></div>
            <div style="font-size: 7pt; font-weight: bold; text-decoration: underline;">{{ $generatedBy }}</div>
            <div style="font-size: 5.5pt; color: #64748b;">Administrator MajorMind</div>
        </td>
    </tr>
</table>

{{-- ══════════════════════════════════════════════
     FOOTER BAR
     ══════════════════════════════════════════════ --}}
<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td style="background-color: #1e3a5f; padding: 4px 8px; font-size: 5pt; color: #ffffff; text-align: left;">
            <strong>MajorMind</strong> v2.0 · Multi-Algorithm Comparison Engine · RESMI
        </td>
        <td style="background-color: #1e3a5f; padding: 4px 8px; font-size: 5pt; color: #ffffff; text-align: center;">
            {{ $documentId }}
        </td>
        <td style="background-color: #1e3a5f; padding: 4px 8px; font-size: 5pt; color: #ffffff; text-align: right;">
            {{ $generatedAt->translatedFormat('d F Y, H:i:s') }} WIB
        </td>
    </tr>
</table>

</body>
</html>
