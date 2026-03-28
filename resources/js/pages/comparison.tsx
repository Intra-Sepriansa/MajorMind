import { Head } from '@inertiajs/react';
import ComparisonHeader3D from '@/components/comparison/comparison-header-3d';
import SpiderChart from '@/components/comparison/spider-chart';
import AlgorithmBreakdown from '@/components/comparison/algorithm-breakdown';
import ParetoFrontier from '@/components/comparison/pareto-frontier';
import DecisionScoring from '@/components/comparison/decision-scoring';
import {
    ArrowDown,
    ArrowRightLeft,
    ArrowUp,
    Binary,
    BrainCircuit,
    Download,
    Gauge,
    GitCompareArrows,
    ListOrdered,
    LoaderCircle,
    Radar,
    Scale,
    Sparkles,
    Target,
} from 'lucide-react';
import { useMemo, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type {
    AssessmentHistoryPaginated,
    AssessmentResponse,
    BreadcrumbItem,
    Recommendation,
} from '@/types';

type ComparisonPageProps = {
    assessmentHistory?: AssessmentHistoryPaginated;
    initialAssessment?: AssessmentResponse | null;
    scenarios?: AssessmentResponse[];
};

type ComparisonMode = 'baseline-vs-scenario' | 'scenario-vs-scenario';

type AssessmentOption = {
    created_at?: string;
    id: number;
    label: string;
    summaryLabel: string;
    type: 'baseline' | 'scenario';
    value: string;
};

type MovementRow = {
    baselineRank: number | null;
    leftScore: number;
    major: Recommendation['major'];
    rightRank: number | null;
    rightScore: number;
    scoreDelta: number;
    shift: number | null;
};

type RankFlowRow = {
    leftRank: number | null;
    major: Recommendation['major'];
    rightRank: number | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Comparison', href: '/comparison' },
];

function formatSessionTime(value: string | null | undefined): string {
    if (!value) {
        return 'Unknown session';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

function formatConfidence(value: number | undefined): string {
    return `${(value ?? 0).toFixed(1)}%`;
}

function formatDelta(value: number, options?: { digits?: number; percent?: boolean }): string {
    const digits = options?.digits ?? 1;
    const sign = value > 0 ? '+' : value < 0 ? '-' : '';
    const suffix = options?.percent ? '%' : '';

    return `${sign}${Math.abs(value).toFixed(digits)}${suffix}`;
}

function toTitleCase(slug: string): string {
    return slug
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function getTrendTone(value: number) {
    if (value > 0) {
        return 'text-emerald-300';
    }

    if (value < 0) {
        return 'text-rose-300';
    }

    return 'text-slate-300';
}

function getTrendIcon(value: number) {
    if (value > 0) {
        return ArrowUp;
    }

    if (value < 0) {
        return ArrowDown;
    }

    return ArrowRightLeft;
}

function getConfidenceBand(value: number): string {
    if (value >= 85) {
        return 'Sangat kuat';
    }

    if (value >= 70) {
        return 'Kuat';
    }

    if (value >= 55) {
        return 'Sedang';
    }

    return 'Perlu ditinjau';
}

function getRankMap(recommendations: Recommendation[]) {
    return Object.fromEntries(
        recommendations.map((recommendation) => [
            recommendation.major.slug,
            recommendation.rank,
        ]),
    );
}

function getRecommendationMap(recommendations: Recommendation[]) {
    return Object.fromEntries(
        recommendations.map((recommendation) => [
            recommendation.major.slug,
            recommendation,
        ]),
    );
}

function getAssessmentConfidence(assessment: AssessmentResponse | null): number {
    return assessment?.summary?.recommendation_confidence ?? 0;
}

function getOptionLabel(assessment: AssessmentResponse, fallback: string): string {
    return assessment.label ?? assessment.top_major?.name ?? fallback;
}

function createAssessmentOption(
    assessment: AssessmentResponse,
    type: 'baseline' | 'scenario',
    fallback: string,
): AssessmentOption {
    return {
        created_at: assessment.created_at,
        id: assessment.id,
        label: getOptionLabel(assessment, fallback),
        summaryLabel: `${assessment.top_major?.name ?? 'N/A'} • ${formatConfidence(
            assessment.summary?.recommendation_confidence,
        )}`,
        type,
        value: `${type}:${assessment.id}`,
    };
}

function parseAssessmentValue(value: string) {
    const [type, id] = value.split(':');

    return {
        id: Number(id),
        type: type as 'baseline' | 'scenario',
    };
}

function resolveAssessmentByValue(
    value: string,
    baseline: AssessmentResponse | null,
    scenarios: AssessmentResponse[],
) {
    const parsed = parseAssessmentValue(value);

    if (parsed.type === 'baseline') {
        return baseline?.id === parsed.id ? baseline : null;
    }

    return scenarios.find((scenario) => scenario.id === parsed.id) ?? null;
}

function RankFlowChart({
    rows,
}: {
    rows: RankFlowRow[];
}) {
    const width = 760;
    const leftX = 170;
    const rightX = 590;
    const top = 36;
    const rowHeight = 44;
    const chartHeight = top * 2 + Math.max(rows.length - 1, 0) * rowHeight + 28;

    const yForRank = (rank: number | null, fallbackIndex: number) =>
        top + ((rank ?? fallbackIndex + 1) - 1) * rowHeight;

    return (
        <svg
            viewBox={`0 0 ${width} ${chartHeight}`}
            className="h-[380px] w-full rounded-[24px] border border-white/8 bg-[#05070b]"
            role="img"
            aria-label="Rank flow chart"
        >
            <text x={80} y={18} fill="#94a3b8" fontSize="11" letterSpacing="3">
                LEFT
            </text>
            <text x={528} y={18} fill="#94a3b8" fontSize="11" letterSpacing="3">
                RIGHT
            </text>

            {rows.map((row, index) => {
                const leftY = yForRank(row.leftRank, index);
                const rightY = yForRank(row.rightRank, index);
                const shifted = (row.leftRank ?? 999) !== (row.rightRank ?? 999);
                const stroke = shifted ? '#ff2d20' : '#475569';

                return (
                    <g key={row.major.slug}>
                        <path
                            d={`M ${leftX} ${leftY} C 300 ${leftY}, 460 ${rightY}, ${rightX} ${rightY}`}
                            fill="none"
                            stroke={stroke}
                            strokeWidth={shifted ? 2.5 : 1.5}
                            opacity={shifted ? 0.95 : 0.45}
                        />
                        <circle cx={leftX} cy={leftY} r={7} fill="#0f172a" stroke={stroke} />
                        <circle cx={rightX} cy={rightY} r={7} fill="#0f172a" stroke={stroke} />
                        <text x={24} y={leftY + 4} fill="#e2e8f0" fontSize="12">
                            {`#${row.leftRank ?? '-'} ${row.major.name}`}
                        </text>
                        <text x={rightX + 18} y={rightY + 4} fill="#f8fafc" fontSize="12">
                            {`#${row.rightRank ?? '-'} ${row.major.name}`}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

export default function ComparisonPage({
    assessmentHistory = {
        data: [],
        meta: { current_page: 1, last_page: 1, per_page: 5, total: 0 },
    },
    initialAssessment = null,
    scenarios = [],
}: ComparisonPageProps) {
    const [comparisonMode, setComparisonMode] = useState<ComparisonMode>(
        'baseline-vs-scenario',
    );
    const scenarioOptions = useMemo(
        () =>
            scenarios.map((scenario, index) =>
                createAssessmentOption(scenario, 'scenario', `Scenario ${index + 1}`),
            ),
        [scenarios],
    );
    const baselineOption = initialAssessment
        ? createAssessmentOption(initialAssessment, 'baseline', 'Baseline')
        : null;

    const [rightSelection, setRightSelection] = useState<string | null>(
        scenarioOptions[0]?.value ?? null,
    );
    const [leftScenarioSelection, setLeftScenarioSelection] = useState<string | null>(
        scenarioOptions[0]?.value ?? null,
    );
    const [rightScenarioSelection, setRightScenarioSelection] = useState<string | null>(
        scenarioOptions[1]?.value ?? scenarioOptions[0]?.value ?? null,
    );
    const [exportingPdf, setExportingPdf] = useState(false);

    // Derive major IDs for advanced comparison components
    const comparisonMajorIds = useMemo(() => {
        if (!initialAssessment?.recommendations?.length) return [];
        return initialAssessment.recommendations.slice(0, 5).map((r) => r.major.id);
    }, [initialAssessment]);

    const handleExportComparisonPdf = async () => {
        if (comparisonMajorIds.length < 2) return;
        setExportingPdf(true);
        try {
            const params = new URLSearchParams();
            comparisonMajorIds.forEach((id) => params.append('major_ids[]', String(id)));
            const res = await fetch(`/comparison/export-pdf?${params.toString()}`);
            if (!res.ok) throw new Error('Failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MajorMind_Comparison_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            // silently fail
        } finally {
            setExportingPdf(false);
        }
    };

    const leftAssessment = useMemo(() => {
        if (comparisonMode === 'baseline-vs-scenario') {
            return initialAssessment;
        }

        return leftScenarioSelection
            ? resolveAssessmentByValue(leftScenarioSelection, initialAssessment, scenarios)
            : null;
    }, [comparisonMode, initialAssessment, leftScenarioSelection, scenarios]);

    const rightAssessment = useMemo(() => {
        if (comparisonMode === 'baseline-vs-scenario') {
            return rightSelection
                ? resolveAssessmentByValue(rightSelection, initialAssessment, scenarios)
                : null;
        }

        return rightScenarioSelection
            ? resolveAssessmentByValue(rightScenarioSelection, initialAssessment, scenarios)
            : null;
    }, [
        comparisonMode,
        initialAssessment,
        rightScenarioSelection,
        rightSelection,
        scenarios,
    ]);

    const comparisonState = useMemo(() => {
        if (!leftAssessment || !rightAssessment) {
            return null;
        }

        const leftRankMap = getRankMap(leftAssessment.recommendations);
        const rightRankMap = getRankMap(rightAssessment.recommendations);
        const leftRecommendationMap = getRecommendationMap(leftAssessment.recommendations);
        const rightRecommendationMap = getRecommendationMap(rightAssessment.recommendations);

        const weightRows = leftAssessment.criterion_order.map((slug) => {
            const left = leftAssessment.criterion_weights[slug] ?? 0;
            const right = rightAssessment.criterion_weights[slug] ?? 0;

            return {
                delta: right - left,
                left,
                right,
                slug,
            };
        });

        const sortedWeightRows = [...weightRows].sort(
            (a, b) => Math.abs(b.delta) - Math.abs(a.delta),
        );

        const movementRows: MovementRow[] = leftAssessment.recommendations.map(
            (leftRecommendation) => {
                const rightRecommendation =
                    rightRecommendationMap[leftRecommendation.major.slug] ?? null;
                const leftRank = leftRecommendation.rank ?? null;
                const rightRank = rightRecommendation?.rank ?? null;

                return {
                    baselineRank: leftRank,
                    leftScore: leftRecommendation.final_score,
                    major: leftRecommendation.major,
                    rightRank,
                    rightScore: rightRecommendation?.final_score ?? 0,
                    scoreDelta:
                        (rightRecommendation?.final_score ?? 0) -
                        leftRecommendation.final_score,
                    shift:
                        leftRank && rightRank ? leftRank - rightRank : null,
                };
            },
        );

        const sortedMovementRows = [...movementRows].sort(
            (a, b) =>
                Math.abs(b.shift ?? 0) - Math.abs(a.shift ?? 0) ||
                Math.abs(b.scoreDelta) - Math.abs(a.scoreDelta),
        );

        const leftTop = leftAssessment.recommendations[0] ?? null;
        const rightTop = rightAssessment.recommendations[0] ?? null;
        const leftRunnerUp = leftAssessment.recommendations[1] ?? null;
        const rightRunnerUp = rightAssessment.recommendations[1] ?? null;
        const leftTopGap =
            leftTop && leftRunnerUp ? leftTop.final_score - leftRunnerUp.final_score : 0;
        const rightTopGap =
            rightTop && rightRunnerUp ? rightTop.final_score - rightRunnerUp.final_score : 0;
        const leftConfidence = getAssessmentConfidence(leftAssessment);
        const rightConfidence = getAssessmentConfidence(rightAssessment);
        const topChanged =
            leftTop?.major.slug && rightTop?.major.slug
                ? leftTop.major.slug !== rightTop.major.slug
                : false;
        const mostChangedCriterion = sortedWeightRows[0] ?? null;
        const strongestMover = sortedMovementRows[0] ?? null;
        const highestImprovement = [...sortedMovementRows].sort(
            (a, b) => (b.shift ?? -999) - (a.shift ?? -999),
        )[0] ?? null;
        const hardestDrop = [...sortedMovementRows].sort(
            (a, b) => (a.shift ?? 999) - (b.shift ?? 999),
        )[0] ?? null;

        const newlyEnteredMajors = rightAssessment.recommendations.filter(
            (recommendation) => !leftRankMap[recommendation.major.slug],
        );
        const droppedMajors = leftAssessment.recommendations.filter(
            (recommendation) => !rightRankMap[recommendation.major.slug],
        );

        const weightedContributionRows = leftAssessment.criterion_order.map((slug) => {
            const leftWeighted = leftTop?.meta?.weighted_scores?.[slug] ?? 0;
            const rightWeighted = rightTop?.meta?.weighted_scores?.[slug] ?? 0;

            return {
                delta: rightWeighted - leftWeighted,
                leftWeighted,
                rightWeighted,
                slug,
            };
        });

        const rankFlowRows: RankFlowRow[] = rightAssessment.recommendations
            .slice(0, 6)
            .map((recommendation, index) => ({
                leftRank: leftRankMap[recommendation.major.slug] ?? null,
                major: recommendation.major,
                rightRank: recommendation.rank ?? index + 1,
            }))
            .sort(
                (a, b) =>
                    (a.leftRank ?? 999) - (b.leftRank ?? 999) ||
                    (a.rightRank ?? 999) - (b.rightRank ?? 999),
            );

        const decisionNarrative = [
            topChanged
                ? `Rekomendasi utama berubah dari ${leftTop?.major.name ?? 'N/A'} ke ${rightTop?.major.name ?? 'N/A'}.`
                : `Rekomendasi utama tetap ${rightTop?.major.name ?? 'N/A'}, sehingga keputusan inti relatif stabil.`,
            mostChangedCriterion
                ? `Kriteria dengan perubahan bobot terbesar adalah ${toTitleCase(mostChangedCriterion.slug)} dengan delta ${formatDelta(mostChangedCriterion.delta * 100, { percent: true })}.`
                : 'Tidak ada perubahan bobot yang signifikan.',
            highestImprovement?.shift && highestImprovement.shift > 0
                ? `${highestImprovement.major.name} naik ${highestImprovement.shift} peringkat dan menjadi alternatif paling diuntungkan.`
                : 'Tidak ada alternatif yang naik signifikan.',
            hardestDrop?.shift && hardestDrop.shift < 0
                ? `${hardestDrop.major.name} turun ${Math.abs(hardestDrop.shift)} peringkat dan menjadi alternatif paling terdampak.`
                : 'Tidak ada alternatif yang turun tajam.',
        ];

        return {
            decisionNarrative,
            droppedMajors,
            hardestDrop,
            highestImprovement,
            leftConfidence,
            leftTop,
            leftTopGap,
            mostChangedCriterion,
            movementRows: sortedMovementRows,
            newlyEnteredMajors,
            rankFlowRows,
            rightConfidence,
            rightTop,
            rightTopGap,
            strongestMover,
            topChanged,
            weightRows: sortedWeightRows,
            weightedContributionRows,
        };
    }, [leftAssessment, rightAssessment]);




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
            <Head title="Comparison" />

            <div ref={scrollRef} className="scroll-reveal-container space-y-6 bg-[#0b0e14] px-4 py-6 text-white lg:px-6">
                <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
                    <ComparisonHeader3D />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs tracking-[0.28em] text-slate-300 uppercase">
                            <GitCompareArrows className="h-3.5 w-3.5 text-[#ff2d20]" />
                            Comparison Engine
                        </div>
                        <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                            <div>
                                <h1 className="text-4xl font-semibold tracking-[-0.05em]">
                                    Multi-mode decision comparison engine.
                                </h1>
                                <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
                                    Comparison sekarang mendukung `baseline vs scenario`
                                    dan `scenario vs scenario`, lengkap dengan rank flow
                                    chart, explainability, diagnostic movement table,
                                    dan export PDF untuk kebutuhan sidang atau presentasi.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Comparison Controls (single row) ── */}
                <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                    <CardContent className="px-5 py-4">
                        <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                            <Radar className="h-3.5 w-3.5 text-[#ff2d20]" />
                            Comparison controls
                        </div>
                        <div className="flex flex-wrap items-end gap-4">
                            {/* Mode */}
                            <div className="min-w-[180px] flex-1 space-y-1">
                                <div className="text-[11px] text-slate-400">Mode</div>
                                <Select
                                    value={comparisonMode}
                                    onValueChange={(value) =>
                                        setComparisonMode(value as ComparisonMode)
                                    }
                                >
                                    <SelectTrigger className="h-9 w-full rounded-xl border-white/10 bg-[#05070b] text-sm text-white">
                                        <SelectValue placeholder="Pilih mode" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#05070b] text-white">
                                        <SelectItem value="baseline-vs-scenario">Baseline vs Scenario</SelectItem>
                                        <SelectItem value="scenario-vs-scenario">Scenario vs Scenario</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {comparisonMode === 'baseline-vs-scenario' ? (
                                <>
                                    {/* Left = Baseline (static) */}
                                    <div className="min-w-[180px] flex-1 space-y-1">
                                        <div className="text-[11px] text-slate-400">Left (Baseline)</div>
                                        <div className="flex h-9 items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-300 truncate">
                                            {baselineOption?.label ?? 'Belum ada baseline'}
                                        </div>
                                    </div>
                                    {/* Right = Scenario picker */}
                                    <div className="min-w-[180px] flex-1 space-y-1">
                                        <div className="text-[11px] text-slate-400">Right (Scenario)</div>
                                        <Select value={rightSelection ?? undefined} onValueChange={setRightSelection}>
                                            <SelectTrigger className="h-9 w-full rounded-xl border-white/10 bg-[#05070b] text-sm text-white">
                                                <SelectValue placeholder="Pilih scenario" />
                                            </SelectTrigger>
                                            <SelectContent className="border-white/10 bg-[#05070b] text-white">
                                                {scenarioOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Left scenario */}
                                    <div className="min-w-[180px] flex-1 space-y-1">
                                        <div className="text-[11px] text-slate-400">Left Scenario</div>
                                        <Select value={leftScenarioSelection ?? undefined} onValueChange={setLeftScenarioSelection}>
                                            <SelectTrigger className="h-9 w-full rounded-xl border-white/10 bg-[#05070b] text-sm text-white">
                                                <SelectValue placeholder="Pilih scenario kiri" />
                                            </SelectTrigger>
                                            <SelectContent className="border-white/10 bg-[#05070b] text-white">
                                                {scenarioOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Right scenario */}
                                    <div className="min-w-[180px] flex-1 space-y-1">
                                        <div className="text-[11px] text-slate-400">Right Scenario</div>
                                        <Select value={rightScenarioSelection ?? undefined} onValueChange={setRightScenarioSelection}>
                                            <SelectTrigger className="h-9 w-full rounded-xl border-white/10 bg-[#05070b] text-sm text-white">
                                                <SelectValue placeholder="Pilih scenario kanan" />
                                            </SelectTrigger>
                                            <SelectContent className="border-white/10 bg-[#05070b] text-white">
                                                {scenarioOptions.filter((o) => o.value !== leftScenarioSelection).map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}

                            {/* Stats pill */}
                            <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                                <span>{assessmentHistory.meta.total} history</span>
                                <span className="text-white/20">|</span>
                                <span>{scenarios.length} scenarios</span>
                            </div>

                            {/* Export PDF */}
                            <button
                                onClick={() => void handleExportComparisonPdf()}
                                disabled={exportingPdf || comparisonMajorIds.length < 2}
                                className="flex items-center gap-1.5 rounded-xl bg-[#ff2d20] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#ff5549] disabled:opacity-50"
                            >
                                <Download className="h-3.5 w-3.5" />
                                {exportingPdf ? 'Exporting...' : 'Export PDF'}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <section className="grid gap-6">
                        <div className="grid gap-4 xl:grid-cols-2">
                            {[leftAssessment, rightAssessment].map((assessment, index) => (
                                <Card
                                    key={assessment?.id ?? index}
                                    className="rounded-2xl border-white/10 bg-[#000000]/82 py-0"
                                >
                                    <CardContent className="flex items-center gap-4 px-4 py-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-xs font-bold text-slate-400">
                                            {index === 0 ? 'L' : 'R'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-semibold text-white">
                                                {assessment?.top_major?.name ?? 'Belum ada sesi'}
                                            </div>
                                            <div className="flex flex-wrap gap-x-3 text-[11px] text-slate-400">
                                                <span>{getOptionLabel(
                                                    assessment ?? {
                                                        id: -1,
                                                        student_name: null,
                                                        criterion_order: [],
                                                        criterion_weights: {},
                                                        consistency_ratio: 0,
                                                        behavioral_profile: {},
                                                        top_major: null,
                                                        summary: null,
                                                        recommendations: [],
                                                    },
                                                    'N/A',
                                                )}</span>
                                                <span>Confidence {formatConfidence(assessment?.summary?.recommendation_confidence)}</span>
                                                <span>CR {assessment?.consistency_ratio.toFixed(4) ?? '0.0000'}</span>
                                                <span>{formatSessionTime(assessment?.created_at)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {comparisonState ? (
                            <>
                                <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="space-y-3 px-5 py-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Target className="h-4 w-4 text-[#ff2d20]" />
                                                Decision status
                                            </div>
                                            <div className="text-xl font-semibold text-white">
                                                {comparisonState.topChanged
                                                    ? 'Top recommendation changed'
                                                    : 'Top recommendation stable'}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                {comparisonState.leftTop?.major.name ?? 'N/A'} {'->'}{' '}
                                                {comparisonState.rightTop?.major.name ?? 'N/A'}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="space-y-3 px-5 py-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Gauge className="h-4 w-4 text-[#ff2d20]" />
                                                Confidence delta
                                            </div>
                                            <div
                                                className={`text-3xl font-semibold ${getTrendTone(
                                                    comparisonState.rightConfidence -
                                                        comparisonState.leftConfidence,
                                                )}`}
                                            >
                                                {formatDelta(
                                                    comparisonState.rightConfidence -
                                                        comparisonState.leftConfidence,
                                                    { percent: true },
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                Right band: {getConfidenceBand(comparisonState.rightConfidence)}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="space-y-3 px-5 py-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Scale className="h-4 w-4 text-[#ff2d20]" />
                                                Dominant criterion shift
                                            </div>
                                            <div className="text-xl font-semibold text-white">
                                                {comparisonState.mostChangedCriterion
                                                    ? toTitleCase(
                                                          comparisonState.mostChangedCriterion.slug,
                                                      )
                                                    : 'N/A'}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                {comparisonState.mostChangedCriterion
                                                    ? formatDelta(
                                                          comparisonState.mostChangedCriterion.delta *
                                                              100,
                                                          { percent: true },
                                                      )
                                                    : '0.0%'}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="space-y-3 px-5 py-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <ListOrdered className="h-4 w-4 text-[#ff2d20]" />
                                                Strongest mover
                                            </div>
                                            <div className="text-xl font-semibold text-white">
                                                {comparisonState.strongestMover?.major.name ?? 'N/A'}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                {comparisonState.strongestMover?.shift
                                                    ? `${formatDelta(
                                                          comparisonState.strongestMover.shift,
                                                          { digits: 0 },
                                                      )} rank`
                                                    : 'No rank shift'}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </section>

                                <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="px-5 py-5">
                                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                                <BrainCircuit className="h-3.5 w-3.5 text-[#ff2d20]" />
                                                Explainability summary
                                            </div>
                                            <div className="grid gap-3">
                                                {comparisonState.decisionNarrative.map((line) => (
                                                    <div
                                                        key={line}
                                                        className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300"
                                                    >
                                                        {line}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="px-5 py-5">
                                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                                <Sparkles className="h-3.5 w-3.5 text-[#ff2d20]" />
                                                Stability metrics
                                            </div>
                                            <div className="grid gap-3">
                                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                                    <div className="text-sm text-slate-500">Left top gap</div>
                                                    <div className="mt-2 text-2xl font-semibold text-white">
                                                        {formatPercent(comparisonState.leftTopGap)}
                                                    </div>
                                                </div>
                                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                                    <div className="text-sm text-slate-500">Right top gap</div>
                                                    <div className="mt-2 text-2xl font-semibold text-white">
                                                        {formatPercent(comparisonState.rightTopGap)}
                                                    </div>
                                                </div>
                                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                                    <div className="text-sm text-slate-500">New entrants / dropped</div>
                                                    <div className="mt-2 text-2xl font-semibold text-white">
                                                        {comparisonState.newlyEnteredMajors.length} / {comparisonState.droppedMajors.length}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </section>

                                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="px-5 py-5">
                                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                                <GitCompareArrows className="h-3.5 w-3.5 text-[#ff2d20]" />
                                                Rank flow chart
                                            </div>
                                            <RankFlowChart rows={comparisonState.rankFlowRows} />
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="space-y-4 px-5 py-5">
                                            <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                                <Target className="h-3.5 w-3.5 text-[#ff2d20]" />
                                                Decision movements
                                            </div>
                                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                                <div className="text-sm text-slate-500">Highest improvement</div>
                                                <div className="mt-2 text-lg font-semibold text-white">
                                                    {comparisonState.highestImprovement?.major.name ?? 'N/A'}
                                                </div>
                                                <div className="mt-1 text-sm text-slate-400">
                                                    {comparisonState.highestImprovement?.shift
                                                        ? `${formatDelta(comparisonState.highestImprovement.shift, { digits: 0 })} rank`
                                                        : 'No positive shift'}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                                <div className="text-sm text-slate-500">Hardest drop</div>
                                                <div className="mt-2 text-lg font-semibold text-white">
                                                    {comparisonState.hardestDrop?.major.name ?? 'N/A'}
                                                </div>
                                                <div className="mt-1 text-sm text-slate-400">
                                                    {comparisonState.hardestDrop?.shift
                                                        ? `${formatDelta(comparisonState.hardestDrop.shift, { digits: 0 })} rank`
                                                        : 'No negative shift'}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                                <div className="text-sm text-slate-500">New entrants</div>
                                                <div className="mt-2 text-sm leading-7 text-slate-300">
                                                    {comparisonState.newlyEnteredMajors.length > 0
                                                        ? comparisonState.newlyEnteredMajors.map((major) => major.major.name).join(', ')
                                                        : 'Tidak ada alternatif baru yang masuk ranking.'}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                                                <div className="text-sm text-slate-500">Dropped majors</div>
                                                <div className="mt-2 text-sm leading-7 text-slate-300">
                                                    {comparisonState.droppedMajors.length > 0
                                                        ? comparisonState.droppedMajors.map((major) => major.major.name).join(', ')
                                                        : 'Tidak ada alternatif yang keluar dari ranking.'}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </section>

                                <section className="grid gap-6 xl:grid-cols-2">
                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="px-5 py-5">
                                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                                <Scale className="h-3.5 w-3.5 text-[#ff2d20]" />
                                                Weight comparison matrix
                                            </div>
                                            <div className="overflow-hidden rounded-2xl border border-white/8">
                                                <table className="min-w-full text-left text-sm">
                                                    <thead className="bg-white/[0.03] text-slate-400">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Criterion</th>
                                                            <th className="px-4 py-3 font-medium">Left</th>
                                                            <th className="px-4 py-3 font-medium">Right</th>
                                                            <th className="px-4 py-3 font-medium">Delta</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {comparisonState.weightRows.map((row) => {
                                                            const TrendIcon = getTrendIcon(row.delta);

                                                            return (
                                                                <tr key={row.slug} className="border-t border-white/8">
                                                                    <td className="px-4 py-3 text-white">
                                                                        {toTitleCase(row.slug)}
                                                                    </td>
                                                                    <td className="px-4 py-3 font-mono text-slate-300">
                                                                        {formatPercent(row.left)}
                                                                    </td>
                                                                    <td className="px-4 py-3 font-mono text-[#ffb4ae]">
                                                                        {formatPercent(row.right)}
                                                                    </td>
                                                                    <td className={`px-4 py-3 font-mono ${getTrendTone(row.delta)}`}>
                                                                        <div className="flex items-center gap-2">
                                                                            <TrendIcon className="h-3.5 w-3.5" />
                                                                            {formatDelta(row.delta * 100, { percent: true })}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="px-5 py-5">
                                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                                <Binary className="h-3.5 w-3.5 text-[#ff2d20]" />
                                                Weighted contribution to top alternative
                                            </div>
                                            <div className="overflow-hidden rounded-2xl border border-white/8">
                                                <table className="min-w-full text-left text-sm">
                                                    <thead className="bg-white/[0.03] text-slate-400">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Criterion</th>
                                                            <th className="px-4 py-3 font-medium">Left top</th>
                                                            <th className="px-4 py-3 font-medium">Right top</th>
                                                            <th className="px-4 py-3 font-medium">Delta</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {comparisonState.weightedContributionRows.map((row) => {
                                                            const TrendIcon = getTrendIcon(row.delta);

                                                            return (
                                                                <tr key={row.slug} className="border-t border-white/8">
                                                                    <td className="px-4 py-3 text-white">
                                                                        {toTitleCase(row.slug)}
                                                                    </td>
                                                                    <td className="px-4 py-3 font-mono text-slate-300">
                                                                        {row.leftWeighted.toFixed(4)}
                                                                    </td>
                                                                    <td className="px-4 py-3 font-mono text-[#ffb4ae]">
                                                                        {row.rightWeighted.toFixed(4)}
                                                                    </td>
                                                                    <td className={`px-4 py-3 font-mono ${getTrendTone(row.delta)}`}>
                                                                        <div className="flex items-center gap-2">
                                                                            <TrendIcon className="h-3.5 w-3.5" />
                                                                            {formatDelta(row.delta, { digits: 4 })}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </section>

                                <section className="grid gap-6">
                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="px-5 py-5">
                                            <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                                <ListOrdered className="h-3.5 w-3.5 text-[#ff2d20]" />
                                                Rank shift diagnostics
                                            </div>
                                            <div className="overflow-hidden rounded-2xl border border-white/8">
                                                <table className="min-w-full text-left text-sm">
                                                    <thead className="bg-white/[0.03] text-slate-400">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Major</th>
                                                            <th className="px-4 py-3 font-medium">Left rank</th>
                                                            <th className="px-4 py-3 font-medium">Right rank</th>
                                                            <th className="px-4 py-3 font-medium">Shift</th>
                                                            <th className="px-4 py-3 font-medium">Score delta</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {comparisonState.movementRows.map((row) => {
                                                            const TrendIcon = getTrendIcon(row.shift ?? 0);

                                                            return (
                                                                <tr key={row.major.slug} className="border-t border-white/8">
                                                                    <td className="px-4 py-3 text-white">{row.major.name}</td>
                                                                    <td className="px-4 py-3 text-slate-300">
                                                                        {row.baselineRank ? `#${row.baselineRank}` : 'out'}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-[#ffb4ae]">
                                                                        {row.rightRank ? `#${row.rightRank}` : 'out'}
                                                                    </td>
                                                                    <td className={`px-4 py-3 ${getTrendTone(row.shift ?? 0)}`}>
                                                                        <div className="flex items-center gap-2">
                                                                            <TrendIcon className="h-3.5 w-3.5" />
                                                                            {row.shift ? formatDelta(row.shift, { digits: 0 }) : '0'}
                                                                        </div>
                                                                    </td>
                                                                    <td className={`px-4 py-3 font-mono ${getTrendTone(row.scoreDelta)}`}>
                                                                        {formatDelta(row.scoreDelta * 100, { percent: true })}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                        <CardContent className="space-y-4 px-5 py-5">
                                            <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                                <Sparkles className="h-3.5 w-3.5 text-[#ff2d20]" />
                                                Comparison notes
                                            </div>
                                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                                {rightAssessment?.scenario_notes ||
                                                    leftAssessment?.scenario_notes ||
                                                    'Belum ada notes untuk pasangan comparison ini.'}
                                            </div>
                                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                                {rightAssessment?.decision_rationale ||
                                                    leftAssessment?.decision_rationale ||
                                                    'Belum ada rationale keputusan untuk pasangan comparison ini.'}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </section>
                            </>
                        ) : (
                            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                                <CardContent className="px-5 py-5 text-sm text-slate-500">
                                    Pilih pasangan assessment untuk memulai comparison engine.
                                </CardContent>
                            </Card>
                        )}
                </section>

                {/* ── Advanced Intelligence Section ── */}
                {comparisonMajorIds.length >= 2 && (
                    <section className="space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs tracking-[0.28em] text-slate-300 uppercase">
                            <Sparkles className="h-3.5 w-3.5 text-[#a855f7]" />
                            Advanced Intelligence
                        </div>

                        <div className="grid gap-6 xl:grid-cols-2">
                            <SpiderChart majorIds={comparisonMajorIds} />
                            <AlgorithmBreakdown majorIds={comparisonMajorIds} />
                        </div>

                        <ParetoFrontier majorIds={comparisonMajorIds} />
                        <DecisionScoring majorIds={comparisonMajorIds} />
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
