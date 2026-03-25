import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const font = { fontFamily: '"Space Grotesk", var(--font-sans)' };

const faqs = [
    { q: 'Apakah sistem ini bisa 100% menjamin saya tidak akan menyesal?', a: 'Tidak ada sistem yang bisa menjamin 100%, termasuk intuisi Anda sendiri. Yang kami jamin adalah: rekomendasi kami didasarkan pada 95.71% akurasi historis, validasi matematis ketat (CR<0.1), dan data objektif dari BAN-PT & Tracer Study. Ini jauh lebih reliable daripada "ikut teman" atau "feeling".', tag: 'Akurasi' },
    { q: 'Bagaimana jika saya tidak setuju dengan rekomendasi sistem?', a: 'Sistem adalah decision support, bukan decision maker. Anda tetap pemegang keputusan final. Namun, kami sarankan untuk memahami reasoning di balik rekomendasi sebelum mengabaikannya. Sering kali, sistem menemukan insight yang tidak terlihat secara intuitif.', tag: 'Umum' },
    { q: 'Apakah data saya aman?', a: 'Sangat aman. Kami menggunakan enkripsi end-to-end, compliance dengan UU Perlindungan Data Pribadi, dan tidak pernah menjual data ke pihak ketiga. Data Anda hanya digunakan untuk menghasilkan rekomendasi personal.', tag: 'Keamanan' },
    { q: 'Berapa lama proses asesmen?', a: 'Total sekitar 50 menit untuk asesmen lengkap. Anda bisa pause dan resume kapan saja. Komputasi algoritma hanya butuh 30 detik.', tag: 'Proses' },
    { q: 'Apakah cocok untuk siswa SMA IPA/IPS juga?', a: 'Absolut! Sistem dirancang untuk semua latar belakang: SMK, SMA IPA, SMA IPS, MA. Algoritma akan menyesuaikan kriteria evaluasi berdasarkan profil Anda.', tag: 'Umum' },
    { q: 'Bagaimana jika saya ingin ganti jurusan setelah kuliah?', a: 'Anda bisa re-assessment kapan saja (paket Student/Premium). Sistem akan memberikan rekomendasi pivot berdasarkan kondisi terbaru Anda.', tag: 'Fitur' },
    { q: 'Apakah rekomendasi hanya untuk PTN?', a: 'Database kami mencakup PTN, PTS, Politeknik, dan Institut. Anda bisa filter berdasarkan preferensi.', tag: 'Database' },
    { q: 'Bagaimana sistem menangani jurusan baru tanpa data Tracer Study?', a: 'Untuk jurusan emerging (AI, Blockchain, dll), sistem menggunakan proxy data dari jurusan terdekat dan industry trend analysis. Kami transparan menampilkan "confidence level" untuk setiap rekomendasi.', tag: 'Teknis' },
    { q: 'Apakah ada batasan usia?', a: 'Tidak ada batasan. Sistem cocok untuk siswa kelas 12, gap year, atau profesional yang ingin kuliah lagi.', tag: 'Umum' },
];

function FaqItem({ q, a, tag, index }: { q: string; a: string; tag: string; index: number }) {
    const [open, setOpen] = useState(false);

    const tagColors: Record<string, string> = {
        Akurasi: '#FF6B6B',
        Umum: '#3B82F6',
        Keamanan: '#10B981',
        Proses: '#F59E0B',
        Fitur: '#8B5CF6',
        Database: '#EC4899',
        Teknis: '#06B6D4',
    };

    return (
        <motion.div
            className={`rounded-2xl border transition-colors duration-300 ${open ? 'border-[#ff2d20]/20 bg-white/[0.03]' : 'border-white/8 bg-white/[0.01] hover:border-white/15'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-6 py-5 text-left gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span
                        className="shrink-0 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: `${tagColors[tag] || '#ffffff'}20`, color: tagColors[tag] || '#fff' }}
                    >
                        {tag}
                    </span>
                    <span className="text-sm font-medium text-white">{q}</span>
                </div>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0"
                >
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-5 text-sm leading-7 text-slate-400">{a}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FaqSection() {
    const [search, setSearch] = useState('');

    const filteredFaqs = faqs.filter(
        (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()) || f.tag.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section id="faq" className="relative py-24 border-t border-white/5">
            <div className="mx-auto max-w-3xl px-6 lg:px-10">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs tracking-[0.2em] text-slate-300 uppercase">
                        <HelpCircle className="h-3.5 w-3.5" /> FAQ
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] md:text-5xl" style={font}>
                        Jawaban untuk <span className="text-[#ff2d20]">Keraguan</span>
                    </h2>
                </motion.div>

                {/* Search */}
                <motion.div
                    className="mt-8 relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Cari pertanyaan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff2d20]/30 focus:ring-1 focus:ring-[#ff2d20]/20 transition-colors"
                    />
                </motion.div>

                <div className="mt-6 space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredFaqs.map((f, i) => (
                            <FaqItem key={f.q} q={f.q} a={f.a} tag={f.tag} index={i} />
                        ))}
                    </AnimatePresence>
                    {filteredFaqs.length === 0 && (
                        <motion.p
                            className="text-center text-sm text-slate-500 py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            Tidak ditemukan pertanyaan yang cocok.
                        </motion.p>
                    )}
                </div>
            </div>
        </section>
    );
}
