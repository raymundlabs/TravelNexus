import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { type Tour } from '@shared/schema';
import TourCard from '@/components/booking/tour-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SITE_NAME } from '@/lib/constants';

export default function Tours() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  
  const [searchQuery, setSearchQuery] = useState(params.get('destination') || '');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedDuration, setSelectedDuration] = useState<string>('any');
  const [selectedGroupSize, setSelectedGroupSize] = useState<string>('any');

  const { data: tours, isLoading, error } = useQuery<Tour[]>({
    queryKey: ['/api/tours'],
  });

  const handleFilterChange = () => {
    // Filter logic would go here
    console.log('Filtering with:', { searchQuery, priceRange, selectedDuration, selectedGroupSize });
  };

  const filteredTours = tours?.filter(tour => {
    // Basic search filtering
    if (searchQuery && !tour.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tour.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Price range filtering
    if (tour.price < priceRange[0] || tour.price > priceRange[1]) {
      return false;
    }
    
    // Duration filtering
    if (selectedDuration !== 'any') {
      if (selectedDuration === 'short' && !tour.duration.includes('hour') && 
          !tour.duration.match(/^[1-3] day/)) {
        return false;
      } else if (selectedDuration === 'medium' && 
                !tour.duration.match(/^[4-7] day/)) {
        return false;
      } else if (selectedDuration === 'long' && 
                !tour.duration.match(/^[8-9] day/) && 
                !tour.duration.match(/^1\d+ day/)) {
        return false;
      }
    }
    
    // Group size filtering
    if (selectedGroupSize !== 'any') {
      if (!tour.groupSize) return false;
      
      if (selectedGroupSize === 'small' && 
          !tour.groupSize.toLowerCase().includes('small')) {
        return false;
      } else if (selectedGroupSize === 'private' && 
                !tour.groupSize.toLowerCase().includes('private')) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Tours & Activities | {SITE_NAME}</title>
        <meta name="description" content="Find and book exciting tours and activities for your next adventure. Discover guided tours, cultural experiences, and outdoor activities worldwide." />
      </Helmet>

      <main className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">Discover Amazing Tours & Activities</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-heading text-xl font-bold mb-4">Filters</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <Input 
                    type="text" 
                    placeholder="Tour name or activities" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex justify-between mb-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={500}
                    step={10}
                    onValueChange={(value) => setPriceRange(value as number[])}
                    className="my-4"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Duration</SelectItem>
                      <SelectItem value="short">Short (1-3 hours or 1-3 days)</SelectItem>
                      <SelectItem value="medium">Medium (4-7 days)</SelectItem>
                      <SelectItem value="long">Long (8+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Group Size</label>
                  <Select value={selectedGroupSize} onValueChange={setSelectedGroupSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any group size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Group Size</SelectItem>
                      <SelectItem value="small">Small Group</SelectItem>
                      <SelectItem value="private">Private Tour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Inclusions</label>
                  <div className="space-y-2">
                    {['Transportation', 'Meals', 'Guide', 'Entrance Fees', 'Hotel Pickup'].map((inclusion) => (
                      <div key={inclusion} className="flex items-center">
                        <Checkbox id={`inclusion-${inclusion}`} />
                        <label htmlFor={`inclusion-${inclusion}`} className="ml-2 text-sm">
                          {inclusion}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleFilterChange}>
                  Apply Filters
                </Button>
              </div>
            </div>
            
            {/* Tour listings */}
            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-xl overflow-hidden">
                      <Skeleton className="h-56 w-full" />
                      <div className="p-5">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-12 w-full mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-1/4" />
                          <Skeleton className="h-6 w-1/4" />
                        </div>
                        <Skeleton className="h-10 w-full mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredTours && filteredTours.length > 0 ? (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-neutral-600">{filteredTours.length} tours found</p>
                    <Select defaultValue="recommended">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                        <SelectItem value="rating">Highest Rating</SelectItem>
                        <SelectItem value="duration-short">Duration (Shortest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-12 rounded-lg shadow-md text-center">
                  <h3 className="font-heading text-xl font-bold mb-2">No tours found</h3>
                  <p className="text-neutral-600 mb-4">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setPriceRange([0, 500]);
                    setSelectedDuration('any');
                    setSelectedGroupSize('any');
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
