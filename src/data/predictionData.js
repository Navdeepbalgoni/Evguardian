// AI Fault Prediction Data Models & State Presets

export const faultDomainsMeta = [
  { id: 'battery', name: 'Battery Fault', key: 'battery' },
  { id: 'motor', name: 'Motor Fault', key: 'motor' },
  { id: 'performance', name: 'Performance Fault', key: 'performance' },
  { id: 'operational', name: 'Operational Fault', key: 'operational' },
];

export const predictionPresets = {
  HEALTHY: {
    overallRisk: {
      level: 'LOW',
      probability: 14,
      statusLabel: 'NORMAL',
      color: 'emerald',
      tagline: 'No immediate fault predicted. Powertrain telemetry nominal.',
      headline: 'Digital Twin is operating in stable equilibrium across all subsystem observers.'
    },
    faults: [
      {
        id: 'battery',
        title: 'Battery Fault Risk',
        probability: 12,
        riskLevel: 'LOW',
        color: 'emerald',
        shortExplanation: 'Cell voltages and pack temperatures are uniformly distributed within ±1.2%.',
        detectedAbnormalParameters: [],
        aiExplanation: 'Statistical distribution of cell voltages shows zero significant divergence from the baseline electrochemical model. Internal impedance metrics remain well below aging escalation bounds.',
        recommendedAction: 'No maintenance action required. Continue standard operational and charging schedule.',
        featureImportance: [
          { feature: 'Cell Temperature Gradient', contribution: 4, direction: 'neutral' },
          { feature: 'Transient Voltage Sag', contribution: 3, direction: 'neutral' },
          { feature: 'Coulombic Efficiency', contribution: 3, direction: 'positive' },
          { feature: 'Coolant Flow Uniformity', contribution: 2, direction: 'positive' }
        ],
        modelMetadata: {
          algorithm: 'Ensemble Autoencoder + Isolation Forest',
          inferenceLatency: '14.2 ms',
          confidenceInterval: '97.4%'
        }
      },
      {
        id: 'motor',
        title: 'Motor Fault Risk',
        probability: 11,
        riskLevel: 'LOW',
        color: 'emerald',
        shortExplanation: 'Stator winding temperature and vibration harmonics conform to ISO 10816 standards.',
        detectedAbnormalParameters: [],
        aiExplanation: 'Spectral vibration harmonics show no signs of bearing wear or rotor eccentricity. Thermal dissipation matches inverter current curves exactly.',
        recommendedAction: 'Regular scheduled inspection during next annual service check.',
        featureImportance: [
          { feature: 'FFT Vibration Harmonic 2x', contribution: 4, direction: 'neutral' },
          { feature: 'Winding Temperature Delta', contribution: 3, direction: 'neutral' },
          { feature: 'Inverter Switching Loss', contribution: 2, direction: 'positive' },
          { feature: 'Torque Ripple Coefficient', contribution: 2, direction: 'positive' }
        ],
        modelMetadata: {
          algorithm: 'LSTM Recurrent Neural Network (Motor Observer)',
          inferenceLatency: '11.8 ms',
          confidenceInterval: '98.1%'
        }
      },
      {
        id: 'performance',
        title: 'Performance Fault Risk',
        probability: 9,
        riskLevel: 'LOW',
        color: 'emerald',
        shortExplanation: 'Specific energy consumption (138 Wh/km) matches route aerodynamic models.',
        detectedAbnormalParameters: [],
        aiExplanation: 'Regenerative braking energy recovery is operating at 89.4% thermodynamic efficiency with zero slip anomaly or mechanical drag detectability.',
        recommendedAction: 'Drive profile is currently optimal. Maintain balanced tire pressures.',
        featureImportance: [
          { feature: 'Aerodynamic Drag Coefficient', contribution: 3, direction: 'neutral' },
          { feature: 'Regen Power Recovery Ratio', contribution: 3, direction: 'positive' },
          { feature: 'Drivetrain Mechanical Loss', contribution: 2, direction: 'positive' },
          { feature: 'Thermal Loop Parasitic Draw', contribution: 1, direction: 'neutral' }
        ],
        modelMetadata: {
          algorithm: 'Physics-Informed Neural Network (PINN Energy Twin)',
          inferenceLatency: '16.5 ms',
          confidenceInterval: '96.8%'
        }
      },
      {
        id: 'operational',
        title: 'Operational Fault Risk',
        probability: 8,
        riskLevel: 'LOW',
        color: 'emerald',
        shortExplanation: 'Driver torque requests and braking gradients are within calm comfort thresholds.',
        detectedAbnormalParameters: [],
        aiExplanation: 'No aggressive pedal transitions, excessive thermal cycling, or continuous high-C-rate discharge bursts observed over past 250 km.',
        recommendedAction: 'Maintain current smooth driving behavior.',
        featureImportance: [
          { feature: 'Harsh Acceleration Frequency', contribution: 2, direction: 'positive' },
          { feature: 'Continuous High-Discharge Duration', contribution: 3, direction: 'neutral' },
          { feature: 'Thermal Shock Exposure Count', contribution: 2, direction: 'positive' },
          { feature: 'Grade Load Compensation', contribution: 1, direction: 'neutral' }
        ],
        modelMetadata: {
          algorithm: 'Behavioral Clustering + Markov Decision Observer',
          inferenceLatency: '9.4 ms',
          confidenceInterval: '99.0%'
        }
      }
    ]
  },

  WARNING: {
    overallRisk: {
      level: 'MEDIUM',
      probability: 73,
      statusLabel: 'BATTERY FAULT RISK DETECTED',
      color: 'amber',
      tagline: 'Abnormal battery behaviour detected. Thermal escalation requires monitoring.',
      headline: 'Predicted Issue: Module 03 localized impedance anomaly and temperature gradient.'
    },
    faults: [
      {
        id: 'battery',
        title: 'Battery Fault Risk',
        probability: 73,
        riskLevel: 'HIGH',
        color: 'amber',
        shortExplanation: 'Abnormal battery behaviour: Module 03 temperature is 7.2°C above pack average.',
        detectedAbnormalParameters: [
          'Module 03 Cell Temperature Gradient (+7.2°C)',
          'Voltage Sag Variation (68 mV during 45 kW load)',
          'Elevated Internal DC Resistance (29.4 mΩ)'
        ],
        aiExplanation: 'Recent vehicle telemetry differs from the normal operating pattern. Autoencoder anomaly reconstruction residual exceeded 3-sigma tolerance on Module 03 thermal sensors.',
        recommendedAction: 'Schedule battery inspection and avoid consecutive DC fast charging sessions. Continue telemetry monitoring.',
        featureImportance: [
          { feature: 'Cell Temperature Gradient (Mod #3)', contribution: 38, direction: 'negative' },
          { feature: 'Voltage Sag Under Load', contribution: 26, direction: 'negative' },
          { feature: 'Internal Resistance Escalation', contribution: 21, direction: 'negative' },
          { feature: 'Ambient Disparity Metric', contribution: 15, direction: 'neutral' }
        ],
        modelMetadata: {
          algorithm: 'Ensemble Autoencoder + Isolation Forest',
          inferenceLatency: '15.1 ms',
          confidenceInterval: '94.2%'
        }
      },
      {
        id: 'motor',
        title: 'Motor Fault Risk',
        probability: 18,
        riskLevel: 'LOW',
        color: 'emerald',
        shortExplanation: 'Motor temperatures slight rise due to elevated ambient road conditions.',
        detectedAbnormalParameters: [
          'Transient Stator Core Temperature (+4.1°C)'
        ],
        aiExplanation: 'Minor thermal rise detected during sustained incline, but winding resistance and vibration spectra remain safely within normal baseline.',
        recommendedAction: 'Continue observation during long uphill routes.',
        featureImportance: [
          { feature: 'Winding Temperature Delta', contribution: 10, direction: 'negative' },
          { feature: 'Torque Demand Peak', contribution: 5, direction: 'neutral' },
          { feature: 'Inverter Thermal Margin', contribution: 3, direction: 'positive' }
        ],
        modelMetadata: {
          algorithm: 'LSTM Recurrent Neural Network (Motor Observer)',
          inferenceLatency: '12.4 ms',
          confidenceInterval: '96.5%'
        }
      },
      {
        id: 'performance',
        title: 'Performance Fault Risk',
        probability: 31,
        riskLevel: 'MEDIUM',
        color: 'amber',
        shortExplanation: 'Energy consumption elevated to 176 Wh/km (27% above route expectation).',
        detectedAbnormalParameters: [
          'High Specific Energy Consumption (176 Wh/km)',
          'Reduced Regen Energy Recovery (16.2 kW peak)'
        ],
        aiExplanation: 'Increased rolling resistance or partial thermal loop pump power drain is consuming supplemental energy. Regenerative braking recovery is mildly restricted due to high pack temperature.',
        recommendedAction: 'Check tire pressures and verify cooling loop pump operational pressure.',
        featureImportance: [
          { feature: 'Parasitic Cooling Fan Load', contribution: 14, direction: 'negative' },
          { feature: 'Regen Limitation Flag', contribution: 11, direction: 'negative' },
          { feature: 'Aerodynamic Drag Profile', contribution: 6, direction: 'neutral' }
        ],
        modelMetadata: {
          algorithm: 'Physics-Informed Neural Network (PINN Energy Twin)',
          inferenceLatency: '17.0 ms',
          confidenceInterval: '93.7%'
        }
      },
      {
        id: 'operational',
        title: 'Operational Fault Risk',
        probability: 26,
        riskLevel: 'LOW',
        color: 'emerald',
        shortExplanation: 'Frequent abrupt accelerations recorded in recent 30-minute window.',
        detectedAbnormalParameters: [
          'Harsh Acceleration Events (> 2.5 m/s²)'
        ],
        aiExplanation: 'Driver behavior demonstrates rapid throttle inputs that coincide with the thermal spikes observed in the battery pack.',
        recommendedAction: 'Adopt progressive throttle application to moderate battery internal heat generation.',
        featureImportance: [
          { feature: 'Acceleration Delta Spikes', contribution: 18, direction: 'negative' },
          { feature: 'Braking Energy Loss', contribution: 5, direction: 'neutral' },
          { feature: 'Speed Variation Variance', contribution: 3, direction: 'neutral' }
        ],
        modelMetadata: {
          algorithm: 'Behavioral Clustering + Markov Decision Observer',
          inferenceLatency: '10.1 ms',
          confidenceInterval: '97.2%'
        }
      }
    ]
  },

  CRITICAL: {
    overallRisk: {
      level: 'HIGH',
      probability: 89,
      statusLabel: 'CRITICAL BATTERY FAULT PREDICTED',
      color: 'rose',
      tagline: 'High probability of severe battery cell fault. Preventive inspection urgently recommended.',
      headline: 'Predicted Issue: Rapid Thermal Escalation & Severe Cell Voltage Imbalance (185 mV).'
    },
    faults: [
      {
        id: 'battery',
        title: 'Battery Fault Risk',
        probability: 89,
        riskLevel: 'HIGH',
        color: 'rose',
        shortExplanation: 'Severe cell voltage imbalance (185 mV) and rapid temperature escalation (58.4°C).',
        detectedAbnormalParameters: [
          'Critical Cell Voltage Delta (185 mV vs 25 mV nominal)',
          'Localized Cell Temperature Peak (58.4°C)',
          'Impedance Disparity Index (0.89 anomaly score)',
          'Accelerated Voltage Sag under Cruising Current'
        ],
        aiExplanation: 'Digital twin state observer indicates high probability of localized internal shorting or separator stress in Cell #22 (Module #3). Thermal runaway risk window active if high current draw continues.',
        recommendedAction: 'Schedule immediate authorized workshop inspection. Power derate mode activated automatically.',
        featureImportance: [
          { feature: 'Severe Cell Voltage Delta (185 mV)', contribution: 44, direction: 'negative' },
          { feature: 'Localized Temperature Spike (58.4°C)', contribution: 32, direction: 'negative' },
          { feature: 'Severe Internal Impedance Rise', contribution: 16, direction: 'negative' },
          { feature: 'Thermal Runaway Index Projection', contribution: 8, direction: 'negative' }
        ],
        modelMetadata: {
          algorithm: 'Ensemble Autoencoder + Isolation Forest',
          inferenceLatency: '16.8 ms',
          confidenceInterval: '99.4%'
        }
      },
      {
        id: 'motor',
        title: 'Motor Fault Risk',
        probability: 64,
        riskLevel: 'MEDIUM',
        color: 'amber',
        shortExplanation: 'Motor inverter thermal derating active due to high thermal loop return temperatures.',
        detectedAbnormalParameters: [
          'Inverter Bridge Temperature (84.8°C)',
          'Vibration Spectral Spike at 120 Hz',
          'Rotor Speed Output Throttled'
        ],
        aiExplanation: 'The cooling system is prioritizing battery heat rejection, causing secondary thermal accumulation on the drive inverter power MOSFETs.',
        recommendedAction: 'Allow drivetrain to cool to ambient. Do not attempt heavy acceleration or towing.',
        featureImportance: [
          { feature: 'Inverter Coolant Return Heat', contribution: 36, direction: 'negative' },
          { feature: 'Harmonic Torque Ripple', contribution: 18, direction: 'negative' },
          { feature: 'Thermal Overload Protection Flag', contribution: 10, direction: 'negative' }
        ],
        modelMetadata: {
          algorithm: 'LSTM Recurrent Neural Network (Motor Observer)',
          inferenceLatency: '13.2 ms',
          confidenceInterval: '95.9%'
        }
      },
      {
        id: 'performance',
        title: 'Performance Fault Risk',
        probability: 58,
        riskLevel: 'MEDIUM',
        color: 'amber',
        shortExplanation: 'Total vehicle efficiency reduced by 37.6% due to thermal protection derating.',
        detectedAbnormalParameters: [
          'Severe Energy Inefficiency (218 Wh/km)',
          'Regen Braking Severely Disabled (Safety interlock)',
          'Drivetrain Acceleration Limit: 0.8 m/s²'
        ],
        aiExplanation: 'BMS and VCU have activated Limp / Safe Mode to protect electrochemical cells from thermal runaway. Top speed restricted to 45 km/h.',
        recommendedAction: 'Proceed safely to nearest service location or pull over if thermal warning worsens.',
        featureImportance: [
          { feature: 'VCU Safe-Mode Throttling', contribution: 30, direction: 'negative' },
          { feature: 'Thermal Dissipation Deficit', contribution: 20, direction: 'negative' },
          { feature: 'Auxiliary Cooling Power Maxima', contribution: 8, direction: 'negative' }
        ],
        modelMetadata: {
          algorithm: 'Physics-Informed Neural Network (PINN Energy Twin)',
          inferenceLatency: '18.1 ms',
          confidenceInterval: '98.2%'
        }
      },
      {
        id: 'operational',
        title: 'Operational Fault Risk',
        probability: 72,
        riskLevel: 'HIGH',
        color: 'rose',
        shortExplanation: 'Vehicle operating under continuous abnormal thermal distress conditions.',
        detectedAbnormalParameters: [
          'Critical Anomaly Events: 8 in past 15 minutes',
          'Continuous High Pack Temperature Warning'
        ],
        aiExplanation: 'Operational safety margin degraded. Repeated driving under this condition will cause irreversible cell capacity loss or catastrophic fault.',
        recommendedAction: 'Cease driving immediately. Park in a shaded, well-ventilated open area.',
        featureImportance: [
          { feature: 'Critical Alert Interlock State', contribution: 42, direction: 'negative' },
          { feature: 'Thermal Runaway Vulnerability', contribution: 22, direction: 'negative' },
          { feature: 'Battery Health Stress Factor', contribution: 8, direction: 'negative' }
        ],
        modelMetadata: {
          algorithm: 'Behavioral Clustering + Markov Decision Observer',
          inferenceLatency: '10.8 ms',
          confidenceInterval: '99.6%'
        }
      }
    ]
  }
};
