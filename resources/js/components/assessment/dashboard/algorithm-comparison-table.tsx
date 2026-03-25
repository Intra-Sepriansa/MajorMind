import { GitCompare, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AssessmentResponse } from '@/types';

type AlgorithmComparisonTableProps = {
    assessment: AssessmentResponse | null;
    formatPercent: (value: number) => string;
};

export function AlgorithmComparisonTable({
    assessment,
    formatPercent,
}: AlgorithmComparisonTableProps) {
    if (!assessment || assessment.recommendations.length === 0) return null;

    const top5 = assessment.recommendations.slice(0, 5);

    // Build TOPSIS ranks (by topsis_score desc)
    const topsisRanked = [...assessment.recommendations]
        .sort((a, b) => b.topsis_score - a.topsis_score)
        .map((r, i) => ({ majorId: r.major.id, rank: i + 1, name: r.major.name, score: r.topsis_score }));

    // Build SAW ranks (from meta)
    const sawRanked = [...assessment.recommendations]
        .filter((r) => r.meta?.saw_verification)
        .sort((a, b) => (a.meta?.saw_verification?.saw_rank ?? 999) - (b.meta?.saw_verification?.saw_rank ?? 999))
        .map((r) => ({
            majorId: r.major.id,
            rank: r.meta?.saw_verification?.saw_rank ?? 999,
            name: r.major.name,
            score: r.meta?.saw_verification?.saw_score ?? 0,
        }));

    // Build Final ranks (current ranking)
    const finalRanked = top5.map((r) => ({
        majorId: r.major.id,
        rank: r.rank,
        name: r.major.name,
        score: r.final_score,
    }));

    // Algorithm consensus for #1
    const topsisTop = topsisRanked[0]?.majorId;
    const sawTop = sawRanked[0]?.majorId;
    const finalTop = finalRanked[0]?.majorId;
    const agreementCount = [topsisTop, sawTop, finalTop].filter(
        (id) => id === finalTop,
    ).length;

    return (
        <Card className="animate-result-fade-up rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]" style={{ animationDelay: '500ms' }}>
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs tracking-[0.3em] text-slate-500 uppercase">
                        <GitCompare className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Algorithm Comparison — Top 5
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
                        agreementCount >= 3
                            ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                            : 'border-amber-400/25 bg-amber-400/10 text-amber-200'
                    }`}>
                        {agreementCount >= 3 ? (
                            <CheckCircle2 className="h-3 w-3" />
                        ) : (
                            <AlertTriangle className="h-3 w-3" />
                        )}
                        Consensus: {agreementCount}/3 agree on #{1}
                    </span>
                </div>

                <div className="overflow-x-auto rounded-[20px] border border-white/8">
                    <table className="min-w-full border-collapse text-left text-sm">
                        <thead className="bg-white/[0.03] text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">Rank</th>
                                <th className="px-4 py-3 font-medium">TOPSIS</th>
                                <th className="px-4 py-3 font-medium">Score</th>
                                <th className="px-4 py-3 font-medium">SAW</th>
                                <th className="px-4 py-3 font-medium">Score</th>
                                <th className="px-4 py-3 font-medium">Final (Combined)</th>
                                <th className="px-4 py-3 font-medium">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }, (_, i) => {
                                const t = topsisRanked[i];
                                const s = sawRanked[i];
                                const f = finalRanked[i];

                                return (
                                    <tr key={i} className="border-t border-white/8 transition hover:bg-[#111111]">
                                        <td className="px-4 py-3.5 text-slate-500">#{i + 1}</td>
                                        <td className={`px-4 py-3.5 font-medium ${t?.majorId === finalTop ? 'text-[#ff8a80]' : 'text-white'}`}>
                                            {t?.name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-slate-300">
                                            {t ? formatPercent(t.score) : '—'}
                                        </td>
                                        <td className={`px-4 py-3.5 font-medium ${s?.majorId === finalTop ? 'text-[#ff8a80]' : 'text-white'}`}>
                                            {s?.name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-slate-300">
                                            {s ? s.score.toFixed(4) : '—'}
                                        </td>
                                        <td className={`px-4 py-3.5 font-medium ${f?.majorId === finalTop ? 'text-[#ff8a80]' : 'text-white'}`}>
                                            {f?.name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-[#ff8a80]">
                                            {f ? formatPercent(f.score) : '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
