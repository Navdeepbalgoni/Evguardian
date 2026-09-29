import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Calendar, 
  CheckCircle2,
  Layers
} from 'lucide-react';

export const PredictionHistoryView = () => {
  const { predictionHistoryLogs } = useVehicle();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');

  const filteredLogs = predictionHistoryLogs.filter((item) => {
    const matchesQuery = item.prediction.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.subsystem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || item.risk.toUpperCase() === filterRisk;
    return matchesQuery && matchesRisk;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Predictive Maintenance Audit Trail
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            PREDICTION HISTORY
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Chronological registry of ML fault predictions, confidence distributions, and mitigation outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Total Verified Predictions:</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {predictionHistoryLogs.length} Records
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-panel p-3.5 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by prediction or subsystem..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Risk Level:</span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
          >
            <option value="ALL">All Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Prediction History Table (Desktop) & Card List (Mobile) */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                <th className="py-3.5 px-4 font-semibold">Predicted Anomaly</th>
                <th className="py-3.5 px-4 font-semibold">Subsystem</th>
                <th className="py-3.5 px-4 font-semibold">Risk Level</th>
                <th className="py-3.5 px-4 font-semibold">Probability</th>
                <th className="py-3.5 px-4 font-semibold">Status / Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => {
                const isHigh = log.risk === 'High';
                const isMed = log.risk === 'Medium';

                return (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-300">
                      {log.date}
                    </td>

                    <td className="py-4 px-4 font-semibold text-white">
                      <div>{log.prediction}</div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        {log.triggeredTelemetry}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-300 font-mono">
                      {log.subsystem}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase border ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isMed
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {log.risk}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-mono font-bold text-slate-200">
                      <div className="flex items-center gap-2">
                        <span>{log.probability}%</span>
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${log.probability}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-dark-900 border border-slate-700 text-cyan-300 mb-1">
                        ● {log.status}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {log.resolution}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
