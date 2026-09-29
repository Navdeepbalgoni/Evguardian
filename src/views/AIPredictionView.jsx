import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { RiskIndicator } from '../components/common/RiskIndicator';
import { DigitalTwinPipeline } from '../components/common/DigitalTwinPipeline';
import { FaultDetailModal } from '../components/modules/FaultDetailModal';
import { 
  BrainCircuit, 
  ShieldAlert, 
  BatteryCharging, 
  Car, 
  Activity, 
  Gauge, 
  ArrowRight, 
  Info, 
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2
} from 'lucide-react';

export const AIPredictionView = () => {
  const { currentPredictionState, simulationPreset, selectedFaultDetail, setSelectedFaultDetail } = useVehicle();
  const { overallRisk, faults } = currentPredictionState;

  const iconMapping = {
    battery: BatteryCharging,
    motor: Car,
    performance: Activity,
    operational: Gauge
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Core Machine Learning Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            AI FAULT PREDICTION
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Predict vehicle faults before they become failures using physics-informed anomaly observers.
          </p>
        </div>

        <div>
          <RiskIndicator level={overallRisk.level} probability={overallRisk.probability} size="md" />
        </div>
      </div>

      {/* Digital Twin Pipeline Stepper */}
      <DigitalTwinPipeline
        currentStage={overallRisk.level === 'HIGH' ? 6 : overallRisk.level === 'MEDIUM' ? 5 : 4}
        latency="14.2 ms"
      />

      {/* Overall Risk Banner Card */}
      <div className={`p-6 rounded-2xl border transition-all ${
        overallRisk.level === 'HIGH'
          ? 'glass-panel-rose border-rose-500/40 shadow-glow-rose'
          : overallRisk.level === 'MEDIUM'
          ? 'glass-panel-amber border-amber-500/40 shadow-glow-amber'
          : 'glass-panel border-cyan-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Aggregated Risk Assessment
            </span>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {overallRisk.statusLabel}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {overallRisk.tagline}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center p-3 rounded-xl bg-dark-900/80 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Overall Risk</span>
              <span className={`text-2xl sm:text-3xl font-mono font-bold ${
                overallRisk.level === 'HIGH' ? 'text-rose-400' : overallRisk.level === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {overallRisk.probability}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Prediction Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faults.map((fault) => {
          const Icon = iconMapping[fault.id] || BrainCircuit;
          const isHigh = fault.riskLevel === 'HIGH' || fault.probability >= 70;
          const isMed = fault.riskLevel === 'MEDIUM' || (fault.probability >= 30 && fault.probability < 70);

          let cardBorder = 'border-slate-800 hover:border-cyan-500/40';
          let progressColor = 'bg-emerald-400';
          let badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

          if (isHigh) {
            cardBorder = 'border-rose-500/40 hover:border-rose-500/70 shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]';
            progressColor = 'bg-rose-500';
            badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          } else if (isMed) {
            cardBorder = 'border-amber-500/40 hover:border-amber-500/70 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]';
            progressColor = 'bg-amber-400';
            badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
          }

          return (
            <div
              key={fault.id}
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${cardBorder}`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {fault.title}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        Model: {fault.modelMetadata?.algorithm.split(' ')[0] || 'Ensemble'}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${badgeClass}`}>
                    {fault.riskLevel} RISK
                  </span>
                </div>

                {/* Probability Meter */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-400">Risk Probability:</span>
                    <span className="text-base font-bold text-white">{fault.probability}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${fault.probability}%` }}
                    />
                  </div>
                </div>

                {/* Short explanation */}
                <p className="text-xs text-slate-300 mt-4 line-clamp-2 leading-relaxed">
                  {fault.shortExplanation}
                </p>

                {/* Abnormal parameters badges snippet */}
                {fault.detectedAbnormalParameters && fault.detectedAbnormalParameters.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {fault.detectedAbnormalParameters.map((param, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-dark-900 border border-amber-500/30 text-amber-300">
                        ⚠ {param}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Confidence: {fault.modelMetadata?.confidenceInterval || '98%'}
                </span>

                <button
                  onClick={() => setSelectedFaultDetail(fault)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/40 border border-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engineering Architecture & Scientific Methodology Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white font-mono uppercase">
            Predictive Maintenance Algorithm Specification
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-cyan-400 font-mono block uppercase">1. Unsupervised Outlier Extraction</span>
            <p className="text-slate-300 leading-relaxed">
              Autoencoders reconstruct multidimensional CAN bus streams. High reconstruction error residual (&gt;3σ) flags anomalous electrochemical or thermal drift.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-emerald-400 font-mono block uppercase">2. Time-To-Failure RUL Forecasting</span>
            <p className="text-slate-300 leading-relaxed">
              LSTM recurrent networks evaluate sequential degradation patterns, projecting remaining safe operational hours before thermal runaway or irreversible cell degradation occurs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-900/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-amber-400 font-mono block uppercase">3. Explainable AI (SHAP Contributions)</span>
            <p className="text-slate-300 leading-relaxed">
              Shapley Additive Explanations decompose the prediction into constituent sensor contributions, isolating exact cell modules or stator windings requiring maintenance.
            </p>
          </div>
        </div>
      </div>

      {/* Fault Detail Deep-Dive Modal */}
      {selectedFaultDetail && (
        <FaultDetailModal
          fault={selectedFaultDetail}
          onClose={() => setSelectedFaultDetail(null)}
        />
      )}
    </div>
  );
};
