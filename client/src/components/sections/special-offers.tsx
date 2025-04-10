import { useQuery } from '@tanstack/react-query';
import SpecialOfferCard from '../booking/special-offer-card';
import { type SpecialOffer } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SpecialOffers() {
  const { data: offers, isLoading, error } = useQuery<SpecialOffer[]>({
    queryKey: ['/api/special-offers'],
  });

  if (error) {
    console.error('Error fetching special offers:', error);
  }

  const handlePrevOffer = () => {
    // Previous offer logic would go here
    console.log('Previous offer');
  };

  const handleNextOffer = () => {
    // Next offer logic would go here
    console.log('Next offer');
  };

  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3 text-center md:text-left">Special Offers</h2>
            <p className="text-neutral-600 max-w-2xl text-center md:text-left">
              Limited-time deals and exclusive packages for our customers
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-2">
              <Button 
                id="prev-offer" 
                onClick={handlePrevOffer}
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-primary hover:text-white hover:border-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                id="next-offer" 
                onClick={handleNextOffer}
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-primary hover:text-white hover:border-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-10 w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : offers && offers.length > 0 ? (
            // Offers data
            offers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))
          ) : (
            // No data state
            <div className="col-span-3 text-center py-8">
              <p className="text-neutral-500">No special offers available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
