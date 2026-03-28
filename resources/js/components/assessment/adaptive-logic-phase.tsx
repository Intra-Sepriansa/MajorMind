import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, ArrowRight, BrainCircuit, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const itemBank = [
    { id: 'L1', difficulty: -1.2, discrimination: 1.0, guessing: 0.25, type: 'pattern', question: 'Apa angka selanjutnya dalam deret: 2, 4, 6, 8, ...?', options: { A: '9', B: '10', C: '12', D: '14' }, correct: 'B' },
    { id: 'L2', difficulty: -0.8, discrimination: 1.1, guessing: 0.25, type: 'sequence', question: 'Jika semua kucing adalah hewan dan semua hewan bernapas, maka?', options: { A: 'Semua hewan adalah kucing', B: 'Semua kucing bernapas', C: 'Semua yang bernapas adalah kucing', D: 'Tidak ada kesimpulan' }, correct: 'B' },
    { id: 'L3', difficulty: -1.0, discrimination: 0.9, guessing: 0.25, type: 'spatial', question: 'Sebuah kubus mempunyai berapa sisi?', options: { A: '4', B: '6', C: '8', D: '12' }, correct: 'B' },
    { id: 'L4', difficulty: -0.3, discrimination: 1.2, guessing: 0.20, type: 'pattern', question: 'Apa angka selanjutnya: 1, 1, 2, 3, 5, 8, ...?', options: { A: '10', B: '11', C: '13', D: '15' }, correct: 'C' },
    { id: 'L5', difficulty: 0.0, discrimination: 1.3, guessing: 0.20, type: 'analogy', question: 'Buku : Membaca = Pisau : ...?', options: { A: 'Tajam', B: 'Memotong', C: 'Dapur', D: 'Besi' }, correct: 'B' },
    { id: 'L6', difficulty: 0.2, discrimination: 1.4, guessing: 0.20, type: 'deduction', question: 'Jika A > B dan B > C, manakah yang pasti benar?', options: { A: 'C > A', B: 'A = C', C: 'A > C', D: 'B = A' }, correct: 'C' },
    { id: 'L7', difficulty: 0.4, discrimination: 1.2, guessing: 0.20, type: 'spatial', question: 'Jika kertas persegi dilipat dua kali secara diagonal lalu digunting ujungnya, berapa lubang saat dibuka?', options: { A: '1', B: '2', C: '4', D: '8' }, correct: 'C' },
    { id: 'L8', difficulty: 0.7, discrimination: 1.5, guessing: 0.15, type: 'matrix', question: 'RUMAH = 18-21-13-1-8. Berapa BUKU?', options: { A: '2-21-11-21', B: '2-21-11-15', C: '2-21-11-20', D: '2-21-11-22' }, correct: 'A' },
    { id: 'L9', difficulty: 1.0, discrimination: 1.6, guessing: 0.15, type: 'complex_pattern', question: 'Deret: 3, 6, 11, 18, 27, ...? Berapa selanjutnya?', options: { A: '36', B: '38', C: '40', D: '35' }, correct: 'B' },
    { id: 'L10', difficulty: 1.3, discrimination: 1.4, guessing: 0.15, type: 'abstract', question: 'Jika hari ini Selasa, 100 hari lagi hari apa?', options: { A: 'Rabu', B: 'Kamis', C: 'Jumat', D: 'Sabtu' }, correct: 'B' },
    { id: 'L11', difficulty: 1.7, discrimination: 1.7, guessing: 0.10, type: 'advanced', question: 'Pukul 15.15, sudut antara jarum jam dan menit?', options: { A: '0°', B: '7.5°', C: '15°', D: '22.5°' }, correct: 'B' },
    { id: 'L12', difficulty: 2.0, discrimination: 1.8, guessing: 0.10, type: 'multi_step', question: 'f(x)=2x+1. Berapakah f(f(3))?', options: { A: '13', B: '15', C: '14', D: '11' }, correct: 'B' },
    { id: 'L13', difficulty: 2.3, discrimination: 1.6, guessing: 0.10, type: 'complex_spatial', question: 'Bola dalam kubus sisi 10cm. Volume kubus yg TIDAK ditempati bola?', options: { A: '476.67 cm³', B: '523.33 cm³', C: '477.33 cm³', D: '500 cm³' }, correct: 'B' },
];

type LogicSession = { theta: number; standard_error: number; administered: string[]; responses: { id: string; correct: boolean }[] };

function prob(item: typeof itemBank[number], t: number) { return item.guessing + (1 - item.guessing) / (1 + Math.exp(-item.discrimination * (t - item.difficulty))); }
function info(item: typeof itemBank[number], t: number) { const p = prob(item, t); if (p <= item.guessing || p >= 1) return 0; const ps = (p - item.guessing) / (1 - item.guessing); return item.discrimination ** 2 * ps * ((1 - ps) / p) * (ps / (1 - p)); }

function mle(session: LogicSession): LogicSession {
    let t = session.theta;
    for (let i = 0; i < 20; i++) {
        let d1 = 0, d2 = 0;
        for (const r of session.responses) { const it = itemBank.find(x => x.id === r.id); if (!it) continue; const p = Math.max(.001, Math.min(.999, prob(it, t))); const ps = Math.max(.001, (p - it.guessing) / (1 - it.guessing)); d1 += it.discrimination * ((r.correct ? 1 : 0) - p) * ps / (p * (1 - p)); d2 += -(it.discrimination ** 2) * ps * (1 - ps); }
        if (Math.abs(d2) < 1e-10) break; const d = -d1 / d2; t = Math.max(-3, Math.min(3, t + d)); if (Math.abs(d) < .001) break;
    }
    let ti = 0; for (const r of session.responses) { const it = itemBank.find(x => x.id === r.id); if (it) ti += info(it, t); }
    return { ...session, theta: t, standard_error: ti > 0 ? 1 / Math.sqrt(ti) : 999 };
}

function nextItem(s: LogicSession) { let best: typeof itemBank[number] | null = null, mx = -1; for (const it of itemBank) { if (s.administered.includes(it.id)) continue; const i = info(it, s.theta); if (i > mx) { mx = i; best = it; } } return best; }
function stop(s: LogicSession) { const n = s.administered.length; return (n >= 5 && s.standard_error < .35) || n >= itemBank.length; }

type Props = { session: LogicSession; onSessionChange: (s: LogicSession) => void; onContinue: () => void; onBack: () => void };

export function AdaptiveLogicPhase({ session, onSessionChange, onContinue, onBack }: Props) {
    const [feedback, setFeedback] = useState<{ correct: boolean; answer: string } | null>(null);
    const current = useMemo(() => stop(session) ? null : nextItem(session), [session]);
    const isDone = stop(session) || !current;
    const score = Math.max(0, Math.min(100, Math.round(((session.theta + 3) / 6) * 100)));

    const handleAnswer = useCallback((ans: string) => {
        if (!current || feedback) return;
        const correct = ans === current.correct;
        setFeedback({ correct, answer: ans });
        setTimeout(() => {
            const s: LogicSession = { ...session, administered: [...session.administered, current.id], responses: [...session.responses, { id: current.id, correct }] };
            onSessionChange(mle(s)); setFeedback(null);
        }, 1000);
    }, [current, feedback, session, onSessionChange]);

    const [isCompleting, setIsCompleting] = useState(false);

    const handleContinue = () => {
        setIsCompleting(true);
        setTimeout(() => {
            onContinue();
        }, 3000);
    };

    if (isDone) return (
        <div className="relative space-y-6">
            {/* Advanced Completion Animation Overlay */}
            {isCompleting && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[28px] bg-[#000000]/80 backdrop-blur-xl transition-all duration-500">
                    <style>
                        {`
                        @keyframes neural-pulse {
                            0% { transform: scale(0.9); opacity: 0.3; }
                            50% { transform: scale(1.1); opacity: 1; }
                            100% { transform: scale(0.9); opacity: 0.3; }
                        }
                        .animate-neural-pulse {
                            animation: neural-pulse 2s ease-in-out infinite;
                        }
                        `}
                    </style>
                    <div className="relative flex h-40 w-40 items-center justify-center">
                        <div className="absolute inset-0 animate-neural-pulse rounded-full border border-emerald-500/50" />
                        <div className="absolute inset-4 rounded-full border border-dashed border-emerald-400/30 animate-[spin_6s_linear_infinite]" />
                        <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-[#ff2d20] animate-[spin_3s_linear_infinite]" />
                        <div className="absolute inset-8 rounded-full border-b-2 border-emerald-400 animate-[spin_2s_linear_infinite_reverse]" />
                        
                        <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-black shadow-[0_0_30px_rgba(16,185,129,0.4)] ring-1 ring-emerald-500/20">
                            <BrainCircuit className="h-10 w-10 text-emerald-400 animate-pulse" />
                        </div>
                    </div>
                    
                    <div className="mt-10 space-y-3 text-center">
                        <div className="text-xl font-bold tracking-[0.2em] text-white uppercase" style={{ fontFamily: '"Space Grotesk", var(--font-sans)' }}>
                            Kalibrasi Kognitif Selesai
                        </div>
                        <div className="text-sm tracking-wide text-emerald-400/80 animate-pulse">
                            Mengekstraksi paramater reliabilitas θ...
                        </div>
                    </div>

                    <div className="mt-8 flex gap-2">
                        {[1, 2, 3, 4, 5].map((item, i) => (
                            <div key={item} className="h-2 w-2 rounded-full bg-emerald-500" style={{ animation: `neural-pulse 1s ease-in-out ${i * 0.2}s infinite` }} />
                        ))}
                    </div>
                </div>
            )}

            <Card className="rounded-[28px] border-emerald-500/20 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-8 text-center">
                    <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-emerald-500/10"><CheckCircle2 className="h-10 w-10 text-emerald-400" /></div>
                    <h3 className="mb-2 text-xl font-bold text-white">Logic Test Selesai</h3>
                    <p className="mb-6 text-sm text-slate-400">{session.administered.length} soal dijawab. Skor: <strong className="text-white">{score}/100</strong></p>
                    <div className="mx-auto grid max-w-xs grid-cols-3 gap-4 text-center">
                        <div><div className="text-lg font-bold text-white">{session.administered.length}</div><div className="text-[10px] text-slate-500">Soal</div></div>
                        <div><div className="text-lg font-bold text-white">{score}</div><div className="text-[10px] text-slate-500">Skor</div></div>
                        <div><div className="text-lg font-bold text-white">{Math.round((1 - Math.min(1, session.standard_error ** 2)) * 100)}%</div><div className="text-[10px] text-slate-500">Reliabilitas</div></div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={onBack} disabled={isCompleting} className="h-11 rounded-xl border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.04]"><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Button>
                <Button onClick={handleContinue} disabled={isCompleting} className="h-11 rounded-xl bg-[#ff2d20] px-6 font-semibold text-white shadow-[0_0_16px_rgba(255,45,32,0.3)] hover:bg-[#ff584d]">
                    {isCompleting ? 'Menyimpan Hasil...' : 'Lanjut ke AHP'}
                    {!isCompleting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </div>
        </div>
    );

    const dColor = current.difficulty < -.5 ? '#22c55e' : current.difficulty < .5 ? '#eab308' : current.difficulty < 1.5 ? '#f97316' : '#ef4444';
    const dLabel = current.difficulty < -.5 ? 'Mudah' : current.difficulty < .5 ? 'Sedang' : current.difficulty < 1.5 ? 'Sulit' : 'Sangat Sulit';

    return (
        <div className="space-y-6">
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-5">
                    <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase"><BrainCircuit className="h-3.5 w-3.5 text-[#ff2d20]" />Adaptive Logic Test (IRT-CAT)</div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Soal {session.administered.length + 1}</span>
                        <div className="flex items-center gap-3">
                            <span className="rounded-lg px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: dColor + '20', color: dColor }}>{dLabel}</span>
                            <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">SE: {session.standard_error < 100 ? session.standard_error.toFixed(2) : '—'}</span>
                        </div>
                    </div>
                    <div className="mt-3"><div className="mb-1 flex justify-between text-[10px] text-slate-600"><span>Rendah</span><span className="font-mono text-slate-400">θ = {session.theta.toFixed(2)}</span><span>Tinggi</span></div><div className="relative h-2 overflow-hidden rounded-full bg-white/10"><div className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 to-[#ff2d20] transition-all duration-700" style={{ width: `${score}%` }} /></div></div>
                </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-6">
                    <div className="mb-2 flex items-center gap-2 text-xs text-slate-600"><Zap className="h-3 w-3" />{current.type.replace(/_/g, ' ')}</div>
                    <p className="mb-6 text-lg leading-relaxed text-white">{current.question}</p>
                    <div className="grid grid-cols-2 gap-3">
                        {(Object.entries(current.options) as [string, string][]).map(([k, v]) => {
                            const sel = feedback?.answer === k;
                            const ok = feedback && k === current.correct;
                            const bad = sel && !feedback.correct;
                            return (
                                <button key={k} type="button" disabled={!!feedback} onClick={() => handleAnswer(k)}
                                    className={`group flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-all ${ok ? 'border-emerald-500/50 bg-emerald-500/10' : bad ? 'border-red-500/50 bg-red-500/10' : feedback ? 'border-white/5 bg-white/[0.01] opacity-50' : 'border-white/8 bg-white/[0.02] hover:border-[#ff2d20]/30 hover:bg-[#ff2d20]/5'}`}>
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${ok ? 'bg-emerald-500 text-white' : bad ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-400 group-hover:bg-[#ff2d20]/20 group-hover:text-[#ff2d20]'}`}>
                                        {ok ? <CheckCircle2 className="h-4 w-4" /> : bad ? <XCircle className="h-4 w-4" /> : k}
                                    </span>
                                    <span className={`text-sm ${ok ? 'text-emerald-300' : bad ? 'text-red-300' : 'text-slate-300'}`}>{v}</span>
                                </button>
                            );
                        })}
                    </div>
                    {feedback && <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${feedback.correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{feedback.correct ? 'Benar! Menyesuaikan kesulitan...' : 'Salah. Menyesuaikan kesulitan...'}</div>}
                </CardContent>
            </Card>

            <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={onBack} className="h-11 rounded-xl border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.04]"><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Button>
                <span className="text-xs text-slate-600">Tes berhenti otomatis saat akurasi tercapai</span>
            </div>
        </div>
    );
}

export type { LogicSession };
