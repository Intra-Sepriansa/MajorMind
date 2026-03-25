import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, ShieldCheck, AlertTriangle } from 'lucide-react';

type PsychometricData = {
    riasec: {
        available: boolean;
        holland_code?: string;
        primary_type?: string;
        scores?: Record<string, number>;
        differentiation?: { score: number; level: string; interpretation: string };
        reliability_score?: number;
    };
    grit: {
        available: boolean;
        total_score?: number;
        perseverance?: number;
        consistency?: number;
        level?: string;
        balance_score?: number;
        reliability_score?: number;
        interpretation?: string;
    };
    logic: {
        available: boolean;
        theta?: number;
        standard_error?: number;
        precision_score?: number;
        ability_level?: string;
        confidence_interval_95?: { lower: number; upper: number };
        reliability_score?: number;
        interpretation?: string;
    };
    bias_detection: {
        biases: Array<{ type: string; severity: string; detail: string; impact: string }>;
        data_quality_score: number;
        overall_status: string;
    };
    overall_reliability: number;
    overall_status: string;
};

const RIASEC_LABELS: Record<string, string> = {
    realistic: 'Realistic', investigative: 'Investigative', artistic: 'Artistic',
    social: 'Social', enterprising: 'Enterprising', conventional: 'Conventional',
    R: 'Realistic', I: 'Investigative', A: 'Artistic',
    S: 'Social', E: 'Enterprising', C: 'Conventional',
};

export default function PsychometricValidation({ assessmentId }: { assessmentId: number }) {
    const [data, setData] = useState<PsychometricData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!assessmentId) return;
        setLoading(true);
        fetch('/api/v1/insight/psychometric', {
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
                        Loading psychometric validation...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="space-y-4 px-5 py-5">
                <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <Brain className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Psychometric validation
                </div>

                {/* Overall Reliability */}
                <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <ShieldCheck className={`h-6 w-6 ${data.overall_reliability >= 70 ? 'text-emerald-400' : data.overall_reliability >= 50 ? 'text-amber-400' : 'text-rose-400'}`} />
                    <div className="flex-1">
                        <div className="text-xs text-slate-500">Overall Reliability</div>
                        <div className="text-lg font-semibold text-white">{data.overall_reliability}%</div>
                    </div>
                    <div className={`rounded-lg border px-3 py-1 text-xs font-medium ${data.overall_status === 'Valid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : data.overall_status === 'Marginal' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
                        {data.overall_status}
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {/* RIASEC Card */}
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                        <div className="text-xs text-slate-400 font-semibold mb-2">RIASEC Profile</div>
                        {data.riasec.available ? (
                            <>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="rounded-lg bg-[#ff2d20]/15 px-2 py-0.5 text-xs font-bold text-[#ff2d20]">
                                        {data.riasec.holland_code}
                                    </div>
                                    <span className="text-[10px] text-slate-500">{data.riasec.differentiation?.level}</span>
                                </div>
                                {data.riasec.scores && (
                                    <div className="space-y-1 mb-2">
                                        {Object.entries(data.riasec.scores).slice(0, 6).map(([key, val]) => (
                                            <div key={key} className="flex items-center gap-2">
                                                <span className="w-14 text-[10px] text-slate-400 truncate">{RIASEC_LABELS[key] || key}</span>
                                                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                                                    <div className="h-full rounded-full bg-gradient-to-r from-[#ff2d20] to-orange-400" style={{ width: `${Math.min(val, 100)}%` }} />
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-mono w-6 text-right">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="text-[10px] text-slate-500">{data.riasec.differentiation?.interpretation}</div>
                            </>
                        ) : (
                            <div className="text-xs text-slate-500">Data RIASEC tidak tersedia.</div>
                        )}
                    </div>

                    {/* Grit Card */}
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                        <div className="text-xs text-slate-400 font-semibold mb-2">Grit Scale</div>
                        {data.grit.available ? (
                            <>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-2xl font-semibold text-white">{data.grit.total_score?.toFixed(1)}</div>
                                    <span className="text-xs text-slate-400">/ 5.0</span>
                                    <span className="ml-auto rounded-lg bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-400">{data.grit.level}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <div className="text-[10px] text-slate-500">Perseverance</div>
                                        <div className="text-sm font-mono text-white">{data.grit.perseverance?.toFixed(1)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500">Consistency</div>
                                        <div className="text-sm font-mono text-white">{data.grit.consistency?.toFixed(1)}</div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-500">{data.grit.interpretation}</div>
                            </>
                        ) : (
                            <div className="text-xs text-slate-500">Data Grit tidak tersedia.</div>
                        )}
                    </div>

                    {/* Logic Card */}
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                        <div className="text-xs text-slate-400 font-semibold mb-2">IRT Logic Test</div>
                        {data.logic.available ? (
                            <>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-2xl font-semibold text-white">θ {data.logic.theta?.toFixed(2)}</div>
                                    <span className="ml-auto rounded-lg bg-purple-500/15 px-2 py-0.5 text-[10px] font-medium text-purple-400">{data.logic.ability_level}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <div className="text-[10px] text-slate-500">Precision</div>
                                        <div className="text-sm font-mono text-white">{data.logic.precision_score}%</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500">95% CI</div>
                                        <div className="text-sm font-mono text-white">[{data.logic.confidence_interval_95?.lower}, {data.logic.confidence_interval_95?.upper}]</div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-500">{data.logic.interpretation}</div>
                            </>
                        ) : (
                            <div className="text-xs text-slate-500">Data Logic Test tidak tersedia.</div>
                        )}
                    </div>
                </div>

                {/* Bias Detection */}
                {data.bias_detection.biases.length > 0 && (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                            <span className="text-xs font-semibold text-amber-400">Response Bias Detection</span>
                        </div>
                        <div className="space-y-2">
                            {data.bias_detection.biases.map((bias, i) => (
                                <div key={i} className="rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${bias.severity === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {bias.severity}
                                        </span>
                                        <span className="text-xs font-medium text-white">{bias.type}</span>
                                    </div>
                                    <div className="mt-1 text-[10px] text-slate-400">{bias.detail}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
