import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const HealthCard = ({
  title,
  value,
  unit = '',
  status = 'Optimal',
  trend = '',
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  icon: Icon,
  accentColor = 'cyan', // 'cyan' | 'emerald' | 'amber' | 'rose'
  onClick
}) => {
  const colorMap = {
    cyan: {
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      borderHover: 'hover:border-cyan-500/40',
      glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.25)]',
      statusText: 'text-cyan-400'
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      borderHover: 'hover:border-emerald-500/40',
      glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)]',
      statusText: 'text-emerald-400'
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      borderHover: 'hover:border-amber-500/40',
      glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.25)]',
      statusText: 'text-amber-400'
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      borderHover: 'hover:border-rose-500/40',
      glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.25)]',
      statusText: 'text-rose-400'
    }
  };

  const scheme = colorMap[accentColor] || colorMap.cyan;

  return (
    <div
      onClick={onClick}
      className={`group relative glass-panel rounded-2xl p-5 transition-all duration-300 ${scheme.borderHover} ${scheme.glow} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-mono font-bold text-white tracking-tight">
              {value}
            </span>
            {unit && <span className="text-lg font-medium text-slate-400">{unit}</span>}
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${scheme.iconBg} transition-transform duration-300 group-hover:scale-105`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className={`font-semibold tracking-wide uppercase ${scheme.statusText}`}>
          ● {status}
        </span>

        {trend && (
          <div className="flex items-center gap-1 text-slate-400 font-medium">
            {trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            {trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
            {trendDirection === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};
