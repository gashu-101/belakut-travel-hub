
import type { Database, TablesInsert } from './integrations/supabase/types';

export type Hotel = Database['public']['Tables']['hotels']['Row'];
export type InsertHotel = TablesInsert<'hotels'>;
export type Experience = Database['public']['Tables']['experiences']['Row'];

// Hotel management types
export type HotelRoom = Database['public']['Tables']['hotel_rooms']['Row'];
export type InsertHotelRoom = TablesInsert<'hotel_rooms'>;
export type HotelHall = Database['public']['Tables']['hotel_halls']['Row'];
export type InsertHotelHall = TablesInsert<'hotel_halls'>;
export type HotelService = Database['public']['Tables']['hotel_services']['Row'];
export type InsertHotelService = TablesInsert<'hotel_services'>;
export type HotelImage = Database['public']['Tables']['hotel_images']['Row'];
export type InsertHotelImage = TablesInsert<'hotel_images'>;

// Booking types
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type InsertBooking = TablesInsert<'bookings'>;
export type BookingRoom = Database['public']['Tables']['booking_rooms']['Row'];
export type InsertBookingRoom = TablesInsert<'booking_rooms'>;

// Review types
export type Review = Database['public']['Tables']['reviews']['Row'];
export type InsertReview = TablesInsert<'reviews'>;
