import { CheckCircle2, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = {
    id: number;
    label: string;
};

const steps: Step[] = [
    { id: 1, label: 'Onboarding' },
    { id: 2, label: 'RIASEC' },
    { id: 3, label: 'Grit Scale' },
    { id: 4, label: 'Logic Test' },
    { id: 5, label: 'AHP Pairwise' },
    { id: 6, label: 'Validasi' },
    { id: 7, label: 'Review' },
];

/* ═══════════════════════════════ PARTICLE BURST ═══════════════════════════════ */

function CompletionParticles({ isVisible }: { isVisible: boolean }) {
    const particles = Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const distance = 28 + Math.random() * 20;
        const size = 3 + Math.random() * 4;
        return {
            id: i,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            size,
            delay: i * 0.03,
            duration: 0.5 + Math.random() * 0.3,
            color: i % 3 === 0 ? '#ff2d20' : i % 3 === 1 ? '#ff6b5e' : '#ffffff',
        };
    });

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="pointer-events-none absolute inset-0 z-30">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute left-1/2 top-1/2 rounded-full"
                            style={{
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                marginLeft: -p.size / 2,
                                marginTop: -p.size / 2,
                                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                            }}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                                x: p.x,
                                y: p.y,
                                opacity: 0,
                                scale: 0.2,
                            }}
                            transition={{
                                duration: p.duration,
                                delay: p.delay,
                                ease: 'easeOut',
                            }}
                            exit={{ opacity: 0 }}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}

/* ═══════════════════════════════ COMPLETION RING ═══════════════════════════════ */

function CompletionRing({ isVisible }: { isVisible: boolean }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
                    initial={{ boxShadow: '0 0 0px rgba(255,45,32,0)', scale: 1 }}
                    animate={{
                        boxShadow: [
                            '0 0 0px rgba(255,45,32,0)',
                            '0 0 30px rgba(255,45,32,0.6)',
                            '0 0 0px rgba(255,45,32,0)',
                        ],
                        scale: [1, 1.06, 1],
                    }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    exit={{ opacity: 0 }}
                />
            )}
        </AnimatePresence>
    );
}

/* ═══════════════════════════════ ANIMATED CHECKMARK ═══════════════════════════════ */

function AnimatedCheckmark() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <defs>
                <filter id="checkGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            {/* Outer circle with draw animation */}
            <motion.circle
                cx="12"
                cy="12"
                r="10"
                stroke="#ff2d20"
                strokeWidth="1.8"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Checkmark path with draw animation */}
            <motion.path
                d="M7 12.5L10.5 16L17 9"
                stroke="#ff2d20"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#checkGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
            />
            {/* Success flash */}
            <motion.circle
                cx="12"
                cy="12"
                r="10"
                fill="#ff2d20"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            />
        </svg>
    );
}

/* ═══════════════════════════════ ANIMATED STEP ICONS ═══════════════════════════════ */

function StepIcon({ stepId, isActive, isCompleted }: { stepId: number; isActive: boolean; isCompleted: boolean }) {
    if (isCompleted && !isActive) {
        return <AnimatedCheckmark />;
    }

    const color = isActive ? 'white' : 'currentColor';
    const glowId = `stepGlow-${stepId}`;

    return (
        <motion.svg
            viewBox="0 0 40 40"
            className="h-5 w-5"
            aria-hidden="true"
            initial={isActive ? { scale: 0.5, opacity: 0 } : false}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
            <defs>
                <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation={isActive ? "2" : "0"} result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            <g filter={`url(#${glowId})`}>
                {/* Step 1: Onboarding — User with welcome wave */}
                {stepId === 1 && (
                    <g stroke={color} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="17" cy="13" r="4.5">
                            {isActive && <animate attributeName="r" values="4.5;5;4.5" dur="2.5s" repeatCount="indefinite" />}
                        </circle>
                        <path d="M8 32 C8 24 12 20 17 20 C22 20 26 24 26 32" />
                        <g>
                            {isActive && <animateTransform attributeName="transform" type="rotate" values="-10 30 18;10 30 18;-10 30 18" dur="1.5s" repeatCount="indefinite" />}
                            <path d="M28 10 L32 6" strokeWidth="2" />
                            <path d="M30 14 L34 12" strokeWidth="1.5" />
                            <path d="M31 18 L34 18" strokeWidth="1.5" />
                        </g>
                    </g>
                )}

                {/* Step 2: RIASEC — Rotating hexagon */}
                {stepId === 2 && (
                    <g stroke={color} fill="none" strokeWidth="1.6" strokeLinecap="round">
                        <g>
                            {isActive && <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="12s" repeatCount="indefinite" />}
                            <polygon points="20,6 31,13 31,27 20,34 9,27 9,13" fill={isActive ? 'rgba(255,255,255,0.08)' : 'none'} />
                            <line x1="20" y1="6" x2="20" y2="34" strokeDasharray="2 2" opacity="0.4" />
                            <line x1="9" y1="13" x2="31" y2="27" strokeDasharray="2 2" opacity="0.4" />
                            <line x1="31" y1="13" x2="9" y2="27" strokeDasharray="2 2" opacity="0.4" />
                        </g>
                        <circle cx="20" cy="20" r="2.5" fill={color}>
                            {isActive && <animate attributeName="r" values="2;3.5;2" dur="2s" repeatCount="indefinite" />}
                            {isActive && <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />}
                        </circle>
                        {[[20,6],[31,13],[31,27],[20,34],[9,27],[9,13]].map(([cx,cy], idx) => (
                            <circle key={idx} cx={cx} cy={cy} r="1.8" fill={color} opacity={isActive ? 0.9 : 0.4}>
                                {isActive && <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" begin={`${idx * 0.3}s`} />}
                            </circle>
                        ))}
                    </g>
                )}

                {/* Step 3: Grit Scale — Mountain with flag */}
                {stepId === 3 && (
                    <g stroke={color} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 34 L16 10 L22 20 L28 14 L36 34 Z" fill={isActive ? 'rgba(255,255,255,0.06)' : 'none'} />
                        <line x1="16" y1="10" x2="16" y2="4" strokeWidth="1.5" />
                        <path d="M16 4 L24 6.5 L16 9" fill={isActive ? 'rgba(255,45,32,0.5)' : 'none'} stroke={color} strokeWidth="1.2">
                            {isActive && <animate attributeName="d" values="M16 4 L24 6.5 L16 9;M16 4 L23 7 L16 9;M16 4 L24 6.5 L16 9" dur="2s" repeatCount="indefinite" />}
                        </path>
                        {isActive && (
                            <circle cx="16" cy="4" r="1.5" fill={color} opacity="0.8">
                                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
                                <animate attributeName="r" values="1;2.5;1" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                        )}
                    </g>
                )}

                {/* Step 4: Logic Test — Brain with circuits */}
                {stepId === 4 && (
                    <g stroke={color} fill="none" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M18 8 C12 8 7 13 7 20 C7 27 12 32 18 32" fill={isActive ? 'rgba(255,255,255,0.04)' : 'none'}>
                            {isActive && <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" />}
                        </path>
                        <path d="M22 8 C28 8 33 13 33 20 C33 27 28 32 22 32" fill={isActive ? 'rgba(255,255,255,0.04)' : 'none'}>
                            {isActive && <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" begin="0.3s" />}
                        </path>
                        <line x1="20" y1="8" x2="20" y2="32" strokeDasharray="2 3" opacity="0.3" />
                        {[[12, 15], [28, 15], [14, 25], [26, 25], [20, 20]].map(([cxv, cyv], idx) => (
                            <circle key={idx} cx={cxv} cy={cyv} r="1.5" fill={color}>
                                {isActive && <animate attributeName="r" values="1.2;2.2;1.2" dur="1.8s" repeatCount="indefinite" begin={`${idx * 0.25}s`} />}
                            </circle>
                        ))}
                        {isActive && (
                            <g strokeDasharray="2 2" opacity="0.5">
                                <line x1="12" y1="15" x2="20" y2="20" />
                                <line x1="28" y1="15" x2="20" y2="20" />
                                <line x1="14" y1="25" x2="20" y2="20" />
                                <line x1="26" y1="25" x2="20" y2="20" />
                            </g>
                        )}
                    </g>
                )}

                {/* Step 5: AHP Pairwise — Oscillating scale */}
                {stepId === 5 && (
                    <g stroke={color} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="20,10 17,15 23,15" fill={isActive ? 'rgba(255,255,255,0.1)' : 'none'} strokeWidth="1.2" />
                        <g>
                            {isActive && <animateTransform attributeName="transform" type="rotate" values="-4 20 15;4 20 15;-4 20 15" dur="3s" repeatCount="indefinite" />}
                            <line x1="8" y1="19" x2="32" y2="19" strokeWidth="2" />
                            <g>
                                {isActive && <animateTransform attributeName="transform" type="translate" values="0,0;0,2;0,0" dur="3s" repeatCount="indefinite" />}
                                <line x1="8" y1="19" x2="8" y2="25" strokeWidth="1" />
                                <path d="M4 25 Q6 30 8 30 Q10 30 12 25" fill={isActive ? 'rgba(255,255,255,0.08)' : 'none'} />
                            </g>
                            <g>
                                {isActive && <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="3s" repeatCount="indefinite" />}
                                <line x1="32" y1="19" x2="32" y2="25" strokeWidth="1" />
                                <path d="M28 25 Q30 30 32 30 Q34 30 36 25" fill={isActive ? 'rgba(255,255,255,0.08)' : 'none'} />
                            </g>
                        </g>
                        <line x1="16" y1="33" x2="24" y2="33" strokeWidth="2" />
                        <line x1="20" y1="15" x2="20" y2="33" strokeWidth="1.5" />
                    </g>
                )}

                {/* Step 6: Validasi — Shield with scan */}
                {stepId === 6 && (
                    <g stroke={color} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 L32 12 L32 22 C32 29 26 34 20 36 C14 34 8 29 8 22 L8 12 Z" fill={isActive ? 'rgba(255,255,255,0.05)' : 'none'} />
                        <polyline points="14,21 18,25 26,17" strokeWidth="2.2">
                            {isActive && <animate attributeName="stroke-dasharray" values="0 30;30 0" dur="1.2s" fill="freeze" />}
                        </polyline>
                        {isActive && (
                            <line x1="8" y1="20" x2="32" y2="20" stroke={color} strokeWidth="1" opacity="0.35">
                                <animate attributeName="y1" values="8;36;8" dur="2.5s" repeatCount="indefinite" />
                                <animate attributeName="y2" values="8;36;8" dur="2.5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
                            </line>
                        )}
                    </g>
                )}

                {/* Step 7: Review — Document + magnify */}
                {stepId === 7 && (
                    <g stroke={color} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="8" y="5" width="18" height="26" rx="3" fill={isActive ? 'rgba(255,255,255,0.05)' : 'none'} />
                        <line x1="12" y1="12" x2="22" y2="12" strokeWidth="1.2" opacity="0.5" />
                        <line x1="12" y1="17" x2="20" y2="17" strokeWidth="1.2" opacity="0.5" />
                        <line x1="12" y1="22" x2="18" y2="22" strokeWidth="1.2" opacity="0.5" />
                        <g>
                            {isActive && <animateTransform attributeName="transform" type="translate" values="0,0;-1,-1;0,0" dur="2s" repeatCount="indefinite" />}
                            <circle cx="28" cy="26" r="6" strokeWidth="1.8" fill={isActive ? 'rgba(255,255,255,0.06)' : 'none'}>
                                {isActive && <animate attributeName="r" values="6;6.5;6" dur="2s" repeatCount="indefinite" />}
                            </circle>
                            <line x1="33" y1="31" x2="37" y2="35" strokeWidth="2.5" />
                        </g>
                        {isActive && (
                            <circle cx="26" cy="24" r="1" fill={color} opacity="0.8">
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                        )}
                    </g>
                )}
            </g>
        </motion.svg>
    );
}

/* ═══════════════════════════════ CONNECTOR ═══════════════════════════════ */

function StepConnector({ isCompleted }: { isCompleted: boolean }) {
    return (
        <div className="flex shrink-0 items-center gap-0.5">
            {/* Animated energy line */}
            <div className="relative h-[2px] w-5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        background: 'linear-gradient(90deg, #ff2d20, #ff6b5e)',
                        boxShadow: isCompleted ? '0 0 8px rgba(255,45,32,0.6)' : 'none',
                    }}
                />
                {/* Traveling spark on completed connectors */}
                {isCompleted && (
                    <motion.div
                        className="absolute top-[-1px] h-1 w-1 rounded-full bg-white"
                        style={{ boxShadow: '0 0 4px #fff, 0 0 8px #ff2d20' }}
                        animate={{ left: ['-10%', '110%'] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: 'easeInOut',
                        }}
                    />
                )}
            </div>
            <motion.div
                animate={isCompleted ? { color: 'rgba(255,45,32,0.6)' } : { color: 'rgba(51,65,85,1)' }}
                transition={{ duration: 0.4 }}
            >
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════ MAIN COMPONENT ═══════════════════════════════ */

type AssessmentStepProgressProps = {
    currentStep: number;
};

export function AssessmentStepProgress({ currentStep }: AssessmentStepProgressProps) {
    const prevStepRef = useRef(currentStep);
    const [justCompleted, setJustCompleted] = useState<number | null>(null);

    useEffect(() => {
        if (currentStep > prevStepRef.current) {
            // A step was just completed — trigger celebration on the PREVIOUS step
            setJustCompleted(prevStepRef.current);
            const timer = setTimeout(() => setJustCompleted(null), 1200);
            prevStepRef.current = currentStep;
            return () => clearTimeout(timer);
        }
        prevStepRef.current = currentStep;
    }, [currentStep]);

    return (
        <div className="step-progress-bar -mx-4 mb-8 w-[calc(100%+2rem)] overflow-x-auto px-4 py-4">
            <div className="flex items-center gap-2 sm:gap-4">
                {steps.map((step, i) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    const wasJustCompleted = justCompleted === step.id;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Step Pill */}
                            <motion.div
                                className={`group relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 ${
                                    isActive
                                        ? 'step-active bg-gradient-to-br from-[#ff4438] via-[#ff2d20] to-[#e01f14]'
                                        : isCompleted
                                          ? 'border border-[#ff2d20]/25 bg-[#ff2d20]/8'
                                          : 'border border-white/8 bg-white/[0.03]'
                                }`}
                                layout
                                animate={
                                    wasJustCompleted
                                        ? { scale: [1, 1.08, 1], transition: { duration: 0.5 } }
                                        : {}
                                }
                                whileHover={
                                    !isActive
                                        ? {
                                              scale: 1.03,
                                              borderColor: isCompleted
                                                  ? 'rgba(255,45,32,0.4)'
                                                  : 'rgba(255,255,255,0.15)',
                                          }
                                        : {}
                                }
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                                {/* Particle burst on completion */}
                                <CompletionParticles isVisible={wasJustCompleted} />
                                {/* Ripple ring on completion */}
                                <CompletionRing isVisible={wasJustCompleted} />

                                {/* Glow ring behind active step */}
                                {isActive && (
                                    <div className="step-glow pointer-events-none absolute -inset-[1px] -z-10 rounded-2xl" />
                                )}

                                {/* Shimmer sweep on active */}
                                {isActive && (
                                    <div className="step-shimmer pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl" />
                                )}

                                {/* Orbiting energy dot for active step */}
                                {isActive && (
                                    <div className="step-orbit pointer-events-none absolute -inset-2 z-20">
                                        <div className="step-orbiter" />
                                    </div>
                                )}

                                {/* Icon */}
                                <div
                                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                                        isActive
                                            ? 'bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
                                            : isCompleted
                                              ? 'bg-[#ff2d20]/15 text-[#ff2d20]'
                                              : 'bg-white/5 text-slate-500'
                                    }`}
                                >
                                    {/* Completion flash on the icon container */}
                                    <AnimatePresence>
                                        {wasJustCompleted && (
                                            <motion.div
                                                className="absolute inset-0 rounded-xl bg-[#ff2d20]"
                                                initial={{ opacity: 0.7 }}
                                                animate={{ opacity: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.6 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                    <StepIcon stepId={step.id} isActive={isActive} isCompleted={isCompleted} />
                                </div>

                                {/* Text */}
                                <div className="flex flex-col gap-0.5">
                                    <span
                                        className={`text-sm font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                                            isActive
                                                ? 'text-white'
                                                : isCompleted
                                                  ? 'text-slate-200'
                                                  : 'text-slate-400'
                                        }`}
                                    >
                                        {step.label}
                                    </span>
                                    <span
                                        className={`text-[10px] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
                                            isActive
                                                ? 'text-white/75'
                                                : isCompleted
                                                  ? 'text-[#ff2d20]/70'
                                                  : 'text-slate-600'
                                        }`}
                                    >
                                        {isActive ? 'AKTIF' : isCompleted ? 'SELESAI' : `STEP ${step.id}`}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Connector */}
                            {i < steps.length - 1 && (
                                <StepConnector isCompleted={currentStep > step.id} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <style>{`
                .step-progress-bar::-webkit-scrollbar {
                    display: none;
                }
                .step-progress-bar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                /* ══════ PULSING OUTER GLOW ══════ */
                .step-glow {
                    background: linear-gradient(135deg, rgba(255, 68, 56, 0.6), rgba(255, 45, 32, 0.4), rgba(224, 31, 20, 0.6));
                    filter: blur(8px);
                    animation: step-pulse 2.5s ease-in-out infinite;
                }

                @keyframes step-pulse {
                    0%, 100% {
                        opacity: 0.5;
                        filter: blur(8px);
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.85;
                        filter: blur(14px);
                        transform: scale(1.06);
                    }
                }

                /* ══════ SHIMMER SWEEP ══════ */
                .step-shimmer::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(
                        105deg,
                        transparent 30%,
                        rgba(255, 255, 255, 0.15) 50%,
                        transparent 70%
                    );
                    animation: step-shimmer-sweep 3s ease-in-out infinite;
                }

                @keyframes step-shimmer-sweep {
                    0% { left: -100%; }
                    60%, 100% { left: 180%; }
                }

                /* ══════ ACTIVE PILL ENTRANCE ══════ */
                .step-active {
                    animation: step-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }

                @keyframes step-enter {
                    from {
                        transform: scale(0.88);
                        opacity: 0.5;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                /* ══════ ORBITING ENERGY DOT ══════ */
                .step-orbit {
                    overflow: visible;
                }

                .step-orbiter {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 0 6px #fff, 0 0 12px rgba(255, 45, 32, 0.8);
                    top: -2px;
                    left: 50%;
                    margin-left: -2px;
                    animation: orbit-around 4s linear infinite;
                }

                @keyframes orbit-around {
                    0% {
                        top: -2px;
                        left: 50%;
                        margin-left: -2px;
                    }
                    25% {
                        top: 50%;
                        left: calc(100% + 2px);
                        margin-top: -2px;
                        margin-left: 0;
                    }
                    50% {
                        top: calc(100% + 2px);
                        left: 50%;
                        margin-left: -2px;
                        margin-top: 0;
                    }
                    75% {
                        top: 50%;
                        left: -2px;
                        margin-top: -2px;
                        margin-left: 0;
                    }
                    100% {
                        top: -2px;
                        left: 50%;
                        margin-left: -2px;
                    }
                }

                /* ══════ COMPLETED PILL GLOW ══════ */
                .step-active + .step-connector-completed .step-connector-line {
                    animation: connector-fill 0.6s ease-out forwards;
                }

                @keyframes connector-fill {
                    from { width: 0; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
}
