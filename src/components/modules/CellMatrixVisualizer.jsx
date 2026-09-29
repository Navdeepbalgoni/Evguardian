import React from 'react';
import { Layers, Thermometer, Zap } from 'lucide-react';

export const CellMatrixVisualizer = ({ cells = [] }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white tracking-tight uppercase">
              Battery Pack Cell Matrix (16-Cell Monitor)
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Module-level voltage balancing & thermal gradient observer
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/80" /> Nominal
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/80" /> Sag / Drift
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/80 animate-pulse" /> Overheat
          </span>
        </div>
      </div>

      {/* Grid of Cells */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {cells.map((cell) => {
          let cellBg = 'bg-slate-900/80 border-slate-800 hover:border-slate-700';
          let voltColor = 'text-slate-200';
          let tempColor = 'text-slate-400';

          if (cell.status === 'warning') {
            cellBg = 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
            voltColor = 'text-amber-300 font-bold';
            tempColor = 'text-amber-400 font-bold';
          } else if (cell.status === 'critical') {
            cellBg = 'bg-rose-500/15 border-rose-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse';
            voltColor = 'text-rose-300 font-bold';
            tempColor = 'text-rose-400 font-bold';
          }

          return (
            <div
              key={cell.cellId}
              className={`p-2 rounded-xl border text-center transition-all ${cellBg}`}
            >
              <div className="text-[10px] font-mono font-semibold text-slate-400">
                {cell.cellId}
              </div>
              <div className={`text-xs font-mono mt-1 ${voltColor}`}>
                {cell.voltage}V
              </div>
              <div className={`text-[10px] font-mono mt-0.5 ${tempColor}`}>
                {cell.temperature}°C
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
