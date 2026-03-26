import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Scale,
    Trophy,
    AlertTriangle,
    Zap,
    RotateCcw,
    ChevronDown,
    ChevronUp,
    Briefcase,
    Shield,
    Heart,
    Banknote,
    Sparkles,
    TrendingUp,
    Target,
    Loader2,
    Info,
    Crown,
    Medal,
    Award,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DecisionScoringProps {
    majorIds: number[];
}

type ScoreBreakdown = Record<
    string,
    { raw_score: number; weight: number; contribution: number; description: string }
>;
type StrengthItem = { dimension: string; score: number; level: string };
type WeaknessItem = { dimension: string; score: number; severity: string };

type RankedRec = {
    major_id: number;
    major_name: string;
    final_score: number;
    score_breakdown: ScoreBreakdown;
    dimension_scores: Record<string, number>;
    strengths: StrengthItem[];
    weaknesses: WeaknessItem[];
};

type SensitivityScenario = { top_major: string; score: number; priorities: Record<string, number> };

type DecisionData = {
    ranked_recommendations: RankedRec[];
    top_recommendation: RankedRec | null;
    scoring_dimensions: Record<string, string>;
    user_priorities: Record<string, number>;
    sensitivity_scenarios: Record<string, SensitivityScenario>;
    error?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DIMENSIONS: { key: string; label: string; icon: typeof Scale; color: string; gradient: string }[] = [
    { key: 'algorithmic_fit', label: 'Algorithmic Fit', icon: Target, color: '#a855f7', gradient: 'from-purple-500 to-violet-500' },
    { key: 'success_probability', label: 'Success Probability', icon: TrendingUp, color: '#22c55e', gradient: 'from-emerald-500 to-green-500' },
    { key: 'career_prospects', label: 'Career Prospects', icon: Briefcase, color: '#3b82f6', gradient: 'from-blue-500 to-indigo-500' },
    { key: 'financial_feasibility', label: 'Financial Feasibility', icon: Banknote, color: '#f59e0b', gradient: 'from-amber-500 to-orange-500' },
    { key: 'personal_satisfaction', label: 'Personal Satisfaction', icon: Heart, color: '#ef4444', gradient: 'from-rose-500 to-pink-500' },
];

const SCENARIO_CONFIG: Record<string, { label: string; icon: typeof Briefcase; color: string; desc: string }> = {
    career_focused: { label: 'Career Focused', icon: Briefcase, color: '#3b82f6', desc: 'Prioritaskan prospek karier & gaji' },
    safety_focused: { label: 'Safety Focused', icon: Shield, color: '#22c55e', desc: 'Prioritaskan peluang sukses & lolos' },
    passion_focused: { label: 'Passion Focused', icon: Heart, color: '#ef4444', desc: 'Prioritaskan ketertarikan & kepuasan' },
    financial_focused: { label: 'Financial Focused', icon: Banknote, color: '#f59e0b', desc: 'Prioritaskan biaya & ROI terjangkau' },
};

const RANK_STYLES = [
    { bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30', icon: Crown, iconColor: 'text-amber-400' },
    { bg: 'bg-gradient-to-r from-slate-300/10 to-slate-400/10', border: 'border-slate-400/30', icon: Medal, iconColor: 'text-slate-300' },
    { bg: 'bg-gradient-to-r from-orange-600/10 to-amber-600/10', border: 'border-orange-600/30', icon: Award, iconColor: 'text-orange-400' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function AnimatedNumber({ value, decimals = 1 }: { value: number; decimals?: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const duration = 600;
        const start = display;
        const diff = value - start;
        const startTime = performance.now();

        const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setDisplay(start + diff * eased);
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return <>{display.toFixed(decimals)}</>;
}

function ScoreGauge({ score, size = 120, color = '#a855f7' }: { score: number; size?: number; color?: string }) {
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const normalizedScore = Math.min(100, Math.max(0, score));
    const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="6"
                    fill="none"
                />
                {/* Score arc */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700 ease-out"
                    style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-white">
                    <AnimatedNumber value={score} />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Score</div>
            </div>
        </div>
    );
}

function DimensionBar({ score, color, label }: { score: number; color: string; label: string }) {
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="group cursor-default">
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{label}</span>
                            <span className="font-mono text-slate-300">{score.toFixed(0)}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: `${Math.min(100, Math.max(0, score))}%`,
                                    background: `linear-gradient(90deg, ${color}90, ${color})`,
                                    boxShadow: `0 0 8px ${color}30`,
                                }}
                            />
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="border-white/10 bg-[#0f1218] text-xs text-slate-300">
                    {label}: {score.toFixed(1)} / 100
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DecisionScoring({ majorIds }: DecisionScoringProps) {
    const [priorities, setPriorities] = useState<Record<string, number>>({
        algorithmic_fit: 30,
        success_probability: 25,
        career_prospects: 20,
        financial_feasibility: 15,
        personal_satisfaction: 10,
    });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DecisionData | null>(null);
    const [expandedMajor, setExpandedMajor] = useState<number | null>(null);
    const [hasRecalculated, setHasRecalculated] = useState(false);

    const totalPriority = useMemo(
        () => Object.values(priorities).reduce((a, b) => a + b, 0),
        [priorities],
    );

    const normalizedPriorities = useMemo(() => {
        const result: Record<string, number> = {};
        for (const [key, val] of Object.entries(priorities)) {
            result[key] = totalPriority > 0 ? (val / totalPriority) * 100 : 20;
        }
        return result;
    }, [priorities, totalPriority]);

    const fetchScores = useCallback(() => {
        if (majorIds.length < 2) return;
        setLoading(true);
        fetch('/api/v1/comparison/decision-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
            },
            body: JSON.stringify({ major_ids: majorIds, priorities }),
        })
            .then((r) => r.json())
            .then((d) => {
                setData(d as DecisionData);
                setHasRecalculated(true);
            })
            .catch(() => {
                setData(null);
            })
            .finally(() => setLoading(false));
    }, [majorIds, priorities]);

    useEffect(() => {
        fetchScores();
    }, [fetchScores]);

    const handleSlider = (key: string, value: number) => {
        setPriorities((prev) => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
        setPriorities({
            algorithmic_fit: 30,
            success_probability: 25,
            career_prospects: 20,
            financial_feasibility: 15,
            personal_satisfaction: 10,
        });
    };

    if (majorIds.length < 2) return null;

    const top = data?.top_recommendation;

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="px-5 py-5">
                {/* ── Header ── */}
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <Scale className="h-3.5 w-3.5 text-[#a855f7]" />
                        Decision Scoring Engine
                    </div>
                    <div className="flex items-center gap-2">
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-slate-300">
                                        <Info className="h-3.5 w-3.5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="left"
                                    className="max-w-xs border-white/10 bg-[#0f1218] text-xs leading-5 text-slate-300"
                                >
                                    Simulasikan prioritas Anda menggunakan slider di bawah, lalu
                                    klik Recalculate untuk melihat bagaimana ranking berubah
                                    berdasarkan bobot yang Anda tentukan.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* ── Priority Control Panel ── */}
                <div className="mb-6 rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                            <Sparkles className="h-3.5 w-3.5 text-[#a855f7]" />
                            Priority Configuration
                        </div>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                        </button>
                    </div>

                    <div className="space-y-4">
                        {DIMENSIONS.map((dim) => {
                            const DimIcon = dim.icon;
                            const pct = normalizedPriorities[dim.key] ?? 20;

                            return (
                                <div key={dim.key} className="group">
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="flex h-6 w-6 items-center justify-center rounded-md"
                                                style={{ backgroundColor: `${dim.color}15` }}
                                            >
                                                <DimIcon
                                                    className="h-3 w-3"
                                                    style={{ color: dim.color }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-300">
                                                {dim.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                                                style={{
                                                    backgroundColor: `${dim.color}15`,
                                                    color: dim.color,
                                                }}
                                            >
                                                {pct.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 overflow-hidden rounded-full bg-white/[0.06]">
                                            <div
                                                className="h-full rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${pct}%`,
                                                    background: `linear-gradient(90deg, ${dim.color}70, ${dim.color})`,
                                                    boxShadow: `0 0 12px ${dim.color}25`,
                                                }}
                                            />
                                        </div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            step={5}
                                            value={priorities[dim.key]}
                                            onChange={(e) =>
                                                handleSlider(dim.key, Number(e.target.value))
                                            }
                                            className="relative z-10 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/50 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Button
                        type="button"
                        onClick={fetchScores}
                        disabled={loading}
                        className="mt-5 h-10 w-full rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:from-[#9333ea] hover:to-[#6d28d9] hover:shadow-purple-500/30 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Recalculating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Recalculate Scores
                            </span>
                        )}
                    </Button>
                </div>

                {/* ── Results ── */}
                {loading && !data ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-20 animate-pulse rounded-2xl bg-white/[0.04]"
                            />
                        ))}
                    </div>
                ) : data?.error ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-5 py-8 text-center">
                        <AlertTriangle className="h-8 w-8 text-rose-400" />
                        <div className="text-sm text-rose-300">{data.error}</div>
                        <Button
                            onClick={fetchScores}
                            variant="outline"
                            className="mt-2 h-8 rounded-lg border-rose-500/20 text-xs text-rose-300 hover:bg-rose-500/10"
                        >
                            Retry
                        </Button>
                    </div>
                ) : data ? (
                    <div className={`space-y-5 ${hasRecalculated ? 'animate-in fade-in-0 slide-in-from-bottom-2 duration-500' : ''}`}>
                        {/* ── Top Recommendation Hero ── */}
                        {top && (
                            <div className="relative overflow-hidden rounded-2xl border border-[#a855f7]/25 bg-gradient-to-br from-[#a855f7]/10 via-[#a855f7]/5 to-transparent p-5">
                                {/* Decorative glow */}
                                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#a855f7]/10 blur-3xl" />

                                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-4">
                                        <ScoreGauge score={top.final_score} />
                                        <div>
                                            <div className="mb-1 flex items-center gap-2">
                                                <Trophy className="h-4 w-4 text-amber-400" />
                                                <span className="text-xs uppercase tracking-widest text-slate-400">
                                                    Top Recommendation
                                                </span>
                                            </div>
                                            <div className="text-xl font-bold text-white">
                                                {top.major_name}
                                            </div>

                                            {/* Strengths & Weaknesses */}
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {top.strengths.map((s, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300"
                                                    >
                                                        <Zap className="h-2.5 w-2.5" />
                                                        {s.dimension.split(' ')[0]}
                                                        <span className="ml-0.5 font-mono opacity-70">
                                                            {s.score}
                                                        </span>
                                                    </span>
                                                ))}
                                                {top.weaknesses.map((w, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-medium text-rose-300"
                                                    >
                                                        <AlertTriangle className="h-2.5 w-2.5" />
                                                        {w.dimension.split(' ')[0]}
                                                        <span className="ml-0.5 font-mono opacity-70">
                                                            {w.score}
                                                        </span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dimension breakdown mini-bars for top */}
                                    <div className="w-full max-w-[240px] space-y-2">
                                        {DIMENSIONS.map((dim) => (
                                            <DimensionBar
                                                key={dim.key}
                                                score={top.dimension_scores?.[dim.key] ?? top.score_breakdown[dim.key]?.raw_score ?? 0}
                                                color={dim.color}
                                                label={dim.label.split(' ')[0]}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Full Ranking Cards ── */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                <Target className="h-3.5 w-3.5 text-[#a855f7]" />
                                Full Ranking
                            </div>

                            {data.ranked_recommendations.map((rec, idx) => {
                                const rankStyle = RANK_STYLES[idx] ?? {
                                    bg: 'bg-white/[0.02]',
                                    border: 'border-white/8',
                                    icon: null,
                                    iconColor: 'text-slate-500',
                                };
                                const RankIcon = rankStyle.icon;
                                const isExpanded = expandedMajor === rec.major_id;

                                return (
                                    <div
                                        key={rec.major_id}
                                        className={`overflow-hidden rounded-2xl border transition-all duration-300 ${rankStyle.border} ${rankStyle.bg}`}
                                    >
                                        {/* Main row */}
                                        <button
                                            onClick={() =>
                                                setExpandedMajor(
                                                    isExpanded ? null : rec.major_id,
                                                )
                                            }
                                            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
                                        >
                                            {/* Rank badge */}
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                                                {RankIcon ? (
                                                    <RankIcon
                                                        className={`h-4 w-4 ${rankStyle.iconColor}`}
                                                    />
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-500">
                                                        #{idx + 1}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Name & score */}
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-semibold text-white">
                                                    {rec.major_name}
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                    <span className="font-mono text-[#a855f7]">
                                                        <AnimatedNumber value={rec.final_score} />
                                                    </span>
                                                    <span className="text-white/20">·</span>
                                                    <span>
                                                        {rec.strengths.length} strengths ·{' '}
                                                        {rec.weaknesses.length} weaknesses
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Dimension mini bars inline */}
                                            <div className="hidden gap-1 md:flex">
                                                {DIMENSIONS.map((dim) => {
                                                    const score = rec.dimension_scores?.[dim.key] ?? rec.score_breakdown[dim.key]?.raw_score ?? 0;
                                                    return (
                                                        <TooltipProvider
                                                            key={dim.key}
                                                            delayDuration={100}
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="flex w-10 flex-col items-center gap-0.5">
                                                                        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                                                                            <div
                                                                                className="h-full rounded-full transition-all duration-500"
                                                                                style={{
                                                                                    width: `${score}%`,
                                                                                    backgroundColor:
                                                                                        dim.color,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-[8px] text-slate-500">
                                                                            {score.toFixed(0)}
                                                                        </span>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="border-white/10 bg-[#0f1218] text-xs text-slate-300">
                                                                    {dim.label}: {score.toFixed(1)}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    );
                                                })}
                                            </div>

                                            {/* Expand chevron */}
                                            <div className="text-slate-500">
                                                {isExpanded ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Expanded detail */}
                                        {isExpanded && (
                                            <div className="animate-in slide-in-from-top-2 border-t border-white/8 px-4 py-4 duration-300 fade-in-0">
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    {/* Left: Dimension breakdown */}
                                                    <div className="space-y-3">
                                                        <div className="text-[11px] uppercase tracking-wider text-slate-500">
                                                            Score Breakdown
                                                        </div>
                                                        {DIMENSIONS.map((dim) => {
                                                            const breakdown =
                                                                rec.score_breakdown[dim.key];
                                                            const rawScore = rec.dimension_scores?.[dim.key] ?? breakdown?.raw_score ?? 0;

                                                            return (
                                                                <div key={dim.key}>
                                                                    <DimensionBar
                                                                        score={rawScore}
                                                                        color={dim.color}
                                                                        label={dim.label}
                                                                    />
                                                                    {breakdown && (
                                                                        <div className="mt-0.5 text-[10px] text-slate-500">
                                                                            {rawScore.toFixed(0)} ×{' '}
                                                                            {(
                                                                                breakdown.weight *
                                                                                100
                                                                            ).toFixed(0)}
                                                                            % ={' '}
                                                                            <span className="text-[#a855f7]">
                                                                                {breakdown.contribution.toFixed(
                                                                                    1,
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Right: Strengths & Weaknesses */}
                                                    <div className="space-y-3">
                                                        {rec.strengths.length > 0 && (
                                                            <div>
                                                                <div className="mb-2 text-[11px] uppercase tracking-wider text-slate-500">
                                                                    Strengths
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {rec.strengths.map((s, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="flex items-center justify-between rounded-xl bg-emerald-500/8 px-3 py-2"
                                                                        >
                                                                            <div className="flex items-center gap-2 text-xs text-emerald-300">
                                                                                <Zap className="h-3 w-3" />
                                                                                {s.dimension}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
                                                                                    {s.level}
                                                                                </span>
                                                                                <span className="font-mono text-xs text-emerald-400">
                                                                                    {s.score}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {rec.weaknesses.length > 0 && (
                                                            <div>
                                                                <div className="mb-2 text-[11px] uppercase tracking-wider text-slate-500">
                                                                    Weaknesses
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {rec.weaknesses.map((w, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="flex items-center justify-between rounded-xl bg-rose-500/8 px-3 py-2"
                                                                        >
                                                                            <div className="flex items-center gap-2 text-xs text-rose-300">
                                                                                <AlertTriangle className="h-3 w-3" />
                                                                                {w.dimension}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-medium text-rose-300">
                                                                                    {w.severity}
                                                                                </span>
                                                                                <span className="font-mono text-xs text-rose-400">
                                                                                    {w.score}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {rec.strengths.length === 0 && rec.weaknesses.length === 0 && (
                                                            <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-3 text-xs text-slate-500">
                                                                <Info className="h-3.5 w-3.5" />
                                                                All dimensions within moderate range (50-70)
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Sensitivity Analysis ── */}
                        {data.sensitivity_scenarios &&
                            Object.keys(data.sensitivity_scenarios).length > 0 && (
                                <div>
                                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <Sparkles className="h-3.5 w-3.5 text-[#a855f7]" />
                                        Priority Sensitivity — What if you prioritize...
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        {Object.entries(data.sensitivity_scenarios).map(
                                            ([key, scenario]) => {
                                                const config = SCENARIO_CONFIG[key];
                                                if (!config) return null;
                                                const ScIcon = config.icon;
                                                const isTopChanged =
                                                    top &&
                                                    scenario.top_major !== top.major_name;

                                                return (
                                                    <div
                                                        key={key}
                                                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                                                            isTopChanged
                                                                ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/8 to-transparent'
                                                                : 'border-white/8 bg-white/[0.03]'
                                                        }`}
                                                    >
                                                        <div className="px-4 py-4">
                                                            <div className="mb-2 flex items-center gap-2">
                                                                <div
                                                                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                                                                    style={{
                                                                        backgroundColor: `${config.color}15`,
                                                                    }}
                                                                >
                                                                    <ScIcon
                                                                        className="h-3.5 w-3.5"
                                                                        style={{
                                                                            color: config.color,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-medium text-slate-300">
                                                                    {config.label}
                                                                </span>
                                                            </div>
                                                            <div className="mb-1 text-[10px] text-slate-500">
                                                                {config.desc}
                                                            </div>
                                                            <div className="mt-2 flex items-center justify-between">
                                                                <span className="text-sm font-semibold text-white">
                                                                    {scenario.top_major}
                                                                </span>
                                                                <span className="rounded-lg bg-[#a855f7]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#a855f7]">
                                                                    {scenario.score.toFixed(1)}
                                                                </span>
                                                            </div>
                                                            {isTopChanged && (
                                                                <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400">
                                                                    <AlertTriangle className="h-3 w-3" />
                                                                    Top recommendation berubah!
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
