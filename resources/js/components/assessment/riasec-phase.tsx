import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Hexagon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/** All 48 RIASEC items */
const questionBank = {
    Realistic: [
        { id: 'R1', text: 'Saya senang bekerja dengan alat dan mesin' },
        { id: 'R2', text: 'Saya lebih suka pekerjaan yang melibatkan aktivitas fisik' },
        { id: 'R3', text: 'Saya tertarik memperbaiki atau merakit barang elektronik' },
        { id: 'R4', text: 'Saya nyaman bekerja di luar ruangan' },
        { id: 'R5', text: 'Saya suka membuat sesuatu dengan tangan saya' },
        { id: 'R6', text: 'Saya tertarik pada pekerjaan teknis dan mekanis' },
        { id: 'R7', text: 'Saya lebih suka hasil kerja yang konkret dan terlihat' },
        { id: 'R8', text: 'Saya senang mengoperasikan peralatan atau kendaraan' },
    ],
    Investigative: [
        { id: 'I1', text: 'Saya senang menganalisis data dan informasi kompleks' },
        { id: 'I2', text: 'Saya tertarik melakukan penelitian ilmiah' },
        { id: 'I3', text: 'Saya suka memecahkan masalah yang rumit' },
        { id: 'I4', text: 'Saya senang membaca jurnal atau artikel ilmiah' },
        { id: 'I5', text: 'Saya tertarik memahami bagaimana sesuatu bekerja' },
        { id: 'I6', text: 'Saya lebih suka berpikir abstrak dan teoretis' },
        { id: 'I7', text: 'Saya senang bereksperimen dan menguji hipotesis' },
        { id: 'I8', text: 'Saya tertarik pada matematika dan sains' },
    ],
    Artistic: [
        { id: 'A1', text: 'Saya senang menciptakan karya seni atau desain' },
        { id: 'A2', text: 'Saya lebih suka pekerjaan yang memungkinkan ekspresi kreatif' },
        { id: 'A3', text: 'Saya tertarik pada musik, seni, atau sastra' },
        { id: 'A4', text: 'Saya senang bekerja tanpa aturan yang kaku' },
        { id: 'A5', text: 'Saya memiliki imajinasi yang kuat' },
        { id: 'A6', text: 'Saya senang menulis cerita atau puisi' },
        { id: 'A7', text: 'Saya tertarik pada desain visual atau grafis' },
        { id: 'A8', text: 'Saya lebih suka pekerjaan yang unik dan tidak konvensional' },
    ],
    Social: [
        { id: 'S1', text: 'Saya senang membantu orang lain menyelesaikan masalah' },
        { id: 'S2', text: 'Saya tertarik pada pekerjaan yang melibatkan interaksi sosial' },
        { id: 'S3', text: 'Saya senang mengajar atau melatih orang lain' },
        { id: 'S4', text: 'Saya peduli dengan kesejahteraan orang lain' },
        { id: 'S5', text: 'Saya senang bekerja dalam tim' },
        { id: 'S6', text: 'Saya tertarik pada psikologi dan perilaku manusia' },
        { id: 'S7', text: 'Saya senang memberikan konseling atau nasihat' },
        { id: 'S8', text: 'Saya lebih suka pekerjaan yang berdampak sosial' },
    ],
    Enterprising: [
        { id: 'E1', text: 'Saya senang memimpin dan mengelola proyek' },
        { id: 'E2', text: 'Saya tertarik pada bisnis dan kewirausahaan' },
        { id: 'E3', text: 'Saya senang meyakinkan orang lain' },
        { id: 'E4', text: 'Saya berorientasi pada pencapaian dan target' },
        { id: 'E5', text: 'Saya senang mengambil risiko yang terkalkulasi' },
        { id: 'E6', text: 'Saya tertarik pada strategi dan perencanaan' },
        { id: 'E7', text: 'Saya senang bernegosiasi dan membuat kesepakatan' },
        { id: 'E8', text: 'Saya lebih suka posisi kepemimpinan' },
    ],
    Conventional: [
        { id: 'C1', text: 'Saya senang bekerja dengan data dan angka' },
        { id: 'C2', text: 'Saya lebih suka pekerjaan yang terstruktur dan terorganisir' },
        { id: 'C3', text: 'Saya detail-oriented dan teliti' },
        { id: 'C4', text: 'Saya senang mengikuti prosedur dan aturan' },
        { id: 'C5', text: 'Saya tertarik pada administrasi dan manajemen data' },
        { id: 'C6', text: 'Saya senang mengorganisir informasi' },
        { id: 'C7', text: 'Saya lebih suka pekerjaan yang predictable' },
        { id: 'C8', text: 'Saya tertarik pada akuntansi atau keuangan' },
    ],
} as const;

type Dimension = keyof typeof questionBank;
const dimensions: Dimension[] = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];
const dimensionLabels: Record<Dimension, string> = {
    Realistic: 'Realistis',
    Investigative: 'Investigatif',
    Artistic: 'Artistik',
    Social: 'Sosial',
    Enterprising: 'Enterprising',
    Conventional: 'Konvensional',
};
const dimensionColors: Record<Dimension, string> = {
    Realistic: '#f97316',
    Investigative: '#3b82f6',
    Artistic: '#a855f7',
    Social: '#22c55e',
    Enterprising: '#ef4444',
    Conventional: '#eab308',
};

const likertLabels = ['Sangat Tidak Setuju', 'Tidak Setuju', 'Netral', 'Setuju', 'Sangat Setuju'];

type RiasecPhaseProps = {
    answers: Record<string, number>;
    onAnswersChange: (answers: Record<string, number>) => void;
    onContinue: () => void;
    onBack: () => void;
};

export function RiasecPhase({ answers, onAnswersChange, onContinue, onBack }: RiasecPhaseProps) {
    const [currentDimIndex, setCurrentDimIndex] = useState(0);
    const currentDim = dimensions[currentDimIndex];
    const questions = questionBank[currentDim];

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = 48;
    const allAnswered = answeredCount >= totalQuestions;

    const currentDimAnswered = useMemo(
        () => questions.every((q) => answers[q.id] !== undefined),
        [questions, answers],
    );

    // Compute live scores for the radar sidebar
    const scores = useMemo(() => {
        const s: Record<Dimension, number> = {} as Record<Dimension, number>;
        for (const dim of dimensions) {
            const qs = questionBank[dim];
            let total = 0;
            let count = 0;
            for (const q of qs) {
                if (answers[q.id] !== undefined) {
                    total += answers[q.id];
                    count++;
                }
            }
            s[dim] = count > 0 ? Math.round((total / (count * 5)) * 100) : 0;
        }
        return s;
    }, [answers]);

    const handleAnswer = (questionId: string, value: number) => {
        onAnswersChange({ ...answers, [questionId]: value });
    };

    return (
        <div className="space-y-6">
            {/* Progress header */}
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-5">
                    <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <Hexagon className="h-3.5 w-3.5 text-[#ff2d20]" />
                        RIASEC Psychometric Assessment
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-slate-300">
                            Dimensi {currentDimIndex + 1}/6:{' '}
                            <span className="font-semibold text-white">{dimensionLabels[currentDim]}</span>
                        </span>
                        <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                            {answeredCount}/{totalQuestions} terjawab
                        </span>
                    </div>

                    {/* Dimension pills */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {dimensions.map((dim, i) => {
                            const dimDone = questionBank[dim].every((q) => answers[q.id] !== undefined);
                            return (
                                <button
                                    key={dim}
                                    type="button"
                                    onClick={() => setCurrentDimIndex(i)}
                                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                        i === currentDimIndex
                                            ? 'bg-[#ff2d20]/20 text-[#ff2d20] ring-1 ring-[#ff2d20]/30'
                                            : dimDone
                                              ? 'bg-emerald-500/10 text-emerald-400'
                                              : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                    }`}
                                >
                                    {dimDone && <CheckCircle2 className="h-3 w-3" />}
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: dimensionColors[dim] }}
                                    />
                                    {dimensionLabels[dim]}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Questions + Sidebar */}
            <div className="grid gap-6 xl:grid-cols-[1fr_220px]">
                {/* Question cards */}
                <div className="space-y-3">
                    {questions.map((q, qi) => (
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
                                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: dimensionColors[currentDim] + '30', color: dimensionColors[currentDim] }}
                                    >
                                        {qi + 1}
                                    </span>
                                    <p className="text-sm leading-relaxed text-slate-200">{q.text}</p>
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
                    ))}
                </div>

                {/* Live Radar Sidebar */}
                <div className="sticky top-28">
                    <Card className="rounded-2xl border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="px-4 py-4">
                            <div className="mb-3 text-center text-xs text-slate-500">Live RIASEC Profile</div>
                            <RiasecRadar scores={scores} />
                            <div className="mt-3 space-y-1.5">
                                {dimensions.map((dim) => (
                                    <div key={dim} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: dimensionColors[dim] }}
                                            />
                                            <span className="text-slate-400">{dim[0]}</span>
                                        </div>
                                        <span className="font-mono text-slate-300">{scores[dim]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
                <Button
                    variant="outline"
                    onClick={() => (currentDimIndex > 0 ? setCurrentDimIndex(currentDimIndex - 1) : onBack())}
                    className="h-11 rounded-xl border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {currentDimIndex > 0 ? 'Dimensi Sebelumnya' : 'Kembali'}
                </Button>

                {currentDimIndex < dimensions.length - 1 ? (
                    <Button
                        onClick={() => setCurrentDimIndex(currentDimIndex + 1)}
                        disabled={!currentDimAnswered}
                        className="h-11 rounded-xl bg-[#ff2d20] px-6 font-semibold text-white shadow-[0_0_16px_rgba(255,45,32,0.3)] transition-all hover:bg-[#ff584d] disabled:opacity-40 disabled:shadow-none"
                    >
                        Dimensi Berikutnya
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={onContinue}
                        disabled={!allAnswered}
                        className="h-11 rounded-xl bg-[#ff2d20] px-6 font-semibold text-white shadow-[0_0_16px_rgba(255,45,32,0.3)] transition-all hover:bg-[#ff584d] disabled:opacity-40 disabled:shadow-none"
                    >
                        Lanjut ke Grit Scale
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

/** Hexagonal radar chart for 6 RIASEC dimensions */
function RiasecRadar({ scores }: { scores: Record<Dimension, number> }) {
    const cx = 90, cy = 90, r = 65;

    const toPoint = (i: number, val: number) => {
        const angle = -Math.PI / 2 + ((Math.PI * 2) / 6) * i;
        const dist = (val / 100) * r;
        return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
    };

    const polygon = dimensions.map((_, i) => {
        const p = toPoint(i, scores[dimensions[i]]);
        return `${p.x},${p.y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 180 180" className="mx-auto h-40 w-40">
            {[33, 66, 100].map((ring) => (
                <polygon
                    key={ring}
                    points={dimensions.map((_, i) => { const p = toPoint(i, ring); return `${p.x},${p.y}`; }).join(' ')}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                />
            ))}
            {dimensions.map((_, i) => {
                const p = toPoint(i, 100);
                return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.04)" />;
            })}
            <polygon points={polygon} fill="rgba(255,45,32,0.15)" stroke="#ff2d20" strokeWidth="2" />
            {dimensions.map((dim, i) => {
                const p = toPoint(i, 120);
                return (
                    <text
                        key={dim}
                        x={p.x}
                        y={p.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={dimensionColors[dim]}
                        fontSize="10"
                        fontWeight="600"
                    >
                        {dim[0]}
                    </text>
                );
            })}
        </svg>
    );
}
