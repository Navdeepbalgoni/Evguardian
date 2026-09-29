import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  BatteryCharging, 
  Car, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const RecommendationsView = ({ onNavigate }) => {
  const { recommendationsList, simulationPreset } = useVehicle();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Intelligent Prescriptive Maintenance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            SMART RECOMMENDATIONS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Physics-informed actionable advisories to mitigate degradation and prevent critical failures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Prescriptive Engine Active</span>
          </span>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {recommendationsList.map((rec) => {
          const isHigh = rec.priority === 'High Priority';
          const isMed = rec.priority === 'Medium Priority';

          let borderStyle = 'border-slate-800 hover:border-emerald-500/40';
          let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

          if (isHigh) {
            borderStyle = 'border-rose-500/40 hover:border-rose-500/70 shadow-[0_0_20px_-5px_rgba(239,68,68,0.15)]';
            badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          } else if (isMed) {
            borderStyle = 'border-amber-500/40 hover:border-amber-500/70 shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]';
            badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
          }

          return (
            <div
              key={rec.id}
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${borderStyle}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${badgeStyle}`}>
                      {rec.priority}
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase">
                      Subsystem: <strong className="text-slate-200">{rec.category}</strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-slate-400 italic">
                    Trigger: "{rec.triggerCondition}"
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-dark-900 border border-slate-800 text-slate-300">
                    Status: <strong className="text-cyan-400">{rec.status}</strong>
                  </span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mt-4 p-3.5 rounded-xl bg-dark-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 block uppercase tracking-wider text-[10px] mb-1">
                  Root Cause Diagnosis:
                </strong>
                {rec.diagnosis}
              </div>

              {/* Action Points */}
              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Prescribed Actions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rec.actionPoints.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Impact */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>Impact: {rec.estimatedImpact}</span>
                </div>

                <button
                  onClick={() => onNavigate(rec.subsystem.toLowerCase() === 'battery' ? 'battery' : 'vehicle')}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto border border-slate-700"
                >
                  <span>Verify Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
