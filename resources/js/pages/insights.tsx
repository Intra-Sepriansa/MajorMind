import { Head } from '@inertiajs/react';
import AlgorithmicIntelligence from '@/components/insight/algorithmic-intelligence';
import PsychometricValidation from '@/components/insight/psychometric-validation';
import EvidenceJustification from '@/components/insight/evidence-justification';
import PredictiveModeling from '@/components/insight/predictive-modeling';
import SensitivityAnalysis from '@/components/insight/sensitivity-analysis';
import NarrativeInsights from '@/components/insight/narrative-insights';
import CohortBenchmarking from '@/components/insight/cohort-benchmarking';
import {
    Activity,
    Binary,
    BookOpenText,
    BrainCircuit,
    Calculator,
    CheckCircle2,
    Crosshair,
    Gauge,
    GitBranchPlus,
    Grid3x3,
    Radar,
    Ruler,
    Scale,
    ShieldAlert,
    Target,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar as RechartsRadar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useRef } from 'react';
import type { AssessmentResponse, BreadcrumbItem, Recommendation } from '@/types';

type InsightsPageProps = {
    initialAssessment?: AssessmentResponse | null;
};

type ContributionRow = {
    contribution: number;
    deltaVsRunnerUp: number;
    score: number;
    slug: string;
    weight: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Insights', href: '/insights' },
];

function formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

function getConfidenceLabel(cr: number): { label: string; color: string } {
    if (cr <= 0.05) return { label: 'Excellent', color: '#22c55e' };
    if (cr <= 0.08) return { label: 'Good', color: '#84cc16' };
    if (cr <= 0.1) return { label: 'Acceptable', color: '#eab308' };
    return { label: 'Invalid', color: '#ef4444' };
}

function formatConfidence(value: number | undefined): string {
    return `${(value ?? 0).toFixed(1)}%`;
}

function formatDelta(value: number, digits = 1): string {
    const sign = value > 0 ? '+' : value < 0 ? '-' : '';

    return `${sign}${Math.abs(value).toFixed(digits)}`;
}

function toTitleCase(slug: string): string {
    return slug
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function getStabilityBand(topGap: number, consistencyRatio: number): {
    label: string;
    tone: string;
} {
    if (topGap >= 0.08 && consistencyRatio <= 0.05) {
        return { label: 'Robust', tone: 'text-emerald-300' };
    }

    if (topGap >= 0.04 && consistencyRatio <= 0.1) {
        return { label: 'Cukup stabil', tone: 'text-amber-300' };
    }

    return { label: 'Sensitif', tone: 'text-rose-300' };
}

function getCrStatus(consistencyRatio: number): {
    label: string;
    tone: string;
} {
    if (consistencyRatio <= 0.05) {
        return { label: 'Sangat konsisten', tone: 'text-emerald-300' };
    }

    if (consistencyRatio <= 0.1) {
        return { label: 'Masih valid', tone: 'text-amber-300' };
    }

    return { label: 'Tidak valid', tone: 'text-rose-300' };
}

export default function InsightsPage({
    initialAssessment = null,
}: InsightsPageProps) {
    const topRecommendation = initialAssessment?.recommendations[0] ?? null;
    const runnerUpRecommendation = initialAssessment?.recommendations[1] ?? null;
    const thirdRecommendation = initialAssessment?.recommendations[2] ?? null;
    const weightedScores = topRecommendation?.meta?.weighted_scores ?? {};
    const runnerUpWeightedScores = runnerUpRecommendation?.meta?.weighted_scores ?? {};
    const totalWeightedScore = Object.values(weightedScores).reduce(
        (sum, value) => sum + value,
        0,
    );
    const topGap =
        topRecommendation && runnerUpRecommendation
            ? topRecommendation.final_score - runnerUpRecommendation.final_score
            : 0;
    const confidence = initialAssessment?.summary?.recommendation_confidence ?? 0;
    const behavioralContribution = (topRecommendation?.behavioral_score ?? 0) * 0.25;
    const topsisContribution = (topRecommendation?.topsis_score ?? 0) * 0.75;
    const stabilityBand = getStabilityBand(
        topGap,
        initialAssessment?.consistency_ratio ?? 1,
    );
    const crStatus = getCrStatus(initialAssessment?.consistency_ratio ?? 1);

    const contributions: ContributionRow[] = initialAssessment
        ? initialAssessment.criterion_order
              .map((slug) => {
                  const score = weightedScores[slug] ?? 0;
                  const runnerUpScore = runnerUpWeightedScores[slug] ?? 0;

                  return {
                      contribution:
                          totalWeightedScore > 0
                              ? (score / totalWeightedScore) * 100
                              : 0,
                      deltaVsRunnerUp: score - runnerUpScore,
                      score,
                      slug,
                      weight: initialAssessment.criterion_weights[slug] ?? 0,
                  };
              })
              .sort((left, right) => right.contribution - left.contribution)
        : [];

    const dominantCriterion = contributions[0] ?? null;
    const weakestCriterion = contributions[contributions.length - 1] ?? null;
    const differentiator = [...contributions].sort(
        (left, right) =>
            Math.abs(right.deltaVsRunnerUp) - Math.abs(left.deltaVsRunnerUp),
    )[0] ?? null;

    const executiveNarrative = topRecommendation
        ? [
              `Alternatif terbaik saat ini adalah ${topRecommendation.major.name} dengan confidence ${formatConfidence(confidence)} dan skor akhir ${formatPercent(topRecommendation.final_score)}.`,
              dominantCriterion
                  ? `${toTitleCase(dominantCriterion.slug)} menjadi driver dominan dengan kontribusi ${dominantCriterion.contribution.toFixed(1)}% terhadap top recommendation.`
                  : 'Belum ada driver dominan yang teridentifikasi.',
              topGap >= 0.08
                  ? `Keputusan cenderung kuat karena selisih top 1 terhadap top 2 mencapai ${formatPercent(topGap)}.`
                  : `Keputusan masih sensitif karena selisih top 1 terhadap top 2 hanya ${formatPercent(topGap)}.`,
              differentiator
                  ? `${toTitleCase(differentiator.slug)} adalah kriteria yang paling membedakan top 1 dan top 2.`
                  : 'Belum ada pembeda utama antara top 1 dan top 2.',
          ]
        : [];

    const topsisNarrative = topRecommendation && runnerUpRecommendation
        ? `Alternatif ${topRecommendation.major.name} unggul atas ${runnerUpRecommendation.major.name} karena memiliki skor preferensi ${formatPercent(topRecommendation.topsis_score)} dengan jarak ke solusi ideal positif ${topRecommendation.distance_positive.toFixed(4)} dan jarak dari solusi ideal negatif ${topRecommendation.distance_negative.toFixed(4)}.`
        : 'TOPSIS breakdown akan tersedia setelah assessment menghasilkan minimal dua alternatif.';

    const behavioralNarrative = topRecommendation
        ? `Behavioral fit memberikan kontribusi ${formatPercent(behavioralContribution)} ke skor final. Ini menunjukkan bahwa kecocokan profil siswa terhadap jurusan ${topRecommendation.major.name} memperkuat hasil TOPSIS, bukan sekadar menggantikannya.`
        : 'Interpretasi behavioral fit akan muncul setelah assessment dihitung.';

    const tradeoffRows = [topRecommendation, runnerUpRecommendation, thirdRecommendation]
        .filter(Boolean)
        .map((recommendation) => {
            const weighted = recommendation?.meta?.weighted_scores ?? {};
            const bestCriterion = initialAssessment?.criterion_order
                ?.map((slug) => ({
                    score: weighted[slug] ?? 0,
                    slug,
                }))
                .sort((left, right) => right.score - left.score)[0];
            const weakest = initialAssessment?.criterion_order
                ?.map((slug) => ({
                    score: weighted[slug] ?? 0,
                    slug,
                }))
                .sort((left, right) => left.score - right.score)[0];

            return {
                bestCriterion: bestCriterion?.slug ?? null,
                behavioral: recommendation?.behavioral_score ?? 0,
                finalScore: recommendation?.final_score ?? 0,
                major: recommendation?.major ?? null,
                rank: recommendation?.rank ?? null,
                topsis: recommendation?.topsis_score ?? 0,
                weakestCriterion: weakest?.slug ?? null,
            };
        });
    const contributionChartData = contributions.map((item) => ({
        contribution: Number(item.contribution.toFixed(2)),
        deltaVsRunnerUp: Number(item.deltaVsRunnerUp.toFixed(4)),
        label: toTitleCase(item.slug),
        weight: Number((item.weight * 100).toFixed(2)),
    }));
    const tradeoffChartData = tradeoffRows.map((row) => ({
        behavioral: Number((row.behavioral * 100).toFixed(2)),
        final: Number((row.finalScore * 100).toFixed(2)),
        major: row.major?.name ?? 'N/A',
        topsis: Number((row.topsis * 100).toFixed(2)),
    }));
    const stabilityChartData = [
        {
            metric: 'Confidence',
            value: Number(confidence.toFixed(1)),
        },
        {
            metric: 'Top Gap',
            value: Number((topGap * 100).toFixed(1)),
        },
        {
            metric: 'CR Safety',
            value: Number((Math.max(0, 0.1 - (initialAssessment?.consistency_ratio ?? 0)) * 1000).toFixed(1)),
        },
    ];

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { el.classList.add('is-visible'); obs.disconnect(); }
        }, { threshold: 0.05 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Insights" />

            <div ref={scrollRef} className="scroll-reveal-container space-y-6 bg-[#0b0e14] px-4 py-6 text-white lg:px-6">
                <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs tracking-[0.28em] text-slate-300 uppercase">
                            <BookOpenText className="h-3.5 w-3.5 text-[#ff2d20]" />
                            Explainability Insights
                        </div>
                        {initialAssessment && (
                            <button
                                onClick={() => {
                                    window.location.href = `/insight/${initialAssessment.id}/export-pdf`;
                                }}
                                className="inline-flex items-center gap-2 rounded-full border border-[#ff2d20]/30 bg-[#ff2d20]/10 px-4 py-2 text-xs font-semibold text-[#ff2d20] transition hover:bg-[#ff2d20]/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-down">
                                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                                    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                                    <path d="M12 18v-6"/>
                                    <path d="m9 15 3 3 3-3"/>
                                </svg>
                                Export PDF
                            </button>
                        )}
                    </div>
                    <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
                        Interpretasi keputusan yang dapat dijelaskan, diaudit, dan dipresentasikan.
                    </h1>
                    <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
                        Menu ini menerjemahkan output assessment menjadi justifikasi keputusan.
                        Fokusnya bukan hanya siapa yang berada di posisi pertama, tetapi
                        mengapa alternatif tersebut unggul, kriteria apa yang paling
                        dominan, seberapa stabil keputusan, dan bagaimana hasil ini dapat
                        dipertahankan secara akademik.
                    </p>
                </section>

                <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-3 px-5 py-5">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Target className="h-4 w-4 text-[#ff2d20]" />
                                Alternatif terbaik
                            </div>
                            <div className="text-2xl font-semibold text-white">
                                {topRecommendation?.major.name ?? 'Belum ada assessment'}
                            </div>
                            <div className="text-sm text-slate-400">
                                Skor final {formatPercent(topRecommendation?.final_score ?? 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-3 px-5 py-5">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Gauge className="h-4 w-4 text-[#ff2d20]" />
                                Confidence
                            </div>
                            <div className="text-2xl font-semibold text-white">
                                {formatConfidence(confidence)}
                            </div>
                            <div className={`text-sm ${stabilityBand.tone}`}>
                                {stabilityBand.label}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-3 px-5 py-5">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Scale className="h-4 w-4 text-[#ff2d20]" />
                                Dominant criterion
                            </div>
                            <div className="text-2xl font-semibold text-white">
                                {dominantCriterion
                                    ? toTitleCase(dominantCriterion.slug)
                                    : 'N/A'}
                            </div>
                            <div className="text-sm text-slate-400">
                                {dominantCriterion
                                    ? `${dominantCriterion.contribution.toFixed(1)}% contribution`
                                    : 'Belum ada kontribusi'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-3 px-5 py-5">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <CheckCircle2 className="h-4 w-4 text-[#ff2d20]" />
                                Validitas konsistensi
                            </div>
                            <div className="text-2xl font-semibold text-white">
                                {initialAssessment?.consistency_ratio.toFixed(4) ?? '0.0000'}
                            </div>
                            <div className={`text-sm ${crStatus.tone}`}>{crStatus.label}</div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <BrainCircuit className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Executive decision summary
                            </div>
                            <div className="grid gap-3">
                                {executiveNarrative.length === 0 ? (
                                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-500">
                                        Jalankan assessment untuk menampilkan executive summary.
                                    </div>
                                ) : (
                                    executiveNarrative.map((line) => (
                                        <div
                                            key={line}
                                            className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300"
                                        >
                                            {line}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-4 px-5 py-5">
                            <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <ShieldAlert className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Recommendation stability & sensitivity
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                <div className="text-sm text-slate-500">Top gap</div>
                                <div className="mt-2 text-2xl font-semibold text-white">
                                    {formatPercent(topGap)}
                                </div>
                                <div className="mt-2 text-sm text-slate-400">
                                    {topGap >= 0.08
                                        ? 'Rekomendasi cenderung robust karena top 1 unggul cukup jauh dari top 2.'
                                        : 'Rekomendasi masih sensitif karena jarak top 1 dan top 2 relatif tipis.'}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                <div className="text-sm text-slate-500">Dominant sensitivity axis</div>
                                <div className="mt-2 text-lg font-semibold text-white">
                                    {differentiator ? toTitleCase(differentiator.slug) : 'N/A'}
                                </div>
                                <div className="mt-2 text-sm text-slate-400">
                                    {differentiator
                                        ? `${toTitleCase(differentiator.slug)} paling mungkin menggeser posisi top 1 jika bobotnya berubah.`
                                        : 'Belum ada sumbu sensitivitas yang teridentifikasi.'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Scale className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Criteria contribution analysis
                            </div>
                            <div className="grid gap-4">
                                {contributions.length === 0 ? (
                                    <div className="text-sm text-slate-500">
                                        Belum ada data kontribusi untuk ditampilkan.
                                    </div>
                                ) : (
                                    contributions.map((item) => (
                                        <div key={item.slug}>
                                            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                                <span className="text-slate-200">
                                                    {toTitleCase(item.slug)}
                                                </span>
                                                <span className="font-mono text-xs text-slate-500">
                                                    AHP {formatPercent(item.weight)} • weighted{' '}
                                                    {item.score.toFixed(4)} • contribution{' '}
                                                    {item.contribution.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[#ff2d20] to-[#ff8a80]"
                                                    style={{
                                                        width: `${Math.max(item.contribution, 4)}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-2 text-xs text-slate-500">
                                                Delta vs runner-up {formatDelta(item.deltaVsRunnerUp, 4)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {contributionChartData.length > 0 ? (
                                <div className="mt-6 rounded-[24px] border border-white/8 bg-[#05070b] p-4">
                                    <div className="mb-4 text-sm text-slate-400">
                                        Contribution chart
                                    </div>
                                    <div className="h-[320px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={contributionChartData}
                                                layout="vertical"
                                                margin={{ top: 8, right: 16, left: 12, bottom: 8 }}
                                            >
                                                <CartesianGrid
                                                    stroke="rgba(148,163,184,0.12)"
                                                    horizontal={false}
                                                />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="label"
                                                    width={140}
                                                    tick={{ fill: '#e2e8f0', fontSize: 12 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                                    contentStyle={{
                                                        background: '#0f172a',
                                                        border: '1px solid rgba(255,255,255,0.08)',
                                                        borderRadius: '16px',
                                                        color: '#f8fafc',
                                                    }}
                                                />
                                                <Bar dataKey="contribution" radius={[0, 10, 10, 0]}>
                                                    {contributionChartData.map((entry) => (
                                                        <Cell
                                                            key={entry.label}
                                                            fill={
                                                                dominantCriterion &&
                                                                entry.label ===
                                                                    toTitleCase(dominantCriterion.slug)
                                                                    ? '#ff2d20'
                                                                    : '#fb7185'
                                                            }
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-4 px-5 py-5">
                            <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <GitBranchPlus className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Criteria interpretation
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                <strong className="text-white">Dominant criterion:</strong>{' '}
                                {dominantCriterion
                                    ? `${toTitleCase(dominantCriterion.slug)} menjadi pendorong utama karena kontribusinya paling besar ke alternatif terbaik.`
                                    : 'Belum ada kriteria dominan.'}
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                <strong className="text-white">Weakest criterion:</strong>{' '}
                                {weakestCriterion
                                    ? `${toTitleCase(weakestCriterion.slug)} memberi kontribusi paling kecil dan menjadi area yang relatif tidak dominan pada keputusan akhir.`
                                    : 'Belum ada kriteria terlemah.'}
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                <strong className="text-white">Top-1 differentiator:</strong>{' '}
                                {differentiator
                                    ? `${toTitleCase(differentiator.slug)} adalah kriteria yang paling membedakan top 1 dan top 2, sehingga sangat penting saat menjelaskan justifikasi keputusan.`
                                    : 'Belum ada pembeda utama.'}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Calculator className="h-3.5 w-3.5 text-[#ff2d20]" />
                                AHP explainability
                            </div>
                            <div className="grid gap-3">
                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                    AHP mengubah preferensi pairwise menjadi bobot prioritas final. Pada assessment ini, consistency ratio berada di{' '}
                                    <span className={crStatus.tone}>
                                        {initialAssessment?.consistency_ratio.toFixed(4) ?? '0.0000'}
                                    </span>{' '}
                                    yang berarti status konsistensi adalah{' '}
                                    <span className={crStatus.tone}>{crStatus.label}</span>.
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-white/8">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-white/[0.03] text-slate-400">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Kriteria</th>
                                                <th className="px-4 py-3 font-medium">Bobot prioritas</th>
                                                <th className="px-4 py-3 font-medium">Interpretasi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(initialAssessment?.criterion_order ?? []).map((slug) => {
                                                const weight =
                                                    initialAssessment?.criterion_weights[slug] ?? 0;

                                                return (
                                                    <tr key={slug} className="border-t border-white/8">
                                                        <td className="px-4 py-3 text-white">
                                                            {toTitleCase(slug)}
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-slate-300">
                                                            {formatPercent(weight)}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-300">
                                                            {weight >= 0.3
                                                                ? 'Sangat dominan'
                                                                : weight >= 0.2
                                                                  ? 'Cukup dominan'
                                                                  : 'Pendukung'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Binary className="h-3.5 w-3.5 text-[#ff2d20]" />
                                TOPSIS explainability
                            </div>
                            <div className="grid gap-3">
                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                    {topsisNarrative}
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-white/8">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-white/[0.03] text-slate-400">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Alternatif</th>
                                                <th className="px-4 py-3 font-medium">Preference</th>
                                                <th className="px-4 py-3 font-medium">Distance +</th>
                                                <th className="px-4 py-3 font-medium">Distance -</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[topRecommendation, runnerUpRecommendation]
                                                .filter(Boolean)
                                                .map((recommendation) => (
                                                    <tr
                                                        key={recommendation?.major.slug}
                                                        className="border-t border-white/8"
                                                    >
                                                        <td className="px-4 py-3 text-white">
                                                            {recommendation?.major.name}
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-slate-300">
                                                            {formatPercent(
                                                                recommendation?.topsis_score ?? 0,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-slate-300">
                                                            {recommendation?.distance_positive.toFixed(
                                                                4,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-slate-300">
                                                            {recommendation?.distance_negative.toFixed(
                                                                4,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ── NEW: AHP Pairwise Matrix Heatmap ── */}
                <section className="grid gap-6 xl:grid-cols-[1fr_280px]">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Grid3x3 className="h-3.5 w-3.5 text-[#ff2d20]" />
                                AHP pairwise matrix heatmap
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300 mb-4">
                                Matriks berikut direkonstruksi dari bobot prioritas AHP akhir menggunakan rasio <code className="text-[#ff8a80]">w[i]/w[j]</code>. Warna hijau menunjukkan preferensi kuat, kuning menunjukkan preferensi moderat, dan merah menunjukkan preferensi invers.
                            </div>
                            {(initialAssessment?.criterion_order ?? []).length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-center text-sm">
                                        <thead>
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs text-slate-400 font-medium" />
                                                {initialAssessment!.criterion_order.map((slug) => (
                                                    <th key={slug} className="px-3 py-2 text-xs text-slate-400 font-medium">
                                                        {toTitleCase(slug).slice(0, 8)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {initialAssessment!.criterion_order.map((rowSlug, ri) => {
                                                const wRow = initialAssessment!.criterion_weights[rowSlug] ?? 0.001;
                                                return (
                                                    <tr key={rowSlug} className="border-t border-white/6">
                                                        <td className="px-3 py-2 text-left text-xs text-slate-300 font-medium">
                                                            {toTitleCase(rowSlug).slice(0, 12)}
                                                        </td>
                                                        {initialAssessment!.criterion_order.map((colSlug, ci) => {
                                                            const wCol = initialAssessment!.criterion_weights[colSlug] ?? 0.001;
                                                            const ratio = wRow / wCol;
                                                            const isDiag = ri === ci;
                                                            let bg = 'rgba(255,255,255,0.03)';
                                                            if (!isDiag) {
                                                                if (ratio >= 5) bg = 'rgba(34,197,94,0.35)';
                                                                else if (ratio >= 3) bg = 'rgba(34,197,94,0.2)';
                                                                else if (ratio >= 1.5) bg = 'rgba(234,179,8,0.2)';
                                                                else if (ratio >= 1) bg = 'rgba(255,255,255,0.05)';
                                                                else if (ratio >= 0.5) bg = 'rgba(234,179,8,0.12)';
                                                                else if (ratio >= 0.33) bg = 'rgba(239,68,68,0.15)';
                                                                else bg = 'rgba(239,68,68,0.3)';
                                                            }
                                                            return (
                                                                <td
                                                                    key={colSlug}
                                                                    className="group/cell relative px-3 py-2 font-mono text-xs transition-colors"
                                                                    style={{ backgroundColor: bg }}
                                                                >
                                                                    <span className={isDiag ? 'text-slate-500' : 'text-white'}>
                                                                        {isDiag ? '1' : ratio >= 1 ? ratio.toFixed(2) : `1/${(1 / ratio).toFixed(1)}`}
                                                                    </span>
                                                                    {!isDiag && (
                                                                        <div className="pointer-events-none invisible absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-[#1e293b] border border-white/10 px-3 py-1.5 text-[10px] text-slate-200 whitespace-nowrap group-hover/cell:visible z-10">
                                                                            {toTitleCase(rowSlug)} {ratio >= 1 ? `${ratio.toFixed(1)}× lebih penting dari` : `${(1 / ratio).toFixed(1)}× kurang penting dari`} {toTitleCase(colSlug)}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-sm text-slate-500">Belum ada data AHP untuk diheatmap.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Saaty Scale Reference */}
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Ruler className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Skala Saaty
                            </div>
                            <div className="space-y-2">
                                {([
                                    { value: 9, label: 'Extreme', desc: 'Mutlak dominan', color: '#22c55e' },
                                    { value: 7, label: 'Very Strong', desc: 'Hampir absolut', color: '#4ade80' },
                                    { value: 5, label: 'Strong', desc: 'Sangat dominan', color: '#84cc16' },
                                    { value: 3, label: 'Moderate', desc: 'Cukup dominan', color: '#eab308' },
                                    { value: 1, label: 'Equal', desc: 'Setara', color: '#94a3b8' },
                                ] as const).map((item) => (
                                    <div key={item.value} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                                        <div
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-black"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            {item.value}
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-white">{item.label}</div>
                                            <div className="text-[10px] text-slate-500">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ── NEW: CR Gauge Speedometer ── */}
                <section className="grid gap-6 xl:grid-cols-2">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Gauge className="h-3.5 w-3.5 text-[#ff2d20]" />
                                CR gauge &amp; threshold
                            </div>
                            <div className="flex flex-col items-center py-4">
                                {/* Gauge SVG */}
                                <svg viewBox="0 0 200 120" className="h-44 w-72">
                                    {/* background arc */}
                                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
                                    {/* Green zone 0-0.05 */}
                                    <path d="M 20 100 A 80 80 0 0 1 55 30" fill="none" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" opacity={0.6} />
                                    {/* Yellow zone 0.05-0.08 */}
                                    <path d="M 55 30 A 80 80 0 0 1 90 22" fill="none" stroke="#eab308" strokeWidth="14" strokeLinecap="round" opacity={0.5} />
                                    {/* Orange zone 0.08-0.1 */}
                                    <path d="M 90 22 A 80 80 0 0 1 120 22" fill="none" stroke="#f97316" strokeWidth="14" strokeLinecap="round" opacity={0.5} />
                                    {/* Red zone 0.1+ */}
                                    <path d="M 120 22 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" opacity={0.4} />
                                    {/* threshold line at 0.1 */}
                                    <line x1="110" y1="21" x2="110" y2="11" stroke="#ef4444" strokeWidth="2" />
                                    <text x="110" y="8" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="600">0.10</text>
                                    {/* needle */}
                                    {(() => {
                                        const cr = initialAssessment?.consistency_ratio ?? 0;
                                        const pct = Math.min(cr / 0.2, 1); // 0-0.2 mapped to 0-1
                                        const angle = -180 + pct * 180; // -180 (left) to 0 (right)
                                        const rad = (angle * Math.PI) / 180;
                                        const nx = 100 + 65 * Math.cos(rad);
                                        const ny = 100 + 65 * Math.sin(rad);
                                        const { color } = getConfidenceLabel(cr);
                                        return (
                                            <>
                                                <line x1="100" y1="100" x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round">
                                                    <animate attributeName="x2" from="100" to={nx} dur="1.2s" fill="freeze" />
                                                    <animate attributeName="y2" from="100" to={ny} dur="1.2s" fill="freeze" />
                                                </line>
                                                <circle cx="100" cy="100" r="5" fill={color} />
                                                <text x="100" y="90" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">
                                                    {cr.toFixed(4)}
                                                </text>
                                                <text x="100" y="78" textAnchor="middle" fill={color} fontSize="9" fontWeight="600">
                                                    {getConfidenceLabel(cr).label.toUpperCase()} CONSISTENCY
                                                </text>
                                            </>
                                        );
                                    })()}
                                    {/* labels */}
                                    <text x="20" y="115" textAnchor="start" fill="#94a3b8" fontSize="7">0.00</text>
                                    <text x="180" y="115" textAnchor="end" fill="#94a3b8" fontSize="7">0.20</text>
                                </svg>

                                {/* Traffic light indicators */}
                                <div className="mt-4 grid w-full max-w-md grid-cols-4 gap-2">
                                    {([
                                        { range: 'CR ≤ 0.05', label: 'Excellent', color: '#22c55e' },
                                        { range: '0.05-0.08', label: 'Good', color: '#84cc16' },
                                        { range: '0.08-0.10', label: 'Acceptable', color: '#f97316' },
                                        { range: 'CR > 0.10', label: 'Invalid', color: '#ef4444' },
                                    ] as const).map((item) => {
                                        const cr = initialAssessment?.consistency_ratio ?? 0;
                                        const isActive =
                                            (item.label === 'Excellent' && cr <= 0.05) ||
                                            (item.label === 'Good' && cr > 0.05 && cr <= 0.08) ||
                                            (item.label === 'Acceptable' && cr > 0.08 && cr <= 0.1) ||
                                            (item.label === 'Invalid' && cr > 0.1);
                                        return (
                                            <div
                                                key={item.label}
                                                className={`rounded-xl border px-3 py-2 text-center text-xs ${isActive ? 'border-white/20 bg-white/[0.05]' : 'border-white/6 bg-white/[0.02] opacity-40'}`}
                                            >
                                                <div className="mx-auto mb-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: isActive ? `0 0 8px ${item.color}` : 'none' }} />
                                                <div className="font-medium text-white">{item.label}</div>
                                                <div className="text-[10px] text-slate-500">{item.range}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step-by-step CR formula */}
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Calculator className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Step-by-step CR calculation
                            </div>
                            <div className="space-y-3">
                                {(() => {
                                    const cr = initialAssessment?.consistency_ratio ?? 0;
                                    const n = initialAssessment?.criterion_order.length ?? 4;
                                    const riTable: Record<number, number> = { 1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49 };
                                    const ri = riTable[n] ?? 1.49;
                                    const ci = cr * ri;
                                    const lambdaMax = ci * (n - 1) + n;
                                    const steps = [
                                        { step: 1, title: 'Calculate λmax', formula: `λmax = ${lambdaMax.toFixed(3)}`, desc: 'Principal eigenvalue dari matrix multiplication A × w' },
                                        { step: 2, title: 'Calculate CI', formula: `CI = (${lambdaMax.toFixed(3)} - ${n}) / (${n} - 1) = ${ci.toFixed(4)}`, desc: 'Consistency Index = (λmax − n) / (n − 1)' },
                                        { step: 3, title: 'Lookup RI', formula: `RI = ${ri.toFixed(2)} (n=${n})`, desc: `Random Index dari tabel Saaty untuk ${n} kriteria` },
                                        { step: 4, title: 'Calculate CR', formula: `CR = ${ci.toFixed(4)} / ${ri.toFixed(2)} = ${cr.toFixed(4)}`, desc: `CR = CI / RI — ${cr <= 0.1 ? '✓ CR < 0.1 → VALID' : '✗ CR > 0.1 → INVALID'}` },
                                    ];
                                    return steps.map((s) => (
                                        <div key={s.step} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#ff2d20]/15 text-[10px] font-bold text-[#ff2d20]">
                                                    {s.step}
                                                </span>
                                                <span className="text-xs font-semibold text-white">{s.title}</span>
                                            </div>
                                            <div className="font-mono text-sm text-[#ff8a80]">{s.formula}</div>
                                            <div className="mt-1 text-xs text-slate-500">{s.desc}</div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ── NEW: Ideal Solution Distance Scatter ── */}
                <section>
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Crosshair className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Ideal solution distance map
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300 mb-4">
                                Plot menunjukkan posisi setiap alternatif terhadap Solusi Ideal Positif (A+) dan Negatif (A−). Alternatif terbaik berada di <span className="text-emerald-400">kiri bawah</span> (dekat A+, jauh dari A−).
                            </div>
                            {initialAssessment && initialAssessment.recommendations.length > 0 ? (
                                <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                                    {/* Scatter Plot SVG */}
                                    <div className="rounded-2xl border border-white/8 bg-[#05070b] p-4">
                                        <svg viewBox="0 0 400 300" className="w-full" style={{ maxHeight: '350px' }}>
                                            {/* axes */}
                                            <line x1="60" y1="260" x2="380" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                                            <line x1="60" y1="20" x2="60" y2="260" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                                            {/* grid lines */}
                                            {[0.25, 0.5, 0.75, 1].map((tick) => (
                                                <g key={tick}>
                                                    <line x1={60 + tick * 320} y1="20" x2={60 + tick * 320} y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                                                    <line x1="60" y1={260 - tick * 240} x2="380" y2={260 - tick * 240} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                                                </g>
                                            ))}
                                            {/* axis labels */}
                                            <text x="220" y="290" textAnchor="middle" fill="#94a3b8" fontSize="10">Si+ (Distance to Ideal Positive)</text>
                                            <text x="15" y="140" textAnchor="middle" fill="#94a3b8" fontSize="10" transform="rotate(-90, 15, 140)">Si− (Distance to Ideal Negative)</text>
                                            {/* quadrant labels */}
                                            <text x="130" y="50" textAnchor="middle" fill="rgba(34,197,94,0.4)" fontSize="9" fontWeight="600">IDEAL</text>
                                            <text x="320" y="245" textAnchor="middle" fill="rgba(239,68,68,0.4)" fontSize="9" fontWeight="600">POOR</text>
                                            {/* data points */}
                                            {(() => {
                                                const recs = initialAssessment.recommendations;
                                                const maxDp = Math.max(...recs.map((r) => r.distance_positive), 0.001);
                                                const maxDn = Math.max(...recs.map((r) => r.distance_negative), 0.001);
                                                const colors = ['#fbbf24', '#94a3b8', '#cd7f32', '#6366f1', '#06b6d4', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#64748b'];
                                                return recs.slice(0, 10).map((rec, i) => {
                                                    const cx = 60 + (rec.distance_positive / (maxDp * 1.2)) * 320;
                                                    const cy = 260 - (rec.distance_negative / (maxDn * 1.2)) * 240;
                                                    const color = colors[i] ?? '#94a3b8';
                                                    return (
                                                        <g key={rec.major.id}>
                                                            <circle cx={cx} cy={cy} r={i < 3 ? 8 : 5} fill={`${color}40`} stroke={color} strokeWidth="2">
                                                                <animate attributeName="r" from="0" to={i < 3 ? 8 : 5} dur="0.8s" fill="freeze" />
                                                            </circle>
                                                            {i < 3 && (
                                                                <circle cx={cx} cy={cy} r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                                                                    <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                                                                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                                                                </circle>
                                                            )}
                                                            <text x={cx} y={cy - 12} textAnchor="middle" fill="white" fontSize="8" fontWeight="600">
                                                                #{i + 1}
                                                            </text>
                                                        </g>
                                                    );
                                                });
                                            })()}
                                        </svg>
                                    </div>

                                    {/* Distance Breakdown Table */}
                                    <div className="space-y-3">
                                        {initialAssessment.recommendations.slice(0, 5).map((rec, i) => {
                                            const ci = rec.distance_negative / (rec.distance_positive + rec.distance_negative);
                                            const colors = ['#fbbf24', '#94a3b8', '#cd7f32', '#6366f1', '#06b6d4'];
                                            const color = colors[i] ?? '#94a3b8';
                                            return (
                                                <div key={rec.major.id} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                                                        <span className="text-xs font-semibold text-white">#{i + 1} {rec.major.name}</span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                                        <div>
                                                            <div className="text-slate-500">Si+</div>
                                                            <div className="font-mono text-emerald-300">{rec.distance_positive.toFixed(4)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-slate-500">Si−</div>
                                                            <div className="font-mono text-rose-300">{rec.distance_negative.toFixed(4)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-slate-500">Ci</div>
                                                            <div className="font-mono text-white">{ci.toFixed(4)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                                                        <div className="h-full rounded-full" style={{ width: `${ci * 100}%`, background: `linear-gradient(90deg, ${color}, #ff2d20)` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Ci formula card */}
                                        <div className="rounded-xl border border-[#ff2d20]/20 bg-[#ff2d20]/5 px-4 py-3">
                                            <div className="text-xs font-semibold text-[#ff8a80] mb-1">Closeness Coefficient</div>
                                            <div className="font-mono text-xs text-white">Ci = Si− / (Si+ + Si−)</div>
                                            <div className="mt-1 text-[10px] text-slate-400">Range: 0 ≤ Ci ≤ 1 — Higher = Better</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-slate-500">Belum ada data rekomendasi untuk dihitung.</div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-4 px-5 py-5">
                            <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Activity className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Behavioral fit interpretation
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                {behavioralNarrative}
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                    <div className="text-sm text-slate-500">TOPSIS contribution</div>
                                    <div className="mt-2 text-2xl font-semibold text-white">
                                        {formatPercent(topsisContribution)}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                    <div className="text-sm text-slate-500">Behavioral contribution</div>
                                    <div className="mt-2 text-2xl font-semibold text-white">
                                        {formatPercent(behavioralContribution)}
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-[24px] border border-white/8 bg-[#05070b] p-4">
                                <div className="mb-4 text-sm text-slate-400">
                                    Stability radar
                                </div>
                                <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={stabilityChartData}>
                                            <PolarGrid stroke="rgba(148,163,184,0.2)" />
                                            <PolarAngleAxis
                                                dataKey="metric"
                                                tick={{ fill: '#cbd5e1', fontSize: 12 }}
                                            />
                                            <PolarRadiusAxis
                                                tick={{ fill: '#64748b', fontSize: 10 }}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: '#0f172a',
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    borderRadius: '16px',
                                                    color: '#f8fafc',
                                                }}
                                            />
                                            <RechartsRadar
                                                name="Stability"
                                                dataKey="value"
                                                stroke="#ff2d20"
                                                fill="#ff2d20"
                                                fillOpacity={0.35}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Radar className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Alternative tradeoff analysis
                            </div>
                            <div className="grid gap-3">
                                {tradeoffRows.length === 0 ? (
                                    <div className="text-sm text-slate-500">
                                        Belum ada tradeoff analysis untuk ditampilkan.
                                    </div>
                                ) : (
                                    tradeoffRows.map((row) => (
                                        <div
                                            key={row.major?.slug}
                                            className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="text-lg font-semibold text-white">
                                                    #{row.rank} {row.major?.name}
                                                </div>
                                                <div className="text-sm text-slate-400">
                                                    Final {formatPercent(row.finalScore)}
                                                </div>
                                            </div>
                                            <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-3">
                                                <div>
                                                    TOPSIS {formatPercent(row.topsis)}
                                                </div>
                                                <div>
                                                    Behavioral {formatPercent(row.behavioral)}
                                                </div>
                                                <div>
                                                    Kekuatan utama:{' '}
                                                    {row.bestCriterion
                                                        ? toTitleCase(row.bestCriterion)
                                                        : 'N/A'}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-slate-400">
                                                Titik lemah: {row.weakestCriterion
                                                    ? toTitleCase(row.weakestCriterion)
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {tradeoffChartData.length > 0 ? (
                                <div className="mt-6 rounded-[24px] border border-white/8 bg-[#05070b] p-4">
                                    <div className="mb-4 text-sm text-slate-400">
                                        Top-3 tradeoff chart
                                    </div>
                                    <div className="h-[320px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={tradeoffChartData}
                                                margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
                                            >
                                                <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                                                <XAxis
                                                    dataKey="major"
                                                    tick={{ fill: '#e2e8f0', fontSize: 12 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: '#0f172a',
                                                        border: '1px solid rgba(255,255,255,0.08)',
                                                        borderRadius: '16px',
                                                        color: '#f8fafc',
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="topsis"
                                                    fill="#ff2d20"
                                                    radius={[8, 8, 0, 0]}
                                                />
                                                <Bar
                                                    dataKey="behavioral"
                                                    fill="#fb7185"
                                                    radius={[8, 8, 0, 0]}
                                                />
                                                <Bar
                                                    dataKey="final"
                                                    fill="#f97316"
                                                    radius={[8, 8, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-4 px-5 py-5">
                            <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Target className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Why this major
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                {topRecommendation
                                    ? `${topRecommendation.major.name} menjadi alternatif terbaik karena unggul pada kombinasi bobot prioritas, kedekatan ke solusi ideal, dan dukungan behavioral fit. Ini membuat posisi final-nya lebih defendable dibanding alternatif lain.`
                                    : 'Belum ada alasan keputusan yang bisa ditampilkan.'}
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                {runnerUpRecommendation
                                    ? `${runnerUpRecommendation.major.name} tidak berada di posisi pertama karena selisih weighted contribution dan preference score belum mampu melampaui ${topRecommendation?.major.name ?? 'alternatif utama'}.`
                                    : 'Belum ada runner-up untuk dianalisis.'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-5 py-5">
                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <BookOpenText className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Decision audit layer
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-white/8">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-white/[0.03] text-slate-400">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Field</th>
                                            <th className="px-4 py-3 font-medium">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t border-white/8">
                                            <td className="px-4 py-3 text-white">Assessment ID</td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {initialAssessment?.id ?? '-'}
                                            </td>
                                        </tr>
                                        <tr className="border-t border-white/8">
                                            <td className="px-4 py-3 text-white">Timestamp</td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {initialAssessment?.created_at ?? '-'}
                                            </td>
                                        </tr>
                                        <tr className="border-t border-white/8">
                                            <td className="px-4 py-3 text-white">Mode</td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {initialAssessment?.mode ?? 'primary'}
                                            </td>
                                        </tr>
                                        <tr className="border-t border-white/8">
                                            <td className="px-4 py-3 text-white">Top recommendation</td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {initialAssessment?.top_major?.name ?? '-'}
                                            </td>
                                        </tr>
                                        <tr className="border-t border-white/8">
                                            <td className="px-4 py-3 text-white">Jumlah alternatif</td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {initialAssessment?.recommendations.length ?? 0}
                                            </td>
                                        </tr>
                                        <tr className="border-t border-white/8">
                                            <td className="px-4 py-3 text-white">Consistency ratio</td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {initialAssessment?.consistency_ratio.toFixed(4) ??
                                                    '0.0000'}
                                            </td>
                                        </tr>
                                        <tr className="border-t border-white/8">
                                            <td className="px-4 py-3 text-white">Confidence</td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {formatConfidence(confidence)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ══════════════════════════════════════════════ */}
                {/* ║         DEEP INTELLIGENCE SECTION           ║ */}
                {/* ══════════════════════════════════════════════ */}
                {initialAssessment && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 pt-6">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ff2d20]/40 to-transparent" />
                            <span className="text-xs tracking-[0.3em] text-[#ff2d20] uppercase font-semibold">Deep Intelligence</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ff2d20]/40 to-transparent" />
                        </div>

                        <NarrativeInsights assessmentId={initialAssessment.id} />

                        <div className="grid gap-6 xl:grid-cols-2">
                            <AlgorithmicIntelligence assessmentId={initialAssessment.id} />
                            <PsychometricValidation assessmentId={initialAssessment.id} />
                        </div>

                        {initialAssessment.top_major && (
                            <div className="grid gap-6 xl:grid-cols-2">
                                <EvidenceJustification assessmentId={initialAssessment.id} majorId={initialAssessment.top_major.id} />
                                <PredictiveModeling assessmentId={initialAssessment.id} majorId={initialAssessment.top_major.id} />
                            </div>
                        )}

                        <SensitivityAnalysis assessmentId={initialAssessment.id} />
                        <CohortBenchmarking assessmentId={initialAssessment.id} />
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
