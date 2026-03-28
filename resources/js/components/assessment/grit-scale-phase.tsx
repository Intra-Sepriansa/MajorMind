import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Shield, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const gritQuestions = [
    { id: 'G1', text: 'Saya menyelesaikan apa yang saya mulai', dimension: 'perseverance' as const, reverse: false },
    { id: 'G2', text: 'Kemunduran tidak membuat saya putus asa', dimension: 'perseverance' as const, reverse: false },
    { id: 'G3', text: 'Saya adalah pekerja keras', dimension: 'perseverance' as const, reverse: false },
    { id: 'G4', text: 'Saya mudah menyerah', dimension: 'perseverance' as const, reverse: true },
    { id: 'G5', text: 'Saya tekun dalam mencapai tujuan jangka panjang', dimension: 'perseverance' as const, reverse: false },
    { id: 'G6', text: 'Saya tidak menyelesaikan proyek yang memakan waktu lama', dimension: 'perseverance' as const, reverse: true },
    { id: 'G7', text: 'Minat saya berubah dari tahun ke tahun', dimension: 'consistency' as const, reverse: true },
    { id: 'G8', text: 'Saya fokus pada satu tujuan untuk waktu yang lama', dimension: 'consistency' as const, reverse: false },
    { id: 'G9', text: 'Saya sering berganti fokus dari satu ide ke ide lain', dimension: 'consistency' as const, reverse: true },
    { id: 'G10', text: 'Saya konsisten dalam mengejar tujuan saya', dimension: 'consistency' as const, reverse: false },
    { id: 'G11', text: 'Saya mudah teralihkan oleh proyek atau ide baru', dimension: 'consistency' as const, reverse: true },
    { id: 'G12', text: 'Saya mempertahankan minat saya dalam jangka panjang', dimension: 'consistency' as const, reverse: false },
];

const likertLabels = ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'];

type GritScalePhaseProps = {
    answers: Record<string, number>;
    onAnswersChange: (answers: Record<string, number>) => void;
    onContinue: () => void;
    onBack: () => void;
};

export function GritScalePhase({ answers, onAnswersChange, onContinue, onBack }: GritScalePhaseProps) {
    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount >= 12;

    // Compute live sub-scores
    const subScores = useMemo(() => {
        let pTotal = 0, pCount = 0, cTotal = 0, cCount = 0;

        for (const q of gritQuestions) {
            const raw = answers[q.id];
            if (raw === undefined) continue;
            const score = q.reverse ? (6 - raw) : raw;

            if (q.dimension === 'perseverance') {
                pTotal += score;
                pCount++;
            } else {
                cTotal += score;
                cCount++;
            }
        }

        const pAvg = pCount > 0 ? pTotal / pCount : 0;
        const cAvg = cCount > 0 ? cTotal / cCount : 0;
        const overall = pCount + cCount > 0 ? ((pAvg + cAvg) / 2 - 1) / 4 * 100 : 0;

        return {
            perseverance: Math.round(pCount > 0 ? ((pAvg - 1) / 4) * 100 : 0),
            consistency: Math.round(cCount > 0 ? ((cAvg - 1) / 4) * 100 : 0),
            overall: Math.round(overall),
        };
    }, [answers]);

    const handleAnswer = (questionId: string, value: number) => {
        onAnswersChange({ ...answers, [questionId]: value });
    };

    const [isCompleting, setIsCompleting] = useState(false);

    const handleContinue = () => {
        setIsCompleting(true);
        setTimeout(() => {
            onContinue();
        }, 3000);
    };

    return (
        <div className="relative space-y-6">
            {/* Advanced Completion Animation Overlay */}
            {isCompleting && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[28px] bg-[#000000]/80 backdrop-blur-xl transition-all duration-500">
                    <style>
                        {`
                        @keyframes pulse-ring {
                            0% { transform: scale(0.8); opacity: 0.5; }
                            50% { opacity: 1; }
                            100% { transform: scale(1.2); opacity: 0; }
                        }
                        .animate-pulse-ring {
                            animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                        }
                        `}
                    </style>
                    <div className="relative flex h-40 w-40 items-center justify-center">
                        <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-blue-500" />
                        <div className="absolute inset-4 rounded-full border border-dashed border-white/20 animate-[spin_5s_linear_infinite]" />
                        <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-purple-500 animate-[spin_2s_linear_infinite]" />
                        <div className="absolute inset-8 rounded-full border-b-2 border-blue-400 animate-[spin_3s_linear_infinite_reverse]" />
                        
                        <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-black shadow-[0_0_30px_rgba(59,130,246,0.4)] ring-1 ring-white/20">
                            <Shield className="h-10 w-10 text-white animate-pulse" />
                        </div>
                    </div>
                    
                    <div className="mt-10 space-y-3 text-center">
                        <div className="text-xl font-bold tracking-[0.2em] text-white uppercase" style={{ fontFamily: '"Space Grotesk", var(--font-sans)' }}>
                            Mengkalkulasi Grit Score
                        </div>
                        <div className="text-sm tracking-wide text-slate-400 animate-pulse">
                            Menganalisis Ketekunan & Konsistensi...
                        </div>
                    </div>

                    {/* Matrix Processing Effect */}
                    <div className="mt-8 flex gap-3">
                        <div className="h-12 w-20 overflow-hidden rounded-xl border border-blue-500/30 bg-blue-500/10 p-2">
                            <div className="h-full w-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" style={{ animation: 'bounce 1s infinite alternate' }} />
                        </div>
                        <div className="h-12 w-20 overflow-hidden rounded-xl border border-purple-500/30 bg-purple-500/10 p-2">
                            <div className="h-full w-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" style={{ animation: 'bounce 1s infinite alternate-reverse' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-5">
                    <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <Shield className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Short Grit Scale (Grit-S)
                    </div>
                    <p className="mb-4 text-sm text-slate-400">
                        12 pernyataan mengukur dua dimensi: <strong className="text-white">Ketekunan Upaya</strong> dan{' '}
                        <strong className="text-white">Konsistensi Minat</strong>. Jawab sejujurnya sesuai kebiasaan Anda.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                            {answeredCount}/12 terjawab
                        </span>
                        {allAnswered && (
                            <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                Semua terjawab
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Questions + Sidebar */}
            <div className="grid gap-6 xl:grid-cols-[1fr_240px]">
                {/* Question list */}
                <div className="space-y-3">
                    {gritQuestions.map((q, qi) => {
                        const isPerseverance = q.dimension === 'perseverance';
                        return (
                            <Card
                                key={q.id}
                                className={`rounded-2xl border-white/8 py-0 transition-all ${
                                    answers[q.id] !== undefined
                                        ? 'border-emerald-500/20 bg-emerald-500/[0.03]'
                                        : 'bg-white/[0.02]'
                                }`}
                            >
                                <CardContent className="px-5 py-4">
                                    <div className="mb-3 flex items-start gap-3">
                                        <span
                                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                isPerseverance
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-purple-500/20 text-purple-400'
                                            }`}
                                        >
                                            {qi + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm leading-relaxed text-slate-200">{q.text}</p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span
                                                    className={`text-[10px] font-medium ${
                                                        isPerseverance ? 'text-blue-500' : 'text-purple-500'
                                                    }`}
                                                >
                                                    {isPerseverance ? 'Ketekunan Upaya' : 'Konsistensi Minat'}
                                                </span>
                                                {q.reverse && (
                                                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-500">
                                                        Reverse-scored
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-9 flex gap-2">
                                        {likertLabels.map((label, li) => {
                                            const value = li + 1;
                                            const isSelected = answers[q.id] === value;
                                            return (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => handleAnswer(q.id, value)}
                                                    className={`flex-1 rounded-xl px-2 py-2 text-[10px] font-medium transition-all ${
                                                        isSelected
                                                            ? 'bg-[#ff2d20] text-white shadow-[0_0_12px_rgba(255,45,32,0.3)]'
                                                            : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Live Score Sidebar */}
                <div className="sticky top-28">
                    <Card className="rounded-2xl border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-4 px-4 py-4">
                            <div className="text-center text-xs text-slate-500">Live Grit Score</div>

                            {/* Overall */}
                            <div className="text-center">
                                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#ff2d20]/30 bg-[#ff2d20]/5">
                                    <span className="text-2xl font-bold text-white">{subScores.overall}</span>
                                </div>
                                <div className="mt-1 text-[10px] text-slate-500">Overall Grit</div>
                            </div>

                            {/* Sub-scores */}
                            <div className="space-y-3">
                                <div>
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1 text-blue-400">
                                            <TrendingUp className="h-3 w-3" />
                                            Ketekunan
                                        </span>
                                        <span className="font-mono text-white">{subScores.perseverance}</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${subScores.perseverance}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1 text-purple-400">
                                            <Target className="h-3 w-3" />
                                            Konsistensi
                                        </span>
                                        <span className="font-mono text-white">{subScores.consistency}</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-purple-500 transition-all duration-500"
                                            style={{ width: `${subScores.consistency}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="h-11 rounded-xl border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white"
                    disabled={isCompleting}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke RIASEC
                </Button>
                <Button
                    onClick={handleContinue}
                    disabled={!allAnswered || isCompleting}
                    className="h-11 rounded-xl bg-[#ff2d20] px-6 font-semibold text-white shadow-[0_0_16px_rgba(255,45,32,0.3)] transition-all hover:bg-[#ff584d] disabled:opacity-40 disabled:shadow-none"
                >
                    {isCompleting ? 'Menganalisis Grit...' : 'Lanjut ke Logic Test'}
                    {!isCompleting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
