import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { type Package } from '@shared/schema';
import PackageCard from '@/components/booking/package-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SITE_NAME } from '@/lib/constants';

export default function Packages() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  
  const [searchQuery, setSearchQuery] = useState(params.get('destination') || '');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedDuration, setSelectedDuration] = useState<string>('any');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  const { data: packages, isLoading, error } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });

  const handleFilterChange = () => {
    // Filter logic would go here
    console.log('Filtering with:', { searchQuery, priceRange, selectedDuration, onlyDiscounted });
  };

  const filteredPackages = packages?.filter(pkg => {
    // Basic search filtering
    if (searchQuery && !pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !pkg.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Price range filtering
    const packagePrice = pkg.discountedPrice || pkg.price;
    if (packagePrice < priceRange[0] || packagePrice > priceRange[1]) {
      return false;
    }
    
    // Duration filtering
    if (selectedDuration !== 'any') {
      if (selectedDuration === 'short' && !pkg.duration.match(/^[1-3] day/)) {
        return false;
      } else if (selectedDuration === 'medium' && 
                !pkg.duration.match(/^[4-7] day/)) {
        return false;
      } else if (selectedDuration === 'long' && 
                !pkg.duration.match(/^[8-9] day/) && 
                !pkg.duration.match(/^1\d+ day/)) {
        return false;
      }
    }
    
    // Only discounted packages
    if (onlyDiscounted && (!pkg.discountedPrice || pkg.discountedPrice >= pkg.price)) {
      return false;
    }
    
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Vacation Packages | {SITE_NAME}</title>
        <meta name="description" content="Browse our curated vacation packages with accommodations, tours, and more. All-inclusive travel packages for your perfect getaway." />
      </Helmet>

      <main className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">Curated Vacation Packages</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-heading text-xl font-bold mb-4">Filters</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <Input 
                    type="text" 
                    placeholder="Package name or destination" 
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
                    max={5000}
                    step={100}
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
                      <SelectItem value="short">Short (1-3 days)</SelectItem>
                      <SelectItem value="medium">Medium (4-7 days)</SelectItem>
                      <SelectItem value="long">Long (8+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center mb-6">
                  <input 
                    type="checkbox" 
                    id="discounted" 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={onlyDiscounted}
                    onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  />
                  <label htmlFor="discounted" className="ml-2 block text-sm font-medium">
                    Only show discounted packages
                  </label>
                </div>
                
                <Button className="w-full" onClick={handleFilterChange}>
                  Apply Filters
                </Button>
              </div>
            </div>
            
            {/* Package listings */}
            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg">
                      <div className="md:w-2/5">
                        <Skeleton className="h-full w-full min-h-[200px]" />
                      </div>
                      <div className="md:w-3/5 p-6">
                        <Skeleton className="h-8 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-36 mb-3" />
                        <Skeleton className="h-16 w-full mb-4" />
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-24 rounded-full" />
                          ))}
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-8 w-1/3" />
                          <Skeleton className="h-10 w-1/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPackages && filteredPackages.length > 0 ? (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <p className="text-neutral-600">{filteredPackages.length} packages found</p>
                    <Select defaultValue="recommended">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                        <SelectItem value="rating">Highest Rating</SelectItem>
                        <SelectItem value="discount">Biggest Discount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-8">
                    {filteredPackages.map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-12 rounded-lg shadow-md text-center">
                  <h3 className="font-heading text-xl font-bold mb-2">No packages found</h3>
                  <p className="text-neutral-600 mb-4">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setPriceRange([0, 5000]);
                    setSelectedDuration('any');
                    setOnlyDiscounted(false);
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
