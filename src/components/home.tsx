import { useEffect } from "react";
import LocationInputs from "./TripPlanner/LocationInputs";
import MapView from "./TripPlanner/MapView";
import StopPlanner from "./TripPlanner/StopPlanner";
import SavedStops from "./TripPlanner/SavedStops";
import { useToast } from "@/components/ui/use-toast";
import { useRoute } from "@/lib/contexts/RouteContext";

function Home() {
  const { state, dispatch } = useRoute();
  const { toast } = useToast();

  const handleStartLocationChange = (value: string) => {
    dispatch({
      type: "SET_LOCATIONS",
      payload: { start: value, end: state.endLocation },
    });
  };

  const handleEndLocationChange = (value: string) => {
    dispatch({
      type: "SET_LOCATIONS",
      payload: { start: state.startLocation, end: value },
    });
  };

  const handleSwapLocations = () => {
    try {
      dispatch({
        type: "SET_LOCATIONS",
        payload: { start: state.endLocation, end: state.startLocation },
      });

      toast({
        title: "Locations swapped",
        description: "Start and end locations have been successfully swapped.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to swap locations. Please try again.",
      });
    }
  };

  const handleStopsFound = (stops: any[]) => {
    dispatch({ type: "SET_AVAILABLE_STOPS", payload: stops });
  };

  const handleAddStop = (stop: any) => {
    dispatch({ type: "ADD_STOP", payload: stop });
  };

  const handleRemoveStop = (stopId: string) => {
    dispatch({ type: "REMOVE_STOP", payload: stopId });
  };

  const handleIntervalTypeChange = (type: "time" | "distance") => {
    dispatch({
      type: "SET_INTERVAL",
      payload: { type, value: state.intervalValue },
    });
  };

  const handleIntervalValueChange = (value: number) => {
    dispatch({
      type: "SET_INTERVAL",
      payload: { type: state.intervalType, value },
    });
  };

  const handleStopTypesChange = (types: any[]) => {
    dispatch({ type: "SET_SELECTED_TYPES", payload: types });
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="absolute inset-0">
        <MapView
          startLocation={state.startLocation}
          endLocation={state.endLocation}
          selectedTypes={state.selectedTypes}
          interval={{ type: state.intervalType, value: state.intervalValue }}
          onPlacesFound={handleStopsFound}
        />
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <LocationInputs
          startLocation={state.startLocation}
          endLocation={state.endLocation}
          onStartLocationChange={handleStartLocationChange}
          onEndLocationChange={handleEndLocationChange}
          onSwapLocations={handleSwapLocations}
        />
      </div>

      <div className="absolute top-8 right-8 z-10">
        <StopPlanner
          intervalType={state.intervalType}
          intervalValue={state.intervalValue}
          route={{ start: state.startLocation, end: state.endLocation }}
          onStopsFound={handleStopsFound}
          stops={state.availableStops}
          addedStops={state.selectedStops.map((stop) => stop.id)}
          onIntervalTypeChange={handleIntervalTypeChange}
          onIntervalValueChange={handleIntervalValueChange}
          onStopTypesChange={handleStopTypesChange}
          onAddStop={handleAddStop}
          onRemoveStop={handleRemoveStop}
        />
      </div>

      <div className="absolute top-8 right-[440px] z-10">
        <SavedStops />
      </div>
    </div>
  );
}

export default Home;
