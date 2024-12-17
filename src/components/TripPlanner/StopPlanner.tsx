import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import IntervalSelector from "./IntervalSelector";
import StopTypeFilter from "./StopTypeFilter";
import StopSuggestions from "./StopSuggestions";
import { getStops } from "@/lib/stops";
import type { Stop } from "@/types/database";

type StopType = "accommodations" | "food" | "gas" | "attractions";

interface StopPlannerProps {
  intervalType?: "time" | "distance";
  intervalValue?: number;
  selectedTypes?: StopType[];
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
  selectedTypes = ["food", "gas"],
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
  const [localSelectedTypes, setLocalSelectedTypes] =
    useState<StopType[]>(selectedTypes);
  const [stops, setStops] = useState<Stop[]>(initialStops);

  // Fetch stops from database
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const dbStops = await getStops();
        setStops(dbStops);
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };
    fetchStops();
  }, []);

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
