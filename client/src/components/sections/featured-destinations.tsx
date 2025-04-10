import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import DestinationCard from '../booking/destination-card';
import { type Destination } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedDestinations() {
  const { data: destinations, isLoading, error } = useQuery<Destination[]>({
    queryKey: ['/api/destinations/featured'],
  });

  if (error) {
    console.error('Error fetching destinations:', error);
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Popular Destinations</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Explore our most popular travel destinations, perfect for your next adventure
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-xl overflow-hidden">
                <Skeleton className="h-72 w-full" />
              </div>
            ))
          ) : destinations && destinations.length > 0 ? (
            // Destinations data
            destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))
          ) : (
            // No data state
            <div className="col-span-3 text-center py-8">
              <p className="text-neutral-500">No destinations found.</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/destinations" 
            className="inline-flex items-center font-medium text-primary hover:text-primary-dark"
          >
            View all destinations 
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
