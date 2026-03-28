import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function NeuralNetwork3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0b0e14, 0.04);

        const globalGroup = new THREE.Group();
        scene.add(globalGroup);

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 18;
        // Position it to the right side of the container (similar to CoreReactor)
        globalGroup.position.x = width > 768 ? 6.0 : 2.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const renderScene = new RenderPass(scene, camera);
        renderScene.clearColor = new THREE.Color(0x000000);
        renderScene.clearAlpha = 0;

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.8, 0.5, 0.1);
        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        // Network Configuration
        const particleCount = 200;
        const r = 12; // Radius of the bounding sphere
        const maxDistance = 3.5; // Maximum distance to draw a line

        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities: THREE.Vector3[] = [];

        // Base colors
        const colorRed = new THREE.Color(0xff2d20);
        const colorWhite = new THREE.Color(0xffffff);

        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * 2 * r;
            const y = (Math.random() - 0.5) * 2 * r;
            const z = (Math.random() - 0.5) * 2 * r;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Mix red and white
            const mixRatio = Math.random();
            const color = colorRed.clone().lerp(colorWhite, mixRatio > 0.8 ? 1 : 0.2);
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Random subtle movement vectors
            velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ));
        }

        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create glowing sprite material for nodes
        const createGlowTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 32; canvas.height = 32;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
                grad.addColorStop(0, 'rgba(255,255,255,1)');
                grad.addColorStop(0.2, 'rgba(255,45,32,0.8)');
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 32, 32);
            }
            return new THREE.CanvasTexture(canvas);
        };

        const pMat = new THREE.PointsMaterial({
            size: 0.8,
            map: createGlowTexture(),
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            opacity: 0.9,
        });

        const particles = new THREE.Points(pGeo, pMat);
        globalGroup.add(particles);

        // Lines setup
        // We will update this geometry every frame
        const maxLines = particleCount * 15;
        const linePositions = new Float32Array(maxLines * 6); // 2 vertices per line, 3 coords each
        const lineColors = new Float32Array(maxLines * 6);
        
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
        
        const lineMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.4,
            depthWrite: false
        });

        const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
        globalGroup.add(linesMesh);

        // Mouse interaction for Parallax
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
            globalGroup.position.x = w > 768 ? 6.0 : 2.5;
        };
        window.addEventListener('resize', handleResize);

        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);

            // Update positions
            const posAttr = pGeo.attributes.position;
            const colAttr = pGeo.attributes.color;
            let vertexIndex = 0;
            let numConnected = 0;

            for (let i = 0; i < particleCount; i++) {
                // Move particles
                let px = posAttr.getX(i) + velocities[i].x;
                let py = posAttr.getY(i) + velocities[i].y;
                let pz = posAttr.getZ(i) + velocities[i].z;

                // Bounce off bounds
                if (px < -r || px > r) velocities[i].x *= -1;
                if (py < -r || py > r) velocities[i].y *= -1;
                if (pz < -r || pz > r) velocities[i].z *= -1;

                posAttr.setXYZ(i, px, py, pz);

                // Find connections
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = px - posAttr.getX(j);
                    const dy = py - posAttr.getY(j);
                    const dz = pz - posAttr.getZ(j);
                    const distSq = dx * dx + dy * dy + dz * dz;

                    if (distSq < maxDistance * maxDistance) {
                        const alpha = 1.0 - (Math.sqrt(distSq) / maxDistance);

                        // Extract colors
                        const r1 = colAttr.getX(i); const g1 = colAttr.getY(i); const b1 = colAttr.getZ(i);
                        const r2 = colAttr.getX(j); const g2 = colAttr.getY(j); const b2 = colAttr.getZ(j);

                        // Line start
                        linePositions[vertexIndex * 3] = px;
                        linePositions[vertexIndex * 3 + 1] = py;
                        linePositions[vertexIndex * 3 + 2] = pz;
                        lineColors[vertexIndex * 3] = r1 * alpha;
                        lineColors[vertexIndex * 3 + 1] = g1 * alpha;
                        lineColors[vertexIndex * 3 + 2] = b1 * alpha;
                        vertexIndex++;

                        // Line end
                        linePositions[vertexIndex * 3] = posAttr.getX(j);
                        linePositions[vertexIndex * 3 + 1] = posAttr.getY(j);
                        linePositions[vertexIndex * 3 + 2] = posAttr.getZ(j);
                        lineColors[vertexIndex * 3] = r2 * alpha;
                        lineColors[vertexIndex * 3 + 1] = g2 * alpha;
                        lineColors[vertexIndex * 3 + 2] = b2 * alpha;
                        vertexIndex++;

                        numConnected++;
                        if (numConnected >= maxLines) break; // safeguard
                    }
                }
            }

            posAttr.needsUpdate = true;
            
            lineGeo.setDrawRange(0, vertexIndex);
            lineGeo.attributes.position.needsUpdate = true;
            lineGeo.attributes.color.needsUpdate = true;

            // Global rotation and parallax
            globalGroup.rotation.y += 0.0015;
            globalGroup.rotation.x += 0.0005;

            // Add parallax effect from mouse
            globalGroup.position.y += (mouseY * 1.5 - globalGroup.position.y) * 0.05;

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
