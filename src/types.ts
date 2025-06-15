
import type { Database } from './integrations/supabase/types';

export type Hotel = Database['public']['Tables']['hotels']['Row'];
export type Experience = Database['public']['Tables']['experiences']['Row'];
