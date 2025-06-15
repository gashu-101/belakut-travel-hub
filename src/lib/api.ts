
import { supabase } from "@/integrations/supabase/client";
import { InsertHotel, InsertHotelRoom, InsertHotelHall, InsertHotelService, InsertHotelImage } from "@/types";

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
    .select(`
      *,
      hotel_rooms(*),
      hotel_halls(*),
      hotel_services(*),
      hotel_images(*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching hotel with id ${id}:`, error);
    throw new Error(error.message);
  }
  console.log("Fetched hotel by id:", data);
  return data;
}

export async function uploadHotelImage(file: File, hotelId?: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated to upload images");
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${hotelId || 'temp'}_${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('hotel-images')
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error(error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('hotel-images')
    .getPublicUrl(data.path);

  return publicUrl;
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

export async function addHotelRoom(roomData: InsertHotelRoom) {
  const { data, error } = await supabase
    .from("hotel_rooms")
    .insert(roomData)
    .select()
    .single();

  if (error) {
    console.error("Error adding hotel room:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function addHotelHall(hallData: InsertHotelHall) {
  const { data, error } = await supabase
    .from("hotel_halls")
    .insert(hallData)
    .select()
    .single();

  if (error) {
    console.error("Error adding hotel hall:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function addHotelService(serviceData: InsertHotelService) {
  const { data, error } = await supabase
    .from("hotel_services")
    .insert(serviceData)
    .select()
    .single();

  if (error) {
    console.error("Error adding hotel service:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function addHotelImage(imageData: InsertHotelImage) {
  const { data, error } = await supabase
    .from("hotel_images")
    .insert(imageData)
    .select()
    .single();

  if (error) {
    console.error("Error adding hotel image:", error);
    throw new Error(error.message);
  }

  return data;
}
