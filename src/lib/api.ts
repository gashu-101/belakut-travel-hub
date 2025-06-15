import { supabase } from "@/integrations/supabase/client";
import { InsertHotel, InsertHotelRoom, InsertHotelHall, InsertHotelService, InsertHotelImage, InsertBooking, InsertBookingRoom, InsertReview } from "@/types";

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

export async function searchHotels(query: string) {
  console.log("Searching hotels with query:", query);
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .or(`name.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`);

  if (error) {
    console.error("Error searching hotels:", error);
    throw new Error(error.message);
  }
  console.log("Search results:", data);
  return data;
}

export async function searchExperiences(query: string) {
  console.log("Searching experiences with query:", query);
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .or(`name.ilike.%${query}%,location.ilike.%${query}%,category.ilike.%${query}%,provider.ilike.%${query}%`);

  if (error) {
    console.error("Error searching experiences:", error);
    throw new Error(error.message);
  }
  console.log("Search results:", data);
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

// Booking functions
export async function createBooking(bookingData: Omit<InsertBooking, 'user_id'>) {
  console.log("Creating booking:", bookingData);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated to create bookings");
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({ ...bookingData, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function addBookingRoom(roomData: InsertBookingRoom) {
  const { data, error } = await supabase
    .from("booking_rooms")
    .insert(roomData)
    .select()
    .single();

  if (error) {
    console.error("Error adding booking room:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getUserBookings() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      hotels(name, image, location),
      booking_rooms(*, hotel_rooms(room_type))
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user bookings:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getHotelBookings(hotelId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      booking_rooms(*, hotel_rooms(room_type))
    `)
    .eq("hotel_id", hotelId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching hotel bookings:", error);
    throw new Error(error.message);
  }

  return data;
}

// Review functions
export async function addReview(reviewData: Omit<InsertReview, 'user_id'>) {
  console.log("Adding review:", reviewData);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated to add reviews");
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({ ...reviewData, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Error adding review:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getHotelReviews(hotelId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching hotel reviews:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getUserHotels() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user hotels:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getExperiences() {
  console.log("Fetching all experiences...");
  const { data, error } = await supabase.from("experiences").select("*");

  if (error) {
    console.error("Error fetching experiences:", error);
    throw new Error(error.message);
  }
  console.log("Fetched experiences:", data);
  return data;
}
