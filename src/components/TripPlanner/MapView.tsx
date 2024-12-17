import { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { defaultMapOptions, loadScriptOptions } from "@/lib/google-maps";

interface MapViewProps {
  startLocation?: string;
  endLocation?: string;
  error?: string;
}

const MapView = ({
  startLocation = "New York, NY, USA",
  endLocation = "Los Angeles, CA, USA",
  error,
}: MapViewProps) => {
  const { isLoaded } = useJsApiLoader(loadScriptOptions);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [startPosition, setStartPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [endPosition, setEndPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

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
      const result = await directionsService.route({
        origin: startPosition,
        destination: endPosition,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirections(result);
    } catch (error) {
      console.error("Directions error:", error);
    }
  }, [startPosition, endPosition, isLoaded]);

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

  useEffect(() => {
    if (startPosition && endPosition) {
      calculateRoute();
    }
  }, [startPosition, endPosition, calculateRoute]);

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

        {startPosition && !directions && (
          <Marker
            position={startPosition}
            label={{ text: "A", color: "white" }}
          />
        )}

        {endPosition && !directions && (
          <Marker
            position={endPosition}
            label={{ text: "B", color: "white" }}
          />
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
      </GoogleMap>
    </div>
  );
};

export default MapView;
