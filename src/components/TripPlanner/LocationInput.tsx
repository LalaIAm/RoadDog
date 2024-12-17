import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertCircle, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useJsApiLoader } from "@react-google-maps/api";
import { loadScriptOptions } from "@/lib/google-maps";

interface LocationInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  onChange?: (value: string) => void;
}

const LocationInput = ({
  label = "Location",
  placeholder = "Enter a location",
  error,
  value = "",
  onChange = () => {},
}: LocationInputProps) => {
  const { isLoaded } = useJsApiLoader(loadScriptOptions);
  const [open, setOpen] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  useEffect(() => {
    if (error) {
      setOpen(false);
    }
  }, [error]);

  useEffect(() => {
    if (!value.trim() || !isLoaded) {
      setPredictions([]);
      return;
    }

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      {
        input: value,
        types: ["geocode"],
      },
      (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results
        ) {
          setPredictions(results);
        } else {
          setPredictions([]);
        }
      },
    );
  }, [value, isLoaded]);

  return (
    <div className="w-full space-y-2 bg-white p-2 rounded-md">
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </AlertDescription>
        </Alert>
      )}
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center w-full">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full"
            />
            <MapPin className="absolute right-4 h-4 w-4 text-muted-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search location..." />
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {predictions.map((prediction) => (
                <CommandItem
                  key={prediction.place_id}
                  onSelect={() => {
                    onChange(prediction.description);
                    setOpen(false);
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {prediction.description}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationInput;
