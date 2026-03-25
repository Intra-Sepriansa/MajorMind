import { Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AssessmentResponse, Recommendation } from '@/types';

type AlgorithmTransparencyPanelProps = {
    assessment: AssessmentResponse | null;
    topRecommendation: Recommendation | null;
};

function MetricRow({ label, value, status }: { label: string; value: string; status?: 'good' | 'warn' | 'neutral' }) {
    return (
        <div className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-b-0">
            <span className="text-sm text-slate-400">{label}</span>
            <span className={`font-mono text-sm ${
                status === 'good' ? 'text-emerald-300' : status === 'warn' ? 'text-amber-300' : 'text-white'
            }`}>
                {value}
                {status === 'good' ? <CheckCircle2 className="ml-1.5 inline h-3 w-3" /> : null}
                {status === 'warn' ? <AlertCircle className="ml-1.5 inline h-3 w-3" /> : null}
            </span>
        </div>
    );
}

export function AlgorithmTransparencyPanel({
    assessment,
    topRecommendation,
}: AlgorithmTransparencyPanelProps) {
    if (!assessment) return null;

    const cr = assessment.consistency_ratio;
    const lambdaMax = assessment.summary?.lambda_max;
    const ci = assessment.summary?.consistency_index;
    const pm = topRecommendation?.meta?.profile_matching;
    const saw = topRecommendation?.meta?.saw_verification;

    return (
        <Card className="animate-result-fade-up rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]" style={{ animationDelay: '450ms' }}>
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center gap-2 text-xs tracking-[0.3em] text-slate-500 uppercase">
                    <Cpu className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Algorithm Transparency
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-[20px] border border-white/8 bg-[#000000] p-4">
                        <div className="mb-3 text-xs tracking-[0.2em] text-slate-500 uppercase">
                            AHP Diagnostics
                        </div>
                        <MetricRow
                            label="Eigenvalue (λmax)"
                            value={lambdaMax?.toFixed(4) ?? 'N/A'}
                            status="neutral"
                        />
                        <MetricRow
                            label="Consistency Index (CI)"
                            value={ci?.toFixed(6) ?? 'N/A'}
                            status="neutral"
                        />
                        <MetricRow
                            label="Consistency Ratio (CR)"
                            value={cr.toFixed(4)}
                            status={cr <= 0.1 ? 'good' : 'warn'}
                        />
                        <MetricRow
                            label="CR Threshold"
                            value="≤ 0.1000"
                            status="neutral"
                        />
                    </div>

                    <div className="rounded-[20px] border border-white/8 bg-[#000000] p-4">
                        <div className="mb-3 text-xs tracking-[0.2em] text-slate-500 uppercase">
                            TOPSIS Distances
                        </div>
                        <MetricRow
                            label="D+ (Ideal Positive)"
                            value={topRecommendation?.distance_positive?.toFixed(6) ?? 'N/A'}
                            status="neutral"
                        />
                        <MetricRow
                            label="D- (Ideal Negative)"
                            value={topRecommendation?.distance_negative?.toFixed(6) ?? 'N/A'}
                            status="neutral"
                        />
                        <MetricRow
                            label="Closeness Coefficient"
                            value={topRecommendation ? (topRecommendation.topsis_score).toFixed(6) : 'N/A'}
                            status="neutral"
                        />
                        <MetricRow
                            label="Scoring Method"
                            value={assessment.summary?.scoring_method ?? 'TOPSIS+PM'}
                            status="neutral"
                        />
                    </div>

                    <div className="rounded-[20px] border border-white/8 bg-[#000000] p-4">
                        <div className="mb-3 text-xs tracking-[0.2em] text-slate-500 uppercase">
                            Profile Matching & SAW
                        </div>
                        <MetricRow
                            label="Core Score"
                            value={pm ? `${pm.core_score.toFixed(2)}/5.0` : 'N/A'}
                            status={pm && pm.core_score >= 4.0 ? 'good' : pm && pm.core_score >= 3.0 ? 'warn' : 'neutral'}
                        />
                        <MetricRow
                            label="Secondary Score"
                            value={pm ? `${pm.secondary_score.toFixed(2)}/5.0` : 'N/A'}
                            status="neutral"
                        />
                        <MetricRow
                            label="SAW Score"
                            value={saw ? saw.saw_score.toFixed(6) : 'N/A'}
                            status="neutral"
                        />
                        <MetricRow
                            label="Algorithm Agreement"
                            value={assessment.summary?.algorithm_agreement ? 'Yes' : 'No'}
                            status={assessment.summary?.algorithm_agreement ? 'good' : 'warn'}
                        />
                    </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                    {assessment.criterion_order.map((slug) => {
                        const weight = assessment.criterion_weights[slug] ?? 0;
                        return (
                            <div key={slug} className="rounded-2xl border border-white/8 bg-[#000000] px-3 py-2.5">
                                <div className="mb-1 flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500">{slug.replace(/_/g, ' ')}</span>
                                    <span className="font-mono text-white">{(weight * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#ff2d20] to-[#ff6b5d]"
                                        style={{ width: `${Math.max(4, weight * 100)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
