import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

type SensitivityData = {
    weight_sensitivity: Array<{
        criterion: string;
        stability_score: number;
        reversals: number;
        critical: boolean;
        scenarios: Array<{ delta: number; new_top: string; rank_reversal: boolean }>;
    }>;
    behavioral_sensitivity: Array<{
        dimension: string;
        base_value: number;
        stability_score: number;
        reversals: number;
    }>;
    robustness: {
        overall_score: number;
        level: string;
        color: string;
        weight_avg: number;
        behavioral_avg: number;
        interpretation: string;
    };
    critical_thresholds: Array<{
        criterion: string;
        min_reversal_delta: number;
        warning: string;
    }>;
};

export default function SensitivityAnalysis({ assessmentId }: { assessmentId: number }) {
    const [data, setData] = useState<SensitivityData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!assessmentId) return;
        setLoading(true);
        fetch('/api/v1/insight/sensitivity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ assessment_id: assessmentId }),
        })
            .then((r) => r.json())
            .then((d) => setData(d))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [assessmentId]);

    if (loading) {
        return (
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-5 py-8">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ff2d20] border-t-transparent" />
                        Running sensitivity analysis...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const { robustness, weight_sensitivity, behavioral_sensitivity, critical_thresholds } = data;

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="space-y-4 px-5 py-5">
                <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <Shield className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Sensitivity analysis
                </div>

                {/* Robustness Gauge */}
                <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                    <div className="relative h-20 w-20">
                        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                            <circle cx="50" cy="50" r="42" fill="none" stroke={robustness.color === 'emerald' ? '#22c55e' : robustness.color === 'amber' ? '#f59e0b' : '#ef4444'} strokeWidth="8" strokeDasharray={`${robustness.overall_score * 2.64} 264`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-white">{robustness.overall_score}%</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="text-xs text-slate-500">Overall Robustness</div>
                        <div className={`text-lg font-semibold ${robustness.color === 'emerald' ? 'text-emerald-400' : robustness.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>
                            {robustness.level}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">{robustness.interpretation}</div>
                    </div>
                </div>

                {/* Weight vs Behavioral stability */}
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
                        <div className="text-xs text-slate-500">Weight Stability</div>
                        <div className="mt-1 text-xl font-semibold text-white">{robustness.weight_avg}%</div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
                            <div className="h-full rounded-full bg-[#ff2d20]" style={{ width: `${robustness.weight_avg}%` }} />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
                        <div className="text-xs text-slate-500">Behavioral Stability</div>
                        <div className="mt-1 text-xl font-semibold text-white">{robustness.behavioral_avg}%</div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
                            <div className="h-full rounded-full bg-purple-500" style={{ width: `${robustness.behavioral_avg}%` }} />
                        </div>
                    </div>
                </div>

                {/* Weight Sensitivity Table */}
                <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Weight Perturbation Results</div>
                    {weight_sensitivity.map((ws, i) => (
                        <div key={i} className={`rounded-xl border px-4 py-2.5 ${ws.critical ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/8 bg-white/[0.03]'}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-white capitalize">{ws.criterion}</span>
                                <div className="flex items-center gap-2">
                                    {ws.critical && <AlertTriangle className="h-3 w-3 text-rose-400" />}
                                    <span className={`text-[10px] font-mono ${ws.stability_score >= 80 ? 'text-emerald-400' : ws.stability_score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                        {ws.stability_score}% stable
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {ws.scenarios.map((s, j) => (
                                    <div key={j} className={`flex-1 rounded-md px-1 py-0.5 text-center text-[9px] ${s.rank_reversal ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-slate-500'}`}>
                                        {s.delta > 0 ? '+' : ''}{s.delta}%
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Critical Thresholds */}
                {critical_thresholds.length > 0 && (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                            <span className="text-xs font-semibold text-amber-400">Critical Thresholds</span>
                        </div>
                        {critical_thresholds.map((ct, i) => (
                            <div key={i} className="text-[10px] text-slate-400 mt-1">• {ct.warning}</div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
