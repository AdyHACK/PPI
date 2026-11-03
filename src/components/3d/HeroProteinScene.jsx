import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  generateProteinBackbone, 
  createRibbonMesh, 
  BOTANICAL_3D_PALETTE 
} from './ProteinStructureGenerator';
import { Sparkles, RotateCw, Dna, Info } from 'lucide-react';

export default function HeroProteinScene() {
  const containerRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 340;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#FAF9F3', 0.012);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 8, 48);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 25;
    controls.maxDistance = 85;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.autoRotate = false;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight('#FAF9F3', 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight('#EAF0E9', 2.2);
    dirLight1.position.set(25, 35, 20);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight('#88A58B', 1.2);
    dirLight2.position.set(-20, -15, -15);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight('#659A8B', 1.0);
    rimLight.position.set(0, 20, -30);
    scene.add(rimLight);

    // 6. Root Complex Group
    const complexGroup = new THREE.Group();
    scene.add(complexGroup);

    // Large Protein Structure A (Forest Green / Emerald)
    const residuesA = generateProteinBackbone('P04637_TP53_CORE', 393);
    const meshA = createRibbonMesh(residuesA, {
      primaryColor: BOTANICAL_3D_PALETTE.forestGreen,
      helixColor: BOTANICAL_3D_PALETTE.emerald,
      sheetColor: BOTANICAL_3D_PALETTE.sageGreen
    });
    meshA.position.set(-7, 1, 0);
    meshA.rotation.set(0.2, 0.4, -0.1);
    complexGroup.add(meshA);

    // Smaller Protein Structure B (Muted Teal / Sage)
    const residuesB = generateProteinBackbone('Q00987_MDM2_RING', 210);
    const meshB = createRibbonMesh(residuesB, {
      primaryColor: BOTANICAL_3D_PALETTE.mutedTeal,
      helixColor: BOTANICAL_3D_PALETTE.softMint,
      sheetColor: BOTANICAL_3D_PALETTE.mutedOlive
    });
    meshB.position.set(11, -2, 2);
    meshB.rotation.set(-0.3, 0.8, 0.2);
    complexGroup.add(meshB);

    // Molecular Interaction Interface (Translucent Hydrogen Bonding Filaments)
    const connectionGroup = new THREE.Group();
    const contactPoints = [
      { from: new THREE.Vector3(-2, 2, 1), to: new THREE.Vector3(5, 1, 2) },
      { from: new THREE.Vector3(-1, -1, 0), to: new THREE.Vector3(6, -2, 1) },
      { from: new THREE.Vector3(0, 4, -1), to: new THREE.Vector3(7, 3, 0) },
      { from: new THREE.Vector3(-3, -3, 2), to: new THREE.Vector3(4, -4, 3) }
    ];

    const contactLineMats = [];
    contactPoints.forEach((cp) => {
      const curve = new THREE.CatmullRomCurve3([
        cp.from,
        new THREE.Vector3(
          (cp.from.x + cp.to.x) * 0.5,
          (cp.from.y + cp.to.y) * 0.5 + 1.2,
          (cp.from.z + cp.to.z) * 0.5
        ),
        cp.to
      ]);

      const geom = new THREE.TubeGeometry(curve, 20, 0.22, 6, false);
      const mat = new THREE.MeshBasicMaterial({
        color: BOTANICAL_3D_PALETTE.sageGreen,
        transparent: true,
        opacity: 0.65
      });
      contactLineMats.push(mat);
      connectionGroup.add(new THREE.Mesh(geom, mat));
    });
    complexGroup.add(connectionGroup);

    // Floating Molecular Particles / Water / Ions
    const particleCount = 42;
    const particleGeom = new THREE.SphereGeometry(0.35, 10, 10);
    const particleMat = new THREE.MeshStandardMaterial({
      color: BOTANICAL_3D_PALETTE.softMint,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75
    });

    const particlesInstanced = new THREE.InstancedMesh(particleGeom, particleMat, particleCount);
    const particleDummy = new THREE.Object3D();
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 14 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const x = radius * Math.cos(theta) * Math.cos(phi);
      const y = radius * Math.sin(phi);
      const z = radius * Math.sin(theta) * Math.cos(phi);
      
      particleData.push({
        basePos: new THREE.Vector3(x, y, z),
        speed: 0.4 + Math.random() * 0.6,
        freq: 1.5 + Math.random() * 2
      });

      particleDummy.position.set(x, y, z);
      particleDummy.scale.setScalar(0.6 + Math.random() * 0.8);
      particleDummy.updateMatrix();
      particlesInstanced.setMatrixAt(i, particleDummy.matrix);
    }
    particlesInstanced.instanceMatrix.needsUpdate = true;
    complexGroup.add(particlesInstanced);

    // 7. Mouse Parallax Tracking
    const mouseParallax = { x: 0, y: 0 };
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseParallax.x = x;
      mouseParallax.y = y;
    };
    container.addEventListener('pointermove', handlePointerMove);

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle rotation & floating motion with smooth mouse parallax
      if (isRotatingRef.current) {
        complexGroup.rotation.y += 0.0035;
        complexGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.75;

        // Soft natural parallax interpolation
        complexGroup.rotation.x += (mouseParallax.y * 0.12 - complexGroup.rotation.x) * 0.035;
        complexGroup.rotation.z += (-mouseParallax.x * 0.08 - complexGroup.rotation.z) * 0.035;
      }

      // Pulse interaction filaments
      const pulseOpacity = 0.45 + Math.sin(elapsedTime * 2.2) * 0.25;
      contactLineMats.forEach(mat => {
        mat.opacity = pulseOpacity;
      });

      // Animate floating particles
      for (let i = 0; i < particleCount; i++) {
        const pd = particleData[i];
        const py = pd.basePos.y + Math.sin(elapsedTime * pd.speed + i) * 1.5;
        const px = pd.basePos.x + Math.cos(elapsedTime * pd.speed * 0.5 + i) * 1.0;
        particleDummy.position.set(px, py, pd.basePos.z);
        particleDummy.scale.setScalar(0.6 + Math.sin(elapsedTime * pd.freq + i) * 0.25);
        particleDummy.updateMatrix();
        particlesInstanced.setMatrixAt(i, particleDummy.matrix);
      }
      particlesInstanced.instanceMatrix.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handling
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] md:h-[400px] rounded-2xl bg-gradient-to-b from-[#FAF9F3] via-[#F4F6EE] to-[#EAF0E9] border border-[#E2E8DF] shadow-inner overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Scientific Architectural Badges */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-[#E2E8DF] text-[10px] font-mono text-[#244A3B] font-bold shadow-xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#244A3B] animate-pulse" />
          ESM-2 (650M)
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-[#E2E8DF] text-[10px] font-mono text-[#659A8B] font-medium shadow-xs">
          Gene Ontology DAG
        </span>
      </div>

      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-[#E2E8DF] text-[10px] font-mono text-[#A5B18A] font-medium shadow-xs">
          Node2Vec (64d)
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-[#D1E0CE] text-[10px] font-mono text-[#244A3B] font-bold shadow-xs">
          32-Expert MoE
        </span>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-lg border text-xs transition-all shadow-xs flex items-center gap-1 ${
            isRotating 
              ? 'bg-[#244A3B] text-white border-[#244A3B]' 
              : 'bg-white text-[#758379] border-[#E2E8DF] hover:text-[#244A3B]'
          }`}
          title={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
        >
          <RotateCw size={12} className={isRotating ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
        </button>

        <span className="px-2 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-[#E2E8DF] text-[10px] font-mono text-[#758379] shadow-xs hidden sm:inline-block">
          Drag to Orbit • Scroll to Zoom
        </span>
      </div>

      {/* Botanical Scientific Watermark / Disclaimer */}
      <div className="absolute bottom-2 right-3 text-[9px] font-mono text-[#758379]/80 pointer-events-none">
        Illustrative Multimodal Complex Visualization
      </div>
    </div>
  );
}
