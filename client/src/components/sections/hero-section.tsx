import SearchWidget from '../booking/search-widget';
import { SITE_DESCRIPTION, SITE_TAGLINE } from '@/lib/constants';

export default function HeroSection() {
  return (
    <section 
      className="h-[600px] flex items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")'
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="font-accent text-4xl md:text-5xl lg:text-6xl mb-4">{SITE_DESCRIPTION}</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">{SITE_TAGLINE}</p>
        
        <SearchWidget className="max-w-5xl mx-auto" />
      </div>
    </section>
  );
}
