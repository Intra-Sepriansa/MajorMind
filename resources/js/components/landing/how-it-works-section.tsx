import { ClipboardList, Brain, GitCompare, SlidersHorizontal, Cpu, BarChart3, MessageCircle, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const steps = [
    { icon: ClipboardList, step: '1', title: 'Registrasi & Profiling', time: '15 menit', desc: 'Buat akun, isi data akademik, dan lengkapi profil dasar Anda.', color: '#3B82F6' },
    { icon: Brain, step: '2', title: 'Asesmen Psikologis', time: '20 menit', desc: 'Tes minat intrinsik (30 soal), kemampuan logika (20 soal), dan preferensi lingkungan belajar (15 skenario).', color: '#8B5CF6' },
    { icon: GitCompare, step: '3', title: 'Perbandingan Berpasangan AHP', time: '10 menit', desc: 'Bandingkan kriteria secara berpasangan dengan slider 1-9. Real-time CR validation memastikan konsistensi.', color: '#EC4899' },
    { icon: SlidersHorizontal, step: '4', title: 'Preferensi Tambahan', time: '5 menit', desc: 'Lokasi, budget, tipe institusi (PTN/PTS/Politeknik), dan preferensi khusus seperti beasiswa.', color: '#F59E0B' },
    { icon: Cpu, step: '5', title: 'Komputasi Algoritma', time: '30 detik', desc: 'Sistem memproses 6 fase AHP-TOPSIS, mengintegrasikan data BAN-PT & Tracer Study, menghitung Closeness Coefficient.', color: '#EF4444' },
    { icon: BarChart3, step: '6', title: 'Hasil & Rekomendasi', time: 'Unlimited', desc: 'Top 5 rekomendasi dengan breakdown detail, comparison matrix, prospek karir, dan universitas terkait.', color: '#10B981' },
    { icon: MessageCircle, step: '7', title: 'Konsultasi Lanjutan', time: 'Opsional', desc: 'Book session dengan konselor BK bersertifikat untuk diskusi hasil dan career path planning.', color: '#06B6D4' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } },
};

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative py-24 border-t border-white/5">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <motion.div
                    className="mx-auto max-w-3xl text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs tracking-[0.2em] text-sky-300 uppercase">
                        <Rocket className="h-3.5 w-3.5" /> User Journey
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                        Bagaimana <span className="text-[#ff2d20]">MajorMind</span> Bekerja
                    </h2>
                    <p className="mt-4 text-slate-400">Dari registrasi hingga rekomendasi — hanya butuh 50 menit.</p>
                </motion.div>

                <motion.div
                    className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {steps.map((s) => (
                        <motion.div
                            key={s.step}
                            className="group relative rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition hover:border-sky-400/30 hover:bg-white/[0.04] overflow-hidden"
                            variants={itemVariants}
                            whileHover={{ y: -6, scale: 1.02 }}
                        >
                            {/* Hover glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: `radial-gradient(circle at top left, ${s.color}12 0%, transparent 60%)` }}
                            />

                            {/* Step number watermark */}
                            <div
                                className="absolute -bottom-4 -right-2 text-7xl font-black opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
                                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                            >
                                {s.step}
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition-colors group-hover:border-transparent"
                                        style={{ background: `linear-gradient(135deg, ${s.color}25, transparent)` }}
                                    >
                                        <s.icon className="h-5 w-5" style={{ color: s.color }} />
                                    </div>
                                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-mono font-bold text-white/60">{s.time}</span>
                                </div>
                                <div className="mt-4">
                                    <div className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold" style={{ color: s.color }}>STEP {s.step}</div>
                                    <h4 className="mt-1 text-base font-semibold" style={font}>{s.title}</h4>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-slate-400">{s.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
