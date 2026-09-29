import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { defaultVehicleProfile, vehicleStatePresets } from '../data/vehicleData';
import { batteryStateByPreset, batteryPackSpecs, getCellMatrixData, socTimeSeries, tempTimeSeries, voltageTimeSeries, currentTimeSeries, degradationTrendSeries } from '../data/batteryData';
import { predictionPresets } from '../data/predictionData';
import { tripsList } from '../data/tripData';
import { initialNotifications } from '../data/notificationData';
import { recommendationsList } from '../data/recommendationData';
import { predictionHistoryLogs } from '../data/predictionHistoryData';

const VehicleContext = createContext(null);

export const VehicleProvider = ({ children }) => {
  // Preset: 'HEALTHY' | 'WARNING' | 'CRITICAL'
  const [simulationPreset, setSimulationPreset] = useState('HEALTHY');
  const [vehicleProfile, setVehicleProfile] = useState(defaultVehicleProfile);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [liveJitter, setLiveJitter] = useState({ speedDelta: 0, currentDelta: 0, voltDelta: 0 });
  const [activeAlertModal, setActiveAlertModal] = useState(null); // null or alert object
  const [selectedFaultDetail, setSelectedFaultDetail] = useState(null); // for deep dive modal
  const [selectedTripDetail, setSelectedTripDetail] = useState(null); // for trip modal
  const [notifications, setNotifications] = useState(initialNotifications);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  // Live telemetry streaming effect: subtle jitter every 2.5 seconds
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setLiveJitter({
        speedDelta: (Math.random() * 4 - 2),
        currentDelta: (Math.random() * 6 - 3),
        voltDelta: (Math.random() * 0.8 - 0.4)
      });
      setLastSyncTime('Active (10 Hz)');
    }, 2500);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // When simulation preset changes, optionally trigger the alert modal for high-risk warning/critical
  const changeSimulationPreset = (preset) => {
    setSimulationPreset(preset);
    if (preset === 'WARNING') {
      setActiveAlertModal({
        severity: 'warning',
        title: '⚠ BATTERY FAULT RISK DETECTED',
        riskProbability: 73,
        predictedIssue: 'Abnormal battery behaviour (Module 03 Thermal Drift & Voltage Sag)',
        recommendation: 'Battery inspection recommended. Avoid repeated fast-charging pulses.'
      });
    } else if (preset === 'CRITICAL') {
      setActiveAlertModal({
        severity: 'critical',
        title: '🚨 HIGH BATTERY FAULT RISK DETECTED',
        riskProbability: 89,
        predictedIssue: 'Severe Cell Voltage Imbalance (185 mV) & High Overheat (58.4°C)',
        recommendation: 'Immediate technician inspection required. Power derating engaged.'
      });
    } else {
      // Nominal
      setActiveAlertModal(null);
    }
  };

  // Derived current state with live jitter applied
  const currentVehicleState = useMemo(() => {
    const base = vehicleStatePresets[simulationPreset] || vehicleStatePresets.HEALTHY;
    const speed = Math.max(0, Math.round((base.liveParameters.speed.value + liveJitter.speedDelta) * 10) / 10);
    const current = Math.round((base.liveParameters.current.value + liveJitter.currentDelta) * 10) / 10;
    const voltage = Math.round((base.liveParameters.voltage.value + liveJitter.voltDelta) * 10) / 10;

    return {
      ...base,
      liveParameters: {
        ...base.liveParameters,
        speed: { ...base.liveParameters.speed, value: speed },
        current: { ...base.liveParameters.current, value: current },
        voltage: { ...base.liveParameters.voltage, value: voltage }
      }
    };
  }, [simulationPreset, liveJitter]);

  const currentBatteryState = useMemo(() => {
    return {
      specs: batteryPackSpecs,
      state: batteryStateByPreset[simulationPreset] || batteryStateByPreset.HEALTHY,
      cellMatrix: getCellMatrixData(simulationPreset),
      charts: {
        soc: socTimeSeries,
        temperature: tempTimeSeries,
        voltage: voltageTimeSeries,
        current: currentTimeSeries,
        degradation: degradationTrendSeries
      }
    };
  }, [simulationPreset]);

  const currentPredictionState = useMemo(() => {
    return predictionPresets[simulationPreset] || predictionPresets.HEALTHY;
  }, [simulationPreset]);

  // Notifications helpers
  const unreadCount = useMemo(() => {
    return notifications.filter(n => n.unread).length;
  }, [notifications]);

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <VehicleContext.Provider
      value={{
        simulationPreset,
        setSimulationPreset: changeSimulationPreset,
        vehicleProfile,
        setVehicleProfile,
        isLiveStreaming,
        setIsLiveStreaming,
        currentVehicleState,
        currentBatteryState,
        currentPredictionState,
        tripsList,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        recommendationsList,
        predictionHistoryLogs,
        activeAlertModal,
        setActiveAlertModal,
        selectedFaultDetail,
        setSelectedFaultDetail,
        selectedTripDetail,
        setSelectedTripDetail,
        lastSyncTime
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
