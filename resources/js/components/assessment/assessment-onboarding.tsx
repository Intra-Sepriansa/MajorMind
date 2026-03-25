import {
    ArrowRight,
    BookOpenText,
    BrainCircuit,
    Clock,
    Compass,
    Lock,
    Shield,
    Sparkles,
    Target,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    },
    {
        step: 2,
        title: 'Behavioral Profiling',
        desc: 'Mengukur minat intrinsik, kemampuan logika, dan konsistensi Anda',
        duration: '5 min',
        icon: BrainCircuit,
    },
    {
        step: 3,
        title: 'AHP Pairwise Comparison',
        desc: 'Menentukan prioritas kriteria pemilihan jurusan secara berpasangan',
        duration: '10 min',
        icon: Target,
    },
    {
        step: 4,
        title: 'Review & Konfirmasi',
        desc: 'Meninjau profil dan menghasilkan rekomendasi jurusan',
        duration: '3 min',
        icon: Sparkles,
    },
];

const valueProps = [
    {
        icon: Compass,
        title: 'Minat Intrinsik',
        desc: 'Mengidentifikasi passion natural Anda tanpa bias eksternal',
        color: '#22c55e',
    },
    {
        icon: BrainCircuit,
        title: 'Kemampuan Kognitif',
        desc: 'Mengukur kapasitas analitis dan logika untuk matching jurusan',
        color: '#3b82f6',
    },
    {
        icon: Target,
        title: 'Preferensi Lingkungan',
        desc: 'Mencocokkan gaya belajar Anda dengan lingkungan akademik terbaik',
        color: '#a855f7',
    },
];

export function AssessmentOnboarding({ onContinue }: AssessmentOnboardingProps) {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="space-y-6">
            {/* Hero */}
            <Card className="relative overflow-hidden rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ff2d20]/12 blur-3xl" />
                </div>
                <CardContent className="relative px-6 py-8 text-center sm:px-10 sm:py-12">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ff2d20]/30 bg-[#ff2d20]/10 shadow-[0_0_30px_rgba(255,45,32,0.2)]">
                        <Zap className="h-8 w-8 text-[#ff2d20]" />
                    </div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs tracking-[0.28em] text-slate-400 uppercase">
                        <Lock className="h-3 w-3" />
                        AHP-TOPSIS Decision Engine
                    </div>
                    <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                        Selamat Datang di MajorMind Assessment
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                        Anda akan melalui assessment yang dirancang untuk memahami profil psikologis dan preferensi Anda secara mendalam. 
                        Setiap jawaban diproses melalui algoritma AHP-TOPSIS untuk menghasilkan rekomendasi jurusan yang akurat dan transparan.
                    </p>

                    {/* Stats Row */}
                    <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-4">
                        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <div className="text-xl font-bold text-white">95.71%</div>
                            <div className="text-[10px] text-slate-500">Akurasi</div>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <div className="flex items-center justify-center gap-1 text-xl font-bold text-white">
                                <Clock className="h-4 w-4 text-slate-400" />
                                ~20
                            </div>
                            <div className="text-[10px] text-slate-500">Menit</div>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3">
                            <div className="text-xl font-bold text-white">4</div>
                            <div className="text-[10px] text-slate-500">Fase</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Value Props */}
            <div className="grid gap-4 sm:grid-cols-3">
                {valueProps.map((prop) => (
                    <Card key={prop.title} className="rounded-[24px] border-white/10 bg-[#000000]/82 py-0 transition-all duration-300 hover:border-white/20">
                        <CardContent className="px-5 py-5">
                            <div
                                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{ backgroundColor: `${prop.color}15` }}
                            >
                                <prop.icon className="h-5 w-5" style={{ color: prop.color }} />
                            </div>
                            <h3 className="text-sm font-semibold text-white">{prop.title}</h3>
                            <p className="mt-1 text-xs leading-5 text-slate-400">{prop.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Assessment Roadmap */}
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-6">
                    <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <BookOpenText className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Assessment Roadmap
                    </div>
                    <div className="space-y-3">
                        {roadmapSteps.map((item) => (
                            <div
                                key={item.step}
                                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3.5 transition-all hover:border-white/12 hover:bg-white/[0.04]"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff2d20]/10 text-xs font-bold text-[#ff2d20]">
                                    {`0${item.step}`}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-white">{item.title}</div>
                                    <div className="text-xs text-slate-500">{item.desc}</div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Clock className="h-3 w-3" />
                                    {item.duration}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3 text-center">
                        <span className="text-xs text-slate-400">
                            Total estimasi: <span className="font-semibold text-white">~20 menit</span> — Progress tersimpan otomatis, dapat di-pause kapan saja
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Privacy & Consent */}
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-6 py-6">
                    <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                        <Shield className="h-3.5 w-3.5 text-[#ff2d20]" />
                        Data Privacy Guarantee
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            { label: 'Data terenkripsi end-to-end', icon: Lock },
                            { label: 'Tidak ada penjualan data ke pihak ketiga', icon: Shield },
                            { label: 'Analitik hanya dalam bentuk agregat anonim', icon: BrainCircuit },
                            { label: 'Anda dapat menghapus data kapan saja', icon: Target },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3"
                            >
                                <item.icon className="h-4 w-4 shrink-0 text-emerald-400" />
                                <span className="text-xs text-slate-300">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Consent Toggle */}
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                        <button
                            type="button"
                            onClick={() => setAgreed(!agreed)}
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                                agreed
                                    ? 'border-[#ff2d20] bg-[#ff2d20] text-white'
                                    : 'border-white/20 bg-transparent'
                            }`}
                        >
                            {agreed && (
                                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                        <div>
                            <div className="text-sm text-white">Saya menyetujui penggunaan data</div>
                            <div className="mt-1 text-xs text-slate-500">
                                Dengan melanjutkan, Anda menyetujui bahwa jawaban assessment akan diproses oleh algoritma AHP-TOPSIS untuk menghasilkan rekomendasi jurusan yang dipersonalisasi. Data Anda dilindungi sesuai kebijakan privasi kami.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* CTA */}
            <div className="flex justify-center pt-2">
                <Button
                    onClick={onContinue}
                    disabled={!agreed}
                    className="h-12 rounded-2xl bg-[#ff2d20] px-8 text-base font-semibold text-white shadow-[0_0_20px_rgba(255,45,32,0.3)] transition-all hover:bg-[#ff584d] hover:shadow-[0_0_30px_rgba(255,45,32,0.5)] disabled:opacity-40 disabled:shadow-none"
                >
                    Mulai Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
