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

    const [isCompleting, setIsCompleting] = useState(false);

    const handleContinue = () => {
        setIsCompleting(true);
        setTimeout(() => {
            onContinue();
        }, 3000); // 3 seconds advanced animation
    };

    return (
        <div className="relative space-y-6">
            {/* Advanced Completion Animation Overlay */}
            {isCompleting && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[28px] bg-[#000000]/80 backdrop-blur-xl transition-all duration-500">
                    <style>
                        {`
                        @keyframes scanline {
                            0% { transform: translateY(-100%); opacity: 0; }
                            50% { opacity: 1; }
                            100% { transform: translateY(100%); opacity: 0; }
                        }
                        .animate-scanline {
                            animation: scanline 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                        }
                        `}
                    </style>
                    <div className="relative flex h-40 w-40 items-center justify-center">
                        <div className="absolute inset-0 animate-ping rounded-full border border-[#ff2d20] opacity-20" />
                        <div className="absolute -inset-4 rounded-full border border-dashed border-white/10 animate-[spin_4s_linear_infinite]" />
                        <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-[#ff2d20] animate-[spin_2s_linear_infinite]" />
                        <div className="absolute inset-8 rounded-full border-b-2 border-emerald-400 animate-[spin_3s_linear_infinite_reverse]" />
                        
                        {/* Scanning effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                            <div className="h-full w-full bg-gradient-to-b from-transparent via-[#ff2d20]/30 to-transparent animate-scanline" />
                        </div>

                        <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-black shadow-[0_0_30px_rgba(255,45,32,0.4)] ring-1 ring-white/20">
                            <Hexagon className="h-10 w-10 text-white animate-pulse" />
                        </div>
                    </div>
                    
                    <div className="mt-10 space-y-3 text-center">
                        <div className="text-xl font-bold tracking-[0.2em] text-white uppercase" style={{ fontFamily: '"Space Grotesk", var(--font-sans)' }}>
                            Menyusun Profil Psikologi
                        </div>
                        <div className="text-sm tracking-wide text-slate-400 animate-pulse">
                            Menganalisis matriks RIASEC 6-dimensi...
                        </div>
                    </div>

                    {/* Progress bars compilation effect */}
                    <div className="mt-8 flex gap-2">
                        {dimensions.map((dim, i) => (
                            <div key={dim} className="h-1.5 w-10 overflow-hidden rounded-full bg-white/10">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#ff2d20] to-[#ff8a80] transition-all" 
                                    style={{ 
                                        width: '100%', 
                                        animation: `fill-bar 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.15}s forwards`,
                                        transform: 'translateX(-100%)' 
                                    }} 
                                />
                            </div>
                        ))}
                    </div>
                    <style dangerouslySetInnerHTML={{__html: `
                        @keyframes fill-bar { to { transform: translateX(0); } }
                    `}} />
                </div>
            )}

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

                {/* Live Radar Sidebar — Advanced Animated */}
                <div className="sticky top-28">
                    <Card className="rounded-[24px] border-white/10 bg-[#000000]/90 py-0 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                        <CardContent className="px-5 py-5">
                            {/* Header with pulse indicator */}
                            <div className="mb-4 flex items-center justify-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff2d20] opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff2d20]" />
                                </span>
                                <span className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                                    Live RIASEC Profile
                                </span>
                            </div>

                            <RiasecRadarAdvanced scores={scores} />

                            {/* Dominant Type Badge */}
                            <DominantTypeBadge scores={scores} />

                            {/* Animated Score Bars */}
                            <div className="mt-4 space-y-2.5">
                                {dimensions.map((dim) => {
                                    const score = scores[dim];
                                    const maxScore = Math.max(...dimensions.map(d => scores[d]));
                                    const isDominant = score > 0 && score === maxScore;
                                    return (
                                        <div key={dim} className="group">
                                            <div className="mb-1 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="h-2.5 w-2.5 rounded-full ring-2 ring-black/50 transition-all duration-500"
                                                        style={{
                                                            backgroundColor: dimensionColors[dim],
                                                            boxShadow: isDominant ? `0 0 8px ${dimensionColors[dim]}80` : 'none',
                                                        }}
                                                    />
                                                    <span className={`text-xs font-semibold transition-colors ${isDominant ? 'text-white' : 'text-slate-400'}`}>
                                                        {dimensionLabels[dim]}
                                                    </span>
                                                </div>
                                                <span className={`font-mono text-xs font-bold transition-colors ${isDominant ? 'text-white' : 'text-slate-500'}`}>
                                                    {score}%
                                                </span>
                                            </div>
                                            <div className="h-[6px] overflow-hidden rounded-full bg-white/[0.04]">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700 ease-out"
                                                    style={{
                                                        width: `${Math.max(2, score)}%`,
                                                        background: `linear-gradient(90deg, ${dimensionColors[dim]}90, ${dimensionColors[dim]})`,
                                                        boxShadow: score > 0 ? `0 0 10px ${dimensionColors[dim]}50` : 'none',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total Progress */}
                            <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-semibold tracking-wider text-slate-500 uppercase">Progress</span>
                                    <span className="font-mono font-bold text-white">{answeredCount}/{totalQuestions}</span>
                                </div>
                                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                    <div
                                        className="h-full rounded-full bg-[#ff2d20] transition-all duration-500"
                                        style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                                    />
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
                    onClick={() => (currentDimIndex > 0 ? setCurrentDimIndex(currentDimIndex - 1) : onBack())}
                    className="h-11 rounded-xl border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white"
                    disabled={isCompleting}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {currentDimIndex > 0 ? 'Dimensi Sebelumnya' : 'Kembali'}
                </Button>

                {currentDimIndex < dimensions.length - 1 ? (
                    <Button
                        onClick={() => setCurrentDimIndex(currentDimIndex + 1)}
                        disabled={!currentDimAnswered || isCompleting}
                        className="h-11 rounded-xl bg-[#ff2d20] px-6 font-semibold text-white shadow-[0_0_16px_rgba(255,45,32,0.3)] transition-all hover:bg-[#ff584d] disabled:opacity-40 disabled:shadow-none"
                    >
                        Dimensi Berikutnya
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleContinue}
                        disabled={!allAnswered || isCompleting}
                        className="h-11 rounded-xl bg-[#ff2d20] px-6 font-semibold text-white shadow-[0_0_16px_rgba(255,45,32,0.3)] transition-all hover:bg-[#ff584d] disabled:opacity-40 disabled:shadow-none"
                    >
                        {isCompleting ? 'Menyusun Profil...' : 'Lanjut ke Grit Scale'}
                        {!isCompleting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                )}
            </div>
        </div>
    );
}

/* ────────── Dominant Type Badge ────────── */
function DominantTypeBadge({ scores }: { scores: Record<Dimension, number> }) {
    const maxScore = Math.max(...dimensions.map(d => scores[d]));
    if (maxScore === 0) return null;

    const dominant = dimensions.find(d => scores[d] === maxScore)!;
    const color = dimensionColors[dominant];

    return (
        <div
            className="mx-auto mt-3 flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase"
            style={{
                background: `${color}15`,
                color: color,
                border: `1px solid ${color}30`,
                boxShadow: `0 0 12px ${color}20`,
            }}
        >
            <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: color }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            </span>
            Dominan: {dimensionLabels[dominant]}
        </div>
    );
}

/* ────────── Advanced Hexagonal Radar ────────── */
function RiasecRadarAdvanced({ scores }: { scores: Record<Dimension, number> }) {
    const cx = 100, cy = 100, r = 72;
    const hasData = dimensions.some(d => scores[d] > 0);

    const toPoint = (i: number, val: number) => {
        const angle = -Math.PI / 2 + ((Math.PI * 2) / 6) * i;
        const dist = (val / 100) * r;
        return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
    };

    const polygon = dimensions.map((dim, i) => {
        const p = toPoint(i, scores[dim]);
        return `${p.x},${p.y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48">
            <defs>
                {/* Glow filter for the data polygon */}
                <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Node glow */}
                <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Animated gradient for data fill */}
                <radialGradient id="radarFill" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#ff2d20" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ff2d20" stopOpacity="0.05" />
                </radialGradient>
            </defs>

            {/* Ambient pulse ring (behind everything) */}
            {hasData && (
                <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="#ff2d20" strokeWidth="0.5" opacity="0.15">
                    <animate attributeName="r" values={`${r};${r + 14};${r}`} dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" repeatCount="indefinite" />
                </circle>
            )}

            {/* Concentric hexagonal grid rings */}
            {[25, 50, 75, 100].map((ring) => (
                <polygon
                    key={ring}
                    points={dimensions.map((_, i) => { const p = toPoint(i, ring); return `${p.x},${p.y}`; }).join(' ')}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="0.8"
                    strokeDasharray={ring === 50 ? '4 4' : 'none'}
                />
            ))}

            {/* Axis lines */}
            {dimensions.map((_, i) => {
                const p = toPoint(i, 100);
                return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />;
            })}

            {/* Spinning scan beam */}
            {hasData && (
                <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke="#ff2d20" strokeWidth="1" opacity="0.12">
                    <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="4s" repeatCount="indefinite" />
                </line>
            )}

            {/* Data polygon — glowing */}
            <polygon
                points={polygon}
                fill="url(#radarFill)"
                stroke="#ff2d20"
                strokeWidth="2"
                strokeLinejoin="round"
                filter={hasData ? 'url(#radarGlow)' : undefined}
                opacity={hasData ? 1 : 0.3}
            >
                {hasData && <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite" />}
            </polygon>

            {/* Vertex nodes — pulsing glowing dots at each data point */}
            {dimensions.map((dim, i) => {
                const score = scores[dim];
                const p = toPoint(i, score);
                const color = dimensionColors[dim];

                return (
                    <g key={dim}>
                        {/* Outer glow ring */}
                        {score > 0 && (
                            <circle cx={p.x} cy={p.y} r="5" fill="none" stroke={color} strokeWidth="1" opacity="0.3" filter="url(#nodeGlow)">
                                <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                            </circle>
                        )}
                        {/* Solid node */}
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r={score > 0 ? 3 : 2}
                            fill={score > 0 ? color : 'rgba(255,255,255,0.15)'}
                            stroke={score > 0 ? 'white' : 'transparent'}
                            strokeWidth="0.8"
                            filter={score > 0 ? 'url(#nodeGlow)' : undefined}
                        >
                            {score > 0 && <animate attributeName="r" values="2.5;3.5;2.5" dur="2.5s" repeatCount="indefinite" begin={`${i * 0.25}s`} />}
                        </circle>
                    </g>
                );
            })}

            {/* Center dot */}
            <circle cx={cx} cy={cy} r="2" fill="#ff2d20" opacity="0.6">
                {hasData && <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />}
                {hasData && <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />}
            </circle>

            {/* Dimension labels */}
            {dimensions.map((dim, i) => {
                const p = toPoint(i, 125);
                return (
                    <text
                        key={dim}
                        x={p.x}
                        y={p.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={dimensionColors[dim]}
                        fontSize="10"
                        fontWeight="700"
                        style={{ textShadow: `0 0 6px ${dimensionColors[dim]}60` }}
                    >
                        {dim[0]}
                    </text>
                );
            })}
        </svg>
    );
}
