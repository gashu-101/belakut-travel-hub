import { supabase } from "@/integrations/supabase/client";
import { InsertHotel } from "@/types";

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

export async function addHotel(hotelData: InsertHotel) {
  console.log("Attempting to add hotel:", hotelData);
  const { data, error } = await supabase
    .from("hotels")
    .insert(hotelData)
    .select()
    .single();

  if (error) {
    console.error("Error adding hotel:", error);
    throw new Error(error.message);
  }

  console.log("Successfully added hotel:", data);
  return data;
}
