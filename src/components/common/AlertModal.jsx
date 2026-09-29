import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2, X, ArrowRight } from 'lucide-react';

export const AlertModal = ({
  isOpen,
  onClose,
  onViewDetails,
  severity = 'warning', // 'healthy' | 'warning' | 'critical'
  title = 'Fault Predicted',
  subtitle = 'Battery Fault Risk Detected',
  riskProbability = 73,
  predictedIssue = 'Abnormal battery behaviour detected.',
  recommendation = 'Schedule battery inspection.'
}) => {
  if (!isOpen) return null;

  let theme = {
    panelClass: 'glass-panel-amber border-amber-500/50',
    icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    headerColor: 'text-amber-400',
    btnPrimary: 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-amber',
    iconContainer: 'bg-amber-500/10 border-amber-500/30'
  };

  if (severity === 'critical') {
    theme = {
      panelClass: 'glass-panel-rose border-rose-500/50',
      icon: <AlertOctagon className="w-8 h-8 text-rose-400 animate-pulse" />,
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      headerColor: 'text-rose-400',
      btnPrimary: 'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose',
      iconContainer: 'bg-rose-500/10 border-rose-500/30'
    };
  } else if (severity === 'healthy') {
    theme = {
      panelClass: 'glass-panel-glow border-emerald-500/50',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      headerColor: 'text-emerald-400',
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald',
      iconContainer: 'bg-emerald-500/10 border-emerald-500/30'
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-lg rounded-2xl p-6 sm:p-8 ${theme.panelClass} transition-all duration-300`}>
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon & Severity */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border ${theme.iconContainer}`}>
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${theme.badgeBg}`}>
                {severity === 'critical' ? 'CRITICAL ALERT' : severity === 'warning' ? 'PREDICTIVE WARNING' : 'SYSTEM NOMINAL'}
              </span>
              {riskProbability !== undefined && (
                <span className="text-xs font-mono text-slate-400">
                  Risk: <span className="font-bold text-white">{riskProbability}%</span>
                </span>
              )}
            </div>
            <h3 className={`mt-2 text-xl sm:text-2xl font-bold tracking-tight ${theme.headerColor}`}>
              {title}
            </h3>
            <p className="text-sm font-medium text-slate-300 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Diagnostic content box */}
        <div className="mt-6 space-y-3 bg-dark-900/80 rounded-xl p-4 border border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Detected Condition
            </span>
            <p className="text-sm text-slate-200 mt-1">
              {predictedIssue}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Recommended Action
            </span>
            <p className="text-sm text-slate-300 mt-1 font-medium">
              {recommendation}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold transition-all"
          >
            Dismiss
          </button>
          {onViewDetails && (
            <button
              onClick={() => {
                onClose();
                onViewDetails();
              }}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${theme.btnPrimary}`}
            >
              <span>View AI Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
