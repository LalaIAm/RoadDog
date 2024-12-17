import { supabase } from "./supabase";
import type { Stop } from "@/types/database";

export async function getStops() {
  const { data, error } = await supabase.from("stops").select("*");

  if (error) throw error;
  return data as Stop[];
}

export async function addStop(stop: Omit<Stop, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("stops")
    .insert(stop)
    .select()
    .single();

  if (error) throw error;
  return data as Stop;
}

export async function removeStop(id: string) {
  const { error } = await supabase.from("stops").delete().eq("id", id);

  if (error) throw error;
}
