
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Check, X } from 'lucide-react';
import { approvePayment } from '@/lib/notificationApi';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface BookingApprovalCardProps {
  booking: any;
  onApprove?: () => void;
}

const BookingApprovalCard = ({ booking, onApprove }: BookingApprovalCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approvePaymentMutation = useMutation({
    mutationFn: () => approvePayment(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      onApprove?.();
      toast({
        title: "Payment Approved",
        description: "The booking has been confirmed and the guest has been notified.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Booking #{booking.id.slice(0, 8)}</CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Check-in</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(booking.check_in_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Check-out</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(booking.check_out_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Guests</p>
              <p className="text-sm text-muted-foreground">{booking.guests_count}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              ${booking.total_amount}
            </span>
          </div>
        </div>

        {booking.special_requests && (
          <div>
            <p className="text-sm font-medium mb-1">Special Requests</p>
            <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
              {booking.special_requests}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span className="text-sm">Payment Approval Required</span>
          </div>
        </div>

        {!booking.payment_approved && booking.status === 'pending' && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => approvePaymentMutation.mutate()}
              disabled={approvePaymentMutation.isPending}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              {approvePaymentMutation.isPending ? 'Approving...' : 'Approve Payment'}
            </Button>
          </div>
        )}

        {booking.payment_approved && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              Payment approved on {format(new Date(booking.payment_approved_at), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingApprovalCard;
