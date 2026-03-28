import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

// ─── Glow particle texture generator ───
function createGlowTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

// ─── Custom shaders ───
const vertexShader = `
    attribute float size;
    attribute float blinkOffset;
    attribute vec3 customColor;

    varying vec3 vColor;
    varying float vBlink;

    uniform float time;

    void main() {
        vColor = customColor;
        vBlink = blinkOffset;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

        float pulse = sin(time * 3.0 + blinkOffset) * 0.5 + 0.5;
        float currentSize = size * (0.8 + pulse * 0.4);

        gl_PointSize = currentSize * (350.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    uniform sampler2D pointTexture;
    uniform float time;

    varying vec3 vColor;
    varying float vBlink;

    void main() {
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);

        float pulse = sin(time * 3.0 + vBlink) * 0.5 + 0.5;
        vec3 finalColor = mix(vColor, vec3(1.0), texColor.a * 0.4 * pulse);

        // Reduced alpha here to lower the glow intensity
        gl_FragColor = vec4(finalColor * 1.2, texColor.a * (0.2 + pulse * 0.5));
    }
`;

// ─── Color scheme matching MajorMind brand ───
function getNeonColor(x: number, y: number, z: number): THREE.Color {
    const color = new THREE.Color();
    const distanceToCenter = Math.sqrt(x * x + y * y + z * z);

    const brandRed = new THREE.Color(0xff4b4b);
    const deepRed = new THREE.Color(0x880000);
    const warmOrange = new THREE.Color(0xff9900);

    if (x < 0) {
        const mixVal = Math.abs(x) / 12.0;
        const secondaryMix = (y + 10) / 20.0;
        color.copy(deepRed).lerp(brandRed, secondaryMix).lerp(new THREE.Color(0xff2222), mixVal);
    } else {
        const mixVal = Math.abs(x) / 12.0;
        const secondaryMix = (y + 10) / 20.0;
        color.copy(brandRed).lerp(warmOrange, secondaryMix).lerp(new THREE.Color(0xff6600), mixVal);
    }

    if (distanceToCenter < 6.0) {
        color.lerp(new THREE.Color(0xffdddd), 1.0 - distanceToCenter / 6.0);
    }
    return color;
}

// ─── Pulse data interface ───
interface PulseInfo {
    start: THREE.Vector3;
    end: THREE.Vector3;
    progress: number;
    speed: number;
    color: THREE.Color;
}

interface ConnectionInfo {
    start: THREE.Vector3;
    end: THREE.Vector3;
    color: THREE.Color;
}

export default function NeuralBrain3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const frameRef = useRef<number>(0);

    const initScene = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        // ─── Scene setup ───
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.012);

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 45;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const particleTexture = createGlowTexture();

        const shaderUniforms = {
            time: { value: 0.0 },
            pointTexture: { value: particleTexture },
        };

        // ─── Brain group ───
        const brainGroup = new THREE.Group();
        scene.add(brainGroup);

        const cerebrumCount = 12000;
        const cerebellumCount = 2500;
        const stemCount = 1000;
        const totalParticles = cerebrumCount + cerebellumCount + stemCount;

        const positions = new Float32Array(totalParticles * 3);
        const colors = new Float32Array(totalParticles * 3);
        const sizes = new Float32Array(totalParticles);
        const blinkOffsets = new Float32Array(totalParticles);
        const particleVectors: THREE.Vector3[] = [];

        let pIndex = 0;

        function addParticle(x: number, y: number, z: number, c: THREE.Color, sizeBase: number) {
            positions[pIndex * 3] = x;
            positions[pIndex * 3 + 1] = y;
            positions[pIndex * 3 + 2] = z;

            colors[pIndex * 3] = c.r;
            colors[pIndex * 3 + 1] = c.g;
            colors[pIndex * 3 + 2] = c.b;

            const isNode = Math.random() > 0.85;
            sizes[pIndex] = isNode ? sizeBase * 4.0 : sizeBase * (0.5 + Math.random() * 1.5);
            blinkOffsets[pIndex] = Math.random() * Math.PI * 2;

            particleVectors.push(new THREE.Vector3(x, y, z));
            pIndex++;
        }

        // ─── A. Cerebrum (main brain) ───
        for (let i = 0; i < cerebrumCount; i++) {
            // Use spherical coordinates with better distribution
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            
            // Base radius with slight noise
            let radius = 11.5 + Math.random() * 1.5;

            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin(theta);
            let z = radius * Math.cos(phi);

            // 1. Base anatomical shaping (elongated front-to-back, slightly wider at back)
            z *= 1.4; // Front-to-back elongation
            x *= 0.85; // Side-to-side narrowing
            y *= 0.9; // Flatten slightly on top/bottom
            
            // Wider at the parietal/occipital region (back), narrower at frontal (front)
            if (z > 0) {
                x *= 1.0 + (z * 0.03); // Widen back
            } else {
                x *= 1.0 - (Math.abs(z) * 0.02); // Narrow front
                y -= Math.abs(z) * 0.05; // Slant down towards front
            }

            // 2. Medial Longitudinal Fissure (deep cut between hemispheres)
            const xAbs = Math.abs(x);
            if (xAbs < 2.5) {
                // Deepen the fissure
                const depth = Math.pow((2.5 - xAbs) / 2.5, 2.0);
                x += (x > 0 ? 1 : -1) * depth * 2.0;
                y -= depth * 3.0;
                z += depth * 0.5;
            }

            // 3. Temporal Lobes (bulges on the lower sides)
            if (y < 2 && y > -6 && xAbs > 3.5 && z > -3 && z < 5) {
                const lobeFactor = Math.sin(((z + 3) / 8) * Math.PI) * Math.sin(((y + 6) / 8) * Math.PI);
                x += (x > 0 ? 1 : -1) * lobeFactor * 2.5;
                y -= lobeFactor * 1.5;
            }

            // 4. Frontal Lobe slope
            if (z < -5) {
                y -= Math.pow(Math.abs(z + 5) * 0.3, 1.5);
            }
            
            // 5. Occipital Lobe tuck (bottom back)
            if (z > 8 && y < -1) {
                y += (z - 8) * 0.4;
                x *= 0.9;
            }

            // 6. Cortex Folds (Gyri & Sulci) - Layered frequencies for realistic wrinkles
            // Use coordinate-based noise to push/pull vertices
            const f1 = Math.sin(x*1.2) * Math.cos(y*1.2) * Math.sin(z*1.2);
            const f2 = Math.sin(x*2.5 + 1) * Math.cos(y*2.5 - 1) * Math.sin(z*2.5);
            const f3 = Math.sin(x*4.5) * Math.cos(y*4.5) * Math.sin(z*4.5);
            
            // Combine folds: deeper in some areas, smoother in others
            let foldDepth = (f1 * 0.5 + f2 * 0.35 + f3 * 0.15) * 2.8;
            
            // Folds are less pronounced deep in the fissure
            if (xAbs < 2.0) foldDepth *= 0.3;

            const len = Math.sqrt(x * x + y * y + z * z);
            x += (x / len) * foldDepth;
            y += (y / len) * foldDepth;
            z += (z / len) * foldDepth;

            // Final containment to ensure it looks like a brain
            if (y < -7) x *= 0.8;

            addParticle(x, y, z, getNeonColor(x, y, z), 1.2);
        }

        // ─── B. Cerebellum (smaller, dense structure at lower back) ───
        for (let i = 0; i < cerebellumCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const radius = 3.5 + Math.random() * 1.8; // Denser inner/outer

            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin(theta);
            let z = radius * Math.cos(phi);

            // Shape into two hemispheres (butterfly shape)
            x *= 1.8; // Wide
            y *= 0.5; // Flat
            z *= 0.9;
            
            // Cerebellar vermis (middle connection)
            const xAbs = Math.abs(x);
            if (xAbs < 1.0) {
                y -= Math.pow(1.0 - xAbs, 2.0) * 0.5;
                z += Math.pow(1.0 - xAbs, 2.0) * 0.5;
            }

            // Folia striations (fine horizontal line patterns typical of cerebellum)
            const striationHeight = Math.sin(y * 15 + z * 5) * 0.4;
            const striationDepth = Math.cos(y * 20) * 0.3;
            x += striationHeight * Math.sign(x);
            z += striationDepth;

            // Positioning: tucked under occipital lobe
            y -= 9.5;
            z += 8.5; // Move to the back

            addParticle(x, y, z, getNeonColor(x, y, z), 1.0);
        }

        // ─── C. Brain Stem (Midbrain, Pons, Medulla) ───
        for (let i = 0; i < stemCount; i++) {
            const h = Math.random(); // Height 0 to 1
            const angle = Math.random() * Math.PI * 2;
            
            // Tapered cylinder shape
            // Pons (bulge in the middle)
            let bulge = 0;
            if (h > 0.4 && h < 0.7) {
                bulge = Math.sin(((h - 0.4) / 0.3) * Math.PI) * 1.5;
            }
            
            const radius = (1.5 + Math.random() * 0.5 + bulge) * (1.1 - h * 0.3);

            let x = radius * Math.cos(angle);
            const y = -6.0 - h * 9.0; // Extend downwards
            
            // Curve the stem slightly backwards then forwards
            let zOffset = 3.0; // Base offset
            if (h < 0.5) zOffset += h * 2.0; // Curve back
            else zOffset += (1.0 - h) * 2.0; // Curve front
            
            let z = zOffset + radius * Math.sin(angle);

            // Vertical striations (tracts)
            const verticalLines = Math.sin(angle * 8) * 0.2;
            x += verticalLines;
            z += verticalLines;

            const c = getNeonColor(x, y, z);
            c.multiplyScalar(0.65); // Stem is slightly darker
            addParticle(x, y, z, c, 0.9);
        }

        // ─── Build particle system ───
        const brainGeom = new THREE.BufferGeometry();
        brainGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        brainGeom.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        brainGeom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        brainGeom.setAttribute('blinkOffset', new THREE.BufferAttribute(blinkOffsets, 1));

        const brainMaterial = new THREE.ShaderMaterial({
            uniforms: shaderUniforms,
            vertexShader,
            fragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
        });

        const brainNodes = new THREE.Points(brainGeom, brainMaterial);
        brainGroup.add(brainNodes);

        // ─── Neural network lines ───
        const linePositions: number[] = [];
        const lineColors: number[] = [];
        const validConnections: ConnectionInfo[] = [];
        const maxDistanceSq = 2.0 * 2.0;

        for (let i = 0; i < totalParticles; i += 4) {
            const v1 = particleVectors[i];
            let connections = 0;

            for (let j = i + 1; j < totalParticles; j += 7) {
                const v2 = particleVectors[j];
                const distSq = v1.distanceToSquared(v2);

                if (distSq < maxDistanceSq) {
                    linePositions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);

                    const idx1 = i * 3;
                    const idx2 = j * 3;
                    lineColors.push(colors[idx1], colors[idx1 + 1], colors[idx1 + 2]);
                    lineColors.push(colors[idx2], colors[idx2 + 1], colors[idx2 + 2]);

                    validConnections.push({
                        start: v1,
                        end: v2,
                        color: new THREE.Color(colors[idx1], colors[idx1 + 1], colors[idx1 + 2]),
                    });

                    connections++;
                    if (connections >= 3) break;
                }
            }
        }

        const linesGeom = new THREE.BufferGeometry();
        linesGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        linesGeom.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

        const linesMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.15,
            depthWrite: false,
        });

        const brainLines = new THREE.LineSegments(linesGeom, linesMaterial);
        brainGroup.add(brainLines);

        // ─── Traveling data pulses ───
        const pulseCount = Math.min(1500, validConnections.length > 0 ? 1500 : 0);

        let pulseSystem: THREE.Points | null = null;
        const pulseData: PulseInfo[] = [];

        if (validConnections.length > 0 && pulseCount > 0) {
            const pulseGeom = new THREE.BufferGeometry();
            const pulsePos = new Float32Array(pulseCount * 3);
            const pulseCol = new Float32Array(pulseCount * 3);

            for (let i = 0; i < pulseCount; i++) {
                const conn = validConnections[Math.floor(Math.random() * validConnections.length)];
                pulseData.push({
                    start: conn.start,
                    end: conn.end,
                    progress: Math.random(),
                    speed: 0.01 + Math.random() * 0.03,
                    color: conn.color,
                });

                pulsePos[i * 3] = conn.start.x;
                pulsePos[i * 3 + 1] = conn.start.y;
                pulsePos[i * 3 + 2] = conn.start.z;

                pulseCol[i * 3] = conn.color.r;
                pulseCol[i * 3 + 1] = conn.color.g;
                pulseCol[i * 3 + 2] = conn.color.b;
            }

            pulseGeom.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
            pulseGeom.setAttribute('color', new THREE.BufferAttribute(pulseCol, 3));

            const pulseMaterial = new THREE.PointsMaterial({
                size: 2.5,
                vertexColors: true,
                map: particleTexture,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                transparent: true,
                opacity: 1.0,
            });

            pulseSystem = new THREE.Points(pulseGeom, pulseMaterial);
            brainGroup.add(pulseSystem);
        }

        // ─── Core glow ───
        const coreGlowGeom = new THREE.SphereGeometry(6, 32, 32);
        const coreGlowMat = new THREE.MeshBasicMaterial({
            color: 0xff4b4b,
            transparent: true,
            opacity: 0.02, // lowered glow intensity
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const coreGlow = new THREE.Mesh(coreGlowGeom, coreGlowMat);
        brainGroup.add(coreGlow);

        // ─── Resize handler ───
        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // ─── Animation loop ───
        const clock = new THREE.Clock();

        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            shaderUniforms.time.value = elapsedTime;

            // Update pulses
            if (pulseSystem && pulseData.length > 0) {
                const pPositions = pulseSystem.geometry.attributes.position.array as Float32Array;
                const pColors = pulseSystem.geometry.attributes.color.array as Float32Array;

                for (let i = 0; i < pulseData.length; i++) {
                    const p = pulseData[i];
                    p.progress += p.speed;

                    if (p.progress >= 1.0) {
                        const conn = validConnections[Math.floor(Math.random() * validConnections.length)];
                        p.start = conn.start;
                        p.end = conn.end;
                        p.progress = 0;

                        pColors[i * 3] = conn.color.r;
                        pColors[i * 3 + 1] = conn.color.g;
                        pColors[i * 3 + 2] = conn.color.b;
                    }

                    pPositions[i * 3] = p.start.x + (p.end.x - p.start.x) * p.progress;
                    pPositions[i * 3 + 1] = p.start.y + (p.end.y - p.start.y) * p.progress;
                    pPositions[i * 3 + 2] = p.start.z + (p.end.z - p.start.z) * p.progress;
                }

                pulseSystem.geometry.attributes.position.needsUpdate = true;
                pulseSystem.geometry.attributes.color.needsUpdate = true;
            }

            // Mouse parallax + auto rotation
            const targetX = mouseRef.current.x * 0.001;
            const targetY = mouseRef.current.y * 0.001;

            brainGroup.rotation.y += 0.05 * (targetX - brainGroup.rotation.y);
            brainGroup.rotation.x += 0.05 * (targetY - brainGroup.rotation.x);

            brainGroup.rotation.y += 0.002;
            // Move it slightly up (by 2.0 units plus the sine wave hover)
            brainGroup.position.y = 2.0 + Math.sin(elapsedTime * 2.0) * 0.6;

            // Core glow pulse
            const coreScale = 1.0 + Math.sin(elapsedTime * 4.0) * 0.1;
            coreGlow.scale.set(coreScale, coreScale, coreScale);

            renderer.render(scene, camera);
        };

        animate();

        // ─── Cleanup function ───
        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('resize', handleResize);

            brainGeom.dispose();
            brainMaterial.dispose();
            linesGeom.dispose();
            linesMaterial.dispose();
            coreGlowGeom.dispose();
            coreGlowMat.dispose();
            particleTexture.dispose();

            if (pulseSystem) {
                pulseSystem.geometry.dispose();
                (pulseSystem.material as THREE.Material).dispose();
            }

            renderer.dispose();

            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        const cleanup = initScene();
        return cleanup;
    }, [initScene]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseRef.current.x = e.clientX - rect.left - rect.width / 2;
        mouseRef.current.y = e.clientY - rect.top - rect.height / 2;
    }, []);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative aspect-square w-full max-w-[540px] mx-auto lg:mx-0"
            style={{ minHeight: 400 }}
        >
            {/* Ambient glow behind the brain */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 75, 75, 0.12) 0%, transparent 65%)',
                }}
            />
        </div>
    );
}
