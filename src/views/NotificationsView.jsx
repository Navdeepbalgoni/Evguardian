import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Info, 
  CheckCheck, 
  Trash2, 
  ArrowRight,
  Filter
} from 'lucide-react';

export const NotificationsView = ({ onNavigate }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useVehicle();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Alerts', 'Predictions', 'Maintenance', 'System'];

  const filteredNotifications = notifications.filter(n => {
    if (selectedCategory === 'All') return true;
    return n.category === selectedCategory;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Telemetry Event Stream
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            NOTIFICATION CENTER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time critical alerts, predictive warnings, and system synchronization logs.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-semibold border border-slate-700 transition-all self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'bg-dark-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            return (
              <div
                key={notif.id}
                className={`glass-panel p-5 rounded-2xl border transition-all duration-200 ${
                  notif.unread
                    ? 'border-cyan-500/40 bg-slate-900/80 shadow-[0_0_15px_-5px_rgba(6,182,212,0.15)]'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 shrink-0">
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                          [{notif.category}]
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {notif.title}
                        </h4>
                        {notif.unread && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                        {notif.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Action Link */}
                  {notif.targetTab && (
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          onNavigate(notif.targetTab);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                      >
                        <span>{notif.actionLabel || 'View'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-12 glass-panel rounded-2xl border border-slate-800 text-slate-400">
            No notifications found under the <strong className="text-white">"{selectedCategory}"</strong> filter.
          </div>
        )}
      </div>
    </div>
  );
};
