import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { ChartCard } from '../components/common/ChartCard';
import { CellMatrixVisualizer } from '../components/modules/CellMatrixVisualizer';
import { 
  Battery, 
  BatteryCharging, 
  Zap, 
  Thermometer, 
  Activity, 
  RotateCcw, 
  Clock, 
  Layers, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

export const BatteryHealthView = () => {
  const { currentBatteryState, currentVehicleState, simulationPreset } = useVehicle();
  const { specs, state, cellMatrix, charts } = currentBatteryState;
  const [activeChartTab, setActiveChartTab] = useState('all');

  const isHealthy = simulationPreset === 'HEALTHY';
  const isWarning = simulationPreset === 'WARNING';
  const isCritical = simulationPreset === 'CRITICAL';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Electrochemical Digital Twin
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            BATTERY HEALTH MONITOR
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">BMS Observer:</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {specs.coolingSystem}
          </span>
        </div>
      </div>

      {/* Top Battery Summary Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl border ${
              isCritical
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-glow-rose'
                : isWarning
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-glow-amber'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-glow-emerald'
            }`}>
              <BatteryCharging className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
                Battery State of Health (SOH)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-tight">
                  {state.soh}%
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${
                  isCritical
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : isWarning
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  ● {state.sohStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">SOC (Current)</span>
              <span className="text-lg font-bold text-white">{currentVehicleState.liveParameters.soc.value}%</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Pack Temp</span>
              <span className="text-lg font-bold text-cyan-400">{currentVehicleState.liveParameters.temperature.value}°C</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Internal Impedance</span>
              <span className="text-lg font-bold text-white">{state.internalResistance} mΩ</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Cell Delta</span>
              <span className={`text-lg font-bold ${state.maxCellVoltageDelta > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {state.maxCellVoltageDelta} mV
              </span>
            </div>
          </div>
        </div>

        {/* 8 Primary Battery Telemetry Items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
          <div className="p-3 rounded-xl bg-dark-900/50 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Usable Capacity</span>
            <span className="text-sm font-bold text-white font-mono">{specs.usableCapacity} kWh / {specs.nominalCapacity} kWh</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/50 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Pack Voltage</span>
            <span className="text-sm font-bold text-white font-mono">{currentVehicleState.liveParameters.voltage.value} V</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/50 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Discharge Current</span>
            <span className="text-sm font-bold text-white font-mono">{currentVehicleState.liveParameters.current.value} A</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/50 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Cumulative Cycles</span>
            <span className="text-sm font-bold text-white font-mono">{state.cycleCount} Cycles</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/50 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Fast Charge Duration</span>
            <span className="text-sm font-bold text-white font-mono">{state.chargingDurationAvg}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/50 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Thermal Loop State</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">{state.coolingLoopStatus}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/50 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Cell Chemistry</span>
            <span className="text-sm font-bold text-white font-mono">{specs.chemistry.split('(')[0]}</span>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/50 border border-slate-800/80">
            <span className="text-slate-400 block text-[10px] uppercase">Configuration</span>
            <span className="text-sm font-bold text-white font-mono">{specs.cellConfiguration}</span>
          </div>
        </div>
      </div>

      {/* AI Battery Analysis Card */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isCritical
          ? 'glass-panel-rose border-rose-500/40 shadow-glow-rose'
          : isWarning
          ? 'glass-panel-amber border-amber-500/40 shadow-glow-amber'
          : 'glass-panel border-cyan-500/30'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono uppercase">
              AI Battery Electrochemical Diagnostics
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${
            isCritical
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : isWarning
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            Condition: {state.aiAnalysis.condition}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-200 font-medium leading-relaxed">
            {state.aiAnalysis.summary}
          </p>

          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Diagnostic Findings:</span>
            {state.aiAnalysis.detailedDiagnostics.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-xl bg-dark-950/80 border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              AI Recommendation:
            </span>
            <span className="text-xs text-slate-200 font-medium">{state.aiAnalysis.recommendation}</span>
          </div>
        </div>
      </div>

      {/* 16-Cell Battery Pack Thermal & Voltage Matrix */}
      <CellMatrixVisualizer cells={cellMatrix} />

      {/* 5 Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: SOC vs Time */}
        <ChartCard
          title="State of Charge (SOC) Trajectory"
          subtitle="Charge discharge cycles over time with idle and fast-charge detection"
          badge="CAN 10Hz Log"
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.soc} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[20, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="currentSOC" name="Pack SOC (%)" stroke="#06b6d4" strokeWidth={2.5} fill="url(#socGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Battery Temperature vs Time */}
        <ChartCard
          title="Battery Temperature Profile (°C)"
          subtitle="Pack average vs peak module temperature with safe threshold lines"
          badge="Thermal Observer"
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.temperature} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[20, 60]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <ReferenceLine y={45} label={{ value: 'Warning Limit 45°C', fill: '#f59e0b', fontSize: 10 }} stroke="#f59e0b" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="maxCellTemp" name="Peak Cell (°C)" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="packTemp" name="Pack Avg (°C)" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 3: Voltage vs Time */}
        <ChartCard
          title="Pack Voltage Stability (V)"
          subtitle="Real-time DC bus voltage vs nominal voltage target curve"
          badge="BMS Bus Log"
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.voltage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[350, 425]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="voltage" name="Observed Voltage (V)" stroke="#38bdf8" strokeWidth={2.5} />
                <Line type="monotone" dataKey="target" name="Target Curve (V)" stroke="#64748b" strokeDasharray="4 4" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 4: Current vs Time */}
        <ChartCard
          title="Current Flow Dynamics (A)"
          subtitle="Discharge acceleration peaks vs regenerative braking energy recapture"
          badge="Hall Sensor Feed"
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.current} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="current" name="Discharge (A)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="regen" name="Regen Recovery (A)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 5: Battery Capacity Degradation & Forecast (Spans 2 cols) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Long-Term Battery Degradation & Predictive RUL Forecast"
            subtitle="Electrochemical aging curve: Historical actuals vs Physics-Informed ML forecast (30-Month horizon)"
            badge="PINN Model v3.4"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.degradation} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" domain={[50, 66]} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="actualCapacity" name="Observed Capacity (kWh)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} connectNulls={false} />
                  <Line type="monotone" dataKey="predictedCapacity" name="AI Projected Fade (kWh)" stroke="#06b6d4" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="baselineIdeal" name="Ideal Lab Baseline" stroke="#64748b" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

      </div>
    </div>
  );
};
