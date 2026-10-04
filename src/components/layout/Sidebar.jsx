import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  BatteryCharging, 
  BrainCircuit, 
  Activity,
  LineChart, 
  Navigation, 
  Lightbulb, 
  History, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVehicle } from '../../context/VehicleContext';

export const Sidebar = ({ currentTab, onNavigate, isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const { currentPredictionState, unreadCount } = useVehicle();

  const navItems = [
    { id: 'home', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'vehicle', label: 'Vehicle Health', icon: Car },
    { id: 'battery', label: 'Battery Health', icon: BatteryCharging },
    { 
      id: 'prediction', 
      label: 'AI Fault Prediction', 
      icon: BrainCircuit,
      badge: currentPredictionState.overallRisk?.probability > 40 ? `${currentPredictionState.overallRisk.probability}%` : null,
      badgeColor: currentPredictionState.overallRisk?.probability >= 70 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-slate-950 font-bold'
    },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { 
      id: 'realtime', 
      label: 'Real-Time Monitoring', 
      icon: Activity,
      badge: '⚡',
      badgeColor: 'bg-violet-500 text-white font-bold'
    },
    { id: 'trips', label: 'Trip History', icon: Navigation },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'prediction-history', label: 'Prediction History', icon: History },
    { 
      id: 'notifications', 
      label: 'Notification Center', 
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: 'bg-cyan-500 text-slate-950 font-bold'
    },
    { id: 'profile', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between h-[calc(100vh-6rem)] sticky top-24 border-r border-slate-800/80 bg-dark-950/60 backdrop-blur-md transition-all duration-300 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Nav Items */}
      <div className="p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isCoreAI = item.id === 'prediction';

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group relative ${
                isActive
                  ? isCoreAI
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'bg-slate-800/90 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                isActive
                  ? isCoreAI ? 'bg-cyan-500 text-slate-950' : 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 group-hover:text-cyan-300'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              {!isCollapsed && (
                <span className="truncate tracking-wide flex-1 text-left">
                  {item.label}
                </span>
              )}

              {/* Badge */}
              {!isCollapsed && item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom controls: Collapse & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all text-xs font-medium"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-xs font-medium"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
