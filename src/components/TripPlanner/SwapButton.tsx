import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SwapButtonProps {
  onClick?: () => void;
}

const SwapButton = ({ onClick = () => {} }: SwapButtonProps) => {
  return (
    <div className="flex items-center justify-center bg-white w-10 h-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onClick}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="sr-only">Swap locations</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Swap start and end locations</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SwapButton;
