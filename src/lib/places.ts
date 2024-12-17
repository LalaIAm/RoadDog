import {
  calculateStopPoints,
  formatDistance,
  formatDuration,
} from "./route-utils";

type PlaceType =
  | "lodging"
  | "restaurant"
  | "gas_station"
  | "tourist_attraction";

const placeTypeMapping = {
  accommodations: "lodging",
  food: "restaurant",
  gas: "gas_station",
  attractions: "tourist_attraction",
} as const;

interface LatLng {
  lat: number;
  lng: number;
}

export async function findPlacesAlongRoute(
  route: google.maps.DirectionsResult,
  selectedTypes: Array<keyof typeof placeTypeMapping>,
  interval: { value: number; type: "time" | "distance" },
) {
  // Get optimal stop points along the route
  const stopPoints = calculateStopPoints(route, interval);

  const stops = [];
  const service = new google.maps.places.PlacesService(
    new google.maps.Map(document.createElement("div")),
  );

  // Search for places near each stop point
  for (const stopPoint of stopPoints) {
    for (const type of selectedTypes) {
      const googlePlaceType = placeTypeMapping[type];
      const places = await searchNearbyPlaces(
        service,
        stopPoint.location,
        googlePlaceType,
      );

      // Get details for each place
      for (const place of places) {
        const details = await getPlaceDetails(service, place.place_id);
        if (details) {
          // Calculate distance from route
          const placeLocation = place.geometry?.location;
          const distanceFromRoute =
            google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(stopPoint.location),
              placeLocation,
            );

          stops.push({
            ...details,
            type,
            distance: `${formatDistance(distanceFromRoute)} off route`,
            duration: `${formatDuration(stopPoint.durationFromLast)} from last stop`,
            nextStopDistance: formatDistance(stopPoint.distanceFromLast),
            nextStopDuration: formatDuration(stopPoint.durationFromLast),
            totalDistance: formatDistance(stopPoint.distance),
            totalDuration: formatDuration(stopPoint.duration),
          });
        }
      }
    }
  }

  return stops;
}

function searchNearbyPlaces(
  service: google.maps.places.PlacesService,
  location: LatLng,
  type: PlaceType,
): Promise<google.maps.places.PlaceResult[]> {
  return new Promise((resolve) => {
    const request = {
      location,
      radius: 5000, // 5km radius
      type,
      rankBy: google.maps.places.RankBy.DISTANCE,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results.slice(0, 5)); // Limit to top 5 closest places
      } else {
        resolve([]);
      }
    });
  });
}

function getPlaceDetails(
  service: google.maps.places.PlacesService,
  placeId: string,
): Promise<any> {
  return new Promise((resolve) => {
    const request = {
      placeId,
      fields: [
        "name",
        "rating",
        "formatted_address",
        "formatted_phone_number",
        "website",
        "photos",
        "opening_hours",
        "geometry",
      ],
    };

    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        const photos =
          place.photos
            ?.slice(0, 3)
            .map((photo) => photo.getUrl({ maxWidth: 400, maxHeight: 400 })) ||
          [];

        const hours = place.opening_hours?.weekday_text || [];
        const isOpen = place.opening_hours?.isOpen() || false;

        resolve({
          name: place.name,
          rating: place.rating || 0,
          address: place.formatted_address,
          phone: place.formatted_phone_number,
          website: place.website,
          photos,
          is_open: isOpen,
          hours,
        });
      } else {
        resolve(null);
      }
    });
  });
}
