import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import type { ScenarioAdjustments } from './parameter-adjustment-panel';

type SensitivityHeatmapProps = {
    assessmentId: number;
    currentAdjustments: ScenarioAdjustments;
};

type HeatmapData = {
    heatmap_data: Record<string, {
        results: { value: number; top_major_id: number; top_major_name: string; top_score: number }[];
        critical_points: { threshold_value: number; from_major: string; to_major: string; type: string }[];
        sensitivity_score: number;
    }>;
    most_sensitive_parameter: { name: string; sensitivity_score: number };
    least_sensitive_parameter: { name: string; sensitivity_score: number };
    overall_stability: number;
};

export function SensitivityHeatmap({ assessmentId, currentAdjustments }: SensitivityHeatmapProps) {
    const [data, setData] = useState<HeatmapData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateHeatmap = async () => {
        setLoading(true);
        setError(null);
        try {
            const ranges = {
                kemampuan_analitis: { min: 1, max: 100, steps: 10 },
                prospek_karier: { min: 1, max: 100, steps: 10 },
                'grit.total_score': { min: 1, max: 100, steps: 10 }
            };

            const response = await fetch(`/api/v1/scenario-lab/sensitivity/${assessmentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    adjustments: currentAdjustments,
                    ranges
                }),
            });

            if (!response.ok) throw new Error('Failed to generate heatmap');
            
            const payload = await response.json();
            setData(payload.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-[24px] border border-white/10 bg-[#000000] p-6 shadow-xl">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white">Sensitivity & Stability Analysis</h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-lg">
                        Analyze how changes to parameters affect the top recommendation. Identify critical thresholds that cause rank reversals.
                    </p>
                </div>
                <Button 
                    onClick={generateHeatmap} 
                    disabled={loading}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10"
                >
                    {loading ? <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                    Generate Analysis
                </Button>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                </div>
            )}

            {data && (
                <div className="mt-8 space-y-6 animate-in fade-in duration-500">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Overall Stability</div>
                            <div className="text-3xl font-bold text-white mt-1">{data.overall_stability.toFixed(1)}%</div>
                            <div className="text-xs text-emerald-400 mt-1">higher is more robust</div>
                        </div>
                        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
                            <div className="text-xs text-rose-500/70 uppercase tracking-widest flex items-center justify-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Most Sensitive
                            </div>
                            <div className="text-lg font-semibold text-rose-100 mt-1 capitalize">{data.most_sensitive_parameter.name}</div>
                            <div className="text-xs text-rose-400 mt-1">Score: {data.most_sensitive_parameter.sensitivity_score.toFixed(1)}</div>
                        </div>
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                            <div className="text-xs text-emerald-500/70 uppercase tracking-widest">Least Sensitive</div>
                            <div className="text-lg font-semibold text-emerald-100 mt-1 capitalize">{data.least_sensitive_parameter.name}</div>
                            <div className="text-xs text-emerald-400 mt-1">Score: {data.least_sensitive_parameter.sensitivity_score.toFixed(1)}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-slate-300">Rank Reversals (Critical Points)</h4>
                        {Object.entries(data.heatmap_data).map(([param, info]) => (
                            info.critical_points.length > 0 && (
                                <div key={param} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                                    <div className="text-sm text-white capitalize font-medium mb-3">{param.replace(/_/g, ' ')}</div>
                                    <div className="space-y-2">
                                        {info.critical_points.map((cp, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm">
                                                <div className="flex h-6 items-center rounded bg-rose-500/20 px-2 text-xs font-mono text-rose-300 border border-rose-500/30">
                                                    @ {cp.threshold_value} pt
                                                </div>
                                                <span className="text-slate-400">shifts top exact from</span>
                                                <span className="font-medium text-slate-200">{cp.from_major}</span>
                                                <span className="text-slate-400">to</span>
                                                <span className="font-medium text-white">{cp.to_major}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
