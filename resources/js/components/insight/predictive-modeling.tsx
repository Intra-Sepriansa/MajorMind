import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, AlertCircle } from 'lucide-react';

type PredictiveData = {
    success_probability: {
        overall: number;
        level: string;
        color: string;
        factor_scores: Record<string, number>;
    };
    gpa_prediction: {
        expected_gpa: number;
        range_min: number;
        range_max: number;
        interpretation: string;
    };
    dropout_risk: {
        score: number;
        level: string;
        color: string;
        interpretation: string;
    };
    feature_importance: Array<{
        feature: string;
        importance: number;
        direction: string;
        value: number;
        target: number;
    }>;
    risk_factors: Array<{
        factor: string;
        severity: string;
        gap: number;
        recommendation: string;
    }>;
    success_pathway: Array<{
        phase: string;
        action: string;
        priority: string;
    }>;
};

export default function PredictiveModeling({ assessmentId, majorId }: { assessmentId: number; majorId: number }) {
    const [data, setData] = useState<PredictiveData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!assessmentId || !majorId) return;
        setLoading(true);
        fetch('/api/v1/insight/predictive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ assessment_id: assessmentId, major_id: majorId }),
        })
            .then((r) => r.json())
            .then((d) => setData(d))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [assessmentId, majorId]);

    if (loading) {
        return (
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-5 py-8">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ff2d20] border-t-transparent" />
                        Loading predictive models...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const prob = data.success_probability;
    const gpa = data.gpa_prediction;
    const dropout = data.dropout_risk;

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="space-y-4 px-5 py-5">
                <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <TrendingUp className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Predictive modeling
                </div>

                {/* Success Probability + GPA + Dropout in grid */}
                <div className="grid gap-3 md:grid-cols-3">
                    {/* Success Probability */}
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-center">
                        <div className="text-xs text-slate-500 mb-2">Success Probability</div>
                        <div className="relative mx-auto h-24 w-24">
                            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                                <circle cx="50" cy="50" r="42" fill="none" stroke={prob.color === 'emerald' ? '#22c55e' : prob.color === 'amber' ? '#f59e0b' : '#ef4444'} strokeWidth="8" strokeDasharray={`${prob.overall * 2.64} 264`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-lg font-bold text-white">{prob.overall}%</span>
                                <span className="text-[10px] text-slate-400">{prob.level}</span>
                            </div>
                        </div>
                    </div>

                    {/* GPA Prediction */}
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-center">
                        <div className="text-xs text-slate-500 mb-2">GPA Prediction</div>
                        <div className="text-3xl font-bold text-white">{gpa.expected_gpa.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400 mt-1">Range: {gpa.range_min.toFixed(2)} — {gpa.range_max.toFixed(2)}</div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8 mx-4">
                            <div className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500" style={{ width: `${((gpa.expected_gpa - 2.0) / 2.0) * 100}%` }} />
                        </div>
                    </div>

                    {/* Dropout Risk */}
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-center">
                        <div className="text-xs text-slate-500 mb-2">Dropout Risk</div>
                        <div className={`text-3xl font-bold ${dropout.color === 'emerald' ? 'text-emerald-400' : dropout.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>
                            {dropout.score.toFixed(0)}%
                        </div>
                        <div className={`mt-1 rounded-lg px-2 py-0.5 text-[10px] font-medium inline-block ${dropout.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' : dropout.color === 'amber' ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400'}`}>
                            {dropout.level}
                        </div>
                    </div>
                </div>

                {/* Feature Importance */}
                <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Feature Importance</div>
                    {data.feature_importance.slice(0, 6).map((f, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                            <span className={`h-2 w-2 rounded-full ${f.direction === 'positive' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            <span className="w-20 text-xs text-slate-300 truncate">{f.feature}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                                <div className={`h-full rounded-full ${f.direction === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${f.importance}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono w-10 text-right">{f.importance}%</span>
                        </div>
                    ))}
                </div>

                {/* Risk Factors */}
                {data.risk_factors.length > 0 && (
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                            <span className="text-xs font-semibold text-rose-400">Risk Factors</span>
                        </div>
                        <div className="space-y-2">
                            {data.risk_factors.slice(0, 3).map((r, i) => (
                                <div key={i} className="rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${r.severity === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {r.severity}
                                        </span>
                                        <span className="text-white font-medium">{r.factor}</span>
                                    </div>
                                    <div className="mt-1 text-[10px] text-slate-400">{r.recommendation}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Success Pathway */}
                <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Success Pathway</div>
                    {data.success_pathway.map((s, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                            <span className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${s.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400' : s.priority === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {s.phase}
                            </span>
                            <span className="text-xs text-slate-300 flex-1">{s.action}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
