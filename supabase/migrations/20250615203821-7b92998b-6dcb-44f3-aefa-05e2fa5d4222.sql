
-- Create notifications table for property owners
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info', -- 'info', 'booking', 'payment', 'warning'
  read boolean NOT NULL DEFAULT false,
  related_booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: System can create notifications for users
CREATE POLICY "Allow system to create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add payment approval fields to bookings table
ALTER TABLE public.bookings ADD COLUMN payment_approved boolean DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN payment_approved_by uuid REFERENCES auth.users(id);
ALTER TABLE public.bookings ADD COLUMN payment_approved_at timestamptz;

-- Create function to notify property owner when new booking is created
CREATE OR REPLACE FUNCTION public.notify_property_owner_new_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  -- Insert notification for the property owner
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    related_booking_id,
    metadata
  )
  SELECT 
    h.owner_id,
    'New Booking Received',
    'You have received a new booking for ' || h.name || '. Please review and approve the payment.',
    'booking',
    NEW.id,
    json_build_object(
      'hotel_name', h.name,
      'guest_count', NEW.guests_count,
      'check_in', NEW.check_in_date,
      'check_out', NEW.check_out_date,
      'total_amount', NEW.total_amount
    )::jsonb
  FROM public.hotels h
  WHERE h.id = NEW.hotel_id AND h.owner_id IS NOT NULL;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new booking notifications
CREATE TRIGGER on_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_property_owner_new_booking();
