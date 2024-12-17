import { useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import StopCard from "./StopCard";
import StopDetails from "./StopDetails";
import {
  addStop as addStopToDb,
  removeStop as removeStopFromDb,
} from "@/lib/stops";
import type { Stop } from "@/types/database";

type StopType = "accommodations" | "food" | "gas" | "attractions";

interface StopSuggestionsProps {
  stops?: Stop[];
  selectedTypes?: StopType[];
  onAddStop?: (stop: Stop) => void;
  onRemoveStop?: (stopId: string) => void;
  addedStops?: string[];
}

const StopSuggestions = ({
  stops = [],
  selectedTypes = ["accommodations", "food", "gas", "attractions"],
  onAddStop = () => {},
  onRemoveStop = () => {},
  addedStops = [],
}: StopSuggestionsProps) => {
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  const filteredStops = stops.filter((stop) =>
    selectedTypes.includes(stop.type),
  );

  const handleStopClick = (stop: Stop) => {
    setSelectedStop(stop);
  };

  const handleCloseDetails = () => {
    setSelectedStop(null);
  };

  const handleToggleStop = useCallback(
    async (stop: Stop) => {
      try {
        if (addedStops.includes(stop.id)) {
          await removeStopFromDb(stop.id);
          onRemoveStop(stop.id);
        } else {
          const { id, created_at, ...stopData } = stop;
          const newStop = await addStopToDb(stopData);
          onAddStop(newStop);
        }
      } catch (error) {
        console.error("Error toggling stop:", error);
      }
    },
    [addedStops, onAddStop, onRemoveStop],
  );

  return (
    <div className="w-[380px] h-[400px] bg-white rounded-lg shadow-sm overflow-hidden">
      <ScrollArea className="h-full p-4">
        <div className="space-y-4">
          {filteredStops.map((stop) => (
            <StopCard
              key={stop.id}
              name={stop.name}
              type={stop.type}
              rating={stop.rating}
              distance={stop.distance}
              duration={stop.duration}
              isAdded={addedStops.includes(stop.id)}
              onToggle={() => handleToggleStop(stop)}
              onClick={() => handleStopClick(stop)}
            />
          ))}
        </div>
      </ScrollArea>

      <Dialog open={selectedStop !== null} onOpenChange={handleCloseDetails}>
        <DialogContent className="p-0 max-w-[380px]">
          {selectedStop && (
            <StopDetails
              {...selectedStop}
              isAdded={addedStops.includes(selectedStop.id)}
              onClose={handleCloseDetails}
              onAddToRoute={() => handleToggleStop(selectedStop)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StopSuggestions;
