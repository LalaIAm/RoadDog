import { createContext, useContext, useReducer, ReactNode } from "react";
import type { Stop } from "@/types/database";

type StopType = "accommodations" | "food" | "gas" | "attractions";

interface RouteState {
  startLocation: string;
  endLocation: string;
  selectedStops: Stop[];
  availableStops: Stop[];
  intervalType: "time" | "distance";
  intervalValue: number;
  selectedTypes: StopType[];
  directions: google.maps.DirectionsResult | null;
}

type RouteAction =
  | { type: "SET_LOCATIONS"; payload: { start: string; end: string } }
  | { type: "ADD_STOP"; payload: Stop }
  | { type: "REMOVE_STOP"; payload: string }
  | { type: "SET_STOPS_ORDER"; payload: Stop[] }
  | { type: "SET_AVAILABLE_STOPS"; payload: Stop[] }
  | {
      type: "SET_INTERVAL";
      payload: { type: "time" | "distance"; value: number };
    }
  | { type: "SET_SELECTED_TYPES"; payload: StopType[] }
  | { type: "SET_DIRECTIONS"; payload: google.maps.DirectionsResult | null };

const initialState: RouteState = {
  startLocation: "New York, NY, USA",
  endLocation: "Los Angeles, CA, USA",
  selectedStops: [],
  availableStops: [],
  intervalType: "time",
  intervalValue: 2,
  selectedTypes: ["food", "gas"],
  directions: null,
};

function routeReducer(state: RouteState, action: RouteAction): RouteState {
  switch (action.type) {
    case "SET_LOCATIONS":
      return {
        ...state,
        startLocation: action.payload.start,
        endLocation: action.payload.end,
      };
    case "ADD_STOP":
      return {
        ...state,
        selectedStops: [...state.selectedStops, action.payload],
      };
    case "REMOVE_STOP":
      return {
        ...state,
        selectedStops: state.selectedStops.filter(
          (stop) => stop.id !== action.payload,
        ),
      };
    case "SET_STOPS_ORDER":
      return {
        ...state,
        selectedStops: action.payload,
      };
    case "SET_AVAILABLE_STOPS":
      return {
        ...state,
        availableStops: action.payload,
      };
    case "SET_INTERVAL":
      return {
        ...state,
        intervalType: action.payload.type,
        intervalValue: action.payload.value,
      };
    case "SET_SELECTED_TYPES":
      return {
        ...state,
        selectedTypes: action.payload,
      };
    case "SET_DIRECTIONS":
      return {
        ...state,
        directions: action.payload,
      };
    default:
      return state;
  }
}

const RouteContext = createContext<{
  state: RouteState;
  dispatch: React.Dispatch<RouteAction>;
} | null>(null);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(routeReducer, initialState);

  return (
    <RouteContext.Provider value={{ state, dispatch }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
}
