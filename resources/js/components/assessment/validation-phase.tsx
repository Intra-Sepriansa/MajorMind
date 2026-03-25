import { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type ValidationPhaseProps = {
    riasecAnswers: Record<string, number>;
    gritAnswers: Record<string, number>;
    onComplete: () => void;
};

export function ValidationPhase({ riasecAnswers, gritAnswers, onComplete }: ValidationPhaseProps) {
    const [step, setStep] = useState(0);
    const checks = [
        { label: 'Analisis pola respons', icon: ShieldCheck },
        { label: 'Deteksi straight-lining', icon: AlertTriangle },
        { label: 'Validasi kualitas data', icon: CheckCircle2 },
        { label: 'Menghitung skor akhir', icon: Clock },
    ];

    // Run checks with staggered animation
    useEffect(() => {
        if (step < checks.length) {
            const timer = setTimeout(() => setStep(step + 1), 800);
            return () => clearTimeout(timer);
        }
        // All checks done — auto-proceed after brief pause
        const done = setTimeout(onComplete, 1200);
        return () => clearTimeout(done);
    }, [step, checks.length, onComplete]);

    // Quick client-side quality estimation
    const allVals = [...Object.values(riasecAnswers), ...Object.values(gritAnswers)];
    const counts = allVals.reduce((m, v) => { m[v] = (m[v] || 0) + 1; return m; }, {} as Record<number, number>);
    const maxRepeat = Math.max(...Object.values(counts), 0);
    const straightLinePct = allVals.length > 0 ? (maxRepeat / allVals.length) * 100 : 0;
    const neutralPct = allVals.length > 0 ? ((counts[3] || 0) / allVals.length) * 100 : 0;
    const qualityScore = Math.max(0, 100 - (straightLinePct > 80 ? 30 : 0) - (neutralPct > 70 ? 15 : 0));

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="px-6 py-8">
                <div className="mb-6 text-center">
                    <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#ff2d20]/30 bg-[#ff2d20]/10">
                        <ShieldCheck className="h-8 w-8 text-[#ff2d20]" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Validasi Kualitas Respons</h3>
                    <p className="mt-1 text-sm text-slate-400">Menganalisis konsistensi dan kualitas jawaban Anda...</p>
                </div>

                <div className="mx-auto max-w-md space-y-3">
                    {checks.map((check, i) => {
                        const done = step > i;
                        const active = step === i;
                        return (
                            <div
                                key={check.label}
                                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
                                    done
                                        ? 'border-emerald-500/20 bg-emerald-500/5'
                                        : active
                                          ? 'border-[#ff2d20]/30 bg-[#ff2d20]/5'
                                          : 'border-white/5 bg-white/[0.01] opacity-40'
                                }`}
                            >
                                {done ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                ) : active ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ff2d20] border-t-transparent" />
                                ) : (
                                    <check.icon className="h-5 w-5 text-slate-600" />
                                )}
                                <span className={`text-sm ${done ? 'text-emerald-300' : active ? 'text-white' : 'text-slate-600'}`}>
                                    {check.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {step >= checks.length && (
                    <div className="mt-6 animate-fade-in text-center">
                        <div className="mb-2 text-3xl font-bold text-white">{Math.round(qualityScore)}/100</div>
                        <div className="text-sm text-slate-400">Quality Score</div>
                        <div className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${qualityScore >= 80 ? 'bg-emerald-500/10 text-emerald-400' : qualityScore >= 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                            {qualityScore >= 80 ? 'Kualitas Baik' : qualityScore >= 50 ? 'Kualitas Cukup' : 'Perlu Review'}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
