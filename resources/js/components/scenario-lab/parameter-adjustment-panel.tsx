import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Brain, Briefcase, Heart, Target } from 'lucide-react';

export type ScenarioAdjustments = {
    criteria_weights: Record<string, number>;
    psychometric: Record<string, any>;
};

export type UncertaintyFactors = {
    academics: number;
    life_circumstances: number;
    time: number;
};

type ParameterAdjustmentPanelProps = {
    adjustments: ScenarioAdjustments;
    setAdjustments: React.Dispatch<React.SetStateAction<ScenarioAdjustments>>;
    criterionOrder: string[];
    uncertaintyFactors: UncertaintyFactors;
    setUncertaintyFactors: React.Dispatch<
        React.SetStateAction<UncertaintyFactors>
    >;
};

export function ParameterAdjustmentPanel({
    adjustments,
    setAdjustments,
    criterionOrder,
    uncertaintyFactors,
    setUncertaintyFactors,
}: ParameterAdjustmentPanelProps) {
    const handleWeightChange = (slug: string, value: number) => {
        setAdjustments((prev) => ({
            ...prev,
            criteria_weights: {
                ...prev.criteria_weights,
                [slug]: value,
            },
        }));
    };

    const handlePsychometricChange = (category: string, key: string, value: number) => {
        setAdjustments((prev) => {
            const currentCat = prev.psychometric[category] || {};
            return {
                ...prev,
                psychometric: {
                    ...prev.psychometric,
                    [category]: {
                        ...currentCat,
                        [key]: value,
                    },
                },
            };
        });
    };

    return (
        <div className="space-y-6">
            <div className="rounded-[24px] border border-white/10 bg-[#05070b] p-5">
                <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#ff2d20] uppercase">
                    <Target className="h-4 w-4" />
                    AHP Priority Weights
                </div>
                <div className="mt-4 grid gap-4">
                    {criterionOrder.map((slug) => (
                        <div key={slug} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-300 capitalize">
                                    {slug.replace(/_/g, ' ')}
                                </span>
                                <span className="text-slate-500 font-mono text-xs">
                                    {adjustments.criteria_weights[slug] ?? 1} pt
                                </span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={100}
                                step={1}
                                value={adjustments.criteria_weights[slug] ?? 1}
                                onChange={(e) =>
                                    handleWeightChange(slug, Number(e.target.value))
                                }
                                className="w-full accent-[#ff2d20]"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#05070b] p-5">
                <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#ff2d20] uppercase">
                    <Brain className="h-4 w-4" />
                    Cognitive & Behavioral Simulation
                </div>
                <div className="mt-4 space-y-5">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Grit (Perseverance)</span>
                            <span className="text-slate-500 font-mono text-xs">
                                {adjustments.psychometric?.grit?.total_score ?? 50}/100
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={adjustments.psychometric?.grit?.total_score ?? 50}
                            onChange={(e) =>
                                handlePsychometricChange('grit', 'total_score', Number(e.target.value))
                            }
                            className="w-full accent-[#3b82f6]"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Logical & Analytical</span>
                            <span className="text-slate-500 font-mono text-xs">
                                {adjustments.psychometric?.logic?.score ?? 50}/100
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={adjustments.psychometric?.logic?.score ?? 50}
                            onChange={(e) =>
                                handlePsychometricChange('logic', 'score', Number(e.target.value))
                            }
                            className="w-full accent-[#a855f7]"
                        />
                    </div>
                </div>
            </div>
            
            <div className="rounded-[24px] border border-white/10 bg-[#05070b] p-5">
                <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#ff2d20] uppercase">
                    <Briefcase className="h-4 w-4" />
                    Life Circumstances (Stochastic Noise)
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    Adjusting these increases predictive variance in Monte Carlo outcome simulations.
                </p>
                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm text-slate-200">Financial Constraints</Label>
                            <div className="text-xs text-slate-500">Adds volatility to completion time.</div>
                        </div>
                        <Checkbox
                            checked={uncertaintyFactors.life_circumstances > 10}
                            onCheckedChange={(checked) => 
                                setUncertaintyFactors(prev => ({ ...prev, life_circumstances: checked ? 25 : 10 }))
                            }
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm text-slate-200">Academic Friction</Label>
                            <div className="text-xs text-slate-500">Higher variance in GPA simulation.</div>
                        </div>
                        <Checkbox
                            checked={uncertaintyFactors.academics > 0.5}
                            onCheckedChange={(checked) => 
                                setUncertaintyFactors(prev => ({ ...prev, academics: checked ? 1.5 : 0.5 }))
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
