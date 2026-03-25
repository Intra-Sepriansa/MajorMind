import { Star, Quote, Users, BarChart3, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useCountUp } from '@/hooks/use-animations';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const testimonials = [
    { name: 'Rina Wijaya', role: 'Mahasiswa DKV, Universitas Indonesia', text: 'Saya hampir salah pilih jurusan karena ikut teman. MajorMind menunjukkan bahwa profil saya lebih cocok dengan DKV. Sekarang IPK saya 3.8 dan sangat menikmati kuliah!', avatar: 'RW', color: '#EC4899' },
    { name: 'Bpk. Hendra Kusuma, M.Pd.', role: 'Guru BK SMK Negeri 1 Jakarta', text: 'Sebagai konselor 15 tahun pengalaman, MajorMind memberikan objektivitas yang tidak bisa saya berikan secara konsisten ke 200+ siswa. Ini memperkuat rekomendasi saya dengan data.', avatar: 'HK', color: '#3B82F6' },
    { name: 'Ibu Sari Lestari', role: 'Orang Tua Siswa', text: 'Investasi Rp 299.000 ini tidak ada apa-apanya dibanding risiko anak saya salah jurusan dan DO. Laporannya sangat detail, membantu kami berdiskusi dengan data, bukan emosi.', avatar: 'SL', color: '#10B981' },
    { name: 'Kepala Sekolah SMK N 1', role: 'Tapalang Barat', text: 'Tingkat drop-out alumni kami di tahun pertama kuliah turun dari 23% menjadi 8% setelah menggunakan MajorMind untuk penjurusan.', avatar: 'KS', color: '#F59E0B' },
];

function AnimatedStatValue({ end, suffix, label, icon: Icon }: { end: number; suffix: string; label: string; icon: React.ElementType }) {
    const { ref, display } = useCountUp(end, 2000, suffix);
    return (
        <motion.div
            ref={ref}
            className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-center group hover:border-[#ff2d20]/20 transition-colors"
            whileHover={{ scale: 1.05, y: -4 }}
        >
            <Icon className="mx-auto h-5 w-5 text-[#ff2d20]/60 mb-2" />
            <div className="text-3xl font-bold text-[#ff2d20]" style={font}>{display}</div>
            <div className="mt-1 text-sm text-slate-400">{label}</div>
        </motion.div>
    );
}

function LiveActivityToast() {
    const [activities, setActivities] = useState<Array<{ id: number; name: string; action: string }>>([]);

    useEffect(() => {
        const names = ['Ahmad', 'Siti', 'Budi', 'Rina', 'Doni', 'Maya', 'Putri', 'Fajar'];
        const cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogya', 'Medan', 'Makassar'];
        const actions = [
            'baru saja menyelesaikan asesmen',
            'mendapat rekomendasi Teknik Informatika',
            'download PDF report',
            'bergabung dengan MajorMind',
        ];

        const addActivity = () => {
            const newActivity = {
                id: Date.now(),
                name: `${names[Math.floor(Math.random() * names.length)]} dari ${cities[Math.floor(Math.random() * cities.length)]}`,
                action: actions[Math.floor(Math.random() * actions.length)],
            };
            setActivities((prev) => [newActivity, ...prev].slice(0, 1));
        };

        const timeout = setTimeout(addActivity, 3000);
        const interval = setInterval(addActivity, 6000);
        return () => { clearTimeout(timeout); clearInterval(interval); };
    }, []);

    return (
        <div className="fixed bottom-6 left-6 z-40 w-80 hidden lg:block">
            <AnimatePresence>
                {activities.map((a) => (
                    <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: 20, x: -40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="flex items-center gap-3 p-3 bg-[#0b0e14]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl"
                    >
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff2d20]/40 to-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-white">
                                {a.name.charAt(0)}
                            </div>
                            <motion.div
                                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#0b0e14]"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-white truncate">{a.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{a.action}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default function SocialProofSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setActiveIndex((prev) => (prev + 1) % testimonials.length), 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <LiveActivityToast />

            <section id="social-proof" className="relative py-24 border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-10">
                    <motion.div
                        className="mx-auto max-w-3xl text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs tracking-[0.2em] text-emerald-300 uppercase">
                            <Star className="h-3.5 w-3.5" /> Bukti Empiris
                        </div>
                        <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                            Validasi & <span className="text-emerald-400">Social Proof</span>
                        </h2>
                    </motion.div>

                    {/* Stats with animated counters */}
                    <motion.div
                        className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <AnimatedStatValue end={10000} suffix="+" label="Siswa Terlayani" icon={Users} />
                        <AnimatedStatValue end={95} suffix=".71%" label="Akurasi Rekomendasi" icon={BarChart3} />
                        <AnimatedStatValue end={92} suffix="%" label="Tingkat Kepuasan" icon={ShieldCheck} />
                        <AnimatedStatValue end={4} suffix=".7/5.0" label="Rating Pengguna" icon={Star} />
                    </motion.div>

                    {/* Testimonial Carousel */}
                    <div className="mt-12 relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] min-h-[280px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 80 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -80 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="p-8 md:p-10"
                            >
                                <Quote className="h-8 w-8 mb-4" style={{ color: `${testimonials[activeIndex].color}60` }} />
                                <p className="text-lg md:text-xl leading-8 text-slate-300 italic">
                                    "{testimonials[activeIndex].text}"
                                </p>
                                <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                                        style={{ background: `linear-gradient(135deg, ${testimonials[activeIndex].color}50, ${testimonials[activeIndex].color}20)` }}
                                    >
                                        {testimonials[activeIndex].avatar}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">{testimonials[activeIndex].name}</div>
                                        <div className="text-xs text-slate-500">{testimonials[activeIndex].role}</div>
                                    </div>
                                    <div className="ml-auto flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {testimonials.map((t, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: i === activeIndex ? 24 : 8,
                                        backgroundColor: i === activeIndex ? t.color : '#ffffff20',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Impact highlight */}
                    <motion.div
                        className="mt-8 grid gap-4 md:grid-cols-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {[
                            { val: '87%', label: 'Merasa lebih confident dengan pilihan jurusan' },
                            { val: '78%', label: 'Melanjutkan ke jurusan yang direkomendasikan' },
                            { val: '23% → 8%', label: 'Penurunan drop-out rate di sekolah mitra' },
                        ].map((s) => (
                            <motion.div
                                key={s.label}
                                className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-5 text-center"
                                whileHover={{ scale: 1.03, y: -2 }}
                            >
                                <div className="text-2xl font-bold text-emerald-400" style={font}>{s.val}</div>
                                <div className="mt-1 text-xs text-slate-400">{s.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
}
