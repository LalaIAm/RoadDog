import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical, X, Clock, Navigation } from "lucide-react";
import { useRoute } from "@/lib/contexts/RouteContext";
import {
  formatDistance,
  formatDuration,
  calculateTotalTripMetrics,
} from "@/lib/route-utils";

const typeColors = {
  accommodations: "bg-blue-100 text-blue-800",
  food: "bg-green-100 text-green-800",
  gas: "bg-yellow-100 text-yellow-800",
  attractions: "bg-purple-100 text-purple-800",
};

const typeLabels = {
  accommodations: "Accommodation",
  food: "Restaurant",
  gas: "Gas Station",
  attractions: "Attraction",
};

const SavedStops = () => {
  const { state, dispatch } = useRoute();
  const [draggedStop, setDraggedStop] = useState<string | null>(null);
  const [tripMetrics, setTripMetrics] = useState({ distance: 0, duration: 0 });

  useEffect(() => {
    if (state.directions) {
      const metrics = calculateTotalTripMetrics(state.directions);
      setTripMetrics(metrics);
    }
  }, [state.directions]);

  const handleDragStart = (stopId: string) => {
    setDraggedStop(stopId);
  };

  const handleDragOver = (e: React.DragEvent, targetStopId: string) => {
    e.preventDefault();
    if (!draggedStop || draggedStop === targetStopId) return;

    const stops = [...state.selectedStops];
    const draggedIndex = stops.findIndex((stop) => stop.id === draggedStop);
    const targetIndex = stops.findIndex((stop) => stop.id === targetStopId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder stops
    const [draggedStop_] = stops.splice(draggedIndex, 1);
    stops.splice(targetIndex, 0, draggedStop_);

    // Update state with new order
    dispatch({ type: "SET_STOPS_ORDER", payload: stops });
  };

  const handleDragEnd = () => {
    setDraggedStop(null);
  };

  const handleRemoveStop = (stopId: string) => {
    dispatch({ type: "REMOVE_STOP", payload: stopId });
  };

  return (
    <Card className="w-[380px] bg-white overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Saved Stops</h2>
          <div className="text-sm text-muted-foreground">
            {state.selectedStops.length} stops
          </div>
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Navigation className="h-4 w-4" />
            <span>{formatDistance(tripMetrics.distance)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(tripMetrics.duration)}</span>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-2">
          {state.selectedStops.map((stop, index) => (
            <div
              key={stop.id}
              draggable
              onDragStart={() => handleDragStart(stop.id)}
              onDragOver={(e) => handleDragOver(e, stop.id)}
              onDragEnd={handleDragEnd}
              className={`flex items-start gap-2 p-3 rounded-lg border ${draggedStop === stop.id ? "opacity-50" : ""} ${draggedStop && draggedStop !== stop.id ? "hover:bg-gray-50" : ""}`}
            >
              <div className="mt-1 cursor-move">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-sm truncate">
                      {index + 1}. {stop.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`${typeColors[stop.type]} text-xs whitespace-nowrap`}
                    >
                      {typeLabels[stop.type]}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveStop(stop.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stop.distance} • {stop.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SavedStops;
