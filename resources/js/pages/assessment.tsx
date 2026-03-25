import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { AssessmentWorkspace } from '@/components/assessment-workspace';
import AppLayout from '@/layouts/app-layout';
import { assessment, dashboard, home, login } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assessment',
        href: assessment(),
    },
];

export default function Assessment() {
    const { auth } = usePage<{
        auth: {
            user: { id: number; name: string } | null;
        };
    }>().props;

    if (auth.user) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Assessment Workspace">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=space-grotesk:400,500,700|jetbrains-mono:400,600"
                        rel="stylesheet"
                    />
                </Head>

                <div className="relative min-h-full overflow-hidden bg-[#0b0e14] text-white">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-[-8%] left-[-10%] h-80 w-80 rounded-full bg-[#ff2d20]/18 blur-3xl" />
                        <div className="absolute top-1/3 right-[-8%] h-96 w-96 rounded-full bg-[#ff2d20]/10 blur-3xl" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_24%)]" />
                    </div>

                    <div className="relative">
                        <AssessmentWorkspace mode="public" view="assessment" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <>
            <Head title="Public Assessment">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=space-grotesk:400,500,700|jetbrains-mono:400,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-[#0b0e14] text-white">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-[-10%] left-[-8%] h-96 w-96 rounded-full bg-[#ff2d20]/18 blur-3xl" />
                    <div className="absolute top-1/4 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[#ff2d20]/10 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_20%)]" />
                </div>

                <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-10">
                    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ff2d20] shadow-[0_12px_30px_rgba(255,45,32,0.16)]">
                                <BrainCircuit className="h-5 w-5" />
                            </div>
                            <div>
                                <div
                                    className="text-lg font-semibold tracking-[-0.04em]"
                                    style={{
                                        fontFamily:
                                            '"Space Grotesk", var(--font-sans)',
                                    }}
                                >
                                    MajorMind Public Assessment
                                </div>
                                <div className="text-xs tracking-[0.3em] text-slate-500 uppercase">
                                    Guest Session Enabled
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href={home()}
                                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.04]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back Home
                            </Link>
                            <Link
                                href={login()}
                                className="inline-flex h-11 items-center rounded-full border border-[#ff2d20]/40 bg-[#ff2d20] px-5 text-sm font-medium text-black transition hover:bg-[#ff584d]"
                            >
                                Login for synced dashboard
                            </Link>
                        </div>
                    </header>

                    <main className="flex-1 py-8">
                        <AssessmentWorkspace mode="public" view="assessment" />
                    </main>
                </div>
            </div>
        </>
    );
}
