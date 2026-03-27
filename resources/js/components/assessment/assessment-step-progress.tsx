import { CheckCircle2, ChevronRight, UserCircle, Hexagon, Target, Lightbulb, Scale, ShieldCheck, FileText } from 'lucide-react';
import React from 'react';

type Step = {
    id: number;
    label: string;
    icon: React.ElementType;
};

const steps: Step[] = [
    { id: 1, label: 'Onboarding', icon: UserCircle },
    { id: 2, label: 'RIASEC', icon: Hexagon },
    { id: 3, label: 'Grit Scale', icon: Target },
    { id: 4, label: 'Logic Test', icon: Lightbulb },
    { id: 5, label: 'AHP Pairwise', icon: Scale },
    { id: 6, label: 'Validasi', icon: ShieldCheck },
    { id: 7, label: 'Review', icon: FileText },
];

type AssessmentStepProgressProps = {
    currentStep: number;
};

export function AssessmentStepProgress({ currentStep }: AssessmentStepProgressProps) {
    return (
        <div className="step-progress-bar -mx-4 mb-8 w-[calc(100%+2rem)] overflow-x-auto px-4 py-4">
            <div className="flex items-center gap-2 sm:gap-4">
                {steps.map((step, i) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    const Icon = step.icon;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Step Pill */}
                            <div
                                className={`group relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-500 ${
                                    isActive
                                        ? 'step-active bg-gradient-to-br from-[#ff4438] via-[#ff2d20] to-[#e01f14]'
                                        : isCompleted
                                          ? 'border border-[#ff2d20]/25 bg-[#ff2d20]/8 hover:border-[#ff2d20]/40 hover:bg-[#ff2d20]/12'
                                          : 'border border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
                                }`}
                            >
                                {/* Glow ring behind active step */}
                                {isActive && (
                                    <div className="step-glow pointer-events-none absolute -inset-[1px] -z-10 rounded-2xl" />
                                )}

                                {/* Shimmer sweep on active */}
                                {isActive && (
                                    <div className="step-shimmer pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl" />
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
                                    {isCompleted && !isActive ? (
                                        <CheckCircle2 className="h-4.5 w-4.5" />
                                    ) : (
                                        <Icon className="h-4.5 w-4.5" />
                                    )}
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
                            </div>

                            {/* Connector */}
                            {i < steps.length - 1 && (
                                <div className="flex shrink-0 items-center">
                                    <div
                                        className={`h-px w-4 transition-colors duration-500 ${
                                            currentStep > step.id
                                                ? 'bg-[#ff2d20]/40'
                                                : 'bg-white/8'
                                        }`}
                                    />
                                    <ChevronRight
                                        className={`h-3.5 w-3.5 shrink-0 transition-colors duration-500 ${
                                            currentStep > step.id
                                                ? 'text-[#ff2d20]/50'
                                                : 'text-slate-700'
                                        }`}
                                    />
                                </div>
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

                /* Pulsing outer glow */
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
                        filter: blur(12px);
                        transform: scale(1.04);
                    }
                }

                /* Shimmer sweep */
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
                        rgba(255, 255, 255, 0.12) 50%,
                        transparent 70%
                    );
                    animation: step-shimmer-sweep 3s ease-in-out infinite;
                }

                @keyframes step-shimmer-sweep {
                    0% {
                        left: -100%;
                    }
                    60%, 100% {
                        left: 180%;
                    }
                }

                /* Active pill entrance */
                .step-active {
                    animation: step-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }

                @keyframes step-enter {
                    from {
                        transform: scale(0.92);
                        opacity: 0.6;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
