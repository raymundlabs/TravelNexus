import { Helmet } from 'react-helmet';
import HeroSection from '@/components/sections/hero-section';
import Testimonials from '@/components/sections/testimonials';
import { useEffect, useState } from 'react';
import PackageCard from '@/components/PackageCard'; // Import the new package card component
import { SITE_NAME } from '@/lib/constants'; // SITE_DESCRIPTION might not be needed here unless used in Helmet
import { supabase } from '@/lib/supabase'; // Assuming supabase client is here

// Define the Package interface based on your Supabase table
interface Package {
  id: number;
  name: string;
  description: string;
  destination_id: number;
  duration: string;
  price: number;
  discounted_price?: number | null;
  image_urls: string; // As per schema: text not null
  fetured_image?: string | null; // As per schema: text null
  rating?: number | null;
  review_count?: number;
  highlights?: string[] | null;
  inclusions?: string[] | null;
  is_bestseller?: boolean;
  discount_percentage?: number | null;
  featured?: boolean;
  num_pax?: string | null;
}

export default function HomePage2() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('packages')
          .select('*')
          .eq('featured', true);

        if (supabaseError) {
          throw supabaseError;
        }
        setPackages(data || []);
      } catch (err: any) {
        console.error('Error fetching featured packages:', err);
        setError(err.message || 'Failed to fetch packages.');
      }
      setLoading(false);
    };

    fetchFeaturedPackages();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`Packages | ${SITE_NAME}`}</title>
        <meta name="description" content={`Explore exciting travel packages with ${SITE_NAME}. Book your next adventure.`} />
      </Helmet>

      <main>
        <HeroSection />
        
        {/* Section for Packages */}
        <section className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Featured Travel Packages</h2>
              <p className="max-w-2xl mx-auto text-neutral-600">
                Browse our popular travel packages and book your dream vacation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading && <p className="col-span-full text-center">Loading packages...</p>}
              {error && <p className="col-span-full text-center text-red-500">Error: {error}</p>}
              {!loading && !error && packages.length === 0 && (
                <p className="col-span-full text-center">No featured packages available at the moment.</p>
              )}
              {!loading && !error && packages.map((pkg, index) => (
                <PackageCard
                  key={pkg.id}
                  packageData={{
                    id: pkg.id,
                    name: pkg.name,
                    // For location, using package name as a placeholder. 
                    // Consider joining with 'destinations' table for actual location name if needed.
                    location: pkg.name, // Placeholder: consider fetching actual destination name
                    imageUrl: pkg.fetured_image || pkg.image_urls, // Prioritize fetured_image
                    duration: pkg.duration,
                    price: pkg.price.toFixed(2), // Format price as string with 2 decimal places
                    content: pkg.description,
                    // Ensure other props expected by PackageCard are provided or are optional
                  }}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />
      </main>
    </>
  );
} 