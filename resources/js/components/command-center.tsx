import { Link } from '@inertiajs/react';
import {
    Award,
    BarChart3,
    BookOpenText,
    CheckCircle2,
    ChevronRight,
    Download,
    FlaskConical,
    GitCompareArrows,
    Gauge,
    Shield,
    Sparkles,
    Target,
    Trophy,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { AssessmentResponse, Recommendation } from '@/types';

type CommandCenterProps = {
    assessment: AssessmentResponse | null;
    onExportPdf?: () => void;
    isExporting?: boolean;
};

/* ---------- helpers ---------- */

function getConfidenceLabel(cr: number): { label: string; color: string } {
    if (cr <= 0.05) return { label: 'Excellent', color: '#22c55e' };
    if (cr <= 0.08) return { label: 'Good', color: '#84cc16' };
    if (cr <= 0.1) return { label: 'Acceptable', color: '#eab308' };
    return { label: 'Invalid', color: '#ef4444' };
}

function getOverallConfidence(assessment: AssessmentResponse): {
    label: string;
    color: string;
    value: number;
} {
    const confidence =
        assessment.summary?.recommendation_confidence ??
        assessment.recommendations[0]?.meta?.probability_percentage ??
        0;
    if (confidence >= 80) return { label: 'VERY HIGH', color: '#22c55e', value: confidence };
    if (confidence >= 60) return { label: 'HIGH', color: '#84cc16', value: confidence };
    if (confidence >= 40) return { label: 'MEDIUM', color: '#eab308', value: confidence };
    return { label: 'LOW', color: '#ef4444', value: confidence };
}

const phaseData = [
    { id: 1, name: 'Profiling', full: 'Behavioral Profiling' },
    { id: 2, name: 'AHP', full: 'Pairwise Comparison' },
    { id: 3, name: 'CR', full: 'Consistency Validation' },
    { id: 4, name: 'Normalize', full: 'TOPSIS Normalization' },
    { id: 5, name: 'Distance', full: 'Ideal Solution Distance' },
    { id: 6, name: 'Ranking', full: 'Final Ranking' },
];

const rankIcons = [Trophy, Award, Target];
const rankColors = ['#fbbf24', '#94a3b8', '#cd7f32'];

/* ---------- Animated Counter ---------- */

function AnimCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
    const [val, setVal] = useState(0);
    const started = useRef(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting && !started.current) {
                    started.current = true;
                    const t0 = performance.now();
                    const step = (now: number) => {
                        const p = Math.min((now - t0) / 1400, 1);
                        const ease = 1 - Math.pow(1 - p, 3);
                        setVal(ease * end);
                        if (p < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [end]);

    return (
        <span ref={ref}>
            {end < 1 ? val.toFixed(4) : Math.round(val)}
            {suffix}
        </span>
    );
}

/* ---------- CR Gauge Animated ---------- */

function CrGaugeMini({ cr }: { cr: number }) {
    const { color, label } = getConfidenceLabel(cr);
    const targetAngle = Math.min(cr / 0.2, 1) * 180 - 90; // maps 0‑0.2 to -90°‑90°
    const [angle, setAngle] = useState(-90);
    const [crDisplay, setCrDisplay] = useState(0);
    const started = useRef(false);
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting && !started.current) {
                    started.current = true;
                    const t0 = performance.now();
                    const duration = 1800;
                    const step = (now: number) => {
                        const p = Math.min((now - t0) / duration, 1);
                        // Elastic ease-out for a satisfying overshoot
                        const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p) * Math.cos((p * 10 - 0.75) * (2 * Math.PI) / 3);
                        setAngle(-90 + ease * (targetAngle + 90));
                        setCrDisplay(ease * cr);
                        if (p < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [cr, targetAngle]);

    const nx = 60 + 38 * Math.cos((angle * Math.PI) / 180);
    const ny = 62 + 38 * Math.sin((angle * Math.PI) / 180);

    // Arc fill: how much of the 180° arc is filled
    const fillFrac = Math.max(0, Math.min(1, (angle + 90) / 180));
    const fillAngleRad = (-Math.PI / 2) + fillFrac * Math.PI; // from -90° in radians
    const arcEndX = 60 + 50 * Math.cos(fillAngleRad);
    // Offset by 2 for center alignment
    const arcEndY = 62 + 50 * Math.sin(fillAngleRad);
    const largeArc = fillFrac > 0.5 ? 1 : 0;

    return (
        <svg ref={ref} viewBox="0 0 120 80" className="h-24 w-40">
            <defs>
                {/* Glow filter for the active arc */}
                <filter id="arcGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Needle tip glow */}
                <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Gradient for the active arc */}
                <linearGradient id="arcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
            </defs>

            {/* Background arc segments */}
            <path d="M 10 62 A 50 50 0 0 1 60 12" fill="none" stroke="#22c55e" strokeWidth="7" strokeLinecap="round" opacity={0.12} />
            <path d="M 60 12 A 50 50 0 0 1 85 18" fill="none" stroke="#eab308" strokeWidth="7" strokeLinecap="round" opacity={0.12} />
            <path d="M 85 18 A 50 50 0 0 1 110 62" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" opacity={0.12} />

            {/* Track background */}
            <path d="M 10 62 A 50 50 0 0 1 110 62" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" strokeLinecap="round" />

            {/* Active arc (animated fill) */}
            {fillFrac > 0.001 && (
                <path
                    d={`M 10 62 A 50 50 0 ${largeArc} 1 ${arcEndX.toFixed(2)} ${arcEndY.toFixed(2)}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="7"
                    strokeLinecap="round"
                    filter="url(#arcGlow)"
                    opacity={0.85}
                />
            )}

            {/* Tick marks */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                const a = (-Math.PI) + frac * Math.PI;
                const ix = 60 + 42 * Math.cos(a);
                const iy = 62 + 42 * Math.sin(a);
                const ox = 60 + 56 * Math.cos(a);
                const oy = 62 + 56 * Math.sin(a);
                return (
                    <line key={frac} x1={ix} y1={iy} x2={ox} y2={oy} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                );
            })}

            {/* Needle */}
            <line
                x1="60" y1="62" x2={nx} y2={ny}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#needleGlow)"
            />
            {/* Needle tip dot */}
            <circle cx={nx} cy={ny} r="2.5" fill={color} filter="url(#needleGlow)" />
            {/* Center hub */}
            <circle cx="60" cy="62" r="5" fill="#111" stroke={color} strokeWidth="1.5" opacity={0.9} />
            <circle cx="60" cy="62" r="2" fill={color} opacity={0.7} />

            {/* Value display */}
            <text x="60" y="53" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="ui-monospace, monospace">
                {crDisplay.toFixed(4)}
            </text>
            {/* Label */}
            <text x="60" y="77" textAnchor="middle" fill={color} fontSize="8" fontWeight="600" letterSpacing="0.08em">
                {label.toUpperCase()}
            </text>
        </svg>
    );
}

/* ---------- Phase Navigator (Advanced Animated) ---------- */

/* Unique SVG icon per phase */
function PhaseIcon({ phaseId, done, index }: { phaseId: number; done: boolean; index: number }) {
    const color = done ? '#ff2d20' : 'rgba(255,255,255,0.25)';
    const glowId = `phaseGlow-${phaseId}`;
    const pulseId = `phasePulse-${phaseId}`;

    return (
        <svg viewBox="0 0 48 48" className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true">
            <defs>
                <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation={done ? "3" : "0"} result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <radialGradient id={`${pulseId}Grad`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={done ? '#ff2d20' : '#ffffff'} stopOpacity={done ? 0.25 : 0.05} />
                    <stop offset="100%" stopColor={done ? '#ff2d20' : '#ffffff'} stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Ambient pulse ring (only when done) */}
            {done && (
                <circle cx="24" cy="24" r="22" fill="none" stroke="#ff2d20" strokeWidth="1" opacity="0.3">
                    <animate attributeName="r" values="18;23;18" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
            )}

            {/* Background circle */}
            <circle cx="24" cy="24" r="18" fill={done ? 'rgba(255,45,32,0.08)' : 'rgba(255,255,255,0.02)'} stroke={done ? 'rgba(255,45,32,0.3)' : 'rgba(255,255,255,0.08)'} strokeWidth="1.5" />

            {/* Phase-specific animated icon */}
            <g filter={`url(#${glowId})`} style={{ animationDelay: `${index * 0.15}s` }}>
                {phaseId === 1 && (
                    /* Profiling: Brain neural network with pulsing nodes */
                    <g stroke={color} fill="none" strokeWidth="1.5" strokeLinecap="round">
                        {/* Central brain shape */}
                        <path d="M20 16c-3 0-5 2-5 5 0 2 1 3 2 4-1 1-2 3-2 4 0 3 2 5 5 5" opacity="0.8">
                            {done && <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />}
                        </path>
                        <path d="M28 16c3 0 5 2 5 5 0 2-1 3-2 4 1 1 2 3 2 4 0 3-2 5-5 5" opacity="0.8">
                            {done && <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="0.3s" />}
                        </path>
                        <line x1="20" y1="24" x2="28" y2="24" />
                        {/* Neural nodes */}
                        <circle cx="18" cy="20" r="1.5" fill={color}>
                            {done && <animate attributeName="r" values="1.5;2.5;1.5" dur="1.5s" repeatCount="indefinite" />}
                        </circle>
                        <circle cx="30" cy="20" r="1.5" fill={color}>
                            {done && <animate attributeName="r" values="1.5;2.5;1.5" dur="1.5s" repeatCount="indefinite" begin="0.5s" />}
                        </circle>
                        <circle cx="24" cy="17" r="1.5" fill={color}>
                            {done && <animate attributeName="r" values="1.5;2.5;1.5" dur="1.5s" repeatCount="indefinite" begin="1s" />}
                        </circle>
                        <circle cx="24" cy="31" r="1.5" fill={color}>
                            {done && <animate attributeName="r" values="1.5;2.5;1.5" dur="1.5s" repeatCount="indefinite" begin="0.7s" />}
                        </circle>
                        {/* Neural connections */}
                        <line x1="18" y1="20" x2="24" y2="17" strokeDasharray="2 2" opacity="0.5" />
                        <line x1="30" y1="20" x2="24" y2="17" strokeDasharray="2 2" opacity="0.5" />
                        <line x1="18" y1="20" x2="24" y2="31" strokeDasharray="2 2" opacity="0.5" />
                        <line x1="30" y1="20" x2="24" y2="31" strokeDasharray="2 2" opacity="0.5" />
                    </g>
                )}

                {phaseId === 2 && (
                    /* AHP: Oscillating balance scale */
                    <g stroke={color} fill="none" strokeWidth="1.5" strokeLinecap="round">
                        {/* Fulcrum triangle */}
                        <polygon points="24,14 21,18 27,18" fill={done ? 'rgba(255,45,32,0.2)' : 'rgba(255,255,255,0.05)'} stroke={color} strokeWidth="1" />
                        {/* Beam */}
                        <line x1="14" y1="22" x2="34" y2="22" strokeWidth="2">
                            {done && (
                                <animateTransform attributeName="transform" type="rotate" values="-3 24 18;3 24 18;-3 24 18" dur="3s" repeatCount="indefinite" />
                            )}
                        </line>
                        {/* Left pan */}
                        <g>
                            {done && <animateTransform attributeName="transform" type="translate" values="0,0;0,2;0,0" dur="3s" repeatCount="indefinite" />}
                            <line x1="14" y1="22" x2="14" y2="28" strokeWidth="1" />
                            <path d="M10 28 Q12 32 14 32 Q16 32 18 28" strokeWidth="1.5" fill={done ? 'rgba(255,45,32,0.15)' : 'none'} />
                        </g>
                        {/* Right pan */}
                        <g>
                            {done && <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="3s" repeatCount="indefinite" />}
                            <line x1="34" y1="22" x2="34" y2="28" strokeWidth="1" />
                            <path d="M30 28 Q32 32 34 32 Q36 32 38 28" strokeWidth="1.5" fill={done ? 'rgba(255,45,32,0.15)' : 'none'} />
                        </g>
                        {/* Base */}
                        <line x1="20" y1="35" x2="28" y2="35" strokeWidth="2" />
                        <line x1="24" y1="18" x2="24" y2="35" strokeWidth="1.5" />
                    </g>
                )}

                {phaseId === 3 && (
                    /* CR: Shield with scanning verification line */
                    <g stroke={color} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M24 14 L32 18 L32 26 C32 31 28 35 24 36 C20 35 16 31 16 26 L16 18 Z" fill={done ? 'rgba(255,45,32,0.1)' : 'rgba(255,255,255,0.02)'} />
                        {/* Checkmark */}
                        <polyline points="20,25 23,28 29,22" strokeWidth="2">
                            {done && (
                                <animate attributeName="stroke-dashoffset" values="20;0" dur="0.8s" fill="freeze" />
                            )}
                        </polyline>
                        {/* Scanning line */}
                        {done && (
                            <line x1="16" y1="24" x2="32" y2="24" stroke="#ff2d20" strokeWidth="1" opacity="0.4">
                                <animate attributeName="y1" values="16;36;16" dur="2.5s" repeatCount="indefinite" />
                                <animate attributeName="y2" values="16;36;16" dur="2.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
                            </line>
                        )}
                    </g>
                )}

                {phaseId === 4 && (
                    /* Normalize: Matrix grid with cascading fill */
                    <g stroke={color} fill="none" strokeWidth="1">
                        {/* 3x3 matrix cells */}
                        {[0, 1, 2].map(row =>
                            [0, 1, 2].map(col => {
                                const x = 16 + col * 6;
                                const y = 16 + row * 6;
                                const delay = (row * 3 + col) * 0.15;
                                return (
                                    <rect
                                        key={`${row}-${col}`}
                                        x={x} y={y} width="5" height="5" rx="0.8"
                                        fill={done ? '#ff2d20' : 'rgba(255,255,255,0.05)'}
                                        stroke={done ? 'rgba(255,45,32,0.5)' : 'rgba(255,255,255,0.1)'}
                                    >
                                        {done && (
                                            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin={`${delay}s`} />
                                        )}
                                    </rect>
                                );
                            })
                        )}
                        {/* Arrow indicating normalization flow */}
                        <path d="M36 20 L40 24 L36 28" strokeWidth="1.5" opacity={done ? 0.7 : 0.2}>
                            {done && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />}
                        </path>
                    </g>
                )}

                {phaseId === 5 && (
                    /* Distance: Radar concentric rings with sweeping beam */
                    <g stroke={color} fill="none" strokeWidth="1">
                        {/* Concentric rings */}
                        {[6, 10, 14].map((r, idx) => (
                            <circle key={r} cx="24" cy="24" r={r} opacity={done ? 0.3 + idx * 0.1 : 0.15} strokeDasharray="3 2">
                                {done && <animate attributeName="opacity" values={`${0.15 + idx * 0.1};${0.4 + idx * 0.1};${0.15 + idx * 0.1}`} dur="2s" repeatCount="indefinite" begin={`${idx * 0.3}s`} />}
                            </circle>
                        ))}
                        {/* Center dot */}
                        <circle cx="24" cy="24" r="2" fill={color}>
                            {done && <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />}
                        </circle>
                        {/* Sweeping beam */}
                        {done && (
                            <line x1="24" y1="24" x2="24" y2="10" stroke="#ff2d20" strokeWidth="1.5" opacity="0.5">
                                <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="4s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                            </line>
                        )}
                        {/* Data points */}
                        <circle cx="18" cy="18" r="1.5" fill={color} opacity={done ? 0.8 : 0.2} />
                        <circle cx="30" cy="20" r="1.5" fill={color} opacity={done ? 0.8 : 0.2} />
                        <circle cx="20" cy="30" r="1.5" fill={color} opacity={done ? 0.8 : 0.2} />
                    </g>
                )}

                {phaseId === 6 && (
                    /* Ranking: Trophy with crown glow */
                    <g stroke={color} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* Trophy cup */}
                        <path d="M18 17 L18 24 C18 28 21 30 24 30 C27 30 30 28 30 24 L30 17 Z" fill={done ? 'rgba(255,45,32,0.15)' : 'rgba(255,255,255,0.03)'} />
                        {/* Handles */}
                        <path d="M18 19 C15 19 14 21 14 23 C14 25 16 27 18 26" />
                        <path d="M30 19 C33 19 34 21 34 23 C34 25 32 27 30 26" />
                        {/* Base */}
                        <line x1="21" y1="33" x2="27" y2="33" strokeWidth="2" />
                        <line x1="24" y1="30" x2="24" y2="33" />
                        {/* Star / Crown sparkle */}
                        {done && (
                            <g fill="#ff2d20" stroke="none">
                                <polygon points="24,13 25,15 27,15 25.5,16.5 26,18.5 24,17.5 22,18.5 22.5,16.5 21,15 23,15" opacity="0.9">
                                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
                                    <animateTransform attributeName="transform" type="scale" values="0.9;1.1;0.9" dur="1.8s" repeatCount="indefinite" additive="sum" />
                                </polygon>
                            </g>
                        )}
                        {/* Number 1 inside */}
                        <text x="24" y="26" textAnchor="middle" fill={color} fontSize="8" fontWeight="700" stroke="none">1</text>
                    </g>
                )}
            </g>
        </svg>
    );
}

function PhaseNavigator({ completedPhases }: { completedPhases: number }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <div className="grid grid-cols-6 gap-0">
            {phaseData.map((phase, i) => {
                const done = i < completedPhases;
                const isLast = i === phaseData.length - 1;
                return (
                    <div key={phase.id} className="relative flex flex-col items-center">
                        {/* === Connecting pipeline === */}
                        {!isLast && (
                            <div className="absolute top-5 sm:top-6 left-[calc(50%+20px)] right-0 h-[2px] z-0 overflow-hidden">
                                <div
                                    className={`h-full w-full ${
                                        i < completedPhases - 1
                                            ? 'bg-gradient-to-r from-[#ff2d20] to-[#ff2d20]/40'
                                            : 'bg-white/[0.06]'
                                    }`}
                                />
                                {/* Energy particle flowing along the line */}
                                {i < completedPhases - 1 && (
                                    <div
                                        className="absolute top-[-1px] h-[4px] w-6 rounded-full bg-gradient-to-r from-transparent via-[#ff6b5e] to-transparent"
                                        style={{
                                            animation: 'flowParticle 2s linear infinite',
                                            animationDelay: `${i * 0.3}s`,
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {/* === Phase node === */}
                        <Link
                            href="/insights"
                            className="group relative z-10 flex flex-col items-center gap-1"
                            style={{
                                opacity: mounted ? 1 : 0,
                                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
                            }}
                        >
                            <PhaseIcon phaseId={phase.id} done={done} index={i} />
                            <div className="text-center mt-0.5">
                                <span className={`block text-[9px] font-semibold tracking-[0.08em] uppercase sm:text-[10px] transition-colors duration-300 ${
                                    done ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'
                                }`}>
                                    {phase.name}
                                </span>
                            </div>
                        </Link>
                    </div>
                );
            })}

            {/* Inline keyframes for the energy particle */}
            <style>{`
                @keyframes flowParticle {
                    0% { left: -10%; }
                    100% { left: 110%; }
                }
            `}</style>
        </div>
    );
}

/* ---------- Recommendation Card ---------- */

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
    const Icon = rankIcons[index] ?? Target;
    const color = rankColors[index] ?? '#94a3b8';
    const ciPercent = rec.topsis_score * 100;

    return (
        <Card className="group relative overflow-hidden rounded-[24px] border-white/10 bg-[#000000]/82 py-0 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,45,32,0.08)]">
            {/* rank badge */}
            <div
                className="absolute top-0 right-0 rounded-bl-2xl px-3 py-1.5 text-xs font-bold"
                style={{ backgroundColor: `${color}20`, color }}
            >
                #{index + 1}
            </div>
            <CardContent className="px-5 py-5">
                <div className="mb-3 flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        <Icon className="h-5 w-5" style={{ color }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">{rec.major.name}</h3>
                        <p className="text-xs text-slate-400">
                            Ci: <AnimCounter end={rec.topsis_score} /> ({ciPercent.toFixed(1)}%)
                        </p>
                    </div>
                </div>

                {/* Ci progress bar */}
                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${ciPercent}%`,
                            background: `linear-gradient(90deg, ${color}, #ff2d20)`,
                        }}
                    />
                </div>

                {/* distance metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                        <span className="text-slate-500">D+ (ideal)</span>
                        <p className="font-mono text-white">{rec.distance_positive.toFixed(4)}</p>
                    </div>
                    <div className="rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
                        <span className="text-slate-500">D− (worst)</span>
                        <p className="font-mono text-white">{rec.distance_negative.toFixed(4)}</p>
                    </div>
                </div>

                <Link
                    href="/insights"
                    className="mt-3 flex items-center gap-1 text-xs text-[#ff2d20] opacity-0 transition-all group-hover:opacity-100"
                >
                    Explore Details <ChevronRight className="h-3 w-3" />
                </Link>
            </CardContent>
        </Card>
    );
}

/* ---------- Main Component ---------- */

export function CommandCenter({ assessment, onExportPdf, isExporting }: CommandCenterProps) {
    if (!assessment || assessment.recommendations.length === 0) {
        return (
            <section className="mb-8 px-5 pt-6 lg:px-8">
                <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                    <CardContent className="flex flex-col items-center gap-4 px-8 py-12 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff2d20]/10">
                            <Sparkles className="h-7 w-7 text-[#ff2d20]" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Belum Ada Assessment</h2>
                        <p className="max-w-md text-sm text-slate-400">
                            Jalankan assessment pertama Anda untuk melihat Command Center — visualisasi rekomendasi real-time dari 6 fase komputasi AHP-TOPSIS.
                        </p>
                    </CardContent>
                </Card>
            </section>
        );
    }

    const top3 = assessment.recommendations.slice(0, 3);
    const cr = assessment.consistency_ratio;
    const crInfo = getConfidenceLabel(cr);
    const confidence = getOverallConfidence(assessment);
    const completedPhases = cr <= 0.1 ? 6 : 2; // all phases done if CR valid
    const totalWeights = Object.values(assessment.criterion_weights);
    const normComplete = totalWeights.length > 0 && Math.abs(totalWeights.reduce((a, b) => a + b, 0) - 1) < 0.01;

    return (
        <section className="mb-8 space-y-5 px-5 pt-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <Zap className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Command center
                    </div>
                    <h1 className="text-xl font-bold text-white sm:text-2xl">
                        Rekomendasi Jurusan Anda
                    </h1>
                </div>
                <div className="flex gap-2">
                    {onExportPdf && (
                        <button
                            type="button"
                            onClick={onExportPdf}
                            disabled={isExporting}
                            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-[#ff2d20]/10 hover:border-[#ff2d20]/30 hover:text-white disabled:opacity-50"
                        >
                            <Download className="h-3.5 w-3.5" /> 
                            {isExporting ? 'Exporting...' : 'Export PDF'}
                        </button>
                    )}
                    <Link
                        href="/insights"
                        className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 transition-all hover:border-[#ff2d20]/30 hover:text-white"
                    >
                        <BookOpenText className="h-3.5 w-3.5" /> Insights
                    </Link>
                    <Link
                        href="/comparison"
                        className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 transition-all hover:border-[#ff2d20]/30 hover:text-white"
                    >
                        <GitCompareArrows className="h-3.5 w-3.5" /> Comparison
                    </Link>
                    <Link
                        href="/scenario-lab"
                        className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 transition-all hover:border-[#ff2d20]/30 hover:text-white"
                    >
                        <FlaskConical className="h-3.5 w-3.5" /> What-If
                    </Link>
                </div>
            </div>

            {/* Top row: Recommendation Cards + Confidence Meter */}
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                {/* Top-3 Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {top3.map((rec, i) => (
                        <RecommendationCard key={rec.major.id} rec={rec} index={i} />
                    ))}
                </div>

                {/* Algorithmic Confidence Meter */}
                <Card className="relative overflow-hidden rounded-[24px] border-white/10 bg-[#000000]/82 py-0">
                    {/* Subtle animated gradient border glow */}
                    <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/[0.06]" />
                    <CardContent className="space-y-4 px-5 py-5">
                        <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#ff2d20]/10">
                                <Shield className="h-3.5 w-3.5 text-[#ff2d20]" />
                            </div>
                            Algorithmic Confidence
                        </div>

                        {/* CR Gauge */}
                        <div className="flex flex-col items-center py-1">
                            <CrGaugeMini cr={cr} />
                        </div>

                        {/* Metrics */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2.5 text-xs">
                                <span className="text-slate-400">CR Score</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-semibold" style={{ color: crInfo.color }}>
                                        {cr.toFixed(4)}
                                    </span>
                                    <span className="text-slate-600">/</span>
                                    <span className="font-mono text-slate-500">0.1</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2.5 text-xs">
                                <span className="text-slate-400">Normalization</span>
                                <div className="flex items-center gap-1.5">
                                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${normComplete ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-yellow-400 animate-pulse shadow-[0_0_6px_rgba(250,204,21,0.6)]'}`} />
                                    <span className={normComplete ? 'font-medium text-green-400' : 'font-medium text-yellow-400'}>
                                        {normComplete ? 'Complete' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2.5 text-xs">
                                <span className="text-slate-400">Confidence</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_6px]" style={{ backgroundColor: confidence.color, boxShadow: `0 0 6px ${confidence.color}80` }} />
                                    <span className="font-semibold" style={{ color: confidence.color }}>
                                        {confidence.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Confidence Bar */}
                        <div>
                            <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                                <span>Overall Score</span>
                                <span className="font-mono font-semibold text-white">{confidence.value.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${confidence.value}%`,
                                        background: `linear-gradient(90deg, ${confidence.color}, #ff2d20)`,
                                        boxShadow: `0 0 12px ${confidence.color}40`,
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Phase Navigator */}
            <Card className="rounded-[24px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-5 py-5 sm:px-6">
                    <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#ff2d20]/10">
                            <Gauge className="h-3.5 w-3.5 text-[#ff2d20]" />
                        </div>
                        6 Fase Komputasi
                    </div>
                    <PhaseNavigator completedPhases={completedPhases} />
                </CardContent>
            </Card>
        </section>
    );
}
