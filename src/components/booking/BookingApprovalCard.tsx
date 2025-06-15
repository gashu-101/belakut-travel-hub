
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Clock, CheckCircle, User, Mail, Phone } from 'lucide-react';
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
  booker_name?: string;
  booker_email?: string;
  booker_phone?: string;
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
        title: "Payment Approved",
        description: "The guest has been notified and can now enjoy their stay.",
      });
    } catch (error) {
      toast({
        title: "Approval Failed",
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
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {booking.hotel_name}
          </CardTitle>
          <Badge 
            variant={booking.payment_approved ? "default" : "secondary"}
            className={booking.payment_approved 
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-0" 
              : "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0"
            }
          >
            {booking.payment_approved ? (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Approved
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending Review
              </div>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Guest Information */}
        {booking.booker_name && (
          <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Guest Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-600">Name:</span>
                <span className="text-slate-800">{booking.booker_name}</span>
              </div>
              {booking.booker_email && booking.booker_email !== 'Not provided' && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-600">{booking.booker_email}</span>
                </div>
              )}
              {booking.booker_phone && booking.booker_phone !== 'Not provided' && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-600">{booking.booker_phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-700">Check-in</p>
                <p className="text-slate-600">{formatDate(booking.check_in_date)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-700">Guests</p>
                <p className="text-slate-600">{booking.guest_count} people</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-slate-700">Check-out</p>
                <p className="text-slate-600">{formatDate(booking.check_out_date)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-700">Total Amount</p>
                <p className="text-xl font-bold text-green-600">{formatETB(booking.total_amount)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4 space-y-4">
          <p className="text-xs text-slate-500">
            Booking created: {formatDate(booking.created_at)}
          </p>
          
          {!booking.payment_approved && (
            <Button 
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-lg border-0"
            >
              {isApproving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Approving Payment...
                </div>
              ) : (
                'Approve Payment'
              )}
            </Button>
          )}
          
          {booking.payment_approved && (
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Payment Approved</p>
              <p className="text-green-600 text-sm">Guest can now enjoy their stay</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingApprovalCard;
