import React from 'react';

export default function PredictionGauge({ 
  probability = 94.2, 
  size = 230, 
  strokeWidth = 12,
  showThresholds = true 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 270-degree arc gauge
  const arcPercentage = 0.75;
  const totalArc = circumference * arcPercentage;
  const strokeDashoffset = totalArc - (probability / 100) * totalArc;

  const isInteracting = probability >= 50;
  
  // Botanical colors based on probability
  const getColors = () => {
    if (probability >= 75) return { stroke: '#234737', track: '#EEF3EA', label: 'Interaction Detected', tagClass: 'badge-sage' };
    if (probability >= 45) return { stroke: '#C69B55', track: '#FAF3E8', label: 'Borderline Probability', tagClass: 'badge-amber' };
    return { stroke: '#C87575', track: '#FAEDED', label: 'Non-Interacting', tagClass: 'badge-error' };
  };

  const colors = getColors();

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className="transform -rotate-135"
      >
        {/* Background Track Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth={strokeWidth}
          strokeDasharray={`${totalArc} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Active Probability Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={`${totalArc} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center Value and Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-4xl font-heading font-extrabold text-[#193C30] tracking-tight">
          {probability.toFixed(1)}<span className="text-2xl text-[#66786C] font-normal">%</span>
        </span>
        <span className={`text-[11px] font-mono font-semibold tracking-wider uppercase mt-1 px-2.5 py-0.5 rounded-full border ${colors.tagClass}`}>
          {colors.label}
        </span>
        <span className="text-[10px] font-mono text-[#718074] mt-1">
          Calibrated Confidence
        </span>
      </div>

      {/* Threshold Marks */}
      {showThresholds && (
        <div className="w-full max-w-[210px] flex justify-between text-[10px] font-mono text-[#718074] mt-2 px-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C87575]"></span>
            Non-Interacting (&lt;50%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#234737]"></span>
            High-Conf (≥75%)
          </span>
        </div>
      )}
    </div>
  );
}
