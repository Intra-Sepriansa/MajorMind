import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, TrendingDown, AlertTriangle, UserX, Clock } from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import { useCountUp, useTypewriter } from '@/hooks/use-animations';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import FloatingParticles from './floating-particles';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

function AnimatedStat({ end, suffix, label, icon: Icon, delay = 0 }: { end: number; suffix: string; label: string; icon: React.ElementType; delay?: number }) {
    const { ref, display } = useCountUp(end, 2200, suffix);
    return (
        <motion.div
            ref={ref}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center backdrop-blur-sm"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 + delay, type: 'spring' as const, stiffness: 100 }}
            whileHover={{ scale: 1.05, borderColor: 'rgba(255,45,32,0.3)', transition: { duration: 0.2 } }}
        >
            <Icon className="mx-auto h-5 w-5 text-[#ff2d20]" />
            <div className="mt-2 text-2xl font-bold tracking-tight" style={font}>{display}</div>
            <div className="mt-1 text-[11px] leading-4 text-slate-500">{label}</div>
        </motion.div>
    );
}

function ScrollIndicator() {
    return (
        <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
            <span className="text-[10px] tracking-[0.3em] text-slate-500 uppercase">Scroll to Explore</span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
                <motion.div
                    className="w-1 h-1 rounded-full bg-[#ff2d20]"
                    animate={{ y: [0, 14, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>
        </motion.div>
    );
}

function GlowButton({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="group relative inline-flex h-13 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2d20] to-[#ff4f47] px-7 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(255,45,32,0.3)] transition-all hover:shadow-[0_20px_50px_rgba(255,45,32,0.4)] hover:scale-[1.02] overflow-hidden"
        >
            {/* Shine sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <span className="relative flex items-center gap-2">
                {children}
            </span>
        </Link>
    );
}

export default function HeroSection({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;
    const heroText = 'Salah Pilih Jurusan = ';
    const tw = useTypewriter(heroText, 60, 300);

    // Mouse-responsive gradient
    const mouseX = useMotionValue(50);
    const mouseY = useMotionValue(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
        mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
    }, [mouseX, mouseY]);

    const gradientX = useTransform(mouseX, [0, 100], [20, 80]);
    const gradientY = useTransform(mouseY, [0, 100], [20, 80]);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0b0e14]/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
                    <div className="flex items-center gap-3">
                        <motion.img
                            src="/assets/logo-main.png"
                            alt="MajorMind Logo"
                            className="h-10 w-10 rounded-2xl shadow-[0_12px_30px_rgba(255,45,32,0.16)]"
                            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, type: 'spring' as const }}
                        />
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="text-lg font-semibold tracking-[-0.04em]" style={font}>MajorMind</div>
                            <div className="text-[10px] tracking-[0.3em] text-slate-500 uppercase">Intelligent DSS</div>
                        </motion.div>
                    </div>
                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link href={dashboard()} className="inline-flex h-10 items-center rounded-full border border-[#ff2d20]/40 bg-[#ff2d20] px-5 text-sm font-medium text-black transition hover:bg-[#ff584d]">Open Dashboard</Link>
                        ) : (
                            <>
                                <Link href={login()} className="inline-flex h-10 items-center rounded-full border border-white/10 px-5 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.04]">Log in</Link>
                                {canRegister && <Link href={register()} className="inline-flex h-10 items-center rounded-full border border-[#ff2d20]/40 bg-[#ff2d20] px-5 text-sm font-medium text-black transition hover:bg-[#ff584d]">Create account</Link>}
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <section id="hero" ref={containerRef} onMouseMove={handleMouseMove} className="relative flex min-h-[90vh] items-center">
                {/* Animated gradient mesh background */}
                <div className="pointer-events-none absolute inset-0">
                    <motion.div
                        className="absolute top-[-10%] left-[-8%] h-96 w-96 rounded-full bg-[#ff2d20]/18 blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 30, 0],
                            y: [0, -20, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute top-1/4 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[#ff2d20]/10 blur-3xl"
                        animate={{
                            scale: [1, 1.15, 1],
                            x: [0, -40, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    />
                    <motion.div
                        className="absolute bottom-[-16%] left-1/3 h-80 w-80 rounded-full bg-white/6 blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, 20, 0],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    />
                </div>

                {/* Floating particles */}
                <FloatingParticles count={25} />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
                    <div className="space-y-8">
                        <motion.div
                            className="inline-flex items-center gap-2 rounded-full border border-[#ff2d20]/20 bg-[#ff2d20]/10 px-4 py-2 text-xs tracking-[0.2em] text-[#ffb4ae] uppercase"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Krisis Pemilihan Jurusan
                        </motion.div>

                        <motion.h1
                            ref={tw.ref}
                            className="max-w-3xl text-4xl leading-[1.08] font-bold tracking-[-0.04em] md:text-6xl lg:text-7xl"
                            style={font}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            {tw.started ? (
                                <>
                                    {tw.displayed}
                                    <span className="bg-gradient-to-r from-[#ff2d20] to-[#ff6b61] bg-clip-text text-transparent">
                                        {tw.displayed.length >= heroText.length ? '4 Tahun Terbuang' : ''}
                                    </span>
                                    {tw.displayed.length < heroText.length && <span className="inline-block w-[3px] h-[0.9em] bg-[#ff2d20] ml-1 animate-[pulse_1s_steps(2)_infinite]" />}
                                </>
                            ) : (
                                <span className="opacity-0">Salah Pilih Jurusan = 4 Tahun Terbuang</span>
                            )}
                        </motion.h1>

                        <motion.p
                            className="max-w-xl text-lg leading-8 text-slate-400"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            Lebih dari <strong className="text-white">30% mahasiswa menyesal</strong> dengan pilihan jurusan mereka. MajorMind menggunakan algoritma <strong className="text-[#ff2d20]">AHP-TOPSIS</strong> dengan akurasi <strong className="text-white">95.71%</strong> untuk menemukan jurusan yang benar-benar cocok — secara ilmiah.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap items-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <GlowButton href={auth.user ? String(dashboard()) : '/assessment'}>
                                Temukan Jurusan Ideal Anda
                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </motion.span>
                            </GlowButton>
                            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-[#ff2d20]/60" />
                                Hanya 50 menit • Gratis untuk asesmen pertama
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <AnimatedStat end={40} suffix="%" label="Lulusan SMK TIK tidak lanjut PT" icon={TrendingDown} delay={0} />
                            <AnimatedStat end={30} suffix="%+" label="Mahasiswa menyesal pilih jurusan" icon={UserX} delay={0.15} />
                            <AnimatedStat end={95} suffix=".71%" label="Akurasi rekomendasi MajorMind" icon={ShieldCheck} delay={0.3} />
                        </div>
                    </div>

                    {/* AHP Matrix card with glassmorphism */}
                    <motion.div
                        className="rounded-[32px] border border-white/10 bg-black/60 backdrop-blur-xl p-4 shadow-[0_30px_120px_rgba(0,0,0,0.35)]"
                        initial={{ opacity: 0, x: 60, rotateY: -15 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, type: 'spring' as const, stiffness: 80 }}
                        whileHover={{ scale: 1.02, boxShadow: '0 30px 120px rgba(255,45,32,0.12)' }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                            <motion.span className="h-3 w-3 rounded-full bg-[#ff5f56]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} />
                            <motion.span className="h-3 w-3 rounded-full bg-[#ffbd2e]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
                            <motion.span className="h-3 w-3 rounded-full bg-[#27c93f]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
                            <span className="ml-2 text-xs tracking-[0.3em] text-slate-500 uppercase">recommendation.engine</span>
                        </div>
                        <div className="grid gap-5 p-4 md:p-5">
                            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs tracking-[0.3em] text-slate-500 uppercase">Live AHP Matrix</span>
                                    <motion.span
                                        className="rounded-full border border-[#ff2d20]/25 bg-[#ff2d20]/10 px-3 py-1 text-xs text-[#ffb4ae]"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        CR ≤ 0.1
                                    </motion.span>
                                </div>
                                <div className="mt-3 space-y-2">
                                    {[['1.000','3.000','5.000','7.000'],['0.333','1.000','3.000','5.000'],['0.200','0.333','1.000','3.000'],['0.143','0.200','0.333','1.000']].map((row, ri) => (
                                        <motion.div
                                            key={row.join('-')}
                                            className="grid grid-cols-4 gap-1.5 font-mono text-xs"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.2 + ri * 0.1 }}
                                        >
                                            {row.map((c, i) => <div key={i} className="rounded-lg border border-white/8 bg-[#0b0e14] px-2 py-1.5 text-center text-slate-200">{c}</div>)}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.6 }}
                                >
                                    <span className="text-xs tracking-[0.3em] text-slate-500 uppercase">Eigenvector</span>
                                    <div className="mt-2 font-mono text-xs text-slate-300 space-y-1">
                                        <div className="rounded-lg bg-[#0b0e14] px-3 py-1.5">w = [0.558, 0.263, 0.122, 0.057]</div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.8 }}
                                >
                                    <span className="text-xs tracking-[0.3em] text-slate-500 uppercase">TOPSIS Score</span>
                                    <div className="mt-2 space-y-1 font-mono text-xs text-slate-300">
                                        <div className="rounded-lg bg-[#0b0e14] px-3 py-1.5">D⁺ = 0.041</div>
                                        <div className="rounded-lg bg-[#0b0e14] px-3 py-1.5">Ci = <span className="text-[#ff2d20] font-bold">0.924</span></div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <ScrollIndicator />
            </section>
        </>
    );
}
