// Notification data categorized by type

export const notificationCategories = ['All', 'Alerts', 'Predictions', 'Maintenance', 'System'];

export const initialNotifications = [
  {
    id: 'NOTIF-001',
    category: 'Predictions',
    type: 'critical',
    title: 'Battery Fault Risk Escalation',
    message: 'Battery fault risk probability evaluated at 73% following continuous thermal disparity in Module 03.',
    timestamp: '12 minutes ago',
    unread: true,
    actionLabel: 'View AI Fault Analysis',
    targetTab: 'prediction'
  },
  {
    id: 'NOTIF-002',
    category: 'Alerts',
    type: 'warning',
    title: 'Elevated Cell Temperature Alert',
    message: 'Module 03 temperature has been consistently 7.2°C above the recent 30-day average.',
    timestamp: '45 minutes ago',
    unread: true,
    actionLabel: 'Inspect Battery Health',
    targetTab: 'battery'
  },
  {
    id: 'NOTIF-003',
    category: 'System',
    type: 'success',
    title: 'Vehicle Health Baseline Calibrated',
    message: 'Digital Twin state observer synchronized with 10 Hz telematics stream. Overall Health updated to 91%.',
    timestamp: '2 hours ago',
    unread: false,
    actionLabel: 'Check Overview',
    targetTab: 'home'
  },
  {
    id: 'NOTIF-004',
    category: 'System',
    type: 'success',
    title: 'Motor Powertrain Nominal',
    message: 'Motor winding temperature and vibration FFT harmonics conform to Class 1 nominal threshold.',
    timestamp: '4 hours ago',
    unread: false,
    actionLabel: 'View Motor Health',
    targetTab: 'vehicle'
  },
  {
    id: 'NOTIF-005',
    category: 'Maintenance',
    type: 'info',
    title: 'Scheduled Coolant Flush Reminder',
    message: 'Active thermal loop glycol coolant inspection recommended at 25,000 km interval.',
    timestamp: 'Yesterday',
    unread: false,
    actionLabel: 'View Recommendations',
    targetTab: 'recommendations'
  },
  {
    id: 'NOTIF-006',
    category: 'Predictions',
    type: 'info',
    title: 'AI Degradation Model Retrained',
    message: 'PINN electrochemical model updated with recent 500 km driving profiles. Confidence: 97.2%.',
    timestamp: '3 days ago',
    unread: false,
    actionLabel: 'View Analytics',
    targetTab: 'analytics'
  }
];
