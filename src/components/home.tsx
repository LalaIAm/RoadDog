import { useState } from "react";
import LocationInputs from "./TripPlanner/LocationInputs";
import MapView from "./TripPlanner/MapView";

function Home() {
  const [startLocation, setStartLocation] = useState("New York, NY, USA");
  const [endLocation, setEndLocation] = useState("Los Angeles, CA, USA");

  const handleStartLocationChange = (value: string) => {
    setStartLocation(value);
  };

  const handleEndLocationChange = (value: string) => {
    setEndLocation(value);
  };

  const handleSwapLocations = () => {
    const tempStart = startLocation;
    setStartLocation(endLocation);
    setEndLocation(tempStart);
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="absolute inset-0">
        <MapView startLocation={startLocation} endLocation={endLocation} />
      </div>
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <LocationInputs
          startLocation={startLocation}
          endLocation={endLocation}
          onStartLocationChange={handleStartLocationChange}
          onEndLocationChange={handleEndLocationChange}
          onSwapLocations={handleSwapLocations}
        />
      </div>
    </div>
  );
}

export default Home;
