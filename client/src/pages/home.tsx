import { Helmet } from 'react-helmet';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import whiteBeachImage from '@/assets/images/white-beach-puerto-galera-real.jpg';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{SITE_NAME} | {SITE_DESCRIPTION}</title>
        <meta name="description" content="Discover White Beach Puerto Galera. Book hotels, tours, and vacation packages. Unforgettable experiences await." />
      </Helmet>

      <main>
        {/* Simple Hero Section */}
        <section 
          className="h-[650px] flex items-center justify-center relative bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${whiteBeachImage})`
          }}
        >
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-3 font-bold">
              {SITE_DESCRIPTION}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              The No.1 Site for White Beach Puerto Galera Bookings!
            </p>
            
            <div className="flex justify-center gap-4">
              <a 
                href="/hotels" 
                className="bg-primary hover:bg-primary-600 text-white py-3 px-8 rounded-md text-lg"
              >
                Find Hotels
              </a>
              <a 
                href="/tours" 
                className="bg-secondary hover:bg-secondary-600 text-white py-3 px-8 rounded-md text-lg"
              >
                Find Tours
              </a>
            </div>
          </div>
        </section>

        {/* Simple Featured Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Discover White Beach Puerto Galera
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Hotels', 'Tours', 'Packages'].map((item) => (
                <div key={item} className="bg-gray-50 p-6 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-semibold mb-4">{item}</h3>
                  <p className="text-gray-600 mb-4">
                    Explore our selection of {item.toLowerCase()} in White Beach, Puerto Galera.
                  </p>
                  <a 
                    href={`/${item.toLowerCase()}`} 
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Browse {item} →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
