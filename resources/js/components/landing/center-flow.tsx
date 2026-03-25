import { useEffect, useRef } from 'react';
import { BrainCircuit, Radar, ShieldCheck, BarChart3, Target, GitCompare, Cpu, GraduationCap } from 'lucide-react';

const ICONS = [
    { Icon: BrainCircuit, label: 'AHP' },
    { Icon: Target, label: 'TOPSIS' },
    { Icon: ShieldCheck, label: 'CR Audit' },
    { Icon: GraduationCap, label: 'Jurusan' },
    { Icon: Radar, label: 'Ideal' },
    { Icon: GitCompare, label: 'Pairwise' },
    { Icon: Cpu, label: 'Engine' },
    { Icon: BarChart3, label: 'Ranking' },
];

const NODE_POS = [
    { x: 30, y: 10 },
    { x: 50, y: 3 },
    { x: 70, y: 10 },
    { x: 85, y: 45 },
    { x: 70, y: 78 },
    { x: 50, y: 88 },
    { x: 30, y: 78 },
    { x: 15, y: 45 },
];

const BEND = [35, 0, -35, -40, 35, 0, -35, 40];

const CX_PCT = 50, CY_PCT = 45;

function ctrlPt(cx: number, cy: number, nx: number, ny: number, b: number) {
    const mx = (cx + nx) / 2, my = (cy + ny) / 2;
    const dx = nx - cx, dy = ny - cy;
    const l = Math.sqrt(dx * dx + dy * dy) || 1;
    return { cpx: mx + (-dy / l) * b, cpy: my + (dx / l) * b };
}

function qB(t: number, a: number, b: number, c: number) {
    return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
}

export default function CenterFlow() {
    const cvRef = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cv = cvRef.current, box = boxRef.current;
        if (!cv || !box) return;
        const ctx = cv.getContext('2d');
        if (!ctx) return;

        let anim: number;
        const t0 = performance.now();

        function resize() {
            if (!cv || !box) return;
            const r = box.getBoundingClientRect();
            const d = window.devicePixelRatio || 1;
            cv.width = r.width * d;
            cv.height = r.height * d;
            cv.style.width = r.width + 'px';
            cv.style.height = r.height + 'px';
            ctx!.setTransform(d, 0, 0, d, 0, 0);
        }

        resize();
        window.addEventListener('resize', resize);

        function draw(now: number) {
            if (!cv || !box || !ctx) return;
            const w = box.getBoundingClientRect().width;
            const h = box.getBoundingClientRect().height;
            const sec = (now - t0) / 1000;

            ctx.clearRect(0, 0, w, h);

            const ox = w * (CX_PCT / 100);
            const oy = h * (CY_PCT / 100);

            // Center glow
            for (const [r, a] of [[130, 0.1], [80, 0.07], [45, 0.12]] as [number, number][]) {
                const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
                g.addColorStop(0, `rgba(255,45,32,${a})`);
                g.addColorStop(0.5, `rgba(255,45,32,${a * 0.25})`);
                g.addColorStop(1, 'rgba(255,45,32,0)');
                ctx.beginPath();
                ctx.arc(ox, oy, r, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
            }

            NODE_POS.forEach((nd, i) => {
                const nx = w * (nd.x / 100);
                const ny = h * (nd.y / 100);
                const { cpx, cpy } = ctrlPt(ox, oy, nx, ny, BEND[i]);

                // === Visible curved line from center to node ===
                ctx.beginPath();
                ctx.moveTo(ox, oy);
                ctx.quadraticCurveTo(cpx, cpy, nx, ny);
                ctx.strokeStyle = 'rgba(255, 45, 32, 0.18)';
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // === Streak: center → node ONLY ===
                const TRAIL = 0.2;
                const STEPS = 30;
                const spd = 0.06 + i * 0.003;
                // Phase goes 0→1 (center→node), then resets
                const phase = ((sec * spd) + i * 0.125) % 1;

                for (let s = 0; s < STEPS; s++) {
                    const st = phase - (s / STEPS) * TRAIL;
                    if (st < 0 || st > 1) continue;

                    const px = qB(st, ox, cpx, nx);
                    const py = qB(st, oy, cpy, ny);

                    const tf = 1 - s / STEPS;
                    const pf = Math.sin(st * Math.PI);
                    const a = tf * tf * pf;

                    // Glow
                    const gr = 10 + tf * 8;
                    const g1 = ctx.createRadialGradient(px, py, 0, px, py, gr);
                    g1.addColorStop(0, `rgba(255,45,32,${0.5 * a})`);
                    g1.addColorStop(0.35, `rgba(255,45,32,${0.12 * a})`);
                    g1.addColorStop(1, 'rgba(255,45,32,0)');
                    ctx.beginPath();
                    ctx.arc(px, py, gr, 0, Math.PI * 2);
                    ctx.fillStyle = g1;
                    ctx.fill();

                    // Core
                    const cr = 1.2 + tf * 2.5;
                    ctx.beginPath();
                    ctx.arc(px, py, cr, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,120,100,${0.9 * a})`;
                    ctx.fill();
                }

                // === ARRIVAL FLASH: node lights up when streak arrives ===
                const arrivalZone = 0.82; // streak is "arriving" when phase > this
                let flashIntensity = 0;
                if (phase > arrivalZone) {
                    // Ramp up as streak approaches (0→1), then bright burst at very end
                    const arrivalProgress = (phase - arrivalZone) / (1 - arrivalZone);
                    flashIntensity = Math.pow(arrivalProgress, 2);
                }
                // Also flash briefly right after reset (phase near 0 = just arrived)
                if (phase < 0.08) {
                    flashIntensity = Math.max(flashIntensity, 1 - phase / 0.08);
                }

                if (flashIntensity > 0.01) {
                    // Bright wide glow
                    const flashR = 40 + flashIntensity * 25;
                    const fg1 = ctx.createRadialGradient(nx, ny, 0, nx, ny, flashR);
                    fg1.addColorStop(0, `rgba(255,45,32,${0.65 * flashIntensity})`);
                    fg1.addColorStop(0.3, `rgba(255,45,32,${0.25 * flashIntensity})`);
                    fg1.addColorStop(0.6, `rgba(255,80,60,${0.1 * flashIntensity})`);
                    fg1.addColorStop(1, 'rgba(255,45,32,0)');
                    ctx.beginPath();
                    ctx.arc(nx, ny, flashR, 0, Math.PI * 2);
                    ctx.fillStyle = fg1;
                    ctx.fill();

                    // Inner bright core
                    const coreR = 15 + flashIntensity * 8;
                    const fg2 = ctx.createRadialGradient(nx, ny, 0, nx, ny, coreR);
                    fg2.addColorStop(0, `rgba(255,140,120,${0.7 * flashIntensity})`);
                    fg2.addColorStop(0.5, `rgba(255,45,32,${0.35 * flashIntensity})`);
                    fg2.addColorStop(1, 'rgba(255,45,32,0)');
                    ctx.beginPath();
                    ctx.arc(nx, ny, coreR, 0, Math.PI * 2);
                    ctx.fillStyle = fg2;
                    ctx.fill();
                }
            });

            anim = requestAnimationFrame(draw);
        }

        anim = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(anim); window.removeEventListener('resize', resize); };
    }, []);

    return (
        <div ref={boxRef} className="relative mx-auto w-full max-w-[1100px]" style={{ aspectRatio: '2.4/1' }}>
            <canvas ref={cvRef} className="absolute inset-0 h-full w-full" />

            {/* Center icon */}
            <div
                className="absolute z-10 flex items-center justify-center rounded-2xl border border-[#ff2d20]/40 bg-[#0b0e14] shadow-[0_0_60px_rgba(255,45,32,0.28),0_0_120px_rgba(255,45,32,0.1)]"
                style={{ left: `${CX_PCT}%`, top: `${CY_PCT}%`, transform: 'translate(-50%,-50%)', width: 68, height: 68 }}
            >
                <img src="/assets/logo-main.png" alt="MajorMind" className="h-10 w-10" />
            </div>

            {/* Outer nodes */}
            {NODE_POS.map((p, i) => {
                const it = ICONS[i];
                return (
                    <div
                        key={it.label}
                        className="absolute z-10 flex items-center justify-center rounded-xl border border-[#ff2d20]/20 bg-[#0b0e14]/95 shadow-[0_0_20px_rgba(255,45,32,0.06)] backdrop-blur-sm transition-all duration-500 hover:border-[#ff2d20]/50 hover:shadow-[0_0_35px_rgba(255,45,32,0.2)] hover:scale-110"
                        style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)', width: 46, height: 46 }}
                    >
                        <it.Icon className="h-5 w-5 text-[#ff2d20]" />
                    </div>
                );
            })}
        </div>
    );
}
