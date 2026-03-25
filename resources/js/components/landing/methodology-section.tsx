import { useEffect, useRef, useState } from 'react';
import { BrainCircuit, Radar, ShieldCheck, ArrowRight, BarChart3, Target, Microscope } from 'lucide-react';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const phases = [
    {
        step: '01', icon: BrainCircuit, title: 'Profiling Perilaku & Analisis Kesenjangan',
        desc: 'Sistem memahami SIAPA Anda secara mendalam — minat intrinsik, kemampuan logika, dan preferensi lingkungan belajar — untuk membentuk baseline psikologis terukur dan menyaring ribuan jurusan menjadi subset yang feasible.',
        details: ['Minat intrinsik & curiosity natural', 'Kapasitas penalaran terstruktur', 'Preferensi lingkungan belajar', 'Gap analysis: kondisi saat ini vs tuntutan jurusan'],
    },
    {
        step: '02', icon: ShieldCheck, title: 'AHP Pairwise Comparison & Ekstraksi Eigenvector',
        desc: 'Manusia kesulitan mendistribusikan 100 poin bobot secara akurat. AHP memecah kompleksitas menjadi keputusan biner sederhana menggunakan Skala Saaty (1-9), lalu mengekstrak Principal Eigenvector sebagai vektor bobot prioritas.',
        details: ['Skala Saaty 1-9 (relatif, bukan absolut)', 'Matriks resiprokal positif n×n', 'Aturan: Jika A/B = 3, maka B/A = 1/3', 'Formula: A × w = λmax × w'],
    },
    {
        step: '03', icon: ShieldCheck, title: 'Validasi Consistency Ratio (CR) — Auditor Matematis',
        desc: 'Setiap jawaban Anda diaudit koherensi logisnya. Jika Anda mengatakan A>B dan B>C tapi C>A — sistem mendeteksi paradoks ini dan meminta kalibrasi ulang.',
        details: ['CR = CI / RI, ambang batas ≤ 0.1 (10%)', 'Mencegah "garbage in, garbage out"', 'Feedback spesifik jika inkonsisten', 'Fungsi pedagogis: edukasi konsistensi berpikir'],
    },
    {
        step: '04', icon: BarChart3, title: 'Normalisasi Matriks TOPSIS & Evaluasi Kinerja',
        desc: 'Dari psikologi subjektif menuju realitas objektif. Data beroperasi di skala berbeda (biaya: jutaan; persaingan: rasio desimal). Vector normalization mentransformasi semua ke format standar tak berdimensi.',
        details: ['Benefit criteria: Akreditasi, Peluang Karir, Reputasi Alumni', 'Cost criteria: Biaya, Jarak, Drop-out Rate', 'Formula: rᵢⱼ = xᵢⱼ / √(Σ xᵢⱼ²)', 'Weighted: vᵢⱼ = wᵢ × rᵢⱼ'],
    },
    {
        step: '05', icon: Target, title: 'Pencarian Jarak Solusi Ideal — Geometri Keputusan',
        desc: 'Alternatif terbaik = terdekat dari kesempurnaan, terjauh dari kegagalan. Setiap jurusan diposisikan dalam ruang n-dimensi relatif terhadap Solusi Ideal Positif (A⁺) dan Negatif (A⁻).',
        details: ['A⁺: Jurusan hipotetis sempurna (jangkar matematis)', 'A⁻: Jurusan hipotetis terburuk', 'Jarak Euclidean: Sᵢ⁺ = √[Σ(vᵢⱼ - vⱼ⁺)²]', 'Euclidean > Hamming untuk data kontinu'],
    },
    {
        step: '06', icon: ArrowRight, title: 'Keputusan Final & Pemeringkatan Adaptif',
        desc: 'Satu angka merangkum ribuan perhitungan. Closeness Coefficient (Ci = Si⁻ / (Si⁺ + Si⁻)) menentukan peringkat final. Ci = 1.0 berarti identik dengan kesempurnaan.',
        details: ['Top 5 rekomendasi dengan skor Ci', 'Breakdown kontribusi setiap kriteria', 'Diaudit CR, dinormalisasi, divalidasi BAN-PT', '100% bebas bias kognitif & groupthink'],
    },
];

export default function MethodologySection() {
    const [activeIndex, setActiveIndex] = useState(-1);
    const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        phaseRefs.current.forEach((ref, i) => {
            if (!ref) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveIndex((prev) => Math.max(prev, i));
                    }
                },
                { threshold: 0.4 }
            );
            obs.observe(ref);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return (
        <section id="methodology" className="relative py-24">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/3 h-80 w-80 rounded-full bg-[#ff2d20]/6 blur-3xl" />
            </div>
            <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2d20]/20 bg-[#ff2d20]/10 px-4 py-2 text-xs tracking-[0.2em] text-[#ffb4ae] uppercase">
                        <Microscope className="h-3.5 w-3.5" /> Deep Dive
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                        6 Fase Komputasi <span className="text-[#ff2d20]">MajorMind</span>
                    </h2>
                    <p className="mt-4 text-slate-400">Transparansi penuh atas setiap langkah algoritma yang menentukan rekomendasi Anda.</p>
                </div>

                {/* Timeline */}
                <div className="relative mt-16">
                    {/* Background line (dim) */}
                    <div className="absolute left-[28px] top-0 bottom-0 w-px bg-white/[0.06] md:left-1/2 md:-ml-px" />

                    {/* Glowing progress line */}
                    <div
                        className="absolute left-[28px] top-0 w-px md:left-1/2 md:-ml-px transition-all duration-1000 ease-out"
                        style={{
                            height: activeIndex >= 0 ? `${((activeIndex + 1) / phases.length) * 100}%` : '0%',
                            background: 'linear-gradient(to bottom, #ff2d20, #ff2d20 80%, transparent)',
                            boxShadow: '0 0 8px rgba(255,45,32,0.6), 0 0 20px rgba(255,45,32,0.3)',
                        }}
                    />

                    <div className="space-y-8">
                        {phases.map((phase, index) => {
                            const isActive = index <= activeIndex;
                            const isCurrentlyActivating = index === activeIndex;

                            return (
                                <div
                                    key={phase.step}
                                    ref={(el) => { phaseRefs.current[index] = el; }}
                                    className="relative flex flex-col md:flex-row"
                                >
                                    {/* Dot */}
                                    <div
                                        className={`absolute left-[12px] top-8 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-[#0b0e14] md:left-1/2 md:-ml-4 transition-all duration-700 ${isActive
                                                ? 'border-[#ff2d20]/60 shadow-[0_0_20px_rgba(255,45,32,0.5),0_0_40px_rgba(255,45,32,0.2)]'
                                                : 'border-white/10 shadow-none'
                                            }`}
                                    >
                                        <div className={`rounded-full transition-all duration-700 ${isActive ? 'h-3 w-3 bg-[#ff2d20]' : 'h-2 w-2 bg-white/20'
                                            }`} />
                                        {isCurrentlyActivating && (
                                            <div className="absolute inset-0 animate-ping rounded-full border border-[#ff2d20]/40" />
                                        )}
                                    </div>

                                    {/* Card */}
                                    <div
                                        className={`w-full pl-14 md:w-1/2 md:pl-0 ${index % 2 === 0 ? 'md:pr-14' : 'md:ml-auto md:pl-14'}`}
                                        style={{
                                            opacity: isActive ? 1 : 0.25,
                                            transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                                            transition: 'opacity 0.7s ease, transform 0.7s ease',
                                        }}
                                    >
                                        <div className={`rounded-3xl border p-6 backdrop-blur-sm transition-all duration-700 ${isActive
                                                ? 'border-[#ff2d20]/25 bg-white/[0.04] shadow-[0_0_30px_rgba(255,45,32,0.08)]'
                                                : 'border-white/8 bg-white/[0.02]'
                                            }`}>
                                            <div className="flex items-start gap-4">
                                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-700 ${isActive
                                                        ? 'border-[#ff2d20]/30 bg-gradient-to-br from-[#ff2d20]/20 to-transparent text-[#ff2d20] shadow-[0_0_15px_rgba(255,45,32,0.3)]'
                                                        : 'border-white/10 bg-transparent text-white/30'
                                                    }`}>
                                                    <phase.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className={`text-[10px] font-mono tracking-[0.2em] uppercase font-bold transition-colors duration-700 ${isActive ? 'text-[#ff2d20]' : 'text-white/20'
                                                        }`}>FASE {phase.step}</div>
                                                    <h3 className="text-lg font-semibold tracking-tight mt-0.5" style={font}>{phase.title}</h3>
                                                </div>
                                            </div>
                                            <p className="mt-4 text-sm leading-7 text-slate-400">{phase.desc}</p>
                                            <div className="mt-4 grid gap-2">
                                                {phase.details.map((d) => (
                                                    <div key={d} className="flex items-start gap-2 text-xs text-slate-500">
                                                        <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-700 ${isActive ? 'bg-[#ff2d20]/60' : 'bg-white/10'
                                                            }`} />
                                                        <span>{d}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
