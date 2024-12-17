import { useState } from "react";
import { Card } from "@/components/ui/card";
import IntervalSelector from "./IntervalSelector";
import StopTypeFilter from "./StopTypeFilter";
import StopSuggestions from "./StopSuggestions";
import MapView from "./MapView";
import type { Stop } from "@/types/database";

type StopType = "accommodations" | "food" | "gas" | "attractions";

interface StopPlannerProps {
  intervalType?: "time" | "distance";
  intervalValue?: number;
  route?: { start: string; end: string };
  onStopsFound?: (stops: Stop[]) => void;
  stops?: Stop[];
  addedStops?: string[];
  onIntervalTypeChange?: (type: "time" | "distance") => void;
  onIntervalValueChange?: (value: number) => void;
  onStopTypesChange?: (types: StopType[]) => void;
  onAddStop?: (stop: Stop) => void;
  onRemoveStop?: (stopId: string) => void;
}

const StopPlanner = ({
  intervalType = "time",
  intervalValue = 2,
  route = {
    start: "New York, NY, USA",
    end: "Los Angeles, CA, USA",
  },
  onStopsFound = () => {},
  stops: initialStops = [],
  addedStops = [],
  onIntervalTypeChange = () => {},
  onIntervalValueChange = () => {},
  onStopTypesChange = () => {},
  onAddStop = () => {},
  onRemoveStop = () => {},
}: StopPlannerProps) => {
  const [localIntervalType, setLocalIntervalType] = useState(intervalType);
  const [localIntervalValue, setLocalIntervalValue] = useState(intervalValue);
  const [localSelectedTypes, setLocalSelectedTypes] = useState<StopType[]>([
    "food",
    "gas",
  ]);
  const [stops, setStops] = useState<Stop[]>(initialStops);

  const handleIntervalTypeChange = (type: "time" | "distance") => {
    setLocalIntervalType(type);
    onIntervalTypeChange(type);
  };

  const handleIntervalValueChange = (value: number) => {
    setLocalIntervalValue(value);
    onIntervalValueChange(value);
  };

  const handleStopTypesChange = (types: StopType[]) => {
    setLocalSelectedTypes(types);
    onStopTypesChange(types);
  };

  const handlePlacesFound = (places: Stop[]) => {
    setStops(places);
    onStopsFound(places);
  };

  const interval = {
    value: localIntervalValue,
    type: localIntervalType,
  };

  return (
    <Card className="w-[400px] h-[600px] bg-white p-4 space-y-4">
      <IntervalSelector
        selectedType={localIntervalType}
        value={localIntervalValue}
        onTypeChange={handleIntervalTypeChange}
        onValueChange={handleIntervalValueChange}
      />

      <StopTypeFilter
        selectedTypes={localSelectedTypes}
        onChange={handleStopTypesChange}
      />

      <MapView
        startLocation={route.start}
        endLocation={route.end}
        selectedTypes={localSelectedTypes}
        interval={interval}
        onPlacesFound={handlePlacesFound}
      />

      <StopSuggestions
        stops={stops}
        selectedTypes={localSelectedTypes}
        onAddStop={onAddStop}
        onRemoveStop={onRemoveStop}
        addedStops={addedStops}
      />
    </Card>
  );
};

export default StopPlanner;
