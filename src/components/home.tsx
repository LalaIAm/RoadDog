import { useState } from "react";
import LocationInputs from "./TripPlanner/LocationInputs";
import MapView from "./TripPlanner/MapView";
import { useToast } from "@/components/ui/use-toast";

function Home() {
  const [startLocation, setStartLocation] = useState("New York, NY, USA");
  const [endLocation, setEndLocation] = useState("Los Angeles, CA, USA");
  const [startLocationError, setStartLocationError] = useState<string>();
  const [endLocationError, setEndLocationError] = useState<string>();
  const [mapError, setMapError] = useState<string>();
  const { toast } = useToast();

  const validateLocation = (location: string): boolean => {
    // Simple validation - ensure location is not empty and has at least 3 characters
    return location.trim().length >= 3;
  };

  const handleStartLocationChange = (value: string) => {
    setStartLocationError(undefined);
    setMapError(undefined);

    if (!validateLocation(value)) {
      setStartLocationError(
        "Please enter a valid location (at least 3 characters)",
      );
      return;
    }

    setStartLocation(value);
  };

  const handleEndLocationChange = (value: string) => {
    setEndLocationError(undefined);
    setMapError(undefined);

    if (!validateLocation(value)) {
      setEndLocationError(
        "Please enter a valid location (at least 3 characters)",
      );
      return;
    }

    setEndLocation(value);
  };

  const handleSwapLocations = () => {
    try {
      const tempStart = startLocation;
      setStartLocation(endLocation);
      setEndLocation(tempStart);

      // Clear any existing errors
      setStartLocationError(undefined);
      setEndLocationError(undefined);
      setMapError(undefined);

      toast({
        title: "Locations swapped",
        description: "Start and end locations have been successfully swapped.",
      });
    } catch (error) {
      setMapError("Failed to swap locations. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to swap locations. Please try again.",
      });
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="absolute inset-0">
        <MapView
          startLocation={startLocation}
          endLocation={endLocation}
          error={mapError}
        />
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <LocationInputs
          startLocation={startLocation}
          endLocation={endLocation}
          onStartLocationChange={handleStartLocationChange}
          onEndLocationChange={handleEndLocationChange}
          onSwapLocations={handleSwapLocations}
          startLocationError={startLocationError}
          endLocationError={endLocationError}
        />
      </div>
    </div>
  );
}

export default Home;
