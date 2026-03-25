import { FileOutput } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ExplainabilityItem = {
    slug: string;
    label: string;
    weightedScore: number;
    weight: number;
    contribution: number;
};

type AssessmentExplainabilityPanelProps = {
    explainabilityItems: ExplainabilityItem[];
    whyThisMajor: string[];
    onExport: () => void;
    formatPercent: (value: number) => string;
};

export function AssessmentExplainabilityPanel({
    explainabilityItems,
    whyThisMajor,
    onExport,
    formatPercent,
}: AssessmentExplainabilityPanelProps) {
    return (
        <Card className="rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        Explainability advance
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onExport}
                        className="border-white/10 bg-white/[0.02] text-slate-200 hover:bg-white/[0.06]"
                    >
                        <FileOutput className="h-4 w-4" />
                        Export PDF Report
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[24px] border border-white/8 bg-[#000000] p-5">
                        <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                            Contribution waterfall
                        </div>
                        <div className="mt-4 grid gap-3">
                            {explainabilityItems.length === 0 ? (
                                <div className="text-sm text-slate-500">
                                    Jalankan assessment untuk melihat kontribusi
                                    tiap kriteria.
                                </div>
                            ) : (
                                explainabilityItems.map((item) => (
                                    <div key={item.slug}>
                                        <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                                            <span>{item.label}</span>
                                            <span className="font-mono text-xs text-slate-500">
                                                {item.contribution.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#ff2d20] via-[#ff6b5d] to-white/80"
                                                style={{
                                                    width: `${Math.max(item.contribution, 4)}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-slate-500">
                                            <span>
                                                weighted{' '}
                                                {item.weightedScore.toFixed(4)}
                                            </span>
                                            <span>
                                                AHP {formatPercent(item.weight)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-white/8 bg-[#000000] p-5">
                        <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                            Why this major
                        </div>
                        <div className="mt-4 grid gap-3">
                            {whyThisMajor.length === 0 ? (
                                <div className="text-sm text-slate-500">
                                    Belum ada narasi explainability.
                                </div>
                            ) : (
                                whyThisMajor.map((reason) => (
                                    <div
                                        key={reason}
                                        className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-slate-300"
                                    >
                                        {reason}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
