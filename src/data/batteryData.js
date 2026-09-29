// Detailed Battery Digital Twin & Time-Series Datasets

export const batteryPackSpecs = {
  nominalCapacity: 64.0, // kWh
  usableCapacity: 61.5, // kWh
  nominalVoltage: 400.0, // V
  maxVoltage: 420.0, // V
  minVoltage: 340.0, // V
  chemistry: 'Lithium Iron Phosphate (LiFePO4 / LFP)',
  cellConfiguration: '108S 2P (216 Prismatic Cells)',
  coolingSystem: 'Active Liquid Glycol Thermal Loop',
  maxDischargeRate: '3C (180 kW)',
  maxChargeRate: '150 kW DC Fast'
};

// Preset-dependent battery states
export const batteryStateByPreset = {
  HEALTHY: {
    soh: 94.2, // %
    sohStatus: 'GOOD',
    sohBadgeColor: 'emerald',
    cycleCount: 242,
    chargingDurationAvg: '42 mins (10-80%)',
    internalResistance: 18.2, // mΩ
    maxCellVoltageDelta: 14, // mV (well balanced)
    coolingLoopStatus: 'Optimal (Fan 28%)',
    aiAnalysis: {
      condition: 'GOOD',
      conditionColor: 'emerald',
      summary: 'Battery temperature, internal impedance, and cell voltage variance are currently within the nominal operating envelope.',
      detailedDiagnostics: [
        'Cell voltage delta is 14 mV, well beneath the 45 mV warning threshold.',
        'Thermal dissipation efficiency is 96.4% across all 8 modules.',
        'Degradation trajectory tracks 3.2% better than typical laboratory aging curve.'
      ],
      recommendation: 'Continue standard charge schedule. Occasional balance charge to 100% recommended every 20-30 cycles.'
    }
  },

  WARNING: {
    soh: 86.4,
    sohStatus: 'MODERATE DEGRADATION',
    sohBadgeColor: 'amber',
    cycleCount: 486,
    chargingDurationAvg: '58 mins (Throttled)',
    internalResistance: 29.4,
    maxCellVoltageDelta: 68, // mV (unbalanced)
    coolingLoopStatus: 'Elevated (Pump 85%, Fan 90%)',
    aiAnalysis: {
      condition: 'WARNING',
      conditionColor: 'amber',
      summary: 'Battery temperature has elevated 7.2°C compared with historical baseline for identical ambient and road loads.',
      detailedDiagnostics: [
        'Module #3 cell group shows 68 mV sag during transient acceleration pulses.',
        'Thermal resistance in Module #3 suggests localized coolant flow restriction or contact impedance increase.',
        'Predicted capacity fade acceleration if thermal stress persists.'
      ],
      recommendation: 'Monitor temperature closely. Avoid repeated back-to-back DC fast charging and allow pack to cool before charging.'
    }
  },

  CRITICAL: {
    soh: 74.8,
    sohStatus: 'CRITICAL DEGRADATION RISK',
    sohBadgeColor: 'rose',
    cycleCount: 712,
    chargingDurationAvg: 'Derated / Incompatible with Fast Charge',
    internalResistance: 48.6,
    maxCellVoltageDelta: 185, // mV (severe fault)
    coolingLoopStatus: 'Maximum Effort (Warning: Thermal Runaway Margin Low)',
    aiAnalysis: {
      condition: 'CRITICAL',
      conditionColor: 'rose',
      summary: 'Severe cell voltage imbalance and rapid temperature escalation detected. Anomaly score 0.89 exceeds critical threshold.',
      detailedDiagnostics: [
        'Cell #22 in Module #3 exhibiting severe internal resistance spike (48.6 mΩ).',
        'Localized temperature delta is 16.2°C higher than neighboring cells.',
        'High probability of micro-shorting or severe electrolyte degradation.'
      ],
      recommendation: 'Immediate technician inspection required. Power derating engaged. Limit vehicle usage to avoid catastrophic thermal runaway.'
    }
  }
};

// 16-Cell Matrix representation for pack visualizer
export const getCellMatrixData = (preset = 'HEALTHY') => {
  const baseVolt = preset === 'CRITICAL' ? 3.42 : preset === 'WARNING' ? 3.65 : 3.82;
  const baseTemp = preset === 'CRITICAL' ? 56 : preset === 'WARNING' ? 41 : 31;
  
  return Array.from({ length: 16 }, (_, i) => {
    const isAnomalyCell = i === 6 || i === 7;
    let voltage = baseVolt + (Math.sin(i) * 0.012);
    let temp = baseTemp + (Math.cos(i) * 1.2);
    let status = 'nominal';

    if (isAnomalyCell && preset === 'WARNING') {
      voltage -= 0.065;
      temp += 6.5;
      status = 'warning';
    } else if (isAnomalyCell && preset === 'CRITICAL') {
      voltage -= 0.185;
      temp += 16.8;
      status = 'critical';
    }

    return {
      cellId: `C-${(i + 1).toString().padStart(2, '0')}`,
      module: Math.floor(i / 4) + 1,
      voltage: parseFloat(voltage.toFixed(3)),
      temperature: parseFloat(temp.toFixed(1)),
      status
    };
  });
};

// 1. SOC vs Time (Past 24 Hours / Driving Session)
export const socTimeSeries = [
  { time: '08:00', soc: 92, healthySOC: 92, currentSOC: 92 },
  { time: '09:00', soc: 86, healthySOC: 87, currentSOC: 85 },
  { time: '10:00', soc: 78, healthySOC: 81, currentSOC: 76 },
  { time: '11:00', soc: 72, healthySOC: 75, currentSOC: 68 },
  { time: '12:00', soc: 65, healthySOC: 69, currentSOC: 61 },
  { time: '13:00', soc: 65, healthySOC: 69, currentSOC: 61 }, // Idle
  { time: '14:00', soc: 58, healthySOC: 63, currentSOC: 52 },
  { time: '15:00', soc: 51, healthySOC: 57, currentSOC: 44 },
  { time: '16:00', soc: 46, healthySOC: 52, currentSOC: 38 },
  { time: '17:00', soc: 78, healthySOC: 82, currentSOC: 72 }, // Quick charge
  { time: '18:00', soc: 74, healthySOC: 78, currentSOC: 66 },
  { time: '19:00', soc: 68, healthySOC: 73, currentSOC: 58 }
];

// 2. Battery Temperature vs Time (°C) with threshold markers
export const tempTimeSeries = [
  { time: '08:00', packTemp: 28.5, maxCellTemp: 29.2, ambient: 26.0, safeLimit: 45 },
  { time: '09:00', packTemp: 30.1, maxCellTemp: 31.4, ambient: 27.5, safeLimit: 45 },
  { time: '10:00', packTemp: 32.4, maxCellTemp: 34.1, ambient: 29.0, safeLimit: 45 },
  { time: '11:00', packTemp: 34.6, maxCellTemp: 37.2, ambient: 30.5, safeLimit: 45 },
  { time: '12:00', packTemp: 35.8, maxCellTemp: 39.5, ambient: 31.2, safeLimit: 45 },
  { time: '13:00', packTemp: 33.2, maxCellTemp: 35.0, ambient: 31.5, safeLimit: 45 },
  { time: '14:00', packTemp: 38.4, maxCellTemp: 43.1, ambient: 32.0, safeLimit: 45 },
  { time: '15:00', packTemp: 41.2, maxCellTemp: 47.8, ambient: 32.5, safeLimit: 45 },
  { time: '16:00', packTemp: 42.6, maxCellTemp: 51.4, ambient: 32.0, safeLimit: 45 },
  { time: '17:00', packTemp: 44.8, maxCellTemp: 54.2, ambient: 31.0, safeLimit: 45 },
  { time: '18:00', packTemp: 41.5, maxCellTemp: 49.0, ambient: 29.5, safeLimit: 45 },
  { time: '19:00', packTemp: 38.2, maxCellTemp: 44.3, ambient: 28.0, safeLimit: 45 }
];

// 3. Voltage vs Time (V)
export const voltageTimeSeries = [
  { time: '08:00', voltage: 408.2, target: 408.0 },
  { time: '09:00', voltage: 402.6, target: 404.0 },
  { time: '10:00', voltage: 396.4, target: 399.0 },
  { time: '11:00', voltage: 391.8, target: 394.0 },
  { time: '12:00', voltage: 388.5, target: 390.0 },
  { time: '13:00', voltage: 388.4, target: 390.0 },
  { time: '14:00', voltage: 382.1, target: 386.0 },
  { time: '15:00', voltage: 376.5, target: 382.0 },
  { time: '16:00', voltage: 371.2, target: 378.0 },
  { time: '17:00', voltage: 402.0, target: 405.0 },
  { time: '18:00', voltage: 397.4, target: 401.0 },
  { time: '19:00', voltage: 392.1, target: 396.0 }
];

// 4. Current vs Time (A) (Discharge > 0, Regen/Charge < 0)
export const currentTimeSeries = [
  { time: '10:00', current: 24, regen: 0 },
  { time: '10:10', current: 78, regen: 0 },
  { time: '10:20', current: -32, regen: 32 },
  { time: '10:30', current: 45, regen: 0 },
  { time: '10:40', current: 110, regen: 0 },
  { time: '10:50', current: -48, regen: 48 },
  { time: '11:00', current: 36, regen: 0 },
  { time: '11:10', current: 85, regen: 0 },
  { time: '11:20', current: -18, regen: 18 },
  { time: '11:30', current: 52, regen: 0 },
  { time: '11:40', current: 124, regen: 0 },
  { time: '11:50', current: -38, regen: 38 }
];

// 5. Battery Degradation & Capacity Forecast (Historical vs AI Predicted)
export const degradationTrendSeries = [
  { month: 'Month 0', actualCapacity: 64.0, predictedCapacity: 64.0, baselineIdeal: 64.0 },
  { month: 'Month 3', actualCapacity: 63.4, predictedCapacity: 63.5, baselineIdeal: 63.7 },
  { month: 'Month 6', actualCapacity: 62.8, predictedCapacity: 62.9, baselineIdeal: 63.4 },
  { month: 'Month 9', actualCapacity: 62.1, predictedCapacity: 62.2, baselineIdeal: 63.1 },
  { month: 'Month 12', actualCapacity: 61.4, predictedCapacity: 61.5, baselineIdeal: 62.8 },
  { month: 'Month 15', actualCapacity: 60.6, predictedCapacity: 60.7, baselineIdeal: 62.5 },
  { month: 'Month 18 (Now)', actualCapacity: 59.8, predictedCapacity: 59.8, baselineIdeal: 62.2 },
  { month: 'Month 21 (Proj)', actualCapacity: null, predictedCapacity: 58.9, baselineIdeal: 61.9 },
  { month: 'Month 24 (Proj)', actualCapacity: null, predictedCapacity: 57.8, baselineIdeal: 61.6 },
  { month: 'Month 27 (Proj)', actualCapacity: null, predictedCapacity: 56.6, baselineIdeal: 61.3 },
  { month: 'Month 30 (Proj)', actualCapacity: null, predictedCapacity: 55.2, baselineIdeal: 61.0 }
];
