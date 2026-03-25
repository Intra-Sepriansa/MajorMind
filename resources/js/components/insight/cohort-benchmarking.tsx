import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

type CohortData = {
    cohort_size: number;
    dimension_benchmarks: Array<{
        dimension: string;
        user_score: number;
        cohort_mean: number;
        percentile: number;
        z_score: number;
        position: string;
        color: string;
    }>;
    major_preferences: Array<{
        major_name: string;
        count: number;
        percentage: number;
    }>;
    cohort_position: {
        overall_percentile: number;
        position: string;
        color: string;
    };
    peer_insights: Array<{ icon: string; text: string }>;
};

export default function CohortBenchmarking({ assessmentId }: { assessmentId: number }) {
    const [data, setData] = useState<CohortData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!assessmentId) return;
        setLoading(true);
        fetch('/api/v1/insight/cohort', {
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
                        Loading cohort benchmark...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const { cohort_size, dimension_benchmarks, major_preferences, cohort_position, peer_insights } = data;

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="space-y-4 px-5 py-5">
                <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <Users className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Cohort benchmarking
                </div>

                {/* Cohort Overview */}
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
                        <div className="text-xs text-slate-500">Similar Profiles Found</div>
                        <div className="mt-1 text-2xl font-semibold text-white">{cohort_size}</div>
                        <div className="text-[10px] text-slate-500">cosine similarity ≥ 0.70</div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
                        <div className="text-xs text-slate-500">Overall Position</div>
                        <div className={`mt-1 text-2xl font-semibold ${cohort_position.color === 'emerald' ? 'text-emerald-400' : cohort_position.color === 'blue' ? 'text-blue-400' : cohort_position.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>
                            P{cohort_position.overall_percentile}
                        </div>
                        <div className="text-[10px] text-slate-500">{cohort_position.position}</div>
                    </div>
                </div>

                {/* Dimension Benchmarks */}
                {dimension_benchmarks.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Behavioral Dimension Percentiles</div>
                        {dimension_benchmarks.map((b, i) => (
                            <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-white capitalize">{b.dimension}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${b.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' : b.color === 'blue' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                            {b.position}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">P{b.percentile}</span>
                                    </div>
                                </div>
                                <div className="relative h-2 rounded-full bg-white/8 overflow-hidden">
                                    {/* Cohort mean marker */}
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" style={{ left: `${b.cohort_mean}%` }} />
                                    {/* User score */}
                                    <div className={`h-full rounded-full ${b.color === 'emerald' ? 'bg-emerald-500' : b.color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${b.user_score}%` }} />
                                </div>
                                <div className="flex justify-between mt-1 text-[9px] text-slate-500">
                                    <span>You: {b.user_score}</span>
                                    <span>Mean: {b.cohort_mean} | Z: {b.z_score}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Cohort Major Preferences */}
                {major_preferences.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cohort Top Major Choices</div>
                        {major_preferences.slice(0, 5).map((mp, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#ff2d20]/15 text-[10px] font-bold text-[#ff2d20]">
                                    {i + 1}
                                </span>
                                <span className="flex-1 text-xs text-slate-300">{mp.major_name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{mp.percentage}%</span>
                                <div className="w-16 h-1.5 rounded-full bg-white/8 overflow-hidden">
                                    <div className="h-full rounded-full bg-[#ff2d20]" style={{ width: `${mp.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Peer Insights */}
                {peer_insights.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Peer Insights</div>
                        {peer_insights.map((p, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                <span className="text-lg">{p.icon}</span>
                                <span className="text-xs text-slate-300 leading-5" dangerouslySetInnerHTML={{ __html: p.text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
