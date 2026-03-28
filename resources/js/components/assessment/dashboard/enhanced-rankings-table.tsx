import { ChevronDown, ChevronUp, ListOrdered } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Recommendation } from '@/types';

type EnhancedRankingsTableProps = {
    recommendations: Recommendation[];
    formatPercent: (value: number) => string;
};

function getGapBadge(gapValue: number | undefined) {
    if (gapValue === undefined) return null;
    if (gapValue >= 0) return { label: 'Melampaui', cls: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20' };
    if (gapValue >= -10) return { label: 'Ringan', cls: 'text-blue-300 bg-blue-400/10 border-blue-400/20' };
    if (gapValue >= -20) return { label: 'Sedang', cls: 'text-amber-300 bg-amber-400/10 border-amber-400/20' };
    return { label: 'Tinggi', cls: 'text-red-300 bg-red-400/10 border-red-400/20' };
}

function computeAverageGap(rec: Recommendation): number | undefined {
    const gaps = rec.meta?.profile_matching?.gaps;
    if (!gaps) return undefined;
    const entries = Object.values(gaps);
    if (entries.length === 0) return undefined;
    return entries.reduce((sum, g) => sum + g.raw_gap, 0) / entries.length;
}

export function EnhancedRankingsTable({
    recommendations,
    formatPercent,
}: EnhancedRankingsTableProps) {
    const [showAll, setShowAll] = useState(false);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const displayed = showAll ? recommendations : recommendations.slice(0, 10);

    return (
        <Card className="animate-result-fade-up rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]" style={{ animationDelay: '250ms' }}>
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ListOrdered className="h-4 w-4 text-[#ff2d20]" />
                        <div>
                            <div className="text-xs tracking-[0.3em] text-slate-500 uppercase">
                                Tabel Peringkat Lanjutan
                            </div>
                            <h3
                                className="mt-1 text-xl font-semibold tracking-[-0.04em]"
                                style={{ fontFamily: '"Space Grotesk", var(--font-sans)' }}
                            >
                                {showAll ? 'Semua' : 'Top 10'} Kandidat Jurusan
                            </h3>
                        </div>
                    </div>
                    {recommendations.length > 10 ? (
                        <button
                            type="button"
                            onClick={() => setShowAll(!showAll)}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08]"
                        >
                            {showAll ? 'Tampilkan Top 10' : `Tampilkan Semua (${recommendations.length})`}
                        </button>
                    ) : null}
                </div>

                <div className="overflow-x-auto rounded-[20px] border border-white/8">
                    <table className="min-w-full border-collapse text-left text-sm">
                        <thead className="bg-white/[0.03] text-slate-400">
                            <tr>
                                <th className="px-4 py-3 font-medium">Peringkat</th>
                                <th className="px-4 py-3 font-medium">Jurusan</th>
                                <th className="px-4 py-3 font-medium">TOPSIS</th>
                                <th className="px-4 py-3 font-medium">Kecocokan Profil</th>
                                <th className="px-4 py-3 font-medium">SAW</th>
                                <th className="px-4 py-3 font-medium">Skor Akhir</th>
                                <th className="px-4 py-3 font-medium">Kesenjangan</th>
                                <th className="w-10 px-2 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.map((rec, index) => {
                                const sawRank = rec.meta?.saw_verification?.saw_rank;
                                const sawDiff = sawRank ? rec.rank - sawRank : null;
                                const avgGap = computeAverageGap(rec);
                                const gapBadge = getGapBadge(avgGap);
                                const isExpanded = expandedRow === rec.major.id;

                                return (
                                    <>
                                        <tr
                                            key={rec.major.slug}
                                            className="animate-result-fade-up cursor-pointer border-t border-white/8 transition hover:bg-[#111111]"
                                            style={{ animationDelay: `${400 + index * 60}ms` }}
                                            onClick={() => setExpandedRow(isExpanded ? null : rec.major.id)}
                                        >
                                            <td className="px-4 py-3.5 text-slate-400">
                                                #{rec.rank}
                                            </td>
                                            <td className="px-4 py-3.5 font-medium text-white">
                                                {rec.major.name}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-slate-300">
                                                {formatPercent(rec.topsis_score)}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-slate-300">
                                                {formatPercent(rec.behavioral_score)}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {sawRank !== null && sawRank !== undefined ? (
                                                    <span className="inline-flex items-center gap-1 font-mono text-slate-300">
                                                        #{sawRank}
                                                        {sawDiff !== null && sawDiff !== 0 ? (
                                                            <span className={`text-[10px] ${sawDiff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                {sawDiff > 0 ? `+${sawDiff}` : sawDiff}
                                                            </span>
                                                        ) : null}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono font-medium text-[#ff8a80]">
                                                {formatPercent(rec.final_score)}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {gapBadge ? (
                                                    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${gapBadge.cls}`}>
                                                        {gapBadge.label}
                                                    </span>
                                                ) : null}
                                            </td>
                                            <td className="px-2 py-3.5 text-slate-500">
                                                {isExpanded ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </td>
                                        </tr>
                                        {isExpanded ? (
                                            <tr key={`${rec.major.slug}-detail`} className="border-t border-white/5 bg-white/[0.02]">
                                                <td colSpan={8} className="px-6 py-6">
                                                    <div className="grid gap-6">
                                                        {/* Real University Recommendations */}
                                                        {rec.meta?.universities && rec.meta.universities.length > 0 ? (
                                                            <div>
                                                                <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.2em] text-emerald-400 uppercase">
                                                                    Rekomendasi Kampus
                                                                </div>
                                                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                                    {rec.meta.universities.map((uni: any) => (
                                                                        <div key={uni.id} className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#000000] p-4 transition-all hover:border-emerald-500/30">
                                                                            <div className="flex items-start gap-3">
                                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1">
                                                                                    {uni.logo_url ? (
                                                                                        <img src={uni.logo_url} alt={uni.short_name} className="h-full w-full object-contain" />
                                                                                    ) : (
                                                                                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">
                                                                                            {uni.short_name}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div>
                                                                                    <div className="font-semibold text-white">{uni.short_name}</div>
                                                                                    <div className="text-[10px] text-slate-400 line-clamp-1">{uni.name}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                                                                                <div className="rounded-lg bg-white/5 p-2">
                                                                                    <div className="text-slate-500">Keketatan</div>
                                                                                    <div className="mt-0.5 font-mono text-white">
                                                                                        {uni.acceptance_rate}%
                                                                                        <span className={`ml-1 text-[9px] ${uni.acceptance_rate < 2.5 ? 'text-red-400' : uni.acceptance_rate < 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                                                            {uni.acceptance_rate < 2.5 ? '(Sangat Ketat)' : uni.acceptance_rate < 5 ? '(Ketat)' : '(Menengah)'}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rounded-lg bg-white/5 p-2">
                                                                                    <div className="text-slate-500">Daya Tampung</div>
                                                                                    <div className="mt-0.5 font-mono text-white">{uni.capacity} <span className="text-[10px] text-slate-500">kursi</span></div>
                                                                                </div>
                                                                                <div className="col-span-2 rounded-lg bg-white/5 p-2">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span className="text-slate-500">Akreditasi / Biaya</span>
                                                                                        <span className="font-medium text-white">{uni.accreditation} / {uni.ukt_tier}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}

                                                        {/* Profile Matching Details */}
                                                        {rec.meta?.profile_matching ? (
                                                            <div>
                                                                <div className="mb-3 text-xs tracking-[0.2em] text-slate-500 uppercase">
                                                                    Analisis Gap Perilaku
                                                                </div>
                                                                <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                                                    {Object.entries(rec.meta.profile_matching.gaps).map(([dim, g]: [string, any]) => (
                                                                        <div key={dim} className="rounded-xl border border-white/8 bg-[#000000] px-3 py-2.5">
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="capitalize text-slate-300">{dim.replace('_', ' ')}</span>
                                                                                <span className={`text-xs font-medium ${g.is_core ? 'text-[#ff8a80]' : 'text-slate-500'}`}>
                                                                                    {g.is_core ? 'Core' : 'Secondary'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                                                                                <div
                                                                                    className="h-full rounded-full bg-white/70"
                                                                                    style={{ width: `${Math.max(4, g.student)}%` }}
                                                                                />
                                                                            </div>
                                                                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
                                                                                <div
                                                                                    className="h-full rounded-full bg-[#ff2d20]"
                                                                                    style={{ width: `${Math.max(4, g.target)}%` }}
                                                                                />
                                                                            </div>
                                                                            <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-slate-500">
                                                                                <span>Kamu {Math.round(g.student)} / Target {Math.round(g.target)}</span>
                                                                                <span className={g.raw_gap >= 0 ? 'text-emerald-400' : 'text-red-400'}>Gap {g.raw_gap >= 0 ? '+' : ''}{Math.round(g.raw_gap)}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : null}
                                    </>
                                );
                            })}
                            {recommendations.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                        Belum ada hasil ranking.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
