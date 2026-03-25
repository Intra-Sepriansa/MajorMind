import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';

type AlgorithmicData = {
    consensus: {
        per_major: Array<{
            major_name: string;
            ranks: Record<string, number>;
            scores: Record<string, number>;
            agreement_score: number;
            consensus_level: { level: string; color: string; icon: string };
        }>;
        overall_score: number;
        overall_level: { level: string; color: string; icon: string };
    };
    decomposition: Array<{
        major_name: string;
        rank: number;
        final_score: number;
        contributions: {
            topsis: { raw: number; weight: number; contribution: number; percentage: number };
            profile_matching: { raw: number; weight: number; contribution: number; percentage: number };
        };
        dominant: string;
        saw_rank: number | null;
        saw_score: number | null;
    }>;
    stability: {
        stable: Array<{ major_name: string; stability_score: number; avg_rank: number }>;
        volatile: Array<{ major_name: string; stability_score: number; avg_rank: number }>;
        overall_score: number;
    };
};

export default function AlgorithmicIntelligence({ assessmentId }: { assessmentId: number }) {
    const [data, setData] = useState<AlgorithmicData | null>(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!assessmentId) return;
        setLoading(true);
        fetch('/api/v1/insight/algorithmic', {
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
                        Loading algorithmic intelligence...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const { consensus, decomposition, stability } = data;

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="px-5 py-5">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <Cpu className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Algorithmic intelligence
                    </div>
                    <button onClick={() => setExpanded(!expanded)} className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        {expanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>

                {/* Overall Consensus */}
                <div className="mb-4 flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="text-2xl">{consensus.overall_level.icon}</div>
                    <div className="flex-1">
                        <div className="text-xs text-slate-500">Overall Algorithm Consensus</div>
                        <div className="text-lg font-semibold text-white">{consensus.overall_score}%</div>
                    </div>
                    <div className={`rounded-lg border px-3 py-1 text-xs font-medium ${consensus.overall_level.color === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : consensus.overall_level.color === 'blue' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : consensus.overall_level.color === 'amber' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
                        {consensus.overall_level.level}
                    </div>
                </div>

                {/* Stability Overview */}
                <div className="mb-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
                        <div className="text-xs text-slate-500">Rank Stability</div>
                        <div className="mt-1 text-xl font-semibold text-white">{stability.overall_score}%</div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#ff2d20] to-emerald-400" style={{ width: `${stability.overall_score}%` }} />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
                        <div className="text-xs text-slate-500">Stable Majors</div>
                        <div className="mt-1 text-xl font-semibold text-emerald-400">{stability.stable.length}</div>
                        <div className="text-xs text-slate-500 mt-1">of {stability.stable.length + stability.volatile.length} analyzed</div>
                    </div>
                </div>

                {expanded && (
                    <div className="space-y-4 mt-4">
                        {/* Per-Major Consensus */}
                        <div className="space-y-2">
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Per-Algorithm Rank Table</div>
                            <div className="overflow-hidden rounded-2xl border border-white/8">
                                <table className="min-w-full text-left text-xs">
                                    <thead className="bg-white/[0.03] text-slate-400">
                                        <tr>
                                            <th className="px-3 py-2 font-medium">Major</th>
                                            <th className="px-3 py-2 font-medium text-center">TOPSIS</th>
                                            <th className="px-3 py-2 font-medium text-center">SAW</th>
                                            <th className="px-3 py-2 font-medium text-center">PM</th>
                                            <th className="px-3 py-2 font-medium text-center">Agreement</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {consensus.per_major.slice(0, 10).map((m, i) => (
                                            <tr key={i} className="border-t border-white/6">
                                                <td className="px-3 py-2 text-white font-medium">{m.major_name}</td>
                                                <td className="px-3 py-2 text-center text-slate-300">#{m.ranks.topsis ?? '-'}</td>
                                                <td className="px-3 py-2 text-center text-slate-300">#{m.ranks.saw ?? '-'}</td>
                                                <td className="px-3 py-2 text-center text-slate-300">#{m.ranks.profile_matching ?? '-'}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className={`font-mono font-semibold ${m.agreement_score >= 80 ? 'text-emerald-400' : m.agreement_score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                        {m.agreement_score}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Hybrid Score Decomposition */}
                        <div className="space-y-2">
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Hybrid Score Decomposition</div>
                            {decomposition.slice(0, 5).map((d, i) => (
                                <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-white">#{d.rank} {d.major_name}</span>
                                        <span className="text-xs text-slate-400 font-mono">{(d.final_score * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex gap-1 h-4 rounded-full overflow-hidden">
                                        <div className="bg-[#ff2d20] transition-all" style={{ width: `${d.contributions.topsis.percentage}%` }} title={`TOPSIS: ${d.contributions.topsis.percentage}%`} />
                                        <div className="bg-purple-500 transition-all" style={{ width: `${d.contributions.profile_matching.percentage}%` }} title={`PM: ${d.contributions.profile_matching.percentage}%`} />
                                    </div>
                                    <div className="flex gap-4 mt-2 text-[10px] text-slate-400">
                                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#ff2d20]" />TOPSIS {d.contributions.topsis.percentage}%</span>
                                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" />PM {d.contributions.profile_matching.percentage}%</span>
                                        {d.saw_rank && <span className="text-slate-500">SAW Rank: #{d.saw_rank}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
