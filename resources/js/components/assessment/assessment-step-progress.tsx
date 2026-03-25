import { CheckCircle2 } from 'lucide-react';

type Step = {
    id: number;
    label: string;
    duration: string;
};

const steps: Step[] = [
    { id: 1, label: 'Onboarding', duration: '2 min' },
    { id: 2, label: 'RIASEC', duration: '15 min' },
    { id: 3, label: 'Grit Scale', duration: '5 min' },
    { id: 4, label: 'Logic Test', duration: '10 min' },
    { id: 5, label: 'AHP Pairwise', duration: '10 min' },
    { id: 6, label: 'Validasi', duration: 'Auto' },
    { id: 7, label: 'Review', duration: '3 min' },
];

type AssessmentStepProgressProps = {
    currentStep: number;
};

export function AssessmentStepProgress({ currentStep }: AssessmentStepProgressProps) {
    return (
        <div className="mb-8 overflow-x-auto px-1 py-2">
            <div className="flex min-w-[640px] items-center justify-between">
                {steps.map((step, i) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-1 items-center">
                            {/* Node */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div
                                    className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-500 ${
                                        isCompleted
                                            ? 'border-[#ff2d20] bg-[#ff2d20] text-white shadow-[0_0_16px_rgba(255,45,32,0.5)]'
                                            : isActive
                                              ? 'border-[#ff2d20] bg-[#ff2d20]/15 text-[#ff2d20] shadow-[0_0_20px_rgba(255,45,32,0.3)]'
                                              : 'border-white/12 bg-white/[0.03] text-slate-500'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        step.id
                                    )}
                                    {isActive && (
                                        <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#ff2d20] opacity-20" />
                                    )}
                                </div>
                                <span
                                    className={`text-[10px] font-medium transition-colors ${
                                        isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                                    }`}
                                >
                                    {step.label}
                                </span>
                                <span className="text-[9px] text-slate-600">{step.duration}</span>
                            </div>

                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="mx-1.5 h-0.5 flex-1 overflow-hidden rounded-full bg-white/8">
                                    <div
                                        className="h-full rounded-full bg-[#ff2d20] transition-all duration-700"
                                        style={{ width: isCompleted ? '100%' : isActive ? '50%' : '0%' }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
