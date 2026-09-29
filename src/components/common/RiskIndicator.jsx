import React from 'react';

export const RiskIndicator = ({ level = 'LOW', probability, size = 'md' }) => {
  let colorStyles = {
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    dot: 'bg-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]'
  };

  if (level === 'HIGH' || (probability && probability >= 70)) {
    colorStyles = {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      dot: 'bg-rose-400 animate-ping',
      glow: 'shadow-[0_0_12px_rgba(239,68,68,0.4)]'
    };
  } else if (level === 'MEDIUM' || (probability && probability >= 30)) {
    colorStyles = {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]'
    };
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm';

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border font-semibold tracking-wider uppercase font-mono ${padding} ${colorStyles.bg} ${colorStyles.glow}`}>
      <span className={`w-2 h-2 rounded-full ${colorStyles.dot}`} />
      <span>{level} RISK</span>
      {probability !== undefined && (
        <span className="opacity-80 font-normal">({probability}%)</span>
      )}
    </div>
  );
};
