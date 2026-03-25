import { useMemo } from 'react';

interface Particle {
    id: number;
    size: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
    opacity: number;
}

export default function FloatingParticles({ count = 30, className = '' }: { count?: number; className?: string }) {
    const particles = useMemo<Particle[]>(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            size: Math.random() * 3 + 1,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * -20,
            opacity: Math.random() * 0.4 + 0.1,
        })),
        [count]
    );

    return (
        <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        opacity: p.opacity,
                        animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
                    }}
                />
            ))}
            <style>{`
                @keyframes floatParticle {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: var(--tw-opacity, 0.2); }
                    25% { transform: translate(30px, -40px) scale(1.2); }
                    50% { transform: translate(-20px, -80px) scale(0.8); opacity: calc(var(--tw-opacity, 0.2) + 0.15); }
                    75% { transform: translate(40px, -30px) scale(1.1); }
                }
            `}</style>
        </div>
    );
}
