import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Radio, BellRing, Sparkles } from 'lucide-react';

export const DemoControlBar = () => {
  const {
    simulationPreset,
    setSimulationPreset,
    isLiveStreaming,
    setIsLiveStreaming,
    setActiveAlertModal
  } = useVehicle();

  const handleTriggerAlert = () => {
    if (simulationPreset === 'CRITICAL') {
      setActiveAlertModal({
        severity: 'critical',
        title: '🚨 CRITICAL FAULT IMMINENT',
        riskProbability: 89,
        predictedIssue: 'Thermal Runaway Margin Degraded (<12 min projected buffer)',
        recommendation: 'Immediate technician intervention required. Avoid driving.'
      });
    } else if (simulationPreset === 'WARNING') {
      setActiveAlertModal({
        severity: 'warning',
        title: '⚠ BATTERY FAULT RISK DETECTED',
        riskProbability: 73,
        predictedIssue: 'Module 03 Thermal Anomaly (42.6°C) & Accelerated DC Sag',
        recommendation: 'Battery inspection recommended. Restrict heavy acceleration.'
      });
    } else {
      setActiveAlertModal({
        severity: 'healthy',
        title: '✓ ALL SYSTEMS NOMINAL',
        riskProbability: 12,
        predictedIssue: 'No abnormal electrochemical or thermal signatures detected.',
        recommendation: 'Continue regular operation. Digital twin running in equilibrium.'
      });
    }
  };

  return (
    <aside aria-label="Demo Simulator Controls" className="w-full bg-slate-900/95 border-b border-slate-800/80 px-4 py-2.5 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Simulation Label */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold tracking-wider uppercase text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Digital Twin Simulator</span>
          </div>
          <span className="hidden sm:inline text-slate-400">
            Interactive State Engine for Evaluation:
          </span>
        </div>

        {/* Center: State Presets */}
        <div className="flex items-center gap-1.5 bg-dark-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSimulationPreset('HEALTHY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
              simulationPreset === 'HEALTHY'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>NORMAL (94%)</span>
          </button>

          <button
            onClick={() => setSimulationPreset('WARNING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
              simulationPreset === 'WARNING'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-amber'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>WARNING (76%)</span>
          </button>

          <button
            onClick={() => setSimulationPreset('CRITICAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
              simulationPreset === 'CRITICAL'
                ? 'bg-rose-600 text-white font-bold shadow-glow-rose'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800/60'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>CRITICAL (52%)</span>
          </button>
        </div>

        {/* Right: Telemetry Jitter & Modal Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            title="Toggle Live 10Hz Sensor Telemetry Feed"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-[11px] transition-all ${
              isLiveStreaming
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-slate-800/40 text-slate-400 border-slate-700'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{isLiveStreaming ? '10Hz Stream: ON' : '10Hz: PAUSED'}</span>
          </button>

          <button
            onClick={handleTriggerAlert}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold transition-all"
          >
            <BellRing className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Trigger Alert Modal</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
