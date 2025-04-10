import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PackageCard from '../booking/package-card';
import { type Package } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function VacationPackages() {
  const { data: packages, isLoading, error } = useQuery<Package[]>({
    queryKey: ['/api/packages/featured'],
  });

  if (error) {
    console.error('Error fetching packages:', error);
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Curated Vacation Packages</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            All-inclusive packages with accommodation, tours, and more
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 2 }).map((_, index) => (
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
            ))
          ) : packages && packages.length > 0 ? (
            // Packages data
            packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))
          ) : (
            // No data state
            <div className="col-span-2 text-center py-8">
              <p className="text-neutral-500">No vacation packages available at the moment.</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild className="bg-secondary hover:bg-secondary-600 text-white">
            <Link href="/packages">View All Packages</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
