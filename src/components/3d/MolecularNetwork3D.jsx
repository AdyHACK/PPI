import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  NETWORK_NODES, 
  NETWORK_EDGES, 
  NETWORK_CLUSTERS 
} from '../../data/networkData';
import { 
  Search, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  SlidersHorizontal, 
  ExternalLink, 
  Play as LaunchIcon,
  X,
  Info,
  Filter
} from 'lucide-react';

export default function MolecularNetwork3D({ onSelectProteinForPrediction }) {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [minConfidence, setMinConfidence] = useState(0.65);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  // Compute 3D node coordinates based on biological clusters
  const nodePositions = useMemo(() => {
    const clusterCenters = {
      cell_cycle: new THREE.Vector3(-14, 4, 4),
      signaling: new THREE.Vector3(16, 6, -6),
      ubiquitin: new THREE.Vector3(4, -12, 10),
      apoptosis: new THREE.Vector3(-10, -10, -12),
      transcription: new THREE.Vector3(0, 16, 2)
    };

    const map = {};
    NETWORK_NODES.forEach((node, index) => {
      const center = clusterCenters[node.cluster] || new THREE.Vector3(0, 0, 0);
      const angle = (index * 1.6180339887) * Math.PI * 2;
      const radius = 5 + (index % 4) * 2.8;
      const heightOffset = ((index % 5) - 2) * 2.5;

      const pos = new THREE.Vector3(
        center.x + Math.cos(angle) * radius,
        center.y + heightOffset,
        center.z + Math.sin(angle) * radius
      );
      map[node.id] = pos;
    });
    return map;
  }, []);

  // Filtered edges
  const filteredEdges = useMemo(() => {
    return NETWORK_EDGES.filter(e => {
      if (e.confidence < minConfidence) return false;
      const sourceNode = NETWORK_NODES.find(n => n.id === e.source);
      const targetNode = NETWORK_NODES.find(n => n.id === e.target);
      if (!sourceNode || !targetNode) return false;
      if (selectedCluster !== 'all') {
        if (sourceNode.cluster !== selectedCluster && targetNode.cluster !== selectedCluster) {
          return false;
        }
      }
      return true;
    });
  }, [minConfidence, selectedCluster]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#F6F7F1', 0.008);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 68);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 140;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight('#FAF9F3', 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#EAF0E9', 2.0);
    keyLight.position.set(30, 40, 30);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#88A58B', 1.1);
    fillLight.position.set(-30, -20, -20);
    scene.add(fillLight);

    // 6. Network Graph Group
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Node Meshes & Mapping for Raycasting
    const nodeMeshMap = new Map();
    const sphereGeom = new THREE.SphereGeometry(1, 16, 16);

    const clusterColorMap = {
      cell_cycle: '#244A3B',
      signaling: '#659A8B',
      ubiquitin: '#88A58B',
      apoptosis: '#C87575',
      transcription: '#A5B18A'
    };

    NETWORK_NODES.forEach((node) => {
      const pos = nodePositions[node.id] || new THREE.Vector3(0, 0, 0);
      const color = clusterColorMap[node.cluster] || '#244A3B';
      const nodeRadius = 1.2 + (node.degree || 4) * 0.16;

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.35,
        metalness: 0.15
      });

      const mesh = new THREE.Mesh(sphereGeom, mat);
      mesh.position.copy(pos);
      mesh.scale.setScalar(nodeRadius);
      mesh.userData = { node };

      // Outer delicate halo ring
      const ringGeom = new THREE.RingGeometry(nodeRadius * 1.25, nodeRadius * 1.45, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.lookAt(camera.position);
      mesh.add(ringMesh);

      graphGroup.add(mesh);
      nodeMeshMap.set(node.id, { mesh, ringMesh, node, originalColor: color, radius: nodeRadius });
    });

    // 7. Edge Line Segments / Tubes
    const edgeGroup = new THREE.Group();
    graphGroup.add(edgeGroup);

    const edgeObjects = [];
    filteredEdges.forEach((edge) => {
      const p1 = nodePositions[edge.source];
      const p2 = nodePositions[edge.target];
      if (!p1 || !p2) return;

      const curve = new THREE.LineCurve3(p1, p2);
      const geom = new THREE.TubeGeometry(curve, 8, 0.16 * (edge.confidence || 0.8), 6, false);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#88A58B'),
        transparent: true,
        opacity: Math.max(0.2, (edge.confidence - 0.4) * 1.4)
      });

      const tube = new THREE.Mesh(geom, mat);
      tube.userData = { edge };
      edgeGroup.add(tube);
      edgeObjects.push({ tube, edge, mat });
    });

    // 8. Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(nodeMeshMap.values()).map(v => v.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object.userData.node;
        setHoveredNode(hit);
        container.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        container.style.cursor = 'default';
      }
    };

    const onClick = (e) => {
      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(nodeMeshMap.values()).map(v => v.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object.userData.node;
        setSelectedNode(hit);
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('click', onClick);

    // 9. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotateRef.current) {
        graphGroup.rotation.y += 0.002;
      }

      // Billboard ring halos toward camera
      nodeMeshMap.forEach(({ ringMesh }) => {
        ringMesh.quaternion.copy(camera.quaternion);
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 10. Resize Observer
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

    // Attach updater functions to container for search / selection reactivity
    container.__updateHighlights = (query, selNode) => {
      nodeMeshMap.forEach(({ mesh, ringMesh, node, originalColor, radius }) => {
        const matchesSearch = !query || 
          node.id.toLowerCase().includes(query.toLowerCase()) || 
          node.name.toLowerCase().includes(query.toLowerCase());

        const isSelected = selNode && selNode.id === node.id;
        const isNeighbor = selNode && NETWORK_EDGES.some(
          e => (e.source === selNode.id && e.target === node.id) || 
               (e.target === selNode.id && e.source === node.id)
        );

        if (!matchesSearch) {
          mesh.material.opacity = 0.2;
          mesh.material.transparent = true;
          mesh.scale.setScalar(radius * 0.7);
        } else if (isSelected) {
          mesh.material.opacity = 1.0;
          mesh.material.color.set('#244A3B');
          mesh.scale.setScalar(radius * 1.4);
          ringMesh.material.opacity = 0.8;
        } else if (isNeighbor) {
          mesh.material.opacity = 0.95;
          mesh.material.color.set('#659A8B');
          mesh.scale.setScalar(radius * 1.15);
        } else {
          mesh.material.opacity = selNode ? 0.35 : 1.0;
          mesh.material.transparent = Boolean(selNode);
          mesh.material.color.set(originalColor);
          mesh.scale.setScalar(radius);
          ringMesh.material.opacity = 0.25;
        }
      });
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('click', onClick);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [minConfidence, selectedCluster]);

  // Reactively trigger highlights when searchQuery or selectedNode changes
  useEffect(() => {
    if (containerRef.current && containerRef.current.__updateHighlights) {
      containerRef.current.__updateHighlights(searchQuery, selectedNode);
    }
  }, [searchQuery, selectedNode]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 15, 68);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
    if (sceneRef.current) {
      sceneRef.current.children.forEach(c => {
        if (c.isGroup) c.rotation.set(0, 0, 0);
      });
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

  return (
    <div className="relative w-full h-[580px] rounded-2xl bg-gradient-to-b from-[#FAF9F3] via-[#F4F6EE] to-[#EAF0E9] border border-[#E2E8DF] shadow-card overflow-hidden flex flex-col justify-between select-none">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top Floating Bar: Search, Filters, and Disclaimers */}
      <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search Input */}
        <div className="relative min-w-[200px] pointer-events-auto">
          <Search size={14} className="absolute left-3 top-2.5 text-[#758379]" />
          <input
            type="text"
            placeholder="Search 3D protein nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="scientific-input w-full pl-9 pr-7 py-1.5 rounded-xl text-xs bg-white/95 backdrop-blur-xs border-[#E2E8DF]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-[#758379]">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Biological Cluster Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setSelectedCluster('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedCluster === 'all'
                ? 'bg-[#244A3B] text-white font-bold shadow-xs'
                : 'bg-white/90 text-[#758379] hover:text-[#244A3B] border border-[#E2E8DF]'
            }`}
          >
            All Clusters
          </button>
          {NETWORK_CLUSTERS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCluster(c.id)}
              className={`px-2 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                selectedCluster === c.id
                  ? 'bg-[#244A3B] text-white font-bold shadow-xs'
                  : 'bg-white/90 text-[#758379] hover:text-[#244A3B] border border-[#E2E8DF]'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="hidden sm:inline">{c.name.split('&')[0]}</span>
            </button>
          ))}
        </div>

        {/* Disclaimer Badge */}
        <div className="pointer-events-auto flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-[#E2E8DF] text-[#758379] shadow-xs">
          <Info size={12} className="text-[#88A58B]" />
          <span>3D Curated Topological Manifold</span>
        </div>
      </div>

      {/* Hover Tooltip Overlay */}
      {hoveredNode && !selectedNode && (
        <div className="absolute top-16 left-6 z-10 p-2.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8DF] shadow-card pointer-events-none text-xs font-mono animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#244A3B]">{hoveredNode.id}</span>
            <span className="text-[10px] text-[#758379]">• Degree: {hoveredNode.degree}</span>
          </div>
          <span className="text-[11px] text-[#758379] truncate block max-w-xs">{hoveredNode.name}</span>
        </div>
      )}

      {/* Selected Node Details Side Drawer */}
      {selectedNode && (
        <div className="absolute right-4 top-16 bottom-16 z-20 w-80 p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2E8DF] shadow-2xl overflow-y-auto space-y-4 animate-in slide-in-from-right-4">
          <div className="flex items-start justify-between pb-3 border-b border-[#E2E8DF]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EEF4ED] text-[#244A3B] border border-[#D1E0CE]">
                  {selectedNode.id}
                </span>
                <span className="text-[10px] font-mono text-[#758379]">{selectedNode.uniprotId}</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-[#244A3B] leading-snug">
                {selectedNode.name}
              </h4>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-lg text-[#758379] hover:text-[#244A3B] hover:bg-[#FAF9F3]"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF]">
              <span className="text-[10px] text-[#758379] block">DEGREE</span>
              <span className="text-[#244A3B] font-bold">{selectedNode.degree} Edges</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF]">
              <span className="text-[10px] text-[#758379] block">CLUSTER</span>
              <span className="text-[#659A8B] font-bold truncate block">{selectedNode.cluster}</span>
            </div>
          </div>

          {selectedNode.goTerms && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#758379] block font-bold">
                Gene Ontology Terms (GO DAG)
              </span>
              <div className="space-y-1">
                {selectedNode.goTerms.map((term, i) => (
                  <div key={i} className="text-[11px] p-1.5 rounded-lg bg-[#FAF9F3] border border-[#E2E8DF] text-[#244A3B]">
                    {term}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              if (onSelectProteinForPrediction) onSelectProteinForPrediction(selectedNode);
            }}
            className="w-full py-2.5 rounded-xl bg-[#244A3B] hover:bg-[#193C30] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-subtle"
          >
            <LaunchIcon size={13} className="text-[#88A58B]" />
            <span>Launch Prediction Workspace</span>
          </button>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Min Confidence Slider */}
        <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-white/95 backdrop-blur-xs border border-[#E2E8DF] shadow-card pointer-events-auto">
          <SlidersHorizontal size={13} className="text-[#88A58B]" />
          <span className="text-[10px] font-mono text-[#758379]">Min Conf:</span>
          <input
            type="range"
            min="0.50"
            max="0.95"
            step="0.05"
            value={minConfidence}
            onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
            className="w-20 accent-[#244A3B] cursor-pointer"
          />
          <span className="font-mono text-xs font-bold text-[#244A3B] min-w-[34px]">
            {minConfidence.toFixed(2)}
          </span>
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
