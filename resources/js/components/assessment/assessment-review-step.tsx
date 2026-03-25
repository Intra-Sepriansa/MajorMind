import { useEffect, useState } from 'react';
import {
    ArrowLeft,
    BarChart3,
    BrainCircuit,
    CheckCircle2,
    Cpu,
    Database,
    Gauge,
    Layers,
    LoaderCircle,
    Rocket,
    Shield,
    Sparkles,
    User,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type AssessmentReviewStepProps = {
    studentName: string;
    behavioralProfile: { minat: number; logika: number; konsistensi: number };
    criterionOrder: string[];
    weights: Record<string, number>;
    consistencyRatio: number;
    isConsistent: boolean;
    loading: boolean;
    onSubmit: () => void;
    onBack: () => void;
};

function toTitleCase(slug: string): string {
    return slug.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getCrBadge(cr: number): { label: string; color: string } {
    if (cr <= 0.05) return { label: 'Excellent', color: '#22c55e' };
    if (cr <= 0.08) return { label: 'Good', color: '#84cc16' };
    if (cr <= 0.1) return { label: 'Acceptable', color: '#eab308' };
    return { label: 'Invalid', color: '#ef4444' };
}

export function AssessmentReviewStep({
    studentName,
    behavioralProfile,
    criterionOrder,
    weights,
    consistencyRatio,
    isConsistent,
    loading,
    onSubmit,
    onBack,
}: AssessmentReviewStepProps) {
    const crBadge = getCrBadge(consistencyRatio);
    const avgBehavioral = Math.round(
        (behavioralProfile.minat + behavioralProfile.logika + behavioralProfile.konsistensi) / 3,
    );

    const [isAnimating, setIsAnimating] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [animationStage, setAnimationStage] = useState(0);
    const [animationText, setAnimationText] = useState('Initializing AI Engine...');

    const handleGenerateClick = () => {
        setIsAnimating(true);
        setAnimationProgress(5);
        setAnimationStage(0);
        setAnimationText('Verifying assessment footprint...');

        const stages = [
            { progress: 25, text: 'Mapping cognitive pathways...' },
            { progress: 50, text: 'Processing AHP eigenvector matrix...' },
            { progress: 75, text: 'Calculating TOPSIS ideal alternatives...' },
            { progress: 95, text: 'Synthesizing precision behavioral profile...' },
            { progress: 100, text: 'Finalizing Top Recommended Majors...' },
        ];

        let currentStageIndex = 0;
        
        const interval = setInterval(() => {
            if (currentStageIndex >= stages.length) {
                clearInterval(interval);
                setTimeout(() => {
                    onSubmit(); // Actual submit triggered slightly after 100%
                }, 400); 
                return;
            }

            const currentStage = stages[currentStageIndex];
            setAnimationProgress(currentStage.progress);
            setAnimationText(currentStage.text);
            setAnimationStage(currentStageIndex + 1);
            
            currentStageIndex++;
        }, 800);
    };

    // If backend processing finishes and we're dumped back to this view (e.g. error)
    useEffect(() => {
        if (!loading && isAnimating && animationProgress === 100) {
            setIsAnimating(false);
            setAnimationProgress(0);
        }
    }, [loading, isAnimating, animationProgress]);

    if (isAnimating) {
        return (
            <div className="flex min-h-[500px] flex-col items-center justify-center space-y-10 rounded-[30px] border border-[#ff2d20]/20 bg-[#000000]/90 px-6 py-10 shadow-[0_0_100px_rgba(255,45,32,0.1)_inset] relative overflow-hidden backdrop-blur-xl">
                <style>
                    {`
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes spin-reverse {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .animate-spin-slow {
                        animation: spin-slow 3s linear infinite;
                    }
                    .animate-spin-reverse {
                        animation: spin-reverse 4s linear infinite;
                    }
                    `}
                </style>

                {/* Simulated Computation Visualizer */}
                <div className="relative flex h-36 w-36 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#ff2d20]/5 blur-3xl" />
                    <div className="absolute inset-0 rounded-full border border-white/10" />
                    
                    {/* Concentric rings */}
                    <div className="absolute -inset-4 rounded-full border border-dashed border-white/5 animate-spin-slow" />
                    <div className="absolute inset-2 animate-spin-reverse rounded-full border-t border-[#ff2d20]" />
                    <div className="absolute inset-6 animate-spin-slow rounded-full border-b-2 border-white/50" />
                    
                    <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#000000] shadow-[0_0_20px_rgba(255,45,32,0.15)] ring-1 ring-white/10">
                        {animationStage === 0 && <Shield className="h-8 w-8 text-white animate-pulse" />}
                        {animationStage === 1 && <BrainCircuit className="h-8 w-8 text-white animate-pulse" />}
                        {animationStage === 2 && <Database className="h-8 w-8 text-white animate-pulse" />}
                        {animationStage === 3 && <Layers className="h-8 w-8 text-white animate-pulse" />}
                        {animationStage === 4 && <Cpu className="h-8 w-8 text-[#ff2d20] animate-pulse" />}
                        {animationStage === 5 && <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />}
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-sm space-y-5 text-center">
                    <div className="space-y-2">
                        <div className="text-xl font-semibold tracking-[-0.03em] text-white" style={{ fontFamily: '"Space Grotesk", var(--font-sans)', }}>
                            Computing Results
                        </div>
                        <div className="min-h-[24px] text-sm tracking-wide text-slate-400 transition-all duration-300">
                            {animationText}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#ff2d20] to-[#ff8a80] transition-all duration-700 ease-out"
                                style={{ width: `${animationProgress}%` }}
                            />
                        </div>
                        <div className="text-right font-mono text-[10px] tracking-[0.2em] text-[#ff2d20]/70">
                            {animationProgress.toString().padStart(3, '0')}%
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Profile Summary */}
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-6">
                    <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <User className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Ringkasan Profil Assessment
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Identity */}
                        <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4">
                            <div className="text-xs text-slate-500">Nama</div>
                            <div className="mt-1 text-lg font-semibold text-white">{studentName || 'Belum diisi'}</div>
                        </div>

                        {/* Behavioral Average */}
                        <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4">
                            <div className="text-xs text-slate-500">Behavioral Avg Score</div>
                            <div className="mt-1 text-lg font-semibold text-white">{avgBehavioral}/100</div>
                        </div>
                    </div>

                    {/* Behavioral Breakdown */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {[
                            { key: 'minat', label: 'Minat Pribadi', val: behavioralProfile.minat, color: '#22c55e' },
                            { key: 'logika', label: 'Kemampuan Logika', val: behavioralProfile.logika, color: '#3b82f6' },
                            { key: 'konsistensi', label: 'Konsistensi', val: behavioralProfile.konsistensi, color: '#a855f7' },
                        ].map((item) => (
                            <div key={item.key} className="rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">{item.label}</span>
                                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.val}</span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${item.val}%`, backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* AHP Weights */}
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-6">
                    <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <BarChart3 className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Bobot Kriteria AHP
                    </div>

                    <div className="space-y-3">
                        {criterionOrder
                            .map((slug) => ({ slug, weight: weights[slug] ?? 0 }))
                            .sort((a, b) => b.weight - a.weight)
                            .map((item) => (
                                <div key={item.slug} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-300">{toTitleCase(item.slug)}</span>
                                        <span className="font-mono text-xs text-white">{(item.weight * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-[#ff2d20] to-[#ff8a80] transition-all duration-700"
                                            style={{ width: `${Math.max(item.weight * 100, 3)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* CR Status */}
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                        <Gauge className="h-4 w-4 text-[#ff2d20]" />
                        <div className="flex-1">
                            <div className="text-xs text-slate-400">Consistency Ratio</div>
                            <div className="font-mono text-sm text-white">{consistencyRatio.toFixed(4)}</div>
                        </div>
                        <span
                            className="rounded-lg px-2.5 py-1 text-xs font-bold"
                            style={{ backgroundColor: `${crBadge.color}20`, color: crBadge.color }}
                        >
                            {crBadge.label}
                        </span>
                        {isConsistent ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : null}
                    </div>

                    {!isConsistent && (
                        <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-xs text-rose-300">
                            CR &gt; 0.1 menunjukkan inkonsistensi. Pertimbangkan kembali ke AHP untuk menyesuaikan perbandingan.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Data Transparency */}
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-6">
                    <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <Shield className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Data yang akan diproses
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
                            <BrainCircuit className="h-4 w-4 text-slate-400" />
                            <div>
                                <div className="text-xs font-medium text-white">Behavioral Profile</div>
                                <div className="text-[10px] text-slate-500">3 data points</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
                            <Database className="h-4 w-4 text-slate-400" />
                            <div>
                                <div className="text-xs font-medium text-white">Pairwise Matrix</div>
                                <div className="text-[10px] text-slate-500">{criterionOrder.length}×{criterionOrder.length} entries</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
                            <BarChart3 className="h-4 w-4 text-slate-400" />
                            <div>
                                <div className="text-xs font-medium text-white">Criteria Weights</div>
                                <div className="text-[10px] text-slate-500">{criterionOrder.length} weights</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-2.5 text-center text-xs text-slate-500">
                        Estimasi waktu komputasi: <span className="text-white">~3 detik</span>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={loading}
                    className="h-11 rounded-xl border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke AHP
                </Button>
                <Button
                    onClick={handleGenerateClick}
                    disabled={loading || !isConsistent}
                    className="h-12 rounded-2xl bg-[#ff2d20] px-8 text-base font-semibold text-white shadow-[0_0_20px_rgba(255,45,32,0.3)] transition-all hover:bg-[#ff584d] hover:shadow-[0_0_30px_rgba(255,45,32,0.5)] disabled:opacity-40 disabled:shadow-none"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <Rocket className="mr-2 h-5 w-5" />
                            Generate Recommendations
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

