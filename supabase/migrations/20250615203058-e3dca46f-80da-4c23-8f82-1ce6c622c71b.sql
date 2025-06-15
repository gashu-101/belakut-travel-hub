
-- Drop the constraint completely first
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_booking_type_check;

-- Update any problematic booking types to 'hotel'
UPDATE public.bookings SET booking_type = 'hotel' WHERE booking_type NOT IN ('hotel', 'experience');

-- Add the new constraint
ALTER TABLE public.bookings ADD CONSTRAINT bookings_booking_type_check 
CHECK (booking_type IN ('hotel', 'experience'));
