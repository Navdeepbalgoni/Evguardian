import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const EmptyState = ({
  title = 'No Abnormal Telemetry Detected',
  description = 'All systems and parameters are operating within established safety tolerances.',
  icon: Icon = ShieldCheck
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center glass-panel rounded-2xl border border-slate-800/80">
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1">{description}</p>
    </div>
  );
};
