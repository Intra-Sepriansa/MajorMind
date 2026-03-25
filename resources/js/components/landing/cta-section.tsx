import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, BarChart3, Users, Clock, Sparkles } from 'lucide-react';
import { dashboard } from '@/routes';
import { motion } from 'framer-motion';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};
const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } },
};

export default function CtaSection() {
    const { auth } = usePage().props;

    return (
        <>
            {/* Final CTA */}
            <section id="cta" className="relative py-24 border-t border-white/5 overflow-hidden">
                {/* Animated background orbs */}
                <div className="pointer-events-none absolute inset-0">
                    <motion.div
                        className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#ff2d20]/10 blur-3xl"
                        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, 20, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[#ff2d20]/8 blur-3xl"
                        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, -30, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#ff2d20]/5 blur-3xl"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    />
                </div>

                <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
                    <motion.div
                        className="inline-flex items-center gap-2 rounded-full border border-[#ff2d20]/20 bg-[#ff2d20]/10 px-4 py-2 text-xs tracking-[0.2em] text-[#ffb4ae] uppercase mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="h-3.5 w-3.5" /> Mulai Sekarang
                    </motion.div>

                    <motion.h2
                        className="text-3xl font-bold tracking-[-0.04em] md:text-5xl"
                        style={font}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        Jangan Biarkan Masa Depan 4 Tahun Ditentukan oleh <span className="text-[#ff2d20]">'Feeling'</span>
                    </motion.h2>
                    <motion.p
                        className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Lebih dari 10,000 siswa telah membuat keputusan yang lebih cerdas dengan MajorMind. Keputusan hari ini menentukan 40 tahun karir Anda ke depan.
                    </motion.p>

                    {/* Glassmorphism guarantee card */}
                    <motion.div
                        className="mt-8 mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, type: 'spring' as const }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white">30-hari Money-back Guarantee</div>
                                <div className="text-xs text-slate-400">Tidak puas? Uang Anda kembali 100%, tanpa pertanyaan.</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link
                            href={auth.user ? dashboard() : '/assessment'}
                            className="group relative inline-flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2d20] to-[#ff4f47] px-8 text-base font-semibold text-white shadow-[0_20px_60px_rgba(255,45,32,0.35)] transition-all hover:shadow-[0_25px_70px_rgba(255,45,32,0.45)] hover:scale-[1.02] overflow-hidden"
                        >
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                            <span className="relative flex items-center gap-2">
                                Mulai Asesmen Gratis
                                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ArrowRight className="h-5 w-5" />
                                </motion.span>
                            </span>
                        </Link>
                    </motion.div>

                    {/* Trust signals */}
                    <motion.div
                        className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {[
                            { icon: Users, text: '10,000+ siswa terlayani' },
                            { icon: BarChart3, text: '95.71% akurasi' },
                            { icon: ShieldCheck, text: '30-hari money-back guarantee' },
                            { icon: Clock, text: 'Digunakan 15+ sekolah' },
                        ].map((t) => (
                            <motion.div key={t.text} className="flex items-center gap-1.5" variants={itemVariants}>
                                <t.icon className="h-3.5 w-3.5 text-[#ff2d20]/60" />
                                {t.text}
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.p
                        className="mt-8 text-sm text-slate-500 italic max-w-lg mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        "Investasi Rp 99.000 hari ini bisa menghemat ratusan juta Rupiah dari salah jurusan. Masa depan Anda terlalu berharga untuk diserahkan pada kebetulan."
                    </motion.p>
                </div>
            </section>

            {/* Footer - Laravel.com Style */}
            <footer className="border-t border-white/8">
                <div className="mx-auto max-w-7xl px-6 lg:px-10">
                    <div className="flex items-center gap-6 py-6 text-sm text-slate-500">
                        <span>© 2026 MajorMind</span>
                        <a href="#" className="hover:text-white transition">Legal</a>
                        <a href="#" className="hover:text-white transition">Status</a>
                    </div>
                    <div className="pb-6 text-center">
                        <motion.div
                            className="text-[clamp(4rem,12vw,10rem)] font-bold leading-none tracking-[-0.04em] text-[#ff2d20]"
                            style={font}
                            initial={{ opacity: 0.3 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            MajorMind
                        </motion.div>
                    </div>
                </div>
            </footer>
        </>
    );
}
