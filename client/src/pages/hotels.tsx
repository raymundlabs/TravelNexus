import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { type Hotel } from '@shared/schema';
import HotelCard from '@/components/booking/hotel-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SITE_NAME } from '@/lib/constants';

export default function Hotels() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  
  const [searchQuery, setSearchQuery] = useState(params.get('destination') || '');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<string>('any');
  const [amenities, setAmenities] = useState<string[]>([]);

  const { data: hotels, isLoading, error } = useQuery<Hotel[]>({
    queryKey: ['/api/hotels'],
  });

  const handleFilterChange = () => {
    // Filter logic would go here
    console.log('Filtering with:', { searchQuery, priceRange, selectedRating, amenities });
  };

  const filteredHotels = hotels?.filter(hotel => {
    // Basic search filtering
    if (searchQuery && !hotel.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Price range filtering
    if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) {
      return false;
    }
    
    // Rating filtering
    if (selectedRating !== 'any' && hotel.rating < parseInt(selectedRating)) {
      return false;
    }
    
    // Amenities filtering
    if (amenities.length > 0) {
      if (!hotel.amenities || !amenities.every(amenity => 
        hotel.amenities.some(hotelAmenity => 
          hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      )) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Hotels | {SITE_NAME}</title>
        <meta name="description" content="Find and book luxury hotels and accommodations worldwide. Best price guarantee and exclusive deals." />
      </Helmet>

      <main className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">Find Your Perfect Hotel</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-heading text-xl font-bold mb-4">Filters</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <Input 
                    type="text" 
                    placeholder="Hotel name or location" 
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
                    max={1000}
                    step={10}
                    onValueChange={(value) => setPriceRange(value as number[])}
                    className="my-4"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Star Rating</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Amenities</label>
                  <div className="space-y-2">
                    {['Pool', 'WiFi', 'Spa', 'Restaurant', 'Gym', 'Bar'].map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <Checkbox 
                          id={`amenity-${amenity}`} 
                          checked={amenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAmenities([...amenities, amenity]);
                            } else {
                              setAmenities(amenities.filter(a => a !== amenity));
                            }
                          }}
                        />
                        <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm">
                          {amenity}
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
            
            {/* Hotel listings */}
            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="rounded-xl overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-6 w-1/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredHotels && filteredHotels.length > 0 ? (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-neutral-600">{filteredHotels.length} hotels found</p>
                    <Select defaultValue="recommended">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                        <SelectItem value="rating">Highest Rating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredHotels.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-12 rounded-lg shadow-md text-center">
                  <h3 className="font-heading text-xl font-bold mb-2">No hotels found</h3>
                  <p className="text-neutral-600 mb-4">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setPriceRange([0, 1000]);
                    setSelectedRating('any');
                    setAmenities([]);
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
