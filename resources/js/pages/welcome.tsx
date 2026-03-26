import { Head } from '@inertiajs/react';
import { motion, useScroll, useSpring } from 'framer-motion';
import HeroSection from '@/components/landing/hero-section';
import ProblemSection from '@/components/landing/problem-section';
import SolutionSection from '@/components/landing/solution-section';
import CenterFlow from '@/components/landing/center-flow';
import MethodologySection from '@/components/landing/methodology-section';
import ComparisonSection from '@/components/landing/comparison-section';
import DataTransparencySection from '@/components/landing/data-transparency-section';
import SocialProofSection from '@/components/landing/social-proof-section';
import HowItWorksSection from '@/components/landing/how-it-works-section';
import FaqSection from '@/components/landing/faq-section';
import CtaSection from '@/components/landing/cta-section';

function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff2d20] via-[#ff6b61] to-[#ff2d20] origin-left z-[60]"
            style={{ scaleX }}
        />
    );
}

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <>
            <Head title="MajorMind — Intelligent Decision Support System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=space-grotesk:400,500,700|jetbrains-mono:400,600"
                    rel="stylesheet"
                />
                <meta
                    name="description"
                    content="MajorMind menggunakan algoritma AHP-TOPSIS dengan akurasi 95.71% untuk merekomendasikan jurusan kuliah yang tepat secara ilmiah. Temukan jurusan ideal Anda."
                />
            </Head>

            <ScrollProgressBar />

            <div className="relative min-h-screen overflow-x-hidden bg-[#0b0e14] text-white scroll-smooth">
                <HeroSection canRegister={canRegister} />
                <ProblemSection />
                <SolutionSection />

                {/* Center Flow Animation */}
                <section className="relative py-16 border-t border-white/5">
                    <CenterFlow />
                    <div className="mx-auto max-w-7xl px-6 text-center mt-4">
                        <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">Alur Komputasi MajorMind</p>
                    </div>
                </section>

                <MethodologySection />
                <ComparisonSection />
                <DataTransparencySection />
                <SocialProofSection />
                <HowItWorksSection />
                <FaqSection />
                <CtaSection />
            </div>
        </>
    );
}
