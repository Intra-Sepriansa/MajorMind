import { Link, usePage } from '@inertiajs/react';
import { Check, Gem, Sparkles } from 'lucide-react';
import { dashboard } from '@/routes';
import { useTilt } from '@/hooks/use-animations';
import { motion } from 'framer-motion';
import React from 'react';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const plans = [
    {
        name: 'FREE', price: 'Gratis', sub: 'Eksplorasi Dasar', popular: false,
        features: ['1x asesmen lengkap', 'Top 3 rekomendasi jurusan', 'Basic reasoning explanation', 'Database 100+ jurusan', 'Community forum access'],
        cta: 'Mulai Gratis Sekarang', ctaStyle: 'border border-white/20 text-white hover:bg-white/10',
        gradient: 'from-slate-500/20 to-slate-600/10',
    },
    {
        name: 'STUDENT', price: 'Rp 99.000', sub: 'One-time Payment', popular: false,
        features: ['Unlimited asesmen (re-test)', 'Top 10 rekomendasi detail', 'Advanced comparison matrix', 'Database 500+ jurusan & 200+ universitas', 'PDF report download', 'Email support', 'Valid 1 tahun'],
        cta: 'Investasi Masa Depan', ctaStyle: 'border border-[#ff2d20]/40 bg-[#ff2d20] text-black hover:bg-[#ff584d]',
        badge: 'Harga 1x nonton bioskop untuk keputusan 4 tahun',
        gradient: 'from-[#ff2d20]/20 to-orange-500/10',
    },
    {
        name: 'PREMIUM', price: 'Rp 299.000', sub: 'One-time Payment', popular: true,
        features: ['Semua fitur Student', '2x konsultasi video call (@ 45 min)', 'Personalized career roadmap', 'Scholarship matching', 'Priority WhatsApp support', 'Lifetime access + future updates'],
        cta: 'Paket Paling Populer', ctaStyle: 'border border-[#ff2d20]/40 bg-[#ff2d20] text-black hover:bg-[#ff584d]',
        badge: 'Lebih murah dari 1 bulan les privat',
        gradient: 'from-[#ff2d20]/20 to-purple-500/10',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

function TiltCard({ children, popular, index }: { children: React.ReactNode; popular: boolean; index: number }) {
    const { ref, handleMove, handleLeave } = useTilt(6);
    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className={`relative rounded-3xl border p-7 transition-[box-shadow,border-color] duration-300 group overflow-hidden ${popular ? 'border-[#ff2d20]/40 bg-[#ff2d20]/[0.04] shadow-[0_0_60px_rgba(255,45,32,0.1)]' : 'border-white/8 bg-white/[0.02]'}`}
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease, box-shadow 0.3s ease' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, type: 'spring' as const, stiffness: 80 }}
        >
            {/* Hover glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${plans[index]?.gradient || ''}`} />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}

export default function PricingSection() {
    const { auth } = usePage().props;

    return (
        <section id="pricing" className="relative py-24 border-t border-white/5">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <motion.div
                    className="mx-auto max-w-3xl text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#ff2d20]/20 bg-[#ff2d20]/10 px-4 py-2 text-xs tracking-[0.2em] text-[#ffb4ae] uppercase">
                        <Gem className="h-3.5 w-3.5" /> Investasi Masa Depan
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                        Pilih <span className="text-[#ff2d20]">Paket</span> Anda
                    </h2>
                    <p className="mt-4 text-slate-400 text-sm">30-hari money-back guarantee • Enkripsi end-to-end • Data tidak dijual ke pihak ketiga</p>
                </motion.div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {plans.map((p, index) => (
                        <TiltCard key={p.name} popular={p.popular} index={index}>
                            {p.popular && (
                                <motion.div
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#ff2d20] px-4 py-1 text-xs font-bold text-black flex items-center gap-1 z-20"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sparkles className="h-3 w-3" /> 73% User Pilih Ini
                                </motion.div>
                            )}
                            <div className="text-xs font-mono font-bold tracking-[0.2em] text-slate-500 uppercase">{p.name}</div>
                            <div className="mt-2 text-3xl font-bold" style={font}>{p.price}</div>
                            <div className="text-xs text-slate-500">{p.sub}</div>
                            {p.badge && <div className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-400 italic">{p.badge}</div>}
                            <div className="mt-6 space-y-3">
                                {p.features.map((f, fi) => (
                                    <motion.div
                                        key={f}
                                        className="flex items-start gap-2 text-sm text-slate-300"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + fi * 0.05, duration: 0.3 }}
                                    >
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                                        {f}
                                    </motion.div>
                                ))}
                            </div>
                            <Link
                                href={auth.user ? dashboard() : '/assessment'}
                                className={`mt-8 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition ${p.ctaStyle}`}
                            >
                                {p.cta}
                            </Link>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
