import { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { type Package } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Star, 
  Clock,
  MapPin,
  CheckCircle,
  FileText,
  Plane,
  Hotel,
  Utensils,
  MapPin as MapPinIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { SITE_NAME } from '@/lib/constants';

export default function PackageDetail() {
  const [, params] = useRoute('/packages/:id');
  const packageId = params?.id ? parseInt(params.id) : 0;
  
  const [startDate, setStartDate] = useState<Date>();
  const [personCount, setPersonCount] = useState("2");
  const { toast } = useToast();

  const { data: packageData, isLoading, error } = useQuery<Package>({
    queryKey: [`/api/packages/${packageId}`],
    enabled: !!packageId,
  });

  const handleBookPackage = async () => {
    if (!startDate) {
      toast({
        title: "Date required",
        description: "Please select a start date for your package",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: packageId,
          startDate: startDate,
          endDate: new Date(startDate.getTime() + (packageData?.duration || 0) * 24 * 60 * 60 * 1000),
          personCount: parseInt(personCount),
          totalAmount: (packageData?.discountedPrice || packageData?.price || 0) * parseInt(personCount) * 1.10,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book package');
      }

      const data = await response.json();
      
      toast({
        title: "Booking Successful",
        description: "Your package has been booked successfully. You will receive a confirmation email shortly.",
      });

      // Redirect to booking confirmation page or show booking details
      window.location.href = `/bookings/${data.bookingId}`;
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to get icon for inclusion
  const getInclusionIcon = (inclusion: string) => {
    const inclusionLower = inclusion.toLowerCase();
    if (inclusionLower.includes('accommodation') || inclusionLower.includes('hotel') || inclusionLower.includes('resort')) {
      return <Hotel className="h-5 w-5 text-primary mr-2" />;
    } else if (inclusionLower.includes('meal') || inclusionLower.includes('breakfast') || inclusionLower.includes('food')) {
      return <Utensils className="h-5 w-5 text-primary mr-2" />;
    } else if (inclusionLower.includes('flight') || inclusionLower.includes('airport')) {
      return <Plane className="h-5 w-5 text-primary mr-2" />;
    } else if (inclusionLower.includes('tour') || inclusionLower.includes('guide') || inclusionLower.includes('activity')) {
      return <MapPinIcon className="h-5 w-5 text-primary mr-2" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-primary mr-2" />;
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Package</h2>
          <p className="text-neutral-600 mb-6">We couldn't load the package details. Please try again.</p>
          <Button asChild>
            <a href="/packages">Back to Packages</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{packageData ? `${packageData.name} | ${SITE_NAME}` : `Package Details | ${SITE_NAME}`}</title>
        <meta 
          name="description" 
          content={packageData?.description || "View detailed information about this vacation package."} 
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
          ) : packageData ? (
            <>
              <div className="mb-8">
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{packageData.name}</h1>
                <div className="flex flex-wrap items-center text-neutral-600 gap-4">
                  <div className="flex items-center">
                    <div className="flex text-amber-400 mr-2">
                      {[...Array(Math.floor(packageData.rating))].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                      {packageData.rating % 1 >= 0.5 && <Star className="h-5 w-5 fill-current" />}
                    </div>
                    <span>{packageData.rating.toFixed(1)} ({packageData.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{packageData.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Destination #{packageData.destinationId}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Package Image Gallery */}
                  <Carousel className="w-full mb-8">
                    <CarouselContent>
                      <CarouselItem>
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src={packageData.imageUrl} 
                            alt={packageData.name} 
                            className="w-full h-96 object-cover"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
                            alt={`${packageData.name} accommodation`} 
                            className="w-full h-96 object-cover"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b"
                            alt={`${packageData.name} destination`} 
                            className="w-full h-96 object-cover"
                          />
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>

                  {/* Package Details Tabs */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <h2 className="font-heading text-xl font-bold mb-4">Package Description</h2>
                      <p className="text-neutral-600 mb-6">{packageData.description}</p>
                      
                      {packageData.highlights && packageData.highlights.length > 0 && (
                        <>
                          <h3 className="font-heading text-lg font-semibold mb-3">Package Highlights</h3>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {packageData.highlights.map((highlight, index) => (
                              <span key={index} className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {packageData.inclusions && packageData.inclusions.length > 0 && (
                        <>
                          <h3 className="font-heading text-lg font-semibold mb-3">What's Included</h3>
                          <ul className="space-y-2 mb-6">
                            {packageData.inclusions.map((inclusion, index) => (
                              <li key={index} className="flex items-start">
                                {getInclusionIcon(inclusion)}
                                <span>{inclusion}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      <h3 className="font-heading text-lg font-semibold mb-3">Cancellation Policy</h3>
                      <p className="text-neutral-600">Free cancellation up to 30 days before the start date. 50% refund for cancellations between 15-30 days before the start date. No refunds for cancellations made less than 15 days before the start date.</p>
                    </TabsContent>
                    
                    <TabsContent value="itinerary" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <h2 className="font-heading text-xl font-bold mb-4">Day-by-Day Itinerary</h2>
                      
                      <div className="space-y-6">
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex">
                            <div className="flex-shrink-0 mr-4">
                              <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                                1
                              </div>
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-lg mb-1">Day 1: Arrival & Welcome</h3>
                              <p className="text-neutral-600">Arrive at your destination and check in to your accommodations. Meet your tour representative for a welcome briefing and enjoy a welcome dinner to start your adventure.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex">
                            <div className="flex-shrink-0 mr-4">
                              <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                                2
                              </div>
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-lg mb-1">Day 2: City Exploration</h3>
                              <p className="text-neutral-600">Begin your day with a guided city tour of the main attractions. After lunch, enjoy some free time for shopping or relaxation before an evening cultural performance.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex">
                            <div className="flex-shrink-0 mr-4">
                              <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                                3
                              </div>
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-lg mb-1">Day 3: Natural Wonders</h3>
                              <p className="text-neutral-600">Full-day excursion to nearby natural attractions. Enjoy a picnic lunch surrounded by breathtaking scenery. Return to your hotel for dinner and evening relaxation.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex">
                            <div className="flex-shrink-0 mr-4">
                              <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                                4
                              </div>
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-lg mb-1">Day 4: Cultural Immersion</h3>
                              <p className="text-neutral-600">Participate in a cultural workshop to learn local crafts or cuisine. Afternoon visit to historical sites with expert commentary. Evening at leisure.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex">
                            <div className="flex-shrink-0 mr-4">
                              <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                                5
                              </div>
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-lg mb-1">Day 5: Adventure Day</h3>
                              <p className="text-neutral-600">Choose from a selection of exciting activities such as hiking, snorkeling, or a cooking class. Evening farewell dinner with entertainment.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <div className="flex">
                            <div className="flex-shrink-0 mr-4">
                              <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                                6
                              </div>
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-lg mb-1">Day 6: Leisurely Departure</h3>
                              <p className="text-neutral-600">Morning at leisure for last-minute shopping or relaxation. Check-out and transfer to the airport for your departure flight.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-neutral-500 text-sm">
                        <p>Note: This is a sample itinerary and may be adjusted based on weather conditions, local events, or group preferences.</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="reviews" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <h2 className="font-heading text-xl font-bold mb-4">Guest Reviews</h2>
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <div className="flex text-amber-400 mr-2">
                            {[...Array(Math.floor(packageData.rating))].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-current" />
                            ))}
                            {packageData.rating % 1 >= 0.5 && <Star className="h-5 w-5 fill-current" />}
                          </div>
                          <span className="font-bold text-lg">{packageData.rating.toFixed(1)}/5</span>
                        </div>
                        <p className="text-neutral-600">{packageData.reviewCount} verified reviews</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="border-b pb-6">
                          <div className="flex items-center mb-2">
                            <img 
                              src="https://randomuser.me/api/portraits/women/24.jpg" 
                              alt="Jennifer B." 
                              className="w-10 h-10 rounded-full mr-3" 
                            />
                            <div>
                              <p className="font-bold">Jennifer B.</p>
                              <p className="text-sm text-neutral-500">Traveled in June 2023</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400 mb-2">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <p className="text-neutral-600">This package exceeded all our expectations! The accommodations were beautiful, the tour guides were knowledgeable and friendly, and the activities were perfectly balanced. We had enough time to explore on our own but also benefited from the guided experiences. Would highly recommend!</p>
                        </div>
                        
                        <div className="border-b pb-6">
                          <div className="flex items-center mb-2">
                            <img 
                              src="https://randomuser.me/api/portraits/men/67.jpg" 
                              alt="Thomas & Sarah" 
                              className="w-10 h-10 rounded-full mr-3" 
                            />
                            <div>
                              <p className="font-bold">Thomas & Sarah</p>
                              <p className="text-sm text-neutral-500">Traveled in May 2023</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400 mb-2">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4" />
                          </div>
                          <p className="text-neutral-600">We had a wonderful experience with this package. The itinerary was well-planned, and we especially loved the cultural experiences included. The only reason for 4 stars instead of 5 is that one of our hotels wasn't quite up to the standard of the others. Otherwise, it was a fantastic trip!</p>
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
                      <h2 className="font-heading text-xl font-bold mb-4">Book This Package</h2>
                      
                      <div className="flex items-center justify-between mb-4">
                        {packageData.discountedPrice && packageData.discountedPrice < packageData.price ? (
                          <div>
                            <span className="text-neutral-500 line-through mr-2">${packageData.price}</span>
                            <span className="text-2xl font-bold text-primary">${packageData.discountedPrice}</span>
                            <span className="text-neutral-500"> / person</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-2xl font-bold text-primary">${packageData.price}</span>
                            <span className="text-neutral-500"> / person</span>
                          </div>
                        )}
                      </div>
                      
                      {packageData.discountPercentage && (
                        <div className="mb-6 bg-amber-100 text-amber-800 px-3 py-2 rounded-md text-sm font-medium">
                          Save {packageData.discountPercentage}% when you book now!
                        </div>
                      )}
                      
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">Start Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <p className="text-sm text-neutral-500 mt-1">Available start dates are shown in the calendar</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Number of Travelers</label>
                          <Select value={personCount} onValueChange={setPersonCount}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of travelers" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Person</SelectItem>
                              <SelectItem value="2">2 People</SelectItem>
                              <SelectItem value="3">3 People</SelectItem>
                              <SelectItem value="4">4 People</SelectItem>
                              <SelectItem value="5">5 People</SelectItem>
                              <SelectItem value="6">6+ People (Contact us)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {startDate && personCount !== "6" && (
                        <div className="space-y-2 border-t border-b py-4 mb-6">
                          <div className="flex justify-between">
                            <span className="text-neutral-600">
                              ${packageData.discountedPrice || packageData.price} x {personCount} {parseInt(personCount) === 1 ? 'person' : 'people'}
                            </span>
                            <span>
                              ${(packageData.discountedPrice || packageData.price) * parseInt(personCount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Taxes & fees</span>
                            <span>
                              ${Math.round((packageData.discountedPrice || packageData.price) * parseInt(personCount) * 0.10)}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold pt-2">
                            <span>Total</span>
                            <span>
                              ${Math.round((packageData.discountedPrice || packageData.price) * parseInt(personCount) * 1.10)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        onClick={handleBookPackage}
                        disabled={personCount === "6"}
                      >
                        {personCount === "6" ? "Contact for Group Rate" : "Book Package"}
                      </Button>
                      
                      <div className="mt-4 text-sm text-neutral-500 text-center">
                        <p>Only $500 deposit due today</p>
                        <p className="mt-1">Flexible payment options available</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-heading text-lg font-bold mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Important Information
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Passports & Visas</p>
                        <p className="text-neutral-600">Valid passport required with at least 6 months validity from return date. Check visa requirements based on your nationality.</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Health & Vaccinations</p>
                        <p className="text-neutral-600">No mandatory vaccinations required, but we recommend consulting your doctor before travel.</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">What to Pack</p>
                        <p className="text-neutral-600">Comfortable clothing and walking shoes, sunscreen, insect repellent, and any personal medications.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Package Not Found</h2>
              <p className="text-neutral-600 mb-6">We couldn't find the package you're looking for.</p>
              <Button asChild>
                <a href="/packages">Back to Packages</a>
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
