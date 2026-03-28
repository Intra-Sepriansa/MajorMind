import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function CoreReactor3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0b0e14, 0.05);

        const globalGroup = new THREE.Group();
        scene.add(globalGroup);

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 12;
        // Position it heavily to the right side of the container
        globalGroup.position.x = width > 768 ? 4.0 : 1.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const renderScene = new RenderPass(scene, camera);
        renderScene.clearColor = new THREE.Color(0x000000);
        renderScene.clearAlpha = 0;

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.5, 0.6, 0.05);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        // Core Sphere
        const coreGeo = new THREE.IcosahedronGeometry(1.2, 4);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        globalGroup.add(coreMesh);

        // Core Outer Glow
        const createGlowTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
                grad.addColorStop(0, 'rgba(255,255,255,1)');
                grad.addColorStop(0.3, 'rgba(150,200,255,0.6)');
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 64, 64);
            }
            return new THREE.CanvasTexture(canvas);
        };
        const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({ 
            map: createGlowTexture(), 
            color: 0x88ccff, 
            blending: THREE.AdditiveBlending, 
            transparent: true,
            depthWrite: false
        }));
        glowSprite.scale.set(6, 6, 1);
        coreMesh.add(glowSprite);

        // Orbiting Rings
        const ringsGroup = new THREE.Group();
        globalGroup.add(ringsGroup);

        const createOrbitRing = (radius: number, colorHex: number, thickness: number, particleCount: number) => {
            const ringGroup = new THREE.Group();

            // The faint solid path
            const pathGeo = new THREE.TorusGeometry(radius, thickness * 0.2, 8, 100);
            const pathMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
            ringGroup.add(new THREE.Mesh(pathGeo, pathMat));

            // The bright particles tracing the ring
            const pGeo = new THREE.BufferGeometry();
            const pos = new Float32Array(particleCount * 3);
            for(let i=0; i<particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                // Add slight noise to orbit
                const rOffset = radius + (Math.random() - 0.5) * 0.15;
                pos[i*3] = Math.cos(angle) * rOffset;
                pos[i*3+1] = (Math.random() - 0.5) * 0.1;
                pos[i*3+2] = Math.sin(angle) * rOffset;
            }
            pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const pMat = new THREE.PointsMaterial({ color: colorHex, size: thickness * 4, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
            const points = new THREE.Points(pGeo, pMat);
            ringGroup.add(points);

            return ringGroup;
        };

        // Red Rings (Baseline/Core energy)
        const ring1 = createOrbitRing(2.8, 0xff2200, 0.03, 150);
        ring1.rotation.x = Math.PI / 3;
        ring1.rotation.y = Math.PI / 6;
        ringsGroup.add(ring1);

        const ring2 = createOrbitRing(4.0, 0xff4411, 0.02, 200);
        ring2.rotation.x = -Math.PI / 4;
        ringsGroup.add(ring2);

        const ring3 = createOrbitRing(2.0, 0xff0000, 0.035, 100);
        ring3.rotation.x = Math.PI / 2.5;
        ring3.rotation.y = -Math.PI / 4;
        ringsGroup.add(ring3);

        // Blue Rings (Scenario/Processing energy)
        const ring4 = createOrbitRing(3.5, 0x00aaff, 0.025, 180);
        ring4.rotation.x = Math.PI / 6;
        ring4.rotation.y = -Math.PI / 3;
        ringsGroup.add(ring4);

        const ring5 = createOrbitRing(4.6, 0x0066ff, 0.015, 250);
        ring5.rotation.x = -Math.PI / 5;
        ring5.rotation.y = Math.PI / 4;
        ringsGroup.add(ring5);

        // Ambient Dust Particles
        const dustCount = 800;
        const dustGeo = new THREE.BufferGeometry();
        const dustPos = new Float32Array(dustCount * 3);
        const dustCol = new Float32Array(dustCount * 3);
        const dustPhases = new Float32Array(dustCount);
        
        for(let i=0; i<dustCount; i++) {
            const r = 1.0 + Math.random() * 6.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            dustPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
            dustPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            dustPos[i*3+2] = r * Math.cos(phi);

            const isRed = Math.random() > 0.5;
            const c = isRed ? new THREE.Color(0xff3300) : new THREE.Color(0x0088ff);
            dustCol[i*3] = c.r; dustCol[i*3+1] = c.g; dustCol[i*3+2] = c.b;

            dustPhases[i] = Math.random() * Math.PI * 2;
        }
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
        dustGeo.setAttribute('phase', new THREE.BufferAttribute(dustPhases, 1));

        const dustMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
        const dustPoints = new THREE.Points(dustGeo, dustMat);
        globalGroup.add(dustPoints);

        // Parallax & Interaction
        let mouseX = 0; let mouseY = 0;
        const onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / height) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
            globalGroup.position.x = w > 768 ? 4.0 : 1.5;
        };
        window.addEventListener('resize', handleResize);

        const clock = new THREE.Clock();

        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Rotate Rings
            ring1.rotation.z -= 0.005;
            ring2.rotation.z += 0.004;
            ring3.rotation.z -= 0.006;
            ring4.rotation.z += 0.003;
            ring5.rotation.z -= 0.002;

            // Core breathing pulse
            const pulse = 1.0 + Math.sin(time * 2) * 0.05;
            coreMesh.scale.setScalar(pulse);
            glowSprite.material.opacity = 0.8 + Math.sin(time * 4) * 0.2;

            // Ambient Dust Drift
            const posAttr = dustGeo.attributes.position;
            for(let i=0; i<dustCount; i++) {
                const phase = dustPhases[i];
                // Gently drift outwards and float
                posAttr.setX(i, posAttr.getX(i) + Math.sin(time * 0.5 + phase) * 0.002);
                posAttr.setY(i, posAttr.getY(i) + Math.cos(time * 0.5 + phase) * 0.002);
            }
            posAttr.needsUpdate = true;

            // Parallax
            globalGroup.rotation.y += (mouseX * 0.2 - globalGroup.rotation.y) * 0.05;
            globalGroup.rotation.x += (mouseY * 0.2 - globalGroup.rotation.x) * 0.05;

            // Dynamic bloom
            bloomPass.strength = 2.0 + Math.sin(time) * 0.5;

            composer.render();
        };
        animate();

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            composer.dispose();
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="absolute inset-y-0 right-0 w-[600px] md:w-[800px] z-0 pointer-events-none [mask-image:linear-gradient(to_left,black_20%,transparent)] md:[mask-image:linear-gradient(to_left,black_60%,transparent_90%)]" 
        />
    );
}
