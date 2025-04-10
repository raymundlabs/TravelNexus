import { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { type Tour } from '@shared/schema';
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
  MapPin,
  Clock,
  Users,
  Check,
  Info,
  GripVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { SITE_NAME } from '@/lib/constants';

export default function TourDetail() {
  const [, params] = useRoute('/tours/:id');
  const tourId = params?.id ? parseInt(params.id) : 0;
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [participantCount, setParticipantCount] = useState("2");
  const { toast } = useToast();

  const { data: tour, isLoading, error } = useQuery<Tour>({
    queryKey: [`/api/tours/${tourId}`],
    enabled: !!tourId,
  });

  const handleBookTour = () => {
    if (!selectedDate) {
      toast({
        title: "Date required",
        description: "Please select a date for your tour",
        variant: "destructive",
      });
      return;
    }

    // Booking logic would go here
    toast({
      title: "Tour booking received",
      description: "Your tour booking is being processed. You will receive a confirmation shortly.",
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Tour</h2>
          <p className="text-neutral-600 mb-6">We couldn't load the tour details. Please try again.</p>
          <Button asChild>
            <a href="/tours">Back to Tours</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{tour ? `${tour.name} | ${SITE_NAME}` : `Tour Details | ${SITE_NAME}`}</title>
        <meta 
          name="description" 
          content={tour?.description || "View detailed information about this exciting tour and activity."} 
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
          ) : tour ? (
            <>
              <div className="mb-8">
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{tour.name}</h1>
                <div className="flex flex-wrap items-center text-neutral-600 gap-4">
                  <div className="flex items-center">
                    <div className="flex text-amber-400 mr-2">
                      {[...Array(Math.floor(tour.rating))].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                      {tour.rating % 1 >= 0.5 && <Star className="h-5 w-5 fill-current" />}
                    </div>
                    <span>{tour.rating.toFixed(1)} ({tour.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Destination #{tour.destinationId}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{tour.duration}</span>
                  </div>
                  {tour.groupSize && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{tour.groupSize}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Tour Image Gallery */}
                  <Carousel className="w-full mb-8">
                    <CarouselContent>
                      <CarouselItem>
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src={tour.imageUrl} 
                            alt={tour.name} 
                            className="w-full h-96 object-cover"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1549221987-25a490f65d34"
                            alt={`${tour.name} activity`} 
                            className="w-full h-96 object-cover"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1605908584126-8a581aed37b3"
                            alt={`${tour.name} experience`} 
                            className="w-full h-96 object-cover"
                          />
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>

                  {/* Tour Details Tabs */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <h2 className="font-heading text-xl font-bold mb-4">Tour Description</h2>
                      <p className="text-neutral-600 mb-6">{tour.description}</p>
                      
                      <h3 className="font-heading text-lg font-semibold mb-3">What's Included</h3>
                      <ul className="space-y-2 mb-6">
                        {tour.inclusions && tour.inclusions.map((inclusion, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>{inclusion}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <h3 className="font-heading text-lg font-semibold mb-3">Important Information</h3>
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <div className="flex">
                          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium mb-2">Know before you go</p>
                            <ul className="list-disc list-inside text-neutral-600 space-y-1">
                              <li>Comfortable walking shoes recommended</li>
                              <li>Tour operates in all weather conditions, please dress appropriately</li>
                              <li>Not wheelchair accessible</li>
                              <li>Children must be accompanied by an adult</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-heading text-lg font-semibold mb-3">Cancellation Policy</h3>
                      <p className="text-neutral-600">Free cancellation up to 24 hours before the start time. No refunds for cancellations made less than 24 hours before the experience start time.</p>
                    </TabsContent>
                    
                    <TabsContent value="itinerary" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <h2 className="font-heading text-xl font-bold mb-4">Tour Itinerary</h2>
                      
                      <div className="relative pl-8 pb-8 border-l-2 border-dashed border-neutral-300">
                        <div className="absolute left-0 transform -translate-x-1/2 mt-1">
                          <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center">
                            1
                          </div>
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-2">Starting Point & Introduction</h3>
                        <p className="text-neutral-600 mb-2">Meet your guide at the designated meeting point. After a brief introduction and safety guidelines, your adventure begins!</p>
                        <p className="text-sm text-neutral-500 mb-6">Duration: Approximately 15 minutes</p>
                      </div>
                      
                      <div className="relative pl-8 pb-8 border-l-2 border-dashed border-neutral-300">
                        <div className="absolute left-0 transform -translate-x-1/2 mt-1">
                          <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center">
                            2
                          </div>
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-2">Main Attraction Visit</h3>
                        <p className="text-neutral-600 mb-2">Explore the main attractions with your knowledgeable guide. Learn about the history, culture, and interesting facts. Plenty of time for photos and questions.</p>
                        <p className="text-sm text-neutral-500 mb-6">Duration: Approximately 2 hours</p>
                      </div>
                      
                      <div className="relative pl-8 pb-8 border-l-2 border-dashed border-neutral-300">
                        <div className="absolute left-0 transform -translate-x-1/2 mt-1">
                          <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center">
                            3
                          </div>
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-2">Local Experience & Refreshments</h3>
                        <p className="text-neutral-600 mb-2">Enjoy a local cultural experience and refreshments. Interact with locals and get an authentic taste of the destination.</p>
                        <p className="text-sm text-neutral-500 mb-6">Duration: Approximately 1 hour</p>
                      </div>
                      
                      <div className="relative pl-8">
                        <div className="absolute left-0 transform -translate-x-1/2 mt-1">
                          <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center">
                            4
                          </div>
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-2">Final Stop & Conclusion</h3>
                        <p className="text-neutral-600 mb-2">Visit the final attraction before concluding the tour. Your guide will be available for any last questions and recommendations for the rest of your stay.</p>
                        <p className="text-sm text-neutral-500">Duration: Approximately 45 minutes</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="reviews" className="bg-white p-6 rounded-b-lg shadow-sm">
                      <h2 className="font-heading text-xl font-bold mb-4">Guest Reviews</h2>
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <div className="flex text-amber-400 mr-2">
                            {[...Array(Math.floor(tour.rating))].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-current" />
                            ))}
                            {tour.rating % 1 >= 0.5 && <Star className="h-5 w-5 fill-current" />}
                          </div>
                          <span className="font-bold text-lg">{tour.rating.toFixed(1)}/5</span>
                        </div>
                        <p className="text-neutral-600">{tour.reviewCount} verified reviews</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="border-b pb-6">
                          <div className="flex items-center mb-2">
                            <img 
                              src="https://randomuser.me/api/portraits/women/12.jpg" 
                              alt="Emma W." 
                              className="w-10 h-10 rounded-full mr-3" 
                            />
                            <div>
                              <p className="font-bold">Emma W.</p>
                              <p className="text-sm text-neutral-500">July 2023</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400 mb-2">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <p className="text-neutral-600">The tour was absolutely fantastic! Our guide was knowledgeable and engaging. The activities were well-planned and the pace was perfect. Highly recommend this experience to anyone visiting!</p>
                        </div>
                        
                        <div className="border-b pb-6">
                          <div className="flex items-center mb-2">
                            <img 
                              src="https://randomuser.me/api/portraits/men/32.jpg" 
                              alt="Robert L." 
                              className="w-10 h-10 rounded-full mr-3" 
                            />
                            <div>
                              <p className="font-bold">Robert L.</p>
                              <p className="text-sm text-neutral-500">June 2023</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400 mb-2">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4" />
                          </div>
                          <p className="text-neutral-600">Great tour with lots of interesting information. The only reason I'm giving 4 stars instead of 5 is that we felt a bit rushed at some of the stops. Otherwise, it was a wonderful experience and the guide was excellent.</p>
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
                      <h2 className="font-heading text-xl font-bold mb-4">Book This Tour</h2>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <span className="text-2xl font-bold text-primary">${tour.price}</span>
                          <span className="text-neutral-500"> / person</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(Math.floor(tour.rating))].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                          {tour.rating % 1 >= 0.5 && <Star className="h-4 w-4 fill-current" />}
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">Select Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Participants</label>
                          <Select value={participantCount} onValueChange={setParticipantCount}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of participants" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Person</SelectItem>
                              <SelectItem value="2">2 People</SelectItem>
                              <SelectItem value="3">3 People</SelectItem>
                              <SelectItem value="4">4 People</SelectItem>
                              <SelectItem value="5">5 People</SelectItem>
                              <SelectItem value="6">6 People</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {selectedDate && (
                        <div className="space-y-2 border-t border-b py-4 mb-6">
                          <div className="flex justify-between">
                            <span className="text-neutral-600">
                              ${tour.price} x {participantCount} {parseInt(participantCount) === 1 ? 'person' : 'people'}
                            </span>
                            <span>
                              ${tour.price * parseInt(participantCount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Booking fee</span>
                            <span>
                              ${Math.round(tour.price * parseInt(participantCount) * 0.05)}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold pt-2">
                            <span>Total</span>
                            <span>
                              ${Math.round(tour.price * parseInt(participantCount) * 1.05)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <Button className="w-full" onClick={handleBookTour}>Book Now</Button>
                      
                      <div className="mt-4 text-sm text-neutral-500 text-center">
                        <p>Reserve now & pay later</p>
                        <p className="mt-1">Free cancellation up to 24 hours before</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-heading text-lg font-bold mb-4">Tour Highlights</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <GripVertical className="h-5 w-5 text-primary mr-2" />
                        <span>Expert, knowledgeable guide</span>
                      </li>
                      <li className="flex items-start">
                        <GripVertical className="h-5 w-5 text-primary mr-2" />
                        <span>Small group experience</span>
                      </li>
                      <li className="flex items-start">
                        <GripVertical className="h-5 w-5 text-primary mr-2" />
                        <span>Skip-the-line access at attractions</span>
                      </li>
                      <li className="flex items-start">
                        <GripVertical className="h-5 w-5 text-primary mr-2" />
                        <span>Authentic local experiences</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Tour Not Found</h2>
              <p className="text-neutral-600 mb-6">We couldn't find the tour you're looking for.</p>
              <Button asChild>
                <a href="/tours">Back to Tours</a>
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
