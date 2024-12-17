import { LoadScriptProps } from "@react-google-maps/api";

export const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export const defaultMapOptions: google.maps.MapOptions = {
  zoom: 4,
  center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

export const loadScriptOptions: LoadScriptProps = {
  googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  libraries: ["places", "geometry"],
};
