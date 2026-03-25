import { Rocket, FileOutput, RefreshCcw, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Recommendation } from '@/types';

type ActionPlanPanelProps = {
    topRecommendation: Recommendation | null;
    onExportPdf: () => void;
    onNewAssessment: () => void;
};

export function ActionPlanPanel({
    topRecommendation,
    onExportPdf,
    onNewAssessment,
}: ActionPlanPanelProps) {
    if (!topRecommendation) return null;

    const majorName = topRecommendation.major.name;
    const pm = topRecommendation.meta?.profile_matching;

    // Generate contextual actions based on gap analysis
    const weakDimensions = pm
        ? Object.entries(pm.gaps)
              .filter(([, g]) => g.raw_gap < -10)
              .map(([dim]) => dim)
        : [];

    return (
        <Card className="animate-result-fade-up rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] py-0 shadow-[0_24px_80px_rgba(0,0,0,0.22)]" style={{ animationDelay: '600ms' }}>
            <CardContent className="px-6 py-6">
                <div className="mb-5 flex items-center gap-2 text-xs tracking-[0.3em] text-slate-500 uppercase">
                    <Rocket className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Recommended Next Steps
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={onExportPdf}
                            className="flex w-full items-center gap-3 rounded-[20px] border border-white/8 bg-[#000000] p-4 text-left transition hover:border-[#ff2d20]/30 hover:bg-white/[0.03]"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ff2d20]/25 bg-[#ff2d20]/10">
                                <FileOutput className="h-4 w-4 text-[#ffb4ae]" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Download Full Report (PDF)</div>
                                <div className="text-xs text-slate-500">
                                    Laporan lengkap dengan ranking, gap analysis, dan narasi XAI.
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={onNewAssessment}
                            className="flex w-full items-center gap-3 rounded-[20px] border border-white/8 bg-[#000000] p-4 text-left transition hover:border-[#ff2d20]/30 hover:bg-white/[0.03]"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                                <RefreshCcw className="h-4 w-4 text-slate-300" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Run New Assessment</div>
                                <div className="text-xs text-slate-500">
                                    Coba konfigurasi bobot AHP atau profil behavioral yang berbeda.
                                </div>
                            </div>
                        </button>

                        <div className="flex w-full items-center gap-3 rounded-[20px] border border-white/8 bg-[#000000] p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                                <BookOpen className="h-4 w-4 text-slate-300" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">
                                    Explore {majorName}
                                </div>
                                <div className="text-xs text-slate-500">
                                    Pelajari kurikulum, prospek karier, dan universitas terbaik untuk {majorName}.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {weakDimensions.length > 0 ? (
                            <div className="rounded-[20px] border border-amber-500/15 bg-amber-500/5 p-4">
                                <div className="mb-2 text-xs tracking-[0.2em] text-amber-300 uppercase">
                                    Areas for Improvement
                                </div>
                                <p className="text-sm leading-7 text-slate-300">
                                    Untuk meningkatkan kesesuaian dengan {majorName}, pertimbangkan untuk memperkuat:{' '}
                                    <span className="font-medium text-white">
                                        {weakDimensions.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                                    </span>.
                                </p>
                                <div className="mt-3 space-y-2">
                                    {weakDimensions.map((dim) => {
                                        const gap = pm?.gaps[dim];
                                        return (
                                            <div key={dim} className="flex items-center justify-between text-sm">
                                                <span className="capitalize text-slate-300">{dim}</span>
                                                <span className="font-mono text-xs text-amber-300">
                                                    Current: {gap?.student ?? 0} / Target: {gap?.target ?? 0}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[20px] border border-emerald-500/15 bg-emerald-500/5 p-4">
                                <div className="mb-2 text-xs tracking-[0.2em] text-emerald-300 uppercase">
                                    Strong Profile Match
                                </div>
                                <p className="text-sm leading-7 text-slate-300">
                                    Profil Anda sangat sesuai dengan persyaratan {majorName}. Tidak ada area yang memerlukan peningkatan signifikan.
                                </p>
                            </div>
                        )}

                        <div className="rounded-[20px] border border-white/8 bg-[#000000] p-4">
                            <div className="mb-2 text-xs tracking-[0.2em] text-slate-500 uppercase">
                                Methodology
                            </div>
                            <p className="text-xs leading-6 text-slate-400">
                                Rekomendasi ini dihasilkan menggunakan AHP-TOPSIS (70%) + Profile Matching Gap Analysis (30%)
                                dengan SAW cross-verification. Hard Constraint Elimination diterapkan sebelum TOPSIS untuk membuang
                                jurusan yang tidak memenuhi syarat minimum.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
