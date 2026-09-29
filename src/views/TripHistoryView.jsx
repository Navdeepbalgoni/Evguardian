import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { TripDetailModal } from '../components/modules/TripDetailModal';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  BatteryCharging, 
  Flame, 
  RotateCcw, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const TripHistoryView = () => {
  const { tripsList, selectedTripDetail, setSelectedTripDetail } = useVehicle();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Journey Diagnostics & Telemetry Logs
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            TRIP HISTORY
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Detailed session logs with energy expenditure, regenerative recovery, and anomaly detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Recorded Trips:</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-white border border-slate-700">
            {tripsList.length} Trips
          </span>
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {tripsList.map((trip) => {
          const hasAnomalies = trip.anomalyCount > 0;

          return (
            <div
              key={trip.id}
              onClick={() => setSelectedTripDetail(trip)}
              className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                hasAnomalies
                  ? 'border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_15px_-5px_rgba(245,158,11,0.15)]'
                  : 'border-slate-800 hover:border-cyan-500/40 hover:shadow-glow-cyan'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left: Trip Origin/Destination & Time */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {trip.code}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {trip.date}
                    </span>
                    {hasAnomalies ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {trip.anomalyCount} Anomaly Flagged
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Nominal
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    <span>{trip.origin}</span>
                    <span className="text-slate-500">→</span>
                    <span>{trip.destination}</span>
                  </div>
                </div>

                {/* Right: Key Stats & Details Button */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Distance</span>
                    <span className="text-base font-mono font-bold text-white">{trip.distanceKm} km</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Rate</span>
                    <span className="text-base font-mono font-bold text-slate-300">{trip.energyRateWhKm} Wh/km</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Battery Used</span>
                    <span className="text-base font-mono font-bold text-cyan-400">{trip.batteryUsedPct}%</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Clickable Trip Telemetry Modal */}
      {selectedTripDetail && (
        <TripDetailModal
          trip={selectedTripDetail}
          onClose={() => setSelectedTripDetail(null)}
        />
      )}
    </div>
  );
};
