import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function AssessmentHeader3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // --- 1. Scene & Camera Setup ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x030508, 0.015);
        
        const globalGroup = new THREE.Group();
        scene.add(globalGroup);

        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
        camera.position.z = 14; 

        globalGroup.position.x = width > 768 ? 7.5 : 3.0;

        // --- 2. Renderer Config ---
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

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            1.5, // strength
            0.8, // radius
            0.1  // threshold
        );
        
        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        // Utility: Glow Map
        const createRadialGradient = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
                gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 64, 64);
            }
            return new THREE.CanvasTexture(canvas);
        };
        const textureGlow = createRadialGradient();

        // --- 4. 3D Architecture ---

        // Central Core
        const coreGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const core = new THREE.Mesh(coreGeo, coreMat);
        globalGroup.add(core);

        const axisGeo = new THREE.CylinderGeometry(0.015, 0.015, 18, 16);
        const axisMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
        const axis = new THREE.Mesh(axisGeo, axisMat);
        globalGroup.add(axis);

        const glowCore = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureGlow, color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        glowCore.scale.set(4, 4, 1);
        globalGroup.add(glowCore);

        const glowBlue = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureGlow, color: 0x0088ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        glowBlue.scale.set(6, 6, 1);
        globalGroup.add(glowBlue);

        // Composite Rings Setup
        const rings: { group: THREE.Group, speed: number, axis: string, mainMesh: THREE.Mesh }[] = [];
        const createCompositeRing = (radius: number, colorHex: number, thickness: number, speed: number, axisStr: string) => {
            const ringGroup = new THREE.Group();
            const color = new THREE.Color(colorHex);

            // Solid Ring
            const matMain = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
            const mainMesh = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness, 16, 128), matMain);
            // Add custom data for raycaster interactions
            mainMesh.userData = { isRing: true, baseColor: colorHex, targetOpacity: 0.5, currentScale: 1.0 };
            ringGroup.add(mainMesh);

            // Wireframe Ring
            const matWire = new THREE.MeshBasicMaterial({ color: color, wireframe: true, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
            ringGroup.add(new THREE.Mesh(new THREE.TorusGeometry(radius - 0.1, thickness * 0.5, 8, 64), matWire));

            // Orbiting Nodes
            for(let i=0; i<3; i++) {
                const node = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                const angle = (i / 3) * Math.PI * 2;
                node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
                
                const nodeGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureGlow, color: color, blending: THREE.AdditiveBlending, transparent: true }));
                nodeGlow.scale.set(0.5, 0.5, 1);
                node.add(nodeGlow);
                ringGroup.add(node);
            }

            ringGroup.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            globalGroup.add(ringGroup);
            rings.push({ group: ringGroup, speed, axis: axisStr, mainMesh });
        };

        // Initialize Rings (Criteria = Red/Orange, Alternatives = Blue/Cyan)
        createCompositeRing(6.0, 0xff2200, 0.015, 0.005, 'X');
        createCompositeRing(5.6, 0xff4411, 0.010, -0.007, 'Y');
        createCompositeRing(5.2, 0xff1133, 0.020, 0.004, 'Z');
        createCompositeRing(4.5, 0x0088ff, 0.018, 0.008, 'Y');
        createCompositeRing(4.0, 0x00ccff, 0.012, -0.006, 'X');
        createCompositeRing(3.5, 0x3366ff, 0.015, 0.01, 'Z');

        // Matrix Web Connecting Lines (Fibonacci Sphere)
        const webPoints: THREE.Vector3[] = [];
        const webR = 5.5;
        for (let i = 0; i < 150; i++) {
            const phi = Math.acos(-1 + (2 * i) / 150);
            const theta = Math.sqrt(150 * Math.PI) * phi;
            webPoints.push(new THREE.Vector3(webR * Math.cos(theta) * Math.sin(phi), webR * Math.sin(theta) * Math.sin(phi), webR * Math.cos(phi)));
        }

        const linePos: number[] = [];
        for (let i = 0; i < webPoints.length; i++) {
            for (let j = i + 1; j < webPoints.length; j++) {
                if (webPoints[i].distanceTo(webPoints[j]) < 2.5) {
                    linePos.push(webPoints[i].x, webPoints[i].y, webPoints[i].z, webPoints[j].x, webPoints[j].y, webPoints[j].z);
                }
            }
        }
        
        const webMat = new THREE.LineBasicMaterial({ color: 0x4466aa, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
        const webGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        const matrixWeb = new THREE.LineSegments(webGeo, webMat);
        globalGroup.add(matrixWeb);

        // PERFECT Sphere Particles
        const particleCount = 3000;
        const sphereRadius = 7.0;
        const pPositions = new Float32Array(particleCount * 3);
        const pColors = new Float32Array(particleCount * 3);
        const pSizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;

            pPositions[i * 3] = sphereRadius * Math.cos(theta) * Math.sin(phi);
            pPositions[i * 3 + 1] = sphereRadius * Math.sin(theta) * Math.sin(phi);
            pPositions[i * 3 + 2] = sphereRadius * Math.cos(phi);

            const color = new THREE.Color(Math.random() > 0.5 ? 0xff3300 : 0x00aaff);
            pColors[i * 3] = color.r; pColors[i * 3 + 1] = color.g; pColors[i * 3 + 2] = color.b;
            pSizes[i] = Math.random() * 0.05 + 0.02;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
        particleGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

        const particleMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
        const particles = new THREE.Points(particleGeo, particleMat);
        globalGroup.add(particles);

        // --- 5. Interactivity State ---
        let mouseX = 0; let mouseY = 0;
        let targetRotX = 0; let targetRotY = 0;
        let interactionEnergy = 0; // Increases on vigorous mouse movement

        const raycaster = new THREE.Raycaster();
        const mouseVec = new THREE.Vector2(-1000, -1000);

        const onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            
            const prevMouseX = mouseX;
            const prevMouseY = mouseY;

            mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / height) * 2 + 1;
            mouseVec.set(mouseX, mouseY);

            // Calculate Mouse Velocity to surge energy
            const dx = mouseX - prevMouseX;
            const dy = mouseY - prevMouseY;
            const velocity = Math.sqrt(dx * dx + dy * dy);
            
            // Inject interaction energy (max capped)
            interactionEnergy = Math.min(interactionEnergy + velocity * 5.0, 3.0);
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
            globalGroup.position.x = w > 768 ? 7.5 : 3.0;
        };
        window.addEventListener('resize', handleResize);

        const clock = new THREE.Clock();

        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Decay interaction energy slowly
            interactionEnergy = Math.max(0, interactionEnergy - 0.05);

            // 1. Raycaster Logic (Tidy / Smart Interactions)
            raycaster.setFromCamera(mouseVec, camera);
            const meshesToIntersect = rings.map(r => r.mainMesh);
            const intersects = raycaster.intersectObjects(meshesToIntersect);

            // Reset all rings to default state gracefully
            rings.forEach(({ mainMesh }) => {
                const ud = mainMesh.userData;
                ud.targetOpacity = 0.5;
                ud.currentScale += (1.0 - ud.currentScale) * 0.1; // Spring back to scale 1
                (mainMesh.material as THREE.MeshBasicMaterial).opacity += (ud.targetOpacity - (mainMesh.material as THREE.MeshBasicMaterial).opacity) * 0.1;
                mainMesh.scale.setScalar(ud.currentScale);
                (mainMesh.material as THREE.MeshBasicMaterial).color.setHex(ud.baseColor);
            });

            // If a ring is hovered, energize it!
            if (intersects.length > 0) {
                const hoveredMesh = intersects[0].object as THREE.Mesh;
                const ud = hoveredMesh.userData;
                ud.targetOpacity = 1.0; 
                ud.currentScale += (1.08 - ud.currentScale) * 0.2; // Swell up magically
                
                (hoveredMesh.material as THREE.MeshBasicMaterial).opacity += (ud.targetOpacity - (hoveredMesh.material as THREE.MeshBasicMaterial).opacity) * 0.2;
                hoveredMesh.scale.setScalar(ud.currentScale);
                // Flash white-hot on intersection point
                (hoveredMesh.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);
                
                // Extra intense bloom on direct hover
                bloomPass.strength = 1.5 + interactionEnergy + 0.5;
            } else {
                bloomPass.strength = 1.5 + interactionEnergy; // Base bloom + velocity energy
            }

            // 2. Rings Async Rotation (multiplied by interaction energy)
            const speedMultiplier = 1.0 + interactionEnergy;
            rings.forEach((r, idx) => {
                const step = r.speed * speedMultiplier;
                if (r.axis === 'X') r.group.rotation.x += step;
                if (r.axis === 'Y') r.group.rotation.y += step;
                if (r.axis === 'Z') r.group.rotation.z += step;
                
                // Ambient pulsating scale
                const ambientScale = 1 + Math.sin(time * 2 + idx) * 0.01;
                r.group.scale.setScalar(ambientScale);
            });

            // Particles & Web rotation
            particles.rotation.y += 0.001 * speedMultiplier;
            matrixWeb.rotation.x += 0.0005 * speedMultiplier;
            matrixWeb.rotation.y -= 0.0008 * speedMultiplier;

            // 3. Smooth Deep Parallax tracking
            targetRotX = mouseY * 0.15;
            targetRotY = mouseX * 0.15;
            globalGroup.rotation.x += (targetRotX - globalGroup.rotation.x) * 0.05;
            globalGroup.rotation.y += (targetRotY - globalGroup.rotation.y) * 0.05;

            // Core expansion pulse related to interaction energy
            core.scale.setScalar(1.0 + interactionEnergy * 0.2);

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
            className="absolute inset-0 z-0 pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_40%)]" 
        />
    );
}
