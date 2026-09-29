/**
 * EV Guardian - Frontend API Service Layer
 * 
 * ARCHITECTURE NOTE FOR FUTURE BACKEND INTEGRATION:
 * When connecting the actual Python (FastAPI / Flask / PyTorch / TensorFlow) ML backend:
 * 1. Set VITE_USE_MOCK_API=false in your .env file
 * 2. Configure VITE_API_BASE_URL=http://localhost:8000/api
 * 3. The functions below will automatically route requests to the live ML model endpoints.
 */

import { defaultVehicleProfile, vehicleStatePresets } from '../data/vehicleData';
import { batteryPackSpecs, batteryStateByPreset, getCellMatrixData, socTimeSeries, tempTimeSeries, voltageTimeSeries, currentTimeSeries, degradationTrendSeries } from '../data/batteryData';
import { predictionPresets } from '../data/predictionData';
import { tripsList } from '../data/tripData';
import { initialNotifications } from '../data/notificationData';
import { recommendationsList } from '../data/recommendationData';
import { predictionHistoryLogs } from '../data/predictionHistoryData';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api';
const USE_MOCK = import.meta.env?.VITE_USE_MOCK_API !== 'false';

// Helper to simulate network latency for realistic feel
const simulateDelay = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms));

export const evGuardianApi = {
  /**
   * Fetch current vehicle profile & specifications
   */
  async getVehicleProfile() {
    if (USE_MOCK) {
      await simulateDelay();
      return { success: true, data: defaultVehicleProfile };
    }
    const res = await fetch(`${API_BASE_URL}/vehicle/profile`);
    return res.json();
  },

  /**
   * Fetch live vehicle state based on simulation preset or ML inference
   * @param {'HEALTHY' | 'WARNING' | 'CRITICAL'} preset 
   */
  async getVehicleState(preset = 'HEALTHY') {
    if (USE_MOCK) {
      await simulateDelay();
      const presetData = vehicleStatePresets[preset] || vehicleStatePresets.HEALTHY;
      return {
        success: true,
        data: presetData,
        source: 'EV Guardian Digital Twin Observer'
      };
    }
    const res = await fetch(`${API_BASE_URL}/telemetry/live`);
    return res.json();
  },

  /**
   * Fetch battery state & digital twin cell metrics
   * @param {'HEALTHY' | 'WARNING' | 'CRITICAL'} preset 
   */
  async getBatteryHealth(preset = 'HEALTHY') {
    if (USE_MOCK) {
      await simulateDelay();
      const state = batteryStateByPreset[preset] || batteryStateByPreset.HEALTHY;
      const cellMatrix = getCellMatrixData(preset);
      return {
        success: true,
        data: {
          specs: batteryPackSpecs,
          state,
          cellMatrix,
          charts: {
            soc: socTimeSeries,
            temperature: tempTimeSeries,
            voltage: voltageTimeSeries,
            current: currentTimeSeries,
            degradation: degradationTrendSeries
          }
        }
      };
    }
    const res = await fetch(`${API_BASE_URL}/battery/diagnostics`);
    return res.json();
  },

  /**
   * Fetch AI fault predictions, probability scores & SHAP feature contributions
   * @param {'HEALTHY' | 'WARNING' | 'CRITICAL'} preset 
   */
  async getFaultPredictions(preset = 'HEALTHY') {
    if (USE_MOCK) {
      await simulateDelay();
      const predictionData = predictionPresets[preset] || predictionPresets.HEALTHY;
      return {
        success: true,
        data: predictionData,
        modelEngine: 'Ensemble Autoencoder + LSTM Time-To-Failure RUL'
      };
    }
    const res = await fetch(`${API_BASE_URL}/predict/faults`);
    return res.json();
  },

  /**
   * Fetch trip logs with recorded anomalies
   */
  async getTrips() {
    if (USE_MOCK) {
      await simulateDelay();
      return { success: true, data: tripsList };
    }
    const res = await fetch(`${API_BASE_URL}/trips`);
    return res.json();
  },

  /**
   * Fetch system & prediction notifications
   */
  async getNotifications() {
    if (USE_MOCK) {
      await simulateDelay();
      return { success: true, data: initialNotifications };
    }
    const res = await fetch(`${API_BASE_URL}/notifications`);
    return res.json();
  },

  /**
   * Fetch smart AI recommendations
   */
  async getRecommendations() {
    if (USE_MOCK) {
      await simulateDelay();
      return { success: true, data: recommendationsList };
    }
    const res = await fetch(`${API_BASE_URL}/recommendations`);
    return res.json();
  },

  /**
   * Fetch historical prediction audits
   */
  async getPredictionHistory() {
    if (USE_MOCK) {
      await simulateDelay();
      return { success: true, data: predictionHistoryLogs };
    }
    const res = await fetch(`${API_BASE_URL}/predict/history`);
    return res.json();
  }
};
