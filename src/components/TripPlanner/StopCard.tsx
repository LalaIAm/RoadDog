import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Minus, MapPin } from "lucide-react";

type StopType = "accommodations" | "food" | "gas" | "attractions";

interface StopCardProps {
  name?: string;
  type?: StopType;
  rating?: number;
  distance?: string;
  nextStopDistance?: string;
  nextStopDuration?: string;
  duration?: string;
  isAdded?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}

const StopCard = ({
  name = "Sample Stop Location",
  type = "food",
  rating = 4.5,
  distance = "0.5 miles off route",
  nextStopDistance = "50 miles",
  nextStopDuration = "45 mins",
  duration = "5 mins detour",
  isAdded = false,
  onToggle = () => {},
  onClick = () => {},
}: StopCardProps) => {
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

  return (
    <Card
      className="w-[360px] h-[120px] p-4 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
            <Badge
              variant="secondary"
              className={`${typeColors[type]} text-xs px-2 py-0.5`}
            >
              {typeLabels[type]}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">{distance}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Next stop: {nextStopDistance}
              <span className="mx-1">•</span>
              {nextStopDuration}
            </div>
          </div>
        </div>

        <Button
          variant={isAdded ? "destructive" : "default"}
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isAdded ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isAdded ? "Remove stop" : "Add stop"}
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default StopCard;
