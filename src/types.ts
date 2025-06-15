
import type { Database, TablesInsert } from './integrations/supabase/types';

export type Hotel = Database['public']['Tables']['hotels']['Row'];
export type InsertHotel = TablesInsert<'hotels'>;
export type Experience = Database['public']['Tables']['experiences']['Row'];
