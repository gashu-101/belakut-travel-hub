
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ChapaPaymentProps {
  amount: number;
  hotelName: string;
  bookingId: string;
  onPaymentSuccess?: () => void;
}

const ChapaPayment = ({ amount, hotelName, bookingId, onPaymentSuccess }: ChapaPaymentProps) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create the form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://api.chapa.co/v1/hosted/pay';
    form.target = '_blank';

    const fields = {
      public_key: 'CHAPUBK_TEST-ZFEEL4p5bZel7nOv9TnR5u2jmMaQv3lQ',
      tx_ref: `booking-${bookingId}-${Date.now()}`,
      amount: amount.toString(),
      currency: 'ETB',
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      title: `Payment for ${hotelName}`,
      description: `Booking payment for ${hotelName}`,
      logo: 'https://chapa.link/asset/images/chapa_swirl.svg',
      callback_url: `${window.location.origin}/payment/callback`,
      return_url: `${window.location.origin}/payment/success`,
      'meta[booking_id]': bookingId,
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    toast({
      title: "Redirecting to Payment",
      description: "You will be redirected to Chapa payment gateway",
    });

    onPaymentSuccess?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total Amount:</span>
            <span className="text-xl font-bold">{amount} ETB</span>
          </div>
          
          <Button 
            onClick={handlePayment} 
            className="w-full" 
            size="lg"
          >
            Pay with Chapa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChapaPayment;
