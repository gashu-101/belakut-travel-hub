
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const txRef = searchParams.get('tx_ref');
      const status = searchParams.get('status');
      const bookingId = searchParams.get('meta[booking_id]');

      if (status === 'success' && bookingId) {
        try {
          // Update booking status to confirmed
          const { error } = await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', bookingId);

          if (error) throw error;

          toast({
            title: "Booking Confirmed",
            description: "Your booking has been confirmed successfully",
          });
        } catch (error) {
          console.error('Error updating booking status:', error);
          toast({
            title: "Error",
            description: "Failed to confirm booking",
            variant: "destructive",
          });
        }
      }
    };

    handlePaymentCallback();
  }, [searchParams, toast]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
        <p className="text-muted-foreground">Please wait while we process your payment.</p>
      </div>
    </div>
  );
};

export default PaymentCallback;
