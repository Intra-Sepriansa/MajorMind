{{-- ══════════════════════════════════════════════
     PAGE 7: PREDICTIVE SUCCESS MODELING
     ══════════════════════════════════════════════ --}}
@include('pdf.insight-partials.page-header', ['pageNum' => 7])

<div style="font-size: 9pt; font-weight: bold; color: #ffffff; background-color: #0e7490; padding: 4px 8px; margin-bottom: 4px;">PREDICTIVE SUCCESS MODELING</div>

@if($predictive)
{{-- Success Probability + GPA + Dropout --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="text-align: center; padding: 8px; border: 1px solid #e2e8f0; background-color: #ecfdf5; border-bottom: 2px solid #059669; width: 33%;">
            <div style="font-size: 16pt; font-weight: bold; color: #059669;">{{ round($predictive['success_probability']['overall'] ?? 0, 1) }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">Success Probability</div>
            <div style="font-size: 6pt; color: #059669;">{{ $predictive['success_probability']['level'] ?? '' }}</div>
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #e2e8f0; background-color: #eff6ff; width: 34%;">
            <div style="font-size: 16pt; font-weight: bold; color: #1e3a8a;">{{ $predictive['gpa_prediction']['expected_gpa'] ?? 'N/A' }}</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">Predicted GPA</div>
            <div style="font-size: 6pt; color: #3b82f6;">Range: {{ $predictive['gpa_prediction']['range_min'] ?? '-' }} - {{ $predictive['gpa_prediction']['range_max'] ?? '-' }}</div>
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #e2e8f0; width: 33%; {{ ($predictive['dropout_risk']['score'] ?? 0) >= 40 ? 'background-color: #fef2f2; border-bottom: 2px solid #dc2626;' : 'background-color: #f8fafc;' }}">
            <div style="font-size: 16pt; font-weight: bold; color: {{ ($predictive['dropout_risk']['score'] ?? 0) >= 40 ? '#dc2626' : '#1e293b' }};">{{ round($predictive['dropout_risk']['score'] ?? 0, 1) }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">Dropout Risk</div>
            <div style="font-size: 6pt;">{{ $predictive['dropout_risk']['level'] ?? '' }}</div>
        </td>
    </tr>
</table>

{{-- Factor Scores --}}
<div style="font-size: 8pt; font-weight: bold; color: #0e7490; margin-bottom: 4px;">Faktor Penentu Keberhasilan</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 5px; border: 1px solid #0e7490; text-align: left; font-size: 6.5pt;">Faktor</th>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 3px; border: 1px solid #0e7490; text-align: center; font-size: 6.5pt; width: 40px;">Skor</th>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 3px; border: 1px solid #0e7490; text-align: center; font-size: 6.5pt; width: 40px;">Bobot</th>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 5px; border: 1px solid #0e7490; text-align: left; font-size: 6.5pt;">Visualisasi</th>
        </tr>
    </thead>
    <tbody>
        @foreach(($predictive['success_probability']['factor_scores'] ?? []) as $factor => $score)
            @php $weight = $predictive['success_probability']['factor_weights'][$factor] ?? 0; @endphp
            <tr>
                <td style="padding: 2px 5px; border: 1px solid #cbd5e1; font-weight: bold;">{{ ucwords(str_replace('_', ' ', $factor)) }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">{{ is_numeric($score) ? round($score, 1) : 'N/A' }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center;">{{ round($weight * 100) }}%</td>
                <td style="padding: 3px 5px; border: 1px solid #cbd5e1;">
                    <div style="width: 100%; height: 8px; background-color: #e2e8f0; overflow: hidden;">
                        <div style="height: 8px; width: {{ is_numeric($score) ? min($score, 100) : 0 }}%; background-color: #0891b2;"></div>
                    </div>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- Feature Importance --}}
<div style="font-size: 8pt; font-weight: bold; color: #0e7490; margin-bottom: 4px;">Feature Importance (Top 8)</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 5px; border: 1px solid #0e7490; text-align: left; font-size: 6.5pt;">Feature</th>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 3px; border: 1px solid #0e7490; text-align: center; font-size: 6.5pt;">Value</th>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 3px; border: 1px solid #0e7490; text-align: center; font-size: 6.5pt;">Target</th>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 3px; border: 1px solid #0e7490; text-align: center; font-size: 6.5pt;">Direction</th>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 3px; border: 1px solid #0e7490; text-align: center; font-size: 6.5pt;">Importance</th>
        </tr>
    </thead>
    <tbody>
        @foreach(array_slice($predictive['feature_importance'] ?? [], 0, 8) as $feat)
            <tr>
                <td style="padding: 2px 5px; border: 1px solid #cbd5e1; font-weight: bold;">{{ $feat['feature'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center;">{{ is_numeric($feat['value']) ? round($feat['value'], 1) : $feat['value'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center;">{{ is_numeric($feat['target']) ? round($feat['target'], 1) : $feat['target'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; {{ $feat['direction'] === 'positive' ? 'color: #059669;' : 'color: #dc2626;' }}">{{ $feat['direction'] === 'positive' ? '+' : '-' }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">{{ $feat['importance'] }}%</td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- Risk Factors + Pathway --}}
@if(!empty($predictive['risk_factors']))
<div style="font-size: 8pt; font-weight: bold; color: #991b1b; margin-bottom: 4px;">Faktor Risiko</div>
@foreach($predictive['risk_factors'] as $risk)
    <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 3px 8px; font-size: 6.5pt; color: #991b1b; margin-bottom: 2px;">
        <strong>{{ $risk['factor'] }}</strong> (Gap: {{ $risk['gap'] }}, Severity: {{ $risk['severity'] }}) &mdash; {{ $risk['recommendation'] }}
    </div>
@endforeach
@endif

<div style="font-size: 8pt; font-weight: bold; color: #0e7490; margin-top: 6px; margin-bottom: 4px;">Success Pathway</div>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 4px;">
    <thead>
        <tr>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 5px; border: 1px solid #0e7490; text-align: left; font-size: 6.5pt;">Phase</th>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 3px; border: 1px solid #0e7490; text-align: center; font-size: 6.5pt;">Priority</th>
            <th style="background-color: #0e7490; color: #fff; padding: 3px 5px; border: 1px solid #0e7490; text-align: left; font-size: 6.5pt;">Action</th>
        </tr>
    </thead>
    <tbody>
        @foreach(($predictive['success_pathway'] ?? []) as $step)
            <tr>
                <td style="padding: 2px 5px; border: 1px solid #cbd5e1; font-weight: bold;">{{ $step['phase'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-size: 6pt; {{ $step['priority'] === 'Critical' ? 'color: #dc2626; font-weight: bold;' : '' }}">{{ $step['priority'] }}</td>
                <td style="padding: 2px 5px; border: 1px solid #cbd5e1; font-size: 6pt;">{{ $step['action'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<div style="background-color: #eff6ff; border: 1px solid #93c5fd; padding: 3px 8px; font-size: 6pt; color: #1e40af;">
    <strong>Model:</strong> {{ $predictive['model_info']['method'] ?? 'N/A' }} &middot; {{ $predictive['model_info']['confidence'] ?? '' }}
</div>
@else
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 8px; font-size: 7pt; color: #64748b;">Data prediktif tidak tersedia.</div>
@endif

<div class="page-break"></div>

{{-- ══════════════════════════════════════════════
     PAGE 8: SENSITIVITY ANALYSIS
     ══════════════════════════════════════════════ --}}
@include('pdf.insight-partials.page-header', ['pageNum' => 8])

<div style="font-size: 9pt; font-weight: bold; color: #ffffff; background-color: #b91c1c; padding: 4px 8px; margin-bottom: 4px;">SENSITIVITY &amp; ROBUSTNESS ANALYSIS</div>

{{-- Robustness Overview --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="text-align: center; padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 33%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a8a;">{{ $sensitivity['robustness']['overall_score'] ?? 0 }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">Overall Robustness</div>
            <div style="font-size: 6pt;">{{ $sensitivity['robustness']['level'] ?? '' }}</div>
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 34%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a8a;">{{ $sensitivity['robustness']['weight_avg'] ?? 0 }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">Weight Stability</div>
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 33%;">
            <div style="font-size: 14pt; font-weight: bold; color: #1e3a8a;">{{ $sensitivity['robustness']['behavioral_avg'] ?? 0 }}%</div>
            <div style="font-size: 6pt; color: #64748b; text-transform: uppercase;">Behavioral Stability</div>
        </td>
    </tr>
</table>

<div style="background-color: #eff6ff; border: 1px solid #93c5fd; padding: 4px 8px; font-size: 7pt; color: #1e40af; margin-bottom: 6px;">
    {{ $sensitivity['robustness']['interpretation'] ?? '' }}
</div>

{{-- Weight Sensitivity --}}
<div style="font-size: 8pt; font-weight: bold; color: #b91c1c; margin-bottom: 4px;">Sensitivitas Bobot Kriteria</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #b91c1c; color: #fff; padding: 3px 5px; border: 1px solid #b91c1c; text-align: left; font-size: 6.5pt;">Kriteria</th>
            <th style="background-color: #b91c1c; color: #fff; padding: 3px 3px; border: 1px solid #b91c1c; text-align: center; font-size: 6.5pt;">Stability</th>
            <th style="background-color: #b91c1c; color: #fff; padding: 3px 3px; border: 1px solid #b91c1c; text-align: center; font-size: 6.5pt;">Reversals</th>
            <th style="background-color: #b91c1c; color: #fff; padding: 3px 3px; border: 1px solid #b91c1c; text-align: center; font-size: 6.5pt;">Critical</th>
        </tr>
    </thead>
    <tbody>
        @foreach(($sensitivity['weight_sensitivity'] ?? []) as $ws)
            <tr>
                <td style="padding: 2px 5px; border: 1px solid #cbd5e1; font-weight: bold;">{{ ucfirst(str_replace('_', ' ', $ws['criterion'])) }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; {{ $ws['stability_score'] >= 80 ? 'color: #059669;' : ($ws['stability_score'] >= 50 ? 'color: #d97706;' : 'color: #dc2626;') }}">{{ $ws['stability_score'] }}%</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center;">{{ $ws['reversals'] }}/6</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-size: 6pt;">{{ $ws['critical'] ? 'YES' : 'No' }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- Behavioral Sensitivity --}}
<div style="font-size: 8pt; font-weight: bold; color: #b91c1c; margin-bottom: 4px;">Sensitivitas Profil Behavioral</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #b91c1c; color: #fff; padding: 3px 5px; border: 1px solid #b91c1c; text-align: left; font-size: 6.5pt;">Dimensi</th>
            <th style="background-color: #b91c1c; color: #fff; padding: 3px 3px; border: 1px solid #b91c1c; text-align: center; font-size: 6.5pt;">Base</th>
            <th style="background-color: #b91c1c; color: #fff; padding: 3px 3px; border: 1px solid #b91c1c; text-align: center; font-size: 6.5pt;">Stability</th>
            <th style="background-color: #b91c1c; color: #fff; padding: 3px 3px; border: 1px solid #b91c1c; text-align: center; font-size: 6.5pt;">Reversals</th>
        </tr>
    </thead>
    <tbody>
        @foreach(($sensitivity['behavioral_sensitivity'] ?? []) as $bs)
            <tr>
                <td style="padding: 2px 5px; border: 1px solid #cbd5e1; font-weight: bold;">{{ ucfirst(str_replace('_', ' ', $bs['dimension'])) }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center;">{{ $bs['base_value'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; {{ $bs['stability_score'] >= 80 ? 'color: #059669;' : ($bs['stability_score'] >= 50 ? 'color: #d97706;' : 'color: #dc2626;') }}">{{ $bs['stability_score'] }}%</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center;">{{ $bs['reversals'] }}/6</td>
            </tr>
        @endforeach
    </tbody>
</table>

{{-- Critical Thresholds --}}
@if(!empty($sensitivity['critical_thresholds']))
<div style="font-size: 8pt; font-weight: bold; color: #991b1b; margin-bottom: 3px;">Critical Thresholds</div>
@foreach($sensitivity['critical_thresholds'] as $ct)
    <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 3px 8px; font-size: 6.5pt; color: #991b1b; margin-bottom: 2px;">
        {{ $ct['warning'] }}
    </div>
@endforeach
@endif

<div class="page-break"></div>

{{-- ══════════════════════════════════════════════
     PAGE 9: NATURAL LANGUAGE INSIGHTS
     ══════════════════════════════════════════════ --}}
@include('pdf.insight-partials.page-header', ['pageNum' => 9])

<div style="font-size: 9pt; font-weight: bold; color: #ffffff; background-color: #4338ca; padding: 4px 8px; margin-bottom: 6px;">NATURAL LANGUAGE INSIGHTS</div>

{{-- Profile Narrative --}}
@if(isset($narrative['profile_narrative']))
<div style="font-size: 8pt; font-weight: bold; color: #4338ca; margin-bottom: 4px;">Analisis Profil</div>
<div style="font-size: 7.5pt; line-height: 1.5; text-align: justify; background-color: #eef2ff; padding: 8px 10px; border: 1px solid #c7d2fe; margin-bottom: 8px;">
    {!! nl2br(e(str_replace(['**', '*'], '', $narrative['profile_narrative']))) !!}
</div>
@endif

{{-- Algorithmic Narrative --}}
@if(isset($narrative['algorithmic_narrative']))
<div style="font-size: 8pt; font-weight: bold; color: #4338ca; margin-bottom: 4px;">Penjelasan Algoritmik</div>
<div style="font-size: 7.5pt; line-height: 1.5; text-align: justify; background-color: #eef2ff; padding: 8px 10px; border: 1px solid #c7d2fe; margin-bottom: 8px;">
    {!! nl2br(e(str_replace(['**', '*'], '', $narrative['algorithmic_narrative']))) !!}
</div>
@endif

{{-- Key Takeaways --}}
@if(!empty($narrative['key_takeaways']))
<div style="font-size: 8pt; font-weight: bold; color: #4338ca; margin-bottom: 4px;">Key Takeaways</div>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7.5pt; margin-bottom: 6px;">
    @foreach($narrative['key_takeaways'] as $takeaway)
        <tr>
            <td style="padding: 4px 8px; border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
                <strong>{{ str_replace(['🎯','✅','⚠️','❌','📊'], ['[TARGET]','[OK]','[!]','[X]','[DATA]'], $takeaway['icon']) }}</strong>
                {{ str_replace(['**', '*'], '', $takeaway['text']) }}
            </td>
        </tr>
    @endforeach
</table>
@endif

{{-- Confidence Statement --}}
@if(isset($narrative['confidence_statement']))
<div style="background-color: #1e3a8a; color: #ffffff; padding: 8px 12px; font-size: 8pt; line-height: 1.5; text-align: justify;">
    {{ str_replace(['**', '*'], '', $narrative['confidence_statement']) }}
</div>
@endif

<div class="page-break"></div>

{{-- ══════════════════════════════════════════════
     PAGE 10: COHORT BENCHMARKING + SIGNATURES
     ══════════════════════════════════════════════ --}}
@include('pdf.insight-partials.page-header', ['pageNum' => 10])

<div style="font-size: 9pt; font-weight: bold; color: #ffffff; background-color: #065f46; padding: 4px 8px; margin-bottom: 4px;">COHORT BENCHMARKING</div>

<div style="font-size: 7pt; margin-bottom: 4px;">
    Perbandingan profil Anda dengan <strong>{{ $cohort['cohort_size'] ?? 0 }}</strong> pengguna serupa (cosine similarity >= {{ $cohort['similarity_threshold'] ?? 0.70 }}).
</div>

{{-- Cohort Position --}}
@if(isset($cohort['cohort_position']))
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
    <tr>
        <td style="text-align: center; padding: 6px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 33%;">
            <div style="font-size: 14pt; font-weight: bold; color: #065f46;">{{ $cohort['cohort_position']['overall_percentile'] ?? 0 }}%</div>
            <div style="font-size: 6pt; color: #64748b;">Percentile</div>
        </td>
        <td style="text-align: center; padding: 6px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 34%;">
            <div style="font-size: 11pt; font-weight: bold;">{{ $cohort['cohort_position']['position'] ?? 'N/A' }}</div>
            <div style="font-size: 6pt; color: #64748b;">Position</div>
        </td>
        <td style="text-align: center; padding: 6px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 33%;">
            <div style="font-size: 14pt; font-weight: bold;">{{ $cohort['cohort_size'] ?? 0 }}</div>
            <div style="font-size: 6pt; color: #64748b;">Cohort Size</div>
        </td>
    </tr>
</table>
@endif

{{-- Dimension Benchmarks --}}
@if(!empty($cohort['dimension_benchmarks']))
<div style="font-size: 8pt; font-weight: bold; color: #065f46; margin-bottom: 4px;">Benchmark per Dimensi</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 6px;">
    <thead>
        <tr>
            <th style="background-color: #065f46; color: #fff; padding: 3px 5px; border: 1px solid #065f46; text-align: left; font-size: 6.5pt;">Dimensi</th>
            <th style="background-color: #065f46; color: #fff; padding: 3px 3px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Anda</th>
            <th style="background-color: #065f46; color: #fff; padding: 3px 3px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Mean</th>
            <th style="background-color: #065f46; color: #fff; padding: 3px 3px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Percentile</th>
            <th style="background-color: #065f46; color: #fff; padding: 3px 3px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Z-Score</th>
            <th style="background-color: #065f46; color: #fff; padding: 3px 3px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Position</th>
        </tr>
    </thead>
    <tbody>
        @foreach($cohort['dimension_benchmarks'] as $db)
            <tr>
                <td style="padding: 2px 5px; border: 1px solid #cbd5e1; font-weight: bold;">{{ ucfirst(str_replace('_', ' ', $db['dimension'])) }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">{{ $db['user_score'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center;">{{ $db['cohort_mean'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; {{ $db['percentile'] >= 75 ? 'color: #059669;' : ($db['percentile'] >= 25 ? '' : 'color: #dc2626;') }}">P{{ $db['percentile'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center;">{{ $db['z_score'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-size: 6pt;">{{ $db['position'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@endif

{{-- Peer Insights --}}
@if(!empty($cohort['peer_insights']))
<div style="font-size: 8pt; font-weight: bold; color: #065f46; margin-bottom: 3px;">Peer Insights</div>
@foreach($cohort['peer_insights'] as $pi)
    <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 3px 8px; font-size: 6.5pt; color: #14532d; margin-bottom: 2px;">
        {{ str_replace(['👥','💪','📊','✅','🔍','ℹ️'], ['[PEER]','[STRONG]','[DATA]','[OK]','[FIND]','[INFO]'], $pi['icon'] ?? '') }}
        {{ str_replace(['**', '*'], '', $pi['text']) }}
    </div>
@endforeach
@endif

{{-- Major Preferences in Cohort --}}
@if(!empty($cohort['major_preferences']))
<div style="font-size: 8pt; font-weight: bold; color: #065f46; margin-top: 6px; margin-bottom: 4px;">Preferensi Jurusan dalam Cohort</div>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size: 7pt; margin-bottom: 8px;">
    <thead>
        <tr>
            <th style="background-color: #065f46; color: #fff; padding: 3px 5px; border: 1px solid #065f46; text-align: left; font-size: 6.5pt;">Jurusan</th>
            <th style="background-color: #065f46; color: #fff; padding: 3px 3px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">Count</th>
            <th style="background-color: #065f46; color: #fff; padding: 3px 3px; border: 1px solid #065f46; text-align: center; font-size: 6.5pt;">%</th>
            <th style="background-color: #065f46; color: #fff; padding: 3px 5px; border: 1px solid #065f46; text-align: left; font-size: 6.5pt;">Distribusi</th>
        </tr>
    </thead>
    <tbody>
        @foreach(array_slice($cohort['major_preferences'], 0, 8) as $mp)
            <tr>
                <td style="padding: 2px 5px; border: 1px solid #cbd5e1; font-weight: bold;">{{ $mp['major_name'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center;">{{ $mp['count'] }}</td>
                <td style="padding: 2px 3px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">{{ $mp['percentage'] }}%</td>
                <td style="padding: 3px 5px; border: 1px solid #cbd5e1;">
                    <div style="width: 100%; height: 8px; background-color: #e2e8f0; overflow: hidden;">
                        <div style="height: 8px; width: {{ min($mp['percentage'], 100) }}%; background-color: #059669;"></div>
                    </div>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
@endif

{{-- DISCLAIMER --}}
<div style="background-color: #fffbeb; border-left: 3px solid #f59e0b; padding: 5px 8px; font-size: 7pt; color: #78350f; margin-bottom: 10px;">
    <strong>Catatan Penting:</strong> Laporan ini dihasilkan oleh sistem komputasi berbasis algoritma. Prediksi keberhasilan bersifat estimasi heuristik, bukan model ML terlatih. Keputusan final harus mempertimbangkan faktor personal, keluarga, finansial, dan konseling akademik profesional.
</div>

{{-- SIGNATURES --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
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

{{-- FOOTER --}}
<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td style="background-color: #1e3a8a; padding: 4px 8px; font-size: 5.5pt; color: #ffffff; text-align: left;">
            <strong>MajorMind</strong> v2.0 &middot; Intelligence Engine &middot; CONFIDENTIAL
        </td>
        <td style="background-color: #1e3a8a; padding: 4px 8px; font-size: 5.5pt; color: #ffffff; text-align: center;">
            {{ $documentId }}
        </td>
        <td style="background-color: #1e3a8a; padding: 4px 8px; font-size: 5.5pt; color: #ffffff; text-align: right;">
            {{ $generatedAt->translatedFormat('d F Y, H:i:s') }} WIB
        </td>
    </tr>
</table>
