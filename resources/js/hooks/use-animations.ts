import { useEffect, useRef, useState, useCallback } from 'react';

/** Count up from 0 to `end` when element enters viewport */
export function useCountUp(end: number, duration = 2000, suffix = '') {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started.current) {
                started.current = true;
                const t0 = performance.now();
                const step = (now: number) => {
                    const p = Math.min((now - t0) / duration, 1);
                    const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
                    setCount(Math.round(ease * end * 100) / 100);
                    if (p < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }
        }, { threshold: 0.3 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [end, duration]);

    const display = Number.isInteger(end) ? Math.round(count).toString() + suffix : count.toFixed(2) + suffix;
    return { ref, display };
}

/** Returns true once element scrolls into view */
export function useScrollReveal(threshold = 0.2) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);

    return { ref, visible };
}

/** Typewriter effect: reveals text character by character */
export function useTypewriter(text: string, speed = 50, startDelay = 500) {
    const [displayed, setDisplayed] = useState('');
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); }
        }, { threshold: 0.3 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        let i = 0;
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                i++;
                setDisplayed(text.slice(0, i));
                if (i >= text.length) clearInterval(interval);
            }, speed);
            return () => clearInterval(interval);
        }, startDelay);
        return () => clearTimeout(timeout);
    }, [started, text, speed, startDelay]);

    return { ref, displayed, started };
}

/** 3D tilt effect following mouse position */
export function useTilt(intensity = 8) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.02)`;
    }, [intensity]);

    const handleLeave = useCallback(() => {
        const el = ref.current;
        if (el) el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    }, []);

    return { ref, handleMove, handleLeave };
}
