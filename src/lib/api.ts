
import { supabase } from "@/integrations/supabase/client";
import { InsertHotel } from "@/types";

export async function getHotels() {
  console.log("Fetching all hotels...");
  const { data, error } = await supabase.from("hotels").select("*");

  if (error) {
    console.error("Error fetching hotels:", error);
    throw new Error(error.message);
  }
  console.log("Fetched hotels:", data);
  return data;
}

export async function getFeaturedHotels() {
  console.log("Fetching featured hotels...");
  const { data, error } = await supabase.from("hotels").select("*").limit(4);

  if (error) {
    console.error("Error fetching featured hotels:", error);
    throw new Error(error.message);
  }
  console.log("Fetched featured hotels:", data);
  return data;
}

export async function getHotelById(id: string) {
  console.log("Fetching hotel by id:", id);
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching hotel with id ${id}:`, error);
    throw new Error(error.message);
  }
  console.log("Fetched hotel by id:", data);
  return data;
}

export async function addHotel(hotelData: InsertHotel) {
  console.log("Attempting to add hotel:", hotelData);
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("User not authenticated");
    throw new Error("User must be authenticated to add hotels");
  }
  
  console.log("User authenticated:", user.id);
  
  const { data, error } = await supabase
    .from("hotels")
    .insert(hotelData)
    .select()
    .single();

  if (error) {
    console.error("Error adding hotel:", error);
    console.error("Error details:", error.details, error.hint, error.code);
    throw new Error(error.message);
  }

  console.log("Successfully added hotel:", data);
  return data;
}
