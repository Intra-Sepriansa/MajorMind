import { GitCompare, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const rows = [
    { param: 'Metode Bobot', saw: 'Manual/Statis', pm: 'Gap Core/Secondary', topsis: 'Pre-defined', hybrid: 'Eigenvector' },
    { param: 'Mitigasi Bias', saw: 'Tidak ada', pm: 'Rendah', topsis: 'Tidak ada', hybrid: 'Sangat Tinggi (CR<0.1)' },
    { param: 'Logika Evaluasi', saw: 'Penjumlahan Linear', pm: 'Selisih dari Ideal', topsis: 'Jarak Geometris', hybrid: 'Jarak Geometris Terbobot' },
    { param: 'Handling Outlier', saw: 'Rentan', pm: 'Moderat', topsis: 'Tangguh', hybrid: 'Sangat Tangguh' },
    { param: 'Validasi Konsistensi', saw: '✗', pm: '✗', topsis: '✗', hybrid: '✓ (CR Audit)' },
    { param: 'Akurasi Historis', saw: '68.64%', pm: '45%', topsis: '73%', hybrid: '95.71%' },
];

const methods = [
    { name: 'SAW', acc: 68.64, weakness: 'Bobot arbitrary, tidak ada validasi preferensi user, rentan distorsi outlier.' },
    { name: 'Profile Matching', acc: 45, weakness: 'Hanya single-target, tidak scalable untuk ratusan alternatif.' },
    { name: 'TOPSIS Standalone', acc: 73, weakness: 'Tidak memiliki pembobotan psikometrik, bergantung bobot pre-defined.' },
    { name: 'AHP-TOPSIS Hybrid', acc: 95.71, weakness: 'AHP menambal kelemahan pembobotan TOPSIS. TOPSIS menambal keterbatasan skalabilitas AHP. Validasi ganda.' },
];

export default function ComparisonSection() {
    return (
        <section id="comparison" className="relative py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <motion.div
                    className="mx-auto max-w-3xl text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs tracking-[0.2em] text-blue-300 uppercase">
                        <GitCompare className="h-3.5 w-3.5" /> Analisis Komparatif
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                        Mengapa AHP-TOPSIS <span className="text-[#ff2d20]">Superior</span>
                    </h2>
                </motion.div>

                <motion.div
                    className="mt-12 overflow-x-auto rounded-3xl border border-white/8 bg-white/[0.02]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/8">
                                <th className="px-6 py-4 text-left text-xs tracking-[0.2em] text-slate-500 uppercase">Parameter</th>
                                <th className="px-4 py-4 text-center text-xs tracking-[0.2em] text-slate-500 uppercase">SAW/SMART</th>
                                <th className="px-4 py-4 text-center text-xs tracking-[0.2em] text-slate-500 uppercase">Profile Matching</th>
                                <th className="px-4 py-4 text-center text-xs tracking-[0.2em] text-slate-500 uppercase">TOPSIS Murni</th>
                                <th className="px-4 py-4 text-center text-xs tracking-[0.2em] text-[#ff2d20] uppercase font-bold">
                                    <span className="flex items-center justify-center gap-1">
                                        <Trophy className="h-3.5 w-3.5" /> AHP-TOPSIS
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <motion.tr
                                    key={r.param}
                                    className={`border-b border-white/5 transition-colors hover:bg-white/[0.03] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.06 }}
                                >
                                    <td className="px-6 py-3 font-medium text-white">{r.param}</td>
                                    <td className="px-4 py-3 text-center text-slate-400">{r.saw}</td>
                                    <td className="px-4 py-3 text-center text-slate-400">{r.pm}</td>
                                    <td className="px-4 py-3 text-center text-slate-400">{r.topsis}</td>
                                    <td className="px-4 py-3 text-center font-semibold text-emerald-400">{r.hybrid}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Animated accuracy bars */}
                <motion.div
                    className="mt-12 grid gap-4 md:grid-cols-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {methods.map((m, i) => {
                        const isHybrid = m.name.includes('Hybrid');
                        return (
                            <motion.div
                                key={m.name}
                                className={`rounded-2xl border p-6 relative overflow-hidden group ${isHybrid ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-white/8 bg-white/[0.02]'}`}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + i * 0.12 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                            >
                                {/* Shimmer effect */}
                                {isHybrid && (
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent animate-[shimmer_3s_linear_infinite]" />
                                    </div>
                                )}
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold" style={font}>{m.name}</h4>
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${isHybrid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'}`}>{m.acc}%</span>
                                    </div>
                                    {/* Accuracy bar */}
                                    <div className="mt-3 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${isHybrid ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]' : 'bg-white/20'}`}
                                            initial={{ width: '0%' }}
                                            whileInView={{ width: `${m.acc}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 + i * 0.15 }}
                                        />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-400">{m.weakness}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </section>
    );
}
