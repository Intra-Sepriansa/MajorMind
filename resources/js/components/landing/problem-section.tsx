import { Users, Brain, TrendingDown, XCircle, AlertTriangle, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const biases = [
    { icon: Users, title: 'Peer Pressure', desc: '"Ikut teman" tanpa pertimbangan rasional — bias heuristik paling umum di kalangan siswa SMA/SMK.', intensity: 85, color: '#EF4444' },
    { icon: Users, title: 'Parental Pressure', desc: 'Ekspektasi orang tua vs kemampuan aktual anak. Sering berujung mismatch fundamental.', intensity: 78, color: '#F59E0B' },
    { icon: TrendingDown, title: 'Prestige Bias', desc: 'Memilih jurusan "bergengsi" tanpa minat intrinsik. Hasilnya: burnout di semester 3.', intensity: 72, color: '#F59E0B' },
    { icon: XCircle, title: 'Recency Bias', desc: 'Terpengaruh tren sesaat (AI, crypto) tanpa analisis jangka panjang tentang kecocokan pribadi.', intensity: 65, color: '#FBBF24' },
];

const failures = [
    { title: 'Tes Minat Bakat Tradisional', desc: 'Subjektif, tidak tervalidasi matematis, hasil berbeda tiap kali tes.' },
    { title: 'Konseling Manual', desc: 'Terbatas kapasitas (5-7 siswa/hari), inkonsisten antar konselor.' },
    { title: 'Intuisi Pribadi', desc: 'Rentan cognitive bias, tidak objektif, tidak bisa dipertanggungjawabkan.' },
    { title: 'Scoring Sederhana', desc: 'Tidak menangkap kompleksitas multidimensi dari keputusan karir.' },
];

const consequences = [
    { val: '23%', label: 'Drop-out Rate', desc: 'Pemborosan waktu dan biaya hingga ratusan juta Rupiah', impact: 'High', color: '#EF4444' },
    { val: '30%+', label: 'Skill-Job Mismatch', desc: 'Pengangguran terdidik akibat ketidaksesuaian kompetensi', impact: 'Critical', color: '#DC2626' },
    { val: '3-18 bln', label: 'Masa Tunggu Kerja', desc: 'Variasi drastis antar jurusan menurut Tracer Study', impact: 'Moderate', color: '#F59E0B' },
    { val: '40%', label: 'Tidak Lanjut PT', desc: 'Lulusan SMK TIK yang tidak melanjutkan karena information paralysis', impact: 'Severe', color: '#DC2626' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring' as const, stiffness: 100, damping: 14 },
    },
};

export default function ProblemSection() {
    return (
        <section id="problem" className="relative py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <motion.div
                    className="mx-auto max-w-3xl text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs tracking-[0.2em] text-amber-300 uppercase">
                        <AlertTriangle className="h-3.5 w-3.5" /> Problem Statement
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                        Mengapa Metode Tradisional <span className="text-[#ff2d20]">Gagal</span>
                    </h2>
                    <p className="mt-4 text-slate-400 leading-7">
                        Keputusan pemilihan jurusan yang seharusnya berbasis data dan analisis, justru didominasi oleh bias kognitif, tekanan sosial, dan metode yang tidak tervalidasi.
                    </p>
                </motion.div>

                {/* Bias Cards with animated intensity bars */}
                <div className="mt-16">
                    <h3 className="text-center text-sm tracking-[0.3em] text-slate-500 uppercase">Bias Heuristik dalam Pengambilan Keputusan</h3>
                    <motion.div
                        className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {biases.map((b) => (
                            <motion.div
                                key={b.title}
                                className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all duration-500 hover:border-amber-500/30 hover:bg-white/[0.04] cursor-pointer"
                                variants={itemVariants}
                                whileHover={{ scale: 1.03, y: -4 }}
                            >
                                <b.icon className="h-6 w-6 text-amber-400 transition group-hover:scale-110" />
                                <h4 className="mt-4 text-base font-semibold" style={font}>{b.title}</h4>
                                <p className="mt-2 text-sm leading-6 text-slate-400">{b.desc}</p>

                                {/* Intensity bar */}
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                                        <span>Impact</span>
                                        <span className="font-bold" style={{ color: b.color }}>{b.intensity}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: b.color }}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${b.intensity}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Failures */}
                <div className="mt-16">
                    <h3 className="text-center text-sm tracking-[0.3em] text-slate-500 uppercase">Keterbatasan Metode Konvensional</h3>
                    <motion.div
                        className="mt-8 grid gap-4 md:grid-cols-2"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {failures.map((f) => (
                            <motion.div
                                key={f.title}
                                className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-colors hover:border-red-500/20"
                                variants={itemVariants}
                                whileHover={{ x: 4 }}
                            >
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                                    <XCircle className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold" style={font}>{f.title}</h4>
                                    <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Consequences with timeline feel */}
                <div className="mt-16">
                    <h3 className="text-center text-sm tracking-[0.3em] text-slate-500 uppercase">Konsekuensi Sistemik</h3>
                    <motion.div
                        className="mt-8 grid gap-4 md:grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {consequences.map((c) => (
                            <motion.div
                                key={c.label}
                                className="rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5 text-center relative overflow-hidden group cursor-pointer"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, y: -6 }}
                            >
                                {/* Glow on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(circle at center, ${c.color}15 0%, transparent 70%)` }}
                                />
                                <div className="relative z-10">
                                    <div className="text-3xl font-bold text-[#ff2d20]" style={font}>{c.val}</div>
                                    <div className="mt-1 text-sm font-semibold text-white">{c.label}</div>
                                    <p className="mt-2 text-xs leading-5 text-slate-400">{c.desc}</p>
                                    <span
                                        className="inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white/80"
                                        style={{ backgroundColor: `${c.color}40` }}
                                    >
                                        Impact: {c.impact}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
