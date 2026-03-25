import {
    Award,
    CheckCircle2,
    GitCompare,
    Shield,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AssessmentResponse, Recommendation } from '@/types';

type ExecutiveSummaryCardProps = {
    assessment: AssessmentResponse | null;
    topRecommendation: Recommendation | null;
    confidence: number;
};

function getConsistencyBadge(cr: number) {
    if (cr < 0.05) return { label: 'Excellent', color: 'emerald' };
    if (cr < 0.08) return { label: 'Very Good', color: 'blue' };
    if (cr < 0.1) return { label: 'Good', color: 'amber' };
    return { label: 'Needs Review', color: 'red' };
}

export function ExecutiveSummaryCard({
    assessment,
    topRecommendation,
    confidence,
}: ExecutiveSummaryCardProps) {
    if (!assessment || !topRecommendation) {
        return null;
    }

    const crBadge = getConsistencyBadge(assessment.consistency_ratio);
    const algorithmAgree = assessment.summary?.algorithm_agreement;
    const scoringMethod = assessment.summary?.scoring_method ?? 'TOPSIS + Profile Matching';
    const eliminated = assessment.summary?.eliminated_alternatives ?? 0;
    const sawRank = topRecommendation.meta?.saw_verification?.saw_rank ?? null;

    const badgeColors: Record<string, string> = {
        emerald: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
        blue: 'border-blue-400/25 bg-blue-400/10 text-blue-200',
        amber: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
        red: 'border-red-400/25 bg-red-400/10 text-red-200',
    };

    return (
        <Card className="animate-result-fade-up rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] py-0 shadow-[0_32px_120px_rgba(0,0,0,0.35)]">
            <CardContent className="px-6 py-6">
                <div className="mb-1 flex items-center gap-2 text-xs tracking-[0.3em] text-slate-500 uppercase">
                    <Award className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Executive Summary
                </div>

                <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto]">
                    <div className="space-y-3">
                        <div
                            className="text-[clamp(1.8rem,2.5vw,3rem)] font-semibold tracking-[-0.06em] text-white"
                            style={{ fontFamily: '"Space Grotesk", var(--font-sans)' }}
                        >
                            {topRecommendation.major.name}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-[#ff2d20]/30 bg-[#ff2d20]/12 px-3 py-1 text-xs font-medium text-[#ffb4ae]">
                                Match {confidence.toFixed(1)}%
                            </span>
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${badgeColors[crBadge.color]}`}>
                                CR {assessment.consistency_ratio.toFixed(4)} — {crBadge.label}
                            </span>
                            {algorithmAgree !== undefined ? (
                                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
                                    algorithmAgree
                                        ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                                        : 'border-amber-400/25 bg-amber-400/10 text-amber-200'
                                }`}>
                                    {algorithmAgree ? (
                                        <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                        <XCircle className="h-3 w-3" />
                                    )}
                                    {algorithmAgree ? 'Algorithms Agree' : 'Divergence Detected'}
                                </span>
                            ) : null}
                        </div>

                        <p className="max-w-2xl text-sm leading-7 text-slate-400">
                            Skor akhir dihitung menggunakan <span className="text-slate-200">{scoringMethod}</span>.
                            {' '}TOPSIS score {(topRecommendation.topsis_score * 100).toFixed(1)}% dikombinasikan
                            dengan Profile Matching {(topRecommendation.behavioral_score * 100).toFixed(1)}%.
                            {sawRank !== null && sawRank === 1 ? (
                                <> SAW cross-verification <span className="text-emerald-300">mengkonfirmasi</span> posisi #1.</>
                            ) : sawRank !== null ? (
                                <> SAW menempatkan jurusan ini di posisi #{sawRank}.</>
                            ) : null}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:w-48">
                        <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-3">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <TrendingUp className="h-3 w-3" /> TOPSIS Score
                            </div>
                            <div className="mt-1 font-mono text-lg text-white">
                                {(topRecommendation.topsis_score * 100).toFixed(1)}%
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-3">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <Shield className="h-3 w-3" /> Profile Match
                            </div>
                            <div className="mt-1 font-mono text-lg text-white">
                                {(topRecommendation.behavioral_score * 100).toFixed(1)}%
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-3">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <GitCompare className="h-3 w-3" /> SAW Rank
                            </div>
                            <div className="mt-1 font-mono text-lg text-white">
                                {sawRank !== null ? `#${sawRank}` : 'N/A'}
                            </div>
                        </div>
                        {eliminated > 0 ? (
                            <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-3">
                                <div className="text-[11px] text-slate-500">Eliminated</div>
                                <div className="mt-1 font-mono text-lg text-amber-300">
                                    {eliminated} majors
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
