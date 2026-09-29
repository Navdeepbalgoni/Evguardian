import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { ChartCard } from '../components/common/ChartCard';
import { HealthScore } from '../components/common/HealthScore';
import { 
  Car, 
  Activity, 
  Flame, 
  TrendingUp, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Gauge, 
  Zap,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const VehicleHealthView = () => {
  const { currentVehicleState, simulationPreset } = useVehicle();
  const { motorMetrics, performanceMetrics, operationalMetrics, overallHealth, statusLabel } = currentVehicleState;

  // Mock motor torque vs RPM curve
  const motorPerformanceCurve = [
    { rpm: 1000, torque: 280, power: 29.3, efficiency: 95.2 },
    { rpm: 2000, torque: 280, power: 58.6, efficiency: 97.4 },
    { rpm: 3000, torque: 280, power: 88.0, efficiency: 98.1 },
    { rpm: 4000, torque: 280, power: 117.3, efficiency: 97.8 },
    { rpm: 5000, torque: 240, power: 125.6, efficiency: 96.5 },
    { rpm: 6000, torque: 200, power: 125.6, efficiency: 94.8 },
    { rpm: 7000, torque: 170, power: 124.6, efficiency: 93.2 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Powertrain & Mechanical Subsystems
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            VEHICLE HEALTH MONITOR
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Powertrain Observer:</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Online (ISO 26262)
          </span>
        </div>
      </div>

      {/* Top Section: Overall Health + Motor Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold mb-2">
            Aggregate Powertrain Score
          </span>
          <HealthScore
            score={overallHealth}
            status={statusLabel}
            subtitle={currentVehicleState.healthMessage}
            size={200}
          />
        </div>

        {/* Motor Health Deep Dive (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Permanent Magnet Synchronous Motor (PMSM)</h3>
                  <span className="text-xs text-slate-400 font-mono">Dual Liquid-Cooled Stator Observer</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-cyan-400">{currentVehicleState.motorHealth}%</span>
                <span className="block text-[10px] uppercase font-mono text-slate-400">Motor Health</span>
              </div>
            </div>

            {/* Motor Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Motor Temperature</span>
                <p className="text-base font-mono font-bold text-white mt-0.5">{motorMetrics.temperature}</p>
              </div>

              <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Motor Speed / RPM</span>
                <p className="text-base font-mono font-bold text-white mt-0.5">{motorMetrics.rpm}</p>
              </div>

              <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Motor Load</span>
                <p className="text-base font-mono font-bold text-white mt-0.5">{motorMetrics.load}</p>
              </div>

              <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Specific Consumption</span>
                <p className="text-base font-mono font-bold text-white mt-0.5">{motorMetrics.energyConsumption}</p>
              </div>

              <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Throttle Response</span>
                <p className="text-base font-mono font-bold text-emerald-400 mt-0.5">{motorMetrics.accelerationResponse}</p>
              </div>

              <div className="p-3 rounded-xl bg-dark-900/80 border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Inverter Efficiency</span>
                <p className="text-base font-mono font-bold text-cyan-400 mt-0.5">{motorMetrics.inverterEfficiency}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Vibration Harmonics: <strong className="text-white">{motorMetrics.vibrationLevel}</strong></span>
            <span className="text-emerald-400">ISO 10816-3 Compliant</span>
          </div>
        </div>
      </div>

      {/* Performance Health & Operational Health Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Performance Health */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-mono uppercase">
                Performance Health
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {performanceMetrics.energyEfficiency} Efficient
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/70 border border-slate-800">
              <span className="text-slate-400">Energy Efficiency Index</span>
              <span className="font-mono font-bold text-white">{performanceMetrics.energyEfficiency}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/70 border border-slate-800">
              <span className="text-slate-400">Average Driving Speed</span>
              <span className="font-mono font-bold text-white">{performanceMetrics.averageSpeed}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/70 border border-slate-800">
              <span className="text-slate-400">Specific Energy Rate</span>
              <span className="font-mono font-bold text-cyan-400">{performanceMetrics.energyPerKm}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/70 border border-slate-800">
              <span className="text-slate-400">Regenerative Braking Efficiency</span>
              <span className="font-mono font-bold text-emerald-400">{performanceMetrics.regenEfficiency}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/70 border border-slate-800">
              <span className="text-slate-400">Range Consumption Efficiency</span>
              <span className="font-mono font-bold text-white">{performanceMetrics.rangeEfficiency}</span>
            </div>
          </div>
        </div>

        {/* Operational Health */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-mono uppercase">
                Operational & Behavioral Health
              </h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              operationalMetrics.abnormalEventsCount > 0
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {operationalMetrics.abnormalEventsCount} Anomaly Events
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-dark-900/70 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                Driving Behaviour Assessment
              </span>
              <span className="font-semibold text-white">{operationalMetrics.drivingBehaviour}</span>
            </div>

            <div className="p-3 rounded-xl bg-dark-900/70 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                Temperature Distribution Behavior
              </span>
              <span className="font-semibold text-white">{operationalMetrics.temperatureBehaviour}</span>
            </div>

            <div className="p-3 rounded-xl bg-dark-900/70 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                Load & Energy Consumption Dynamics
              </span>
              <span className="font-semibold text-white">{operationalMetrics.consumptionPattern}</span>
            </div>

            <div className="p-3 rounded-xl bg-dark-900/70 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Abnormal Telemetry Events (Last 24h)</span>
              <span className={`font-mono font-bold text-sm ${operationalMetrics.abnormalEventsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {operationalMetrics.abnormalEventsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Motor Performance Curve Chart */}
      <ChartCard
        title="Motor Torque & Power Envelope Observer"
        subtitle="PMSM Stator efficiency and mechanical power output across RPM bandwidth"
        badge="CAN High-Speed Feed"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={motorPerformanceCurve} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="rpm" stroke="#64748b" tickFormatter={(v) => `${v}rpm`} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#06b6d4" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="torque" name="Torque (Nm)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="power" name="Power (kW)" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" />
              <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency (%)" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};
