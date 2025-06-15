
import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const status = searchParams.get('status');

  useEffect(() => {
    // Here you would typically verify the payment with your backend
    // and update the booking status
    console.log('Payment completed:', { txRef, status });
  }, [txRef, status]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your payment has been processed successfully. 
              The property owner has been notified of your booking.
            </p>
            {txRef && (
              <p className="text-sm text-muted-foreground">
                Transaction Reference: {txRef}
              </p>
            )}
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/hotels">Browse More Hotels</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
