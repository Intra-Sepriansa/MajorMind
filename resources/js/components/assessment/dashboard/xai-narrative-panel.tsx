import { Brain, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AssessmentResponse, Recommendation } from '@/types';

type XaiNarrativePanelProps = {
    assessment: AssessmentResponse | null;
    topRecommendation: Recommendation | null;
    criterionLookup: Record<string, string>;
};

function generateNarrative(
    assessment: AssessmentResponse,
    rec: Recommendation,
    criterionLookup: Record<string, string>,
): string[] {
    const narratives: string[] = [];
    const majorName = rec.major.name;
    const pm = rec.meta?.profile_matching;

    // Opening statement
    narratives.push(
        `MajorMind merekomendasikan ${majorName} sebagai pilihan terbaik Anda dengan tingkat kesesuaian ${(rec.final_score * 100).toFixed(1)}%.`,
    );

    // Dominant criterion
    const weights = assessment.criterion_weights;
    const sortedCriteria = Object.entries(weights).sort(([, a], [, b]) => b - a);
    if (sortedCriteria.length > 0) {
        const [topSlug, topWeight] = sortedCriteria[0];
        narratives.push(
            `Prioritas utama Anda adalah ${criterionLookup[topSlug] ?? topSlug} dengan bobot AHP ${(topWeight * 100).toFixed(0)}%, yang sangat selaras dengan karakteristik jurusan ini.`,
        );
    }

    // Profile Matching analysis
    if (pm) {
        const coreFactorNames = pm.core_factors.map(
            (f) => f.charAt(0).toUpperCase() + f.slice(1),
        );
        narratives.push(
            `Core Factor untuk ${majorName}: ${coreFactorNames.join(', ')} (bobot 60%). Core score = ${pm.core_score.toFixed(2)}/5.0, Secondary score = ${pm.secondary_score.toFixed(2)}/5.0.`,
        );

        // Gap strengths
        const gaps = Object.entries(pm.gaps);
        const strengths = gaps.filter(([, g]) => g.raw_gap >= 0);
        const weaknesses = gaps.filter(([, g]) => g.raw_gap < -10);

        if (strengths.length > 0) {
            const strengthNames = strengths.map(
                ([dim, g]) =>
                    `${dim.charAt(0).toUpperCase() + dim.slice(1)} (${g.student}/${g.target})`,
            );
            narratives.push(
                `Kekuatan Anda: ${strengthNames.join(', ')} — melebihi atau memenuhi persyaratan jurusan.`,
            );
        }

        if (weaknesses.length > 0) {
            const weakNames = weaknesses.map(
                ([dim, g]) =>
                    `${dim.charAt(0).toUpperCase() + dim.slice(1)} (gap: ${g.raw_gap.toFixed(0)})`,
            );
            narratives.push(
                `Area yang perlu ditingkatkan: ${weakNames.join(', ')}. Namun, kekuatan pada Core Factor dapat mengkompensasi defisit ini.`,
            );
        }
    }

    // SAW verification
    const sawRank = rec.meta?.saw_verification?.saw_rank;
    const algorithmAgree = assessment.summary?.algorithm_agreement;
    if (algorithmAgree) {
        narratives.push(
            `Algoritma SAW dan TOPSIS sepakat menempatkan ${majorName} di posisi #1, memberikan confidence tambahan +5% pada rekomendasi ini.`,
        );
    } else if (sawRank && sawRank !== 1) {
        narratives.push(
            `SAW menempatkan jurusan ini di posisi #${sawRank}. Perbedaan ini wajar karena SAW menggunakan normalisasi linear sedangkan TOPSIS menggunakan jarak Euclidean ke solusi ideal.`,
        );
    }

    return narratives;
}

export function XaiNarrativePanel({
    assessment,
    topRecommendation,
    criterionLookup,
}: XaiNarrativePanelProps) {
    if (!assessment || !topRecommendation) {
        return null;
    }

    const narratives = generateNarrative(
        assessment,
        topRecommendation,
        criterionLookup,
    );

    const pm = topRecommendation.meta?.profile_matching;
    const gaps = pm ? Object.entries(pm.gaps) : [];
    const strengths = gaps.filter(([, g]) => g.raw_gap >= 0);
    const weaknesses = gaps.filter(([, g]) => g.raw_gap < 0);

    return (
        <Card className="animate-result-fade-up rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]" style={{ animationDelay: '150ms' }}>
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center gap-2 text-xs tracking-[0.3em] text-slate-500 uppercase">
                    <Brain className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Explainable AI — Why This Major?
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-3">
                        {narratives.map((text, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-slate-300"
                            >
                                {text}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {strengths.length > 0 ? (
                            <div className="rounded-[20px] border border-emerald-500/15 bg-emerald-500/5 p-4">
                                <div className="mb-3 flex items-center gap-1.5 text-xs tracking-[0.2em] text-emerald-300 uppercase">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    Strengths
                                </div>
                                <div className="space-y-2">
                                    {strengths.map(([dim, g]) => (
                                        <div key={dim} className="flex items-center justify-between text-sm">
                                            <span className="capitalize text-slate-200">{dim}</span>
                                            <span className="font-mono text-xs text-emerald-300">
                                                {g.student}/{g.target} (+{g.raw_gap.toFixed(0)})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {weaknesses.length > 0 ? (
                            <div className="rounded-[20px] border border-amber-500/15 bg-amber-500/5 p-4">
                                <div className="mb-3 flex items-center gap-1.5 text-xs tracking-[0.2em] text-amber-300 uppercase">
                                    <TrendingDown className="h-3.5 w-3.5" />
                                    Areas to Improve
                                </div>
                                <div className="space-y-2">
                                    {weaknesses.map(([dim, g]) => (
                                        <div key={dim} className="flex items-center justify-between text-sm">
                                            <span className="capitalize text-slate-200">{dim}</span>
                                            <span className="font-mono text-xs text-amber-300">
                                                {g.student}/{g.target} ({g.raw_gap.toFixed(0)})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {pm ? (
                            <div className="rounded-[20px] border border-white/8 bg-[#000000] p-4">
                                <div className="mb-3 text-xs tracking-[0.2em] text-slate-500 uppercase">
                                    Factor Classification
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Core Factors (60%)</span>
                                        <span className="font-mono text-white">
                                            {pm.core_factors.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Secondary (40%)</span>
                                        <span className="font-mono text-slate-300">
                                            {pm.secondary_factors.length > 0
                                                ? pm.secondary_factors.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')
                                                : '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
