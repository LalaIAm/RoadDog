import { useCallback, useEffect, useState } from "react";
import { findPlacesAlongRoute } from "@/lib/places";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { defaultMapOptions, loadScriptOptions } from "@/lib/google-maps";
import { calculateRouteWithStops } from "@/lib/route-utils";
import type { Stop } from "@/types/database";
import { useRoute } from "@/lib/contexts/RouteContext";

interface MapViewProps {
  startLocation?: string;
  endLocation?: string;
  selectedTypes?: Array<"accommodations" | "food" | "gas" | "attractions">;
  interval?: { value: number; type: "time" | "distance" };
  error?: string;
  onPlacesFound?: (places: Stop[]) => void;
}

const stopTypeIcons = {
  accommodations: "🏨",
  food: "🍽️",
  gas: "⛽",
  attractions: "🎯",
};

const stopTypeColors = {
  accommodations: "#3b82f6", // blue
  food: "#22c55e", // green
  gas: "#eab308", // yellow
  attractions: "#a855f7", // purple
};

const MapView = ({
  startLocation = "New York, NY, USA",
  endLocation = "Los Angeles, CA, USA",
  selectedTypes = ["food", "gas"],
  interval = { value: 2, type: "time" as const },
  error,
  onPlacesFound = () => {},
}: MapViewProps) => {
  const { isLoaded } = useJsApiLoader(loadScriptOptions);
  const { state, dispatch } = useRoute();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [startPosition, setStartPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [endPosition, setEndPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Stop | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const geocodeAddress = async (
    address: string,
  ): Promise<google.maps.LatLngLiteral | null> => {
    if (!isLoaded) return null;

    const geocoder = new window.google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({ address });
      if (result.results[0]?.geometry?.location) {
        const location = result.results[0].geometry.location;
        return { lat: location.lat(), lng: location.lng() };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return null;
  };

  const calculateRoute = useCallback(async () => {
    if (!startPosition || !endPosition || !isLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();

    try {
      // Create waypoints from selected stops
      const waypoints = state.selectedStops
        .filter((stop) => stop.geometry?.location)
        .map((stop) => ({
          location: {
            lat: stop.geometry.location.lat(),
            lng: stop.geometry.location.lng(),
          },
          stopover: true,
        }));

      // Calculate route with waypoints
      const result = await calculateRouteWithStops(
        directionsService,
        startPosition,
        endPosition,
        waypoints,
      );

      // Update directions in state
      dispatch({ type: "SET_DIRECTIONS", payload: result });
      setDirections(result);

      // Find places along the route
      try {
        const places = await findPlacesAlongRoute(
          result,
          selectedTypes,
          interval,
        );
        onPlacesFound(places);
      } catch (error) {
        console.error("Error finding places:", error);
      }
    } catch (error) {
      console.error("Directions error:", error);
    }
  }, [
    startPosition,
    endPosition,
    isLoaded,
    selectedTypes,
    interval,
    onPlacesFound,
    state.selectedStops,
    dispatch,
  ]);

  // Recalculate route when selected stops change
  useEffect(() => {
    if (startPosition && endPosition) {
      calculateRoute();
    }
  }, [startPosition, endPosition, calculateRoute, state.selectedStops]);

  useEffect(() => {
    if (!isLoaded) return;

    const updateLocations = async () => {
      const start = await geocodeAddress(startLocation);
      const end = await geocodeAddress(endLocation);
      setStartPosition(start);
      setEndPosition(end);
    };
    updateLocations();
  }, [startLocation, endLocation, isLoaded]);

  const createMarkerIcon = (type: string, isSelected: boolean = false) => {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: stopTypeColors[type as keyof typeof stopTypeColors],
      fillOpacity: isSelected ? 1 : 0.6,
      strokeWeight: 2,
      strokeColor: isSelected
        ? "#000"
        : stopTypeColors[type as keyof typeof stopTypeColors],
      scale: isSelected ? 12 : 10,
    };
  };

  if (!isLoaded) {
    return (
      <div className="relative w-full h-full min-h-[600px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        Loading Maps...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        options={defaultMapOptions}
        onLoad={onLoad}
      >
        {error && (
          <Alert
            variant="destructive"
            className="absolute top-4 left-4 z-50 max-w-md"
          >
            <AlertDescription className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {error}
            </AlertDescription>
          </Alert>
        )}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              markerOptions: {
                zIndex: 100,
              },
            }}
          />
        )}

        {/* Available Stops */}
        {state.availableStops.map((stop) => {
          const isSelected = state.selectedStops.some((s) => s.id === stop.id);
          if (!stop.geometry?.location) return null;

          return (
            <Marker
              key={stop.id}
              position={{
                lat: stop.geometry.location.lat(),
                lng: stop.geometry.location.lng(),
              }}
              icon={createMarkerIcon(stop.type, isSelected)}
              label={{
                text: stopTypeIcons[stop.type as keyof typeof stopTypeIcons],
                fontSize: "16px",
              }}
              onClick={() => setSelectedMarker(stop)}
              zIndex={isSelected ? 2 : 1}
            />
          );
        })}

        {/* Info Window for selected marker */}
        {selectedMarker && selectedMarker.geometry?.location && (
          <InfoWindow
            position={{
              lat: selectedMarker.geometry.location.lat(),
              lng: selectedMarker.geometry.location.lng(),
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2 max-w-[200px]">
              <h3 className="font-semibold text-sm">{selectedMarker.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedMarker.distance}
              </p>
              {selectedMarker.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs">⭐</span>
                  <span className="text-xs">
                    {selectedMarker.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
