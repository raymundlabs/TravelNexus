import { Link } from 'wouter';
import { SITE_NAME, SITE_OPERATOR, SITE_OPERATOR_SLOGAN, SITE_URL, FOOTER_LINKS, SOCIAL_LINKS, PAYMENT_METHODS } from '@/lib/constants';
import { Globe, MapPin, Phone, Mail } from 'lucide-react';
import { Facebook, Instagram, Twitter, Linkedin, Send, Award, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Globe className="text-[#00aa6c] h-6 w-6 mr-2" />
              <span className="font-heading font-bold text-xl text-gray-900">{SITE_NAME}</span>
            </div>
            <p className="mb-4 text-gray-600 max-w-md">
              Discover amazing travel experiences with our curated selection of hotels, 
              tours, and vacation packages. We help you create memories that last a lifetime.
            </p>
            <div className="flex items-center space-x-3 mb-6">
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white text-gray-600 hover:text-[#00aa6c] flex items-center justify-center border border-gray-200 transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white text-gray-600 hover:text-[#00aa6c] flex items-center justify-center border border-gray-200 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white text-gray-600 hover:text-[#00aa6c] flex items-center justify-center border border-gray-200 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white text-gray-600 hover:text-[#00aa6c] flex items-center justify-center border border-gray-200 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm max-w-[220px] mb-6">
              <div className="flex items-center mb-2">
                <Award className="text-[#00aa6c] h-5 w-5 mr-2" />
                <span className="font-medium text-gray-900">Travelers' Choice</span>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#00aa6c] text-[#00aa6c]" />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                Based on traveler reviews and ratings on TripAdvisor
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-[#00aa6c] transition-colors duration-300 flex items-center"
                  >
                    <Check className="h-4 w-4 mr-2 text-[#00aa6c]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Popular Destinations</h3>
            <ul className="space-y-3">
              {['Bali', 'Puerto Galera', 'Boracay', 'El Nido', 'Siargao'].map((destination) => (
                <li key={destination}>
                  <Link 
                    href={`/destinations/${destination.toLowerCase().replace(' ', '-')}`} 
                    className="text-gray-600 hover:text-[#00aa6c] transition-colors duration-300 flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-2 text-[#00aa6c]" />
                    {destination}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-[#00aa6c] flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">123 Travel Street, Manila, Philippines 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-[#00aa6c] flex-shrink-0" />
                <a href="tel:+6391234567890" className="text-gray-600 hover:text-[#00aa6c]">+63 912 345 6789</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#00aa6c] flex-shrink-0" />
                <a href="mailto:info@travelnexus.com" className="text-gray-600 hover:text-[#00aa6c]">info@travelnexus.com</a>
              </li>
            </ul>
            
            <h3 className="font-medium text-gray-900 mb-3">Subscribe</h3>
            <div className="relative">
              <Input
                type="email"
                placeholder="Your email address"
                className="pr-12 bg-white border-gray-200"
              />
              <Button 
                size="icon" 
                className="absolute right-0 top-0 bottom-0 bg-[#00aa6c] hover:bg-[#00aa6c]/90 text-white rounded-l-none"
                aria-label="Subscribe"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center">
              <img 
                src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" 
                alt="TripAdvisor Logo" 
                className="h-12"
              />
            </div>
            <div className="text-center px-4 py-2 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 font-medium">Verified Partner</p>
              <p className="text-xs text-gray-500">Official TravelNexus Service</p>
            </div>
            <div className="text-center px-4 py-2 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 font-medium">Secure Payments</p>
              <p className="text-xs text-gray-500">SSL Encrypted</p>
            </div>
            <div className="text-center px-4 py-2 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 font-medium">24/7 Support</p>
              <p className="text-xs text-gray-500">Live Chat & Phone</p>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex justify-center mt-4 space-x-4 text-sm">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-[#00aa6c]">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-500 hover:text-[#00aa6c]">
              Terms of Service
            </Link>
            <Link href="/site-map" className="text-gray-500 hover:text-[#00aa6c]">
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
