import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GitCompareArrows, LoaderCircle } from 'lucide-react';
import type { AssessmentResponse } from '@/types';

type ScenarioComparisonProps = {
    selectedScenarioIds: number[];
};

type ComparisonData = {
    scenarios: AssessmentResponse[];
    comparison_matrix: Record<number, {
        name: string;
        top_3_majors: string[];
        top_score: number;
        stability_score: number;
    }>;
    key_differences: {
        scenario_name: string;
        parameter_changes: { parameter: string; base_value: number; scenario_value: number; change_magnitude: number }[];
    }[];
    recommendation_overlap: {
        common_across_all: number[];
        pairwise_similarities: { scenario_1: string; scenario_2: string; jaccard_similarity: number; common_majors: number }[];
        average_similarity: number;
    };
};

export function ScenarioComparison({ selectedScenarioIds }: ScenarioComparisonProps) {
    const [data, setData] = useState<ComparisonData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const compareScenarios = async () => {
        if (selectedScenarioIds.length < 2) {
            setError('Please select at least 2 scenarios to compare.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/scenario-lab/compare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ scenario_ids: selectedScenarioIds }),
            });

            if (!response.ok) throw new Error('Failed to fetch comparison');
            
            const payload = await response.json();
            setData(payload.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-[24px] border border-white/10 bg-[#05070b] p-6 shadow-xl">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white">Advanced Scenario Comparison</h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-lg">
                        Compare multiple scenarios side-by-side to find structural overlaps and key parameter divergences.
                    </p>
                </div>
                <Button 
                    onClick={compareScenarios} 
                    disabled={loading || selectedScenarioIds.length < 2}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10"
                >
                    {loading ? <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> : <GitCompareArrows className="h-4 w-4 mr-2" />}
                    Compare Selected ({selectedScenarioIds.length})
                </Button>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                </div>
            )}

            {data && (
                <div className="mt-8 space-y-8 animate-in fade-in duration-500">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Object.values(data.comparison_matrix).map((scenario, idx) => (
                            <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <div className="text-lg font-medium text-white">{scenario.name}</div>
                                <div className="mt-4 space-y-3">
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-widest">Top 3 Outcomes</div>
                                        <ol className="mt-2 space-y-1 text-sm text-slate-300">
                                            {scenario.top_3_majors.map((major, i) => (
                                                <li key={i}><span className="text-slate-500 mr-2">{i + 1}.</span> {major}</li>
                                            ))}
                                        </ol>
                                    </div>
                                    <div className="flex justify-between border-t border-white/5 pt-3">
                                        <div className="text-xs text-slate-500">Top Confidence</div>
                                        <div className="text-sm font-mono text-[#ff2d20]">{(scenario.top_score * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="flex justify-between border-t border-white/5 pt-3">
                                        <div className="text-xs text-slate-500">Stability Score</div>
                                        <div className="text-sm font-mono text-emerald-400">{scenario.stability_score.toFixed(1)}%</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-[#000000] p-5">
                            <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff2d20]/20 text-xs text-[#ff2d20]">1</span>
                                Similarity Matrix (Jaccard Index)
                            </h4>
                            <div className="mt-4 space-y-3">
                                {data.recommendation_overlap.pairwise_similarities.map((pair, idx) => (
                                    <div key={idx} className="flex justify-between text-sm items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                        <div className="text-slate-400 flex flex-col">
                                            <span>{pair.scenario_1}</span>
                                            <span className="text-xs text-slate-600">vs {pair.scenario_2}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-white">{(pair.jaccard_similarity * 100).toFixed(1)}% overlap</div>
                                            <div className="text-xs text-slate-500">{pair.common_majors} shared majors</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#000000] p-5">
                            <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3b82f6]/20 text-xs text-[#3b82f6]">2</span>
                                Key Parameter Divergences
                            </h4>
                            <div className="mt-4 space-y-4">
                                {data.key_differences.map((diff, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="text-xs text-slate-300 font-medium">Changes in: {diff.scenario_name}</div>
                                        {diff.parameter_changes.map((param, pIdx) => (
                                            <div key={pIdx} className="flex justify-between text-xs bg-white/[0.03] p-2 rounded">
                                                <span className="text-slate-400 capitalize">{param.parameter.replace(/_/g, ' ')}</span>
                                                <span className="font-mono text-white">
                                                    {param.base_value} <span className="text-slate-600 mx-1">→</span> {param.scenario_value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
