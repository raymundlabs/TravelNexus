import { useState } from 'react';
import { useRoute } from 'wouter';
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
  Globe
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { SITE_NAME } from '@/lib/constants';

// Helper function to map amenity string to icon
const getAmenityIcon = (amenity: string) => {
  const amenityMap: Record<string, any> = {
    'wifi': <Wifi className="h-4 w-4 mr-2" />,
    'pool': <Waves className="h-4 w-4 mr-2" />,
    'restaurant': <Utensils className="h-4 w-4 mr-2" />,
    'gym': <Dumbbell className="h-4 w-4 mr-2" />,
    'bar': <Coffee className="h-4 w-4 mr-2" />,
    'spa': <Coffee className="h-4 w-4 mr-2" />,
  };
  
  for (const [key, icon] of Object.entries(amenityMap)) {
    if (amenity.toLowerCase().includes(key)) {
      return icon;
    }
  }
  
  return <Globe className="h-4 w-4 mr-2" />;
};

export default function HotelDetail() {
  const [, params] = useRoute('/hotels/:id');
  const hotelId = params?.id ? parseInt(params.id) : 0;
  
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guestCount, setGuestCount] = useState("2");
  const { toast } = useToast();

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

    // Booking logic would go here
    toast({
      title: "Booking request received",
      description: "Your booking is being processed. You will receive a confirmation shortly.",
    });
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
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
                <div className="flex items-center text-neutral-600">
                  <div className="flex text-amber-400 mr-2">
                    {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                    {hotel.rating % 1 >= 0.5 && <Star className="h-5 w-5 fill-current" />}
                  </div>
                  <span className="mr-4">{hotel.rating.toFixed(1)} ({hotel.reviewCount} reviews)</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hotel.address}</span>
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
                            src={hotel.imageUrl} 
                            alt={hotel.name} 
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

                  {/* Hotel Details Tabs */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
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
                          <div className="flex text-amber-400 mr-2">
                            {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-current" />
                            ))}
                            {hotel.rating % 1 >= 0.5 && <Star className="h-5 w-5 fill-current" />}
                          </div>
                          <span className="font-bold text-lg">{hotel.rating.toFixed(1)}/5</span>
                        </div>
                        <p className="text-neutral-600">{hotel.reviewCount} verified reviews</p>
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
                          <div className="flex text-amber-400 mb-2">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
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
                          <div className="flex text-amber-400 mb-2">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
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
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="font-heading text-xl font-bold mb-4">Book Your Stay</h2>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <span className="text-2xl font-bold text-primary">${hotel.price}</span>
                          <span className="text-neutral-500"> / night</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                          {hotel.rating % 1 >= 0.5 && <Star className="h-4 w-4 fill-current" />}
                        </div>
                      </div>
                      
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
                      
                      {checkInDate && checkOutDate && (
                        <div className="space-y-2 border-t border-b py-4 mb-6">
                          <div className="flex justify-between">
                            <span className="text-neutral-600">
                              ${hotel.price} x {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nights
                            </span>
                            <span>
                              ${hotel.price * Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Taxes & fees</span>
                            <span>
                              ${Math.round(hotel.price * Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) * 0.12)}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold pt-2">
                            <span>Total</span>
                            <span>
                              ${Math.round(hotel.price * Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) * 1.12)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <Button className="w-full" onClick={handleBookNow}>Book Now</Button>
                      
                      <div className="mt-4 text-sm text-neutral-500 text-center">
                        <p>No payment required today. You'll pay when you stay.</p>
                        <p className="mt-1">Free cancellation before check-in</p>
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
    </>
  );
}
