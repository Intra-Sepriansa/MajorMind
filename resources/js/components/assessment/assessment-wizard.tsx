import { useState } from 'react';
import { AssessmentOnboarding } from '@/components/assessment/assessment-onboarding';
import { AssessmentReviewStep } from '@/components/assessment/assessment-review-step';
import { AssessmentStepProgress } from '@/components/assessment/assessment-step-progress';
import { RiasecPhase } from '@/components/assessment/riasec-phase';
import { GritScalePhase } from '@/components/assessment/grit-scale-phase';
import { AdaptiveLogicPhase } from '@/components/assessment/adaptive-logic-phase';
import type { LogicSession } from '@/components/assessment/adaptive-logic-phase';
import { ValidationPhase } from '@/components/assessment/validation-phase';

type AssessmentWizardProps = {
    studentName: string;
    onStudentNameChange: (name: string) => void;
    behavioralProfile: { minat: number; logika: number; konsistensi: number };
    onBehavioralProfileChange: (profile: { minat: number; logika: number; konsistensi: number }) => void;
    criterionOrder: string[];
    weights: Record<string, number>;
    consistencyRatio: number;
    isConsistent: boolean;
    loading: boolean;
    onSubmit: () => void;
    /** The AHP pairwise comparison JSX, rendered by the parent workspace */
    ahpContent: React.ReactNode;
    /** Psychometric data that will be sent with the submission */
    riasecAnswers: Record<string, number>;
    onRiasecAnswersChange: (answers: Record<string, number>) => void;
    gritAnswers: Record<string, number>;
    onGritAnswersChange: (answers: Record<string, number>) => void;
    logicSession: LogicSession;
    onLogicSessionChange: (session: LogicSession) => void;
};

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function AssessmentWizard({
    studentName,
    onStudentNameChange,
    behavioralProfile,
    onBehavioralProfileChange,
    criterionOrder,
    weights,
    consistencyRatio,
    isConsistent,
    loading,
    onSubmit,
    ahpContent,
    riasecAnswers,
    onRiasecAnswersChange,
    gritAnswers,
    onGritAnswersChange,
    logicSession,
    onLogicSessionChange,
}: AssessmentWizardProps) {
    const [currentStep, setCurrentStep] = useState<WizardStep>(1);

    return (
        <div className="space-y-0">
            <AssessmentStepProgress currentStep={currentStep} />

            {/* Step 1: Onboarding */}
            {currentStep === 1 && (
                <AssessmentOnboarding onContinue={() => setCurrentStep(2)} />
            )}

            {/* Step 2: RIASEC Assessment */}
            {currentStep === 2 && (
                <RiasecPhase
                    answers={riasecAnswers}
                    onAnswersChange={onRiasecAnswersChange}
                    onContinue={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                />
            )}

            {/* Step 3: Grit Scale */}
            {currentStep === 3 && (
                <GritScalePhase
                    answers={gritAnswers}
                    onAnswersChange={onGritAnswersChange}
                    onContinue={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                />
            )}

            {/* Step 4: Adaptive Logic Test */}
            {currentStep === 4 && (
                <AdaptiveLogicPhase
                    session={logicSession}
                    onSessionChange={onLogicSessionChange}
                    onContinue={() => setCurrentStep(5)}
                    onBack={() => setCurrentStep(3)}
                />
            )}

            {/* Step 5: AHP Pairwise Comparison */}
            {currentStep === 5 && (
                <div className="space-y-6">
                    {ahpContent}

                    {/* Navigation for AHP step */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(4)}
                            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-transparent px-5 text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                            Kembali ke Logic Test
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentStep(6)}
                            disabled={!isConsistent}
                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#ff2d20] px-6 text-sm font-semibold text-white shadow-[0_0_16px_rgba(255,45,32,0.3)] transition-all hover:bg-[#ff584d] disabled:opacity-40 disabled:shadow-none"
                        >
                            Validasi & Review
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Step 6: Validation (auto-proceed) */}
            {currentStep === 6 && (
                <ValidationPhase
                    riasecAnswers={riasecAnswers}
                    gritAnswers={gritAnswers}
                    onComplete={() => setCurrentStep(7)}
                />
            )}

            {/* Step 7: Review & Submit */}
            {currentStep === 7 && (
                <AssessmentReviewStep
                    studentName={studentName}
                    behavioralProfile={behavioralProfile}
                    criterionOrder={criterionOrder}
                    weights={weights}
                    consistencyRatio={consistencyRatio}
                    isConsistent={isConsistent}
                    loading={loading}
                    onSubmit={onSubmit}
                    onBack={() => setCurrentStep(5)}
                />
            )}
        </div>
    );
}
