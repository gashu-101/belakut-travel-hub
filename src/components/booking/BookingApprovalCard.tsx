
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Clock, CheckCircle, Heart } from 'lucide-react';
import { formatETB } from '@/lib/currency';
import { approvePayment } from '@/lib/notificationApi';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Booking {
  id: string;
  hotel_name: string;
  guest_count: number;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_approved: boolean;
}

interface BookingApprovalCardProps {
  booking: Booking;
  onApprove: () => void;
}

const BookingApprovalCard = ({ booking, onApprove }: BookingApprovalCardProps) => {
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approvePayment(booking.id);
      onApprove();
      toast({
        title: "🎉 Payment Approved!",
        description: "The guest has been notified and can now enjoy their stay!",
      });
    } catch (error) {
      toast({
        title: "😔 Approval Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
            {booking.hotel_name}
          </CardTitle>
          <Badge 
            variant={booking.payment_approved ? "default" : "secondary"}
            className={booking.payment_approved 
              ? "bg-green-100 text-green-700 border-green-300" 
              : "bg-yellow-100 text-yellow-700 border-yellow-300"
            }
          >
            {booking.payment_approved ? (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Approved ✅
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending Review ⏳
              </div>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-medium text-gray-700">Check-in</p>
                <p className="text-gray-600">{formatDate(booking.check_in_date)} 📅</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-green-500" />
              <div>
                <p className="font-medium text-gray-700">Guests</p>
                <p className="text-gray-600">{booking.guest_count} people 👥</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-red-500" />
              <div>
                <p className="font-medium text-gray-700">Check-out</p>
                <p className="text-gray-600">{formatDate(booking.check_out_date)} 📅</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-purple-500" />
              <div>
                <p className="font-medium text-gray-700">Total Amount</p>
                <p className="text-xl font-bold text-green-600">{formatETB(booking.total_amount)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 mb-3">
            📆 Booking created: {formatDate(booking.created_at)}
          </p>
          
          {!booking.payment_approved && (
            <Button 
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {isApproving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Approving Payment... ✨
                </div>
              ) : (
                '🎉 Approve Payment'
              )}
            </Button>
          )}
          
          {booking.payment_approved && (
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Payment Approved! 🎉</p>
              <p className="text-green-600 text-sm">Guest can now enjoy their stay</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingApprovalCard;
