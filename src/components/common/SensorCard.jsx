import React from 'react';

export const SensorCard = ({
  label,
  value,
  unit,
  status = 'optimal',
  min = 0,
  max = 100,
  icon: Icon
}) => {
  // Calculate relative fill percentage
  const numericVal = typeof value === 'number' ? value : parseFloat(value);
  const fillPct = !isNaN(numericVal) && max > min 
    ? Math.min(100, Math.max(0, ((numericVal - min) / (max - min)) * 100))
    : 50;

  // Status colors
  let statusBadge = 'text-slate-400 bg-slate-800/60';
  let barColor = 'bg-cyan-500';
  
  if (status === 'warning' || status === 'moderate' || status === 'elevated' || status === 'high') {
    statusBadge = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    barColor = 'bg-amber-400';
  } else if (status === 'critical' || status === 'severe' || status === 'unstable' || status === 'derated') {
    statusBadge = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    barColor = 'bg-rose-500';
  } else if (status === 'optimal' || status === 'healthy' || status === 'efficient' || status === 'smooth') {
    statusBadge = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    barColor = 'bg-emerald-400';
  }

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-slate-800/70 text-cyan-400 group-hover:text-cyan-300">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-medium text-slate-400 truncate max-w-[130px]" title={label}>
            {label}
          </span>
        </div>

        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${statusBadge}`}>
          {status}
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-mono font-bold text-white tracking-tight">
            {value}
          </span>
          <span className="text-xs font-medium text-slate-400">{unit}</span>
        </div>
      </div>

      {/* Mini gauge fill */}
      <div className="mt-2.5 w-full bg-slate-800/90 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </div>
  );
};
