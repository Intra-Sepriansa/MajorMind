import { FlaskConical, Lock, Unlock } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Recommendation } from '@/types';

type SensitivitySimulatorProps = {
    recommendations: Recommendation[];
    studentProfile: Record<string, number>;
};

// Replicate the backend gap-to-value mapping on the client side
const GAP_MAP: Array<{ min: number; value: number }> = [
    { min: 0, value: 5.0 },
    { min: -5, value: 4.5 },
    { min: -10, value: 4.0 },
    { min: -15, value: 3.5 },
    { min: -20, value: 3.0 },
    { min: -25, value: 2.5 },
    { min: -30, value: 2.0 },
];

function mapGapToValue(gap: number): number {
    for (const entry of GAP_MAP) {
        if (gap >= entry.min) return entry.value;
    }
    return 1.0;
}

function simulateProfileMatching(
    simProfile: Record<string, number>,
    rec: Recommendation,
): number {
    const pm = rec.meta?.profile_matching;
    if (!pm) return rec.behavioral_score;

    const gaps = Object.entries(pm.gaps);
    if (gaps.length === 0) return rec.behavioral_score;

    let coreSum = 0;
    let coreCount = 0;
    let secSum = 0;
    let secCount = 0;

    for (const [dim, g] of gaps) {
        const studentVal = simProfile[dim] ?? g.student;
        const gap = studentVal - g.target;
        const gapValue = mapGapToValue(gap);

        if (g.is_core) {
            coreSum += gapValue;
            coreCount++;
        } else {
            secSum += gapValue;
            secCount++;
        }
    }

    const coreScore = coreCount > 0 ? coreSum / coreCount : 0;
    const secScore = secCount > 0 ? secSum / secCount : coreScore;
    return (0.6 * coreScore + 0.4 * secScore) / 5.0;
}

export function SensitivitySimulator({
    recommendations,
    studentProfile,
}: SensitivitySimulatorProps) {
    const [simProfile, setSimProfile] = useState({ ...studentProfile });
    const [locked, setLocked] = useState(true);

    const dimensions = useMemo(
        () => Object.keys(studentProfile),
        [studentProfile],
    );

    const handleSliderChange = useCallback(
        (dim: string, value: number) => {
            setSimProfile((prev) => ({ ...prev, [dim]: value }));
        },
        [],
    );

    const resetProfile = useCallback(() => {
        setSimProfile({ ...studentProfile });
    }, [studentProfile]);

    // Simulate re-ranking with the adjusted profile
    const simResults = useMemo(() => {
        if (recommendations.length === 0) return [];

        return recommendations
            .map((rec) => {
                const simBehavioral = simulateProfileMatching(simProfile, rec);
                const simFinal = rec.topsis_score * 0.7 + simBehavioral * 0.3;
                return { rec, simBehavioral, simFinal };
            })
            .sort((a, b) => b.simFinal - a.simFinal)
            .slice(0, 5)
            .map((r, i) => ({ ...r, simRank: i + 1 }));
    }, [recommendations, simProfile]);

    const originalTop = recommendations[0]?.major.name ?? '—';
    const simTop = simResults[0]?.rec.major.name ?? '—';
    const isStable = originalTop === simTop;
    const changed = dimensions.some(
        (d) => simProfile[d] !== studentProfile[d],
    );

    return (
        <Card className="animate-result-fade-up rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]" style={{ animationDelay: '550ms' }}>
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs tracking-[0.3em] text-slate-500 uppercase">
                        <FlaskConical className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Sensitivity Simulator — What-If Analysis
                    </div>
                    <div className="flex items-center gap-2">
                        {changed ? (
                            <button
                                type="button"
                                onClick={resetProfile}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300 transition hover:bg-white/[0.08]"
                            >
                                Reset
                            </button>
                        ) : null}
                        <button
                            type="button"
                            onClick={() => setLocked(!locked)}
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition ${
                                locked
                                    ? 'border-amber-400/20 bg-amber-400/10 text-amber-200'
                                    : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                            }`}
                        >
                            {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                            {locked ? 'Locked' : 'Unlocked'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
                    <div className="space-y-4">
                        <div className="text-sm text-slate-400">
                            Adjust behavioral profile to test recommendation stability.
                            {locked ? ' Unlock to enable sliders.' : ''}
                        </div>
                        {dimensions.map((dim) => {
                            const orig = studentProfile[dim] ?? 0;
                            const current = simProfile[dim] ?? 0;
                            const diff = current - orig;

                            return (
                                <div key={dim} className="rounded-[16px] border border-white/8 bg-[#000000] px-4 py-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium capitalize text-white">{dim}</span>
                                        <span className="font-mono text-xs">
                                            <span className="text-slate-500">{orig}</span>
                                            <span className="mx-1 text-slate-600">{'->'}</span>
                                            <span className={current !== orig ? 'text-[#ff8a80]' : 'text-white'}>
                                                {current}
                                            </span>
                                            {diff !== 0 ? (
                                                <span className={`ml-1 text-[10px] ${diff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    ({diff > 0 ? '+' : ''}{diff})
                                                </span>
                                            ) : null}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={current}
                                        onChange={(e) =>
                                            handleSliderChange(dim, Number(e.target.value))
                                        }
                                        className="w-full accent-[#ff2d20]"
                                        disabled={locked}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="space-y-4">
                        <div className={`rounded-[20px] border p-4 ${
                            isStable
                                ? 'border-emerald-500/15 bg-emerald-500/5'
                                : 'border-amber-500/15 bg-amber-500/5'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="text-xs tracking-[0.2em] uppercase" style={{ color: isStable ? '#6ee7b7' : '#fde68a' }}>
                                    {isStable ? 'Recommendation Stable' : 'Rank Reversal Detected'}
                                </div>
                                <div className="text-sm text-white">
                                    #{1}: <span className="font-semibold">{simTop}</span>
                                </div>
                            </div>
                            {!isStable ? (
                                <div className="mt-2 text-sm text-slate-300">
                                    Original #{1} ({originalTop}) telah bergeser. Ini menunjukkan{' '}
                                    <span className="text-amber-200">sensitivitas terhadap profil behavioral</span>.
                                </div>
                            ) : null}
                        </div>

                        <div className="overflow-hidden rounded-[20px] border border-white/8">
                            <table className="min-w-full border-collapse text-sm">
                                <thead className="bg-white/[0.03] text-slate-400">
                                    <tr>
                                        <th className="px-3 py-2.5 text-left font-medium">Sim Rank</th>
                                        <th className="px-3 py-2.5 text-left font-medium">Major</th>
                                        <th className="px-3 py-2.5 text-left font-medium">Orig</th>
                                        <th className="px-3 py-2.5 text-left font-medium">Sim Score</th>
                                        <th className="px-3 py-2.5 text-left font-medium">Shift</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {simResults.map((sr) => {
                                        const shift = sr.rec.rank - sr.simRank;
                                        return (
                                            <tr key={sr.rec.major.slug} className="border-t border-white/8">
                                                <td className="px-3 py-2.5 text-slate-400">#{sr.simRank}</td>
                                                <td className="px-3 py-2.5 font-medium text-white">{sr.rec.major.name}</td>
                                                <td className="px-3 py-2.5 font-mono text-slate-500">#{sr.rec.rank}</td>
                                                <td className="px-3 py-2.5 font-mono text-[#ff8a80]">
                                                    {(sr.simFinal * 100).toFixed(1)}%
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    {shift !== 0 ? (
                                                        <span className={`text-xs font-medium ${shift > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                            {shift > 0 ? `+${shift}` : shift}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-500">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
