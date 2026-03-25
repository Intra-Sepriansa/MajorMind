import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scale, Trophy, AlertTriangle, Zap } from 'lucide-react';

interface DecisionScoringProps {
    majorIds: number[];
}

type ScoreBreakdown = Record<string, { raw_score: number; weight: number; contribution: number; description: string }>;
type StrengthItem = { dimension: string; score: number; level: string };
type WeaknessItem = { dimension: string; score: number; severity: string };

type RankedRec = {
    major_id: number;
    major_name: string;
    final_score: number;
    score_breakdown: ScoreBreakdown;
    strengths: StrengthItem[];
    weaknesses: WeaknessItem[];
};

type SensitivityScenario = { top_major: string; score: number };

type DecisionData = {
    ranked_recommendations: RankedRec[];
    top_recommendation: RankedRec | null;
    scoring_dimensions: Record<string, string>;
    sensitivity_scenarios: Record<string, SensitivityScenario>;
};

const DIMENSION_LABELS: Record<string, string> = {
    algorithmic_fit: 'Algorithmic Fit',
    success_probability: 'Success Probability',
    career_prospects: 'Career Prospects',
    financial_feasibility: 'Financial Feasibility',
    personal_satisfaction: 'Personal Satisfaction',
};

const SCENARIO_LABELS: Record<string, string> = {
    career_focused: '💼 Career Focused',
    safety_focused: '🛡️ Safety Focused',
    passion_focused: '❤️ Passion Focused',
    financial_focused: '💰 Financial Focused',
};

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

    const fetchScores = useCallback(() => {
        if (majorIds.length < 2) return;
        setLoading(true);
        fetch('/api/v1/comparison/decision-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '' },
            body: JSON.stringify({ major_ids: majorIds, priorities }),
        })
            .then((r) => r.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, [majorIds, priorities]);

    useEffect(() => { fetchScores(); }, [fetchScores]);

    const handleSlider = (key: string, value: number) => {
        setPriorities((prev) => ({ ...prev, [key]: value }));
    };

    if (majorIds.length < 2) return null;

    const top = data?.top_recommendation;
    const totalPriority = Object.values(priorities).reduce((a, b) => a + b, 0);

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="px-5 py-5">
                <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <Scale className="h-3.5 w-3.5 text-[#a855f7]" />
                    Decision Scoring Engine
                </div>

                {/* Priority sliders */}
                <div className="mb-5 space-y-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-xs text-slate-400 mb-2">Adjust your priorities (auto-normalized to 100%)</div>
                    {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
                        <div key={key}>
                            <div className="flex justify-between text-xs text-slate-300 mb-1">
                                <span>{label}</span>
                                <span className="font-mono">{totalPriority > 0 ? ((priorities[key] / totalPriority) * 100).toFixed(0) : 0}%</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                value={priorities[key]}
                                onChange={(e) => handleSlider(key, Number(e.target.value))}
                                className="w-full accent-[#a855f7]"
                            />
                        </div>
                    ))}
                    <Button
                        type="button"
                        onClick={fetchScores}
                        disabled={loading}
                        className="mt-2 h-9 w-full rounded-xl bg-[#a855f7] text-sm text-white hover:bg-[#9333ea]"
                    >
                        {loading ? 'Recalculating...' : 'Recalculate Scores'}
                    </Button>
                </div>

                {loading && !data ? (
                    <div className="flex h-24 items-center justify-center text-sm text-slate-500">Computing scores...</div>
                ) : data ? (
                    <>
                        {/* Top recommendation */}
                        {top && (
                            <div className="mb-5 rounded-2xl border border-[#a855f7]/30 bg-[#a855f7]/5 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-[#facc15]" />
                                        <span className="text-lg font-semibold text-white">{top.major_name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-[#a855f7]">{top.final_score.toFixed(1)}</div>
                                        <div className="text-xs text-slate-500">Decision Score</div>
                                    </div>
                                </div>

                                {top.strengths.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {top.strengths.map((s, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                                                <Zap className="h-3 w-3" /> {s.dimension} ({s.score})
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {top.weaknesses.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {top.weaknesses.map((w, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs text-rose-300">
                                                <AlertTriangle className="h-3 w-3" /> {w.dimension} ({w.score})
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Full ranking table */}
                        <div className="overflow-hidden rounded-2xl border border-white/8">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-white/[0.03] text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">#</th>
                                        <th className="px-4 py-3 font-medium">Major</th>
                                        <th className="px-4 py-3 text-center font-medium">Score</th>
                                        {Object.values(DIMENSION_LABELS).map((l) => (
                                            <th key={l} className="px-3 py-3 text-center font-medium text-xs">{l}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.ranked_recommendations.map((rec, idx) => (
                                        <tr key={rec.major_id} className={`border-t border-white/8 ${idx === 0 ? 'bg-[#a855f7]/5' : ''}`}>
                                            <td className="px-4 py-3 font-bold text-white">#{idx + 1}</td>
                                            <td className="px-4 py-3 text-white">{rec.major_name}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-[#a855f7]">{rec.final_score.toFixed(1)}</td>
                                            {Object.keys(DIMENSION_LABELS).map((dim) => (
                                                <td key={dim} className="px-3 py-3 text-center text-xs text-slate-300">
                                                    {rec.score_breakdown[dim]?.raw_score.toFixed(0) ?? '—'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Sensitivity scenarios */}
                        {data.sensitivity_scenarios && Object.keys(data.sensitivity_scenarios).length > 0 && (
                            <div className="mt-4">
                                <div className="mb-2 text-xs text-slate-400">Priority Sensitivity Analysis</div>
                                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    {Object.entries(data.sensitivity_scenarios).map(([key, scenario]) => (
                                        <div key={key} className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                                            <div className="text-xs text-slate-400">{SCENARIO_LABELS[key] ?? key}</div>
                                            <div className="mt-1 text-sm font-semibold text-white">{scenario.top_major}</div>
                                            <div className="text-xs text-slate-500">Score: {scenario.score.toFixed(1)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </CardContent>
        </Card>
    );
}
