import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVehicle } from '../context/VehicleContext';
import { 
  User, 
  Car, 
  BatteryCharging, 
  Settings, 
  Bell, 
  Moon, 
  Gauge, 
  Sliders, 
  LogOut, 
  Edit3, 
  Save, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ProfileSettingsView = ({ onNavigate }) => {
  const { user, logout, updateProfile } = useAuth();
  const { vehicleProfile, setVehicleProfile } = useVehicle();

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userName, setUserName] = useState(user?.name || 'Anish Sharma');
  const [userRole, setUserRole] = useState(user?.role || 'Powertrain Diagnostics Engineer');
  const [userOrg, setUserOrg] = useState(user?.organization || 'CleanMobility Labs');

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unitSystem, setUnitSystem] = useState('Metric (km, °C, Wh/km)');
  const [alertSensitivity, setAlertSensitivity] = useState('Balanced (3-Sigma Anomaly Threshold)');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({
      name: userName,
      role: userRole,
      organization: userOrg
    });
    setIsEditingUser(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Configuration & Identity
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            PROFILE & PREFERENCES
          </h1>
        </div>

        {showSavedToast && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preferences Saved Successfully</span>
          </div>
        )}
      </div>

      {/* 1. User Profile Information */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-lg font-mono shadow-glow-cyan">
              {userName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{userName}</h3>
              <p className="text-xs text-slate-400">{user?.email || 'engineer@evguardian.ai'}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditingUser) handleSaveProfile();
              else setIsEditingUser(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            {isEditingUser ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditingUser ? 'Save Profile' : 'Edit Profile'}</span>
          </button>
        </div>

        {isEditingUser ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs text-slate-400 uppercase font-mono block mb-1">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase font-mono block mb-1">Engineering Role</label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase font-mono block mb-1">Organization / Fleet</label>
              <input
                type="text"
                value={userOrg}
                onChange={(e) => setUserOrg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-dark-900/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Role</span>
              <span className="font-semibold text-white mt-0.5 block">{userRole}</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Organization</span>
              <span className="font-semibold text-white mt-0.5 block">{userOrg}</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Identity Status</span>
              <span className="font-semibold text-emerald-400 mt-0.5 block">Verified Telematics Key</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Vehicle & Battery Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Information */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-mono uppercase">
                Vehicle Specifications
              </h3>
            </div>
            <button
              onClick={() => onNavigate('vehicle-setup')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Vehicle
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Vehicle Name:</span>
              <span className="font-bold text-white">{vehicleProfile.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Model:</span>
              <span className="text-slate-200">{vehicleProfile.model}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Vehicle Type:</span>
              <span className="text-slate-200">{vehicleProfile.type}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Mfg Year:</span>
              <span className="text-slate-200 font-mono">{vehicleProfile.manufacturingYear}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">VIN Identifier:</span>
              <span className="text-cyan-400 font-mono">{vehicleProfile.vin}</span>
            </div>
          </div>
        </div>

        {/* Battery Specifications */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-mono uppercase">
                Battery Pack Parameters
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Electrochemical Twin
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Pack Capacity:</span>
              <span className="font-bold font-mono text-cyan-400">{vehicleProfile.batteryCapacity}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Cell Chemistry:</span>
              <span className="text-slate-200">{vehicleProfile.batteryChemistry}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">BMS Firmware:</span>
              <span className="text-slate-200 font-mono">{vehicleProfile.bmsFirmware}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Sampling Rate:</span>
              <span className="text-emerald-400 font-mono">{vehicleProfile.telemetryFrequency}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Thermal Loop:</span>
              <span className="text-slate-200">Active Glycol Liquid Cooling</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. System Preferences & Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white font-mono uppercase">
            Application & Telemetry Settings
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-bold text-white block">Push Notifications & Critical Alerts</span>
                <span className="text-slate-400 text-[11px]">Receive high-priority warnings when anomaly risk exceeds 70%</span>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Units Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 gap-2">
            <div className="flex items-center gap-3">
              <Gauge className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-bold text-white block">Measurement Unit System</span>
                <span className="text-slate-400 text-[11px]">Defines units across speed, range, and specific energy</span>
              </div>
            </div>
            <select
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-dark-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="Metric (km, °C, Wh/km)">Metric (km, °C, Wh/km)</option>
              <option value="Imperial (miles, °F, Wh/mi)">Imperial (miles, °F, Wh/mi)</option>
            </select>
          </div>

          {/* Alert Sensitivity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-dark-900/60 border border-slate-800 gap-2">
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-bold text-white block">Anomaly Detection Sensitivity</span>
                <span className="text-slate-400 text-[11px]">Autoencoder reconstruction error trigger threshold</span>
              </div>
            </div>
            <select
              value={alertSensitivity}
              onChange={(e) => setAlertSensitivity(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-dark-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="High (2.5-Sigma / Early Flag)">High (2.5-Sigma / Early Warning)</option>
              <option value="Balanced (3-Sigma Anomaly Threshold)">Balanced (3-Sigma Anomaly Threshold)</option>
              <option value="Conservative (4-Sigma / Critical Only)">Conservative (4-Sigma / Critical Only)</option>
            </select>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-4 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of EV Guardian</span>
          </button>
        </div>
      </div>
    </div>
  );
};
