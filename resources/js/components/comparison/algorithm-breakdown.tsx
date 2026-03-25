import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Binary } from 'lucide-react';

interface AlgorithmBreakdownProps {
    majorIds: number[];
}

type AlgoRanks = Record<string, number>;
type AlgoScores = Record<string, number>;

type MajorBreakdown = {
    major_name: string;
    algorithm_ranks: AlgoRanks;
    algorithm_scores: AlgoScores;
    consensus_score: number;
    disagreement_level: string;
    rank_variance: number;
};

type ConsensusAnalysis = {
    average_consensus: number;
    min_consensus: number;
    max_consensus: number;
    interpretation: string;
};

type BreakdownData = {
    breakdown: Record<number, MajorBreakdown>;
    algorithm_weights: Record<string, number>;
    consensus_analysis: ConsensusAnalysis;
};

const ALGO_LABELS: Record<string, string> = {
    topsis: 'TOPSIS',
    profile_matching: 'Profile Matching',
    saw: 'SAW (Simple Additive)',
};

const ALGO_COLORS: Record<string, string> = {
    topsis: '#3b82f6',
    profile_matching: '#22d3ee',
    saw: '#facc15',
};

export default function AlgorithmBreakdown({ majorIds }: AlgorithmBreakdownProps) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BreakdownData | null>(null);

    useEffect(() => {
        if (majorIds.length < 2) return;
        setLoading(true);
        fetch('/api/v1/comparison/algorithm-breakdown', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '' },
            body: JSON.stringify({ major_ids: majorIds }),
        })
            .then((r) => r.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, [majorIds]);

    if (!data || majorIds.length < 2) return null;

    const algoKeys = Object.keys(data.algorithm_weights);
    const entries = Object.entries(data.breakdown);

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="px-5 py-5">
                <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <Binary className="h-3.5 w-3.5 text-[#a855f7]" />
                    Algorithmic Breakdown
                </div>

                {loading ? (
                    <div className="flex h-24 items-center justify-center text-sm text-slate-500">Analyzing algorithms...</div>
                ) : (
                    <>
                        {/* Consensus summary */}
                        <div className="mb-5 grid grid-cols-3 gap-3">
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                <div className="text-xs text-slate-500">Average Consensus</div>
                                <div className="mt-1 text-2xl font-semibold text-white">{data.consensus_analysis.average_consensus}%</div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                <div className="text-xs text-slate-500">Range</div>
                                <div className="mt-1 text-lg font-semibold text-white">
                                    {data.consensus_analysis.min_consensus}% – {data.consensus_analysis.max_consensus}%
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                <div className="text-xs text-slate-500">Interpretation</div>
                                <div className="mt-1 text-sm text-slate-300">{data.consensus_analysis.interpretation}</div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden rounded-2xl border border-white/8">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-white/[0.03] text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Major</th>
                                        {algoKeys.map((a) => (
                                            <th key={a} className="px-4 py-3 text-center font-medium">{ALGO_LABELS[a] ?? a}</th>
                                        ))}
                                        <th className="px-4 py-3 text-center font-medium">Consensus</th>
                                        <th className="px-4 py-3 text-center font-medium">Disagreement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map(([id, bd]) => (
                                        <tr key={id} className="border-t border-white/8">
                                            <td className="px-4 py-3 text-white">{bd.major_name}</td>
                                            {algoKeys.map((a) => (
                                                <td key={a} className="px-4 py-3 text-center">
                                                    <span className="font-semibold text-white">#{bd.algorithm_ranks[a]}</span>
                                                    <span className="ml-1 text-xs text-slate-500">({(bd.algorithm_scores[a] * 100).toFixed(1)})</span>
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 text-center font-semibold text-[#a855f7]">{bd.consensus_score.toFixed(1)}%</td>
                                            <td className="px-4 py-3 text-center text-xs text-slate-400">{bd.disagreement_level}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Weight badges */}
                        <div className="mt-4 flex flex-wrap gap-3">
                            {algoKeys.map((a) => (
                                <div key={a} className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">
                                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: ALGO_COLORS[a] ?? '#888' }} />
                                    {ALGO_LABELS[a] ?? a}: {((data.algorithm_weights[a] ?? 0) * 100).toFixed(0)}%
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
