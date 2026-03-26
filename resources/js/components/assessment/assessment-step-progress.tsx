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
        <div className="mb-8 w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
            <div className="flex items-center gap-2 sm:gap-4 px-2">
                {steps.map((step, i) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    const Icon = step.icon;

                    return (
                        <React.Fragment key={step.id}>
                            <div
                                className={`flex shrink-0 items-center gap-3 rounded-[20px] px-4 py-3 transition-all duration-300 ${
                                    isActive
                                        ? 'bg-[#ff2d20] shadow-[0_8px_24px_rgba(255,45,32,0.35)]'
                                        : 'border border-white/10 bg-[#0a0a0a] hover:bg-white/[0.04]'
                                }`}
                            >
                                {/* Icon Circle */}
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                                        isActive
                                            ? 'bg-white/20 text-white'
                                            : isCompleted
                                              ? 'border border-[#ff2d20]/30 bg-[#ff2d20]/10 text-[#ff2d20]'
                                              : 'border border-white/10 bg-white/5 text-slate-400'
                                    }`}
                                >
                                    {isCompleted && !isActive ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                                </div>

                                {/* Texts */}
                                <div className="flex flex-col">
                                    <span
                                        className={`text-sm font-semibold transition-colors ${
                                            isActive ? 'text-white' : 'text-slate-200'
                                        }`}
                                    >
                                        {step.label}
                                    </span>
                                    <span
                                        className={`text-[10px] tracking-[0.15em] transition-colors ${
                                            isActive
                                                ? 'font-medium text-white/80'
                                                : isCompleted
                                                  ? 'font-medium text-[#ff2d20]/80'
                                                  : 'text-slate-500 uppercase'
                                        }`}
                                    >
                                        {isActive ? 'AKTIF' : isCompleted ? 'SELESAI' : `STEP ${step.id}`}
                                    </span>
                                </div>
                            </div>

                            {/* Separator Chevron */}
                            {i < steps.length - 1 && (
                                <ChevronRight className="h-4 w-4 shrink-0 text-slate-700" />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
