import { Head } from '@inertiajs/react';
import { AssessmentWorkspace } from '@/components/assessment-workspace';
import { CommandCenter } from '@/components/command-center';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Download } from 'lucide-react';
import { useState } from 'react';
import type {
    AssessmentHistoryPaginated,
    AssessmentResponse,
    BreadcrumbItem,
} from '@/types';

type DashboardProps = {
    assessmentHistory?: AssessmentHistoryPaginated;
    claimNotice?: string | null;
    initialAssessment?: AssessmentResponse | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'MajorMind',
        href: dashboard(),
    },
];

export default function Dashboard({
    assessmentHistory = {
        data: [],
        meta: { current_page: 1, last_page: 1, per_page: 5, total: 0 },
    },
    claimNotice = null,
    initialAssessment = null,
}: DashboardProps) {
    const [exporting, setExporting] = useState(false);

    const handleExportPdf = async () => {
        if (!initialAssessment?.id) return;
        setExporting(true);
        try {
            const res = await fetch(`/dashboard/${initialAssessment.id}/export-pdf`);
            if (!res.ok) throw new Error('Failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MajorMind_Report_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            // silently fail
        } finally {
            setExporting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="MajorMind Dashboard">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=space-grotesk:400,500,700|jetbrains-mono:400,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative min-h-full overflow-x-clip bg-[#0b0e14] text-white">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-[-8%] left-[-10%] h-80 w-80 rounded-full bg-[#ff2d20]/18 blur-3xl" />
                    <div className="absolute top-1/3 right-[-8%] h-96 w-96 rounded-full bg-[#ff2d20]/10 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_24%)]" />
                </div>

                <div className="relative">
                    <CommandCenter 
                        assessment={initialAssessment} 
                        onExportPdf={() => void handleExportPdf()}
                        isExporting={exporting}
                    />

                    <AssessmentWorkspace
                        assessmentHistory={assessmentHistory}
                        claimNotice={claimNotice}
                        initialAssessment={initialAssessment}
                        view="dashboard"
                    />
                </div>
            </div>
        </AppLayout>
    );
}

