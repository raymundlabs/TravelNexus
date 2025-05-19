import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { type Hotel } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CalendarIcon, 
  Check, 
  Star,
  MapPin,
  Wifi,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  Globe,
  Users,
  BedDouble,
  Bath,
  Home,
  Maximize2,
  Mountain,
  ArrowRight,
  ThumbsUp,
  Camera,
  CreditCard,
  Wallet,
  ShoppingCart,
  ArrowLeft,
  Clock,
  Ban,
  Heart,
  Award,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { SITE_NAME } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Sample room types with more Agoda-like details
const roomTypes = [
  {
    id: 1,
    name: "Standard Room",
    description: "Comfortable room with essential amenities",
    price: 50,
    beds: "1 Queen Bed",
    size: "28 sq m",
    occupancy: "2 Guests",
    maxOccupancy: 2,
    amenities: ["Free WiFi", "TV", "Air Conditioning", "Private Bathroom"],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    view: "City View",
    freeCancellation: true,
    cancellationDeadline: "24 hours before check-in",
    breakfast: false,
    payLater: true,
    perks: ["Free WiFi", "24-hour check-in"],
    available: 5,
    popular: false
  },
  {
    id: 2,
    name: "Deluxe Room",
    description: "Spacious room with additional comfort amenities",
    price: 75,
    beds: "1 King Bed",
    size: "35 sq m",
    occupancy: "2 Guests",
    maxOccupancy: 2,
    amenities: ["Free WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Coffee Machine"],
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
    view: "Partial Ocean View",
    freeCancellation: true,
    cancellationDeadline: "48 hours before check-in",
    breakfast: true,
    payLater: true,
    perks: ["Free WiFi", "Free breakfast", "24-hour check-in"],
    available: 3,
    popular: true
  },
  {
    id: 3,
    name: "Premium Suite",
    description: "Luxury suite with separate living area and premium amenities",
    price: 125,
    beds: "1 King Bed + 1 Sofa Bed",
    size: "50 sq m",
    occupancy: "3 Guests",
    maxOccupancy: 3,
    amenities: ["Free WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Coffee Machine", "Bathtub", "Lounge Area"],
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    view: "Ocean View",
    freeCancellation: true,
    cancellationDeadline: "72 hours before check-in",
    breakfast: true,
    payLater: true,
    perks: ["Free WiFi", "Free breakfast", "24-hour check-in", "Welcome drink"],
    available: 1,
    popular: false
  },
  {
    id: 4,
    name: "Family Room",
    description: "Perfect for families with spacious layout and kid-friendly amenities",
    price: 140,
    beds: "2 Queen Beds",
    size: "45 sq m",
    occupancy: "4 Guests",
    maxOccupancy: 4,
    amenities: ["Free WiFi", "TV", "Air Conditioning", "Private Bathroom", "Mini Bar", "Refrigerator", "Kid's Play Area"],
    imageUrl: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
    view: "Garden View",
    freeCancellation: true,
    cancellationDeadline: "48 hours before check-in",
    breakfast: true,
    payLater: true,
    perks: ["Free WiFi", "Free breakfast", "Kids stay free"],
    available: 2,
    popular: false
  },
  {
    id: 5,
    name: "Budget Single",
    description: "Cozy single room perfect for solo travelers",
    price: 35,
    beds: "1 Single Bed",
    size: "18 sq m",
    occupancy: "1 Guest",
    maxOccupancy: 1,
    amenities: ["Free WiFi", "TV", "Air Conditioning", "Shared Bathroom"],
    imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
    view: "City View",
    freeCancellation: true,
    cancellationDeadline: "24 hours before check-in",
    breakfast: false,
    payLater: true,
    perks: ["Free WiFi"],
    available: 8,
    popular: false
  }
];

// Payment methods
const paymentMethods = [
  { id: "credit_card", name: "Credit Card", icon: <CreditCard className="h-5 w-5" /> },
  { id: "paypal", name: "PayPal", icon: <Wallet className="h-5 w-5" /> },
  { id: "bank_transfer", name: "Bank Transfer", icon: <CreditCard className="h-5 w-5" /> }
];

// Helper function to get amenity-specific icons
const getAmenityIcon = (amenity: string) => {
  const amenityIconMap: Record<string, React.ReactNode> = {
    'wifi': <Wifi className="h-4 w-4" />,
    'free wifi': <Wifi className="h-4 w-4" />,
    'breakfast': <Coffee className="h-4 w-4" />,
    'free breakfast': <Coffee className="h-4 w-4" />,
    'restaurant': <Utensils className="h-4 w-4" />,
    'gym': <Dumbbell className="h-4 w-4" />,
    'pool': <Waves className="h-4 w-4" />,
    'air conditioning': <Waves className="h-4 w-4" />,
    'bath': <Bath className="h-4 w-4" />,
    'bathtub': <Bath className="h-4 w-4" />,
    'tv': <Home className="h-4 w-4" />,
    'private bathroom': <Bath className="h-4 w-4" />,
    'shared bathroom': <Bath className="h-4 w-4" />,
    'mini bar': <Utensils className="h-4 w-4" />,
  };
  
  for (const [key, icon] of Object.entries(amenityIconMap)) {
    if (amenity.toLowerCase().includes(key)) {
      return icon;
    }
  }
  
  return <Globe className="h-4 w-4" />;
};

export default function HotelDetail() {
  const [, params] = useRoute('/hotels/:id');
  const hotelId = params?.id ? parseInt(params.id) : 0;
  const [, navigate] = useLocation();
  
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guestCount, setGuestCount] = useState("2");
  const [selectedRoomType, setSelectedRoomType] = useState<string>("1");
  const [bookingStep, setBookingStep] = useState<"select" | "review" | "payment">("select");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit_card");
  const { toast } = useToast();
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState<number | null>(null);

  const { data: hotel, isLoading, error } = useQuery<Hotel>({
    queryKey: [`/api/hotels/${hotelId}`],
    enabled: !!hotelId,
  });

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Missing dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    // Open the booking review modal
    setBookingStep("review");
    setShowBookingModal(true);
  };
  
  const handleConfirmBooking = () => {
    setBookingStep("payment");
  };
  
  const handleProcessPayment = () => {
    // Process payment logic would go here
    toast({
      title: "Booking confirmed!",
      description: "Your booking has been confirmed. You will receive a confirmation email shortly.",
    });
    setShowBookingModal(false);
    
    // Navigate to a confirmation page or return to the home page
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const selectedRoom = roomTypes.find(room => room.id.toString() === selectedRoomType);
  
  // Calculate number of nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  // Calculate base price
  const calculateBasePrice = () => {
    const nights = calculateNights();
    if (!hotel) return 0;
    return hotel.price * nights;
  };
  
  // Calculate additional room price
  const calculateRoomAdditionalPrice = () => {
    const nights = calculateNights();
    if (!selectedRoom) return 0;
    return selectedRoom.price * nights;
  };
  
  // Calculate total price before taxes
  const calculateSubtotal = () => {
    return calculateBasePrice() + calculateRoomAdditionalPrice();
  };
  
  // Calculate taxes
  const calculateTaxes = () => {
    return Math.round(calculateSubtotal() * 0.12);
  };
  
  // Calculate total price
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes();
  };
  
  // Safe rating access with fallback
  const getRating = () => {
    return hotel?.rating ?? 0;
  };
  
  // Safe review count access with fallback
  const getReviewCount = () => {
    return hotel?.reviewCount ?? 0;
  };

  // Render room cards in Agoda style
  const renderRoomCards = () => {
    const displayRoomTypes = showAllRooms ? roomTypes : roomTypes.slice(0, 3);
    
    return (
      <div className="space-y-6">
        {displayRoomTypes.map((room) => (
          <div key={room.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4 border-b bg-blue-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">{room.name}</h3>
              <Badge className={room.freeCancellation ? "bg-green-600" : "bg-gray-600"}>
                {room.freeCancellation ? "Libreng pagkansela" : "Non-refundable"}
              </Badge>
            </div>
            
            <div className="flex flex-col lg:flex-row">
              {/* Room image */}
              <div className="lg:w-1/4 h-64 lg:h-auto relative">
                <img 
                  src={room.imageUrl} 
                  alt={room.name} 
                  className="w-full h-full object-cover" 
                />
                {room.popular && (
                  <Badge className="absolute top-2 left-2 bg-orange-500">
                    <Award className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute bottom-2 left-2 bg-black/60 text-white hover:bg-black/80"
                  onClick={() => setShowRoomDetails(room.id)}
                >
                  <Camera className="h-3 w-3 mr-1" />
                  View Photos
                </Button>
              </div>
              
              {/* Room details */}
              <div className="lg:w-2/4 p-4 border-r">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <BedDouble className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">{room.beds}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">{room.occupancy}</span>
                  </div>
                  <div className="flex items-center">
                    <Maximize2 className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">{room.size}</span>
                  </div>
                  <div className="flex items-center">
                    <Mountain className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">{room.view}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-sm">Room perks:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {room.perks.map((perk, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-gray-700">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {room.freeCancellation && (
                  <div className="flex items-center text-green-600 text-sm mb-2">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Free cancellation until {room.cancellationDeadline}</span>
                  </div>
                )}
                
                {room.payLater && (
                  <div className="flex items-center text-blue-600 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Pay at the hotel</span>
                  </div>
                )}
              </div>
              
              {/* Booking panel */}
              <div className="lg:w-1/4 p-4 flex flex-col justify-between bg-gray-50">
                <div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Rooms left</p>
                    <p className="font-medium text-orange-600">{room.available} rooms left</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Price per night</p>
                    <div className="flex items-end">
                      <span className="text-xl font-bold text-blue-600">${room.price}</span>
                      {room.breakfast && (
                        <span className="text-xs ml-2 text-green-600">+Breakfast</span>
                      )}
                    </div>
                    {calculateNights() > 0 && (
                      <p className="text-xs text-gray-500">
                        ${room.price} x {calculateNights()} nights = ${room.price * calculateNights()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setSelectedRoomType(room.id.toString());
                      setBookingStep("review");
                      setShowBookingModal(true);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Book Now
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => setSelectedRoomType(room.id.toString())}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Save for Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {!showAllRooms && roomTypes.length > 3 && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAllRooms(true)}
          >
            Show All {roomTypes.length} Room Types
          </Button>
        )}
      </div>
    );
  };

  // Booking Review Modal
  const renderBookingModal = () => {
    return (
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {bookingStep === "review" ? "Review Your Booking" : "Complete Your Payment"}
            </DialogTitle>
            <DialogDescription>
              {bookingStep === "review" 
                ? "Please review your booking details before proceeding to payment." 
                : "Select your payment method and enter your details."}
            </DialogDescription>
          </DialogHeader>
          
          {bookingStep === "review" ? (
            <>
              <div className="grid gap-4 py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{hotel?.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-[#00aa6c]" />
                    <span>{hotel?.address}</span>
                  </div>
                  <div className="flex text-[#00aa6c] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(getRating()) ? "fill-[#00aa6c]" : ""}`} />
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {selectedRoom && (
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold">{selectedRoom.name}</h4>
                        <span className="text-[#00aa6c] font-medium">
                          ${(hotel?.price ?? 0) + selectedRoom.price}/night
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div className="flex items-center">
                          <BedDouble className="h-4 w-4 text-[#00aa6c] mr-1" />
                          <span>{selectedRoom.beds}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-[#00aa6c] mr-1" />
                          <span>{selectedRoom.occupancy}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedRoom.amenities.slice(0, 3).map((amenity, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{amenity}</Badge>
                        ))}
                        {selectedRoom.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{selectedRoom.amenities.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Check-in:</span>
                      <span className="font-medium">{checkInDate ? format(checkInDate, "PPP") : "Not selected"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Check-out:</span>
                      <span className="font-medium">{checkOutDate ? format(checkOutDate, "PPP") : "Not selected"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Guests:</span>
                      <span className="font-medium">{guestCount} {parseInt(guestCount) === 1 ? "guest" : "guests"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-medium">{calculateNights()} nights</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3">Price Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">${hotel?.price ?? 0} x {calculateNights()} nights</span>
                      <span>${calculateBasePrice()}</span>
                    </div>
                    
                    {selectedRoom && selectedRoom.price > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{selectedRoom.name} upgrade</span>
                        <span>+${calculateRoomAdditionalPrice()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & fees (12%)</span>
                      <span>${calculateTaxes()}</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setShowBookingModal(false)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Details
                </Button>
                <Button className="bg-[#00aa6c] hover:bg-[#00aa6c]/90" onClick={handleConfirmBooking}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3">Payment Method</h3>
                  <RadioGroup 
                    defaultValue="credit_card"
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod} 
                    className="space-y-2"
                  >
                    {paymentMethods.map(method => (
                      <div key={method.id} className={`flex items-center space-x-2 border rounded-lg p-3 transition-colors ${selectedPaymentMethod === method.id ? 'border-[#00aa6c] bg-[#00aa6c]/5' : 'border-gray-200'}`}>
                        <RadioGroupItem 
                          value={method.id} 
                          id={`payment-${method.id}`} 
                          className="text-[#00aa6c]"
                        />
                        <Label 
                          htmlFor={`payment-${method.id}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {method.icon}
                          <span>{method.name}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3">Payment Details</h3>
                  {selectedPaymentMethod === "credit_card" && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="name">Name on Card</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                    </div>
                  )}
                  
                  {selectedPaymentMethod === "paypal" && (
                    <div className="text-center py-6">
                      <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                      <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="mx-auto h-12" />
                    </div>
                  )}
                  
                  {selectedPaymentMethod === "bank_transfer" && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Please transfer the total amount to the following account:</p>
                      <div className="bg-white p-3 rounded border">
                        <p className="mb-1"><span className="font-semibold">Bank Name:</span> TravelNexus Bank</p>
                        <p className="mb-1"><span className="font-semibold">Account Name:</span> TravelNexus Inc.</p>
                        <p className="mb-1"><span className="font-semibold">Account Number:</span> 1234567890</p>
                        <p><span className="font-semibold">Reference:</span> BOOKING-{hotelId}-{Date.now().toString().slice(-6)}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3">Total Amount</h3>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#00aa6c]">${calculateTotal()}</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setBookingStep("review")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Review
                </Button>
                <Button className="bg-[#00aa6c] hover:bg-[#00aa6c]/90" onClick={handleProcessPayment}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Payment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Hotel</h2>
          <p className="text-neutral-600 mb-6">We couldn't load the hotel details. Please try again.</p>
          <Button asChild>
            <a href="/hotels">Back to Hotels</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{hotel ? `${hotel.name} | ${SITE_NAME}` : `Hotel Details | ${SITE_NAME}`}</title>
        <meta 
          name="description" 
          content={hotel?.description || "View detailed information about this luxury hotel accommodation."} 
        />
      </Helmet>

      <main className="pb-16 pt-8 bg-neutral-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div>
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-96 w-full mb-8 rounded-xl" />
            </div>
          ) : hotel ? (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-[#00aa6c] text-white font-medium">
                    <Star className="h-3 w-3 fill-white mr-1" />
                    <span>TRAVELER RATED</span>
                  </Badge>
                  <img 
                    src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" 
                    alt="TripAdvisor Logo" 
                    className="h-6" 
                  />
                </div>
                
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-neutral-600">
                  <div className="inline-flex items-center">
                    <div className="rating-pill rating-excellent">
                      <span className="font-medium">{getRating().toFixed(1)}</span>
                    </div>
                    <div className="flex text-[#00aa6c] ml-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(getRating()) ? "fill-[#00aa6c]" : ""}`} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">({getReviewCount()} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="font-normal">
                      <ThumbsUp className="h-3 w-3 text-[#00aa6c] mr-1" />
                      <span>98% Recommend</span>
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-[#00aa6c]" />
                  <span>{hotel.address}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Hotel Image Gallery */}
                  <Carousel className="w-full mb-8">
                    <CarouselContent>
                      <CarouselItem>
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src={hotel?.imageUrl || ''} 
                            alt={hotel?.name || 'Hotel image'} 
                            className="w-full h-96 object-cover"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                            alt={`${hotel.name} room`} 
                            className="w-full h-96 object-cover"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
                            alt={`${hotel.name} lobby`} 
                            className="w-full h-96 object-cover"
                          />
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>

                  {/* Updated Tabs */}
                  <Tabs defaultValue="rooms" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="rooms">Rooms</TabsTrigger>
                      <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <h2 className="font-heading text-xl font-bold mb-4">Hotel Description</h2>
                      <p className="text-neutral-600 mb-6">{hotel.description}</p>
                      
                      <h3 className="font-heading text-lg font-semibold mb-3">Location</h3>
                      <p className="text-neutral-600 mb-6">
                        Located in {hotel.address}, our hotel offers easy access to local attractions and 
                        convenient transportation options. The nearest airport is approximately 25 km away.
                      </p>
                      
                      <h3 className="font-heading text-lg font-semibold mb-3">Policies</h3>
                      <ul className="list-disc list-inside text-neutral-600 space-y-1 mb-6">
                        <li>Check-in time: 3:00 PM</li>
                        <li>Check-out time: 12:00 PM</li>
                        <li>Pets: Not allowed</li>
                        <li>Cancellation: Free cancellation up to 48 hours before check-in</li>
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="rooms" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading text-xl font-bold">Available Room Types</h2>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm">
                            {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Check-in"} — 
                            {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Check-out"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Date selection reminder if not selected */}
                      {(!checkInDate || !checkOutDate) && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-blue-700 flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Please select check-in and check-out dates to see accurate pricing
                          </p>
                        </div>
                      )}
                      
                      {/* Agoda-style room cards */}
                      {renderRoomCards()}
                    </TabsContent>
                    
                    <TabsContent value="amenities" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <h2 className="font-heading text-xl font-bold mb-4">Hotel Amenities</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hotel.amenities && hotel.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="reviews" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <h2 className="font-heading text-xl font-bold mb-4">Guest Reviews</h2>
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <div className="rating-pill rating-excellent mr-3">
                            <span className="font-medium">{getRating().toFixed(1)}</span>
                          </div>
                          <div className="flex text-[#00aa6c]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-5 w-5 ${i < Math.floor(getRating()) ? "fill-[#00aa6c]" : ""}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-neutral-600">{getReviewCount()} verified reviews</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="border-b pb-6">
                          <div className="flex items-center mb-2">
                            <img 
                              src="https://randomuser.me/api/portraits/women/32.jpg" 
                              alt="Sarah M." 
                              className="w-10 h-10 rounded-full mr-3" 
                            />
                            <div>
                              <p className="font-bold">Sarah M.</p>
                              <p className="text-sm text-neutral-500">Stayed in June 2023</p>
                            </div>
                          </div>
                          <div className="flex text-[#00aa6c] mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-[#00aa6c]" />
                            ))}
                          </div>
                          <p className="text-neutral-600">Absolutely amazing hotel! The staff was incredibly friendly and the amenities were top-notch. We especially loved the pool area and restaurant. Will definitely stay here again.</p>
                        </div>
                        
                        <div className="border-b pb-6">
                          <div className="flex items-center mb-2">
                            <img 
                              src="https://randomuser.me/api/portraits/men/45.jpg" 
                              alt="Michael T." 
                              className="w-10 h-10 rounded-full mr-3" 
                            />
                            <div>
                              <p className="font-bold">Michael T.</p>
                              <p className="text-sm text-neutral-500">Stayed in May 2023</p>
                            </div>
                          </div>
                          <div className="flex text-[#00aa6c] mb-2">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-[#00aa6c]" />
                            ))}
                            <Star className="h-4 w-4" />
                          </div>
                          <p className="text-neutral-600">Great location and beautiful property. The room was spacious and clean. Only giving 4 stars because the WiFi was a bit spotty during our stay. Otherwise, fantastic experience!</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="mt-4 w-full">Load More Reviews</Button>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Booking Card */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24">
                    <CardContent className="p-6">
                      <h2 className="font-heading text-xl font-bold mb-4">Check Availability</h2>
                      
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">Check-in Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkInDate ? format(checkInDate, "PPP") : <span>Select date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={checkInDate}
                                onSelect={setCheckInDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Check-out Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkOutDate ? format(checkOutDate, "PPP") : <span>Select date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={checkOutDate}
                                onSelect={setCheckOutDate}
                                initialFocus
                                disabled={(date) => date < (checkInDate || new Date())}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Guests</label>
                          <Select value={guestCount} onValueChange={setGuestCount}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of guests" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Guest</SelectItem>
                              <SelectItem value="2">2 Guests</SelectItem>
                              <SelectItem value="3">3 Guests</SelectItem>
                              <SelectItem value="4">4 Guests</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => {
                        if (checkInDate && checkOutDate) {
                          const roomsTab = document.querySelector('[data-state="active"][role="tabpanel"]');
                          if (roomsTab) {
                            roomsTab.scrollIntoView({ behavior: 'smooth' });
                          }
                        } else {
                          toast({
                            title: "Select dates",
                            description: "Please select check-in and check-out dates",
                            variant: "destructive",
                          });
                        }
                      }}>
                        <Search className="h-4 w-4 mr-2" />
                        Check Availability
                      </Button>
                      
                      <div className="mt-4 text-sm text-neutral-500 text-center">
                        <p className="flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-1 text-blue-600" />
                          Check-in: 3:00 PM, Check-out: 12:00 PM
                        </p>
                        <p className="mt-1 flex items-center justify-center">
                          <Ban className="h-4 w-4 mr-1 text-blue-600" />
                          Cancellation policies vary by room type
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Hotel Not Found</h2>
              <p className="text-neutral-600 mb-6">We couldn't find the hotel you're looking for.</p>
              <Button asChild>
                <a href="/hotels">Back to Hotels</a>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Render the booking modal */}
      {renderBookingModal()}
      
      {/* Room details modal */}
      {showRoomDetails && (
        <Dialog open={showRoomDetails !== null} onOpenChange={() => setShowRoomDetails(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {roomTypes.find(r => r.id === showRoomDetails)?.name || 'Room Details'}
              </DialogTitle>
              <DialogDescription>
                View room photos and detailed information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4">
              <Carousel>
                <CarouselContent>
                  <CarouselItem>
                    <img 
                      src={roomTypes.find(r => r.id === showRoomDetails)?.imageUrl} 
                      alt="Room" 
                      className="w-full h-64 object-cover rounded-md"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img 
                      src="https://images.unsplash.com/photo-1598928636135-d146006ff4be"
                      alt="Room" 
                      className="w-full h-64 object-cover rounded-md"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <img 
                      src="https://images.unsplash.com/photo-1582582621959-48d27397dc69"
                      alt="Room" 
                      className="w-full h-64 object-cover rounded-md"
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">Room Details</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <BedDouble className="h-4 w-4 text-blue-600 mr-2" />
                      <span>{roomTypes.find(r => r.id === showRoomDetails)?.beds}</span>
                    </li>
                    <li className="flex items-center">
                      <Users className="h-4 w-4 text-blue-600 mr-2" />
                      <span>{roomTypes.find(r => r.id === showRoomDetails)?.occupancy}</span>
                    </li>
                    <li className="flex items-center">
                      <Maximize2 className="h-4 w-4 text-blue-600 mr-2" />
                      <span>{roomTypes.find(r => r.id === showRoomDetails)?.size}</span>
                    </li>
                    <li className="flex items-center">
                      <Mountain className="h-4 w-4 text-blue-600 mr-2" />
                      <span>{roomTypes.find(r => r.id === showRoomDetails)?.view}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Amenities</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {roomTypes.find(r => r.id === showRoomDetails)?.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        {getAmenityIcon(amenity)}
                        <span className="ml-2">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    if (showRoomDetails) {
                      setSelectedRoomType(showRoomDetails.toString());
                      setShowRoomDetails(null);
                      setBookingStep("review");
                      setShowBookingModal(true);
                    }
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Book This Room
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
