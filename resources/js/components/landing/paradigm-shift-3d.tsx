import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- TIGA FASE WARNA ---
// 0: Chaos = Merah
// 1: Processing = Biru
// 2: Order = Hijau Emerald
const COLORS = [
    new THREE.Color('#EF4444'),
    new THREE.Color('#3B82F6'),
    new THREE.Color('#10B981'),
];

// Tekstur glow bulat halus untuk partikel
function createCircleGlowTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

// Data Partikel untuk transisi
interface ParticleNode {
    current: THREE.Vector3;
    chaosTarget: THREE.Vector3;
    gridTarget: THREE.Vector3;
    ringTarget: THREE.Vector3;
    velocity: THREE.Vector3;
    size: number;
    baseSize: number;
}

export default function ParadigmShift3D({ stage }: { stage: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const particleCount = 600; // Increased for better defined shapes
    const particlesRef = useRef<ParticleNode[]>([]);
    const frameRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });
    const sceneInfoRef = useRef<{
        system?: THREE.Points;
        geom?: THREE.BufferGeometry;
        mat?: THREE.PointsMaterial;
        colors?: Float32Array;
        positions?: Float32Array;
        currentColor?: THREE.Color;
        targetColor?: THREE.Color;
    }>({});

    // Inisialisasi posisi target untuk tiga fase bentuk yang sangat spesifik
    useMemo(() => {
        const nodes: ParticleNode[] = [];
        
        // Golden ratio for sphere distribution
        const phi = Math.PI * (3.0 - Math.sqrt(5.0)); 

        for (let i = 0; i < particleCount; i++) {
            // -------------------------------------------------------------
            // 1. CHAOS TARGET: "Complex Torus Knot" (Simpul Matematika)
            // -------------------------------------------------------------
            // Merepresentasikan kompleksitas algoritma heuristik yang kusut namun terstruktur secara matematis
            const t = (i / particleCount) * Math.PI * 2;
            const p = 3; // Jumlah putaran toroidal
            const q = 8; // Jumlah putaran poloidal (menentukan kerumitan)
            
            // Formula parametriks Torus Knot
            const rKnot = Math.cos(q * t) + 2.5;
            const baseX = rKnot * Math.cos(p * t);
            const baseY = -Math.sin(q * t);
            const baseZ = rKnot * Math.sin(p * t);

            // Tambahkan ketebalan (tube thickness) agar tidak hanya 1 garis tipis
            // Menggunakan distribusi yang rapi agar "tidak berantakan"
            const tubeSpread = (i % 3 === 0) ? 0 : (Math.random() * 0.6); 
            const chaosTarget = new THREE.Vector3(
                (baseX * 2.2) + Math.cos(t * 50) * tubeSpread,
                (baseY * 2.2) + Math.sin(t * 50) * tubeSpread,
                (baseZ * 2.2) + Math.cos(t * 100) * tubeSpread
            );

            // -------------------------------------------------------------
            // 2. PROCESSING TARGET: "DNA Double Helix" (Struktur komputasi biologis)
            // -------------------------------------------------------------
            // Dua untai utama + jembatan penghubung
            const indexNorm = i / particleCount;
            const helixAngle = indexNorm * Math.PI * 10; // 5 putaran penuh
            const helixHeight = (indexNorm - 0.5) * 24; // Tinggi helix -12 ke 12
            const helixRadius = 5.0;
            
            let pX, pY, pZ;
            
            if (i % 3 === 0) {
                // Untai 1
                pX = Math.cos(helixAngle) * helixRadius;
                pY = helixHeight;
                pZ = Math.sin(helixAngle) * helixRadius;
            } else if (i % 3 === 1) {
                // Untai 2 (Berlawanan arah)
                pX = Math.cos(helixAngle + Math.PI) * helixRadius;
                pY = helixHeight;
                pZ = Math.sin(helixAngle + Math.PI) * helixRadius;
            } else {
                // Jembatan penghubung antar untai (Rungs)
                const rungPos = (Math.random() * 2) - 1; // -1 to 1
                pX = Math.cos(helixAngle) * helixRadius * rungPos;
                pY = helixHeight;
                pZ = Math.sin(helixAngle) * helixRadius * rungPos;
            }
            const gridTarget = new THREE.Vector3(pX, pY, pZ);

            // -------------------------------------------------------------
            // 3. ORDER TARGET: "Perfect Fibonacci Sphere" (Keteraturan rasional mutlak)
            // -------------------------------------------------------------
            const oY = 1.0 - (i / (particleCount - 1)) * 2; // -1 to 1
            const oRadius = Math.sqrt(1 - oY * oY);
            const oTheta = phi * i;

            // Skalakan ke ukuran yang pas untuk frame (radius 8.5)
            const ringTarget = new THREE.Vector3(
                Math.cos(oTheta) * oRadius * 8.5,
                oY * 8.5,
                Math.sin(oTheta) * oRadius * 8.5
            );

            // Tambahkan "Cincin Orbit" di luar bola sempurna sebagai elemen ekstra
            if (i > particleCount * 0.85) {
                const ringIdx = i - particleCount * 0.85;
                const ringTotal = particleCount * 0.15;
                const rAngle = (ringIdx / ringTotal) * Math.PI * 2;
                ringTarget.set(
                    Math.cos(rAngle) * 12.5,
                    0,
                    Math.sin(rAngle) * 12.5
                );
            }

            nodes.push({
                current: chaosTarget.clone(),
                chaosTarget,
                gridTarget,
                ringTarget,
                velocity: new THREE.Vector3(0, 0, 0),
                size: 0,
                baseSize: Math.random() * 0.8 + 0.5,
            });
        }
        particlesRef.current = nodes;
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 35; // Jarak kamera

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Geometri dan Material Partikel
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Warna awal merah (chaos)
        const initialColor = COLORS[0];
        particlesRef.current.forEach((p, i) => {
            positions[i * 3] = p.current.x;
            positions[i * 3 + 1] = p.current.y;
            positions[i * 3 + 2] = p.current.z;
            
            colors[i * 3] = initialColor.r;
            colors[i * 3 + 1] = initialColor.g;
            colors[i * 3 + 2] = initialColor.b;
        });

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const tex = createCircleGlowTexture();
        const mat = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            map: tex,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            opacity: 0.9,
        });

        const system = new THREE.Points(geom, mat);
        scene.add(system);

        sceneInfoRef.current = {
            system, geom, mat, colors, positions,
            currentColor: initialColor.clone(),
            targetColor: initialColor.clone()
        };

        const clock = new THREE.Clock();
        
        // Mouse interact
        const onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current.x = ((e.clientX - rect.left) / width) * 2 - 1;
            mouseRef.current.y = -((e.clientY - rect.top) / height) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            const dt = clock.getDelta();
            const time = clock.getElapsedTime();

            const info = sceneInfoRef.current;
            if (!info.positions || !info.colors || !info.currentColor || !info.targetColor) return;

            // Transisi Warna Smooth
            info.currentColor.lerp(info.targetColor, dt * 2.0);

            // Rotasi Scene berdasarkan mouse + auto
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Pada Order (stage 2), berikan rotasi statis bola agar terlihat teratur
            if (stageRef.current === 2) {
                system.rotation.x += (my * 0.2 - system.rotation.x) * dt * 2.0;
                system.rotation.y += (mx * 0.2 + time * 0.1 - system.rotation.y) * dt * 2.0;
                system.rotation.z += (0 - system.rotation.z) * dt * 2.0;
            } else {
                system.rotation.x += (my * 0.5 - system.rotation.x) * dt * 2.0;
                system.rotation.y += (mx * 0.5 - system.rotation.y) * dt * 2.0;
                system.rotation.z += 0.05 * dt;
            }

            // Update posisi masing-masing partikel menuju target statenya
            particlesRef.current.forEach((p, i) => {
                let target: THREE.Vector3;
                let speed = 2.0;
                
                // Ambil target berdasarkan prop `stage` dari parent
                // (stage kita inject nanti lewat useRef atau global variable krn ini di dalam useEffect)
                // Kita gunakan state stage terbaru yg disimpan di class/ref
            });
            // Karena kita menggunakan prop `stage`, kita move logiknya ke luar efek inisialisasi
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            geom.dispose();
            mat.dispose();
            tex.dispose();
            renderer.dispose();
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []); // Init sekali saja

    // Update target color dan pergerakan partikel ketika stage berubah
    useEffect(() => {
        const info = sceneInfoRef.current;
        if (info.targetColor) {
            info.targetColor.copy(COLORS[stage]);
        }
    }, [stage]);

    // Kita butuh requestAnimationFrame loop yang selalu membaca stage terbaru
    // Solusi: Simpan stage di Ref agar loop di atas membacanya dengan benar
    const stageRef = useRef(stage);
    useEffect(() => {
        stageRef.current = stage;
    }, [stage]);

    // Patch the animate function behavior via a secondary hook to inject physics update
    useEffect(() => {
        let animId: number;
        let lastTime = performance.now();
        
        const updatePhysics = () => {
            animId = requestAnimationFrame(updatePhysics);
            const now = performance.now();
            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;
            
            const info = sceneInfoRef.current;
            if (!info.positions || !info.colors || !info.currentColor) return;

            const currentStage = stageRef.current;
            
            particlesRef.current.forEach((p, i) => {
                let target = p.chaosTarget;
                let tension = 2.0;
                let damp = 0.85;

                if (currentStage === 0) {
                    // Chaos: Torus Knot berputar secara elegan
                    const angle = Math.atan2(p.chaosTarget.z, p.chaosTarget.x) + (now * 0.0008);
                    const radius = Math.sqrt(p.chaosTarget.x ** 2 + p.chaosTarget.z ** 2);
                    
                    target = new THREE.Vector3(
                        Math.cos(angle) * radius,
                        p.chaosTarget.y, // Hilangkan osilasi vertikal liar agar rapi
                        Math.sin(angle) * radius
                    );
                    tension = 2.5; // Tension lebih tinggi agar partikel mengunci ke bentuk simpul rapi
                    damp = 0.85;
                } else if (currentStage === 1) {
                    // Processing: DNA Helix memutar perlahan vertikal
                    const angle = Math.atan2(p.gridTarget.z, p.gridTarget.x) + (now * 0.001);
                    const radius = Math.sqrt(p.gridTarget.x ** 2 + p.gridTarget.z ** 2);
                    
                    // Interactive bend parameter (melengkung mengikuti interaksi mouse)
                    const bendForceX = mouseRef.current.x * (p.gridTarget.y + 12) * 0.15;
                    const bendForceZ = mouseRef.current.y * (p.gridTarget.y + 12) * 0.15;

                    target = new THREE.Vector3(
                        Math.cos(angle) * (radius) + bendForceX,
                        p.gridTarget.y,
                        Math.sin(angle) * (radius) + bendForceZ
                    );
                    tension = 3.5;
                    damp = 0.8;
                } else if (currentStage === 2) {
                    // Order: Fibonacci Sphere berotasi secara konstan di semua sumbu
                    target = p.ringTarget;
                    tension = 5.0;
                    damp = 0.7;
                }

                // Spring physics menuju target
                const ax = (target.x - p.current.x) * tension;
                const ay = (target.y - p.current.y) * tension;
                const az = (target.z - p.current.z) * tension;

                p.velocity.x = (p.velocity.x + ax * dt) * damp;
                p.velocity.y = (p.velocity.y + ay * dt) * damp;
                p.velocity.z = (p.velocity.z + az * dt) * damp;

                p.current.addScaledVector(p.velocity, dt * 60);

                // Update buffer array
                info.positions![i * 3] = p.current.x;
                info.positions![i * 3 + 1] = p.current.y;
                info.positions![i * 3 + 2] = p.current.z;

                // Hitung warna individu (sedikit variasi per partikel)
                const c = info.currentColor!;
                let variation = (Math.sin(now * 0.005 + i) * 0.2 + 0.8);

                // Tambahkan Efek Scanner Pulse saat di stage 1 (Processing)
                if (currentStage === 1) {
                    // Gelombang scanner berjalan naik turun sepanjang sumbu Y (-12 hingga 12)
                    const scanCenter = Math.sin(now * 0.003) * 15;
                    const distanceToScan = Math.abs(p.gridTarget.y - scanCenter);
                    
                    if (distanceToScan < 2.5) {
                        // Jika terkena scanner, partikel menyala lebih terang (glow putih/biru muda)
                        const pulse = 1 - (distanceToScan / 2.5);
                        variation += pulse * 1.8; // Boost intensitas
                    }
                }

                info.colors![i * 3] = Math.min(c.r * variation, 1.0);
                info.colors![i * 3 + 1] = Math.min(c.g * variation, 1.0);
                info.colors![i * 3 + 2] = Math.min(c.b * variation, 1.0);
            });

            if (info.geom) {
                info.geom.attributes.position.needsUpdate = true;
                info.geom.attributes.color.needsUpdate = true;
            }
        };

        animId = requestAnimationFrame(updatePhysics);
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="relative w-full h-[220px]" 
            style={{ 
                // Tambahan glow shadow di belakang canvas
                filter: `drop-shadow(0 0 20px ${COLORS[stage].getStyle()}40)` 
            }}
        />
    );
}
