import React from 'react';
import { SensorCard } from '../common/SensorCard';
import { 
  Battery, 
  Zap, 
  Gauge, 
  Activity, 
  Thermometer, 
  Compass, 
  TrendingUp, 
  RotateCcw, 
  Flame, 
  MapPin, 
  Layers 
} from 'lucide-react';

export const LiveParametersGrid = ({ parameters }) => {
  if (!parameters) return null;

  const iconMapping = {
    soc: Battery,
    capacity: Layers,
    voltage: Zap,
    current: Activity,
    temperature: Thermometer,
    speed: Gauge,
    acceleration: TrendingUp,
    energyConsumption: Flame,
    regenerativeBraking: RotateCcw,
    slope: Compass,
    distanceTravelled: MapPin,
    remainingRange: Battery
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {Object.entries(parameters).map(([key, param]) => {
        const Icon = iconMapping[key] || Activity;
        return (
          <SensorCard
            key={key}
            label={param.label}
            value={param.value}
            unit={param.unit}
            status={param.status}
            min={param.min}
            max={param.max}
            icon={Icon}
          />
        );
      })}
    </div>
  );
};
