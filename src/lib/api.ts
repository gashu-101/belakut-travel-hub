
import { supabase } from "@/integrations/supabase/client";

export async function getHotels() {
  const { data, error } = await supabase.from("hotels").select("*");

  if (error) {
    console.error("Error fetching hotels:", error);
    throw new Error(error.message);
  }
  return data;
}

export async function getFeaturedHotels() {
    const { data, error } = await supabase.from("hotels").select("*").limit(4);

    if (error) {
      console.error("Error fetching featured hotels:", error);
      throw new Error(error.message);
    }
    return data;
}

export async function getHotelById(id: string) {
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching hotel with id ${id}:`, error);
    throw new Error(error.message);
  }
  return data;
}
