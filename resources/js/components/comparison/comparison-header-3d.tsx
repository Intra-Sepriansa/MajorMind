import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function ComparisonHeader3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // --- 1. Scene Setup ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.02);
        
        const globalGroup = new THREE.Group();
        scene.add(globalGroup);

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 14; 
        globalGroup.position.x = width > 768 ? 4.5 : 1.5;

        // --- 2. Renderer ---
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.setClearColor(0x000000, 0); 
        container.appendChild(renderer.domElement);

        // --- 3. Post-Processing (Bloom) ---
        const renderScene = new RenderPass(scene, camera);
        renderScene.clearColor = new THREE.Color(0x000000);
        renderScene.clearAlpha = 0;

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.5, 0.6, 0.05);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        // Utility: Glow Map for Particles
        const createParticleTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 32; canvas.height = 32;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
                grad.addColorStop(0, 'rgba(255,255,255,1)');
                grad.addColorStop(0.2, 'rgba(255,255,255,0.8)');
                grad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 32, 32);
            }
            return new THREE.CanvasTexture(canvas);
        };
        const pTex = createParticleTexture();

        // --- 4. The Particle DNA Architecture ---
        const dnaGroup = new THREE.Group();
        globalGroup.add(dnaGroup);
        
        // Tilt the DNA precisely like the user's reference image
        dnaGroup.rotation.z = Math.PI / 5;
        dnaGroup.rotation.y = Math.PI / 4;

        // ----------------------------------------------------
        // BUILD THE VOLUMETRIC PARTICLE CLOUD
        // ----------------------------------------------------
        const numStrandParticles = 4000; // 4000 per strand
        const numRungs = 45;
        const pointsPerRung = 80; 
        const numAmbientParticles = 2000;
        
        const totalPoints = (numStrandParticles * 2) + (numRungs * pointsPerRung) + numAmbientParticles;
        
        const posArray = new Float32Array(totalPoints * 3);
        const colArray = new Float32Array(totalPoints * 3);
        const sizeArray = new Float32Array(totalPoints);
        const phaseArray = new Float32Array(totalPoints);

        const colorLeft = new THREE.Color(0xff2200);  // Intense Red/Orange
        const colorRight = new THREE.Color(0x00aaff); // Intense Cyan/Blue

        const heightSpread = 22.0;
        const radius = 2.8;
        const turns = 2.5;
        let ptIdx = 0;

        // Helper to add a particle
        const addParticle = (x: number, y: number, z: number, r: number, g: number, b: number, size: number) => {
            posArray[ptIdx * 3] = x;
            posArray[ptIdx * 3 + 1] = y;
            posArray[ptIdx * 3 + 2] = z;
            colArray[ptIdx * 3] = r;
            colArray[ptIdx * 3 + 1] = g;
            colArray[ptIdx * 3 + 2] = b;
            sizeArray[ptIdx] = size;
            phaseArray[ptIdx] = Math.random() * Math.PI * 2;
            ptIdx++;
        };

        // 1. Backbone A (Red)
        for (let i = 0; i < numStrandParticles; i++) {
            const t = i / numStrandParticles; 
            const y = t * heightSpread - (heightSpread / 2);
            const angle = t * Math.PI * 2 * turns;
            
            // Base path
            const cx = Math.cos(angle) * radius;
            const cz = Math.sin(angle) * radius;
            
            // Volumetric tube scatter
            const scatterRadius = Math.random() * 0.5;
            const scatterAngle = Math.random() * Math.PI * 2;
            
            const px = cx + Math.cos(scatterAngle) * scatterRadius;
            const py = y + (Math.random() - 0.5) * 0.2;
            const pz = cz + Math.sin(scatterAngle) * scatterRadius;
            
            // Randomly make some backbone particles much brighter/larger
            const isHighlight = Math.random() > 0.95;
            const size = isHighlight ? (Math.random() * 0.15 + 0.08) : (Math.random() * 0.05 + 0.02);
            
            let c = colorLeft;
            if (isHighlight) c = new THREE.Color(0xffffff).lerp(colorLeft, 0.5);

            addParticle(px, py, pz, c.r, c.g, c.b, size);
        }

        // 2. Backbone B (Blue)
        for (let i = 0; i < numStrandParticles; i++) {
            const t = i / numStrandParticles; 
            const y = t * heightSpread - (heightSpread / 2);
            const angle = (t * Math.PI * 2 * turns) + Math.PI; // Offset by 180 deg
            
            const cx = Math.cos(angle) * radius;
            const cz = Math.sin(angle) * radius;
            
            const scatterRadius = Math.random() * 0.5;
            const scatterAngle = Math.random() * Math.PI * 2;
            
            const px = cx + Math.cos(scatterAngle) * scatterRadius;
            const py = y + (Math.random() - 0.5) * 0.2;
            const pz = cz + Math.sin(scatterAngle) * scatterRadius;
            
            const isHighlight = Math.random() > 0.95;
            const size = isHighlight ? (Math.random() * 0.15 + 0.08) : (Math.random() * 0.05 + 0.02);
            
            let c = colorRight;
            if (isHighlight) c = new THREE.Color(0xffffff).lerp(colorRight, 0.5);

            addParticle(px, py, pz, c.r, c.g, c.b, size);
        }

        // 3. The Rungs (Base Pairs)
        for(let i = 0; i < numRungs; i++) {
            const t = i / numRungs;
            // Shift y slightly so rungs sit inside the backbone naturally
            const y = t * heightSpread - (heightSpread / 2);
            const angle = t * Math.PI * 2 * turns;
            
            const px1 = Math.cos(angle) * radius;
            const pz1 = Math.sin(angle) * radius;
            const px2 = Math.cos(angle + Math.PI) * radius;
            const pz2 = Math.sin(angle + Math.PI) * radius;
            
            for(let j = 0; j < pointsPerRung; j++) {
                const rt = j / pointsPerRung;
                // Scatter rung points slightly to make them look like energy streams
                const scatterX = (Math.random() - 0.5) * 0.2;
                const scatterY = (Math.random() - 0.5) * 0.2;
                const scatterZ = (Math.random() - 0.5) * 0.2;

                const px = px1 + (px2 - px1) * rt + scatterX;
                const py = y + scatterY;
                const pz = pz1 + (pz2 - pz1) * rt + scatterZ;
                
                // Perfect gradient mix for the connection
                const c = colorLeft.clone().lerp(colorRight, rt);
                
                // Boost brightness of rung particles
                const size = Math.random() * 0.04 + 0.01;
                addParticle(px, py, pz, c.r, c.g, c.b, size);
            }
        }

        // 4. Ambient Floating Dust
        for (let i = 0; i < numAmbientParticles; i++) {
            const hSpread = heightSpread * 1.2;
            const r = Math.random() * radius * 2.5;
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * hSpread;

            const px = Math.cos(theta) * r;
            const pz = Math.sin(theta) * r;

            const isRed = Math.random() > 0.5;
            const baseColor = isRed ? colorLeft : colorRight;
            const c = baseColor.clone().lerp(new THREE.Color(0x000000), Math.random() * 0.5); // some are darker

            const size = Math.random() * 0.06 + 0.01;
            addParticle(px, y, pz, c.r, c.g, c.b, size);
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colArray, 3));
        particleGeo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
        particleGeo.setAttribute('phase', new THREE.BufferAttribute(phaseArray, 1));

        // Use standard Points material - safe and fully compatible across devices
        const particleMat = new THREE.PointsMaterial({ 
            size: 0.15, 
            vertexColors: true, 
            map: pTex,
            transparent: true, 
            opacity: 0.8, 
            blending: THREE.AdditiveBlending, 
            depthWrite: false
        });

        const dbHelix = new THREE.Points(particleGeo, particleMat);
        dnaGroup.add(dbHelix);

        // --- 5. Interaction State ---
        let interactionEnergy = 0;
        let mouseX = 0; let mouseY = 0;

        const onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const prevX = mouseX; const prevY = mouseY;
            mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / height) * 2 + 1;
            
            const velocity = Math.sqrt(Math.pow(mouseX - prevX, 2) + Math.pow(mouseY - prevY, 2));
            interactionEnergy = Math.min(interactionEnergy + velocity * 10.0, 5.0);
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
            globalGroup.position.x = w > 768 ? 4.5 : 1.5;
        };
        window.addEventListener('resize', handleResize);

        const clock = new THREE.Clock();

        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            
            interactionEnergy = Math.max(0, interactionEnergy - 0.05);
            const speed = 1.0 + interactionEnergy;
            
            // Subtle cinematic rotation
            dnaGroup.rotation.y = time * -0.05;
            dnaGroup.rotation.x = Math.sin(time * 0.2) * 0.05;

            // Animate only the ambient particles making them float up/down slowly
            const posAttr = particleGeo.attributes.position;
            const startAmbient = (numStrandParticles * 2) + (numRungs * pointsPerRung);
            
            for(let i = startAmbient; i < totalPoints; i++) {
                const phase = phaseArray[i];
                let y = posAttr.getY(i);
                // Float upwards
                y += 0.01 * speed * (Math.sin(phase) > 0 ? 1 : -1); 
                if (y > heightSpread * 1.5) y = -heightSpread * 1.5;
                if (y < -heightSpread * 1.5) y = heightSpread * 1.5;
                posAttr.setY(i, y);

                // Wobble X and Z
                posAttr.setX(i, posAttr.getX(i) + Math.sin(time + phase) * 0.005);
                posAttr.setZ(i, posAttr.getZ(i) + Math.cos(time + phase) * 0.005);
            }
            posAttr.needsUpdate = true;

            // Parallax Depth Camera Shift
            globalGroup.position.y += (mouseY * 1.0 - globalGroup.position.y) * 0.02;
            camera.position.x += (mouseX * 2.0 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 2.0 - camera.position.y) * 0.05;
            camera.lookAt(globalGroup.position);

            // Intense Bloom when hovered
            bloomPass.strength = 2.5 + interactionEnergy * 0.8;

            composer.render();
        };

        animate();

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            particleGeo.dispose();
            particleMat.dispose();
            pTex.dispose();
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
            className="absolute inset-y-0 right-0 w-[500px] md:w-[700px] lg:w-[900px] z-0 pointer-events-none [mask-image:linear-gradient(to_left,black_10%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_30%)]" 
        />
    );
}
