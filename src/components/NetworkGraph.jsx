import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Filter, 
  SlidersHorizontal,
  X,
  ExternalLink,
  Dna,
  Info
} from 'lucide-react';
import { NETWORK_NODES, NETWORK_EDGES, NETWORK_CLUSTERS } from '../data/networkData';

export default function NetworkGraph({ onSelectProteinForPrediction }) {
  const [nodes, setNodes] = useState(NETWORK_NODES);
  const [edges] = useState(NETWORK_EDGES);
  const [selectedNode, setSelectedNode] = useState(NETWORK_NODES[0]); // default TP53
  const [hoveredNode, setHoveredNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [minConfidence, setMinConfidence] = useState(0.80);
  
  // Transform & Pan/Zoom State
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.95 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  // Dragging State for Nodes
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const svgRef = useRef(null);

  // Filtered nodes and edges
  const filteredEdges = edges.filter(e => e.weight >= minConfidence);
  const activeClusterNodes = nodes.filter(n => {
    const matchesCluster = selectedCluster === 'all' || n.cluster === selectedCluster;
    const matchesSearch = searchQuery === '' || 
      n.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCluster && matchesSearch;
  });

  const activeNodeIds = new Set(activeClusterNodes.map(n => n.id));

  // Determine connected neighbors for selected or hovered node
  const activeFocusNode = hoveredNode || selectedNode;
  const connectedPartnerIds = new Set();
  if (activeFocusNode) {
    filteredEdges.forEach(e => {
      if (e.source === activeFocusNode.id) connectedPartnerIds.add(e.target);
      if (e.target === activeFocusNode.id) connectedPartnerIds.add(e.source);
    });
  }

  // Pan Handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'network-canvas-bg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      }));
    } else if (draggingNodeId) {
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - transform.x) / transform.k;
      const mouseY = (e.clientY - rect.top - transform.y) / transform.k;
      setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: mouseX, y: mouseY } : n));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleZoom = (factor) => {
    setTransform(prev => ({
      ...prev,
      k: Math.max(0.4, Math.min(2.5, prev.k * factor))
    }));
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, k: 0.95 });
    setNodes(NETWORK_NODES);
    setSelectedCluster('all');
    setMinConfidence(0.80);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-white border border-[#E2E8DF] shadow-card flex">
      {/* Network Canvas */}
      <div 
        className="flex-1 relative h-full select-none overflow-hidden bg-[#FAF9F3]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Subtle grid pattern background */}
        <div id="network-canvas-bg" className="absolute inset-0 bg-subtle-grid opacity-50 pointer-events-none" />

        {/* Top Floating Controls Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
          {/* Left: Search & Cluster Filter */}
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-2.5 text-[#758379]" />
              <input
                type="text"
                placeholder="Search protein (e.g. TP53, CDK2)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#E2E8DF] text-xs text-[#244A3B] placeholder:text-[#758379] focus:outline-none focus:border-[#88A58B] w-48 sm:w-56 shadow-subtle"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-[#758379] hover:text-[#244A3B]">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Cluster Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8DF] text-xs shadow-subtle">
              <Filter size={12} className="text-[#88A58B] ml-1.5" />
              <select
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="bg-transparent text-[#244A3B] text-xs focus:outline-none px-1 py-0.5 cursor-pointer font-medium"
              >
                <option value="all">All Clusters</option>
                {NETWORK_CLUSTERS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Confidence Threshold Slider & Zoom Controls */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E2E8DF] text-xs font-mono shadow-subtle">
              <SlidersHorizontal size={12} className="text-[#244A3B]" />
              <span className="text-[#758379] text-[10px]">Min Conf:</span>
              <input
                type="range"
                min="0.80"
                max="0.98"
                step="0.02"
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                className="w-14 accent-[#244A3B] cursor-pointer"
              />
              <span className="text-[#244A3B] font-bold text-xs">{minConfidence.toFixed(2)}</span>
            </div>

            <div className="flex items-center bg-white rounded-xl border border-[#E2E8DF] p-1 gap-1 shadow-subtle">
              <button 
                onClick={() => handleZoom(1.2)} 
                className="p-1.5 rounded-lg hover:bg-[#FAF9F3] text-[#758379] hover:text-[#244A3B]"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button 
                onClick={() => handleZoom(0.8)} 
                className="p-1.5 rounded-lg hover:bg-[#FAF9F3] text-[#758379] hover:text-[#244A3B]"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <button 
                onClick={handleReset} 
                className="p-1.5 rounded-lg hover:bg-[#FAF9F3] text-[#758379] hover:text-[#244A3B]"
                title="Reset View"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer Banner */}
        <div className="absolute bottom-3 left-3.5 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#E2E8DF] text-[10px] font-mono text-[#758379] shadow-subtle">
          <Info size={11} className="text-[#88A58B]" />
          <span>Curated STRING &amp; BioGRID Subgraph (Demonstration)</span>
        </div>

        {/* SVG Visualization Canvas */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
            {/* Edge Connections */}
            {filteredEdges.map((edge, idx) => {
              const srcNode = nodes.find(n => n.id === edge.source);
              const tgtNode = nodes.find(n => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isHighlighted = activeFocusNode && 
                (activeFocusNode.id === edge.source || activeFocusNode.id === edge.target);
              
              const isDimmed = activeFocusNode && !isHighlighted;

              return (
                <g key={idx}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isHighlighted ? '#234737' : '#CCD6CA'}
                    strokeWidth={isHighlighted ? 2.5 : Math.max(1, edge.weight * 1.5)}
                    strokeDasharray={isHighlighted ? '4 3' : edge.weight < 0.9 ? '3 3' : 'none'}
                    opacity={isDimmed ? 0.15 : isHighlighted ? 0.95 : 0.85}
                  />
                  {isHighlighted && (
                    <text
                      x={(srcNode.x + tgtNode.x) / 2}
                      y={(srcNode.y + tgtNode.y) / 2 - 4}
                      fill="#193C30"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                      className="select-none pointer-events-none font-bold"
                    >
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Protein Nodes */}
            {nodes.map((node) => {
              const isVisible = activeNodeIds.has(node.id);
              if (!isVisible) return null;

              const cluster = NETWORK_CLUSTERS.find(c => c.id === node.cluster);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const isConnected = connectedPartnerIds.has(node.id);
              const isDimmed = activeFocusNode && !isSelected && !isHovered && !isConnected;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingNodeId(node.id);
                  }}
                  className="cursor-pointer"
                  opacity={isDimmed ? 0.22 : 1}
                >
                  {/* Outer selection ring with subtle pulse */}
                  {(isSelected || isHovered) && (
                    <>
                      <circle
                        r={node.size + 9}
                        fill="none"
                        stroke={cluster?.color || '#91A88F'}
                        strokeWidth={1}
                        opacity={0.35}
                        className="animate-ping"
                      />
                      <circle
                        r={node.size + 6}
                        fill="none"
                        stroke="#234737"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                      />
                    </>
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={node.size}
                    fill="#FFFFFF"
                    stroke={isSelected ? '#234737' : (cluster?.color || '#91A88F')}
                    strokeWidth={isSelected ? 2.5 : 1.8}
                  />

                  {/* Inner Node Core */}
                  <circle
                    r={node.size / 2.3}
                    fill={cluster?.color || '#91A88F'}
                    opacity={isSelected ? 0.95 : 0.8}
                  />

                  {/* Node Label */}
                  <text
                    y={node.size + 13}
                    textAnchor="middle"
                    fill="#244A3B"
                    fontSize="11"
                    fontFamily="Manrope"
                    fontWeight={isSelected ? 'bold' : '600'}
                    className="select-none pointer-events-none"
                  >
                    {node.id}
                  </text>
                  <text
                    y={node.size + 23}
                    textAnchor="middle"
                    fill="#758379"
                    fontSize="8"
                    fontFamily="JetBrains Mono"
                    className="select-none pointer-events-none"
                  >
                    deg: {node.degree}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Inspector Side Panel */}
      {selectedNode && (
        <div className="w-80 md:w-88 h-full bg-white border-l border-[#E2E8DF] p-5 flex flex-col justify-between overflow-y-auto relative z-20 shadow-subtle">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8DF] mb-3">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EEF4ED] text-[#244A3B] border border-[#D1E0CE]">
                  {selectedNode.uniprotId}
                </span>
                <h3 className="font-heading font-bold text-base text-[#244A3B] mt-1">
                  {selectedNode.id}
                </h3>
                <p className="text-xs text-[#758379]">{selectedNode.name}</p>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-md text-[#758379] hover:text-[#244A3B] hover:bg-[#FAF9F3]"
              >
                <X size={15} />
              </button>
            </div>

            {/* Quick Properties */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-mono">
              <div className="p-2 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF]">
                <span className="text-[#758379] text-[10px] block uppercase">ORGANISM</span>
                <span className="text-[#244A3B] font-semibold truncate block">{selectedNode.organism}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF9F3] border border-[#E2E8DF]">
                <span className="text-[#758379] text-[10px] block uppercase">NODE DEGREE</span>
                <span className="text-[#43866B] font-bold">{selectedNode.degree} links</span>
              </div>
            </div>

            {/* Functional Cluster */}
            <div className="mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#758379] block mb-1">
                Functional Cluster
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FAF9F3] border border-[#E2E8DF] text-[#244A3B]">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: NETWORK_CLUSTERS.find(c => c.id === selectedNode.cluster)?.color }}
                />
                {NETWORK_CLUSTERS.find(c => c.id === selectedNode.cluster)?.name}
              </span>
            </div>

            {/* Associated GO Terms */}
            <div className="mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#758379] block mb-1">
                Top Annotations
              </span>
              <div className="space-y-1">
                {selectedNode.goTerms?.map((term, i) => (
                  <div key={i} className="text-[11px] p-2 rounded-lg bg-[#FAF9F3] border border-[#E2E8DF] text-[#244A3B] leading-relaxed">
                    {term}
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Interaction Edges */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#758379] block mb-1">
                Connected Partners ({connectedPartnerIds.size})
              </span>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {filteredEdges
                  .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map((e, idx) => {
                    const partner = e.source === selectedNode.id ? e.target : e.source;
                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          const pNode = nodes.find(n => n.id === partner);
                          if (pNode) setSelectedNode(pNode);
                        }}
                        className="p-1.5 px-2 rounded-lg bg-[#FAF9F3] hover:bg-[#EEF4ED] border border-[#E2E8DF] cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#244A3B]">{partner}</span>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-[#758379]">
                          <span>{e.type.split(' ')[0]}</span>
                          <span className="text-[#43866B] font-bold">{e.weight}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-3 border-t border-[#E2E8DF] mt-3 space-y-1.5">
            <button
              onClick={() => onSelectProteinForPrediction && onSelectProteinForPrediction(selectedNode)}
              className="w-full py-2 px-3 rounded-xl bg-[#244A3B] hover:bg-[#193C30] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-subtle"
            >
              <Dna size={14} className="text-[#88A58B]" />
              <span>Predict Interaction with {selectedNode.id}</span>
            </button>
            <a
              href={`https://www.uniprot.org/uniprotkb/${selectedNode.uniprotId}/entry`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 px-3 rounded-xl border border-[#E2E8DF] hover:bg-[#FAF9F3] text-[#758379] hover:text-[#244A3B] text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View UniProt Entry</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
