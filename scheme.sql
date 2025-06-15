
-- Create an enum type for hotel types for consistency
CREATE TYPE public.hotel_type AS ENUM ('Hotel', 'Resort', 'Lodge', 'Guesthouse');

-- Create an enum type for price ranges
CREATE TYPE public.price_range AS ENUM ('$$', '$$$', '$$$$');

-- Create the 'hotels' table
CREATE TABLE public.hotels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  type public.hotel_type,
  location text NOT NULL,
  price_range public.price_range,
  rating numeric(2, 1) CHECK (rating >= 0 AND rating <= 5),
  image text,
  gallery text[],
  description text,
  amenities text[]
);
-- Enable Row Level Security for hotels
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
-- Allow public read access to all hotels
CREATE POLICY "Allow public read access to hotels" ON public.hotels FOR SELECT USING (true);


-- Create the 'experiences' table
CREATE TABLE public.experiences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  provider text,
  location text,
  price_per_guest numeric,
  category text,
  duration text,
  rating numeric(2, 1) CHECK (rating >= 0 AND rating <= 5),
  image text
);
-- Enable Row Level Security for experiences
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
-- Allow public read access to all experiences
CREATE POLICY "Allow public read access to experiences" ON public.experiences FOR SELECT USING (true);


-- Create the 'reviews' table
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE CASCADE,
  experience_id uuid REFERENCES public.experiences(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  photos text[],
  CONSTRAINT review_target_check CHECK (num_nonnulls(hotel_id, experience_id) = 1)
);
-- Enable Row Level Security for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
-- Allow public read access to all reviews
CREATE POLICY "Allow public read access to reviews" ON public.reviews FOR SELECT USING (true);
-- Allow authenticated users to insert their own reviews
CREATE POLICY "Allow authenticated users to create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Allow users to update their own reviews
CREATE POLICY "Allow users to update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
-- Allow users to delete their own reviews
CREATE POLICY "Allow users to delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

