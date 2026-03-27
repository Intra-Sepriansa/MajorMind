import {
    ArrowRight,
    BookOpenText,
    BrainCircuit,
    CheckCircle2,
    Clock,
    Compass,
    Fingerprint,
    Lock,
    Shield,
    Sparkles,
    Target,
    Zap,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function useSpotlight() {
    const ref = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [isHovered, setIsHovered] = useState(false);

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStyle({
            background: `radial-gradient(120px circle at ${x}px ${y}px, rgba(255,45,32,0.35), transparent 70%)`,
        });
    }, []);

    const onMouseEnter = useCallback(() => setIsHovered(true), []);
    const onMouseLeave = useCallback(() => {
        setIsHovered(false);
        setStyle({});
    }, []);

    return { ref, style, isHovered, onMouseMove, onMouseEnter, onMouseLeave };
}

type AssessmentOnboardingProps = {
    onContinue: () => void;
};

const roadmapSteps = [
    {
        step: 1,
        title: 'Onboarding & Consent',
        desc: 'Memahami metodologi dan menyetujui penggunaan data',
        duration: '2 min',
        icon: BookOpenText,
        color: '#ff2d20',
    },
    {
        step: 2,
        title: 'Behavioral Profiling',
        desc: 'Mengukur minat intrinsik, kemampuan logika, dan konsistensi Anda',
        duration: '5 min',
        icon: BrainCircuit,
        color: '#3b82f6',
    },
    {
        step: 3,
        title: 'AHP Pairwise Comparison',
        desc: 'Menentukan prioritas kriteria pemilihan jurusan secara berpasangan',
        duration: '10 min',
        icon: Target,
        color: '#a855f7',
    },
    {
        step: 4,
        title: 'Review & Konfirmasi',
        desc: 'Meninjau profil dan menghasilkan rekomendasi jurusan',
        duration: '3 min',
        icon: Sparkles,
        color: '#22c55e',
    },
];

const valueProps = [
    {
        icon: Compass,
        title: 'Minat Intrinsik',
        desc: 'Mengidentifikasi passion natural Anda tanpa bias eksternal',
        color: '#22c55e',
        gradient: 'from-emerald-500/20 to-emerald-500/5',
    },
    {
        icon: BrainCircuit,
        title: 'Kemampuan Kognitif',
        desc: 'Mengukur kapasitas analitis dan logika untuk matching jurusan',
        color: '#3b82f6',
        gradient: 'from-blue-500/20 to-blue-500/5',
    },
    {
        icon: Target,
        title: 'Preferensi Lingkungan',
        desc: 'Mencocokkan gaya belajar Anda dengan lingkungan akademik terbaik',
        color: '#a855f7',
        gradient: 'from-purple-500/20 to-purple-500/5',
    },
];

const privacyItems = [
    { label: 'Data terenkripsi end-to-end', icon: Lock },
    { label: 'Tidak ada penjualan data ke pihak ketiga', icon: Shield },
    { label: 'Analitik hanya dalam bentuk agregat anonim', icon: BrainCircuit },
    { label: 'Anda dapat menghapus data kapan saja', icon: Fingerprint },
];

export function AssessmentOnboarding({ onContinue }: AssessmentOnboardingProps) {
    const [agreed, setAgreed] = useState(false);
    const spotlight = useSpotlight();

    return (
        <div className="onboarding-root space-y-8">
            {/* ─── HERO ─── */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-[1px]">
                <div className="relative overflow-hidden rounded-[31px] bg-[#060910]">
                    {/* Ambient light */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="hero-orb absolute top-[-30%] left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#ff2d20]/15 blur-[100px]" />
                        <div className="absolute bottom-[-20%] left-[-10%] h-[300px] w-[300px] rounded-full bg-blue-500/8 blur-[80px]" />
                        <div className="absolute bottom-[-15%] right-[-8%] h-[250px] w-[250px] rounded-full bg-purple-500/8 blur-[80px]" />
                        {/* Grid overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: '48px 48px',
                            }}
                        />
                    </div>

                    <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16">
                        {/* Animated icon (Spotlight enabled) */}
                        <div
                            ref={spotlight.ref}
                            onMouseMove={spotlight.onMouseMove}
                            onMouseEnter={spotlight.onMouseEnter}
                            onMouseLeave={spotlight.onMouseLeave}
                            className={`hero-icon relative mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border transition-all duration-300 ${
                                spotlight.isHovered
                                    ? 'border-[#ff2d20]/40 bg-[#ff2d20]/10 shadow-[0_0_80px_rgba(255,45,32,0.3)]'
                                    : 'border-[#ff2d20]/20 bg-gradient-to-br from-[#ff2d20]/20 to-[#ff2d20]/5 shadow-[0_0_60px_rgba(255,45,32,0.2)]'
                            }`}
                        >
                            {/* Spotlight glow layer */}
                            <div
                                className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
                                style={{
                                    ...spotlight.style,
                                    opacity: spotlight.isHovered ? 1 : 0,
                                }}
                            />
                            {/* Base Zap Icon */}
                            <Zap className="relative z-10 h-9 w-9 text-[#ff2d20]" />
                        </div>

                        {/* Badge */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium tracking-[0.25em] text-slate-400 uppercase backdrop-blur-sm">
                            <Lock className="h-3 w-3 text-[#ff2d20]" />
                            AHP-TOPSIS Decision Engine
                        </div>

                        {/* Title */}
                        <h1
                            className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.75rem]"
                            style={{ fontFamily: '"Space Grotesk", var(--font-sans)' }}
                        >
                            Temukan Jurusan yang{' '}
                            <span className="bg-gradient-to-r from-[#ff4438] via-[#ff6b5d] to-[#ff9f97] bg-clip-text text-transparent">
                                Tepat untuk Anda
                            </span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                            Assessment berbasis algoritma{' '}
                            <span className="font-medium text-slate-300">AHP-TOPSIS</span> yang
                            memproses profil psikologis, preferensi, dan kemampuan Anda untuk menghasilkan
                            rekomendasi jurusan yang{' '}
                            <span className="font-medium text-slate-300">akurat dan transparan</span>.
                        </p>

                        {/* Stats */}
                        <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
                            {[
                                { value: '95.71%', label: 'Akurasi Model', icon: Target },
                                { value: '~20', label: 'Menit Estimasi', icon: Clock },
                                { value: '4', label: 'Fase Assessment', icon: Sparkles },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="group rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-4 transition-all duration-300 hover:border-white/12 hover:bg-white/[0.04]"
                                >
                                    <stat.icon className="mx-auto mb-2 h-4 w-4 text-slate-600 transition-colors group-hover:text-[#ff2d20]" />
                                    <div className="text-2xl font-bold tracking-[-0.04em] text-white">{stat.value}</div>
                                    <div className="mt-0.5 text-[10px] font-medium tracking-[0.1em] text-slate-500 uppercase">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── VALUE PROPS ─── */}
            <div className="grid gap-4 sm:grid-cols-3">
                {valueProps.map((prop, i) => (
                    <div
                        key={prop.title}
                        className="value-card group relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0d14] p-5 transition-all duration-500 hover:border-white/15"
                        style={{ animationDelay: `${i * 120}ms` }}
                    >
                        {/* Hover gradient */}
                        <div
                            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${prop.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                        />
                        <div className="relative">
                            <div
                                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300"
                                style={{
                                    backgroundColor: `${prop.color}12`,
                                    borderColor: `${prop.color}20`,
                                }}
                            >
                                <prop.icon className="h-5 w-5" style={{ color: prop.color }} />
                            </div>
                            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-white">{prop.title}</h3>
                            <p className="mt-1.5 text-xs leading-5 text-slate-400">{prop.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── ROADMAP TIMELINE ─── */}
            <Card className="relative overflow-hidden rounded-[28px] border-white/8 bg-[#060910] py-0">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-[#ff2d20]/6 blur-[80px]" />
                </div>
                <CardContent className="relative px-6 py-7">
                    <div className="mb-5 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff2d20]/10">
                            <BookOpenText className="h-3.5 w-3.5 text-[#ff2d20]" />
                        </div>
                        <span className="text-xs font-medium tracking-[0.25em] text-slate-400 uppercase">
                            Assessment Roadmap
                        </span>
                    </div>

                    {/* Timeline */}
                    <div className="relative space-y-0">
                        {roadmapSteps.map((item, i) => (
                            <div key={item.step} className="group relative flex gap-4 pb-5 last:pb-0">
                                {/* Vertical line */}
                                {i < roadmapSteps.length - 1 && (
                                    <div className="absolute top-11 left-[19px] h-[calc(100%-28px)] w-px bg-gradient-to-b from-white/10 to-transparent" />
                                )}

                                {/* Step dot */}
                                <div
                                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundColor: `${item.color}12`,
                                        borderColor: `${item.color}25`,
                                    }}
                                >
                                    <item.icon className="h-4.5 w-4.5" style={{ color: item.color }} />
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-1.5 transition-all duration-300 group-hover:border-white/6 group-hover:bg-white/[0.02]">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-white">{item.title}</span>
                                            <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-slate-500 uppercase">
                                                Fase {item.step}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/6 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-500">
                                        <Clock className="h-3 w-3" />
                                        {item.duration}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-xs text-slate-400">
                            Total estimasi:{' '}
                            <span className="font-semibold text-white">~20 menit</span>
                            {' '}— Progress tersimpan otomatis
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* ─── PRIVACY & CONSENT ─── */}
            <Card className="relative overflow-hidden rounded-[28px] border-white/8 bg-[#060910] py-0">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-emerald-500/6 blur-[70px]" />
                </div>
                <CardContent className="relative px-6 py-7">
                    <div className="mb-5 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                            <Shield className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <span className="text-xs font-medium tracking-[0.25em] text-slate-400 uppercase">
                            Data Privacy Guarantee
                        </span>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        {privacyItems.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:border-emerald-500/15 hover:bg-emerald-500/[0.03]"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                                    <item.icon className="h-3.5 w-3.5 text-emerald-400" />
                                </div>
                                <span className="text-xs leading-5 text-slate-300">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Consent */}
                    <button
                        type="button"
                        onClick={() => setAgreed(!agreed)}
                        className={`mt-5 flex w-full items-start gap-3.5 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                            agreed
                                ? 'border-[#ff2d20]/30 bg-[#ff2d20]/8 shadow-[0_0_30px_rgba(255,45,32,0.08)]'
                                : 'border-white/8 bg-white/[0.02] hover:border-white/12'
                        }`}
                    >
                        <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300 ${
                                agreed
                                    ? 'border-[#ff2d20] bg-[#ff2d20] text-white shadow-[0_0_12px_rgba(255,45,32,0.4)]'
                                    : 'border-white/20 bg-transparent'
                            }`}
                        >
                            {agreed && (
                                <CheckCircle2 className="h-3 w-3" />
                            )}
                        </div>
                        <div>
                            <div className={`text-sm font-medium transition-colors ${agreed ? 'text-white' : 'text-slate-300'}`}>
                                Saya menyetujui penggunaan data
                            </div>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Dengan melanjutkan, jawaban Anda akan diproses oleh algoritma AHP-TOPSIS
                                untuk menghasilkan rekomendasi jurusan yang dipersonalisasi.
                            </p>
                        </div>
                    </button>
                </CardContent>
            </Card>

            {/* ─── CTA ─── */}
            <div className="flex justify-center pb-4 pt-2">
                <Button
                    onClick={onContinue}
                    disabled={!agreed}
                    className="cta-btn group h-14 rounded-2xl bg-gradient-to-r from-[#ff4438] to-[#ff2d20] px-10 text-base font-semibold text-white shadow-[0_8px_32px_rgba(255,45,32,0.3)] transition-all duration-300 hover:shadow-[0_12px_48px_rgba(255,45,32,0.5)] disabled:opacity-30 disabled:shadow-none"
                >
                    <span>Mulai Assessment</span>
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
            </div>

            <style>{`
                .hero-orb {
                    animation: orb-breathe 4s ease-in-out infinite;
                }
                @keyframes orb-breathe {
                    0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
                    50% { opacity: 1; transform: translateX(-50%) scale(1.15); }
                }

                .hero-icon {
                    animation: icon-float 3s ease-in-out infinite;
                }
                @keyframes icon-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }

                .value-card {
                    animation: card-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                @keyframes card-fade-up {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .cta-btn:not(:disabled) {
                    animation: cta-glow 2.5s ease-in-out infinite;
                }
                @keyframes cta-glow {
                    0%, 100% { box-shadow: 0 8px 32px rgba(255, 45, 32, 0.3); }
                    50% { box-shadow: 0 12px 48px rgba(255, 45, 32, 0.5); }
                }
            `}</style>
        </div>
    );
}
