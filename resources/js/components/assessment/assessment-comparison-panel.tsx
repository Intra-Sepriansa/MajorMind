import { FileOutput } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { AssessmentResponse, Recommendation } from '@/types';

type CriteriaComparisonRow = {
    label: string;
    currentWeight: number;
    compareWeight: number;
    delta: number;
};

type RankingComparisonRow = {
    rank: number;
    current: Recommendation | null;
    compare: Recommendation | null;
    compareRankByCurrentMajor: number | null;
    currentRankByCompareMajor: number | null;
};

type AssessmentComparisonPanelProps = {
    detailAssessment: AssessmentResponse | null;
    comparisonAssessment: AssessmentResponse | null;
    criteriaComparisonRows: CriteriaComparisonRow[];
    rankingComparisonRows: RankingComparisonRow[];
    loadingComparison: boolean;
    onExportOpened: () => void;
    onExportCompared: () => void;
    formatPercent: (value: number) => string;
    formatSessionTime: (value: string | null | undefined) => string;
};

function AssessmentSnapshot({
    title,
    assessment,
    onExport,
    formatSessionTime,
}: {
    title: string;
    assessment: AssessmentResponse | null;
    onExport: () => void;
    formatSessionTime: (value: string | null | undefined) => string;
}) {
    return (
        <div className="rounded-[24px] border border-white/8 bg-[#000000] p-5">
            <div className="text-xs tracking-[0.28em] text-slate-500 uppercase">
                {title}
            </div>
            <div className="mt-4">
                {assessment ? (
                    <div className="grid gap-3 text-sm text-slate-300">
                        <div className="text-xl font-semibold text-white">
                            {assessment.top_major?.name ?? 'Belum ada hasil'}
                        </div>
                        <div>
                            Confidence:{' '}
                            {assessment.summary?.recommendation_confidence?.toFixed(
                                1,
                            ) ?? '0.0'}
                            %
                        </div>
                        <div>
                            CR: {assessment.consistency_ratio.toFixed(4)}
                        </div>
                        <div>
                            Session: {formatSessionTime(assessment.created_at)}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onExport}
                            className="mt-2 w-fit border-white/10 bg-white/[0.02] text-slate-200 hover:bg-white/[0.06]"
                        >
                            <FileOutput className="h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>
                ) : (
                    <div className="text-sm text-slate-500">
                        Data assessment belum tersedia.
                    </div>
                )}
            </div>
        </div>
    );
}

export function AssessmentComparisonPanel({
    detailAssessment,
    comparisonAssessment,
    criteriaComparisonRows,
    rankingComparisonRows,
    loadingComparison,
    onExportOpened,
    onExportCompared,
    formatPercent,
    formatSessionTime,
}: AssessmentComparisonPanelProps) {
    return (
        <Card className="rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">
                    Compare sessions
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <AssessmentSnapshot
                        title="Opened session"
                        assessment={detailAssessment}
                        onExport={onExportOpened}
                        formatSessionTime={formatSessionTime}
                    />
                    <AssessmentSnapshot
                        title="Comparison target"
                        assessment={comparisonAssessment}
                        onExport={onExportCompared}
                        formatSessionTime={formatSessionTime}
                    />
                </div>

                {comparisonAssessment ? (
                    <>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-4 text-sm text-slate-300">
                                <div className="text-slate-500">
                                    Confidence delta
                                </div>
                                <div className="mt-2 text-2xl font-semibold text-white">
                                    {(
                                        (detailAssessment?.summary
                                            ?.recommendation_confidence ?? 0) -
                                        (comparisonAssessment.summary
                                            ?.recommendation_confidence ?? 0)
                                    ).toFixed(1)}
                                    %
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-4 text-sm text-slate-300">
                                <div className="text-slate-500">CR delta</div>
                                <div className="mt-2 text-2xl font-semibold text-white">
                                    {(
                                        (detailAssessment?.consistency_ratio ??
                                            0) -
                                        comparisonAssessment.consistency_ratio
                                    ).toFixed(4)}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-[#000000] px-4 py-4 text-sm text-slate-300">
                                <div className="text-slate-500">
                                    Top major shift
                                </div>
                                <div className="mt-2 text-base font-medium text-white">
                                    {detailAssessment?.top_major?.name ?? 'N/A'}{' '}
                                    vs{' '}
                                    {comparisonAssessment.top_major?.name ??
                                        'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-[24px] border border-white/8 bg-[#000000] p-5">
                                <div className="mb-4 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                    Criteria weight comparison
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-white/8">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-white/[0.03] text-slate-400">
                                            <tr>
                                                <th className="px-3 py-3 font-medium">
                                                    Criterion
                                                </th>
                                                <th className="px-3 py-3 font-medium">
                                                    Opened
                                                </th>
                                                <th className="px-3 py-3 font-medium">
                                                    Compared
                                                </th>
                                                <th className="px-3 py-3 font-medium">
                                                    Delta
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {criteriaComparisonRows.map(
                                                (row) => (
                                                    <tr
                                                        key={row.label}
                                                        className="border-t border-white/8 align-top"
                                                    >
                                                        <td className="px-3 py-3 text-white">
                                                            {row.label}
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="space-y-2">
                                                                <div className="font-mono text-slate-200">
                                                                    {formatPercent(
                                                                        row.currentWeight,
                                                                    )}
                                                                </div>
                                                                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                                                    <div
                                                                        className="h-full rounded-full bg-white/80"
                                                                        style={{
                                                                            width: `${Math.max(row.currentWeight * 100, 4)}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="space-y-2">
                                                                <div className="font-mono text-[#ffb4ae]">
                                                                    {formatPercent(
                                                                        row.compareWeight,
                                                                    )}
                                                                </div>
                                                                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                                                    <div
                                                                        className="h-full rounded-full bg-[#ff2d20]"
                                                                        style={{
                                                                            width: `${Math.max(row.compareWeight * 100, 4)}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 font-mono text-slate-300">
                                                            {row.delta >= 0
                                                                ? '+'
                                                                : ''}
                                                            {formatPercent(
                                                                row.delta,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="rounded-[24px] border border-white/8 bg-[#000000] p-5">
                                <div className="mb-4 text-xs tracking-[0.28em] text-slate-500 uppercase">
                                    Top 5 ranking comparison
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-white/8">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-white/[0.03] text-slate-400">
                                            <tr>
                                                <th className="px-3 py-2 font-medium">
                                                    Rank
                                                </th>
                                                <th className="px-3 py-2 font-medium">
                                                    Opened
                                                </th>
                                                <th className="px-3 py-2 font-medium">
                                                    Opened score
                                                </th>
                                                <th className="px-3 py-2 font-medium">
                                                    Compared
                                                </th>
                                                <th className="px-3 py-2 font-medium">
                                                    Compared score
                                                </th>
                                                <th className="px-3 py-2 font-medium">
                                                    Rank shift
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rankingComparisonRows.map(
                                                (row) => (
                                                    <tr
                                                        key={row.rank}
                                                        className="border-t border-white/8"
                                                    >
                                                        <td className="px-3 py-3 text-slate-500">
                                                            #{row.rank}
                                                        </td>
                                                        <td className="px-3 py-3 text-white">
                                                            {row.current?.major
                                                                .name ?? '-'}
                                                        </td>
                                                        <td className="px-3 py-3 font-mono text-slate-300">
                                                            {row.current
                                                                ? formatPercent(
                                                                      row
                                                                          .current
                                                                          .final_score,
                                                                  )
                                                                : '-'}
                                                        </td>
                                                        <td className="px-3 py-3 text-[#ff8a80]">
                                                            {row.compare?.major
                                                                .name ?? '-'}
                                                        </td>
                                                        <td className="px-3 py-3 font-mono text-[#ffb4ae]">
                                                            {row.compare
                                                                ? formatPercent(
                                                                      row
                                                                          .compare
                                                                          .final_score,
                                                                  )
                                                                : '-'}
                                                        </td>
                                                        <td className="px-3 py-3 text-slate-300">
                                                            <div className="grid gap-1 text-xs">
                                                                <span>
                                                                    Opened
                                                                    major now
                                                                    at:{' '}
                                                                    {row.compareRankByCurrentMajor
                                                                        ? `#${row.compareRankByCurrentMajor}`
                                                                        : 'out'}
                                                                </span>
                                                                <span>
                                                                    Compared
                                                                    major now
                                                                    at:{' '}
                                                                    {row.currentRankByCompareMajor
                                                                        ? `#${row.currentRankByCompareMajor}`
                                                                        : 'out'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}

                {loadingComparison ? (
                    <div className="mt-4 text-sm text-slate-500">
                        Loading comparison session...
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
