import React from 'react';
import { RefreshCw } from 'lucide-react';

export const LoadingState = ({ message = 'Synchronizing with Digital Twin telemetry...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-2xl border border-slate-800">
      <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-300">{message}</p>
      <span className="text-xs font-mono text-slate-500 mt-1">CAN BUS 10Hz OBSERVER</span>
    </div>
  );
};
