import React from 'react';
import { X, Navigation, Clock, Gauge, Flame, RotateCcw, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const TripDetailModal = ({ trip, onClose }) => {
  if (!trip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trip Header */}
        <div className="pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {trip.code}
            </span>
            <span className="text-xs text-slate-400">{trip.date}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {trip.origin} → {trip.destination}
          </h2>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Distance</span>
            <div className="mt-1 text-2xl font-mono font-bold text-white">
              {trip.distanceKm} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Duration</span>
            <div className="mt-1 text-2xl font-mono font-bold text-white">
              {trip.durationMin} <span className="text-xs font-normal text-slate-400">min</span>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Avg Speed</span>
            <div className="mt-1 text-2xl font-mono font-bold text-white">
              {trip.avgSpeedKmh} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Battery Used</span>
            <div className="mt-1 text-2xl font-mono font-bold text-cyan-400">
              {trip.batteryUsedPct}%
            </div>
          </div>
        </div>

        {/* Secondary Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="p-3 rounded-xl bg-dark-900/60 border border-slate-800/80">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Energy Consumption</span>
            <p className="text-sm font-mono font-semibold text-slate-200 mt-0.5">
              {trip.energyRateWhKm} Wh/km
            </p>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/60 border border-slate-800/80">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Total Energy</span>
            <p className="text-sm font-mono font-semibold text-slate-200 mt-0.5">
              {trip.totalEnergyKWh} kWh
            </p>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/60 border border-slate-800/80">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Regen Energy</span>
            <p className="text-sm font-mono font-semibold text-emerald-400 mt-0.5">
              +{trip.regenEnergyKWh} kWh ({trip.regenEfficiencyPct}%)
            </p>
          </div>

          <div className="p-3 rounded-xl bg-dark-900/60 border border-slate-800/80">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Peak Battery Temp</span>
            <p className="text-sm font-mono font-semibold text-amber-400 mt-0.5">
              {trip.maxPackTempC} °C
            </p>
          </div>
        </div>

        {/* Elevation & Speed Route Profile Chart */}
        {trip.telemetrySamples && (
          <div className="mt-5 p-4 rounded-xl glass-panel border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block">
              Trip Speed & Elevation Telemetry Profile
            </span>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trip.telemetrySamples} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="km" stroke="#64748b" tickFormatter={(val) => `${val}km`} textAnchor="end" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelFormatter={(val) => `Distance: ${val} km`}
                  />
                  <Area type="monotone" dataKey="speed" name="Speed (km/h)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#speedGrad)" />
                  <Area type="monotone" dataKey="elevation" name="Elevation (m)" stroke="#8b5cf6" strokeWidth={1.5} fillOpacity={1} fill="url(#elevGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Abnormal Events During Trip */}
        <div className="mt-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
            Trip Anomaly & Anomaly Log
          </span>
          {trip.abnormalEvents && trip.abnormalEvents.length > 0 ? (
            <div className="space-y-2">
              {trip.abnormalEvents.map((evt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {evt.type}
                    </span>
                    <span className="font-mono text-slate-400">{evt.time}</span>
                  </div>
                  <div className="mt-1 text-slate-300">
                    Observed: <span className="font-mono text-white">{evt.observedValue}</span> (Threshold: {evt.thresholdValue})
                  </div>
                  <div className="mt-1 text-slate-400 text-[11px]">
                    Action: {evt.actionTaken}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>No abnormal events recorded during this trip session. All parameters nominal.</span>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close Trip View
          </button>
        </div>
      </div>
    </div>
  );
};
