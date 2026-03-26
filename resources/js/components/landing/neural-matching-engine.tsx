import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Brain, Hexagon, Target, Lightbulb, Zap, ChevronRight } from 'lucide-react';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

/* ─── Data ─── */
const inputs = [
    { id: 'riasec', label: 'RIASEC', sub: 'Profil Minat', icon: Hexagon, color: '#ff2d20' },
    { id: 'grit', label: 'Grit Scale', sub: 'Konsistensi', icon: Target, color: '#f97316' },
    { id: 'logic', label: 'Logic IRT', sub: 'Skor Logika', icon: Lightbulb, color: '#eab308' },
];

const outputs = [
    { rank: 1, major: 'Teknik Informatika', score: 95.71, color: '#ff2d20' },
    { rank: 2, major: 'Sistem Informasi', score: 88.34, color: '#f97316' },
    { rank: 3, major: 'Data Science', score: 82.10, color: '#eab308' },
];

/* ─── Sub-components ─── */

function InputCard({ node, delay }: { node: typeof inputs[0]; delay: number }) {
    const Icon = node.icon;
    return (
        <motion.div
            className="flex items-center gap-3 rounded-2xl border bg-black/60 px-4 py-3 backdrop-blur-md"
            style={{ borderColor: `${node.color}30` }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
        >
            <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${node.color}15`, border: `1px solid ${node.color}30` }}
            >
                <Icon className="h-4 w-4" style={{ color: node.color }} />
            </div>
            <div>
                <div className="text-[13px] font-semibold text-white" style={font}>{node.label}</div>
                <div className="text-[10px] text-slate-500">{node.sub}</div>
            </div>
        </motion.div>
    );
}

function OutputCard({ node, delay }: { node: typeof outputs[0]; delay: number }) {
    return (
        <motion.div
            className="flex items-center gap-3 rounded-2xl border bg-black/60 px-4 py-3 backdrop-blur-md"
            style={{ borderColor: `${node.color}30` }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
        >
            <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: `${node.color}20`, border: `1px solid ${node.color}40` }}
            >
                {node.rank}
            </div>
            <div>
                <div className="text-[13px] font-semibold text-white" style={font}>{node.major}</div>
                <div className="font-mono text-[10px]" style={{ color: node.color }}>Ci = {node.score.toFixed(2)}%</div>
            </div>
        </motion.div>
    );
}

function FlowDot({ delay, color, direction }: { delay: number; color: string; direction: 'left' | 'right' }) {
    return (
        <motion.div
            className="absolute top-1/2 h-2 w-2 rounded-full"
            style={{
                background: color,
                boxShadow: `0 0 8px ${color}, 0 0 16px ${color}60`,
                [direction === 'left' ? 'right' : 'left']: 0,
            }}
            animate={{
                x: direction === 'left' ? [0, -40] : [0, 40],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1, 0.5],
            }}
            transition={{ duration: 1.5, delay, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
        />
    );
}

/* ─── Main Component ─── */
export default function NeuralMatchingEngine() {
    const [phase, setPhase] = useState<'idle' | 'processing' | 'result'>('idle');
    const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

    useEffect(() => {
        const cycle = () => {
            setPhase('idle');
            setTimeout(() => setPhase('processing'), 600);
            setTimeout(() => setPhase('result'), 3000);
        };
        cycle();
        timerRef.current = setInterval(cycle, 6500);
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <motion.div
            className="relative w-full select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
        >
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                {/* ════ LEFT: Input Nodes ════ */}
                <div className="flex flex-col gap-3">
                    {inputs.map((node, i) => (
                        <div key={node.id} className="relative">
                            <InputCard node={node} delay={0.6 + i * 0.15} />
                            {/* Flow dots going right */}
                            <FlowDot delay={i * 0.6} color={node.color} direction="right" />
                        </div>
                    ))}
                </div>

                {/* ════ CENTER: Processing Core ════ */}
                <div className="relative flex flex-col items-center justify-center px-2">
                    {/* Chevrons flowing in from left */}
                    <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 flex flex-col gap-12">
                        {[0, 1, 2].map(i => (
                            <motion.div key={`cl-${i}`}
                                animate={{ opacity: [0.15, 0.6, 0.15], x: [0, 4, 0] }}
                                transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                            >
                                <ChevronRight className="h-3.5 w-3.5 text-[#ff2d20]" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Core ring */}
                    <motion.div
                        className="relative flex items-center justify-center"
                        animate={{ scale: phase === 'processing' ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        {/* Ambient glow */}
                        <div
                            className="absolute h-28 w-28 rounded-full blur-2xl transition-opacity duration-500"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,45,32,0.25) 0%, transparent 70%)',
                                opacity: phase === 'processing' ? 1 : 0.4,
                            }}
                        />

                        {/* Spinning outer ring - SVG is fine for pure geometry */}
                        <svg className="absolute h-24 w-24" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                            <motion.circle
                                cx="50" cy="50" r="42"
                                fill="none" stroke="#ff2d20" strokeWidth="2" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 42}
                                animate={{ strokeDashoffset: [2 * Math.PI * 42, 0], rotate: [0, 360] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                style={{ transformOrigin: '50px 50px', filter: 'drop-shadow(0 0 4px rgba(255,45,32,0.5))' }}
                            />
                            <motion.circle
                                cx="50" cy="50" r="34"
                                fill="none" stroke="#ff6b61" strokeWidth="1" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 34}
                                animate={{ strokeDashoffset: [0, 2 * Math.PI * 34], rotate: [0, -360] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                                style={{ transformOrigin: '50px 50px', filter: 'drop-shadow(0 0 3px rgba(255,107,97,0.4))' }}
                            />
                            {/* Orbiting dots */}
                            {[0, 120, 240].map((angle, i) => (
                                <motion.circle key={i} r="2.5" fill="#ff2d20"
                                    style={{ filter: 'drop-shadow(0 0 4px #ff2d20)' }}
                                    animate={{
                                        cx: Array.from({ length: 37 }, (_, k) => 50 + 42 * Math.cos(((angle + k * 10) * Math.PI) / 180)),
                                        cy: Array.from({ length: 37 }, (_, k) => 50 + 42 * Math.sin(((angle + k * 10) * Math.PI) / 180)),
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.15 }}
                                />
                            ))}
                        </svg>

                        {/* Center brain icon */}
                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#ff2d20]/30 bg-[#ff2d20]/10">
                            <Brain className="h-5 w-5 text-[#ff2d20]" />
                        </div>
                    </motion.div>

                    {/* Label below */}
                    <motion.div
                        className="mt-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-center font-mono text-[9px] tracking-[0.2em] text-slate-500 uppercase backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        AHP-TOPSIS
                    </motion.div>

                    {/* Chevrons flowing out to right */}
                    <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 flex flex-col gap-12">
                        {[0, 1, 2].map(i => (
                            <motion.div key={`cr-${i}`}
                                animate={{ opacity: [0.15, 0.6, 0.15], x: [0, 4, 0] }}
                                transition={{ duration: 1.5, delay: 0.5 + i * 0.3, repeat: Infinity }}
                            >
                                <ChevronRight className="h-3.5 w-3.5 text-[#ff2d20]" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ════ RIGHT: Output Nodes ════ */}
                <div className="flex flex-col gap-3">
                    {outputs.map((node, i) => (
                        <div key={node.rank} className="relative">
                            <OutputCard node={node} delay={1 + i * 0.2} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ════ STATUS BAR ════ */}
            <motion.div
                className="mt-4 flex items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-1.5 backdrop-blur-xl">
                    <AnimatePresence mode="wait">
                        {phase === 'idle' && (
                            <motion.span key="idle" className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-slate-400 uppercase"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                                Awaiting Data
                            </motion.span>
                        )}
                        {phase === 'processing' && (
                            <motion.span key="proc" className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#ff2d20] uppercase"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <motion.span className="h-1.5 w-1.5 rounded-full bg-[#ff2d20]"
                                    animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
                                Processing...
                            </motion.span>
                        )}
                        {phase === 'result' && (
                            <motion.span key="result" className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-emerald-400 uppercase"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Zap className="h-3 w-3" />
                                Match Complete
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}
