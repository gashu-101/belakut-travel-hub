
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hotel_id UUID REFERENCES public.hotels(id) NOT NULL,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('individual', 'group', 'trip')),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking_rooms table for room selections
CREATE TABLE public.booking_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES public.hotel_rooms(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_per_night DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Hotel owners can view bookings for their hotels
CREATE POLICY "Hotel owners can view bookings for their hotels" 
  ON public.bookings 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.hotels 
    WHERE hotels.id = bookings.hotel_id 
    AND hotels.owner_id = auth.uid()
  ));

-- Add RLS policies for booking_rooms
ALTER TABLE public.booking_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their booking rooms" 
  ON public.booking_rooms 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_rooms.booking_id 
    AND bookings.user_id = auth.uid()
  ));

CREATE POLICY "Users can create booking rooms for their bookings" 
  ON public.booking_rooms 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_rooms.booking_id 
    AND bookings.user_id = auth.uid()
  ));

-- Update reviews table to ensure proper RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX idx_booking_rooms_booking_id ON public.booking_rooms(booking_id);
CREATE INDEX idx_reviews_hotel_id ON public.reviews(hotel_id);
