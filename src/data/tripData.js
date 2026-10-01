// Trip history and detailed telemetry for individual journeys

export const tripsList = [
  {
    id: 'TRIP-2026-0906-01',
    code: 'Trip 01',
    date: 'Today, 14:15 - 15:02',
    timestamp: '2026-09-06T14:15:00',
    origin: 'Mumbai (Bandra Kurla Complex)',
    destination: 'Thane (Viviana West)',
    distanceKm: 24.6,
    durationMin: 47,
    energyRateWhKm: 142, // Wh/km
    batteryUsedPct: 18,
    avgSpeedKmh: 31.4,
    maxSpeedKmh: 78.5,
    totalEnergyKWh: 3.49,
    regenEnergyKWh: 0.82,
    regenEfficiencyPct: 88.5,
    avgPackTempC: 34.2,
    maxPackTempC: 38.6,
    drivingScore: 92,
    anomalyCount: 0,
    status: 'COMPLETED_NOMINAL',
    abnormalEvents: [],
    telemetrySamples: [
      { km: 0, speed: 0, elevation: 12, powerKw: 0, temp: 31.0 },
      { km: 4, speed: 45, elevation: 18, powerKw: 18.2, temp: 31.8 },
      { km: 8, speed: 62, elevation: 24, powerKw: 24.5, temp: 32.9 },
      { km: 12, speed: 78, elevation: 32, powerKw: 34.0, temp: 34.6 },
      { km: 16, speed: 52, elevation: 28, powerKw: -14.2, temp: 35.8 }, // regen
      { km: 20, speed: 38, elevation: 19, powerKw: 12.6, temp: 35.2 },
      { km: 24.6, speed: 0, elevation: 16, powerKw: 0, temp: 34.2 }
    ]
  },
  {
    id: 'TRIP-2026-0906-02',
    code: 'Trip 02',
    date: 'Today, 10:20 - 11:18',
    timestamp: '2026-09-06T10:20:00',
    origin: 'Thane (Ghodbunder)',
    destination: 'Navi Mumbai (Vashi Sector 17)',
    distanceKm: 31.2,
    durationMin: 58,
    energyRateWhKm: 139,
    batteryUsedPct: 21,
    avgSpeedKmh: 32.2,
    maxSpeedKmh: 84.0,
    totalEnergyKWh: 4.33,
    regenEnergyKWh: 1.15,
    regenEfficiencyPct: 91.2,
    avgPackTempC: 33.5,
    maxPackTempC: 36.8,
    drivingScore: 94,
    anomalyCount: 0,
    status: 'COMPLETED_NOMINAL',
    abnormalEvents: [],
    telemetrySamples: [
      { km: 0, speed: 0, elevation: 22, powerKw: 0, temp: 30.2 },
      { km: 6, speed: 54, elevation: 29, powerKw: 22.4, temp: 31.4 },
      { km: 12, speed: 72, elevation: 45, powerKw: 31.8, temp: 32.8 },
      { km: 18, speed: 84, elevation: 41, powerKw: 38.6, temp: 34.5 },
      { km: 24, speed: 58, elevation: 26, powerKw: -18.5, temp: 35.1 },
      { km: 31.2, speed: 0, elevation: 14, powerKw: 0, temp: 33.5 }
    ]
  },
  {
    id: 'TRIP-2026-0905-03',
    code: 'Trip 03',
    date: 'Yesterday, 17:40 - 19:15',
    timestamp: '2026-09-05T17:40:00',
    origin: 'Navi Mumbai (CBD Belapur)',
    destination: 'Pune Express Tollway (Lonavala Ascent)',
    distanceKm: 68.4,
    durationMin: 95,
    energyRateWhKm: 184,
    batteryUsedPct: 48,
    avgSpeedKmh: 43.2,
    maxSpeedKmh: 102.0,
    totalEnergyKWh: 12.58,
    regenEnergyKWh: 2.34,
    regenEfficiencyPct: 76.4,
    avgPackTempC: 41.8,
    maxPackTempC: 46.2,
    drivingScore: 78,
    anomalyCount: 2,
    status: 'ELEVATED_THERMAL_LOAD',
    abnormalEvents: [
      {
        time: '18:24',
        type: 'Thermal Surge Warning',
        parameter: 'Module 03 Temperature',
        observedValue: '46.2 °C',
        thresholdValue: '42.0 °C',
        actionTaken: 'BMS requested cooling fan speed increase to 100%'
      },
      {
        time: '18:41',
        type: 'Voltage Delta Imbalance',
        parameter: 'Cell #22 Voltage Sag',
        observedValue: '58 mV delta',
        thresholdValue: '35 mV delta',
        actionTaken: 'Digital Twin flagged cell impedance variance'
      }
    ],
    telemetrySamples: [
      { km: 0, speed: 0, elevation: 15, powerKw: 0, temp: 32.0 },
      { km: 15, speed: 82, elevation: 65, powerKw: 38.0, temp: 35.4 },
      { km: 30, speed: 96, elevation: 140, powerKw: 48.2, temp: 38.9 },
      { km: 45, speed: 65, elevation: 380, powerKw: 62.4, temp: 43.8 }, // ghats climb
      { km: 55, speed: 52, elevation: 560, powerKw: 68.1, temp: 46.2 }, // anomaly spike
      { km: 68.4, speed: 0, elevation: 625, powerKw: 0, temp: 41.8 }
    ]
  },
  {
    id: 'TRIP-2026-0904-04',
    code: 'Trip 04',
    date: '4 Sep 2026, 08:30 - 09:12',
    timestamp: '2026-09-04T08:30:00',
    origin: 'Andheri East (Tech Park)',
    destination: 'Mumbai International Airport T2',
    distanceKm: 8.9,
    durationMin: 42,
    energyRateWhKm: 156,
    batteryUsedPct: 7,
    avgSpeedKmh: 12.7,
    maxSpeedKmh: 46.0,
    totalEnergyKWh: 1.38,
    regenEnergyKWh: 0.44,
    regenEfficiencyPct: 86.0,
    avgPackTempC: 31.0,
    maxPackTempC: 32.8,
    drivingScore: 88,
    anomalyCount: 0,
    status: 'COMPLETED_NOMINAL',
    abnormalEvents: [],
    telemetrySamples: [
      { km: 0, speed: 0, elevation: 18, powerKw: 0, temp: 30.0 },
      { km: 2, speed: 22, elevation: 19, powerKw: 8.5, temp: 30.8 },
      { km: 4, speed: 18, elevation: 21, powerKw: 9.1, temp: 31.4 },
      { km: 6, speed: 38, elevation: 24, powerKw: 15.2, temp: 32.2 },
      { km: 8.9, speed: 0, elevation: 20, powerKw: 0, temp: 31.0 }
    ]
  }
];
