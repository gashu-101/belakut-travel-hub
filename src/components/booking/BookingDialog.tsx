
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, Heart, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBooking } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Hotel } from '@/types';
import { formatETB } from '@/lib/currency';
import ChapaPayment from '@/components/payment/ChapaPayment';
import FloatingHearts from '@/components/ui/floating-hearts';
import SuccessAnimation from '@/components/ui/success-animation';

const bookingSchema = z.object({
  checkInDate: z.date({ required_error: "Check-in date is required" }),
  checkOutDate: z.date({ required_error: "Check-out date is required" }),
  guestsCount: z.number().min(1, "At least 1 guest required").max(20, "Maximum 20 guests"),
  specialRequests: z.string().optional(),
}).refine((data) => data.checkOutDate > data.checkInDate, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"],
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingDialogProps {
  hotel: Hotel;
  children: React.ReactNode;
}

const BookingDialog = ({ hotel, children }: BookingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [showHearts, setShowHearts] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestsCount: 1,
      specialRequests: '',
    },
  });

  const calculateTotal = (checkIn: Date, checkOut: Date, guests: number) => {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = 2500; // Base price per night in ETB
    return nights * basePrice * guests;
  };

  const watchedValues = form.watch();
  const totalAmount = watchedValues.checkInDate && watchedValues.checkOutDate 
    ? calculateTotal(watchedValues.checkInDate, watchedValues.checkOutDate, watchedValues.guestsCount || 1)
    : 0;

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      const booking = await createBooking({
        hotel_id: hotel.id,
        check_in_date: format(data.checkInDate, 'yyyy-MM-dd'),
        check_out_date: format(data.checkOutDate, 'yyyy-MM-dd'),
        guests_count: data.guestsCount,
        special_requests: data.specialRequests || null,
        total_amount: totalAmount,
        booking_type: 'hotel',
        status: 'pending',
      });

      setBookingId(booking.id);
      setShowPayment(true);
      setShowHearts(true);
      
      // Notify property owner
      await notifyPropertyOwner(hotel.owner_id, booking.id, hotel.name);

      toast({
        title: "🎉 Booking Created Successfully!",
        description: "Your adventure awaits! Please proceed to payment to secure your stay.",
      });
    } catch (error) {
      toast({
        title: "😔 Booking Failed",
        description: error instanceof Error ? error.message : "Something went wrong, please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const notifyPropertyOwner = async (ownerId: string | null, bookingId: string, hotelName: string) => {
    if (!ownerId) return;
    console.log(`Notifying owner ${ownerId} about new booking ${bookingId} for ${hotelName}`);
  };

  const handlePaymentSuccess = () => {
    setOpen(false);
    setShowPayment(false);
    setShowSuccess(true);
    form.reset();
    
    setTimeout(() => setShowSuccess(false), 3000);
    
    toast({
      title: "💳 Payment Processing",
      description: "Your payment is being processed with love and care ✨",
    });
  };

  if (showPayment && bookingId) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50 to-purple-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              Complete Your Dream Stay ✨
            </DialogTitle>
          </DialogHeader>
          <ChapaPayment
            amount={totalAmount}
            hotelName={hotel.name}
            bookingId={bookingId}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
              Book Your Perfect Stay
              <Sparkles className="w-5 h-5 text-yellow-500 animate-spin" />
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="checkInDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-semibold text-gray-700">Check-in Date 📅</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal border-2 hover:border-green-400 transition-all duration-300",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick your arrival 🌅</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkOutDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-semibold text-gray-700">Check-out Date 📅</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal border-2 hover:border-blue-400 transition-all duration-300",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick departure 🌅</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || (form.watch('checkInDate') && date <= form.watch('checkInDate'))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="guestsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Number of Guests 👥
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        className="border-2 focus:border-purple-400 transition-all duration-300"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Special Requests 💝</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us how we can make your stay extra special... 🌟"
                        className="min-h-[80px] border-2 focus:border-pink-400 transition-all duration-300"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {totalAmount > 0 && (
                <div className="border-2 border-dashed border-green-300 rounded-xl p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">{formatETB(totalAmount)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">✨ Includes all taxes and fees</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="flex-1 border-2 hover:bg-gray-50 transition-all duration-300"
                >
                  Maybe Later 🤔
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {isLoading ? "Creating Magic... ✨" : "Book My Dream Stay! 🎉"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <FloatingHearts trigger={showHearts} />
      <SuccessAnimation 
        show={showSuccess} 
        message="Your booking is confirmed! Get ready for an amazing experience!" 
      />
    </>
  );
};

export default BookingDialog;
