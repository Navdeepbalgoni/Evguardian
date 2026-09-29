import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Zap, 
  Bell, 
  User, 
  Wifi, 
  Clock, 
  CheckCheck, 
  ChevronRight,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Navbar = ({ onNavigate, currentTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { vehicleProfile, unreadCount, notifications, markAllNotificationsAsRead, lastSyncTime } = useVehicle();
  const { user } = useAuth();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-dark-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger & Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-300 font-mono">
                  EV GUARDIAN
                </span>
                <span className="hidden sm:inline px-1.5 py-0.2 text-[9px] font-bold font-mono tracking-wider uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  DIGITAL TWIN
                </span>
              </div>
              <p className="hidden md:block text-[10px] tracking-wide text-slate-400 font-medium -mt-0.5">
                AI-Powered Predictive Health Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Center: Vehicle Status Badge */}
        <div className="hidden md:flex items-center gap-4 bg-slate-900/90 px-4 py-1.5 rounded-full border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{vehicleProfile.name}</span>
            <span className="text-slate-400">({vehicleProfile.model})</span>
          </div>

          <div className="h-3 w-px bg-slate-700" />

          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold tracking-wide uppercase">Online</span>
          </div>

          <div className="h-3 w-px bg-slate-700" />

          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{lastSyncTime}</span>
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-glow-rose animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel p-4 shadow-2xl border border-slate-700/80 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.slice(0, 4).map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowNotificationsDropdown(false);
                        if (item.targetTab) onNavigate(item.targetTab);
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        item.unread
                          ? 'bg-slate-800/80 border-cyan-500/30 hover:border-cyan-500/60'
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 truncate">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setShowNotificationsDropdown(false);
                      onNavigate('notifications');
                    }}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center gap-1 transition-all"
                  >
                    <span>View All Notifications</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all ${
              currentTab === 'profile'
                ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs font-mono">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold leading-tight">{user?.name || 'Engineer'}</span>
              <span className="block text-[10px] text-slate-400 leading-tight">Fleet Specialist</span>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
