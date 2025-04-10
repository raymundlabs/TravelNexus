import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import TourCard from '../booking/tour-card';
import { type Tour } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function PopularTours() {
  const { data: tours, isLoading, error } = useQuery<Tour[]>({
    queryKey: ['/api/tours/featured'],
  });

  if (error) {
    console.error('Error fetching tours:', error);
  }

  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Exciting Tours & Activities</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Find and book unforgettable experiences for your next adventure
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 3 }).map((_, index) => (
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
            ))
          ) : tours && tours.length > 0 ? (
            // Tours data
            tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))
          ) : (
            // No data state
            <div className="col-span-3 text-center py-8">
              <p className="text-neutral-500">No tours available at the moment.</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Link href="/tours">Browse All Tours</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
