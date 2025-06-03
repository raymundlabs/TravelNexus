import { Helmet } from 'react-helmet';
import HeroSection from '@/components/sections/hero-section';
import Testimonials from '@/components/sections/testimonials';
import PackageCard from '@/components/PackageCard'; // Import the new package card component
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

// Sample data for packages (replace with actual data fetching later)
const samplePackages = [
  {
    id: 1,
    name: "VILLA MONICA HOTEL",
    location: "Puerto Galera, Philippines",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", // Placeholder hotel image
    duration: "3 Days / 2 Nights", // Assuming a default duration
    price: "1,650.00",
    content: "Near Beachfront - 2 min walk"
  },
  {
    id: 2,
    name: "WHITEBEACH LODGE & RESTAURANT",
    location: "Puerto Galera, Philippines",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", // Placeholder hotel image
    duration: "3 Days / 2 Nights", // Assuming a default duration
    price: "1,799.00",
    content: "Almost beachfront - few steps away. *with free use of common kitchen bbq grilling area"
  },
  {
    id: 3,
    name: "MINDORINE ORIENTAL",
    location: "Puerto Galera, Philippines",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", // Placeholder hotel image
    duration: "3 Days / 2 Nights", // Assuming a default duration
    price: "2,295.00",
    content: "Beachfront Accommodation"
  },
  {
    id: 4,
    name: "THE MANGYAN GRAND HOTEL",
    location: "Puerto Galera, Philippines",
    imageUrl: "https://images.unsplash.com/photo-1596436889106-cca158849e22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", // Placeholder hotel image
    duration: "3 Days / 2 Nights", // Assuming a default duration
    price: "2,595.00",
    content: "Near Beachfront with Swimming Pool"
  },
];

export default function HomePage2() {
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
              {samplePackages.map((packageData, index) => (
                <PackageCard key={packageData.id} packageData={packageData} index={index} />
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