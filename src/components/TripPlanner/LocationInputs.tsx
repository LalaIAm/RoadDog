import { useState } from "react";
import LocationInput from "./LocationInput";
import SwapButton from "./SwapButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LocationInputsProps {
  startLocation?: string;
  endLocation?: string;
  startLocationError?: string;
  endLocationError?: string;
  onStartLocationChange?: (value: string) => void;
  onEndLocationChange?: (value: string) => void;
  onSwapLocations?: () => void;
}

const LocationInputs = ({
  startLocationError,
  endLocationError,
  startLocation = "",
  endLocation = "",
  onStartLocationChange = () => {},
  onEndLocationChange = () => {},
  onSwapLocations = () => {},
}: LocationInputsProps) => {
  // Local state for demonstration when props aren't provided
  const [localStartLocation, setLocalStartLocation] = useState(startLocation);
  const [localEndLocation, setLocalEndLocation] = useState(endLocation);

  const handleStartLocationChange = (value: string) => {
    setLocalStartLocation(value);
    onStartLocationChange(value);
  };

  const handleEndLocationChange = (value: string) => {
    setLocalEndLocation(value);
    onEndLocationChange(value);
  };

  const handleSwapLocations = () => {
    const tempStart = localStartLocation;
    setLocalStartLocation(localEndLocation);
    setLocalEndLocation(tempStart);
    onSwapLocations();
  };

  return (
    <div className="w-[400px] p-4 space-y-4 bg-white rounded-lg shadow-md">
      <LocationInput
        label="Starting Point"
        placeholder="Enter starting location"
        value={localStartLocation}
        error={startLocationError}
        onChange={handleStartLocationChange}
      />
      <div className="relative">
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10">
          <SwapButton onClick={handleSwapLocations} />
        </div>
      </div>
      <LocationInput
        label="Destination"
        placeholder="Enter destination"
        value={localEndLocation}
        error={endLocationError}
        onChange={handleEndLocationChange}
      />
    </div>
  );
};

export default LocationInputs;
