import { BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Recommendation } from '@/types';

type GapAnalysisPanelProps = {
    topRecommendation: Recommendation | null;
};

const gapValueLabels: Record<number, string> = {
    5.0: 'Exceeds',
    4.5: 'Very Slight',
    4.0: 'Slight',
    3.5: 'Moderate',
    3.0: 'Significant',
    2.5: 'Major',
    2.0: 'Severe',
    1.0: 'Extreme',
};

function nearestGapLabel(value: number): string {
    const keys = Object.keys(gapValueLabels).map(Number).sort((a, b) => b - a);
    for (const k of keys) {
        if (value >= k - 0.25) return gapValueLabels[k] ?? '';
    }
    return 'Extreme';
}

export function GapAnalysisPanel({ topRecommendation }: GapAnalysisPanelProps) {
    const pm = topRecommendation?.meta?.profile_matching;
    if (!pm || !topRecommendation) return null;

    const gaps = Object.entries(pm.gaps);

    return (
        <Card className="animate-result-fade-up rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]" style={{ animationDelay: '350ms' }}>
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center gap-2 text-xs tracking-[0.3em] text-slate-500 uppercase">
                    <BarChart3 className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Gap Analysis — {topRecommendation.major.name}
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                    <div className="space-y-4">
                        {gaps.map(([dim, g]) => (
                            <div key={dim} className="rounded-[20px] border border-white/8 bg-[#000000] p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium capitalize text-white">{dim}</span>
                                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                                            g.is_core
                                                ? 'border-[#ff2d20]/25 bg-[#ff2d20]/10 text-[#ffb4ae]'
                                                : 'border-white/10 bg-white/5 text-slate-400'
                                        }`}>
                                            {g.is_core ? 'Core Factor (60%)' : 'Secondary (40%)'}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-medium ${g.raw_gap >= 0 ? 'text-emerald-300' : g.raw_gap >= -15 ? 'text-amber-300' : 'text-red-300'}`}>
                                        Gap: {g.raw_gap >= 0 ? '+' : ''}{g.raw_gap.toFixed(0)} — {nearestGapLabel(g.gap_value)}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                                            <span>Your Score</span>
                                            <span className="font-mono">{g.student}</span>
                                        </div>
                                        <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-white/70 to-white/90 transition-all"
                                                style={{ width: `${Math.max(4, g.student)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                                            <span>Target Score</span>
                                            <span className="font-mono">{g.target}</span>
                                        </div>
                                        <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#ff2d20] to-[#ff6b5d] transition-all"
                                                style={{ width: `${Math.max(4, g.target)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                    <span>Gap Value: {g.gap_value.toFixed(1)}/5.0</span>
                                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/8">
                                        <div
                                            className={`h-full rounded-full ${g.gap_value >= 4.0 ? 'bg-emerald-400' : g.gap_value >= 3.0 ? 'bg-amber-400' : 'bg-red-400'}`}
                                            style={{ width: `${(g.gap_value / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 lg:w-52">
                        <div className="rounded-[20px] border border-white/8 bg-[#000000] p-4">
                            <div className="text-[11px] text-slate-500">Core Score</div>
                            <div className="mt-1 text-2xl font-semibold text-white">{pm.core_score.toFixed(2)}<span className="text-sm text-slate-500">/5.0</span></div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                                <div className="h-full rounded-full bg-[#ff2d20]" style={{ width: `${(pm.core_score / 5) * 100}%` }} />
                            </div>
                        </div>
                        <div className="rounded-[20px] border border-white/8 bg-[#000000] p-4">
                            <div className="text-[11px] text-slate-500">Secondary Score</div>
                            <div className="mt-1 text-2xl font-semibold text-white">{pm.secondary_score.toFixed(2)}<span className="text-sm text-slate-500">/5.0</span></div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                                <div className="h-full rounded-full bg-white/60" style={{ width: `${(pm.secondary_score / 5) * 100}%` }} />
                            </div>
                        </div>
                        <div className="rounded-[20px] border border-[#ff2d20]/15 bg-[#ff2d20]/5 p-4">
                            <div className="text-[11px] text-[#ffb4ae]">Composite Score</div>
                            <div className="mt-1 text-2xl font-semibold text-white">
                                {((pm.core_score * 0.6 + pm.secondary_score * 0.4) / 5 * 100).toFixed(1)}%
                            </div>
                            <div className="mt-1 text-[10px] text-slate-500">(Core 60% + Secondary 40%) / 5</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
