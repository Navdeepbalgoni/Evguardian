import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity, Zap, Thermometer, Gauge, Battery, Radio,
  BrainCircuit, AlertTriangle, CheckCircle2, ShieldAlert,
  TrendingUp, TrendingDown, RefreshCw, Pause, Play,
  CircleDot, Cpu, BarChart3, Timer, Wifi, WifiOff,
  AlertOctagon, ChevronRight, ArrowUpRight, ArrowDownRight,
  Waves, Flame, PlugZap, CircuitBoard, ScanLine
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell
} from 'recharts';

// ── API Configuration ────────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';

// ── Color Constants ──────────────────────────────────────────────
const COLORS = {
  cyan: '#06b6d4',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#ef4444',
  violet: '#8b5cf6',
  blue: '#3b82f6',
  pink: '#ec4899',
  teal: '#14b8a6',
};

const FAILURE_COLORS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#ef4444',
};

// ── Helper Components ────────────────────────────────────────────

const GlowDot = ({ color = 'cyan', animate = true }) => (
  <span className={`inline-block w-2 h-2 rounded-full ${animate ? 'animate-pulse' : ''}`}
    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
  />
);

const MetricCard = ({ label, value, unit, icon: Icon, color = COLORS.cyan, trend, small = false }) => {
  const isUp = trend > 0;
  return (
    <div className={`glass-panel rounded-xl border border-slate-800/60 hover:border-slate-700 transition-all duration-300 group ${small ? 'p-3' : 'p-4'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className={`p-1.5 rounded-lg border border-slate-700/50`} style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-lg font-mono font-bold text-white leading-tight group-hover:scale-[1.02] transition-transform">
        {typeof value === 'number' ? value.toFixed(1) : value}
        {unit && <span className="text-xs text-slate-400 ml-1 font-normal">{unit}</span>}
      </div>
      <div className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
};

const PredictionBadge = ({ label, value, color, isPercentage = false }) => (
  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-dark-950/50 border border-slate-800/40">
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    <span className="text-sm font-mono font-bold" style={{ color }}>
      {typeof value === 'number' ? value.toFixed(1) : value}
      {isPercentage && '%'}
    </span>
  </div>
);

// ── Main Component ───────────────────────────────────────────────
export const RealTimeMonitoringView = () => {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [simulationProfile, setSimulationProfile] = useState('healthy');
  const [currentReading, setCurrentReading] = useState(null);
  const [currentPredictions, setCurrentPredictions] = useState(null);
  const [readingHistory, setReadingHistory] = useState([]);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [tickCount, setTickCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [error, setError] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const intervalRef = useRef(null);
  const maxHistoryLength = 30;

  // ── API Connectivity Check ──────────────────────────────────────
  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        setIsConnected(true);
        setError(null);
        return true;
      }
    } catch {
      setIsConnected(false);
      setError('Backend not connected. Start the Flask API server.');
    }
    return false;
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  // ── Fetch Simulation Data ───────────────────────────────────────
  const fetchReading = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/simulate?profile=${simulationProfile}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      setCurrentReading(data.reading);
      setCurrentPredictions(data.predictions);
      setLastUpdateTime(new Date().toLocaleTimeString());
      setTickCount(prev => prev + 1);

      setReadingHistory(prev => {
        const next = [...prev, {
          tick: prev.length + 1,
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          battery_soc: data.reading.Battery_SOC,
          battery_temp: data.reading.Battery_Temperature,
          motor_temp: data.reading.Motor_Temperature,
          speed: data.reading.Vehicle_Speed,
          voltage: data.reading.Battery_Voltage,
          current: data.reading.Battery_Current,
          health_score: data.predictions.vehicle_health_score,
          battery_soh: data.predictions.battery_soh,
          est_range: data.predictions.estimated_range_km,
          anomaly_score: data.predictions.anomaly_score,
        }];
        return next.slice(-maxHistoryLength);
      });

      setPredictionHistory(prev => {
        const next = [...prev, {
          tick: prev.length + 1,
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          health: data.predictions.vehicle_health_score,
          soh: data.predictions.battery_soh,
          range: data.predictions.estimated_range_km,
          failure_high: data.predictions.failure_probabilities?.High || 0,
          failure_medium: data.predictions.failure_probabilities?.Medium || 0,
          failure_low: data.predictions.failure_probabilities?.Low || 0,
        }];
        return next.slice(-maxHistoryLength);
      });

      setError(null);
    } catch (err) {
      setError('Failed to fetch simulation data');
    }
  }, [simulationProfile]);

  // ── Streaming Control ───────────────────────────────────────────
  const startStreaming = useCallback(() => {
    if (!isConnected) return;
    setIsStreaming(true);
    fetchReading();
    intervalRef.current = setInterval(fetchReading, 3000);
  }, [isConnected, fetchReading]);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // When profile changes, reset and restart if streaming
  useEffect(() => {
    if (isStreaming) {
      stopStreaming();
      setReadingHistory([]);
      setPredictionHistory([]);
      setTickCount(0);
      setTimeout(() => startStreaming(), 200);
    }
  }, [simulationProfile]);

  // ── Derived Values ──────────────────────────────────────────────
  const riskLevel = currentPredictions?.failure_risk || 'Unknown';
  const riskColor = FAILURE_COLORS[riskLevel] || COLORS.cyan;
  const isAnomaly = currentPredictions?.is_anomaly || false;
  const healthScore = currentPredictions?.vehicle_health_score || 0;
  const failureProbs = currentPredictions?.failure_probabilities || {};

  const pieData = Object.entries(failureProbs).map(([name, value]) => ({
    name,
    value,
    color: FAILURE_COLORS[name] || COLORS.blue,
  }));

  // Health score ring percentage
  const healthPercentage = Math.min(100, Math.max(0, healthScore));
  const circumference = 2 * Math.PI * 58;
  const healthStroke = (healthPercentage / 100) * circumference;
  const healthColor = healthScore >= 85 ? COLORS.emerald : healthScore >= 70 ? COLORS.amber : COLORS.rose;

  // ── Radar Data ──────────────────────────────────────────────────
  const radarData = currentReading ? [
    { metric: 'Battery SOC', value: Math.min(100, currentReading.Battery_SOC), fullMark: 100 },
    { metric: 'Motor Eff.', value: Math.min(100, currentReading.Motor_Efficiency), fullMark: 100 },
    { metric: 'Driving Score', value: Math.min(100, currentReading.Driving_Score), fullMark: 100 },
    { metric: 'Health Score', value: Math.min(100, healthScore), fullMark: 100 },
    { metric: 'Battery SOH', value: Math.min(100, currentPredictions?.battery_soh || 0), fullMark: 100 },
    { metric: 'Range %', value: Math.min(100, ((currentPredictions?.estimated_range_km || 0) / 400) * 100), fullMark: 100 },
  ] : [];

  // ── RENDER ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in">

      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight font-mono uppercase">
                Real-Time Monitoring & AI Prediction
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Live EV Sensor Simulation → ML Model Inference → Predictive Analytics Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono font-bold ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isConnected ? 'API Connected' : 'Disconnected'}
          </div>

          {/* Profile Selector */}
          <select
            value={simulationProfile}
            onChange={(e) => setSimulationProfile(e.target.value)}
            className="bg-dark-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="healthy">🟢 Healthy Profile</option>
            <option value="warning">🟡 Warning Profile</option>
            <option value="critical">🔴 Critical Profile</option>
          </select>

          {/* Stream Toggle */}
          <button
            onClick={isStreaming ? stopStreaming : startStreaming}
            disabled={!isConnected}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              isStreaming
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-glow-cyan disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isStreaming ? 'Stop Stream' : 'Start Stream'}
          </button>

          {/* Manual Fetch */}
          <button
            onClick={fetchReading}
            disabled={!isConnected}
            className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all disabled:opacity-40"
            title="Fetch single reading"
          >
            <RefreshCw className={`w-4 h-4 ${isStreaming ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-bold">Connection Error: </span>{error}
            <p className="text-xs text-rose-400/70 mt-1">
              Run: <code className="bg-dark-950 px-2 py-0.5 rounded text-rose-300">cd backend && pip install -r requirements.txt && python app.py</code>
            </p>
          </div>
        </div>
      )}

      {/* ═══ STATUS BAR ═══ */}
      {currentReading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="glass-panel rounded-xl p-3 flex items-center gap-2.5 border border-slate-800/60">
            <CircleDot className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Readings</div>
              <div className="text-sm font-mono font-bold text-white">{tickCount}</div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-3 flex items-center gap-2.5 border border-slate-800/60">
            <Timer className="w-4 h-4 text-violet-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Last Update</div>
              <div className="text-sm font-mono font-bold text-white">{lastUpdateTime || '—'}</div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-3 flex items-center gap-2.5 border border-slate-800/60">
            <Radio className={`w-4 h-4 ${isStreaming ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Stream</div>
              <div className={`text-sm font-mono font-bold ${isStreaming ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isStreaming ? '3s interval' : 'Paused'}
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-3 flex items-center gap-2.5 border border-slate-800/60">
            <ScanLine className="w-4 h-4" style={{ color: riskColor }} />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Failure Risk</div>
              <div className="text-sm font-mono font-bold" style={{ color: riskColor }}>{riskLevel}</div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-3 flex items-center gap-2.5 border border-slate-800/60">
            <ShieldAlert className={`w-4 h-4 ${isAnomaly ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Anomaly</div>
              <div className={`text-sm font-mono font-bold ${isAnomaly ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isAnomaly ? 'DETECTED' : 'Normal'}
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-3 flex items-center gap-2.5 border border-slate-800/60">
            <Cpu className="w-4 h-4 text-teal-400" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Profile</div>
              <div className="text-sm font-mono font-bold text-white capitalize">{simulationProfile}</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MAIN GRID: Readings + AI Predictions ═══ */}
      {currentReading && currentPredictions ? (
        <>
          {/* ── AI PREDICTION HERO SECTION ── */}
          <div className={`p-6 rounded-2xl border transition-all duration-500 ${
            riskLevel === 'High'
              ? 'glass-panel-rose border-rose-500/40 shadow-glow-rose'
              : riskLevel === 'Medium'
              ? 'glass-panel-amber border-amber-500/40 shadow-glow-amber'
              : 'glass-panel-glow border-emerald-500/30 shadow-glow-emerald'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: Health Score Ring */}
              <div className="flex items-center gap-6">
                <div className="relative w-[140px] h-[140px] shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="58" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <circle cx="64" cy="64" r="58" fill="none"
                      stroke={healthColor}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - healthStroke}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                      style={{ filter: `drop-shadow(0 0 6px ${healthColor})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-mono font-bold text-white">{healthScore.toFixed(1)}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Health</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5" style={{ color: riskColor }} />
                    <h2 className="text-lg font-bold text-white uppercase font-mono tracking-tight">
                      AI Prediction Results
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 max-w-md">
                    5 ML models (XGBoost, RandomForest, LightGBM, OOF Stacking, Isolation Forest) 
                    analyzing {Object.keys(currentReading).length} sensor features in real-time
                  </p>

                  {/* Risk Indicator */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                    riskLevel === 'High'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                      : riskLevel === 'Medium'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  }`}>
                    <GlowDot color={riskColor} />
                    Failure Risk: {riskLevel} • Anomaly Score: {currentPredictions.anomaly_score}
                  </div>
                </div>
              </div>

              {/* Right: Key Prediction Metrics */}
              <div className="grid grid-cols-2 gap-3 lg:w-[320px]">
                <PredictionBadge label="Battery SOH" value={currentPredictions.battery_soh} color={COLORS.cyan} isPercentage />
                <PredictionBadge label="Est. Range" value={currentPredictions.estimated_range_km} color={COLORS.emerald} />
                <PredictionBadge label="RUL" value={`${currentPredictions.remaining_useful_life_days} days`} color={COLORS.violet} />
                <PredictionBadge label="Health" value={healthScore} color={healthColor} isPercentage={false} />
              </div>
            </div>

            {/* Preventive Measure */}
            <div className="mt-4 p-3 rounded-xl bg-dark-950/50 border border-slate-800/40 flex items-start gap-3">
              <div className={`p-1.5 rounded-lg shrink-0 ${
                riskLevel === 'High' ? 'bg-rose-500/20 text-rose-400' : 
                riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Recommended Action</div>
                <div className="text-sm text-white font-medium">{currentPredictions.preventive_measure}</div>
              </div>
            </div>
          </div>

          {/* ── LIVE SENSOR READINGS GRID ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CircuitBoard className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Live Sensor Telemetry
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                {tickCount} readings
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <MetricCard label="Battery SOC" value={currentReading.Battery_SOC} unit="%" icon={Battery} color={COLORS.cyan} />
              <MetricCard label="Battery Voltage" value={currentReading.Battery_Voltage} unit="V" icon={Zap} color={COLORS.blue} />
              <MetricCard label="Battery Current" value={currentReading.Battery_Current} unit="A" icon={PlugZap} color={COLORS.violet} />
              <MetricCard label="Battery Temp" value={currentReading.Battery_Temperature} unit="°C" icon={Thermometer} color={
                currentReading.Battery_Temperature > 45 ? COLORS.rose : currentReading.Battery_Temperature > 35 ? COLORS.amber : COLORS.teal
              } />
              <MetricCard label="Motor RPM" value={currentReading.Motor_RPM} unit="rpm" icon={Gauge} color={COLORS.pink} />
              <MetricCard label="Motor Temp" value={currentReading.Motor_Temperature} unit="°C" icon={Flame} color={
                currentReading.Motor_Temperature > 42 ? COLORS.rose : COLORS.teal
              } />
              <MetricCard label="Vehicle Speed" value={currentReading.Vehicle_Speed} unit="km/h" icon={Gauge} color={COLORS.emerald} />
              <MetricCard label="Motor Efficiency" value={currentReading.Motor_Efficiency} unit="%" icon={TrendingUp} color={COLORS.emerald} />
              <MetricCard label="Cell Imbalance" value={currentReading.Battery_Cell_Imbalance * 1000} unit="mV" icon={Waves} color={
                currentReading.Battery_Cell_Imbalance > 0.04 ? COLORS.rose : COLORS.cyan
              } />
              <MetricCard label="Internal Res." value={currentReading.Battery_Internal_Resistance * 1000} unit="mΩ" icon={CircuitBoard} color={COLORS.violet} />
              <MetricCard label="Battery Power" value={currentReading.Battery_Power_W / 1000} unit="kW" icon={Zap} color={COLORS.amber} />
              <MetricCard label="Driving Score" value={currentReading.Driving_Score} unit="/100" icon={BarChart3} color={
                currentReading.Driving_Score > 75 ? COLORS.emerald : COLORS.amber
              } />
            </div>
          </div>

          {/* ── CHARTS SECTION ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Health & SOH Trend */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/60">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Health & SOH Trend
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={readingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line type="monotone" dataKey="health_score" stroke={COLORS.cyan} strokeWidth={2} dot={false} name="Health Score" />
                  <Line type="monotone" dataKey="battery_soh" stroke={COLORS.emerald} strokeWidth={2} dot={false} name="Battery SOH" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Temperature Trend */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/60">
              <div className="flex items-center gap-2 mb-4">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Temperature Monitoring
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={readingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="battery_temp" stroke={COLORS.amber} fill={`${COLORS.amber}15`} strokeWidth={2} name="Battery °C" />
                  <Area type="monotone" dataKey="motor_temp" stroke={COLORS.rose} fill={`${COLORS.rose}15`} strokeWidth={2} name="Motor °C" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Failure Risk Distribution */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/60">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Failure Risk Distribution
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={45} outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-slate-300 font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-mono font-bold" style={{ color: item.color }}>
                        {item.value.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Radar */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/60">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Vehicle Performance Radar
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8, fill: '#475569' }} />
                  <Radar name="Performance" dataKey="value" stroke={COLORS.cyan} fill={`${COLORS.cyan}30`} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Range & Speed Trend */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/60">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Estimated Range & Speed
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={readingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="est_range" stroke={COLORS.emerald} strokeWidth={2} dot={false} name="Est. Range (km)" />
                  <Line yAxisId="right" type="monotone" dataKey="speed" stroke={COLORS.violet} strokeWidth={2} dot={false} name="Speed (km/h)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Failure Risk Probability Trend */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800/60">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Failure Probability Trend
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={predictionHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="failure_high" stackId="1" stroke={COLORS.rose} fill={`${COLORS.rose}40`} name="High %" />
                  <Area type="monotone" dataKey="failure_medium" stackId="1" stroke={COLORS.amber} fill={`${COLORS.amber}40`} name="Medium %" />
                  <Area type="monotone" dataKey="failure_low" stackId="1" stroke={COLORS.emerald} fill={`${COLORS.emerald}40`} name="Low %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── MODEL INFO SECTION ── */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/60">
            <div className="flex items-center gap-2 mb-5">
              <BrainCircuit className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                ML Models Used in Prediction Pipeline
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(currentPredictions.models_used).map(([key, desc]) => (
                <div key={key} className="p-3 rounded-xl bg-dark-950/60 border border-slate-800/40 hover:border-cyan-500/30 transition-all">
                  <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider mb-1">{key}</div>
                  <div className="text-xs text-slate-300 font-medium">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RAW SENSOR DATA TABLE ── */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Raw Sensor Data Feed
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{Object.keys(currentReading).length} features</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto rounded-xl border border-slate-800/40">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-dark-900">
                  <tr>
                    <th className="text-left py-2 px-3 text-slate-400 font-mono font-bold uppercase tracking-wider border-b border-slate-800">Sensor</th>
                    <th className="text-right py-2 px-3 text-slate-400 font-mono font-bold uppercase tracking-wider border-b border-slate-800">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(currentReading).map(([key, value], i) => (
                    <tr key={key} className={`border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors ${i % 2 === 0 ? 'bg-dark-950/30' : ''}`}>
                      <td className="py-1.5 px-3 text-slate-300 font-mono">{key}</td>
                      <td className="py-1.5 px-3 text-right text-white font-mono font-bold">
                        {typeof value === 'number' ? value.toFixed(4) : String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ── EMPTY STATE ── */
        <div className="glass-panel rounded-2xl p-12 border border-slate-800/60 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20">
            <Activity className="w-10 h-10 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-mono">Start Real-Time Simulation</h3>
          <p className="text-sm text-slate-400 max-w-md">
            Connect the Flask ML backend and click <strong>"Start Stream"</strong> to begin generating live EV 
            sensor readings and running AI predictions in real-time.
          </p>
          <div className="text-xs text-slate-500 space-y-1 font-mono">
            <p>1. <code className="bg-dark-950 px-2 py-0.5 rounded">cd backend</code></p>
            <p>2. <code className="bg-dark-950 px-2 py-0.5 rounded">pip install -r requirements.txt</code></p>
            <p>3. <code className="bg-dark-950 px-2 py-0.5 rounded">python app.py</code></p>
          </div>
          {!isConnected && (
            <button
              onClick={checkConnection}
              className="mt-4 px-6 py-2.5 bg-cyan-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-glow-cyan"
            >
              Check Connection
            </button>
          )}
        </div>
      )}
    </div>
  );
};
