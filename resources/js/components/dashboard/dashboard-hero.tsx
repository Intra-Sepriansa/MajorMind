import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import CoreReactor3D from './core-reactor-3d';
import type { AssessmentResponse } from '@/types';

type DashboardHeroProps = {
    assessment: AssessmentResponse | null;
};

export default function DashboardHero({ assessment }: DashboardHeroProps) {
    const hasData = assessment && assessment.recommendations.length > 0;
    
    const criteriaCount = hasData ? Object.keys(assessment.criterion_weights).length : 0;
    const cr = hasData ? assessment.consistency_ratio : 0;
    const confidence = hasData ? (assessment.summary?.recommendation_confidence ?? assessment.recommendations[0]?.meta?.probability_percentage ?? 0) : 0;
    
    const topRec = hasData ? assessment.recommendations[0] : null;

    return (
        <div className="relative overflow-hidden rounded-[28px] border border-white/5 bg-[#0b0e14] shadow-2xl mb-8">
            {/* The 3D Background */}
            <div className="absolute inset-0 z-0 opacity-90">
                <CoreReactor3D />
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0b0e14] via-[#0b0e14]/80 to-transparent pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 p-8 lg:p-12">
                
                {/* Left Side: Typography & Metrics */}
                <div className="max-w-xl flex-1">
                    {/* Eyebrow */}
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-semibold tracking-[0.25em] text-slate-300 uppercase backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Intelligent DSS Workspace
                    </div>

                    {/* Heading */}
                    <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] text-white lg:text-5xl xl:text-6xl tracking-tight">
                        Review the Decision Intelligence.
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-10 text-base leading-relaxed text-slate-400 max-w-lg">
                        Dashboard ini difokuskan untuk membaca hasil, meninjau histori, membandingkan sesi, dan memahami alasan keputusan.
                    </p>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md">
                        {/* Criteria Metric */}
                        <div className="rounded-2xl border border-white/5 bg-black/40 p-4 backdrop-blur-xl">
                            <span className="mb-1 block text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                Criteria
                            </span>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                {hasData ? criteriaCount : '-'}
                            </span>
                        </div>

                        {/* Consistency Metric */}
                        <div className="rounded-2xl border border-white/5 bg-black/40 p-4 backdrop-blur-xl">
                            <span className="mb-1 block text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                Consistency
                            </span>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                {hasData ? cr.toFixed(4) : '-'}
                            </span>
                        </div>

                        {/* Confidence Metric */}
                        <div className="rounded-2xl border border-white/5 bg-black/40 p-4 backdrop-blur-xl">
                            <span className="mb-1 block text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                Confidence
                            </span>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                {hasData ? `${confidence.toFixed(1)}%` : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Workspace Actions Card */}
                <div className="w-full lg:w-[380px] shrink-0">
                    <div className="rounded-[28px] border border-white/10 bg-black/60 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                        <div className="mb-5 text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase">
                            Workspace Actions
                        </div>

                        {/* Latest Recommendation Box */}
                        <div className="mb-6 rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05]">
                            <span className="block text-xs text-slate-400 mb-1">
                                Latest recommendation
                            </span>
                            <h3 className="text-xl font-bold text-white mb-1">
                                {hasData && topRec ? topRec.major.name : 'Belum ada data'}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {hasData ? `Confidence ${confidence.toFixed(1)}% • CR ${cr.toFixed(4)}` : 'Jalankan assessment untuk memulai'}
                            </p>
                        </div>

                        {/* Primary Action */}
                        <Link
                            href="/assessment"
                            className="flex w-full items-center justify-center rounded-2xl bg-[#ff2d20] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#ff4538] hover:shadow-[0_0_20px_rgba(255,45,32,0.4)] mb-4"
                        >
                            Create new assessment
                        </Link>

                        {/* Secondary Actions Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <Link href="/scenario-lab" className="flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] px-2 py-3 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-white text-center">
                                Scenario<br/>Lab
                            </Link>
                            <Link href="/comparison" className="flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] px-2 py-3 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-white text-center">
                                Comparison
                            </Link>
                            <Link href="/insights" className="flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] px-2 py-3 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-white text-center">
                                Insights
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
