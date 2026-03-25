import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles } from 'lucide-react';

interface ParetoFrontierProps {
    majorIds: number[];
}

type ParetoPoint = { major_id: number; major_name: string; x: number; y: number; is_dominated: boolean };
type TradeOff = { from_major: string; to_major: string; gain_dimension: string; gain_amount: number; loss_dimension: string; loss_amount: number; trade_off_ratio: number | null };

type ParetoData = {
    all_points: ParetoPoint[];
    pareto_frontier: ParetoPoint[];
    dimension_1: { key: string; label: string };
    dimension_2: { key: string; label: string };
    trade_off_analysis: TradeOff[];
};

const DIMENSIONS = [
    { value: 'minat_pribadi', label: 'Personal Interest' },
    { value: 'kemampuan_analitis', label: 'Analytical Ability' },
    { value: 'prospek_karier', label: 'Career Prospect' },
    { value: 'kesiapan_akademik', label: 'Academic Readiness' },
    { value: 'minat', label: 'Behavioral Interest' },
    { value: 'logika', label: 'Logic Ability' },
    { value: 'konsistensi', label: 'Consistency' },
];

const POINT_COLORS = ['#22d3ee', '#a855f7', '#ff2d20', '#facc15', '#34d399'];

export default function ParetoFrontier({ majorIds }: ParetoFrontierProps) {
    const [dim1, setDim1] = useState('minat_pribadi');
    const [dim2, setDim2] = useState('kemampuan_analitis');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ParetoData | null>(null);

    const fetchPareto = useCallback(() => {
        if (majorIds.length < 2) return;
        setLoading(true);
        fetch('/api/v1/comparison/pareto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '' },
            body: JSON.stringify({ major_ids: majorIds, dimension_1: dim1, dimension_2: dim2 }),
        })
            .then((r) => r.json())
            .then(setData)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [majorIds, dim1, dim2]);

    useEffect(() => { fetchPareto(); }, [fetchPareto]);

    if (majorIds.length < 2) return null;

    // SVG dimensions — increased for better spacing
    const svgW = 600;
    const svgH = 380;
    const pad = { top: 40, right: 40, bottom: 55, left: 65 };
    const chartW = svgW - pad.left - pad.right;
    const chartH = svgH - pad.top - pad.bottom;

    const points = data?.all_points ?? [];
    const frontier = data?.pareto_frontier ?? [];
    const xVals = points.map((p) => p.x);
    const yVals = points.map((p) => p.y);
    const xMin = Math.min(...(xVals.length ? xVals : [0])) - 5;
    const xMax = Math.max(...(xVals.length ? xVals : [100])) + 5;
    const yMin = Math.min(...(yVals.length ? yVals : [0])) - 5;
    const yMax = Math.max(...(yVals.length ? yVals : [100])) + 5;

    const toSvgX = (v: number) => pad.left + ((v - xMin) / (xMax - xMin || 1)) * chartW;
    const toSvgY = (v: number) => pad.top + chartH - ((v - yMin) / (yMax - yMin || 1)) * chartH;

    // Prevent label overlap by nudging labels vertically
    const labelPositions = points.map((p, i) => {
        const baseX = toSvgX(p.x);
        const baseY = toSvgY(p.y) - 14;
        let offsetY = 0;

        // Check if any earlier point's label is nearby
        for (let j = 0; j < i; j++) {
            const otherX = toSvgX(points[j].x);
            const otherY = toSvgY(points[j].y) - 14;
            if (Math.abs(baseX - otherX) < 60 && Math.abs(baseY + offsetY - otherY) < 14) {
                offsetY -= 14; // push up
            }
        }

        return { x: baseX, y: baseY + offsetY };
    });

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="px-5 py-5">
                <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <Sparkles className="h-3.5 w-3.5 text-[#a855f7]" />
                    Pareto Frontier Analysis
                </div>

                {/* Dimension selectors */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="text-xs text-slate-400">X-Axis</div>
                        <Select value={dim1} onValueChange={setDim1}>
                            <SelectTrigger className="h-9 rounded-xl border-white/10 bg-[#05070b] text-white text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="border-white/10 bg-[#05070b] text-white">
                                {DIMENSIONS.filter(d => d.value !== dim2).map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-slate-400">Y-Axis</div>
                        <Select value={dim2} onValueChange={setDim2}>
                            <SelectTrigger className="h-9 rounded-xl border-white/10 bg-[#05070b] text-white text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="border-white/10 bg-[#05070b] text-white">
                                {DIMENSIONS.filter(d => d.value !== dim1).map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Chart */}
                {loading ? (
                    <div className="flex h-48 items-center justify-center text-sm text-slate-500">Calculating frontier...</div>
                ) : (
                    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-[320px] w-full rounded-2xl border border-white/8 bg-[#05070b]">
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                            const y = pad.top + chartH * (1 - t);
                            const x = pad.left + chartW * t;
                            const yLabel = Math.round(yMin + (yMax - yMin) * t);
                            const xLabel = Math.round(xMin + (xMax - xMin) * t);
                            return (
                                <g key={`grid${t}`}>
                                    <line x1={pad.left} y1={y} x2={pad.left + chartW} y2={y} stroke="rgba(255,255,255,0.04)" />
                                    <line x1={x} y1={pad.top} x2={x} y2={pad.top + chartH} stroke="rgba(255,255,255,0.04)" />
                                    <text x={pad.left - 6} y={y + 3} fill="#64748b" fontSize={8} textAnchor="end">{yLabel}</text>
                                    <text x={x} y={pad.top + chartH + 14} fill="#64748b" fontSize={8} textAnchor="middle">{xLabel}</text>
                                </g>
                            );
                        })}

                        {/* Axis labels */}
                        <text x={pad.left + chartW / 2} y={svgH - 6} fill="#94a3b8" fontSize={10} textAnchor="middle">{data?.dimension_1.label ?? dim1}</text>
                        <text x={12} y={pad.top + chartH / 2} fill="#94a3b8" fontSize={10} textAnchor="middle" transform={`rotate(-90, 12, ${pad.top + chartH / 2})`}>{data?.dimension_2.label ?? dim2}</text>

                        {/* Frontier polygon fill */}
                        {frontier.length > 1 && (
                            <polygon
                                points={
                                    frontier.map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ') +
                                    ` ${toSvgX(frontier[frontier.length - 1].x)},${pad.top + chartH}` +
                                    ` ${toSvgX(frontier[0].x)},${pad.top + chartH}`
                                }
                                fill="rgba(34,211,238,0.06)"
                            />
                        )}

                        {/* Frontier line */}
                        {frontier.length > 1 && (
                            <polyline
                                points={frontier.map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ')}
                                fill="none"
                                stroke="#22d3ee"
                                strokeWidth={2}
                                strokeDasharray="6 3"
                            />
                        )}

                        {/* Points + labels */}
                        {points.map((p, i) => {
                            const color = POINT_COLORS[i % POINT_COLORS.length];
                            const lp = labelPositions[i];
                            return (
                                <g key={p.major_id}>
                                    <circle cx={toSvgX(p.x)} cy={toSvgY(p.y)} r={p.is_dominated ? 5 : 7} fill={p.is_dominated ? '#475569' : color} stroke={p.is_dominated ? '#64748b' : color} strokeWidth={1.5} fillOpacity={0.8} />
                                    {/* Label with background for readability */}
                                    <rect x={lp.x - 40} y={lp.y - 8} width={80} height={13} rx={3} fill="rgba(0,0,0,0.7)" />
                                    <text x={lp.x} y={lp.y + 2} fill="#e2e8f0" fontSize={8} textAnchor="middle" fontWeight={500}>{p.major_name.length > 16 ? p.major_name.slice(0, 15) + '…' : p.major_name}</text>
                                </g>
                            );
                        })}
                    </svg>
                )}

                {/* Trade-off table */}
                {(data?.trade_off_analysis?.length ?? 0) > 0 && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
                        <table className="min-w-full text-left text-xs">
                            <thead className="bg-white/[0.03] text-slate-400">
                                <tr>
                                    <th className="px-3 py-2 font-medium">From</th>
                                    <th className="px-3 py-2 font-medium">To</th>
                                    <th className="px-3 py-2 text-center font-medium text-emerald-400">Gain</th>
                                    <th className="px-3 py-2 text-center font-medium text-rose-400">Cost</th>
                                    <th className="px-3 py-2 text-center font-medium">Ratio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data!.trade_off_analysis.map((t, i) => (
                                    <tr key={i} className="border-t border-white/8">
                                        <td className="px-3 py-2 text-white">{t.from_major}</td>
                                        <td className="px-3 py-2 text-white">{t.to_major}</td>
                                        <td className="px-3 py-2 text-center text-emerald-300">+{t.gain_amount}</td>
                                        <td className="px-3 py-2 text-center text-rose-300">-{t.loss_amount}</td>
                                        <td className="px-3 py-2 text-center text-slate-300">{t.trade_off_ratio ? `1:${t.trade_off_ratio}` : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
