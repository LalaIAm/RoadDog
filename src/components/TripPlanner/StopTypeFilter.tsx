import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Bed, UtensilsCrossed, Fuel, Landmark } from "lucide-react";

type StopType = "accommodations" | "food" | "gas" | "attractions";

interface StopTypeFilterProps {
  selectedTypes?: StopType[];
  onChange?: (types: StopType[]) => void;
}

const StopTypeFilter = ({
  selectedTypes = ["accommodations", "food", "gas", "attractions"],
  onChange = () => {},
}: StopTypeFilterProps) => {
  const [activeTypes, setActiveTypes] = useState<StopType[]>(selectedTypes);

  const toggleType = (type: StopType) => {
    const newTypes = activeTypes.includes(type)
      ? activeTypes.filter((t) => t !== type)
      : [...activeTypes, type];
    setActiveTypes(newTypes);
    onChange(newTypes);
  };

  const filterOptions = [
    {
      type: "accommodations" as StopType,
      icon: Bed,
      label: "Accommodations",
    },
    {
      type: "food" as StopType,
      icon: UtensilsCrossed,
      label: "Food",
    },
    {
      type: "gas" as StopType,
      icon: Fuel,
      label: "Gas",
    },
    {
      type: "attractions" as StopType,
      icon: Landmark,
      label: "Attractions",
    },
  ];

  return (
    <div className="w-[380px] h-[60px] bg-white rounded-lg shadow-sm p-2">
      <div className="flex justify-between items-center gap-2">
        {filterOptions.map(({ type, icon: Icon, label }) => (
          <Toggle
            key={type}
            pressed={activeTypes.includes(type)}
            onPressedChange={() => toggleType(type)}
            className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            aria-label={`Toggle ${label}`}
          >
            <div className="flex flex-col items-center gap-1">
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </div>
          </Toggle>
        ))}
      </div>
    </div>
  );
};

export default StopTypeFilter;
