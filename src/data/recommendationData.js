// Smart AI Recommendations categorized by priority and subsystem

export const recommendationsList = [
  {
    id: 'REC-001',
    priority: 'High Priority',
    priorityColor: 'rose',
    category: 'Battery Thermal Management',
    triggerCondition: 'Battery module 03 temperature elevated 7.2°C above pack average',
    title: 'Mitigate Thermal Stress & Avoid Fast Charging',
    diagnosis: 'Elevated internal resistance in Module 03 generates localized joule heating during continuous DC fast charging pulses.',
    actionPoints: [
      'Avoid back-to-back DC Fast Charging (> 60 kW) until cell delta normalizes.',
      'Allow battery pack to cool in shade for at least 30 minutes prior to charging.',
      'Maintain active coolant circulation; inspect front radiator intake for debris.',
      'Operate in Eco Mode on ambient temperatures exceeding 35°C.'
    ],
    estimatedImpact: 'Reduces peak cell temperature by 6.5°C & slows premature capacity degradation by up to 22%.',
    status: 'Action Required',
    subsystem: 'Battery'
  },
  {
    id: 'REC-002',
    priority: 'Medium Priority',
    priorityColor: 'amber',
    category: 'Driving Efficiency',
    triggerCondition: 'Energy consumption spiked to 176 Wh/km during transient traffic cycles',
    title: 'Optimize Throttle Modulation & Regen Recovery',
    diagnosis: 'Frequent abrupt accelerations (>2.5 m/s²) cause battery discharge spikes and reduce thermodynamic regeneration recapture.',
    actionPoints: [
      'Smooth out initial throttle tip-in to decrease transient I²R resistance losses.',
      'Engage Level-2 One-Pedal Regenerative Braking during city stop-and-go commuting.',
      'Maintain consistent cruising speeds between 50-70 km/h on urban expressways.'
    ],
    estimatedImpact: 'Recovers approximately 8% to 14% additional range and reduces inverter switching stress.',
    status: 'In Progress',
    subsystem: 'Powertrain'
  },
  {
    id: 'REC-003',
    priority: 'Low Priority',
    priorityColor: 'emerald',
    category: 'Battery Health Preservation',
    triggerCondition: 'Current State of Health is 94.2% (Nominal)',
    title: 'Periodic Cell Balancing Cycle',
    diagnosis: 'Current cell voltage delta is 14 mV (well within 45 mV limits). Regular balancing maintains electrolyte equilibrium.',
    actionPoints: [
      'Perform an AC Level-2 slow charge to 100% once every 3-4 weeks to allow BMS passive cell balancing bleeding.',
      'Avoid leaving vehicle parked at sustained 100% SOC in direct summer sunlight for more than 48 hours.',
      'Store at 50-60% SOC if vehicle remains stationary for extended travel.'
    ],
    estimatedImpact: 'Preserves long-term cell capacity retention and prolongs battery pack lifecycle by 2+ years.',
    status: 'Proactive Advisory',
    subsystem: 'Battery'
  },
  {
    id: 'REC-004',
    priority: 'Low Priority',
    priorityColor: 'emerald',
    category: 'Tire & Mechanical Drag',
    triggerCondition: 'Rolling resistance variation detected on wet asphalt',
    title: 'Verify Cold Tire Inflation Pressures',
    diagnosis: 'Rolling drag accounts for approximately 18% of low-speed energy consumption in electric vehicles.',
    actionPoints: [
      'Inspect cold tire pressures: maintain manufacturer spec of 36 PSI front / 38 PSI rear.',
      'Check front wheel alignment to ensure even contact patch across both drive wheels.'
    ],
    estimatedImpact: 'Saves 10-15 Wh/km in baseline cruising energy consumption.',
    status: 'Routine Maintenance',
    subsystem: 'Chassis'
  }
];
