import React from 'react';
import { Cpu, Activity, Filter, BrainCircuit, AlertTriangle, Lightbulb } from 'lucide-react';

export const DigitalTwinPipeline = ({ currentStage = 4, latency = '14 ms' }) => {
  const pipelineSteps = [
    { id: 1, label: 'EV Sensors', sub: 'CAN Bus 10Hz', icon: Activity },
    { id: 2, label: 'Preprocessing', sub: 'Noise Filter & Kalm.', icon: Filter },
    { id: 3, label: 'Feature Eng.', sub: 'Thermal & Sag Deltas', icon: Cpu },
    { id: 4, label: 'Anomaly Detect', sub: 'Isolation Forest', icon: BrainCircuit },
    { id: 5, label: 'Fault Predict', sub: 'LSTM / PINN Twin', icon: AlertTriangle },
    { id: 6, label: 'Smart Action', sub: 'Proactive Advisory', icon: Lightbulb },
  ];

  return (
    <div className="glass-panel p-4 md:p-5 rounded-2xl border border-slate-800/80 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
            Digital Twin Telemetry & Predictive Inference Pipeline
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Active Sync
          </span>
          <span className="text-cyan-400 font-semibold">Latency: {latency}</span>
        </div>
      </div>

      {/* Pipeline Visual Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {pipelineSteps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = step.id <= currentStage;
          const isCurrent = step.id === currentStage;

          return (
            <div
              key={step.id}
              className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center text-center ${
                isCurrent
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-glow-cyan'
                  : isActive
                  ? 'bg-slate-800/40 border-slate-700/80 text-slate-300'
                  : 'bg-slate-900/40 border-slate-800/40 opacity-50'
              }`}
            >
              <div className={`p-2 rounded-lg mb-2 ${
                isCurrent
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : isActive
                  ? 'bg-slate-700/70 text-cyan-400'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <span className="text-xs font-bold text-white tracking-tight">
                {step.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                {step.sub}
              </span>

              {/* Progress pill */}
              <div className="mt-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 border border-slate-700/50">
                Stage 0{step.id}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
