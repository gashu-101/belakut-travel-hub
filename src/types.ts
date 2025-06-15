
import type { Database, TablesInsert } from './integrations/supabase/types';

export type Hotel = Database['public']['Tables']['hotels']['Row'];
export type InsertHotel = TablesInsert<'hotels'>;
export type Experience = Database['public']['Tables']['experiences']['Row'];

// New types for the detailed hotel management
export type HotelRoom = Database['public']['Tables']['hotel_rooms']['Row'];
export type InsertHotelRoom = TablesInsert<'hotel_rooms'>;
export type HotelHall = Database['public']['Tables']['hotel_halls']['Row'];
export type InsertHotelHall = TablesInsert<'hotel_halls'>;
export type HotelService = Database['public']['Tables']['hotel_services']['Row'];
export type InsertHotelService = TablesInsert<'hotel_services'>;
export type HotelImage = Database['public']['Tables']['hotel_images']['Row'];
export type InsertHotelImage = TablesInsert<'hotel_images'>;
