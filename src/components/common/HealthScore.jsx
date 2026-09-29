import React from 'react';

/**
 * Circular Glowing Health Score Ring
 * Uses SVG stroke-dasharray and stroke-dashoffset for smooth radial presentation
 */
export const HealthScore = ({ score = 91, status = 'HEALTHY', size = 220, subtitle = 'Your vehicle is operating normally.' }) => {
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color scheme based on score or status
  let strokeColor = '#10b981'; // emerald
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let statusDot = 'bg-emerald-400';

  if (score < 60 || status === 'CRITICAL') {
    strokeColor = '#ef4444'; // rose
    glowColor = 'rgba(239, 68, 68, 0.45)';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    statusDot = 'bg-rose-400 animate-ping';
  } else if (score < 85 || status === 'WARNING') {
    strokeColor = '#f59e0b'; // amber
    glowColor = 'rgba(245, 158, 11, 0.45)';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    statusDot = 'bg-amber-400';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background ambient glow */}
        <div
          className="absolute inset-4 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
          style={{ background: glowColor }}
        />

        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Subtle outer track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeOpacity="0.6"
          />

          {/* Glowing Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor})`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-baseline font-mono font-extrabold tracking-tight text-white">
            <span className="text-5xl md:text-6xl">{score}</span>
            <span className="text-2xl text-slate-400 font-sans font-normal ml-0.5">%</span>
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">
            Vehicle Health
          </span>
        </div>
      </div>

      {/* Status Pill & Subtitle */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${badgeBg}`}>
          <span className={`w-2 h-2 rounded-full ${statusDot}`} />
          <span>● {status}</span>
        </div>
        <p className="text-sm text-slate-300 max-w-xs font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
