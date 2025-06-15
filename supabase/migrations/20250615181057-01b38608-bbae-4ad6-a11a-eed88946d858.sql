
-- Create enum types for room types and service categories
CREATE TYPE public.room_type AS ENUM ('Standard Rooms', 'Deluxe Rooms', 'Suites', 'Family Rooms', 'Bridal Rooms');
CREATE TYPE public.hall_type AS ENUM ('Meeting Rooms', 'Conference Rooms', 'Banquet Room');
CREATE TYPE public.service_category AS ENUM ('Restaurants', 'Spa/Massage', 'Swimming Pools', 'Game zones', 'Shops', 'Gym', 'Parking', 'Boating', 'Transportation', 'Wifi');

-- Create rooms table for detailed room information
CREATE TABLE public.hotel_rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type public.room_type NOT NULL,
  total_numbers integer NOT NULL DEFAULT 0,
  features text[],
  price numeric(10, 2),
  additional_services text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create halls table for meeting/conference rooms
CREATE TABLE public.hotel_halls (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  hall_type public.hall_type NOT NULL,
  accommodation_limit text,
  price numeric(10, 2),
  additional_services text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create services table for all hotel services
CREATE TABLE public.hotel_services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  service_category public.service_category NOT NULL,
  service_name text NOT NULL,
  description text,
  features text[],
  price numeric(10, 2),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create hotel images table for multiple image uploads
CREATE TABLE public.hotel_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  image_type text DEFAULT 'general', -- 'main', 'room', 'service', 'general'
  caption text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.hotel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_images ENABLE ROW LEVEL SECURITY;

-- Create policies for hotel rooms
CREATE POLICY "Allow public read access to hotel rooms" ON public.hotel_rooms FOR SELECT USING (true);
CREATE POLICY "Allow hotel owners to manage rooms" ON public.hotel_rooms FOR ALL USING (
  EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = hotel_rooms.hotel_id AND hotels.owner_id = auth.uid())
);

-- Create policies for hotel halls
CREATE POLICY "Allow public read access to hotel halls" ON public.hotel_halls FOR SELECT USING (true);
CREATE POLICY "Allow hotel owners to manage halls" ON public.hotel_halls FOR ALL USING (
  EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = hotel_halls.hotel_id AND hotels.owner_id = auth.uid())
);

-- Create policies for hotel services
CREATE POLICY "Allow public read access to hotel services" ON public.hotel_services FOR SELECT USING (true);
CREATE POLICY "Allow hotel owners to manage services" ON public.hotel_services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = hotel_services.hotel_id AND hotels.owner_id = auth.uid())
);

-- Create policies for hotel images
CREATE POLICY "Allow public read access to hotel images" ON public.hotel_images FOR SELECT USING (true);
CREATE POLICY "Allow hotel owners to manage images" ON public.hotel_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.hotels WHERE hotels.id = hotel_images.hotel_id AND hotels.owner_id = auth.uid())
);

-- Create storage bucket for hotel images
INSERT INTO storage.buckets (id, name, public) VALUES ('hotel-images', 'hotel-images', true);

-- Create storage policy for hotel images
CREATE POLICY "Allow authenticated users to upload hotel images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'hotel-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to hotel images" ON storage.objects
FOR SELECT USING (bucket_id = 'hotel-images');

CREATE POLICY "Allow hotel owners to update their images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'hotel-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow hotel owners to delete their images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'hotel-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
