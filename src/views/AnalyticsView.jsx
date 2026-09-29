import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { ChartCard } from '../components/common/ChartCard';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { 
  Activity, 
  Battery, 
  Navigation, 
  Flame, 
  RotateCcw, 
  TrendingUp, 
  Calendar,
  Layers,
  Gauge
} from 'lucide-react';

export const AnalyticsView = () => {
  const { currentBatteryState, currentVehicleState } = useVehicle();
  const [timeRange, setTimeRange] = useState('Today'); // 'Today' | '7 Days' | '30 Days'

  // Driving Analytics Time Series
  const drivingSeries = [
    { time: '08:00', speed: 42, acceleration: 1.2, energyWhKm: 132, regenKw: 12, distanceKm: 4.2 },
    { time: '10:00', speed: 68, acceleration: 2.1, energyWhKm: 154, regenKw: 22, distanceKm: 16.8 },
    { time: '12:00', speed: 54, acceleration: 1.4, energyWhKm: 140, regenKw: 18, distanceKm: 28.5 },
    { time: '14:00', speed: 76, acceleration: 2.8, energyWhKm: 178, regenKw: 26, distanceKm: 42.1 },
    { time: '16:00', speed: 48, acceleration: 1.1, energyWhKm: 135, regenKw: 14, distanceKm: 52.4 },
    { time: '18:00', speed: 38, acceleration: 0.9, energyWhKm: 128, regenKw: 16, distanceKm: 62.8 },
    { time: '20:00', speed: 62, acceleration: 1.6, energyWhKm: 145, regenKw: 20, distanceKm: 78.4 }
  ];

  // Range Trend Dataset
  const rangeTrendData = [
    { day: 'Mon', estimatedRange: 148, actualDelivered: 145, energyRate: 136 },
    { day: 'Tue', estimatedRange: 144, actualDelivered: 140, energyRate: 142 },
    { day: 'Wed', estimatedRange: 142, actualDelivered: 139, energyRate: 139 },
    { day: 'Thu', estimatedRange: 138, actualDelivered: 132, energyRate: 156 },
    { day: 'Fri', estimatedRange: 140, actualDelivered: 138, energyRate: 141 },
    { day: 'Sat', estimatedRange: 146, actualDelivered: 144, energyRate: 134 },
    { day: 'Sun', estimatedRange: 142, actualDelivered: 141, energyRate: 138 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Historical Diagnostics & Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            POWERTRAIN ANALYTICS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Cross-correlation between driving dynamics, battery stress, and range degradation.
          </p>
        </div>

        {/* Range Selector: Today | 7 Days | 30 Days */}
        <div className="flex items-center gap-1 bg-dark-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {['Today', '7 Days', '30 Days'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeRange === range
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Range Analytics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Estimated Range</span>
          <div className="mt-1 text-2xl sm:text-3xl font-mono font-bold text-white">
            {currentVehicleState.remainingRange} <span className="text-xs text-slate-400">km</span>
          </div>
          <span className="text-[11px] text-cyan-400 mt-1 block">Based on 10Hz PID model</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Average Range</span>
          <div className="mt-1 text-2xl sm:text-3xl font-mono font-bold text-white">
            139.4 <span className="text-xs text-slate-400">km</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Past 30 full-charge cycles</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Avg Energy/km</span>
          <div className="mt-1 text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
            {currentVehicleState.liveParameters.energyConsumption.value} <span className="text-xs text-slate-400">Wh/km</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">94.8% powertrain efficiency</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Range Trend</span>
          <div className="mt-1 text-2xl sm:text-3xl font-mono font-bold text-cyan-400">
            +3.2%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Optimized by eco regen tuning</span>
        </div>
      </div>

      {/* SECTION 1: DRIVING ANALYTICS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
            1. Driving Dynamics & Energy Analytics ({timeRange})
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Speed vs Time */}
          <ChartCard
            title="Vehicle Speed Dynamics (km/h)"
            subtitle="GPS & Wheel Encoder velocity over driving sessions"
            badge="Wheel Encoder 10Hz"
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drivingSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="speed" name="Speed (km/h)" stroke="#06b6d4" strokeWidth={2.5} fill="url(#spdGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Acceleration vs Time */}
          <ChartCard
            title="Acceleration & G-Force Profile (m/s²)"
            subtitle="IMU sensor longitudinal acceleration and deceleration transients"
            badge="6-Axis IMU"
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={drivingSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <ReferenceLine y={2.5} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Aggressive Threshold (2.5)', fill: '#f59e0b', fontSize: 10 }} />
                  <Line type="monotone" dataKey="acceleration" name="Accel (m/s²)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Energy Consumption vs Time */}
          <ChartCard
            title="Specific Energy Consumption (Wh/km)"
            subtitle="Instantaneous powertrain energy drain correlated to grade & speed"
            badge="VCU Powertrain Log"
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drivingSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="energyWhKm" name="Energy (Wh/km)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Regenerative Braking Recapture vs Time */}
          <ChartCard
            title="Regenerative Energy Recapture (kW)"
            subtitle="Kinetic energy converted to electrochemical recharge during braking"
            badge="Inverter Regen Log"
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drivingSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="regenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="regenKw" name="Regen Power (kW)" stroke="#10b981" strokeWidth={2.5} fill="url(#regenGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* SECTION 2: RANGE ANALYTICS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-tight">
            2. Range Prediction & Wh/km Efficiency Benchmark
          </h2>
        </div>

        <ChartCard
          title="Daily Estimated vs Delivered Range (km)"
          subtitle="Real-world variance between predicted trip range and delivered kilometers"
          badge="PINN Range Twin"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rangeTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[110, 160]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="estimatedRange" name="Estimated Range (km)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="actualDelivered" name="Actual Delivered (km)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
