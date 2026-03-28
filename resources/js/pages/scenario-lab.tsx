import { Head, router } from '@inertiajs/react';
import ScenarioHeader3D from '@/components/scenario-lab/scenario-header-3d';
import {
    FilePenLine,
    FlaskConical,
    GitCompareArrows,
    LoaderCircle,
    Radar,
    Save,
    Sparkles,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type {
    AssessmentHistoryPaginated,
    AssessmentResponse,
    BreadcrumbItem,
} from '@/types';
import { ParameterAdjustmentPanel, type ScenarioAdjustments, type UncertaintyFactors } from '@/components/scenario-lab/parameter-adjustment-panel';
import { SensitivityHeatmap } from '@/components/scenario-lab/sensitivity-heatmap';
import { ScenarioComparison } from '@/components/scenario-lab/scenario-comparison';
import { MonteCarloVisualization } from '@/components/scenario-lab/monte-carlo-visualization';


type ScenarioLabProps = {
    assessmentHistory?: AssessmentHistoryPaginated;
    initialAssessment?: AssessmentResponse | null;
    scenarios?: AssessmentResponse[];
};

type MajorOption = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    criteria_scores: Record<string, number>;
    behavioral_profile: Record<string, number> | null;
};

type PreviewRecommendation = {
    rank: number;
    major: {
        id: number;
        name: string;
        slug: string;
    };
    topsis_score: number;
    behavioral_score: number;
    final_score: number;
};

type AssessmentApiPayload = {
    data?: AssessmentResponse;
    errors?: Record<string, string[]>;
    message?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Scenario Lab', href: '/scenario-lab' },
];

const scenarioTemplates = [
    {
        key: 'balanced-review',
        title: 'Balanced Review',
        description:
            'Menyeimbangkan ulang bobot agar keputusan lebih stabil dan tidak terlalu sensitif pada satu kriteria dominan.',
        label: 'Balanced Review',
        points: {
            kemampuan_analitis: 26,
            kesiapan_akademik: 18,
            minat_pribadi: 32,
            prospek_karier: 24,
        },
    },
    {
        key: 'career-first',
        title: 'Career-first Stress Test',
        description:
            'Menguji apakah perubahan fokus ke prospek karier menggeser alternatif terbaik secara signifikan.',
        label: 'Career-first Stress Test',
        points: {
            kemampuan_analitis: 22,
            kesiapan_akademik: 13,
            minat_pribadi: 24,
            prospek_karier: 41,
        },
    },
    {
        key: 'academic-safety',
        title: 'Academic Safety Check',
        description:
            'Memvalidasi apakah alternatif top tetap kuat ketika kesiapan akademik dinaikkan sebagai faktor utama.',
        label: 'Academic Safety Check',
        points: {
            kemampuan_analitis: 30,
            kesiapan_akademik: 34,
            minat_pribadi: 21,
            prospek_karier: 15,
        },
    },
] as const;

function formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

function getAssessmentFromPayload(payload: AssessmentApiPayload): AssessmentResponse | null {
    return payload.data ?? null;
}

function normalizePoints(
    points: Record<string, number>,
    criterionOrder: string[],
): Record<string, number> {
    const safePoints = Object.fromEntries(
        criterionOrder.map((slug) => [slug, Math.max(1, points[slug] ?? 1)]),
    );
    const total = Object.values(safePoints).reduce((sum, value) => sum + value, 0);

    return Object.fromEntries(
        criterionOrder.map((slug) => [slug, (safePoints[slug] ?? 0) / total]),
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

function calculateBehavioralScore(
    studentProfile: Record<string, number>,
    majorProfile: Record<string, number> | null | undefined,
) {
    if (!majorProfile) {
        return 0.5;
    }

    const dimensions = Object.keys(studentProfile).filter(
        (key) => key in majorProfile,
    );

    if (dimensions.length === 0) {
        return 0.5;
    }

    return (
        dimensions.reduce((sum, dimension) => {
            const distance = Math.abs(
                (studentProfile[dimension] ?? 0) - (majorProfile[dimension] ?? 0),
            );

            return sum + Math.max(0, 1 - distance / 100);
        }, 0) / dimensions.length
    );
}

function rankScenario(
    majors: MajorOption[],
    criterionOrder: string[],
    weightsBySlug: Record<string, number>,
    behavioralProfile: Record<string, number>,
): PreviewRecommendation[] {
    if (majors.length === 0 || criterionOrder.length === 0) {
        return [];
    }

    const denominatorBySlug = Object.fromEntries(
        criterionOrder.map((slug) => [
            slug,
            Math.sqrt(
                majors.reduce((sum, major) => {
                    const value = major.criteria_scores[slug] ?? 0;

                    return sum + value * value;
                }, 0),
            ) || 1,
        ]),
    );

    const weightedScoresByMajor = majors.map((major) => ({
        major,
        weightedScores: Object.fromEntries(
            criterionOrder.map((slug) => {
                const normalized =
                    (major.criteria_scores[slug] ?? 0) /
                    (denominatorBySlug[slug] ?? 1);

                return [slug, normalized * (weightsBySlug[slug] ?? 0)];
            }),
        ),
    }));

    const idealPositive = Object.fromEntries(
        criterionOrder.map((slug) => [
            slug,
            Math.max(
                ...weightedScoresByMajor.map(
                    (entry) => entry.weightedScores[slug] ?? 0,
                ),
            ),
        ]),
    );
    const idealNegative = Object.fromEntries(
        criterionOrder.map((slug) => [
            slug,
            Math.min(
                ...weightedScoresByMajor.map(
                    (entry) => entry.weightedScores[slug] ?? 0,
                ),
            ),
        ]),
    );

    return weightedScoresByMajor
        .map((entry) => {
            const distancePositive = Math.sqrt(
                criterionOrder.reduce((sum, slug) => {
                    const delta =
                        (entry.weightedScores[slug] ?? 0) -
                        (idealPositive[slug] ?? 0);

                    return sum + delta * delta;
                }, 0),
            );
            const distanceNegative = Math.sqrt(
                criterionOrder.reduce((sum, slug) => {
                    const delta =
                        (entry.weightedScores[slug] ?? 0) -
                        (idealNegative[slug] ?? 0);

                    return sum + delta * delta;
                }, 0),
            );
            const topsisScore =
                distancePositive + distanceNegative > 0
                    ? distanceNegative / (distancePositive + distanceNegative)
                    : 0;
            const behavioralScore = calculateBehavioralScore(
                behavioralProfile,
                entry.major.behavioral_profile,
            );
            const finalScore = topsisScore * 0.75 + behavioralScore * 0.25;

            return {
                major: {
                    id: entry.major.id,
                    name: entry.major.name,
                    slug: entry.major.slug,
                },
                topsis_score: topsisScore,
                behavioral_score: behavioralScore,
                final_score: finalScore,
            };
        })
        .sort((left, right) => right.final_score - left.final_score)
        .map((recommendation, index) => ({
            ...recommendation,
            rank: index + 1,
        }));
}

export default function ScenarioLab({
    assessmentHistory = {
        data: [],
        meta: { current_page: 1, last_page: 1, per_page: 5, total: 0 },
    },
    initialAssessment = null,
    scenarios = [],
}: ScenarioLabProps) {
    const [majors, setMajors] = useState<MajorOption[]>([]);
    const [scenarioList, setScenarioList] = useState<AssessmentResponse[]>(scenarios);
    const [loadingMajors, setLoadingMajors] = useState(false);
    const [creatingKey, setCreatingKey] = useState<string | null>(null);
    const [editingScenarioId, setEditingScenarioId] = useState<number | null>(
        scenarios[0]?.id ?? null,
    );
    const [savingScenarioId, setSavingScenarioId] = useState<number | null>(null);
    const [deletingScenarioId, setDeletingScenarioId] = useState<number | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [customScenarioLabel, setCustomScenarioLabel] = useState('Custom Scenario');
    const [customScenarioNotes, setCustomScenarioNotes] = useState(
        'Scenario kustom untuk menguji perubahan bobot prioritas dari baseline.',
    );
    const [customScenarioRationale, setCustomScenarioRationale] = useState(
        'Gunakan skenario ini untuk melihat apakah rekomendasi tetap stabil ketika prioritas diubah secara manual.',
    );
    const [customPoints, setCustomPoints] = useState<Record<string, number>>({});
    const [adjustments, setAdjustments] = useState<ScenarioAdjustments>({
        criteria_weights: {},
        psychometric: {
            grit: { total_score: 50 },
            logic: { score: 50 },
            riasec: { scores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 } },
        },
    });
    const [uncertaintyFactors, setUncertaintyFactors] = useState<UncertaintyFactors>({
        academics: 0.5,
        life_circumstances: 10,
        time: 0.5,
    });
    const [compareSelection, setCompareSelection] = useState<number[]>([]);

    const [scenarioDrafts, setScenarioDrafts] = useState<
        Record<number, { label: string; scenario_notes: string; decision_rationale: string }>
    >({});

    useEffect(() => {
        if (!initialAssessment) {
            setCustomPoints({});
            setAdjustments(prev => ({ ...prev, criteria_weights: {} }));
            return;
        }

        const initialWeights = Object.fromEntries(
            initialAssessment.criterion_order.map((slug) => [
                slug,
                Math.max(1, Math.round((initialAssessment.criterion_weights[slug] ?? 0) * 100)),
            ])
        );
        
        setCustomPoints(initialWeights);
        setAdjustments(prev => ({ ...prev, criteria_weights: initialWeights }));
    }, [initialAssessment]);

    useEffect(() => {
        setScenarioList(scenarios);
        setScenarioDrafts(
            Object.fromEntries(
                scenarios.map((scenario) => [
                    scenario.id,
                    {
                        label: scenario.label ?? `Scenario #${scenario.id}`,
                        scenario_notes: scenario.scenario_notes ?? '',
                        decision_rationale: scenario.decision_rationale ?? '',
                    },
                ]),
            ),
        );
        setEditingScenarioId((current) => current ?? scenarios[0]?.id ?? null);
    }, [scenarios]);

    useEffect(() => {
        let cancelled = false;

        async function loadMajors() {
            setLoadingMajors(true);

            try {
                const response = await fetch('/api/v1/majors', {
                    headers: { Accept: 'application/json' },
                });

                if (!response.ok) {
                    throw new Error('Gagal memuat alternatif jurusan.');
                }

                const payload = (await response.json()) as { data: MajorOption[] };

                if (!cancelled) {
                    startTransition(() => {
                        setMajors(payload.data);
                    });
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Gagal memuat alternatif jurusan.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingMajors(false);
                }
            }
        }

        void loadMajors();

        return () => {
            cancelled = true;
        };
    }, []);

    const criterionOrder = initialAssessment?.criterion_order ?? [];
    const normalizedDraftWeights = normalizePoints(adjustments.criteria_weights, criterionOrder);
    const [backendPreviewRecommendations, setBackendPreviewRecommendations] = useState<any[]>([]);
    const [calculatingPreview, setCalculatingPreview] = useState(false);

    useEffect(() => {
        if (!initialAssessment || majors.length === 0) return;
        
        const timeoutId = setTimeout(async () => {
            setCalculatingPreview(true);
            try {
                const response = await fetch('/api/v1/scenario-lab/recalculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({
                        assessment_id: initialAssessment.id,
                        adjustments: adjustments
                    })
                });
                if (response.ok) {
                    const payload = await response.json();
                    setBackendPreviewRecommendations(payload.data.scenario_recommendations.map((r: any, idx: number) => ({
                        ...r,
                        rank: idx + 1
                    })));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setCalculatingPreview(false);
            }
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [adjustments, initialAssessment, majors.length]);

    const previewRecommendations = backendPreviewRecommendations.length > 0 
        ? backendPreviewRecommendations 
        : (initialAssessment && majors.length > 0
            ? rankScenario(
                  majors,
                  criterionOrder,
                  normalizedDraftWeights,
                  initialAssessment.behavioral_profile,
              )
            : []);
        initialAssessment && majors.length > 0
            ? rankScenario(
                  majors,
                  criterionOrder,
                  normalizedDraftWeights,
                  initialAssessment.behavioral_profile,
              )
            : [];
    const previewTopRecommendation = previewRecommendations[0] ?? null;

    const selectedScenario = useMemo(
        () =>
            scenarioList.find((scenario) => scenario.id === editingScenarioId) ?? null,
        [editingScenarioId, scenarioList],
    );

    async function createScenario(
        label: string,
        weightsBySlug: Record<string, number>,
        key: string,
        scenarioNotes: string,
        decisionRationale: string,
    ) {
        if (!initialAssessment) {
            setError('Assessment baseline belum tersedia.');

            return;
        }

        if (criterionOrder.length === 0) {
            setError('Kriteria baseline belum tersedia.');

            return;
        }

        if (!label.trim()) {
            setError('Label scenario wajib diisi.');

            return;
        }

        setCreatingKey(key);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/v1/assessments', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_name: initialAssessment.student_name,
                    mode: 'scenario',
                    label: label.trim(),
                    parent_assessment_id: initialAssessment.id,
                    criterion_order: initialAssessment.criterion_order,
                    pairwise_matrix: buildPresetMatrix(
                        initialAssessment.criterion_order,
                        weightsBySlug,
                    ),
                    behavioral_profile: initialAssessment.behavioral_profile,
                    scenario_notes: scenarioNotes.trim() || null,
                    decision_rationale: decisionRationale.trim() || null,
                }),
            });

            const payload = (await response.json()) as AssessmentApiPayload;

            if (!response.ok) {
                throw new Error(
                    payload.errors
                        ? Object.values(payload.errors)[0]?.[0]
                        : payload.message ?? 'Gagal membuat skenario.',
                );
            }

            const createdScenario = getAssessmentFromPayload(payload);

            if (!createdScenario) {
                throw new Error('Respons scenario tidak valid.');
            }

            const nextScenarioList = [createdScenario, ...scenarioList];

            setScenarioList(nextScenarioList);
            setScenarioDrafts((current) => ({
                ...current,
                [createdScenario.id]: {
                    label: createdScenario.label ?? `Scenario #${createdScenario.id}`,
                    scenario_notes: createdScenario.scenario_notes ?? '',
                    decision_rationale: createdScenario.decision_rationale ?? '',
                },
            }));
            setEditingScenarioId(createdScenario.id);
            setSuccessMessage(
                `Scenario "${createdScenario.label ?? 'baru'}" berhasil disimpan.`,
            );

            router.reload({
                only: ['scenarios'],
            });
        } catch (scenarioError) {
            setError(
                scenarioError instanceof Error
                    ? scenarioError.message
                    : 'Gagal membuat skenario.',
            );
        } finally {
            setCreatingKey(null);
        }
    }

    async function saveScenarioMeta(id: number) {
        const draft = scenarioDrafts[id];

        if (!draft) {
            return;
        }

        setSavingScenarioId(id);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`/api/v1/assessments/${id}/scenario`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(draft),
            });

            const payload = (await response.json()) as AssessmentApiPayload;

            if (!response.ok) {
                throw new Error(
                    payload.errors
                        ? Object.values(payload.errors)[0]?.[0]
                        : payload.message ?? 'Gagal memperbarui skenario.',
                );
            }

            const updatedScenario = getAssessmentFromPayload(payload);

            if (!updatedScenario) {
                throw new Error('Respons scenario tidak valid.');
            }

            setScenarioList((current) =>
                current.map((scenario) =>
                    scenario.id === id ? updatedScenario : scenario,
                ),
            );
            setSuccessMessage('Perubahan scenario berhasil disimpan.');

            router.reload({ only: ['scenarios'] });
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : 'Gagal memperbarui skenario.',
            );
        } finally {
            setSavingScenarioId(null);
        }
    }

    async function deleteScenario(id: number) {
        setDeletingScenarioId(id);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`/api/v1/assessments/${id}/scenario`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus skenario.');
            }

            setScenarioList((current) =>
                current.filter((scenario) => scenario.id !== id),
            );
            setEditingScenarioId((current) => {
                if (current !== id) {
                    return current;
                }

                const fallback = scenarioList.find((scenario) => scenario.id !== id);

                return fallback?.id ?? null;
            });
            setSuccessMessage('Scenario berhasil dihapus.');

            router.reload({
                only: ['scenarios'],
                onSuccess: (page) => {
                    const freshScenarios =
                        (page.props.scenarios as AssessmentResponse[] | undefined) ?? [];
                    setEditingScenarioId(freshScenarios[0]?.id ?? null);
                },
            });
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Gagal menghapus skenario.',
            );
        } finally {
            setDeletingScenarioId(null);
        }
    }

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { el.classList.add('is-visible'); obs.disconnect(); }
        }, { threshold: 0.05 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scenario Lab" />

            <div ref={scrollRef} className="scroll-reveal-container space-y-6 bg-[#0b0e14] px-4 py-6 text-white lg:px-6">
                <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
                    <ScenarioHeader3D />
                    <div className="relative z-10 grid gap-6">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs tracking-[0.28em] text-slate-300 uppercase">
                            <FlaskConical className="h-3.5 w-3.5 text-[#ff2d20]" />
                            Decision Scenario Lab
                        </div>
                        <div className="grid gap-4">
                            <div className="max-w-xl">
                                <h1 className="text-4xl font-semibold tracking-[-0.05em]">
                                    Kelola, simulasikan, dan dokumentasikan skenario
                                    keputusan.
                                </h1>
                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    Scenario Lab sekarang menangani seluruh siklus
                                    skenario: membuat draft bobot, mem-preview
                                    ranking, menyimpan assessment turunan, memberi
                                    notes, menulis rationale keputusan, dan menghapus
                                    skenario yang tidak lagi relevan.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {error ? (
                    <div className="rounded-2xl border border-[#ff2d20]/25 bg-[#ff2d20]/10 px-4 py-3 text-sm text-[#ffc3be]">
                        {error}
                    </div>
                ) : null}
                {successMessage ? (
                    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {successMessage}
                    </div>
                ) : null}

                <section className="grid gap-6 lg:grid-cols-3">
                    {scenarioTemplates.map((scenario) => (
                        <Card
                            key={scenario.key}
                            className="h-full rounded-[28px] border-white/10 bg-[#000000]/82 py-0"
                        >
                            <CardContent className="flex h-full flex-col px-5 py-5">
                                <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                    <TrendingUp className="h-3.5 w-3.5 text-[#ff2d20]" />
                                    Scenario template
                                </div>
                                <div className="mt-4 text-xl font-semibold text-white">
                                    {scenario.title}
                                </div>
                                <p className="mt-4 flex-1 text-sm leading-7 text-slate-400">
                                    {scenario.description}
                                </p>
                                <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                                    <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                                        <span>Template action</span>
                                        <span className="truncate font-mono uppercase">
                                            {scenario.label}
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            void createScenario(
                                                scenario.label,
                                                normalizePoints(
                                                    scenario.points,
                                                    initialAssessment?.criterion_order ?? [],
                                                ),
                                                scenario.key,
                                                'Scenario template dari Scenario Lab untuk pengujian keputusan.',
                                                `Template ${scenario.title} dipakai untuk membaca perubahan ranking saat prioritas utama digeser.`,
                                            )
                                        }
                                        disabled={!initialAssessment || creatingKey !== null}
                                        className="mt-3 h-12 w-full rounded-2xl bg-[#ff2d20] text-black hover:bg-[#ff5549]"
                                    >
                                        {creatingKey === scenario.key ? (
                                            <>
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                Menyimpan template...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-4 w-4" />
                                                Save scenario template
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-5 px-5 py-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                                        Custom Scenario Builder
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold text-white">
                                        Rancang skenario kustom dari baseline.
                                    </div>
                                </div>
                                {loadingMajors ? (
                                    <div className="text-sm text-slate-500">
                                        Loading alternatives...
                                    </div>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scenario-label" className="text-slate-300">
                                    Scenario label
                                </Label>
                                <Input
                                    id="scenario-label"
                                    value={customScenarioLabel}
                                    onChange={(event) =>
                                        setCustomScenarioLabel(event.target.value)
                                    }
                                    className="h-11 border-white/10 bg-[#05070b] text-white placeholder:text-slate-500"
                                />
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">
                                        Scenario notes
                                    </Label>
                                    <textarea
                                        value={customScenarioNotes}
                                        onChange={(event) =>
                                            setCustomScenarioNotes(event.target.value)
                                        }
                                        className="min-h-28 w-full rounded-2xl border border-white/10 bg-[#05070b] px-4 py-3 text-sm text-white outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">
                                        Decision rationale
                                    </Label>
                                    <textarea
                                        value={customScenarioRationale}
                                        onChange={(event) =>
                                            setCustomScenarioRationale(event.target.value)
                                        }
                                        className="min-h-28 w-full rounded-2xl border border-white/10 bg-[#05070b] px-4 py-3 text-sm text-white outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <ParameterAdjustmentPanel
                                    adjustments={adjustments}
                                    setAdjustments={setAdjustments}
                                    criterionOrder={criterionOrder}
                                    uncertaintyFactors={uncertaintyFactors}
                                    setUncertaintyFactors={setUncertaintyFactors}
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={() =>
                                    void createScenario(
                                        customScenarioLabel.trim() || 'Custom Scenario',
                                        normalizePoints(customPoints, criterionOrder),
                                        'custom',
                                        customScenarioNotes,
                                        customScenarioRationale,
                                    )
                                }
                                disabled={!initialAssessment || creatingKey !== null}
                                className="h-12 w-full rounded-2xl bg-[#ff2d20] text-black hover:bg-[#ff5549]"
                            >
                                {creatingKey === 'custom' ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        Menyimpan custom scenario...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save custom scenario
                                    </>
                                )}
                            </Button>
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
                                Skenario kustom akan disimpan sebagai assessment turunan
                                dari baseline aktif, lengkap dengan notes dan rationale.
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-5 px-5 py-5">
                            <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <Radar className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Live preview engine
                            </div>

                            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                                <div className="rounded-[24px] border border-white/8 bg-[#05070b] p-5">
                                    <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                                        Preview top alternative
                                    </div>
                                    <div className="mt-3 text-3xl font-semibold text-white">
                                        {previewRecommendations[0]?.major.name ??
                                            'Belum ada preview'}
                                    </div>
                                    <div className="mt-3 text-sm leading-7 text-slate-400">
                                        {previewRecommendations[0]
                                            ? `TOPSIS ${formatPercent(previewRecommendations[0].topsis_score)} • behavioral ${formatPercent(previewRecommendations[0].behavioral_score)} • final ${formatPercent(previewRecommendations[0].final_score)}.`
                                            : 'Preview akan muncul setelah baseline dan alternatif jurusan berhasil dimuat.'}
                                    </div>
                                </div>
                                <div className="rounded-[24px] border border-white/8 bg-[#05070b] p-5">
                                    <div className="text-sm text-slate-500">
                                        Preview coverage
                                    </div>
                                    <div className="mt-2 text-3xl font-semibold text-white">
                                        {previewRecommendations.length}
                                    </div>
                                    <div className="mt-2 text-sm text-slate-400">
                                        alternatif aktif
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-[24px] border border-white/8">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-white/[0.03] text-slate-400">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Rank</th>
                                            <th className="px-4 py-3 font-medium">Major</th>
                                            <th className="px-4 py-3 font-medium">Final</th>
                                            <th className="px-4 py-3 font-medium">Baseline shift</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewRecommendations.slice(0, 5).map((item) => {
                                            const baselineRank =
                                                initialAssessment?.recommendations.find(
                                                    (recommendation) =>
                                                        recommendation.major.slug ===
                                                        item.major.slug,
                                                )?.rank ?? null;

                                            return (
                                                <tr
                                                    key={item.major.slug}
                                                    className="border-t border-white/8"
                                                >
                                                    <td className="px-4 py-3 text-slate-500">
                                                        #{item.rank}
                                                    </td>
                                                    <td className="px-4 py-3 text-white">
                                                        {item.major.name}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-slate-300">
                                                        {formatPercent(item.final_score)}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-300">
                                                        {baselineRank
                                                            ? `from #${baselineRank}`
                                                            : 'new / out'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-4 px-5 py-5">
                            <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                                Saved scenarios
                            </div>
                            {scenarioList.length === 0 ? (
                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-500">
                                    Belum ada skenario tersimpan untuk baseline
                                    assessment terbaru.
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {scenarioList.map((scenario) => (
                                        <button
                                            key={scenario.id}
                                            type="button"
                                            onClick={() => setEditingScenarioId(scenario.id)}
                                            className={`rounded-2xl border px-4 py-4 text-left transition ${
                                                editingScenarioId === scenario.id
                                                    ? 'border-[#ff2d20]/35 bg-[#ff2d20]/10'
                                                    : 'border-white/8 bg-white/[0.03] hover:bg-white/[0.06]'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {scenario.label ??
                                                            `Scenario #${scenario.id}`}
                                                    </div>
                                                    <div className="mt-1 text-sm text-slate-400">
                                                        {scenario.top_major?.name ??
                                                            'Belum ada hasil'}
                                                    </div>
                                                </div>
                                                <div className="rounded-full border border-[#ff2d20]/20 bg-[#ff2d20]/10 px-3 py-1 text-xs text-[#ffb4ae]">
                                                    {scenario.summary?.recommendation_confidence?.toFixed(
                                                        1,
                                                    ) ?? '0.0'}
                                                    %
                                                </div>
                                            </div>
                                            <div className="mt-3 text-sm text-slate-400">
                                                CR {scenario.consistency_ratio.toFixed(4)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                        <CardContent className="space-y-5 px-5 py-5">
                            <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                <FilePenLine className="h-3.5 w-3.5 text-[#ff2d20]" />
                                Scenario editor
                            </div>

                            {selectedScenario ? (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">
                                            Scenario label
                                        </Label>
                                        <Input
                                            value={
                                                scenarioDrafts[selectedScenario.id]?.label ?? ''
                                            }
                                            onChange={(event) =>
                                                setScenarioDrafts((current) => ({
                                                    ...current,
                                                    [selectedScenario.id]: {
                                                        ...current[selectedScenario.id],
                                                        label: event.target.value,
                                                    },
                                                }))
                                            }
                                            className="h-11 border-white/10 bg-[#05070b] text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">
                                            Scenario notes
                                        </Label>
                                        <textarea
                                            value={
                                                scenarioDrafts[selectedScenario.id]
                                                    ?.scenario_notes ?? ''
                                            }
                                            onChange={(event) =>
                                                setScenarioDrafts((current) => ({
                                                    ...current,
                                                    [selectedScenario.id]: {
                                                        ...current[selectedScenario.id],
                                                        scenario_notes:
                                                            event.target.value,
                                                    },
                                                }))
                                            }
                                            className="min-h-28 w-full rounded-2xl border border-white/10 bg-[#05070b] px-4 py-3 text-sm text-white outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-300">
                                            Decision rationale
                                        </Label>
                                        <textarea
                                            value={
                                                scenarioDrafts[selectedScenario.id]
                                                    ?.decision_rationale ?? ''
                                            }
                                            onChange={(event) =>
                                                setScenarioDrafts((current) => ({
                                                    ...current,
                                                    [selectedScenario.id]: {
                                                        ...current[selectedScenario.id],
                                                        decision_rationale:
                                                            event.target.value,
                                                    },
                                                }))
                                            }
                                            className="min-h-32 w-full rounded-2xl border border-white/10 bg-[#05070b] px-4 py-3 text-sm text-white outline-none"
                                        />
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                void saveScenarioMeta(selectedScenario.id)
                                            }
                                            disabled={savingScenarioId !== null}
                                            className="h-11 rounded-full bg-[#ff2d20] text-black hover:bg-[#ff5549]"
                                        >
                                            {savingScenarioId === selectedScenario.id ? (
                                                <>
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    Saving
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    Save changes
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                void deleteScenario(selectedScenario.id)
                                            }
                                            disabled={deletingScenarioId !== null}
                                            className="h-11 rounded-full border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
                                        >
                                            {deletingScenarioId === selectedScenario.id ? (
                                                <>
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    Deleting
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete scenario
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                                        <div className="font-medium text-white">
                                            Current scenario top:
                                        </div>
                                        <div className="mt-1">
                                            {selectedScenario.top_major?.name ?? 'N/A'} •
                                            confidence{' '}
                                            {selectedScenario.summary?.recommendation_confidence?.toFixed(
                                                1,
                                            ) ?? '0.0'}
                                            %
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 text-slate-400">
                                            <GitCompareArrows className="h-4 w-4 text-[#ff2d20]" />
                                            Buka menu Comparison untuk membaca
                                            baseline vs scenario ini secara
                                            detail.
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-500">
                                    Pilih skenario untuk mengedit notes dan
                                    decision rationale.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {initialAssessment && (
                    <section className="grid gap-6 mt-8">
                        <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-[#a855f7] uppercase mb-2">
                            <Sparkles className="h-4 w-4" />
                            Advanced Intelligence Modules
                        </div>
                        
                        <SensitivityHeatmap 
                            assessmentId={initialAssessment.id} 
                            currentAdjustments={adjustments} 
                        />
                        
                        <MonteCarloVisualization 
                            assessmentId={initialAssessment.id}
                            recommendations={previewRecommendations}
                            uncertaintyFactors={uncertaintyFactors}
                        />
                        
                        <ScenarioComparison 
                            selectedScenarioIds={
                                compareSelection.length > 0 
                                    ? compareSelection 
                                    : scenarioList.slice(0, 3).map(s => s.id)
                            } 
                        />
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
