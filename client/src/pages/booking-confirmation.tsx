import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function BookingConfirmation() {
  const [location] = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [bookingStatus, setBookingStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [booking, setBooking] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    // Extract payment_intent and payment_intent_client_secret from URL
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const paymentIntentId = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    if (!paymentIntentId || !paymentIntentClientSecret) {
      toast({
        title: "Invalid Request",
        description: "Missing payment information. Please try booking again.",
        variant: "destructive"
      });
      setBookingStatus('error');
      return;
    }

    const verifyPayment = async () => {
      try {
        // Call API to verify the payment and update booking status
        const response = await apiRequest(
          "POST", 
          "/api/payments/verify", 
          { paymentIntentId, status: redirectStatus }
        );
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setBooking(data.booking);
        setPaymentIntent(data.paymentIntent);
        setBookingStatus(data.success ? 'success' : 'error');
        
        // Invalidate bookings cache to reflect the updated booking
        queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
        
        if (data.success) {
          toast({
            title: "Payment Successful",
            description: "Your booking has been confirmed!",
          });
        } else {
          toast({
            title: "Payment Issue",
            description: data.message || "There was an issue with your payment.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setBookingStatus('error');
        toast({
          title: "Verification Failed",
          description: "We couldn't verify your payment. Please contact support.",
          variant: "destructive"
        });
      }
    };

    verifyPayment();
  }, [location, navigate, toast, authLoading, user]);

  const renderBookingDetails = () => {
    if (!booking) return null;

    return (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="font-medium">Booking Reference:</div>
          <div>{booking.bookingReference}</div>
          
          <div className="font-medium">Booking Type:</div>
          <div className="capitalize">{booking.bookingType}</div>
          
          <div className="font-medium">Item:</div>
          <div>{booking.itemName}</div>
          
          <div className="font-medium">Check-in/Start Date:</div>
          <div>{formatDate(booking.startDate)}</div>
          
          <div className="font-medium">Check-out/End Date:</div>
          <div>{formatDate(booking.endDate)}</div>
          
          <div className="font-medium">Guests:</div>
          <div>{booking.guests}</div>
          
          <div className="font-medium">Total Amount:</div>
          <div className="font-bold">{formatCurrency(booking.totalPrice)}</div>
        </div>
        
        {booking.notes && (
          <div>
            <div className="font-medium">Additional Notes:</div>
            <div className="mt-1">{booking.notes}</div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (bookingStatus) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg">Verifying your payment...</p>
          </div>
        );
        
      case 'success':
        return (
          <Card>
            <CardHeader className="text-center bg-primary/5">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
              <CardDescription>Your payment was processed successfully</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              {renderBookingDetails()}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
              <Button onClick={() => navigate('/account/bookings')}>
                View My Bookings
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 'error':
        return (
          <Card>
            <CardHeader className="text-center bg-destructive/5">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Payment Issue</CardTitle>
              <CardDescription>
                There was a problem processing your payment
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <p>
                Your booking may not be confirmed. Please check your email for details or contact our customer support team for assistance.
              </p>
              
              {booking && renderBookingDetails()}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
              <Button 
                variant="default" 
                onClick={() => navigate('/contact')}
              >
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="container py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Booking Confirmation</h1>
      {renderContent()}
    </div>
  );
}