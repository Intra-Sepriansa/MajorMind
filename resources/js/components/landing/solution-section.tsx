import { BrainCircuit, Radar, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ParadigmShift3D from './paradigm-shift-3d';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 14 } },
};


// Pre-computed stable positions for each stage to prevent recalculation
const CHAOS_POSITIONS = Array.from({ length: 16 }, (_, i) => ({
    x: Math.cos(i * 0.82 + 0.5) * (30 + (i % 3) * 12),
    y: Math.sin(i * 1.13 + 0.3) * (28 + ((i + 1) % 4) * 8),
    rotation: (i * 47) % 360,
    delay: i * 0.06,
}));

const GRID_POSITIONS = Array.from({ length: 16 }, (_, i) => ({
    x: (i % 4) * 22 - 33,
    y: Math.floor(i / 4) * 22 - 33,
}));

const CONVERGE_RING = Array.from({ length: 16 }, (_, i) => ({
    x: Math.cos((i / 16) * Math.PI * 2) * 36,
    y: Math.sin((i / 16) * Math.PI * 2) * 36,
}));

function ParadigmShiftAnimation() {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setStage((prev) => (prev + 1) % 3), 4000);
        return () => clearInterval(interval);
    }, []);

    const stages = [
        { label: 'Heuristic Chaos', color: '#EF4444', desc: 'Keputusan tanpa struktur' },
        { label: 'Algorithmic Processing', color: '#3B82F6', desc: 'Komputasi AHP-TOPSIS' },
        { label: 'Rational Order', color: '#10B981', desc: 'Rekomendasi tervalidasi' },
    ];

    return (
        <motion.div
            className="relative flex flex-col items-center justify-center rounded-3xl border border-white/8 bg-white/[0.02] overflow-hidden mb-12 py-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            {/* Animated background glow */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div
                    className="absolute inset-0 transition-colors duration-1000"
                    style={{
                        background: `radial-gradient(ellipse 60% 60% at center, ${stages[stage].color}12 0%, transparent 70%)`,
                    }}
                />
            </motion.div>

            {/* Stage labels row */}
            <div className="relative z-10 flex items-center gap-6 mb-6">
                {stages.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        {i > 0 && (
                            <motion.div
                                className="flex items-center"
                                animate={{ opacity: stage >= i ? 1 : 0.2 }}
                                transition={{ duration: 0.5 }}
                            >
                                {[0, 1, 2].map((d) => (
                                    <motion.div
                                        key={d}
                                        className="w-1 h-1 rounded-full mx-0.5"
                                        style={{ backgroundColor: stages[i].color }}
                                        animate={{
                                            opacity: stage >= i ? [0.3, 1, 0.3] : 0.15,
                                            scale: stage >= i ? [0.8, 1.2, 0.8] : 0.8,
                                        }}
                                        transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                                    />
                                ))}
                            </motion.div>
                        )}
                        <motion.span
                            className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full transition-colors duration-700"
                            animate={{
                                color: stage === i ? s.color : '#64748b',
                                backgroundColor: stage === i ? `${s.color}15` : 'transparent',
                            }}
                        >
                            {s.label}
                        </motion.span>
                    </div>
                ))}
            </div>

            {/* Main 3D Particle Animation */}
            <div className="relative z-10 w-full max-w-[400px] h-[220px] mx-auto flex items-center justify-center">
                <ParadigmShift3D stage={stage} />
            </div>

            {/* Description */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={stage}
                    className="relative z-10 mt-5 text-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                >
                    <div className="text-sm font-bold tracking-wide" style={{ color: stages[stage].color }}>
                        {stages[stage].label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{stages[stage].desc}</div>
                </motion.div>
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="relative z-10 flex gap-2 mt-4">
                {stages.map((s, i) => (
                    <motion.div
                        key={i}
                        className="h-1 rounded-full cursor-pointer"
                        onClick={() => setStage(i)}
                        animate={{
                            width: i === stage ? 28 : 8,
                            backgroundColor: i === stage ? s.color : '#ffffff20',
                        }}
                        whileHover={{ scale: 1.3 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export default function SolutionSection() {
    return (
        <section id="solution" className="relative py-24">
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    className="absolute top-1/3 left-[-5%] h-80 w-80 rounded-full bg-[#ff2d20]/8 blur-3xl"
                    animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-0 right-[-5%] h-96 w-96 rounded-full bg-emerald-500/6 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], y: [0, -30, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
                <motion.div
                    className="mx-auto max-w-3xl text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs tracking-[0.2em] text-emerald-300 uppercase">
                        <Zap className="h-3.5 w-3.5" /> Paradigma Baru
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                        Rasionalitas <span className="bg-gradient-to-r from-[#ff2d20] to-[#ff6b61] bg-clip-text text-transparent">Algoritmik</span> MajorMind
                    </h2>
                    <p className="mt-4 text-slate-400 leading-7 max-w-2xl mx-auto">
                        Transisi dari keputusan berbasis <em>feeling</em> ke keputusan berbasis data. Eliminasi bias kognitif melalui validasi matematis dengan kerangka kerja <strong className="text-white">AHP-TOPSIS</strong>.
                    </p>
                </motion.div>

                {/* Paradigm shift animation */}
                <div className="mt-12">
                    <ParadigmShiftAnimation />
                </div>

                {/* Why AHP-TOPSIS */}
                <motion.div
                    className="grid gap-6 md:grid-cols-2"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {[
                        {
                            icon: BrainCircuit,
                            title: 'AHP — Pembobotan Subjektif Tervalidasi',
                            desc: 'Menangani kompleksitas preferensi subjektif manusia. Memecah keputusan besar menjadi perbandingan berpasangan sederhana, lalu mengekstrak vektor eigen sebagai bobot prioritas. Divalidasi dengan Consistency Ratio < 0.1.',
                        },
                        {
                            icon: Radar,
                            title: 'TOPSIS — Evaluasi Objektif Multi-Kriteria',
                            desc: 'Mengukur jarak Euclidean setiap alternatif dari solusi ideal positif (A⁺) dan negatif (A⁻) dalam ruang n-dimensi. Menghasilkan pemeringkatan final yang bebas bias skala data.',
                        },
                    ].map((card) => (
                        <motion.div
                            key={card.title}
                            className="rounded-3xl border border-white/8 bg-white/[0.02] p-8 group hover:border-emerald-500/25 transition-colors relative overflow-hidden"
                            variants={itemVariants}
                            whileHover={{ y: -4 }}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                            <div className="relative z-10">
                                <card.icon className="h-8 w-8 text-[#ff2d20] transition group-hover:scale-110 group-hover:rotate-6" />
                                <h3 className="mt-4 text-xl font-bold" style={font}>{card.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-400">{card.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Competitive edge cards */}
                <motion.div
                    className="mt-12 grid gap-4 md:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {[
                        { icon: ShieldCheck, title: 'Akurasi 95.71%', desc: 'Terbukti superior melebihi SAW (68.64%), Profile Matching (45%), dan TOPSIS murni (73%).', color: '#10B981' },
                        { icon: BrainCircuit, title: 'Validasi Ganda', desc: 'CR Audit memvalidasi konsistensi + Normalisasi vektor mengeliminasi bias skala data.', color: '#3B82F6' },
                        { icon: Radar, title: 'Scalable & Objektif', desc: 'Menangani ratusan alternatif jurusan dengan integrasi data BAN-PT dan Tracer Study.', color: '#8B5CF6' },
                    ].map((f) => (
                        <motion.div
                            key={f.title}
                            className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition hover:border-emerald-500/30 hover:bg-white/[0.04] relative overflow-hidden"
                            variants={itemVariants}
                            whileHover={{ scale: 1.03, y: -4 }}
                        >
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: `radial-gradient(circle at top right, ${f.color}10 0%, transparent 60%)` }}
                            />
                            <div className="relative z-10">
                                <f.icon className="h-6 w-6 text-emerald-400 transition group-hover:scale-110" />
                                <h4 className="mt-3 text-base font-semibold" style={font}>{f.title}</h4>
                                <p className="mt-2 text-sm leading-6 text-slate-400">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
