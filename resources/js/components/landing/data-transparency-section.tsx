import { ShieldCheck, Database, GraduationCap, AlertTriangle, Eye, Lightbulb, Clock, Cpu, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 14 } },
};

export default function DataTransparencySection() {
    return (
        <>
            {/* Section 6: Data Integration */}
            <section id="data" className="relative py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-10">
                    <motion.div
                        className="mx-auto max-w-3xl text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs tracking-[0.2em] text-cyan-300 uppercase">
                            <Database className="h-3.5 w-3.5" /> Jangkar Realitas
                        </div>
                        <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                            Integrasi <span className="text-[#ff2d20]">Data Objektif</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        className="mt-12 grid gap-6 md:grid-cols-2"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {[
                            {
                                icon: GraduationCap,
                                title: 'BAN-PT',
                                desc: 'Akreditasi digunakan sebagai Benefit Criteria berbobot tinggi. Sistem tidak akan merekomendasikan jurusan dengan akreditasi rendah — melindungi investasi pendidikan Anda dari risiko institusional.',
                                details: ['Evaluasi: Visi-Misi, Tata Pamong, Kurikulum, Tridharma PT', 'Transformasi kualitatif → kuantitatif untuk normalisasi TOPSIS', 'Safeguard terhadap universitas bermasalah'],
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Tracer Study (Kemendikbud)',
                                desc: 'Data longitudinal alumni — penyerapan tenaga kerja, masa tunggu kerja, dan gaji awal — mengubah MajorMind dari penilai intelektual menjadi navigator mobilitas sosial-ekonomi.',
                                details: ['Masa tunggu kerja rata-rata bervariasi 3-18 bulan antar jurusan', 'ROI pendidikan tinggi bervariasi 200-500% tergantung alignment', 'Alignment passion & viabilitas karir untuk mitigasi pengangguran'],
                            },
                        ].map((card) => (
                            <motion.div
                                key={card.title}
                                className="rounded-3xl border border-white/8 bg-white/[0.02] p-8 group hover:border-cyan-400/25 transition-colors relative overflow-hidden"
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/5 to-transparent" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3">
                                        <card.icon className="h-7 w-7 text-cyan-400" />
                                        <h3 className="text-xl font-bold" style={font}>{card.title}</h3>
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-slate-400">{card.desc}</p>
                                    <div className="mt-4 space-y-2 text-xs text-slate-500">
                                        {card.details.map((d) => (
                                            <div key={d} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/40" />{d}</div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section 7: Transparency */}
            <section id="transparency" className="relative py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-10">
                    <motion.div
                        className="mx-auto max-w-3xl text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs tracking-[0.2em] text-amber-300 uppercase">
                            <Eye className="h-3.5 w-3.5" /> Intellectual Honesty
                        </div>
                        <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                            Transparansi <span className="text-amber-400">Keterbatasan</span>
                        </h2>
                        <p className="mt-4 text-slate-400">Kami percaya kredibilitas dibangun melalui kejujuran, termasuk tentang apa yang belum bisa kami lakukan.</p>
                    </motion.div>

                    <motion.div
                        className="mt-12 grid gap-4 md:grid-cols-2"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {[
                            { icon: AlertTriangle, title: 'Asumsi Determinisme Statis', limit: 'Preferensi manusia bersifat fluid, metrik institusional berfluktuasi.', fix: 'Re-assessment berkala disarankan setiap 6-12 bulan.' },
                            { icon: AlertTriangle, title: 'Rank Reversal', limit: 'Penambahan/penghapusan alternatif dapat mengubah peringkat relatif.', fix: 'TOPSIS termodifikasi + AHP eigen menurunkan probabilitas secara signifikan.' },
                            { icon: Clock, title: 'Beban Kognitif', limit: '10 kriteria = 45 perbandingan → potensi Decision Fatigue.', fix: 'Maksimal 7 kriteria utama, save & resume, adaptive questioning.' },
                            { icon: Database, title: 'Kualitas Data Input', limit: '"Garbage in, garbage out" tetap berlaku.', fix: 'Data validation layer, multiple source verification, timestamp freshness.' },
                        ].map((l) => (
                            <motion.div
                                key={l.title}
                                className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.03] p-6 group hover:border-amber-400/30 transition-colors"
                                variants={itemVariants}
                                whileHover={{ x: 4 }}
                            >
                                <l.icon className="h-5 w-5 text-amber-400" />
                                <h4 className="mt-3 font-semibold" style={font}>{l.title}</h4>
                                <p className="mt-2 text-sm text-slate-400"><strong className="text-amber-200">Limitasi:</strong> {l.limit}</p>
                                <p className="mt-1 text-sm text-slate-400"><strong className="text-emerald-300">Mitigasi:</strong> {l.fix}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-8 rounded-2xl border border-white/8 bg-white/[0.02] p-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="font-semibold text-sm" style={font}>Komitmen Transparansi</h4>
                        <div className="mt-3 grid gap-2 md:grid-cols-2 text-xs text-slate-400">
                            {['Confidence score untuk setiap rekomendasi', 'Breakdown reasoning lengkap', 'Sensitivity analysis tersedia', 'Disclaimer: rekomendasi = guidance, bukan keputusan final', 'Konsultasi konselor profesional tetap dianjurkan', 'Sistem menampilkan confidence interval untuk top 3'].map((t, i) => (
                                <motion.div
                                    key={t}
                                    className="flex items-start gap-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                >
                                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />{t}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section 8: Roadmap */}
            <section id="roadmap" className="relative py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-10">
                    <motion.div
                        className="mx-auto max-w-3xl text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs tracking-[0.2em] text-violet-300 uppercase">
                            <Cpu className="h-3.5 w-3.5" /> Evolusi Berkelanjutan
                        </div>
                        <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                            Roadmap <span className="text-violet-400">Teknologi</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {[
                            { q: 'Q3 2026', title: 'Fuzzy Logic', desc: 'Interval preferensi untuk menangani ambiguitas kognitif. "Saya 70-85% yakin..."', color: '#8B5CF6' },
                            { q: 'Q4 2026', title: 'Machine Learning', desc: 'XGBoost classifier untuk prediksi drop-out risk dan burnout prediction.', color: '#A78BFA' },
                            { q: 'Q1 2027', title: 'Big Data & Real-Time', desc: 'Streaming real-time dari multiple sources. LLM integration untuk interaksi natural.', color: '#C4B5FD' },
                            { q: 'Q2 2027', title: 'Collaborative Intelligence', desc: 'Hybrid AI + Human expert: rekomendasi algoritmik direview konselor BK bersertifikat.', color: '#DDD6FE' },
                        ].map((r) => (
                            <motion.div
                                key={r.q}
                                className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition hover:border-violet-400/30 group relative overflow-hidden"
                                variants={itemVariants}
                                whileHover={{ y: -4, scale: 1.02 }}
                            >
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(circle at top left, ${r.color}10 0%, transparent 60%)` }}
                                />
                                <div className="relative z-10">
                                    <div className="text-xs font-mono font-bold tracking-[0.2em] uppercase" style={{ color: r.color }}>{r.q}</div>
                                    <h4 className="mt-2 font-semibold" style={font}>{r.title}</h4>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">{r.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
}
