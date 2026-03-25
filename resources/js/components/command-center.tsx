import { Link } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    BookOpenText,
    CheckCircle2,
    ChevronRight,
    Download,
    FlaskConical,
    GitCompareArrows,
    Gauge,
    Shield,
    Sparkles,
    Target,
    Trophy,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { AssessmentResponse, Recommendation } from '@/types';

type CommandCenterProps = {
    assessment: AssessmentResponse | null;
    onExportPdf?: () => void;
    isExporting?: boolean;
};

/* ---------- helpers ---------- */

function getConfidenceLabel(cr: number): { label: string; color: string } {
    if (cr <= 0.05) return { label: 'Excellent', color: '#22c55e' };
    if (cr <= 0.08) return { label: 'Good', color: '#84cc16' };
    if (cr <= 0.1) return { label: 'Acceptable', color: '#eab308' };
    return { label: 'Invalid', color: '#ef4444' };
}

function getOverallConfidence(assessment: AssessmentResponse): {
    label: string;
    color: string;
    value: number;
} {
    const confidence =
        assessment.summary?.recommendation_confidence ??
        assessment.recommendations[0]?.meta?.probability_percentage ??
        0;
    if (confidence >= 80) return { label: 'VERY HIGH', color: '#22c55e', value: confidence };
    if (confidence >= 60) return { label: 'HIGH', color: '#84cc16', value: confidence };
    if (confidence >= 40) return { label: 'MEDIUM', color: '#eab308', value: confidence };
    return { label: 'LOW', color: '#ef4444', value: confidence };
}

const phaseData = [
    { id: 1, name: 'Profiling', full: 'Behavioral Profiling' },
    { id: 2, name: 'AHP', full: 'Pairwise Comparison' },
    { id: 3, name: 'CR', full: 'Consistency Validation' },
    { id: 4, name: 'Normalize', full: 'TOPSIS Normalization' },
    { id: 5, name: 'Distance', full: 'Ideal Solution Distance' },
    { id: 6, name: 'Ranking', full: 'Final Ranking' },
];

const rankIcons = [Trophy, Award, Target];
const rankColors = ['#fbbf24', '#94a3b8', '#cd7f32'];

/* ---------- Animated Counter ---------- */

function AnimCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
    const [val, setVal] = useState(0);
    const started = useRef(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting && !started.current) {
                    started.current = true;
                    const t0 = performance.now();
                    const step = (now: number) => {
                        const p = Math.min((now - t0) / 1400, 1);
                        const ease = 1 - Math.pow(1 - p, 3);
                        setVal(ease * end);
                        if (p < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [end]);

    return (
        <span ref={ref}>
            {end < 1 ? val.toFixed(4) : Math.round(val)}
            {suffix}
        </span>
    );
}

/* ---------- CR Gauge Mini ---------- */

function CrGaugeMini({ cr }: { cr: number }) {
    const { color } = getConfidenceLabel(cr);
    const angle = Math.min(cr / 0.2, 1) * 180 - 90; // maps 0‑0.2 to -90°‑90°

    return (
        <svg viewBox="0 0 120 70" className="h-16 w-28">
            {/* background arcs */}
            <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 10 60 A 50 50 0 0 1 60 10" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" opacity={0.3} />
            <path d="M 60 10 A 50 50 0 0 1 85 16" fill="none" stroke="#eab308" strokeWidth="8" strokeLinecap="round" opacity={0.3} />
            <path d="M 85 16 A 50 50 0 0 1 110 60" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" opacity={0.3} />
            {/* needle */}
            <line
                x1="60"
                y1="60"
                x2={60 + 38 * Math.cos((angle * Math.PI) / 180)}
                y2={60 + 38 * Math.sin((angle * Math.PI) / 180)}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <circle cx="60" cy="60" r="3" fill={color} />
            {/* label */}
            <text x="60" y="55" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
                {cr.toFixed(4)}
            </text>
        </svg>
    );
}

/* ---------- Phase Navigator ---------- */

function PhaseNavigator({ completedPhases }: { completedPhases: number }) {
    return (
        <div className="flex items-center gap-1 overflow-x-auto py-2 sm:gap-2">
            {phaseData.map((phase, i) => {
                const done = i < completedPhases;
                return (
                    <Link
                        key={phase.id}
                        href="/insights"
                        className="group flex flex-col items-center gap-1.5 rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-3 transition-all hover:border-[#ff2d20]/30 hover:bg-[#ff2d20]/5 sm:px-4"
                    >
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                done
                                    ? 'bg-[#ff2d20] text-white shadow-[0_0_12px_rgba(255,45,32,0.4)]'
                                    : 'border border-white/15 text-slate-400'
                            }`}
                        >
                            {done ? <CheckCircle2 className="h-4 w-4" /> : `0${phase.id}`}
                        </div>
                        <span className="text-[10px] tracking-wide text-slate-400 group-hover:text-white sm:text-xs">
                            {phase.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}

/* ---------- Recommendation Card ---------- */

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
    const Icon = rankIcons[index] ?? Target;
    const color = rankColors[index] ?? '#94a3b8';
    const ciPercent = rec.topsis_score * 100;

    return (
        <Card className="group relative overflow-hidden rounded-[24px] border-white/10 bg-[#000000]/82 py-0 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,45,32,0.08)]">
            {/* rank badge */}
            <div
                className="absolute top-0 right-0 rounded-bl-2xl px-3 py-1.5 text-xs font-bold"
                style={{ backgroundColor: `${color}20`, color }}
            >
                #{index + 1}
            </div>
            <CardContent className="px-5 py-5">
                <div className="mb-3 flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">{rec.major.name}</h3>
                        <p className="text-xs text-slate-400">
                            Ci: <AnimCounter end={rec.topsis_score} /> ({ciPercent.toFixed(1)}%)
                        </p>
                    </div>
                </div>

                {/* Ci progress bar */}
                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${ciPercent}%`,
                            background: `linear-gradient(90deg, ${color}, #ff2d20)`,
                        }}
                    />
                </div>

                {/* distance metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                        <span className="text-slate-500">D+ (ideal)</span>
                        <p className="font-mono text-white">{rec.distance_positive.toFixed(4)}</p>
                    </div>
                    <div className="rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                        <span className="text-slate-500">D− (worst)</span>
                        <p className="font-mono text-white">{rec.distance_negative.toFixed(4)}</p>
                    </div>
                </div>

                <Link
                    href="/insights"
                    className="mt-3 flex items-center gap-1 text-xs text-[#ff2d20] opacity-0 transition-all group-hover:opacity-100"
                >
                    Explore Details <ChevronRight className="h-3 w-3" />
                </Link>
            </CardContent>
        </Card>
    );
}

/* ---------- Main Component ---------- */

export function CommandCenter({ assessment, onExportPdf, isExporting }: CommandCenterProps) {
    if (!assessment || assessment.recommendations.length === 0) {
        return (
            <section className="mb-8 px-5 pt-6 lg:px-8">
                <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                    <CardContent className="flex flex-col items-center gap-4 px-8 py-12 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff2d20]/10">
                            <Sparkles className="h-7 w-7 text-[#ff2d20]" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Belum Ada Assessment</h2>
                        <p className="max-w-md text-sm text-slate-400">
                            Jalankan assessment pertama Anda untuk melihat Command Center — visualisasi rekomendasi real-time dari 6 fase komputasi AHP-TOPSIS.
                        </p>
                    </CardContent>
                </Card>
            </section>
        );
    }

    const top3 = assessment.recommendations.slice(0, 3);
    const cr = assessment.consistency_ratio;
    const crInfo = getConfidenceLabel(cr);
    const confidence = getOverallConfidence(assessment);
    const completedPhases = cr <= 0.1 ? 6 : 2; // all phases done if CR valid
    const totalWeights = Object.values(assessment.criterion_weights);
    const normComplete = totalWeights.length > 0 && Math.abs(totalWeights.reduce((a, b) => a + b, 0) - 1) < 0.01;

    return (
        <section className="mb-8 space-y-5 px-5 pt-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <Zap className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Command center
                    </div>
                    <h1 className="text-xl font-bold text-white sm:text-2xl">
                        Rekomendasi Jurusan Anda
                    </h1>
                </div>
                <div className="flex gap-2">
                    {onExportPdf && (
                        <button
                            type="button"
                            onClick={onExportPdf}
                            disabled={isExporting}
                            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-[#ff2d20]/10 hover:border-[#ff2d20]/30 hover:text-white disabled:opacity-50"
                        >
                            <Download className="h-3.5 w-3.5" /> 
                            {isExporting ? 'Exporting...' : 'Export PDF'}
                        </button>
                    )}
                    <Link
                        href="/insights"
                        className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 transition-all hover:border-[#ff2d20]/30 hover:text-white"
                    >
                        <BookOpenText className="h-3.5 w-3.5" /> Insights
                    </Link>
                    <Link
                        href="/comparison"
                        className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 transition-all hover:border-[#ff2d20]/30 hover:text-white"
                    >
                        <GitCompareArrows className="h-3.5 w-3.5" /> Comparison
                    </Link>
                    <Link
                        href="/scenario-lab"
                        className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 transition-all hover:border-[#ff2d20]/30 hover:text-white"
                    >
                        <FlaskConical className="h-3.5 w-3.5" /> What-If
                    </Link>
                </div>
            </div>

            {/* Top row: Recommendation Cards + Confidence Meter */}
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                {/* Top-3 Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {top3.map((rec, i) => (
                        <RecommendationCard key={rec.major.id} rec={rec} index={i} />
                    ))}
                </div>

                {/* Algorithmic Confidence Meter */}
                <Card className="rounded-[24px] border-white/10 bg-[#000000]/82 py-0">
                    <CardContent className="space-y-4 px-5 py-5">
                        <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                            <Shield className="h-3.5 w-3.5 text-[#ff2d20]" />
                            Algorithmic Confidence
                        </div>

                        {/* CR Gauge */}
                        <div className="flex flex-col items-center">
                            <CrGaugeMini cr={cr} />
                            <span className="mt-1 text-xs font-medium" style={{ color: crInfo.color }}>
                                {crInfo.label} Consistency
                            </span>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2 text-xs">
                                <span className="text-slate-400">CR Score</span>
                                <span className="font-mono font-semibold" style={{ color: crInfo.color }}>
                                    {cr.toFixed(4)}
                                    <span className="ml-1 text-slate-500">/ 0.1</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2 text-xs">
                                <span className="text-slate-400">Normalization</span>
                                <span className={normComplete ? 'text-green-400' : 'text-yellow-400'}>
                                    {normComplete ? 'Complete' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2 text-xs">
                                <span className="text-slate-400">Confidence</span>
                                <span className="font-semibold" style={{ color: confidence.color }}>
                                    {confidence.label}
                                </span>
                            </div>
                        </div>

                        {/* Confidence Bar */}
                        <div>
                            <div className="mb-1 flex justify-between text-xs text-slate-500">
                                <span>Overall</span>
                                <span>{confidence.value.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${confidence.value}%`,
                                        background: `linear-gradient(90deg, ${confidence.color}, #ff2d20)`,
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Phase Navigator */}
            <Card className="rounded-[24px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-5 py-4">
                    <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <Gauge className="h-3.5 w-3.5 text-[#ff2d20]" />
                        6 Fase Komputasi
                    </div>
                    <PhaseNavigator completedPhases={completedPhases} />
                </CardContent>
            </Card>
        </section>
    );
}
