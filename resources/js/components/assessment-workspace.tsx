import { Link, usePage } from '@inertiajs/react';
import {
    LoaderCircle,
    LogIn,
    Radar,
    Sparkles,
    Target,
    UserPlus,
} from 'lucide-react';
import { ActionPlanPanel } from '@/components/assessment/dashboard/action-plan-panel';
import { AlgorithmComparisonTable } from '@/components/assessment/dashboard/algorithm-comparison-table';
import { AlgorithmTransparencyPanel } from '@/components/assessment/dashboard/algorithm-transparency-panel';
import { EnhancedRankingsTable } from '@/components/assessment/dashboard/enhanced-rankings-table';
import { ExecutiveSummaryCard } from '@/components/assessment/dashboard/executive-summary-card';
import { GapAnalysisPanel } from '@/components/assessment/dashboard/gap-analysis-panel';
import { SensitivitySimulator } from '@/components/assessment/dashboard/sensitivity-simulator';
import { XaiNarrativePanel } from '@/components/assessment/dashboard/xai-narrative-panel';
import { AssessmentComparisonPanel } from '@/components/assessment/assessment-comparison-panel';
import { AssessmentExplainabilityPanel } from '@/components/assessment/assessment-explainability-panel';
import { AssessmentHistoryPanel } from '@/components/assessment/assessment-history-panel';
import { AssessmentWizard } from '@/components/assessment/assessment-wizard';
import { startTransition, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { assessment as assessmentRoute, dashboard, login, register } from '@/routes';
import type {
    ApiResponse,
    AssessmentHistoryItem,
    AssessmentHistoryPaginated,
    AssessmentResponse,
    Criterion,
    Recommendation,
} from '@/types';

type AssessmentWorkspaceProps = {
    assessmentHistory?: AssessmentHistoryPaginated;
    claimNotice?: string | null;
    initialAssessment?: AssessmentResponse | null;
    mode?: 'dashboard' | 'public';
    view?: 'assessment' | 'dashboard';
};

const scaleLabels: Record<number, string> = {
    1: 'Sedikit lebih penting',
    3: 'Cukup dominan',
    5: 'Sangat dominan',
    7: 'Hampir absolut',
    9: 'Mutlak dominan',
};

const defaultBehavioralProfile = {
    minat: 88,
    logika: 91,
    konsistensi: 84,
};

const defaultLogicSession = {
    theta: 0.0,
    standard_error: 999.0,
    administered: [] as string[],
    responses: [] as { id: string; correct: boolean }[],
};

const ahpPresets = [
    {
        description: 'Bobot seimbang untuk eksplorasi awal yang stabil.',
        key: 'balanced',
        label: 'Balanced',
        weights: {
            kemampuan_analitis: 0.26,
            kesiapan_akademik: 0.18,
            minat_pribadi: 0.32,
            prospek_karier: 0.24,
        },
    },
    {
        description: 'Menekankan passion dan kecocokan personal.',
        key: 'passion-first',
        label: 'Passion-first',
        weights: {
            kemampuan_analitis: 0.24,
            kesiapan_akademik: 0.12,
            minat_pribadi: 0.42,
            prospek_karier: 0.22,
        },
    },
    {
        description: 'Mendorong outcome karier dan peluang jangka panjang.',
        key: 'career-first',
        label: 'Career-first',
        weights: {
            kemampuan_analitis: 0.22,
            kesiapan_akademik: 0.13,
            minat_pribadi: 0.24,
            prospek_karier: 0.41,
        },
    },
    {
        description: 'Cocok untuk siswa yang ingin basis akademik kuat.',
        key: 'academic-first',
        label: 'Academic-first',
        weights: {
            kemampuan_analitis: 0.3,
            kesiapan_akademik: 0.34,
            minat_pribadi: 0.21,
            prospek_karier: 0.15,
        },
    },
] as const;

const emptyHistory: AssessmentHistoryPaginated = {
    data: [],
    meta: {
        current_page: 1,
        last_page: 1,
        per_page: 5,
        total: 0,
    },
};

function resolveStorageKeys(userId: number | null | undefined) {
    const namespace = userId ? `user:${userId}` : 'guest';

    return {
        claimAttempt: `majormind:${namespace}:claim-attempt`,
        id: `majormind:${namespace}:last-assessment-id`,
        payload: `majormind:${namespace}:last-assessment-payload`,
    };
}

const randomIndexLookup: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0.58,
    4: 0.9,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.49,
};

function sliderToScale(value: number): number {
    if (value === 0) {
        return 1;
    }

    const scale = Math.abs(value) + 1;

    return value > 0 ? scale : 1 / scale;
}

function scaleToCopy(
    value: number,
    leftLabel: string,
    rightLabel: string,
): string {
    if (value === 0) {
        return `${leftLabel} dan ${rightLabel} setara`;
    }

    const magnitude = Math.abs(value) + 1;
    const favoredSide = value > 0 ? leftLabel : rightLabel;

    return `${favoredSide} ${scaleLabels[magnitude] ?? 'lebih penting'}`;
}

function buildMatrix(size: number): number[][] {
    return Array.from({ length: size }, (_, rowIndex) =>
        Array.from({ length: size }, (_, columnIndex) =>
            rowIndex === columnIndex ? 1 : rowIndex < columnIndex ? 3 : 1 / 3,
        ),
    );
}

function buildPresetMatrix(
    criterionOrder: string[],
    weights: Record<string, number>,
) {
    return criterionOrder.map((leftSlug, rowIndex) =>
        criterionOrder.map((rightSlug, columnIndex) => {
            if (rowIndex === columnIndex) {
                return 1;
            }

            return weights[leftSlug] / weights[rightSlug];
        }),
    );
}

function calculateAhpDiagnostics(matrix: number[][]) {
    const size = matrix.length;

    if (size < 2 || matrix.some((row) => row.length !== size)) {
        return null;
    }

    const geometricMeans = matrix.map((row) => {
        const product = row.reduce((current, value) => current * value, 1);

        return product ** (1 / size);
    });

    const weightSum = geometricMeans.reduce((sum, value) => sum + value, 0);
    const weights = geometricMeans.map((value) => value / weightSum);
    const weightedSums = matrix.map((row) =>
        row.reduce((sum, cell, index) => sum + cell * (weights[index] ?? 0), 0),
    );
    const consistencyVector = weightedSums.map(
        (weightedSum, index) => weightedSum / (weights[index] ?? 1),
    );
    const lambdaMax =
        consistencyVector.reduce((sum, value) => sum + value, 0) / size;
    const consistencyIndex = (lambdaMax - size) / (size - 1);
    const randomIndex = randomIndexLookup[size] ?? 1.49;
    const consistencyRatio =
        randomIndex > 0 ? consistencyIndex / randomIndex : 0;

    return {
        consistencyIndex,
        consistencyRatio,
        isConsistent: consistencyRatio <= 0.1,
        lambdaMax,
        weights,
    };
}

function formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

function formatSessionTime(value: string | null | undefined): string {
    if (!value) {
        return 'Unknown session';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function getAssessmentUrl(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
}

function hydrateBehavioralProfile(
    result: AssessmentResponse | null | undefined,
): typeof defaultBehavioralProfile {
    if (!result) {
        return defaultBehavioralProfile;
    }

    return {
        minat:
            result.behavioral_profile.minat ?? defaultBehavioralProfile.minat,
        logika:
            result.behavioral_profile.logika ?? defaultBehavioralProfile.logika,
        konsistensi:
            result.behavioral_profile.konsistensi ??
            defaultBehavioralProfile.konsistensi,
    };
}

function getAssessmentConfidence(
    assessment: AssessmentResponse | null | undefined,
): number {
    if (!assessment) {
        return 0;
    }

    return (
        assessment.summary?.recommendation_confidence ??
        assessment.recommendations[0]?.meta?.probability_percentage ??
        0
    );
}

function toHistoryItem(assessment: AssessmentResponse): AssessmentHistoryItem {
    return {
        id: assessment.id,
        student_name: assessment.student_name,
        created_at: assessment.created_at ?? null,
        consistency_ratio: assessment.consistency_ratio,
        confidence: getAssessmentConfidence(assessment),
        top_major: assessment.top_major,
    };
}

function ProgressRing({ value }: { value: number }) {
    const percentage = Math.max(0, Math.min(100, value));

    return (
        <div
            className="relative flex h-36 w-36 items-center justify-center rounded-full"
            style={{
                background: `conic-gradient(#ff2d20 ${percentage}%, rgba(255,255,255,0.08) ${percentage}% 100%)`,
            }}
        >
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#000000] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="text-center">
                    <div className="text-4xl font-semibold tracking-[-0.04em] text-white">
                        {Math.round(percentage)}
                    </div>
                    <div className="text-[11px] tracking-[0.3em] text-slate-400 uppercase">
                        Match
                    </div>
                </div>
            </div>
        </div>
    );
}

function RadarProfile({
    studentProfile,
    recommendation,
}: {
    studentProfile: Record<string, number>;
    recommendation: Recommendation | null;
}) {
    const majorValues = recommendation?.meta?.weighted_scores ?? {};
    const axes = [
        {
            key: 'minat',
            label: 'Minat',
            student: studentProfile.minat ?? 0,
            major: (majorValues.minat_pribadi ?? 0) * 100,
        },
        {
            key: 'logika',
            label: 'Logika',
            student: studentProfile.logika ?? 0,
            major: (majorValues.kemampuan_analitis ?? 0) * 100,
        },
        {
            key: 'konsistensi',
            label: 'Konsisten',
            student: studentProfile.konsistensi ?? 0,
            major: (majorValues.kesiapan_akademik ?? 0) * 100,
        },
        {
            key: 'karier',
            label: 'Karier',
            student:
                ((studentProfile.minat ?? 0) +
                    (studentProfile.konsistensi ?? 0)) /
                2,
            major: (majorValues.prospek_karier ?? 0) * 100,
        },
    ];

    const center = 100;
    const radius = 70;
    const toPoint = (index: number, score: number) => {
        const angle = -Math.PI / 2 + ((Math.PI * 2) / axes.length) * index;
        const distance = (score / 100) * radius;

        return {
            x: center + Math.cos(angle) * distance,
            y: center + Math.sin(angle) * distance,
        };
    };

    const buildPolygon = (type: 'student' | 'major') =>
        axes
            .map((axis, index) => {
                const point = toPoint(
                    index,
                    type === 'student' ? axis.student : axis.major,
                );

                return `${point.x},${point.y}`;
            })
            .join(' ');

    return (
        <div className="grid gap-5 xl:grid-cols-[180px_1fr] lg:grid-cols-2 grid-cols-1 items-center">
            <svg viewBox="0 0 200 200" className="mx-auto h-44 w-44 shrink-0">
                {[25, 50, 75, 100].map((ring) => (
                    <polygon
                        key={ring}
                        points={axes
                            .map((_, index) => {
                                const point = toPoint(index, ring);

                                return `${point.x},${point.y}`;
                            })
                            .join(' ')}
                        fill="none"
                        stroke="rgba(255,255,255,0.10)"
                        strokeWidth="1"
                    />
                ))}
                {axes.map((axis, index) => {
                    const point = toPoint(index, 100);

                    return (
                        <line
                            key={axis.key}
                            x1={center}
                            y1={center}
                            x2={point.x}
                            y2={point.y}
                            stroke="rgba(255,255,255,0.08)"
                        />
                    );
                })}
                <polygon
                    points={buildPolygon('major')}
                    fill="rgba(255, 45, 32, 0.18)"
                    stroke="#ff2d20"
                    strokeWidth="2"
                />
                <polygon
                    points={buildPolygon('student')}
                    fill="rgba(255,255,255,0.06)"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="2"
                />
            </svg>
            <div className="grid gap-3 text-sm">
                {axes.map((axis) => (
                    <div
                        key={axis.key}
                        className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3"
                    >
                        <div className="mb-2 flex items-center justify-between text-slate-300">
                            <span>{axis.label}</span>
                            <span className="font-mono text-xs text-slate-500">
                                {axis.student.toFixed(0)} /{' '}
                                {axis.major.toFixed(0)}
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/8">
                            <div
                                className="h-full rounded-full bg-white/80"
                                style={{
                                    width: `${Math.max(4, axis.student)}%`,
                                }}
                            />
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                            <div
                                className="h-full rounded-full bg-[#ff2d20]"
                                style={{ width: `${Math.max(4, axis.major)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AssessmentWorkspace({
    assessmentHistory = emptyHistory,
    claimNotice = null,
    initialAssessment = null,
    mode = 'dashboard',
    view = 'dashboard',
}: AssessmentWorkspaceProps) {
    const { auth } = usePage<{
        auth: {
            user: { id: number; name: string } | null;
        };
    }>().props;
    const storageKeys = resolveStorageKeys(auth.user?.id);
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [matrix, setMatrix] = useState<number[][]>([]);
    const [studentName, setStudentName] = useState(
        initialAssessment?.student_name ?? 'Alya Nirmala',
    );
    const [behavioralProfile, setBehavioralProfile] = useState(
        hydrateBehavioralProfile(initialAssessment),
    );
    const [riasecAnswers, setRiasecAnswers] = useState<Record<string, number>>({});
    const [gritAnswers, setGritAnswers] = useState<Record<string, number>>({});
    const [logicSession, setLogicSession] = useState(defaultLogicSession);
    const [result, setResult] = useState<AssessmentResponse | null>(
        initialAssessment,
    );
    const [historyItems, setHistoryItems] = useState(assessmentHistory.data);
    const [historyMeta, setHistoryMeta] = useState(assessmentHistory.meta);
    const [historyDetail, setHistoryDetail] =
        useState<AssessmentResponse | null>(null);
    const [comparisonAssessment, setComparisonAssessment] =
        useState<AssessmentResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [bootstrapping, setBootstrapping] = useState(true);
    const [loadingPrevious, setLoadingPrevious] = useState(false);
    const [loadingHistoryDetail, setLoadingHistoryDetail] = useState(false);
    const [loadingHistoryPage, setLoadingHistoryPage] = useState(false);
    const [loadingComparison, setLoadingComparison] = useState(false);
    const [activePresetKey, setActivePresetKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [resumeLabel, setResumeLabel] = useState<string | null>(
        claimNotice ??
        (initialAssessment
            ? mode === 'dashboard'
                ? 'Loaded from your latest dashboard assessment.'
                : 'Restored from your latest saved session.'
            : null),
    );

    useEffect(() => {
        let isCancelled = false;

        async function loadCriteria() {
            try {
                const response = await fetch(
                    getAssessmentUrl('/api/v1/criteria'),
                );
                const payload = (await response.json()) as ApiResponse<
                    Criterion[]
                >;

                if (isCancelled) {
                    return;
                }

                startTransition(() => {
                    setCriteria(payload.data);
                    setMatrix(buildMatrix(payload.data.length));
                    setBootstrapping(false);
                });
            } catch {
                if (!isCancelled) {
                    setError('Gagal memuat kriteria dari backend.');
                    setBootstrapping(false);
                }
            }
        }

        void loadCriteria();

        return () => {
            isCancelled = true;
        };
    }, []);

    useEffect(() => {
        setHistoryItems(assessmentHistory.data);
        setHistoryMeta(assessmentHistory.meta);
    }, [assessmentHistory]);

    useEffect(() => {
        if (typeof window === 'undefined' || !result) {
            return;
        }

        window.localStorage.setItem(storageKeys.id, String(result.id));
        window.localStorage.setItem(
            storageKeys.payload,
            JSON.stringify(result),
        );
    }, [result]);

    useEffect(() => {
        if (typeof window === 'undefined' || mode !== 'dashboard') {
            return;
        }

        const cachedId = window.localStorage.getItem(storageKeys.id);

        if (!cachedId) {
            return;
        }

        const alreadyOwned = historyItems.some(
            (historyItem) => historyItem.id === Number(cachedId),
        );

        if (alreadyOwned) {
            window.sessionStorage.removeItem(storageKeys.claimAttempt);

            return;
        }

        const attemptedClaim = window.sessionStorage.getItem(
            storageKeys.claimAttempt,
        );

        if (attemptedClaim === cachedId) {
            return;
        }

        window.sessionStorage.setItem(storageKeys.claimAttempt, cachedId);
        window.location.replace(`/dashboard?claim=${cachedId}`);
    }, [historyItems, mode]);

    useEffect(() => {
        if (typeof window === 'undefined' || initialAssessment) {
            return;
        }

        const cachedPayload = window.localStorage.getItem(storageKeys.payload);
        const cachedId = window.localStorage.getItem(storageKeys.id);

        if (cachedPayload) {
            try {
                const parsed = JSON.parse(cachedPayload) as AssessmentResponse;
                setResult(parsed);
                setStudentName(parsed.student_name ?? 'Alya Nirmala');
                setBehavioralProfile(hydrateBehavioralProfile(parsed));
                setResumeLabel('Restored from your latest saved session.');
            } catch {
                window.localStorage.removeItem(storageKeys.payload);
            }
        }

        if (!cachedId) {
            return;
        }

        let isCancelled = false;
        setLoadingPrevious(true);

        void fetch(getAssessmentUrl(`/api/v1/assessments/${cachedId}`))
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(
                        'Hasil assessment sebelumnya tidak ditemukan.',
                    );
                }

                return (await response.json()) as ApiResponse<AssessmentResponse>;
            })
            .then((payload) => {
                if (isCancelled) {
                    return;
                }

                setResult(payload.data);
                setStudentName(payload.data.student_name ?? 'Alya Nirmala');
                setBehavioralProfile(hydrateBehavioralProfile(payload.data));
                setResumeLabel('Synced from your latest saved session.');
            })
            .catch(() => {
                if (!isCancelled) {
                    window.localStorage.removeItem(storageKeys.id);
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setLoadingPrevious(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [initialAssessment]);

    const pairwisePairs = criteria.flatMap((left, rowIndex) =>
        criteria.slice(rowIndex + 1).map((right, offset) => {
            const columnIndex = rowIndex + offset + 1;
            const currentValue = matrix[rowIndex]?.[columnIndex] ?? 1;

            return {
                left,
                right,
                rowIndex,
                columnIndex,
                sliderValue:
                    currentValue >= 1
                        ? Math.round(currentValue) - 1
                        : -(Math.round(1 / currentValue) - 1),
            };
        }),
    );
    const liveAhpDiagnostics = calculateAhpDiagnostics(matrix);
    const livePairDiagnostics = pairwisePairs
        .map((pair) => {
            const leftWeight =
                liveAhpDiagnostics?.weights[pair.rowIndex] ?? 0.000001;
            const rightWeight =
                liveAhpDiagnostics?.weights[pair.columnIndex] ?? 0.000001;
            const expectedRatio = leftWeight / rightWeight;
            const actualRatio = matrix[pair.rowIndex]?.[pair.columnIndex] ?? 1;
            const deviation =
                Math.abs(Math.log(actualRatio / expectedRatio)) || 0;

            return {
                ...pair,
                deviation,
                expectedRatio,
            };
        })
        .sort((left, right) => right.deviation - left.deviation);
    const highlightedPairKeys = new Set(
        livePairDiagnostics
            .filter((pair) => pair.deviation > 0.25)
            .slice(0, 2)
            .map((pair) => `${pair.left.slug}-${pair.right.slug}`),
    );
    const liveWeightPreview = criteria.map((criterion, index) => ({
        label: criterion.name,
        slug: criterion.slug,
        weight: liveAhpDiagnostics?.weights[index] ?? 0,
    }));

    async function fetchAssessmentById(
        id: number,
    ): Promise<AssessmentResponse> {
        const response = await fetch(
            getAssessmentUrl(`/api/v1/assessments/${id}`),
        );

        if (!response.ok) {
            throw new Error('Assessment detail tidak bisa dimuat.');
        }

        const payload =
            (await response.json()) as ApiResponse<AssessmentResponse>;

        return payload.data;
    }

    async function loadHistoryPage(page: number) {
        if (mode !== 'dashboard') {
            return;
        }

        setLoadingHistoryPage(true);

        try {
            const response = await fetch(
                `/api/v1/assessment-history?page=${page}&per_page=${historyMeta.per_page}`,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Gagal memuat halaman histori berikutnya.');
            }

            const payload =
                (await response.json()) as AssessmentHistoryPaginated;

            setHistoryItems((currentItems) => {
                const existingIds = new Set(
                    currentItems.map((item) => item.id),
                );

                return [
                    ...currentItems,
                    ...payload.data.filter((item) => !existingIds.has(item.id)),
                ];
            });
            setHistoryMeta(payload.meta);
        } catch (historyError) {
            setError(
                historyError instanceof Error
                    ? historyError.message
                    : 'Gagal memuat histori.',
            );
        } finally {
            setLoadingHistoryPage(false);
        }
    }

    async function submitAssessment() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                getAssessmentUrl('/api/v1/assessments'),
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        student_name: studentName,
                        criterion_order: criteria.map(
                            (criterion) => criterion.slug,
                        ),
                        pairwise_matrix: matrix,
                        behavioral_profile: behavioralProfile,
                        psychometric_profile: {
                            riasec_answers: riasecAnswers,
                            grit_answers: gritAnswers,
                            logic_session: logicSession,
                        },
                    }),
                },
            );

            const payload =
                (await response.json()) as ApiResponse<AssessmentResponse> & {
                    errors?: Record<string, string[]>;
                    message?: string;
                };

            if (!response.ok) {
                const firstError = payload.errors
                    ? Object.values(payload.errors)[0]?.[0]
                    : payload.message;

                throw new Error(firstError ?? 'Assessment gagal diproses.');
            }

            startTransition(() => {
                setResult(payload.data);

                if (mode === 'dashboard') {
                    const nextHistoryItem = toHistoryItem(payload.data);

                    setHistoryItems((currentItems) => [
                        nextHistoryItem,
                        ...currentItems.filter(
                            (item) => item.id !== nextHistoryItem.id,
                        ),
                    ]);
                    setHistoryMeta((currentMeta) => ({
                        ...currentMeta,
                        total: currentMeta.total + 1,
                    }));
                }

                setHistoryDetail(null);
                setComparisonAssessment(null);
                setResumeLabel(
                    mode === 'dashboard'
                        ? 'Assessment terbaru tersimpan dan siap dilanjutkan.'
                        : 'Assessment guest tersimpan di browser ini.',
                );
            });
        } catch (submissionError) {
            setError(
                submissionError instanceof Error
                    ? submissionError.message
                    : 'Terjadi kesalahan tak terduga.',
            );
        } finally {
            setLoading(false);
        }
    }

    function updatePair(
        rowIndex: number,
        columnIndex: number,
        sliderValue: number,
    ) {
        const scale = sliderToScale(sliderValue);
        setActivePresetKey(null);

        setMatrix((currentMatrix) =>
            currentMatrix.map((row, currentRowIndex) =>
                row.map((cell, currentColumnIndex) => {
                    if (currentRowIndex === currentColumnIndex) {
                        return 1;
                    }

                    if (
                        currentRowIndex === rowIndex &&
                        currentColumnIndex === columnIndex
                    ) {
                        return scale;
                    }

                    if (
                        currentRowIndex === columnIndex &&
                        currentColumnIndex === rowIndex
                    ) {
                        return 1 / scale;
                    }

                    return cell;
                }),
            ),
        );
    }

    function applyPreset(presetKey: (typeof ahpPresets)[number]['key']) {
        if (criteria.length === 0) {
            return;
        }

        const preset = ahpPresets.find((item) => item.key === presetKey);

        if (!preset) {
            return;
        }

        const criterionOrder = criteria.map((criterion) => criterion.slug);

        setMatrix(buildPresetMatrix(criterionOrder, preset.weights));
        setActivePresetKey(preset.key);
        setError(null);
        setResumeLabel(
            `Preset ${preset.label} diterapkan. Kamu masih bisa fine-tune slider secara manual.`,
        );
    }

    async function handleHistoryOpen(id: number) {
        if (result?.id === id) {
            setHistoryDetail(result);

            return;
        }

        setLoadingHistoryDetail(true);

        try {
            const payload = await fetchAssessmentById(id);
            setHistoryDetail(payload);
        } catch (detailError) {
            setError(
                detailError instanceof Error
                    ? detailError.message
                    : 'Gagal membuka detail histori.',
            );
        } finally {
            setLoadingHistoryDetail(false);
        }
    }

    async function handleHistoryCompare(id: number) {
        if (result?.id === id) {
            setComparisonAssessment(result);

            return;
        }

        setLoadingComparison(true);

        try {
            const payload = await fetchAssessmentById(id);
            setComparisonAssessment(payload);
        } catch (detailError) {
            setError(
                detailError instanceof Error
                    ? detailError.message
                    : 'Gagal memuat sesi pembanding.',
            );
        } finally {
            setLoadingComparison(false);
        }
    }

    function handleHistoryPrint(id: number) {
        window.location.href = `/dashboard/${id}/export-pdf`;
    }

    function handleDownloadPdf(
        targetAssessment: AssessmentResponse | null,
        compareToAssessment: AssessmentResponse | null = null,
    ) {
        if (!targetAssessment?.id) return;

        const params = new URLSearchParams();
        if (compareToAssessment?.id) {
            params.set('compare_to', String(compareToAssessment.id));
        }

        const queryString = params.toString() ? `?${params.toString()}` : '';
        window.location.href = `/dashboard/${targetAssessment.id}/export-pdf${queryString}`;
    }

    const topRecommendation = result?.recommendations[0] ?? null;
    const confidence = getAssessmentConfidence(result);
    const detailAssessment = historyDetail ?? result;
    const explainabilityRecommendation =
        detailAssessment?.recommendations[0] ?? null;

    const criterionLookup = Object.fromEntries(
        criteria.map((criterion) => [criterion.slug, criterion.name]),
    );

    const explainabilityItems =
        detailAssessment && explainabilityRecommendation
            ? (() => {
                const weightedScores =
                    explainabilityRecommendation.meta?.weighted_scores ?? {};
                const totalWeightedScore = Object.values(
                    weightedScores,
                ).reduce((sum, currentValue) => sum + currentValue, 0);

                return detailAssessment.criterion_order
                    .map((slug) => {
                        const weightedScore = weightedScores[slug] ?? 0;
                        const weight =
                            detailAssessment.criterion_weights[slug] ?? 0;
                        const contribution =
                            totalWeightedScore > 0
                                ? (weightedScore / totalWeightedScore) * 100
                                : 0;

                        return {
                            slug,
                            label: criterionLookup[slug] ?? slug,
                            weightedScore,
                            weight,
                            contribution,
                        };
                    })
                    .sort(
                        (left, right) =>
                            right.contribution - left.contribution,
                    );
            })()
            : [];

    const whyThisMajor =
        detailAssessment && explainabilityRecommendation
            ? (() => {
                const dominantCriteria = explainabilityItems.slice(0, 3);
                const narratives = dominantCriteria.map(
                    (item) =>
                        `${item.label} menyumbang ${item.contribution.toFixed(1)}% dari kekuatan alternatif ini dengan bobot AHP ${formatPercent(item.weight)}.`,
                );

                if (explainabilityRecommendation.behavioral_score >= 0.8) {
                    narratives.push(
                        `Profil perilaku siswa juga selaras kuat dengan jurusan ini pada level ${formatPercent(explainabilityRecommendation.behavioral_score)}.`,
                    );
                }

                narratives.push(
                    `Nilai preferensi TOPSIS ${formatPercent(explainabilityRecommendation.topsis_score)} menempatkan jurusan ini paling dekat ke solusi ideal.`,
                );

                return narratives;
            })()
            : [];

    const criteriaComparisonRows =
        detailAssessment && comparisonAssessment
            ? detailAssessment.criterion_order.map((slug) => ({
                delta:
                    (detailAssessment.criterion_weights[slug] ?? 0) -
                    (comparisonAssessment.criterion_weights[slug] ?? 0),
                label: criterionLookup[slug] ?? slug,
                currentWeight: detailAssessment.criterion_weights[slug] ?? 0,
                compareWeight:
                    comparisonAssessment.criterion_weights[slug] ?? 0,
            }))
            : [];

    const rankingComparisonRows =
        detailAssessment && comparisonAssessment
            ? Array.from({ length: 5 }, (_, index) => {
                const current =
                    detailAssessment.recommendations[index] ?? null;
                const compare =
                    comparisonAssessment.recommendations[index] ?? null;
                const currentRankByCompareMajor = compare
                    ? (detailAssessment.recommendations.find(
                        (recommendation) =>
                            recommendation.major.slug ===
                            compare.major.slug,
                    )?.rank ?? null)
                    : null;
                const compareRankByCurrentMajor = current
                    ? (comparisonAssessment.recommendations.find(
                        (recommendation) =>
                            recommendation.major.slug ===
                            current.major.slug,
                    )?.rank ?? null)
                    : null;

                return {
                    compare,
                    compareRankByCurrentMajor,
                    current,
                    currentRankByCompareMajor,
                    rank: index + 1,
                };
            })
            : [];

    const shellClassName =
        mode === 'public'
            ? 'flex w-full flex-col gap-8 px-4 py-6 lg:px-6 lg:py-8'
            : 'flex w-full flex-col gap-8 px-4 py-6 lg:px-6 lg:py-8';
    const isAssessmentView = view === 'assessment';
    const isDashboardView = view === 'dashboard';

    return (
        <div className={shellClassName}>
            <section className="grid items-start gap-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_32px_120px_rgba(0,0,0,0.35)] backdrop-blur lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] xl:p-8">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs tracking-[0.32em] text-slate-300 uppercase">
                        <Sparkles className="h-3.5 w-3.5 text-[#ff2d20]" />
                        {isAssessmentView
                            ? mode === 'public'
                                ? 'Public Assessment Flow'
                                : 'Assessment Entry'
                            : 'Intelligent DSS Workspace'}
                    </div>
                    <div className="space-y-4">
                        <h1
                            className="max-w-3xl text-4xl leading-none font-semibold tracking-[-0.05em] md:text-6xl"
                            style={{
                                fontFamily: '"Space Grotesk", var(--font-sans)',
                            }}
                        >
                            {isAssessmentView
                                ? 'Build Your Decision Model.'
                                : 'Review the Decision Intelligence.'}
                        </h1>
                        <p className="max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
                            {isAssessmentView
                                ? 'Kalibrasi preferensi, hitung consistency ratio, lalu proses assessment baru berbasis AHP, TOPSIS, dan behavioral scoring.'
                                : 'Dashboard ini difokuskan untuk membaca hasil, meninjau histori, membandingkan sesi, dan memahami alasan keputusan.'}
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="rounded-[26px] border-white/10 bg-[#000000]/92 py-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                            <CardContent className="px-5 py-5">
                                <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                                    Criteria
                                </div>
                                <div className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                                    {criteria.length || '--'}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-[26px] border-white/10 bg-[#000000]/92 py-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                            <CardContent className="px-5 py-5">
                                <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                                    Consistency
                                </div>
                                <div className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                                    {result
                                        ? result.consistency_ratio.toFixed(4)
                                        : '0.1000'}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-[26px] border-white/10 bg-[#000000]/92 py-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                            <CardContent className="px-5 py-5">
                                <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                                    Confidence
                                </div>
                                <div className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                                    {topRecommendation
                                        ? `${confidence.toFixed(1)}%`
                                        : '--'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {resumeLabel ? (
                        <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-3 text-sm text-slate-400">
                            {loadingPrevious
                                ? 'Syncing previous assessment...'
                                : resumeLabel}
                        </div>
                    ) : null}

                    {isAssessmentView && mode === 'public' && result && !auth.user ? (
                        <div className="rounded-[24px] border border-[#ff2d20]/20 bg-[#ff2d20]/8 p-5">
                            <div className="mb-2 text-xs tracking-[0.28em] text-[#ffb4ae] uppercase">
                                Claim This Session
                            </div>
                            <div className="max-w-xl text-sm leading-7 text-slate-200">
                                Login atau buat akun, lalu dashboard akan
                                otomatis mengklaim hasil guest ini ke akunmu.
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Link
                                    href={login()}
                                    className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/90 px-5 text-sm font-medium text-black transition hover:bg-white"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Login & Claim
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-flex h-11 items-center gap-2 rounded-full border border-[#ff2d20]/40 bg-[#ff2d20] px-5 text-sm font-medium text-black transition hover:bg-[#ff584d]"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Register & Claim
                                </Link>
                            </div>
                        </div>
                    ) : null}

                    {isAssessmentView && mode === 'public' && result && auth.user ? (
                        <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/8 p-5">
                            <div className="mb-2 text-xs tracking-[0.28em] text-emerald-200 uppercase">
                                Synced Session
                            </div>
                            <div className="max-w-xl text-sm leading-7 text-slate-200">
                                Kamu sudah login sebagai {auth.user.name}. Hasil
                                assessment public ini otomatis tersimpan ke akun
                                dan bisa langsung dibuka dari dashboard.
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-11 items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-300 px-5 text-sm font-medium text-black transition hover:bg-emerald-200"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Open Dashboard
                                </Link>
                            </div>
                        </div>
                    ) : null}
                </div>

                {isAssessmentView ? (
                    <Card className="overflow-hidden rounded-[30px] border-white/10 bg-[#000000]/96 py-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_80px_rgba(0,0,0,0.28)] xl:sticky xl:top-6">
                        <CardContent className="px-0 py-0">
                            <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3">
                                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                                <span className="ml-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                    live_matrix.engine
                                </span>
                            </div>
                            <div className="grid gap-5 p-5 font-mono text-sm">
                                <div className="text-slate-500">
                                    Pairwise matrix preview
                                </div>
                                <div className="grid gap-3">
                                    {matrix.map((row, index) => (
                                        <div
                                            key={`matrix-${index}`}
                                            className="grid grid-cols-4 gap-2"
                                        >
                                            {row.map((cell, cellIndex) => (
                                                <div
                                                    key={`cell-${index}-${cellIndex}`}
                                                    className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-center text-slate-200"
                                                >
                                                    {cell.toFixed(3)}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div className="rounded-2xl border border-[#ff2d20]/20 bg-[#ff2d20]/8 px-4 py-3 text-xs leading-6 text-slate-300">
                                    Status:{' '}
                                    {bootstrapping
                                        ? 'loading criteria...'
                                        : 'matrix synchronized'}
                                    . Reciprocal entries diperbarui otomatis
                                    saat slider digeser.
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="rounded-[30px] border-white/10 bg-[#000000]/94 py-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)] xl:sticky xl:top-6">
                        <CardContent className="grid gap-4 px-5 py-5">
                            <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                                Workspace actions
                            </div>
                            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                                <div className="text-sm text-slate-500">
                                    Latest recommendation
                                </div>
                                <div className="mt-2 text-2xl font-semibold text-white">
                                    {topRecommendation?.major.name ?? 'Belum ada hasil'}
                                </div>
                                <div className="mt-2 text-sm text-slate-400">
                                    Confidence {confidence.toFixed(1)}% • CR{' '}
                                    {result?.consistency_ratio.toFixed(4) ?? '0.0000'}
                                </div>
                            </div>
                            <Link
                                href={assessmentRoute()}
                                className="inline-flex h-11 items-center justify-center rounded-full border border-[#ff2d20]/40 bg-[#ff2d20] px-5 text-sm font-medium text-black transition hover:bg-[#ff584d]"
                            >
                                Create new assessment
                            </Link>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <Link
                                    href="/scenario-lab"
                                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.06]"
                                >
                                    Scenario Lab
                                </Link>
                                <Link
                                    href="/comparison"
                                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.06]"
                                >
                                    Comparison
                                </Link>
                                <Link
                                    href="/insights"
                                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.06]"
                                >
                                    Insights
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </section>

            {isAssessmentView ? (
            <section className="grid gap-6">
                <AssessmentWizard
                    studentName={studentName}
                    onStudentNameChange={setStudentName}
                    behavioralProfile={behavioralProfile}
                    onBehavioralProfileChange={(p) => setBehavioralProfile(p)}
                    criterionOrder={criteria.map((c) => c.slug)}
                    weights={Object.fromEntries(liveWeightPreview.map((w) => [w.slug, w.weight]))}
                    consistencyRatio={liveAhpDiagnostics?.consistencyRatio ?? 0}
                    isConsistent={liveAhpDiagnostics?.isConsistent ?? false}
                    loading={loading}
                    onSubmit={() => void submitAssessment()}
                    riasecAnswers={riasecAnswers}
                    onRiasecAnswersChange={setRiasecAnswers}
                    gritAnswers={gritAnswers}
                    onGritAnswersChange={setGritAnswers}
                    logicSession={logicSession}
                    onLogicSessionChange={setLogicSession}
                    ahpContent={
                        <Card className="rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                            <CardContent className="grid gap-6 px-6 py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs tracking-[0.3em] text-slate-500 uppercase">
                                            AHP Pairwise Comparison
                                        </div>
                                        <h2
                                            className="mt-2 text-2xl font-semibold tracking-[-0.04em]"
                                            style={{
                                                fontFamily:
                                                    '"Space Grotesk", var(--font-sans)',
                                            }}
                                        >
                                            Kalibrasi prioritas kriteria
                                        </h2>
                                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                                            Bandingkan setiap pasangan kriteria menggunakan skala Saaty (1-9). Slider ke kiri = kriteria kiri lebih penting, ke kanan = kriteria kanan lebih penting.
                                        </p>
                                    </div>
                                    <Target className="h-5 w-5 text-[#ff2d20]" />
                                </div>

                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-xs tracking-[0.24em] text-slate-500 uppercase">
                                                AHP presets
                                            </div>
                                            <div className="mt-1 text-sm text-slate-400">
                                                Mulai dari matriks yang sudah konsisten,
                                                lalu sesuaikan jika perlu.
                                            </div>
                                        </div>
                                        {activePresetKey ? (
                                            <div className="rounded-full border border-[#ff2d20]/25 bg-[#ff2d20]/10 px-3 py-1 text-xs text-[#ffb4ae]">
                                                Active preset
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                                        {ahpPresets.map((preset) => {
                                            const isActive =
                                                activePresetKey === preset.key;

                                            return (
                                                <button
                                                    key={preset.key}
                                                    type="button"
                                                    onClick={() =>
                                                        applyPreset(preset.key)
                                                    }
                                                    className={`min-w-0 rounded-[22px] border px-4 py-4 text-left transition ${isActive
                                                        ? 'border-[#ff2d20]/45 bg-[#ff2d20]/10 shadow-[0_18px_50px_rgba(255,45,32,0.12)]'
                                                        : 'border-white/8 bg-[#000000] hover:border-[#ff2d20]/35 hover:bg-white/[0.03]'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="text-base font-medium text-white">
                                                            {preset.label}
                                                        </span>
                                                        {isActive ? (
                                                            <span className="shrink-0 text-[10px] tracking-[0.24em] text-[#ffb4ae] uppercase">
                                                                Applied
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                                        {preset.description}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                                    <div
                                        className={`rounded-[24px] border p-5 ${liveAhpDiagnostics?.isConsistent
                                            ? 'border-emerald-500/20 bg-emerald-500/5'
                                            : 'border-amber-500/20 bg-amber-500/5'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <div className="text-xs tracking-[0.24em] text-slate-500 uppercase">
                                                    Live consistency
                                                </div>
                                                <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                                                    {liveAhpDiagnostics
                                                        ? liveAhpDiagnostics.consistencyRatio.toFixed(
                                                            4,
                                                        )
                                                        : '0.0000'}
                                                </div>
                                            </div>
                                            <div
                                                className={`rounded-full px-3 py-1 text-xs tracking-[0.24em] uppercase ${liveAhpDiagnostics?.isConsistent
                                                    ? 'border border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                                                    : 'border border-amber-400/25 bg-amber-400/10 text-amber-200'
                                                    }`}
                                            >
                                                {liveAhpDiagnostics?.isConsistent
                                                    ? 'CR-safe'
                                                    : 'Needs tuning'}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-300">
                                            {liveAhpDiagnostics?.isConsistent
                                                ? 'Preferensi antar kriteria sudah cukup konsisten untuk diproses backend.'
                                                : 'Masih ada konflik antar pair. Fokuskan tuning ke kartu yang disorot agar CR turun ke bawah 0.1.'}
                                        </p>
                                        {livePairDiagnostics.length > 0 &&
                                            !liveAhpDiagnostics?.isConsistent ? (
                                            <div className="mt-4 grid gap-2">
                                                {livePairDiagnostics
                                                    .slice(0, 2)
                                                    .map((pair) => (
                                                        <div
                                                            key={`${pair.left.slug}-${pair.right.slug}-hint`}
                                                            className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-3 text-sm text-slate-300"
                                                        >
                                                            Tune{' '}
                                                            <span className="font-medium text-white">
                                                                {pair.left.name} vs{' '}
                                                                {pair.right.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="rounded-[24px] border border-white/8 bg-[#000000] p-5">
                                        <div className="text-xs tracking-[0.24em] text-slate-500 uppercase">
                                            Live weight preview
                                        </div>
                                        <div className="mt-4 grid gap-3">
                                            {liveWeightPreview.map((item) => (
                                                <div key={item.slug}>
                                                    <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                                                        <span>{item.label}</span>
                                                        <span className="font-mono text-xs text-slate-500">
                                                            {formatPercent(item.weight)}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-[#ff2d20] via-[#ff6b5d] to-white/80"
                                                            style={{
                                                                width: `${Math.max(item.weight * 100, 4)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4">
                                    {pairwisePairs.map((pair) => (
                                        <div
                                            key={`${pair.left.slug}-${pair.right.slug}`}
                                            className={`rounded-[24px] border bg-[#000000] p-5 transition ${highlightedPairKeys.has(
                                                `${pair.left.slug}-${pair.right.slug}`,
                                            )
                                                ? 'border-amber-400/40 shadow-[0_0_0_1px_rgba(251,191,36,0.12)]'
                                                : 'border-white/8 hover:border-[#ff2d20]/40'
                                                }`}
                                        >
                                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                                <div>
                                                    <div className="text-xs tracking-[0.24em] text-slate-500 uppercase">
                                                        Pairwise comparison
                                                    </div>
                                                    <div className="mt-1 text-lg font-medium tracking-[-0.03em]">
                                                        {pair.left.name} vs{' '}
                                                        {pair.right.name}
                                                    </div>
                                                </div>
                                                <div className="rounded-full border border-[#ff2d20]/25 bg-[#ff2d20]/10 px-3 py-1 text-xs text-[#ffb4ae]">
                                                    {scaleToCopy(
                                                        pair.sliderValue,
                                                        pair.left.name,
                                                        pair.right.name,
                                                    )}
                                                </div>
                                            </div>

                                            {highlightedPairKeys.has(
                                                `${pair.left.slug}-${pair.right.slug}`,
                                            ) && !liveAhpDiagnostics?.isConsistent ? (
                                                <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs leading-6 text-amber-100">
                                                    Pair ini paling berkontribusi pada
                                                    inkonsistensi saat ini. Geser lebih
                                                    dekat ke pola prioritas global.
                                                </div>
                                            ) : null}

                                            <div className="grid items-center gap-4 md:grid-cols-[1fr_minmax(180px,2fr)_1fr]">
                                                <div className="text-sm text-slate-400">
                                                    {pair.left.name}
                                                </div>
                                                <input
                                                    type="range"
                                                    min={-8}
                                                    max={8}
                                                    step={1}
                                                    value={pair.sliderValue}
                                                    onChange={(event) =>
                                                        updatePair(
                                                            pair.rowIndex,
                                                            pair.columnIndex,
                                                            Number(event.target.value),
                                                        )
                                                    }
                                                    className="w-full accent-[#ff2d20]"
                                                />
                                                <div className="text-right text-sm text-slate-400">
                                                    {pair.right.name}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {error ? (
                                    <div className="rounded-2xl border border-[#ff2d20]/25 bg-[#ff2d20]/10 px-4 py-3 text-sm text-[#ffc3be]">
                                        {error}
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    }>
                </AssessmentWizard>

                <Card className="rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <CardContent className="grid items-stretch gap-5 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(180px,220px)_minmax(0,1fr)]">
                        <div className="flex h-full flex-col justify-between space-y-4 rounded-[28px] border border-white/8 bg-[#000000]/78 p-5">
                            <div className="text-xs tracking-[0.3em] text-slate-500 uppercase">
                                Top Recommended Major
                            </div>
                            <div
                                className="text-[clamp(1.6rem,2.2vw,2.8rem)] font-semibold tracking-[-0.06em] text-white"
                                style={{
                                    fontFamily:
                                        '"Space Grotesk", var(--font-sans)',
                                }}
                            >
                                {topRecommendation?.major.name ??
                                    'Belum ada hasil'}
                            </div>
                            <div className="text-sm leading-7 text-slate-400">
                                {topRecommendation
                                    ? `Skor akhir dihitung dari TOPSIS ${formatPercent(topRecommendation.topsis_score)} dan behavioral fit ${formatPercent(topRecommendation.behavioral_score)}.`
                                    : 'Jalankan assessment untuk melihat jurusan yang paling selaras dengan preferensi dan profil akademik.'}
                            </div>
                        </div>

                        <div className="flex h-full flex-col items-center justify-center rounded-[28px] border border-white/8 bg-[#000000]/78 p-5">
                            <ProgressRing value={confidence} />
                            <div className="mt-4 grid w-full gap-3 text-sm">
                                <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-3">
                                    <div className="text-slate-500">
                                        Consistency ratio
                                    </div>
                                    <div className="mt-1 font-mono text-lg text-white">
                                        {result
                                            ? result.consistency_ratio.toFixed(
                                                4,
                                            )
                                            : '0.0000'}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-3">
                                    <div className="text-slate-500">
                                        Rank coverage
                                    </div>
                                    <div className="mt-1 font-mono text-lg text-white">
                                        {result?.recommendations
                                            .length ?? 0}{' '}
                                        majors
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-white/8 bg-[#000000]/88 p-5">
                            <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
                                <Radar className="h-4 w-4 text-[#ff2d20]" />
                                Behavioral & academic profile match
                            </div>
                            <RadarProfile
                                studentProfile={behavioralProfile}
                                recommendation={topRecommendation}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <CardContent className="px-6 py-6">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <div className="text-xs tracking-[0.3em] text-slate-500 uppercase">
                                    Ranking Table
                                </div>
                                <h3
                                    className="mt-2 text-2xl font-semibold tracking-[-0.04em]"
                                    style={{
                                        fontFamily:
                                            '"Space Grotesk", var(--font-sans)',
                                    }}
                                >
                                    Top 5 major candidates
                                </h3>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[24px] border border-white/8">
                            <table className="min-w-full border-collapse text-left text-sm">
                                <thead className="bg-white/[0.03] text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Rank
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Major
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            TOPSIS
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Behavioral
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Final
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(result?.recommendations ?? []).map(
                                        (recommendation) => (
                                            <tr
                                                key={
                                                    recommendation.major
                                                        .slug
                                                }
                                                className="border-t border-white/8 transition hover:bg-[#111111]"
                                            >
                                                <td className="px-4 py-4 text-slate-400">
                                                    #{recommendation.rank}
                                                </td>
                                                <td className="px-4 py-4 font-medium text-white">
                                                    {
                                                        recommendation.major
                                                            .name
                                                    }
                                                </td>
                                                <td className="px-4 py-4 font-mono text-slate-300">
                                                    {formatPercent(
                                                        recommendation.topsis_score,
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 font-mono text-slate-300">
                                                    {formatPercent(
                                                        recommendation.behavioral_score,
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 font-mono text-[#ff8a80]">
                                                    {formatPercent(
                                                        recommendation.final_score,
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                    {!result ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-10 text-center text-slate-500"
                                            >
                                                Belum ada hasil ranking.
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
                {result ? (
                    <Card className="rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                        <CardContent className="grid gap-4 px-6 py-6 md:grid-cols-3">
                            <div className="rounded-[24px] border border-white/8 bg-[#000000]/80 p-5 md:col-span-2">
                                <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                                    Submission result
                                </div>
                                <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                                    {topRecommendation?.major.name ?? 'Belum ada hasil'}
                                </div>
                                <div className="mt-3 text-sm leading-7 text-slate-400">
                                    Assessment berhasil diproses. Dashboard digunakan untuk membaca ranking lengkap, histori, explainability, dan comparison.
                                </div>
                            </div>
                            <div className="rounded-[24px] border border-white/8 bg-[#000000]/80 p-5">
                                <div className="text-sm text-slate-500">
                                    Confidence
                                </div>
                                <div className="mt-2 text-3xl font-semibold text-white">
                                    {confidence.toFixed(1)}%
                                </div>
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full border border-[#ff2d20]/40 bg-[#ff2d20] px-5 text-sm font-medium text-black transition hover:bg-[#ff584d]"
                                >
                                    {auth.user ? 'Open dashboard analytics' : 'Login for dashboard'}
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : null}
            </section>
            ) : null}

            {isDashboardView ? (
            <>
            <style>
                {`
                @keyframes fade-up-result {
                    0% { opacity: 0; transform: translateY(30px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-result-fade-up {
                    animation: fade-up-result 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                `}
            </style>

            {/* Section 1: Executive Summary */}
            <section className="grid gap-6">
                <ExecutiveSummaryCard
                    assessment={detailAssessment}
                    topRecommendation={topRecommendation}
                    confidence={confidence}
                />

                {/* Section 2: XAI Narrative */}
                <XaiNarrativePanel
                    assessment={detailAssessment}
                    topRecommendation={explainabilityRecommendation}
                    criterionLookup={criterionLookup}
                />

                {/* Section 3: Enhanced Rankings */}
                <EnhancedRankingsTable
                    recommendations={result?.recommendations ?? []}
                    formatPercent={formatPercent}
                />

                {/* Section 4: Gap Analysis */}
                <GapAnalysisPanel
                    topRecommendation={topRecommendation}
                />

                {/* Section 5 & 6: Algorithm Intelligence */}
                <div className="grid gap-6 xl:grid-cols-1">
                    <AlgorithmTransparencyPanel
                        assessment={detailAssessment}
                        topRecommendation={topRecommendation}
                    />
                    <AlgorithmComparisonTable
                        assessment={detailAssessment}
                        formatPercent={formatPercent}
                    />
                </div>

                {/* Section 7: Sensitivity Simulator */}
                <SensitivitySimulator
                    recommendations={result?.recommendations ?? []}
                    studentProfile={behavioralProfile}
                />

                {/* Section 8: Action Plan */}
                <ActionPlanPanel
                    topRecommendation={topRecommendation}
                    onExportPdf={() => void handleDownloadPdf(detailAssessment)}
                    onNewAssessment={() => {
                        window.location.href = String(assessmentRoute());
                    }}
                />
            </section>

            {/* History */}
            <section className="grid items-start gap-6">
                <AssessmentHistoryPanel
                    historyItems={historyItems}
                    historyMeta={historyMeta}
                    loadingHistoryDetail={loadingHistoryDetail}
                    loadingHistoryPage={loadingHistoryPage}
                    onOpen={(id) => void handleHistoryOpen(id)}
                    onCompare={(id) => void handleHistoryCompare(id)}
                    onPrint={(id) => void handleHistoryPrint(id)}
                    onLoadMore={() =>
                        void loadHistoryPage(historyMeta.current_page + 1)
                    }
                    formatSessionTime={formatSessionTime}
                />
            </section>


            </>
            ) : null}
        </div>
    );
}
