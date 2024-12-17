export type Stop = {
  id: string;
  created_at: string;
  name: string;
  type: "accommodations" | "food" | "gas" | "attractions";
  rating: number;
  distance: string;
  duration: string;
  address: string;
  phone: string;
  website: string;
  photos: string[];
  is_open: boolean;
  hours: string[];
};
