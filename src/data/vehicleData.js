// Vehicle specs and simulation state datasets
export const defaultVehicleProfile = {
  id: 'EV-8842-TWIN',
  name: 'Aetherion Pulse 4X',
  model: 'Apex Performance EV',
  type: 'Electric 4-Wheeler',
  batteryCapacity: '64 kWh',
  batteryChemistry: 'LiFePO4 (LFP)',
  manufacturingYear: 2025,
  vin: '9B2EV4X89J2049182',
  bmsFirmware: 'v4.12.0-PROD',
  telemetryFrequency: '10 Hz',
  status: 'Online',
  lastSync: 'Just now'
};

export const vehicleStatePresets = {
  HEALTHY: {
    statusKey: 'HEALTHY',
    statusLabel: 'HEALTHY',
    statusBadgeColor: 'emerald',
    overallHealth: 94,
    healthMessage: 'All vehicle and powertrain subsystems operating within nominal design envelope.',
    quickAlert: {
      severity: 'healthy',
      title: 'Nominal Operation',
      message: 'No abnormal thermal or electrical variances detected across 48 telemetry streams.'
    },
    batteryHealth: 94,
    batteryTrend: '+0.2% vs baseline',
    motorHealth: 92,
    motorTrend: 'Nominal efficiency',
    temperature: 31.4,
    tempStatus: 'Optimal',
    remainingRange: 142,
    rangeTrend: '+4 km projected',
    
    // 12 Live parameters
    liveParameters: {
      soc: { label: 'State of Charge (SOC)', value: 78, unit: '%', status: 'optimal', min: 20, max: 95 },
      capacity: { label: 'Battery Capacity', value: 62.8, unit: 'kWh', status: 'optimal', min: 50, max: 64 },
      voltage: { label: 'Pack Voltage', value: 398.4, unit: 'V', status: 'optimal', min: 360, max: 415 },
      current: { label: 'Discharge Current', value: 38.2, unit: 'A', status: 'optimal', min: -120, max: 220 },
      temperature: { label: 'Battery Temperature', value: 31.4, unit: '°C', status: 'optimal', min: 20, max: 42 },
      speed: { label: 'Vehicle Speed', value: 54, unit: 'km/h', status: 'normal', min: 0, max: 150 },
      acceleration: { label: 'Acceleration', value: 1.4, unit: 'm/s²', status: 'smooth', min: -5, max: 5 },
      energyConsumption: { label: 'Energy Consumption', value: 138, unit: 'Wh/km', status: 'efficient', min: 110, max: 210 },
      regenerativeBraking: { label: 'Regenerative Braking', value: 24.5, unit: 'kW', status: 'active', min: 0, max: 45 },
      slope: { label: 'Road Gradient / Slope', value: 1.8, unit: '°', status: 'mild', min: -15, max: 15 },
      distanceTravelled: { label: 'Distance Travelled (Today)', value: 46.8, unit: 'km', status: 'nominal', min: 0, max: 500 },
      remainingRange: { label: 'Remaining Range', value: 142, unit: 'km', status: 'healthy', min: 0, max: 400 }
    },

    // Vehicle Health Page metrics
    motorMetrics: {
      temperature: '54.2 °C',
      rpm: '4,850 RPM',
      load: '34%',
      energyConsumption: '12.4 kWh/100km',
      accelerationResponse: '98 ms',
      vibrationLevel: '0.12 g (Very Low)',
      inverterEfficiency: '97.2%'
    },
    performanceMetrics: {
      energyEfficiency: '94.8%',
      averageSpeed: '42 km/h',
      energyPerKm: '138 Wh/km',
      regenEfficiency: '89.4%',
      rangeEfficiency: '96.2%'
    },
    operationalMetrics: {
      drivingBehaviour: 'Smooth (Eco-Balanced)',
      temperatureBehaviour: 'Uniform distribution',
      consumptionPattern: 'Steady cruising load',
      abnormalEventsCount: 0
    }
  },

  WARNING: {
    statusKey: 'WARNING',
    statusLabel: 'WARNING',
    statusBadgeColor: 'amber',
    overallHealth: 76,
    healthMessage: 'Abnormal thermal & cell resistance variance detected. Proactive monitoring recommended.',
    quickAlert: {
      severity: 'warning',
      title: 'Thermal Drift Detected',
      message: 'Battery module 03 temperature has risen 7.2°C above pack average during cruising.'
    },
    batteryHealth: 78,
    batteryTrend: '-2.8% degradation pace',
    motorHealth: 82,
    motorTrend: 'Mild thermal rise',
    temperature: 42.6,
    tempStatus: 'Elevated',
    remainingRange: 108,
    rangeTrend: '-14 km estimated loss',
    
    liveParameters: {
      soc: { label: 'State of Charge (SOC)', value: 58, unit: '%', status: 'moderate', min: 20, max: 95 },
      capacity: { label: 'Battery Capacity', value: 58.4, unit: 'kWh', status: 'warning', min: 50, max: 64 },
      voltage: { label: 'Pack Voltage', value: 382.1, unit: 'V', status: 'sag', min: 360, max: 415 },
      current: { label: 'Discharge Current', value: 64.8, unit: 'A', status: 'elevated', min: -120, max: 220 },
      temperature: { label: 'Battery Temperature', value: 42.6, unit: '°C', status: 'warning', min: 20, max: 42 },
      speed: { label: 'Vehicle Speed', value: 68, unit: 'km/h', status: 'normal', min: 0, max: 150 },
      acceleration: { label: 'Acceleration', value: 2.6, unit: 'm/s²', status: 'frequent_spikes', min: -5, max: 5 },
      energyConsumption: { label: 'Energy Consumption', value: 176, unit: 'Wh/km', status: 'high', min: 110, max: 210 },
      regenerativeBraking: { label: 'Regenerative Braking', value: 16.2, unit: 'kW', status: 'degraded', min: 0, max: 45 },
      slope: { label: 'Road Gradient / Slope', value: 3.2, unit: '°', status: 'moderate', min: -15, max: 15 },
      distanceTravelled: { label: 'Distance Travelled (Today)', value: 62.4, unit: 'km', status: 'nominal', min: 0, max: 500 },
      remainingRange: { label: 'Remaining Range', value: 108, unit: 'km', status: 'restricted', min: 0, max: 400 }
    },

    motorMetrics: {
      temperature: '68.4 °C',
      rpm: '5,920 RPM',
      load: '58%',
      energyConsumption: '15.8 kWh/100km',
      accelerationResponse: '135 ms',
      vibrationLevel: '0.38 g (Elevated)',
      inverterEfficiency: '92.1%'
    },
    performanceMetrics: {
      energyEfficiency: '81.2%',
      averageSpeed: '48 km/h',
      energyPerKm: '176 Wh/km',
      regenEfficiency: '72.6%',
      rangeEfficiency: '79.0%'
    },
    operationalMetrics: {
      drivingBehaviour: 'Aggressive acceleration patterns',
      temperatureBehaviour: 'Localized hotspot on Module #3',
      consumptionPattern: 'High transient load peaks',
      abnormalEventsCount: 3
    }
  },

  CRITICAL: {
    statusKey: 'CRITICAL',
    statusLabel: 'CRITICAL',
    statusBadgeColor: 'rose',
    overallHealth: 52,
    healthMessage: 'High probability of severe battery cell fault. Preventive inspection urgently recommended.',
    quickAlert: {
      severity: 'critical',
      title: '🚨 High Battery Fault Risk Detected',
      message: 'Severe cell voltage imbalance (185 mV) and rapid temperature escalation (58.4°C).'
    },
    batteryHealth: 54,
    batteryTrend: '-8.4% severe anomaly',
    motorHealth: 65,
    motorTrend: 'Thermal derating active',
    temperature: 58.4,
    tempStatus: 'Critical Overheat',
    remainingRange: 74,
    rangeTrend: '-38 km severe loss',
    
    liveParameters: {
      soc: { label: 'State of Charge (SOC)', value: 41, unit: '%', status: 'critical', min: 20, max: 95 },
      capacity: { label: 'Battery Capacity', value: 51.2, unit: 'kWh', status: 'critical', min: 50, max: 64 },
      voltage: { label: 'Pack Voltage', value: 364.5, unit: 'V', status: 'unstable', min: 360, max: 415 },
      current: { label: 'Discharge Current', value: 92.4, unit: 'A', status: 'derated', min: -120, max: 220 },
      temperature: { label: 'Battery Temperature', value: 58.4, unit: '°C', status: 'critical', min: 20, max: 42 },
      speed: { label: 'Vehicle Speed', value: 42, unit: 'km/h', status: 'limp_mode', min: 0, max: 150 },
      acceleration: { label: 'Acceleration', value: 0.8, unit: 'm/s²', status: 'throttled', min: -5, max: 5 },
      energyConsumption: { label: 'Energy Consumption', value: 218, unit: 'Wh/km', status: 'severe', min: 110, max: 210 },
      regenerativeBraking: { label: 'Regenerative Braking', value: 6.4, unit: 'kW', status: 'restricted', min: 0, max: 45 },
      slope: { label: 'Road Gradient / Slope', value: 2.1, unit: '°', status: 'mild', min: -15, max: 15 },
      distanceTravelled: { label: 'Distance Travelled (Today)', value: 78.1, unit: 'km', status: 'nominal', min: 0, max: 500 },
      remainingRange: { label: 'Remaining Range', value: 74, unit: 'km', status: 'critical', min: 0, max: 400 }
    },

    motorMetrics: {
      temperature: '84.8 °C',
      rpm: '3,800 RPM (Limited)',
      load: '78%',
      energyConsumption: '19.4 kWh/100km',
      accelerationResponse: '280 ms',
      vibrationLevel: '0.74 g (Anomalous)',
      inverterEfficiency: '84.6%'
    },
    performanceMetrics: {
      energyEfficiency: '62.4%',
      averageSpeed: '36 km/h',
      energyPerKm: '218 Wh/km',
      regenEfficiency: '46.1%',
      rangeEfficiency: '59.3%'
    },
    operationalMetrics: {
      drivingBehaviour: 'Powertrain derated for thermal safety',
      temperatureBehaviour: 'Severe runaway gradient (>14°C delta)',
      consumptionPattern: 'Continuous high internal impedance loss',
      abnormalEventsCount: 8
    }
  }
};
