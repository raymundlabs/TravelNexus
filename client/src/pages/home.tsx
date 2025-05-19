import { Helmet } from 'react-helmet';
// Remove other imports
// import HeroSection from '@/components/sections/hero-section';
// import FeaturedDestinations from '@/components/sections/featured-destinations';
// import SpecialOffers from '@/components/sections/special-offers';
// import PopularHotels from '@/components/sections/popular-hotels';
// import PopularTours from '@/components/sections/popular-tours';
// import VacationPackages from '@/components/sections/vacation-packages';
import Testimonials from '@/components/sections/testimonials';
// import Newsletter from '@/components/sections/newsletter';
import { SITE_NAME } from '@/lib/constants'; // Keep SITE_NAME

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{`Traveler Reviews | ${SITE_NAME}`}</title>
        <meta name="description" content="Read what our travelers are saying about their experiences." />
      </Helmet>

      <main>
        {/* Only include Testimonials */}
        <Testimonials />
      </main>
    </>
  );
}
