import React from 'react';

/**
 * Reusable, lightweight botanical SVG vector assets for scientific visualization.
 * Minimalist, elegant, botanical-inspired line drawings and organic molecular motifs.
 */

export function BotanicalLeaf({ className = "w-5 h-5", strokeColor = "#88A58B", fillColor = "none" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 7.5 5 14 5 18a4 4 0 0 0 7 2.5A4 4 0 0 0 19 18c0-4-1.5-10.5-7-16z" />
      <path d="M12 6v14" />
      <path d="M12 10c2-1 3.5-1 4.5.5" />
      <path d="M12 14c-2-1-3.5-1-4.5.5" />
    </svg>
  );
}

export function BotanicalSprout({ className = "w-5 h-5", strokeColor = "#244A3B" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M12 20v-8" />
      <path d="M12 12c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6z" />
      <path d="M12 14c0-3-2-5-5-5 0 3 2 5 5 5z" />
    </svg>
  );
}

export function BotanicalDivider({ className = "my-6", lineOpacity = 0.4 }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full ${className}`}>
      <div className="h-[1px] flex-1 bg-[#E2E8DF]" style={{ opacity: lineOpacity }} />
      <div className="flex items-center gap-1.5 text-[#88A58B]">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
        </svg>
        <span className="w-1.5 h-1.5 rounded-full bg-[#88A58B]" />
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
        </svg>
      </div>
      <div className="h-[1px] flex-1 bg-[#E2E8DF]" style={{ opacity: lineOpacity }} />
    </div>
  );
}

export function CellularPattern({ className = "w-24 h-24", opacity = 0.08 }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="#244A3B" strokeWidth="1" style={{ opacity }}>
      <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" />
      <polygon points="50,20 75,34 75,66 50,80 25,66 25,34" />
      <circle cx="50" cy="50" r="8" fill="#88A58B" fillOpacity="0.4" />
      <line x1="50" y1="5" x2="50" y2="20" />
      <line x1="90" y1="27.5" x2="75" y2="34" />
      <line x1="90" y1="72.5" x2="75" y2="66" />
      <line x1="50" y1="95" x2="50" y2="80" />
      <line x1="10" y1="72.5" x2="25" y2="66" />
      <line x1="10" y1="27.5" x2="25" y2="34" />
    </svg>
  );
}

export function MolecularBranch({ className = "w-6 h-6", strokeColor = "#659A8B" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <line x1="14.5" y1="9.5" x2="17.5" y2="6.5" />
      <line x1="9.5" y1="14.5" x2="6.5" y2="17.5" />
      <line x1="14.5" y1="14.5" x2="17.5" y2="17.5" />
    </svg>
  );
}

export function DNAVineIllustration({ className = "w-full h-auto" }) {
  return (
    <svg className={className} viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Organic Flow */}
      <path 
        d="M 10,60 C 70,20 130,100 190,60 C 250,20 310,100 390,60" 
        stroke="#88A58B" 
        strokeWidth="1.5" 
        strokeDasharray="4 4"
        opacity="0.5" 
      />
      <path 
        d="M 10,60 C 70,100 130,20 190,60 C 250,100 310,20 390,60" 
        stroke="#244A3B" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />

      {/* Cross rungs with leaf and node terminals */}
      {[
        { x: 45, y1: 38, y2: 82 },
        { x: 100, y1: 82, y2: 38 },
        { x: 155, y1: 42, y2: 78 },
        { x: 220, y1: 78, y2: 42 },
        { x: 280, y1: 40, y2: 80 },
        { x: 345, y1: 80, y2: 40 }
      ].map((rung, i) => (
        <g key={i}>
          <line x1={rung.x} y1={rung.y1} x2={rung.x} y2={rung.y2} stroke="#E2E8DF" strokeWidth="1.5" />
          <circle cx={rung.x} cy={rung.y1} r="3" fill="#244A3B" />
          <circle cx={rung.x} cy={rung.y2} r="2.5" fill="#659A8B" />
        </g>
      ))}

      {/* Tiny sprout leaves */}
      <path d="M 100,38 C 105,30 115,32 112,42 C 105,42 102,40 100,38 Z" fill="#88A58B" opacity="0.8" />
      <path d="M 220,42 C 225,34 235,36 232,46 C 225,46 222,44 220,42 Z" fill="#88A58B" opacity="0.8" />
      <path d="M 280,80 C 285,88 295,86 292,76 C 285,76 282,78 280,80 Z" fill="#A5B18A" opacity="0.8" />
    </svg>
  );
}
