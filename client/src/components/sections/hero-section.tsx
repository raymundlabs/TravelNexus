import SearchWidget from '../booking/search-widget';
import { SITE_DESCRIPTION, SITE_TAGLINE, SITE_OPERATOR, SITE_OPERATOR_SLOGAN } from '@/lib/constants';
import whiteBeachImage from '@/assets/images/white-beach-puerto-galera-real.jpg';

export default function HeroSection() {
  return (
    <section 
      className="h-[650px] flex items-center justify-center relative bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${whiteBeachImage})`
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="font-accent text-4xl md:text-5xl lg:text-6xl mb-3">{SITE_DESCRIPTION}</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-3">{SITE_TAGLINE}</p>
        <div className="mb-8 flex items-center justify-center">
          <div className="border-t border-b border-white/30 py-2 px-5 inline-block text-white/90">
            <p className="text-sm md:text-base">{SITE_OPERATOR}</p>
            <p className="text-xs md:text-sm font-light">{SITE_OPERATOR_SLOGAN}</p>
          </div>
        </div>
        
        <SearchWidget className="max-w-5xl mx-auto" />
      </div>
    </section>
  );
}
