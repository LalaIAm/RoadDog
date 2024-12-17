interface LatLng {
  lat: number;
  lng: number;
}

interface StopPoint {
  location: LatLng;
  distance: number; // meters from start
  duration: number; // seconds from start
  distanceFromLast: number; // meters from last stop
  durationFromLast: number; // seconds from last stop
}

export async function calculateRouteWithStops(
  directionsService: google.maps.DirectionsService,
  origin: string | google.maps.LatLngLiteral,
  destination: string | google.maps.LatLngLiteral,
  waypoints: Array<{ location: google.maps.LatLngLiteral }>,
): Promise<google.maps.DirectionsResult> {
  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Failed to calculate route: ${status}`));
        }
      },
    );
  });
}

export function calculateStopPoints(
  route: google.maps.DirectionsResult,
  interval: { value: number; type: "time" | "distance" },
): StopPoint[] {
  const path = route.routes[0].overview_path;
  const leg = route.routes[0].legs[0];
  const totalDistance = leg.distance?.value || 0; // meters
  const totalDuration = leg.duration?.value || 0; // seconds

  // Convert interval to meters or seconds
  const intervalValue =
    interval.type === "distance"
      ? interval.value * 1609.34 // miles to meters
      : interval.value * 3600; // hours to seconds

  const totalValue =
    interval.type === "distance" ? totalDistance : totalDuration;
  const numStops = Math.floor(totalValue / intervalValue);

  if (numStops <= 0) return [];

  const stops: StopPoint[] = [];
  let lastDistance = 0;
  let lastDuration = 0;
  let lastPoint = path[0];

  // Calculate cumulative distances along the path
  const cumulativeDistances: number[] = [0];
  const cumulativeDurations: number[] = [0];

  for (let i = 1; i < path.length; i++) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      path[i - 1],
      path[i],
    );
    cumulativeDistances[i] = cumulativeDistances[i - 1] + distance;

    // Estimate duration based on distance (assuming average speed)
    const duration = (distance / totalDistance) * totalDuration;
    cumulativeDurations[i] = cumulativeDurations[i - 1] + duration;
  }

  // Find optimal stop points
  for (let stopNum = 1; stopNum <= numStops; stopNum++) {
    const targetValue = stopNum * intervalValue;
    let bestIndex = 1;
    let minDiff = Infinity;

    // Find the path point closest to the target value
    for (let i = 1; i < path.length; i++) {
      const currentValue =
        interval.type === "distance"
          ? cumulativeDistances[i]
          : cumulativeDurations[i];

      const diff = Math.abs(currentValue - targetValue);
      if (diff < minDiff) {
        minDiff = diff;
        bestIndex = i;
      }
    }

    const point = path[bestIndex];
    const stopPoint: StopPoint = {
      location: {
        lat: point.lat(),
        lng: point.lng(),
      },
      distance: cumulativeDistances[bestIndex],
      duration: cumulativeDurations[bestIndex],
      distanceFromLast: cumulativeDistances[bestIndex] - lastDistance,
      durationFromLast: cumulativeDurations[bestIndex] - lastDuration,
    };

    stops.push(stopPoint);
    lastDistance = stopPoint.distance;
    lastDuration = stopPoint.duration;
    lastPoint = point;
  }

  return stops;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  return `${miles.toFixed(1)} mi`;
}

export function calculateTotalTripMetrics(
  directions: google.maps.DirectionsResult,
): {
  distance: number;
  duration: number;
} {
  return directions.routes[0].legs.reduce(
    (acc, leg) => ({
      distance: acc.distance + (leg.distance?.value || 0),
      duration: acc.duration + (leg.duration?.value || 0),
    }),
    { distance: 0, duration: 0 },
  );
}
