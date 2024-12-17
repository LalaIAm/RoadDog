import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IntervalInputProps {
  value?: number;
  unit?: "hours" | "miles";
  onChange?: (value: number) => void;
  error?: string;
}

const IntervalInput = ({
  value = 2,
  unit = "hours",
  onChange = () => {},
  error,
}: IntervalInputProps) => {
  return (
    <div className="w-[200px] h-[40px] bg-white rounded-md relative">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            type="number"
            min={1}
            max={unit === "hours" ? 12 : 500}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`pr-16 ${error ? "border-red-500" : ""}`}
            placeholder={`Enter ${unit}`}
          />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Label className="text-sm text-muted-foreground">{unit}</Label>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default IntervalInput;
