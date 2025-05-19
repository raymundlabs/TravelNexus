import SearchWidget from '../booking/search-widget';
import { SITE_DESCRIPTION, SITE_TAGLINE, SITE_OPERATOR, SITE_OPERATOR_SLOGAN } from '@/lib/constants';
import whiteBeachImage from '@/assets/images/white-beach-puerto-galera-real.jpg';
import { Star, MapPin, Search, Calendar, Users, Award } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${whiteBeachImage})`,
          filter: 'brightness(0.8)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-24 md:py-36">
        <div className="max-w-4xl">
          {/* TripAdvisor-style Badge */}
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-md mb-6">
            <img 
              src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" 
              alt="TripAdvisor Logo" 
              className="h-8 mr-2" 
            />
            <div className="h-6 w-[1px] bg-gray-300 mx-2"></div>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#00aa6c] text-[#00aa6c]" />
                ))}
              </div>
              <span className="text-gray-700 text-sm ml-1">4.8 (356 reviews)</span>
            </div>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4">
            {SITE_DESCRIPTION}
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mb-6">
            {SITE_TAGLINE}
          </p>
          
          {/* Location badge */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <MapPin className="text-white h-5 w-5 mr-2" />
            <span className="text-white text-sm">
              {SITE_OPERATOR} • {SITE_OPERATOR_SLOGAN}
            </span>
          </div>
        </div>
        
        {/* TripAdvisor-style Search Widget */}
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Where to?" 
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#00aa6c]"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Check-in - Check-out" 
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#00aa6c]"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Guests" 
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#00aa6c]"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-[#00aa6c]" />
                <span className="ml-2 text-gray-700">Hotels</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-[#00aa6c]" />
                <span className="ml-2 text-gray-700">Tours</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-[#00aa6c]" />
                <span className="ml-2 text-gray-700">Packages</span>
              </label>
            </div>
            
            <button className="bg-[#00aa6c] hover:bg-[#00aa6c]/90 text-white font-medium py-3 px-8 rounded-lg flex items-center justify-center transition-colors">
              <Search className="h-5 w-5 mr-2" />
              <span>Search</span>
            </button>
          </div>
        </div>
        
        {/* Traveler's Choice Badge */}
        <div className="mt-8 flex items-center">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md inline-flex items-center">
            <Award className="text-[#00aa6c] h-5 w-5 mr-2" />
            <span className="font-medium text-gray-800 text-sm">Travelers' Choice 2023</span>
          </div>
        </div>
      </div>
    </section>
  );
}
