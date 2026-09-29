import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useAuth } from '../context/AuthContext';
import { Car, BatteryCharging, Calendar, Check, ArrowRight, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

export const VehicleSetupView = ({ onNavigate }) => {
  const { setVehicleProfile } = useVehicle();
  const { completeVehicleSetup } = useAuth();

  const [form, setForm] = useState({
    name: 'Aetherion Pulse 4X',
    model: 'Apex Performance EV',
    type: 'Electric 4-Wheeler',
    batteryCapacity: '64 kWh',
    batteryChemistry: 'LiFePO4 (LFP)',
    manufacturingYear: 2025,
    vin: '9B2EV4X89J2049182',
    bmsFirmware: 'v4.12.0-PROD',
    telemetryFrequency: '10 Hz',
    status: 'Online',
    lastSync: 'Just now'
  });

  const handleContinue = (e) => {
    e.preventDefault();
    setVehicleProfile(form);
    completeVehicleSetup();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-dark-950 p-4 sm:p-8 flex items-center justify-center bg-grid-pattern relative">
      <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full z-10">
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold mb-2 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Twin Calibration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            VEHICLE & POWERTRAIN SETUP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Initialize sensor telemetry bindings and baseline electrochemical parameters for this vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Setup Form (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
            <form onSubmit={handleContinue} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Vehicle Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    required
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Electric 4-Wheeler', 'Electric 2-Wheeler'].map((typeOption) => (
                    <button
                      key={typeOption}
                      type="button"
                      onClick={() => setForm({ ...form, type: typeOption })}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        form.type === typeOption
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-glow-cyan'
                          : 'bg-dark-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      <span>{typeOption}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Battery Capacity
                  </label>
                  <select
                    value={form.batteryCapacity}
                    onChange={(e) => setForm({ ...form, batteryCapacity: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="40 kWh">40 kWh (Compact City)</option>
                    <option value="64 kWh">64 kWh (Mid-Range SUV/Sedan)</option>
                    <option value="85 kWh">85 kWh (Long-Range GT)</option>
                    <option value="3.5 kWh">3.5 kWh (2-Wheeler Scooter)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Battery Chemistry
                  </label>
                  <select
                    value={form.batteryChemistry}
                    onChange={(e) => setForm({ ...form, batteryChemistry: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="LiFePO4 (LFP)">LiFePO4 (LFP - High Thermal Stability)</option>
                    <option value="NMC 811">Nickel Manganese Cobalt (NMC 811)</option>
                    <option value="NCA (Nickel Cobalt Aluminum)">NCA (High Energy Density)</option>
                    <option value="Solid State Pilot">Solid State Electrochemical Twin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Manufacturing Year
                  </label>
                  <input
                    type="number"
                    min="2020"
                    max="2027"
                    value={form.manufacturingYear}
                    onChange={(e) => setForm({ ...form, manufacturingYear: parseInt(e.target.value) || 2025 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    VIN / Serial Identifier
                  </label>
                  <input
                    type="text"
                    value={form.vin}
                    onChange={(e) => setForm({ ...form, vin: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-glow-cyan transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Vehicle Preview Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/30 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Live Preview
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>CAN Telemetry Ready</span>
                  </div>
                </div>

                {/* Visual Representation */}
                <div className="my-6 p-6 rounded-2xl bg-gradient-to-b from-dark-900 to-dark-950 border border-slate-800 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
                  <Car className="w-20 h-20 text-cyan-400 mx-auto group-hover:scale-105 transition-transform" />
                  <h3 className="text-xl font-bold text-white mt-3 font-mono">
                    {form.name}
                  </h3>
                  <p className="text-xs text-slate-400">{form.model}</p>
                </div>

                {/* Specs List */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Class:</span>
                    <span className="font-semibold text-white">{form.type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Battery Pack:</span>
                    <span className="font-mono font-bold text-cyan-400">{form.batteryCapacity}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Chemistry:</span>
                    <span className="text-slate-200">{form.batteryChemistry}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Mfg Year:</span>
                    <span className="font-mono text-slate-200">{form.manufacturingYear}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Observer Twin:</span>
                    <span className="font-mono text-emerald-400">Active (48 Streams)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Model weights will calibrate based on baseline degradation characteristics.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
