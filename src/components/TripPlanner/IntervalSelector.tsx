import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import IntervalInput from "./IntervalInput";

interface IntervalSelectorProps {
  selectedType?: "time" | "distance";
  value?: number;
  onTypeChange?: (type: "time" | "distance") => void;
  onValueChange?: (value: number) => void;
  error?: string;
}

const IntervalSelector = ({
  selectedType = "time",
  value = 2,
  onTypeChange = () => {},
  onValueChange = () => {},
  error,
}: IntervalSelectorProps) => {
  const [localType, setLocalType] = useState<"time" | "distance">(selectedType);
  const [localValue, setLocalValue] = useState(value);

  const handleTypeChange = (newType: "time" | "distance") => {
    setLocalType(newType);
    onTypeChange(newType);
    // Reset value when changing type
    setLocalValue(newType === "time" ? 2 : 100);
    onValueChange(newType === "time" ? 2 : 100);
  };

  const handleValueChange = (newValue: number) => {
    setLocalValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="w-[380px] h-[120px] p-4 bg-white rounded-lg shadow-sm space-y-4">
      <RadioGroup
        defaultValue={localType}
        value={localType}
        onValueChange={(value) =>
          handleTypeChange(value as "time" | "distance")
        }
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="time" id="time" />
          <Label htmlFor="time">Time-based</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="distance" id="distance" />
          <Label htmlFor="distance">Distance-based</Label>
        </div>
      </RadioGroup>

      <div className="flex items-center space-x-2">
        <IntervalInput
          value={localValue}
          unit={localType === "time" ? "hours" : "miles"}
          onChange={handleValueChange}
          error={error}
        />
      </div>
    </div>
  );
};

export default IntervalSelector;
