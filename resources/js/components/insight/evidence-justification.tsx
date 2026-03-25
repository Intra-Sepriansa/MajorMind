import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck, ChevronDown, ChevronUp } from 'lucide-react';

type EvidenceData = {
    major: { id: number; name: string };
    curriculum_evidence: {
        criteria_breakdown: Array<{ criterion: string; score: number; intensity: string; justification: string }>;
        behavioral_thresholds: Array<{ dimension: string; target_value: number; justification: string }>;
    };
    gap_analysis: {
        behavioral_gaps: Array<{ dimension: string; student_score: number; target_score: number; gap: number; status: string; color: string }>;
        core_factors: string[];
        secondary_factors: string[];
        core_score: number | null;
        secondary_score: number | null;
    };
    scoring_justification: {
        available: boolean;
        rank?: number;
        topsis_score?: number;
        behavioral_score?: number;
        final_score?: number;
        criteria_justification?: Array<{ criterion: string; weight: number; weighted_score: number; impact: string }>;
    };
    evidence_strength: { score: number; level: string; interpretation: string };
};

export default function EvidenceJustification({ assessmentId, majorId }: { assessmentId: number; majorId: number }) {
    const [data, setData] = useState<EvidenceData | null>(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!assessmentId || !majorId) return;
        setLoading(true);
        fetch('/api/v1/insight/evidence', {
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
                        Loading evidence justification...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="px-5 py-5">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <FileCheck className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Evidence justification — {data.major.name}
                    </div>
                    <button onClick={() => setExpanded(!expanded)} className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                </div>

                {/* Evidence Strength */}
                <div className="mb-4 flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="flex-1">
                        <div className="text-xs text-slate-500">Evidence Strength</div>
                        <div className="text-lg font-semibold text-white">{data.evidence_strength.score}%</div>
                    </div>
                    <div className={`rounded-lg border px-3 py-1 text-xs font-medium ${data.evidence_strength.level === 'Strong' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : data.evidence_strength.level === 'Moderate' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
                        {data.evidence_strength.level}
                    </div>
                </div>

                {/* Competency Gaps */}
                <div className="space-y-2 mb-4">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Competency Gap Analysis</div>
                    {data.gap_analysis.behavioral_gaps.map((g, i) => (
                        <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-white capitalize">{g.dimension}</span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${g.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' : g.color === 'amber' ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400'}`}>
                                    {g.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                                <span className="text-slate-400">You: {g.student_score}</span>
                                <span className="text-slate-500">→</span>
                                <span className="text-slate-400">Target: {g.target_score}</span>
                                <span className={`ml-auto font-mono ${g.gap >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{g.gap > 0 ? '+' : ''}{g.gap}</span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                                <div className={`h-full rounded-full ${g.color === 'emerald' ? 'bg-emerald-400' : g.color === 'amber' ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${Math.min(100, Math.max(10, (g.student_score / Math.max(g.target_score, 1)) * 100))}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                {expanded && data.scoring_justification?.available && (
                    <div className="space-y-2 mt-4">
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Criteria Contribution</div>
                        {data.scoring_justification.criteria_justification?.map((c, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                                <span className="w-24 text-xs text-slate-300 capitalize truncate">{c.criterion}</span>
                                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                                    <div className="h-full rounded-full bg-[#ff2d20]" style={{ width: `${c.weighted_score * 100}%` }} />
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono w-12 text-right">{(c.weighted_score * 100).toFixed(1)}%</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.impact === 'High' ? 'bg-[#ff2d20]/15 text-[#ff8a80]' : c.impact === 'Medium' ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-slate-500'}`}>{c.impact}</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
