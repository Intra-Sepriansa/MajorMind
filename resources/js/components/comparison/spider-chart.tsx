import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Radar } from 'lucide-react';

type SpiderAxis = { key: string; label: string };
type SpiderSeries = { id: string | number; name: string; values: number[] };

interface SpiderChartProps {
    majorIds: number[];
}

const SERIES_COLORS = ['#a855f7', '#ff2d20', '#22d3ee', '#facc15', '#34d399'];

export default function SpiderChart({ majorIds }: SpiderChartProps) {
    const [loading, setLoading] = useState(false);
    const [axes, setAxes] = useState<SpiderAxis[]>([]);
    const [series, setSeries] = useState<SpiderSeries[]>([]);

    useEffect(() => {
        if (majorIds.length < 2) return;
        setLoading(true);
        fetch('/api/v1/comparison/spider-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '' },
            body: JSON.stringify({ major_ids: majorIds }),
        })
            .then((r) => r.json())
            .then((data) => {
                setAxes(data.axes ?? []);
                setSeries(data.series ?? []);
            })
            .finally(() => setLoading(false));
    }, [majorIds]);

    if (majorIds.length < 2) return null;

    const cx = 200;
    const cy = 200;
    const maxRadius = 160;
    const n = axes.length;
    const angleSlice = (Math.PI * 2) / (n || 1);

    const toXY = (axisIndex: number, value: number) => {
        const angle = angleSlice * axisIndex - Math.PI / 2;
        const r = (Math.min(value, 100) / 100) * maxRadius;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    };

    const gridLevels = [20, 40, 60, 80, 100];

    return (
        <Card className="rounded-[28px] border-white/10 bg-[#000000]/82 py-0">
            <CardContent className="px-5 py-5">
                <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <Radar className="h-3.5 w-3.5 text-[#a855f7]" />
                    Profile Spider Chart
                </div>

                {loading ? (
                    <div className="flex h-48 items-center justify-center text-sm text-slate-500">Loading chart...</div>
                ) : (
                    <>
                        <svg viewBox="0 0 400 400" className="mx-auto h-[360px] w-full max-w-[400px]">
                            {/* Grid rings */}
                            {gridLevels.map((level) => (
                                <polygon
                                    key={level}
                                    points={Array.from({ length: n }, (_, i) => {
                                        const p = toXY(i, level);
                                        return `${p.x},${p.y}`;
                                    }).join(' ')}
                                    fill="none"
                                    stroke="rgba(255,255,255,0.06)"
                                    strokeWidth={1}
                                />
                            ))}

                            {/* Axis lines */}
                            {axes.map((_, i) => {
                                const p = toXY(i, 100);
                                return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />;
                            })}

                            {/* Data polygons */}
                            {series.map((s, si) => {
                                const points = s.values.map((v, i) => {
                                    const p = toXY(i, v);
                                    return `${p.x},${p.y}`;
                                }).join(' ');
                                return (
                                    <polygon
                                        key={s.id}
                                        points={points}
                                        fill={SERIES_COLORS[si % SERIES_COLORS.length]}
                                        fillOpacity={0.12}
                                        stroke={SERIES_COLORS[si % SERIES_COLORS.length]}
                                        strokeWidth={2}
                                    />
                                );
                            })}

                            {/* Axis labels */}
                            {axes.map((axis, i) => {
                                const p = toXY(i, 115);
                                return (
                                    <text key={axis.key} x={p.x} y={p.y} fill="#94a3b8" fontSize={9} textAnchor="middle" dominantBaseline="middle">
                                        {axis.label}
                                    </text>
                                );
                            })}
                        </svg>

                        {/* Legend */}
                        <div className="mt-3 flex flex-wrap justify-center gap-4">
                            {series.map((s, si) => (
                                <div key={s.id} className="flex items-center gap-2 text-xs text-slate-300">
                                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: SERIES_COLORS[si % SERIES_COLORS.length] }} />
                                    {s.name}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
