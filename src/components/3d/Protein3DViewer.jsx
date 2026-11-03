import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  generateProteinBackbone, 
  createRibbonMesh, 
  createSpaceFillingMesh, 
  createBallAndStickMesh, 
  createSurfaceEnvelopeMesh,
  BOTANICAL_3D_PALETTE 
} from './ProteinStructureGenerator';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Layers, 
  Maximize2, 
  Sparkles, 
  Info,
  ShieldAlert,
  Dna
} from 'lucide-react';

export default function Protein3DViewer({ 
  protein = { id: 'P04637', name: 'TP53', organism: 'Homo sapiens', length: 393, sequence: '' },
  height = 'h-[440px]' 
}) {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  // Representation & Visual States
  const [representation, setRepresentation] = useState('ribbon'); // 'ribbon' | 'spacefill' | 'ballstick' | 'surface'
  const [colorMode, setColorMode] = useState('botanical'); // 'botanical' | 'polarity'
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const currentProteinRef = useRef(protein);
  currentProteinRef.current = protein;

  // Scene objects ref
  const sceneGroupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 440;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#F6F7F1', 0.01);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 1000);
    camera.position.set(0, 10, 52);
    cameraRef.current = camera;

    // 3. WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = true;
    controls.minDistance = 20;
    controls.maxDistance = 110;
    controls.autoRotate = false;
    controlsRef.current = controls;

    // 5. Lighting Rig
    const ambientLight = new THREE.AmbientLight('#FAF9F3', 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#EAF0E9', 2.4);
    keyLight.position.set(30, 40, 25);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#88A58B', 1.1);
    fillLight.position.set(-25, -20, -15);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#659A8B', 1.2);
    rimLight.position.set(0, 30, -35);
    scene.add(rimLight);

    // 6. Protein Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    sceneGroupRef.current = modelGroup;

    // Generate Residues from current protein
    const residues = generateProteinBackbone(
      protein.id, 
      protein.length || 350, 
      protein.sequence || ''
    );

    // Build initial mesh based on representation
    const buildModel = (rep) => {
      // Clear existing children
      while (modelGroup.children.length > 0) {
        const obj = modelGroup.children[0];
        modelGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      }

      let newMesh;
      if (rep === 'spacefill') {
        newMesh = createSpaceFillingMesh(residues);
      } else if (rep === 'ballstick') {
        newMesh = createBallAndStickMesh(residues);
      } else if (rep === 'surface') {
        newMesh = createSurfaceEnvelopeMesh(residues);
        // Also add slender backbone inside surface
        const coreBackbone = createRibbonMesh(residues, { wireframe: false });
        coreBackbone.scale.setScalar(0.75);
        newMesh.add(coreBackbone);
      } else {
        // Default: ribbon cartoon
        newMesh = createRibbonMesh(residues);
      }

      modelGroup.add(newMesh);
    };

    buildModel(representation);

    // 7. Render Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotateRef.current && modelGroup) {
        modelGroup.rotation.y += 0.004;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw > 0 && nh > 0) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    });
    resizeObserver.observe(container);

    // Store rebuild function on ref for representation changes
    container.__buildModel = buildModel;

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [protein.id]); // Re-instantiate when selected protein changes

  // Trigger rebuild when representation state changes
  useEffect(() => {
    if (containerRef.current && containerRef.current.__buildModel) {
      containerRef.current.__buildModel(representation);
    }
  }, [representation]);

  // Controls Handlers
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 10, 52);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    if (sceneGroupRef.current) {
      sceneGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const handleZoom = (delta) => {
    if (cameraRef.current && controlsRef.current) {
      const zoomVec = new THREE.Vector3().subVectors(cameraRef.current.position, controlsRef.current.target);
      zoomVec.multiplyScalar(delta);
      cameraRef.current.position.copy(controlsRef.current.target).add(zoomVec);
      controlsRef.current.update();
    }
  };

  return (
    <div className={`relative w-full ${height} rounded-2xl bg-gradient-to-b from-[#FAF9F3] via-[#F4F6EE] to-[#EAF0E9] border border-[#E2E8DF] shadow-card overflow-hidden flex flex-col justify-between select-none`}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay: Protein Metadata & Disclaimers */}
      <div className="relative z-10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-[#E2E8DF] font-mono font-bold text-xs text-[#244A3B] shadow-xs flex items-center gap-1.5 pointer-events-auto">
            <Dna size={13} className="text-[#88A58B]" />
            <span>{protein.id}</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#EEF4ED] border border-[#D1E0CE] text-[10px] font-mono text-[#244A3B] font-semibold pointer-events-auto">
            {protein.organism || 'Homo sapiens'}
          </span>
          <span className="text-[11px] font-mono text-[#758379] hidden md:inline">
            • {protein.length || 393} Residues (~{( (protein.length || 393) * 0.11 ).toFixed(1)} kDa)
          </span>
        </div>

        {/* Structural Disclaimer Tag */}
        <div className="pointer-events-auto flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-[#E2E8DF] text-[#758379] shadow-xs">
          <Info size={12} className="text-[#88A58B]" />
          <span>Illustrative 3D Structural Fold (PDB/AlphaFold Ready)</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Representation Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8DF] shadow-card pointer-events-auto">
          {[
            { id: 'ribbon', label: 'Ribbon / Cartoon' },
            { id: 'spacefill', label: 'Space-Filling (CPK)' },
            { id: 'ballstick', label: 'Ball & Stick' },
            { id: 'surface', label: 'Surface Envelope' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setRepresentation(mode.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                representation === mode.id
                  ? 'bg-[#244A3B] text-white font-bold shadow-xs'
                  : 'text-[#758379] hover:text-[#244A3B] hover:bg-[#FAF9F3]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Camera Controls Group */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8DF] shadow-card pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              autoRotate 
                ? 'bg-[#244A3B] text-white border-[#244A3B]' 
                : 'bg-white text-[#758379] border-[#E2E8DF] hover:text-[#244A3B]'
            }`}
            title={autoRotate ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
          >
            {autoRotate ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <button
            onClick={() => handleZoom(0.85)}
            className="p-1.5 rounded-lg bg-white hover:bg-[#FAF9F3] border border-[#E2E8DF] text-[#758379] hover:text-[#244A3B] transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>

          <button
            onClick={() => handleZoom(1.18)}
            className="p-1.5 rounded-lg bg-white hover:bg-[#FAF9F3] border border-[#E2E8DF] text-[#758379] hover:text-[#244A3B] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>

          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg bg-white hover:bg-[#FAF9F3] border border-[#E2E8DF] text-[#758379] hover:text-[#244A3B] transition-colors"
            title="Reset Orientation"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
