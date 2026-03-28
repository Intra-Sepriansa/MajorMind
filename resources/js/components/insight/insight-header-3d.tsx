import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
uniform float uExplode;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Noise function for subtle warping
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

// Flat normal calculation (per vertex but shared by the face since geometry is non-indexed)
// Note: WebGL 1 doesn't have partial derivatives easily in vertex shader, 
// so we assume the geometry is passed as non-indexed BufferGeometry with flat faces.
attribute vec3 faceNormal; 

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Per-face explosion logic: push vertices out along their face normal
    // Add some noise to the explosion distance so it looks organic and mathematical
    float nVal = snoise(vec3(faceNormal.x, faceNormal.y, uTime * 0.2));
    
    // uExplode is 0 (assembled) to 1 (fully separated)
    float displacementAmount = uExplode * (1.5 + nVal * 0.8);
    vec3 newPosition = position + (faceNormal * displacementAmount);
    
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uGlowColor;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Holographic Edge Glow (Fresnel)
    float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 2.0);
    
    // Matrix style wireframe effect based on UV
    // creating a grid/lines on the surface
    float cx = mod(vUv.x * 20.0, 1.0);
    float cy = mod(vUv.y * 20.0, 1.0);
    float grid = (cx < 0.05 || cy < 0.05) ? 1.0 : 0.0;
    
    vec3 finalColor = mix(uBaseColor, uGlowColor, fresnel + grid * 0.5);
    float alpha = uOpacity * (0.3 + fresnel * 0.7 + grid * 0.5);
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;

function createExplodingMaterial(baseHex: string, glowHex: string) {
    return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uExplode: { value: 0 },
            uBaseColor: { value: new THREE.Color(baseHex) },
            uGlowColor: { value: new THREE.Color(glowHex) },
            uOpacity: { value: 0.8 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
}

function processGeometryForExplosion(baseGeo: THREE.BufferGeometry) {
    // To explode by faces, geometry MUST be non-indexed so every 3 vertices belong exclusively to 1 face.
    const geo = baseGeo.toNonIndexed();
    
    // Calculate face normals and inject them as an attribute 'faceNormal'
    geo.computeVertexNormals(); // standard
    
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const faceNormals = new Float32Array(posAttr.count * 3);
    
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();
    
    for (let i = 0; i < posAttr.count; i += 3) {
        vA.fromBufferAttribute(posAttr, i);
        vB.fromBufferAttribute(posAttr, i + 1);
        vC.fromBufferAttribute(posAttr, i + 2);
        
        cb.subVectors(vC, vB);
        ab.subVectors(vA, vB);
        cb.cross(ab).normalize();
        
        // apply to all 3 vertices of the face
        faceNormals[i*3] = cb.x; faceNormals[i*3+1] = cb.y; faceNormals[i*3+2] = cb.z;
        faceNormals[(i+1)*3] = cb.x; faceNormals[(i+1)*3+1] = cb.y; faceNormals[(i+1)*3+2] = cb.z;
        faceNormals[(i+2)*3] = cb.x; faceNormals[(i+2)*3+1] = cb.y; faceNormals[(i+2)*3+2] = cb.z;
    }
    
    geo.setAttribute('faceNormal', new THREE.BufferAttribute(faceNormals, 3));
    return geo;
}

export default function InsightHeader3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        // Camera centered in the right-aligned mask box
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.z = 14;
        camera.position.x = 0; 
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        // --- 1. THE OUTER SHELL (Deconstructed Dodecahedron) ---
        const shellGeo = processGeometryForExplosion(new THREE.DodecahedronGeometry(2.5, 1));
        const shellMat = createExplodingMaterial('#0f172a', '#ff4b4b'); // Dark blue/black base, red glow
        const shellMesh = new THREE.Mesh(shellGeo, shellMat);
        group.add(shellMesh);

        // --- 2. THE MIDDLE SHELL (Wireframe Matrix) ---
        const wireGeo = processGeometryForExplosion(new THREE.IcosahedronGeometry(2.0, 1));
        const wireMat = createExplodingMaterial('#0a0a0a', '#ffffff');
        wireMat.wireframe = true;
        wireMat.uniforms.uOpacity.value = 0.3;
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        group.add(wireMesh);

        // --- 3. THE INNER DECISION CORE (Solid glowing sphere) ---
        // This core never explodes, it is the fundamental "truth"
        const coreGeo = new THREE.IcosahedronGeometry(0.8, 3);
        const coreMat = new THREE.MeshBasicMaterial({ color: '#ff2d20', wireframe: true, transparent: true, opacity: 0.8 });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        
        const coreSolidMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
        const coreSolidMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 2), coreSolidMat);
        coreMesh.add(coreSolidMesh);
        group.add(coreMesh);


        // Interaction physics
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

            // The Explode Logic: Breathe slowly like a heartbeat of data
            // Sin wave from 0.0 to 1.0
            const explodeCycle = (Math.sin(time * 0.8) + 1.0) * 0.5;
            // Add a slight pause at the bottom (assembled) state by clamping
            const explodeSmooth = Math.max(0.0, explodeCycle - 0.2) * 1.25;

            shellMat.uniforms.uTime.value = time;
            shellMat.uniforms.uExplode.value = explodeSmooth * 2.0; // expand outwards
            
            wireMat.uniforms.uTime.value = time;
            wireMat.uniforms.uExplode.value = explodeSmooth * 1.5;

            // Rotations
            shellMesh.rotation.x = time * 0.1;
            shellMesh.rotation.y = time * 0.15;
            
            wireMesh.rotation.x = -time * 0.12;
            wireMesh.rotation.y = -time * 0.18;

            coreMesh.rotation.x = time * 0.5;
            coreMesh.rotation.y = time * 0.6;

            // Parallax
            group.position.x += (mouseX * 0.5 - group.position.x) * dt * 3.0;
            group.position.y += (mouseY * 0.5 - group.position.y) * dt * 3.0;
            group.rotation.x += (-mouseY * 0.2 - group.rotation.x) * dt * 3.0;
            group.rotation.y += (mouseX * 0.2 - group.rotation.y) * dt * 3.0;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            shellGeo.dispose(); shellMat.dispose();
            wireGeo.dispose(); wireMat.dispose();
            coreGeo.dispose(); coreMat.dispose();
            coreSolidMat.dispose();
            renderer.dispose();
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="absolute inset-y-0 right-0 w-[400px] md:w-[600px] lg:w-[700px] z-0 pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_30%)]" 
        />
    );
}
