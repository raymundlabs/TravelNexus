import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Component for the actual payment form
const CheckoutForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/booking-confirmation',
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // The payment was processed successfully client-side, but confirmation happens on return_url
        toast({
          title: "Processing Payment",
          description: "You'll be redirected to the confirmation page.",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4 pt-4">
        <PaymentElement />
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/booking-summary')}
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="min-w-[120px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Pay Now'
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

// Main checkout page component
export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const { toast } = useToast();
  const [, params] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      toast({
        title: "Authentication Required",
        description: "Please login to continue with checkout",
        variant: "destructive"
      });
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    const amount = urlParams.get('amount');

    if (!bookingId || !amount) {
      toast({
        title: "Invalid Request",
        description: "Missing required checkout parameters",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await apiRequest("GET", `/api/bookings/${bookingId}`);
        const data = await response.json();
        setBookingData(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast({
          title: "Error",
          description: "Could not load booking details",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("POST", "/api/payments/create-intent", { 
          bookingId: parseInt(bookingId), 
          amount: parseFloat(amount)
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast({
          title: "Payment Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive"
        });
        navigate('/booking-summary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
    createPaymentIntent();
  }, [authLoading, user, navigate, toast]);

  if (isLoading || authLoading || !bookingData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">Preparing your payment...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Payment Error</CardTitle>
            <CardDescription>Unable to initialize payment process</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/booking-summary')} className="w-full">
              Return to Booking Summary
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Format booking information for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Payment</h1>
      
      <div className="grid gap-8 md:grid-cols-5">
        {/* Booking Summary */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Review your booking details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{bookingData.bookingType === 'hotel' ? 'Hotel Booking' : 
                                              bookingData.bookingType === 'tour' ? 'Tour Booking' : 'Package Booking'}</h3>
                  <p className="text-muted-foreground text-sm">{bookingData.itemName}</p>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Dates</span>
                    <span className="text-sm font-medium">
                      {formatDate(bookingData.startDate)} - {formatDate(bookingData.endDate)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between mt-1">
                    <span className="text-sm">Guests</span>
                    <span className="text-sm font-medium">{bookingData.guests} {bookingData.guests > 1 ? 'people' : 'person'}</span>
                  </div>
                  
                  <div className="flex justify-between mt-3 font-medium">
                    <span>Total Amount</span>
                    <span>{formatCurrency(bookingData.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Payment Form */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Secure payment via Stripe</CardDescription>
            </CardHeader>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm booking={bookingData} />
            </Elements>
          </Card>
        </div>
      </div>
    </div>
  );
};