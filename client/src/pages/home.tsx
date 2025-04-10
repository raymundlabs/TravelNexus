import { Helmet } from 'react-helmet';
import HeroSection from '@/components/sections/hero-section';
import FeaturedDestinations from '@/components/sections/featured-destinations';
import SpecialOffers from '@/components/sections/special-offers';
import PopularHotels from '@/components/sections/popular-hotels';
import PopularTours from '@/components/sections/popular-tours';
import VacationPackages from '@/components/sections/vacation-packages';
import Testimonials from '@/components/sections/testimonials';
import Newsletter from '@/components/sections/newsletter';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{SITE_NAME} | {SITE_DESCRIPTION}</title>
        <meta name="description" content="Discover your perfect getaway with Wanderlust Travel. Book hotels, tours, and vacation packages worldwide. Unforgettable experiences await." />
      </Helmet>

      <main>
        <HeroSection />
        <FeaturedDestinations />
        <SpecialOffers />
        <PopularHotels />
        <PopularTours />
        <VacationPackages />
        <Testimonials />
        <Newsletter />
      </main>
    </>
  );
}
