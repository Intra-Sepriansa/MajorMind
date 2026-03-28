import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vInstPosition; // local to the instance
varying float vElevation;

// classic Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vUv = uv;

    // The instance matrix defines where the pillar is on the grid
    vec4 worldPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    
    // Calculate elevation based on grid X,Z and Time
    // Add multiple noise octaves to make it look like complex data
    float noiseValue = snoise(vec2(worldPos.x * 0.4 + uTime * 0.5, worldPos.z * 0.4 + uTime * 0.3));
    noiseValue += snoise(vec2(worldPos.x * 0.8 - uTime * 0.2, worldPos.z * 0.8 + uTime * 0.1)) * 0.5;
    
    // Map noise to positive height (0.0 to 3.0)
    float elevation = max(0.0, noiseValue + 0.5) * 2.5;
    vElevation = elevation;

    // Only scale the top vertices of the box (y > 0)
    vec3 animatedPos = position;
    if (animatedPos.y > 0.0) {
        animatedPos.y += elevation;
    }
    
    vInstPosition = animatedPos;
    
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(animatedPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uPeakColor;
uniform vec3 uGridColor;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vInstPosition;
varying float vElevation;

void main() {
    // Height-based coloring. Higher pillars turn vibrant red/orange.
    // The peak happens around vElevation > 1.5
    float mixFactor = clamp((vElevation - 0.5) / 1.5, 0.0, 1.0);
    
    vec3 finalColor = mix(uBaseColor, uPeakColor, mixFactor);
    
    // Add glowing edges to the geometry based on height
    // If we are near the top of the pillar (vInstPosition.y is high), make it brighter
    float yRatio = vInstPosition.y / (vElevation + 0.5); // 0 at bottom, ~1 at top
    float edgeGlow = pow(yRatio, 3.0); // sharp glow only precisely at the top face
    
    finalColor = mix(finalColor, uPeakColor * 1.5, edgeGlow * mixFactor); // super bright tips
    
    // Add wireframe/grid aesthetic by highlighting edges using UVs
    float edgeX = min(vUv.x, 1.0 - vUv.x);
    float edgeY = min(vUv.y, 1.0 - vUv.y);
    float boxEdge = (edgeX < 0.05 || edgeY < 0.05) ? 1.0 : 0.0;
    
    finalColor = mix(finalColor, uGridColor, boxEdge * 0.5);
    
    // Opacity fades out if the pillar is very low to create depth
    float alpha = uOpacity * (0.2 + mixFactor * 0.8 + boxEdge * 0.5);
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;

export default function ScenarioHeader3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        
        // Use a 45 degree isometric perspective
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(12, 10, 15);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        // Grid configurations
        const gridSizeX = 22;
        const gridSizeZ = 22;
        const count = gridSizeX * gridSizeZ;
        const gap = 1.0;
        
        // The pillar geometry (unit box shifted so its bottom is at y=0)
        // Default size is 0.7x0.5x0.7
        const geometry = new THREE.BoxGeometry(0.7, 0.5, 0.7);
        geometry.translate(0, 0.25, 0);

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uBaseColor: { value: new THREE.Color('#0f172a') }, // Slate 900
                uPeakColor: { value: new THREE.Color('#ff2d20') }, // MajorMind Red
                uGridColor: { value: new THREE.Color('#ffffff') },
                uOpacity: { value: 0.9 },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false, // Prevents z-fighting on transparent overdraws
            side: THREE.FrontSide
        });

        const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
        
        // Build the grid
        const dummy = new THREE.Object3D();
        let i = 0;
        const offsetX = (gridSizeX * gap) / 2;
        const offsetZ = (gridSizeZ * gap) / 2;

        for (let x = 0; x < gridSizeX; x++) {
            for (let z = 0; z < gridSizeZ; z++) {
                // Position each pillar on a flat XZ grid
                dummy.position.set(x * gap - offsetX, 0, z * gap - offsetZ);
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
                i++;
            }
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
        group.add(instancedMesh);

        // Interaction physics (mild parallax)
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
        };
        window.addEventListener('resize', handleResize);

        const clock = new THREE.Clock();

        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            const dt = clock.getDelta();
            const time = clock.getElapsedTime();

            // Feed time to shader for noise animation
            material.uniforms.uTime.value = time;

            // Very slow continuous rotation to feel like a scanning landscape
            group.rotation.y = time * 0.05;

            // Subtle parallax based on mouse
            camera.position.x += (12 + mouseX * 2.0 - camera.position.x) * dt * 2.0;
            camera.position.y += (10 + mouseY * 2.0 - camera.position.y) * dt * 2.0;
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            geometry.dispose();
            material.dispose();
            instancedMesh.dispose();
            renderer.dispose();
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    // Width covers entire right half, masked linearly.
    return (
        <div 
            ref={containerRef} 
            className="absolute inset-y-0 right-0 w-[500px] md:w-[700px] lg:w-[800px] z-0 pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_40%)]" 
        />
    );
}
