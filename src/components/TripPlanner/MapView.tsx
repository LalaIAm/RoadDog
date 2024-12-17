import { MapPin } from "lucide-react";

interface MapViewProps {
  startLocation?: string;
  endLocation?: string;
  routePath?: { lat: number; lng: number }[];
}

const MapView = ({
  startLocation = "New York, NY, USA",
  endLocation = "Los Angeles, CA, USA",
  routePath = [],
}: MapViewProps) => {
  return (
    <div className="relative w-full h-full min-h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Placeholder map image */}
      <div className="absolute inset-0 bg-[url('https://dummyimage.com/1512x982/e5e7eb/666666&text=Map+View')]">
        {/* Start location marker */}
        <div className="absolute left-1/4 top-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center">
            <MapPin className="h-8 w-8 text-blue-500" />
            <div className="bg-white px-2 py-1 rounded-md shadow-md mt-1 text-sm">
              {startLocation}
            </div>
          </div>
        </div>

        {/* End location marker */}
        <div className="absolute right-1/4 bottom-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center">
            <MapPin className="h-8 w-8 text-red-500" />
            <div className="bg-white px-2 py-1 rounded-md shadow-md mt-1 text-sm">
              {endLocation}
            </div>
          </div>
        </div>

        {/* Placeholder route line */}
        <div className="absolute left-1/4 top-1/3 right-1/4 bottom-1/3 pointer-events-none">
          <svg className="w-full h-full">
            <path
              d="M 0 0 L 100% 100%"
              stroke="#4B5563"
              strokeWidth="3"
              strokeDasharray="8 8"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Map controls placeholder */}
      <div className="absolute right-4 top-4 bg-white rounded-lg shadow-md p-2 space-y-2">
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <span className="sr-only">Zoom in</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <span className="sr-only">Zoom out</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapView;
