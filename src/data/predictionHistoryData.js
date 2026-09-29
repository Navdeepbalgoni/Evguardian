// Historical AI Prediction Timeline & Maintenance Log

export const predictionHistoryLogs = [
  {
    id: 'PRED-HIST-20260906-01',
    date: '6 Sep 2026, 14:48',
    prediction: 'Battery Cell Impedance Imbalance',
    subsystem: 'Battery Pack',
    risk: 'High',
    riskBadgeColor: 'rose',
    probability: 73,
    status: 'Monitoring',
    statusBadgeColor: 'amber',
    triggeredTelemetry: 'Module 03 cell delta 68 mV, localized temp 42.6°C',
    modelUsed: 'Ensemble Autoencoder (v4.2)',
    resolution: 'Active observation initiated. Driver advised to avoid fast charge.'
  },
  {
    id: 'PRED-HIST-20260904-02',
    date: '4 Sep 2026, 18:15',
    prediction: 'High Battery Thermal Gradient',
    subsystem: 'Thermal Loop',
    risk: 'Medium',
    riskBadgeColor: 'amber',
    probability: 68,
    status: 'Confirmed',
    statusBadgeColor: 'blue',
    triggeredTelemetry: 'Coolant loop delta T exceeded 8.5°C during steep incline',
    modelUsed: 'PINN Thermal Twin (v2.1)',
    resolution: 'Confirmed by telemetry review. BMS fan curve dynamically adjusted.'
  },
  {
    id: 'PRED-HIST-20260901-03',
    date: '1 Sep 2026, 09:22',
    prediction: 'Motor Stator Harmonic Anomaly',
    subsystem: 'Motor Powertrain',
    risk: 'Low',
    riskBadgeColor: 'emerald',
    probability: 22,
    status: 'Normal',
    statusBadgeColor: 'emerald',
    triggeredTelemetry: 'Transient 120 Hz vibration spike during aggressive start',
    modelUsed: 'LSTM Vibration Observer',
    resolution: 'Classified as transient wheel slip over road expansion joint.'
  },
  {
    id: 'PRED-HIST-20260826-04',
    date: '26 Aug 2026, 16:30',
    prediction: 'Regenerative Braking Torque Sag',
    subsystem: 'Inverter & Braking',
    risk: 'Medium',
    riskBadgeColor: 'amber',
    probability: 54,
    status: 'Mitigated',
    statusBadgeColor: 'cyan',
    triggeredTelemetry: 'Regen recapture power sagged 28% at 85% SOC',
    modelUsed: 'Physics Energy Twin',
    resolution: 'BMS software update recalibrated regen tapering curve.'
  },
  {
    id: 'PRED-HIST-20260818-05',
    date: '18 Aug 2026, 11:05',
    prediction: 'Auxiliary 12V Battery Degradation Risk',
    subsystem: 'Auxiliary Power',
    risk: 'Low',
    riskBadgeColor: 'emerald',
    probability: 18,
    status: 'Resolved',
    statusBadgeColor: 'emerald',
    triggeredTelemetry: 'DC-DC converter float voltage dipped to 12.8V',
    modelUsed: 'DC-DC State Observer',
    resolution: 'Terminal connection checked and cleaned during scheduled checkup.'
  }
];
