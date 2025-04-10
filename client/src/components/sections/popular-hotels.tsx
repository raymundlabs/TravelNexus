import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import HotelCard from '../booking/hotel-card';
import { type Hotel } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function PopularHotels() {
  const { data: hotels, isLoading, error } = useQuery<Hotel[]>({
    queryKey: ['/api/hotels/featured'],
  });

  if (error) {
    console.error('Error fetching hotels:', error);
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Luxury Accommodations</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium hotels and resorts worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, index) => (
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
            ))
          ) : hotels && hotels.length > 0 ? (
            // Hotels data
            hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))
          ) : (
            // No data state
            <div className="col-span-4 text-center py-8">
              <p className="text-neutral-500">No hotels available at the moment.</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Link href="/hotels">Explore All Hotels</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
