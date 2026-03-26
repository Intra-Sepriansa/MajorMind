import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { AssessmentHistoryItem, AssessmentHistoryPaginated } from '@/types';

type AssessmentHistoryPanelProps = {
    historyItems: AssessmentHistoryItem[];
    historyMeta: AssessmentHistoryPaginated['meta'];
    loadingHistoryDetail: boolean;
    loadingHistoryPage: boolean;
    onOpen: (id: number) => void;
    onCompare: (id: number) => void;
    onPrint: (id: number) => void;
    onLoadMore: () => void;
    formatSessionTime: (value: string | null | undefined) => string;
};

export function AssessmentHistoryPanel({
    historyItems,
    historyMeta,
    loadingHistoryDetail,
    loadingHistoryPage,
    onOpen,
    onCompare,
    onPrint,
    onLoadMore,
    formatSessionTime,
}: AssessmentHistoryPanelProps) {
    return (
        <Card className="rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="whitespace-nowrap text-sm font-medium text-slate-300">
                        Full assessment history
                    </div>
                    <div className="flex items-center gap-3 whitespace-nowrap text-xs tracking-[0.24em] text-slate-500 uppercase">
                        <span>{historyMeta.total} saved sessions</span>
                        <span className="text-white/20">•</span>
                        <span>
                            Page {historyMeta.current_page}/{historyMeta.last_page}
                        </span>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {historyItems.length === 0 ? (
                        <div className="col-span-full rounded-2xl border border-white/8 bg-[#000000] px-4 py-6 text-sm text-slate-500">
                            Histori assessment akan muncul setelah akun ini
                            menyimpan beberapa sesi.
                        </div>
                    ) : (
                        historyItems.map((historyItem) => (
                            <div
                                key={historyItem.id}
                                className="flex flex-col justify-between overflow-hidden rounded-[22px] border border-white/8 bg-[#000000] p-5"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-xs tracking-[0.24em] text-slate-500 uppercase">
                                                Session #{historyItem.id}
                                            </div>
                                            <div className="mt-1 text-lg font-medium text-white line-clamp-1">
                                                {historyItem.top_major?.name ??
                                                    'Belum ada top major'}
                                            </div>
                                        </div>
                                        <div className="shrink-0 rounded-full border border-[#ff2d20]/20 bg-[#ff2d20]/10 px-3 py-1 text-xs text-[#ffb4ae]">
                                            {historyItem.confidence.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="mt-3 grid gap-1.5 text-sm text-slate-400">
                                        <div>
                                            CR:{' '}
                                            {historyItem.consistency_ratio.toFixed(
                                                4,
                                            )}
                                        </div>
                                        <div className="line-clamp-1">
                                            Siswa:{' '}
                                            {historyItem.student_name ?? 'Unknown'}
                                        </div>
                                        <div>
                                            {formatSessionTime(
                                                historyItem.created_at,
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpen(historyItem.id)}
                                        className="w-full border-white/10 bg-white/[0.02] text-slate-200 hover:bg-white/[0.06]"
                                    >
                                        {loadingHistoryDetail
                                            ? 'Loading...'
                                            : 'Open Session Details'}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {historyMeta.current_page < historyMeta.last_page ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onLoadMore}
                        disabled={loadingHistoryPage}
                        className="mt-4 w-full border-white/10 bg-white/[0.02] text-slate-200 hover:bg-white/[0.06]"
                    >
                        {loadingHistoryPage
                            ? 'Loading more...'
                            : 'Load more history'}
                    </Button>
                ) : null}
            </CardContent>
        </Card>
    );
}
