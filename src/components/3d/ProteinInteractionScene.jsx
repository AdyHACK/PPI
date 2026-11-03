import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  generateProteinBackbone, 
  createRibbonMesh, 
  BOTANICAL_3D_PALETTE 
} from './ProteinStructureGenerator';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Tag, 
  GitMerge, 
  Info, 
  ExternalLink,
  Dna,
  ShieldAlert
} from 'lucide-react';

export default function ProteinInteractionScene({
  proteinA = {
    id: 'P04637',
    name: 'Cellular tumor antigen p53 (TP53)',
    organism: 'Homo sapiens',
    length: 393,
    goAnnotations: {
      bp: [{ term: 'DNA repair', id: 'GO:0006281' }],
      mf: [{ term: 'DNA-binding transcription factor', id: 'GO:0003700' }]
    }
  },
  proteinB = {
    id: 'Q00987',
    name: 'E3 ubiquitin-protein ligase Mdm2 (MDM2)',
    organism: 'Homo sapiens',
    length: 491,
    goAnnotations: {
      bp: [{ term: 'Ubiquitin-dependent catabolism', id: 'GO:0006511' }],
      mf: [{ term: 'Ubiquitin-protein transferase', id: 'GO:0004842' }]
    }
  },
  height = 'h-[480px]',
  isInteracting = true,
  confidence = 97.4
}) {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  const [selectedProtein, setSelectedProtein] = useState('A'); // 'A' | 'B' | null
  const [showLabels, setShowLabels] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const showConnectionsRef = useRef(showConnections);
  showConnectionsRef.current = showConnections;

  const groupARef = useRef(null);
  const groupBRef = useRef(null);
  const connectionsGroupRef = useRef(null);
  const rootSceneRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const heightPx = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#F6F7F1', 0.009);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 1000);
    camera.position.set(0, 12, 60);
    cameraRef.current = camera;

    // 3. Renderer
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
    controls.dampingFactor = 0.05;
    controls.minDistance = 25;
    controls.maxDistance = 120;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight('#FAF9F3', 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight('#EAF0E9', 2.3);
    dirLight1.position.set(30, 40, 30);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight('#88A58B', 1.2);
    dirLight2.position.set(-30, -20, -20);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight('#659A8B', 1.0);
    rimLight.position.set(0, 25, -40);
    scene.add(rimLight);

    // 6. Root Complex
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootSceneRef.current = rootGroup;

    // Build Protein A (Forest Green)
    const residuesA = generateProteinBackbone(proteinA.id, proteinA.length || 390, proteinA.sequence);
    const meshA = createRibbonMesh(residuesA, {
      primaryColor: BOTANICAL_3D_PALETTE.forestGreen,
      helixColor: BOTANICAL_3D_PALETTE.emerald,
      sheetColor: BOTANICAL_3D_PALETTE.sageGreen
    });
    meshA.position.set(-10, 0, 0);
    rootGroup.add(meshA);
    groupARef.current = meshA;

    // Build Protein B (Muted Teal / Mint)
    const residuesB = generateProteinBackbone(proteinB.id, proteinB.length || 450, proteinB.sequence);
    const meshB = createRibbonMesh(residuesB, {
      primaryColor: BOTANICAL_3D_PALETTE.mutedTeal,
      helixColor: BOTANICAL_3D_PALETTE.softMint,
      sheetColor: BOTANICAL_3D_PALETTE.mutedOlive
    });
    meshB.position.set(12, 1, 2);
    meshB.rotation.set(0.2, 0.6, -0.2);
    rootGroup.add(meshB);
    groupBRef.current = meshB;

    // Molecular Interaction Interface Bonds
    const connGroup = new THREE.Group();
    rootGroup.add(connGroup);
    connectionsGroupRef.current = connGroup;

    const contactLines = [
      { from: new THREE.Vector3(-4, 4, 1), to: new THREE.Vector3(5, 3, 2) },
      { from: new THREE.Vector3(-2, 1, -1), to: new THREE.Vector3(7, 0, 1) },
      { from: new THREE.Vector3(-3, -2, 2), to: new THREE.Vector3(6, -3, 3) },
      { from: new THREE.Vector3(-5, -4, 0), to: new THREE.Vector3(4, -5, 1) },
      { from: new THREE.Vector3(-1, 3, 3), to: new THREE.Vector3(8, 2, 4) }
    ];

    const bondMats = [];
    contactLines.forEach(cl => {
      const curve = new THREE.CatmullRomCurve3([
        cl.from,
        new THREE.Vector3((cl.from.x + cl.to.x) * 0.5, (cl.from.y + cl.to.y) * 0.5 + 1.2, (cl.from.z + cl.to.z) * 0.5),
        cl.to
      ]);
      const tubeGeom = new THREE.TubeGeometry(curve, 24, 0.28, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: BOTANICAL_3D_PALETTE.sageGreen,
        transparent: true,
        opacity: 0.7
      });
      bondMats.push(tubeMat);
      connGroup.add(new THREE.Mesh(tubeGeom, tubeMat));
    });

    // 7. Render Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotateRef.current && rootGroup) {
        rootGroup.rotation.y += 0.0035;
        rootGroup.position.y = Math.sin(elapsedTime * 0.7) * 0.6;
      }

      if (connGroup) {
        connGroup.visible = showConnectionsRef.current;
        const pulse = 0.5 + Math.sin(elapsedTime * 2.5) * 0.25;
        bondMats.forEach(m => { m.opacity = pulse; });
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

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [proteinA.id, proteinB.id]);

  // Update selection highlight
  useEffect(() => {
    if (groupARef.current && groupBRef.current) {
      if (selectedProtein === 'A') {
        groupARef.current.scale.set(1.08, 1.08, 1.08);
        groupBRef.current.scale.set(0.95, 0.95, 0.95);
      } else if (selectedProtein === 'B') {
        groupARef.current.scale.set(0.95, 0.95, 0.95);
        groupBRef.current.scale.set(1.08, 1.08, 1.08);
      } else {
        groupARef.current.scale.set(1, 1, 1);
        groupBRef.current.scale.set(1, 1, 1);
      }
    }
  }, [selectedProtein]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 12, 60);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    if (rootSceneRef.current) {
      rootSceneRef.current.rotation.set(0, 0, 0);
    }
  };

  const handleZoom = (factor) => {
    if (cameraRef.current && controlsRef.current) {
      const zoomVec = new THREE.Vector3().subVectors(cameraRef.current.position, controlsRef.current.target);
      zoomVec.multiplyScalar(factor);
      cameraRef.current.position.copy(controlsRef.current.target).add(zoomVec);
      controlsRef.current.update();
    }
  };

  const activeProteinData = selectedProtein === 'B' ? proteinB : proteinA;

  return (
    <div className={`relative w-full ${height} rounded-2xl bg-gradient-to-b from-[#FAF9F3] via-[#F4F6EE] to-[#EAF0E9] border border-[#E2E8DF] shadow-card overflow-hidden flex flex-col justify-between select-none`}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Banner: Scientific Disclaimer & Selected Partner Switcher */}
      <div className="relative z-10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
        {/* Protein Toggle Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8DF] shadow-card pointer-events-auto">
          <button
            onClick={() => setSelectedProtein('A')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              selectedProtein === 'A'
                ? 'bg-[#244A3B] text-white shadow-xs'
                : 'text-[#758379] hover:text-[#244A3B]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#88A58B]" />
            <span>Protein A: {proteinA.id}</span>
          </button>

          <button
            onClick={() => setSelectedProtein('B')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              selectedProtein === 'B'
                ? 'bg-[#659A8B] text-white shadow-xs'
                : 'text-[#758379] hover:text-[#659A8B]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#DDEADF]" />
            <span>Protein B: {proteinB.id}</span>
          </button>

          <button
            onClick={() => setSelectedProtein(null)}
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedProtein === null
                ? 'bg-[#EEF4ED] text-[#244A3B] font-bold'
                : 'text-[#758379] hover:text-[#244A3B]'
            }`}
          >
            Both
          </button>
        </div>

        {/* Required Scientific Demarcation Badge */}
        <div className="pointer-events-auto flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-[#E2E8DF] text-[#758379] shadow-xs">
          <Info size={12} className="text-[#88A58B]" />
          <span>Illustrative 3D protein interaction visualization.</span>
        </div>
      </div>

      {/* Floating 3D Labels Overlay */}
      {showLabels && (
        <div className="relative z-10 px-6 pointer-events-none flex justify-between items-center w-full">
          <div className="p-2 rounded-xl bg-white/90 backdrop-blur-xs border border-[#E2E8DF] shadow-xs text-left max-w-[200px]">
            <span className="text-[10px] font-mono font-bold text-[#244A3B] block">Protein A</span>
            <span className="text-xs font-bold text-[#244A3B] truncate block">{proteinA.name || proteinA.id}</span>
            <span className="text-[10px] font-mono text-[#758379] block">{proteinA.length || 393} AA</span>
          </div>

          <div className="p-2 rounded-xl bg-white/90 backdrop-blur-xs border border-[#E2E8DF] shadow-xs text-right max-w-[200px]">
            <span className="text-[10px] font-mono font-bold text-[#659A8B] block">Protein B</span>
            <span className="text-xs font-bold text-[#244A3B] truncate block">{proteinB.name || proteinB.id}</span>
            <span className="text-[10px] font-mono text-[#758379] block">{proteinB.length || 491} AA</span>
          </div>
        </div>
      )}

      {/* Selected Protein Details Inspector Card (Bottom Center / Side) */}
      {selectedProtein && (
        <div className="relative z-10 mx-4 p-3 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8DF] shadow-card max-w-md pointer-events-auto transition-all">
          <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-[#E2E8DF]">
            <div>
              <span className="text-[10px] font-mono text-[#758379] uppercase block font-semibold">
                Inspecting Partner {selectedProtein}
              </span>
              <h4 className="font-heading font-bold text-xs text-[#244A3B]">
                {activeProteinData.id} — {activeProteinData.name}
              </h4>
            </div>
            <a
              href={`https://www.uniprot.org/uniprotkb/${activeProteinData.id}/entry`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-[#758379] hover:text-[#244A3B]"
              title="Open UniProt"
            >
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono">
            <div className="p-1.5 rounded-lg bg-[#FAF9F3] border border-[#E2E8DF]">
              <span className="text-[#758379] block text-[9px]">ORGANISM</span>
              <span className="text-[#244A3B] font-bold">{activeProteinData.organism || 'Homo sapiens'}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-[#FAF9F3] border border-[#E2E8DF]">
              <span className="text-[#758379] block text-[9px]">LENGTH</span>
              <span className="text-[#244A3B] font-bold">{activeProteinData.length || 393} AA</span>
            </div>
            <div className="p-1.5 rounded-lg bg-[#EEF4ED] border border-[#D1E0CE]">
              <span className="text-[#758379] block text-[9px]">COMPLEX FIT</span>
              <span className="text-[#43866B] font-bold">{confidence}% Conf</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Scene Toggles */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8DF] shadow-card pointer-events-auto">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
              showLabels
                ? 'bg-[#244A3B] text-white font-bold'
                : 'text-[#758379] hover:text-[#244A3B]'
            }`}
          >
            <Tag size={12} />
            <span>Labels</span>
          </button>

          <button
            onClick={() => setShowConnections(!showConnections)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
              showConnections
                ? 'bg-[#244A3B] text-white font-bold'
                : 'text-[#758379] hover:text-[#244A3B]'
            }`}
          >
            <GitMerge size={12} />
            <span>Binding Interface</span>
          </button>
        </div>

        {/* Camera Navigation Controls */}
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
