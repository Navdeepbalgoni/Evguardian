import React from 'react';
import { X, AlertTriangle, ShieldCheck, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { RiskIndicator } from '../common/RiskIndicator';

export const FaultDetailModal = ({ fault, onClose }) => {
  if (!fault) return null;

  const isHighRisk = fault.riskLevel === 'HIGH' || fault.probability >= 70;
  const isMedRisk = fault.riskLevel === 'MEDIUM' || (fault.probability >= 30 && fault.probability < 70);

  let themeHeader = 'text-emerald-400';
  let themeBorder = 'border-emerald-500/30';
  if (isHighRisk) {
    themeHeader = 'text-rose-400';
    themeBorder = 'border-rose-500/40';
  } else if (isMedRisk) {
    themeHeader = 'text-amber-400';
    themeBorder = 'border-amber-500/40';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-2xl rounded-2xl glass-panel p-6 sm:p-8 border ${themeBorder} shadow-2xl max-h-[90vh] overflow-y-auto`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Title & Risk Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              AI Diagnostic Observer • Deep Dive
            </span>
            <h2 className={`text-2xl font-bold tracking-tight mt-1 ${themeHeader}`}>
              {fault.title}
            </h2>
          </div>
          <div>
            <RiskIndicator level={fault.riskLevel} probability={fault.probability} size="md" />
          </div>
        </div>

        {/* Probability Metric Bar */}
        <div className="mt-5 p-4 rounded-xl bg-dark-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">Predicted Fault Probability:</span>
            <span className="text-base font-bold text-white">{fault.probability}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isHighRisk ? 'bg-rose-500' : isMedRisk ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${fault.probability}%` }}
            />
          </div>
        </div>

        {/* Detected Abnormal Parameters */}
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Detected Abnormal Parameters</span>
          </h4>
          {fault.detectedAbnormalParameters && fault.detectedAbnormalParameters.length > 0 ? (
            <div className="space-y-2">
              {fault.detectedAbnormalParameters.map((param, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200"
                >
                  <span className="font-semibold">{param}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Anomalous Variance
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero abnormal parameters detected. All signals within 3-sigma tolerance.</span>
            </div>
          )}
        </div>

        {/* Engineering AI Explanation */}
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Model Explanation & Signal Attribution
          </h4>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs leading-relaxed text-slate-300">
            {fault.aiExplanation}
          </div>
        </div>

        {/* SHAP-Style Feature Contribution Analysis */}
        {fault.featureImportance && fault.featureImportance.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Feature Anomaly Contribution (SHAP Attribution)</span>
            </h4>
            <div className="space-y-2 bg-dark-900/60 p-4 rounded-xl border border-slate-800">
              {fault.featureImportance.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.feature}</span>
                    <span className="font-mono text-slate-400 font-semibold">{item.contribution}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.direction === 'negative'
                          ? 'bg-rose-500'
                          : item.direction === 'positive'
                          ? 'bg-emerald-400'
                          : 'bg-cyan-400'
                      }`}
                      style={{ width: `${item.contribution}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Action */}
        <div className="mt-5 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Proactive Engineering Recommendation
          </span>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
            {fault.recommendedAction}
          </p>
        </div>

        {/* Model Architecture Metadata */}
        {fault.modelMetadata && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
            <div>Model: <span className="text-slate-200">{fault.modelMetadata.algorithm}</span></div>
            <div>Inference: <span className="text-cyan-400">{fault.modelMetadata.inferenceLatency}</span></div>
            <div>Confidence: <span className="text-emerald-400">{fault.modelMetadata.confidenceInterval}</span></div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
