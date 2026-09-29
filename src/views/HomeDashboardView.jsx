import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { HealthScore } from '../components/common/HealthScore';
import { HealthCard } from '../components/common/HealthCard';
import { LiveParametersGrid } from '../components/modules/LiveParametersGrid';
import { DigitalTwinPipeline } from '../components/common/DigitalTwinPipeline';
import { 
  BatteryCharging, 
  Car, 
  Thermometer, 
  Navigation, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Zap
} from 'lucide-react';

export const HomeDashboardView = ({ onNavigate }) => {
  const { 
    currentVehicleState, 
    currentPredictionState, 
    simulationPreset,
    setSelectedFaultDetail
  } = useVehicle();

  const isHealthy = simulationPreset === 'HEALTHY';
  const isWarning = simulationPreset === 'WARNING';
  const isCritical = simulationPreset === 'CRITICAL';

  // Extract primary predicted fault for the AI card
  const primaryFault = currentPredictionState.faults.find(f => f.id === 'battery') || currentPredictionState.faults[0];

  const handleOpenAiAnalysis = () => {
    setSelectedFaultDetail(primaryFault);
    onNavigate('prediction');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Digital Twin Pipeline Visualizer */}
      <DigitalTwinPipeline
        currentStage={isCritical ? 6 : isWarning ? 5 : 4}
        latency={isCritical ? '18.4 ms' : isWarning ? '15.1 ms' : '12.8 ms'}
      />

      {/* 2. Prominent Quick Alert Section */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isCritical
          ? 'glass-panel-rose border-rose-500/50 text-rose-200 shadow-glow-rose'
          : isWarning
          ? 'glass-panel-amber border-amber-500/50 text-amber-200 shadow-glow-amber'
          : 'glass-panel-glow border-emerald-500/30 text-emerald-200 shadow-glow-emerald'
      }`}>
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`p-2.5 rounded-xl border shrink-0 ${
            isCritical
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : isWarning
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          }`}>
            {isCritical ? (
              <AlertOctagon className="w-5 h-5" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold block opacity-75">
              System Telemetry Status
            </span>
            <div className="text-sm sm:text-base font-bold text-white mt-0.5">
              {currentVehicleState.quickAlert.title}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {currentVehicleState.quickAlert.message}
            </p>
          </div>
        </div>

        {/* Quick action on alert */}
        <button
          onClick={() => onNavigate(isWarning || isCritical ? 'prediction' : 'vehicle')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            isCritical
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : isWarning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <span>{isWarning || isCritical ? 'Inspect Risk Mode' : 'View Subsystems'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Core Top Section: Large Health Ring + 4 Major Health Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Large Central Health Score Card (4 cols) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-3 left-4 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Real-Time Twin Evaluator
          </div>
          <HealthScore
            score={currentVehicleState.overallHealth}
            status={currentVehicleState.statusLabel}
            subtitle={currentVehicleState.healthMessage}
            size={220}
          />
        </div>

        {/* 4 Major Health Cards Grid (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HealthCard
            title="Battery Health (SOH)"
            value={`${currentVehicleState.batteryHealth}%`}
            status={isCritical ? 'Critical' : isWarning ? 'Degraded' : 'Healthy'}
            trend={currentVehicleState.batteryTrend}
            trendDirection={isCritical || isWarning ? 'down' : 'up'}
            icon={BatteryCharging}
            accentColor={isCritical ? 'rose' : isWarning ? 'amber' : 'emerald'}
            onClick={() => onNavigate('battery')}
          />

          <HealthCard
            title="Motor Health"
            value={`${currentVehicleState.motorHealth}%`}
            status={isCritical ? 'Derated' : isWarning ? 'Elevated Load' : 'Nominal'}
            trend={currentVehicleState.motorTrend}
            trendDirection={isCritical ? 'down' : isWarning ? 'neutral' : 'up'}
            icon={Car}
            accentColor={isCritical ? 'rose' : isWarning ? 'amber' : 'cyan'}
            onClick={() => onNavigate('vehicle')}
          />

          <HealthCard
            title="Pack Temperature"
            value={`${currentVehicleState.temperature}`}
            unit="°C"
            status={currentVehicleState.tempStatus}
            trend={isCritical ? '🚨 Overheat warning' : isWarning ? '↑ 7.2°C above mean' : 'Uniform dissipation'}
            trendDirection={isCritical || isWarning ? 'down' : 'up'}
            icon={Thermometer}
            accentColor={isCritical ? 'rose' : isWarning ? 'amber' : 'cyan'}
            onClick={() => onNavigate('battery')}
          />

          <HealthCard
            title="Remaining Range"
            value={`${currentVehicleState.remainingRange}`}
            unit="km"
            status={isCritical ? 'Restricted' : isWarning ? 'Derated' : 'Est. Range'}
            trend={currentVehicleState.rangeTrend}
            trendDirection={isCritical || isWarning ? 'down' : 'up'}
            icon={Navigation}
            accentColor={isCritical ? 'rose' : isWarning ? 'amber' : 'emerald'}
            onClick={() => onNavigate('analytics')}
          />
        </div>
      </div>

      {/* 4. AI Prediction Card (Visually prominent highlight) */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        isCritical
          ? 'glass-panel-rose border-rose-500/40 shadow-glow-rose'
          : isWarning
          ? 'glass-panel-amber border-amber-500/40 shadow-glow-amber'
          : 'glass-panel border-cyan-500/30 shadow-glow-cyan'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit className={`w-5 h-5 ${isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-cyan-400'}`} />
              <h3 className="text-lg font-bold text-white tracking-tight uppercase font-mono">
                AI Predictive Health & Anomaly Forecast
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervised & Unsupervised Machine Learning Inferences on 48 CAN bus metrics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
              isCritical
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : isWarning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              ● {currentPredictionState.overallRisk.statusLabel}
            </span>
          </div>
        </div>

        {/* Prediction Body */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="text-sm sm:text-base font-semibold text-white">
              {currentPredictionState.overallRisk.headline}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentPredictionState.overallRisk.tagline}
            </p>

            {/* If warning or critical state, display detected issue details directly */}
            {(isWarning || isCritical) && (
              <div className="mt-3 p-3.5 rounded-xl bg-dark-950/70 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Predicted Issue:</span>
                  <span className="font-bold text-amber-300">{primaryFault.shortExplanation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Risk Probability:</span>
                  <span className={`font-mono font-bold ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                    {primaryFault.probability}%
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="font-semibold text-cyan-400">Recommendation:</span>
                  <span className="text-slate-200">{primaryFault.recommendedAction}</span>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-4 flex flex-col items-center sm:items-end justify-center">
            <button
              onClick={handleOpenAiAnalysis}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all ${
                isCritical
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose'
                  : isWarning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-amber'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-glow-cyan'
              }`}
            >
              <span>View AI Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-500 mt-2">
              Model: Isolation Forest + LSTM RUL
            </span>
          </div>
        </div>
      </div>

      {/* 5. Live Vehicle Parameters (12 Live Sensors) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight uppercase font-mono">
              Live Vehicle Parameters
            </h3>
            <p className="text-xs text-slate-400">
              Synchronous streaming metrics across High-Voltage (HV) powertrain & chassis
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>10 Hz Live</span>
          </div>
        </div>

        <LiveParametersGrid parameters={currentVehicleState.liveParameters} />
      </div>

      {/* 6. Quick Nav Footnotes (Recent Trips & Recommendations shortcuts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div 
          onClick={() => onNavigate('trips')}
          className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 group-hover:scale-105 transition-transform">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white">Recent Trips History</span>
              <p className="text-[11px] text-slate-400">Mumbai → Thane (24.6 km) • 142 Wh/km</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors" />
        </div>

        <div 
          onClick={() => onNavigate('recommendations')}
          className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-amber-400 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white">Smart AI Recommendations</span>
              <p className="text-[11px] text-slate-400">Thermal management & driving efficiency actions</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
        </div>
      </div>
    </div>
  );
};
