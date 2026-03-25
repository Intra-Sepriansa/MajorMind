import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

type NarrativeData = {
    executive_summary: string;
    profile_narrative: string;
    algorithmic_narrative: string;
    key_takeaways: Array<{ icon: string; text: string }>;
    confidence_statement: string;
};

export default function NarrativeInsights({ assessmentId }: { assessmentId: number }) {
    const [data, setData] = useState<NarrativeData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!assessmentId) return;
        setLoading(true);
        fetch('/api/v1/insight/narrative', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ assessment_id: assessmentId }),
        })
            .then((r) => r.json())
            .then((d) => setData(d))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [assessmentId]);

    if (loading) {
        return (
            <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
                <CardContent className="px-5 py-8">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ff2d20] border-t-transparent" />
                        Generating narrative insights...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const renderMarkdown = (text: string) => {
        return text.split('\n').map((line, i) => {
            const boldified = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
            if (line.startsWith('•')) {
                return <li key={i} className="ml-2 list-none" dangerouslySetInnerHTML={{ __html: boldified }} />;
            }
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} dangerouslySetInnerHTML={{ __html: boldified }} />;
        });
    };

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="space-y-4 px-5 py-5">
                <div className="flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <BookOpen className="h-3.5 w-3.5 text-[#ff2d20]" />
                    Narrative insights
                </div>

                {/* Executive Summary */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                    <div className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Executive Summary</div>
                    <div className="text-sm leading-7 text-slate-300">{renderMarkdown(data.executive_summary)}</div>
                </div>

                {/* Profile Narrative */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                    <div className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Profile Analysis</div>
                    <div className="text-sm leading-7 text-slate-300 space-y-2">{renderMarkdown(data.profile_narrative)}</div>
                </div>

                {/* Algorithmic Narrative */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                    <div className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Algorithmic Explanation</div>
                    <div className="text-sm leading-7 text-slate-300 space-y-2">{renderMarkdown(data.algorithmic_narrative)}</div>
                </div>

                {/* Key Takeaways */}
                <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Key Takeaways</div>
                    {data.key_takeaways.map((t, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                            <span className="text-lg">{t.icon}</span>
                            <span className="text-sm text-slate-300 leading-6" dangerouslySetInnerHTML={{ __html: t.text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                        </div>
                    ))}
                </div>

                {/* Confidence Statement */}
                <div className="rounded-2xl border border-[#ff2d20]/20 bg-[#ff2d20]/5 px-4 py-3">
                    <div className="text-sm leading-7 text-slate-300" dangerouslySetInnerHTML={{ __html: data.confidence_statement.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#ff8a80]">$1</strong>') }} />
                </div>
            </CardContent>
        </Card>
    );
}
