import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Clock, Phone, Globe, Navigation, X } from "lucide-react";

type StopType = "accommodations" | "food" | "gas" | "attractions";

interface StopDetailsProps {
  name?: string;
  type?: StopType;
  rating?: number;
  address?: string;
  distance?: string;
  duration?: string;
  phone?: string;
  website?: string;
  photos?: string[];
  isOpen?: boolean;
  hours?: string[];
  onClose?: () => void;
  onAddToRoute?: () => void;
  isAdded?: boolean;
}

const StopDetails = ({
  name = "Sample Location Name",
  type = "food",
  rating = 4.5,
  address = "123 Sample Street, City, State 12345",
  distance = "0.5 miles off route",
  duration = "5 mins detour",
  phone = "+1 (555) 123-4567",
  website = "https://example.com",
  photos = [
    "https://dummyimage.com/600x400/e0e0e0/666666&text=Photo+1",
    "https://dummyimage.com/600x400/e0e0e0/666666&text=Photo+2",
    "https://dummyimage.com/600x400/e0e0e0/666666&text=Photo+3",
  ],
  isOpen = true,
  hours = [
    "Monday: 9:00 AM - 9:00 PM",
    "Tuesday: 9:00 AM - 9:00 PM",
    "Wednesday: 9:00 AM - 9:00 PM",
    "Thursday: 9:00 AM - 9:00 PM",
    "Friday: 9:00 AM - 10:00 PM",
    "Saturday: 10:00 AM - 10:00 PM",
    "Sunday: 10:00 AM - 8:00 PM",
  ],
  onClose = () => {},
  onAddToRoute = () => {},
  isAdded = false,
}: StopDetailsProps) => {
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
    <Card className="w-[380px] h-[500px] bg-white overflow-hidden">
      <div className="relative h-[200px] bg-gray-100">
        <img
          src={photos[0]}
          alt={name}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[300px] p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{name}</h2>
              <Badge
                variant="secondary"
                className={`${typeColors[type]} text-xs px-2 py-0.5`}
              >
                {typeLabels[type]}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
              <Badge
                variant="outline"
                className={isOpen ? "text-green-600" : "text-red-600"}
              >
                {isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p>{address}</p>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Navigation className="h-3 w-3" />
                  <span className="text-xs">{distance}</span>
                  <Clock className="h-3 w-3 ml-2" />
                  <span className="text-xs">{duration}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <Phone className="h-4 w-4 text-muted-foreground" />
                {phone}
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                {website}
              </a>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-semibold">Hours</h3>
            <div className="text-sm space-y-1">
              {hours.map((hour, index) => (
                <p
                  key={index}
                  className="text-muted-foreground flex justify-between"
                >
                  {hour}
                </p>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-semibold">Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${name} photo ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          className="w-full"
          variant={isAdded ? "destructive" : "default"}
          onClick={onAddToRoute}
        >
          {isAdded ? "Remove from Route" : "Add to Route"}
        </Button>
      </div>
    </Card>
  );
};

export default StopDetails;
