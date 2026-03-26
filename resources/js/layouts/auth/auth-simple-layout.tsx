import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import LaserFlow from '@/components/laser-flow';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const heroMessages = [
    'Rekomendasi jurusan yang lebih terarah dan meyakinkan.',
    'Keputusan akademik yang lebih jelas, terukur, dan percaya diri.',
    'Assessment yang membantu Anda memilih jurusan dengan lebih pasti.',
    'Analitik keputusan untuk langkah studi yang lebih tepat sasaran.',
];

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    usePage().props;
    const desktopPanelHeight = 'min(42rem, calc(100svh - 9rem))';
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const [typedHeroText, setTypedHeroText] = useState('');
    const [isDeletingHero, setIsDeletingHero] = useState(false);

    useEffect(() => {
        const currentMessage = heroMessages[activeHeroIndex];
        const typingDelay = isDeletingHero ? 22 : 42;
        const holdDelay = isDeletingHero ? 120 : 1400;

        const timeout = window.setTimeout(() => {
            if (!isDeletingHero) {
                const nextText = currentMessage.slice(0, typedHeroText.length + 1);
                setTypedHeroText(nextText);

                if (nextText === currentMessage) {
                    window.setTimeout(() => {
                        setIsDeletingHero(true);
                    }, holdDelay);
                }

                return;
            }

            const nextText = currentMessage.slice(0, Math.max(0, typedHeroText.length - 1));
            setTypedHeroText(nextText);

            if (nextText.length === 0) {
                setIsDeletingHero(false);
                setActiveHeroIndex((current) => (current + 1) % heroMessages.length);
            }
        }, typingDelay);

        return () => window.clearTimeout(timeout);
    }, [activeHeroIndex, isDeletingHero, typedHeroText]);

    return (
        <div className="relative min-h-svh overflow-hidden bg-[linear-gradient(160deg,#0a0118_0%,#030008_54%,#060010_100%)] text-white">
            <div className="relative grid min-h-svh lg:h-svh lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
                <div className="relative hidden overflow-hidden lg:flex">
                    {/* Unified background from parent */}

                    <div className="relative z-10 grid h-full w-full grid-rows-[auto_1fr] px-8 pt-8 pb-8 xl:px-10 xl:pt-10 xl:pb-10">
                        <div className="pb-6 xl:pb-8">
                            <Link
                                href={home()}
                                className="inline-block"
                            >
                                <img
                                    src="/assets/logo-login.png"
                                    alt="MajorMind"
                                    className="h-12 w-auto object-contain xl:h-14"
                                />
                            </Link>
                        </div>

                        <div className="flex min-h-0 items-stretch">
                            <div
                                className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/6 bg-[#060010]"
                                style={{ height: desktopPanelHeight }}
                            >
                                <LaserFlow
                                    className="absolute inset-0"
                                    horizontalBeamOffset={0.1}
                                    verticalBeamOffset={0}
                                    color="#CF9EFF"
                                    horizontalSizing={0.5}
                                    verticalSizing={2}
                                    wispDensity={1}
                                    wispSpeed={15}
                                    wispIntensity={5}
                                    flowSpeed={0.35}
                                    flowStrength={0.25}
                                    fogIntensity={0.45}
                                    fogScale={0.3}
                                    fogFallSpeed={0.6}
                                    decay={1.1}
                                    falloffStart={1.2}
                                />

                                <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-[#cf9eff]/10" />

                                <div className="absolute left-1/2 top-1/2 z-10 h-[66%] w-[86%] -translate-x-1/2 rounded-[30px] border-2 border-[#CF9EFF] bg-[#060010] shadow-[0_0_0_1px_rgba(207,158,255,0.08)]">
                                    <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(rgba(207,158,255,0.16)_1px,transparent_1px)] [background-size:26px_26px] opacity-20" />
                                    <div className="flex h-full items-start px-10 pt-14 pb-10 xl:px-12 xl:pt-16 xl:pb-12">
                                        <div className="w-full">
                                            <h2
                                                className="max-w-[11ch] text-[2.85rem] font-semibold leading-[1.02] tracking-[-0.06em] text-white xl:text-[3.25rem]"
                                            >
                                                {typedHeroText}
                                                <span className="ml-1 inline-block h-[0.92em] w-[2px] translate-y-1 bg-[#f1ddff] align-middle animate-pulse" />
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative px-6 py-8 md:px-10 lg:py-8">
                    <div className="grid h-full w-full justify-center lg:grid-rows-[auto_1fr]">
                        <Link
                            href={home()}
                            className="mb-8 inline-block lg:hidden"
                        >
                            <img
                                src="/assets/logo-main.png"
                                alt="MajorMind"
                                className="h-9 w-auto object-contain"
                            />
                        </Link>

                        <div className="hidden pb-6 lg:block xl:pb-8">
                            <div className="h-14 xl:h-16" />
                        </div>

                        <div className="flex min-h-0 items-stretch justify-center">
                            <div className="w-full max-w-md">
                                {/* Purple glow wrapper */}
                                <div
                                    className="relative rounded-[32px] p-[1.5px]"
                                    style={{
                                        background: 'linear-gradient(160deg, rgba(207,158,255,0.45), rgba(207,158,255,0.08) 40%, rgba(207,158,255,0.04) 60%, rgba(207,158,255,0.35))',
                                        boxShadow: '0 0 60px rgba(207,158,255,0.08), 0 0 120px rgba(207,158,255,0.04)',
                                    }}
                                >
                                    <div
                                        className="rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-8 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl xl:px-10 xl:py-10"
                                        style={{
                                            minHeight: desktopPanelHeight,
                                            background: 'linear-gradient(180deg, rgba(12,4,28,0.97), rgba(6,0,16,0.99))',
                                        }}
                                    >
                                        <div className="mb-6 space-y-3 xl:mb-8">
                                            
                                            <h1 className="text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.05em] text-white xl:text-3xl">
                                                {title}
                                            </h1>
                                            {description ? (
                                                <p className="text-sm leading-7 text-slate-400">
                                                    {description}
                                                </p>
                                            ) : null}
                                        </div>
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
