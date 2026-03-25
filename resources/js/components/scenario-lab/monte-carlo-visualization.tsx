import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dice5, LoaderCircle, TrendingUp } from 'lucide-react';
import type { UncertaintyFactors } from './parameter-adjustment-panel';
import type { AssessmentResponse } from '@/types';

type MonteCarloVisualizationProps = {
    assessmentId: number;
    recommendations: any[]; // Using any for briefness to match PreviewRecommendation structure
    uncertaintyFactors: UncertaintyFactors;
};

type MonteCarloData = Record<number, {
    major_name: string;
    success_probability_distribution: Distribution;
    gpa_distribution: Distribution;
    completion_time_distribution: Distribution;
    dropout_probability: number;
    expected_value: number;
}>;

type Distribution = {
    mean: number;
    median: number;
    std_dev: number;
    percentile_10: number;
    percentile_90: number;
    min: number;
    max: number;
};

export function MonteCarloVisualization({ assessmentId, recommendations, uncertaintyFactors }: MonteCarloVisualizationProps) {
    const [data, setData] = useState<MonteCarloData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const runSimulation = async () => {
        if (!recommendations || recommendations.length === 0) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/scenario-lab/monte-carlo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    assessment_id: assessmentId,
                    recommendations: recommendations.slice(0, 3), // simulate top 3
                    uncertainty_factors: uncertaintyFactors
                }),
            });

            if (!response.ok) throw new Error('Failed to run simulation');
            
            const payload = await response.json();
            setData(payload.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,#05070b_0%,#0a0814_100%)] p-6 shadow-xl">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Dice5 className="h-5 w-5 text-[#a855f7]" />
                        Monte Carlo Predictive Outcomes
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-xl">
                        Simulate 5,000 parallel realities with stochastic noise applied to your life circumstances to forecast expected GPA, Dropout Risk, and Completion Time distributions.
                    </p>
                </div>
                <Button 
                    onClick={runSimulation} 
                    disabled={loading || recommendations.length === 0}
                    className="bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-full border border-white/10"
                >
                    {loading ? <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                    Simulate 5,000 Realities
                </Button>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                </div>
            )}

            {data && (
                <div className="mt-8 grid gap-6 md:grid-cols-3 animate-in fade-in duration-500">
                    {Object.values(data).map((sim, idx) => (
                        <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                            <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
                                <div className="text-sm font-semibold text-white truncate" title={sim.major_name}>
                                    {idx + 1}. {sim.major_name}
                                </div>
                                <div className="text-xs text-[#a855f7] mt-1 flex justify-between">
                                    <span>Expected Success</span>
                                    <span>{sim.expected_value.toFixed(1)}%</span>
                                </div>
                            </div>
                            
                            <div className="p-5 space-y-5">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Expected GPA</span>
                                        <span className="text-white font-mono">{sim.gpa_distribution.mean.toFixed(2)} ±{sim.gpa_distribution.std_dev.toFixed(2)}</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                        <div 
                                            className="h-full bg-[#facc15] rounded-full" 
                                            style={{ width: `${(sim.gpa_distribution.mean / 4.0) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                        <span>{sim.gpa_distribution.percentile_10.toFixed(2)} (P10)</span>
                                        <span>{sim.gpa_distribution.percentile_90.toFixed(2)} (P90)</span>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Dropout Probability</span>
                                        <span className={sim.dropout_probability > 15 ? 'text-rose-400 font-mono' : 'text-emerald-400 font-mono'}>
                                            {sim.dropout_probability.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${sim.dropout_probability > 15 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                            style={{ width: `${sim.dropout_probability}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Est. Completion Time</span>
                                        <span className="text-white font-mono">{sim.completion_time_distribution.mean.toFixed(1)} years</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
