import React from 'react';
import { LayoutDashboard, Car, BatteryCharging, BrainCircuit, LineChart, Settings } from 'lucide-react';
import { useVehicle } from '../../context/VehicleContext';

export const BottomNavigation = ({ currentTab, onNavigate }) => {
  const { currentPredictionState } = useVehicle();
  const hasHighRisk = currentPredictionState?.overallRisk?.probability >= 60;

  const mobileNav = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'vehicle', label: 'Vehicle', icon: Car },
    { id: 'battery', label: 'Battery', icon: BatteryCharging },
    { 
      id: 'prediction', 
      label: 'AI Fault', 
      icon: BrainCircuit,
      highlight: true
    },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2">
      <div className="flex items-center justify-around">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`relative p-1.5 rounded-lg ${
                isActive && item.highlight
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : isActive
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : ''
              }`}>
                <Icon className="w-5 h-5" />
                {item.highlight && hasHighRisk && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
