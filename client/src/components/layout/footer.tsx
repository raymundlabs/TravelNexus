import { Link } from 'wouter';
import { SITE_NAME, SITE_OPERATOR, SITE_OPERATOR_SLOGAN, SITE_URL, FOOTER_LINKS, SOCIAL_LINKS, PAYMENT_METHODS } from '@/lib/constants';
import { Globe, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center mb-4">
              <Globe className="text-white h-8 w-8 mr-2" />
              <span className="font-heading font-bold text-2xl">{SITE_NAME}</span>
            </div>
            <p className="text-neutral-400 mb-4">
              Discover the beauty of Puerto Galera with the most trusted tour booking site in White Beach.
              We offer the best rates for hotels, tours, packages, and ferry tickets.
            </p>
            <div className="mb-6">
              <div className="flex items-start mb-2">
                <MapPin className="text-primary h-5 w-5 mr-2 mt-0.5" />
                <p className="text-neutral-300 text-sm">White Beach, Puerto Galera, Oriental Mindoro, Philippines</p>
              </div>
              <div className="flex items-center mb-2">
                <Phone className="text-primary h-5 w-5 mr-2" />
                <p className="text-neutral-300 text-sm">+63 912 345 6789</p>
              </div>
              <div className="flex items-center">
                <Mail className="text-primary h-5 w-5 mr-2" />
                <p className="text-neutral-300 text-sm">info@{SITE_URL}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href} 
                  className="bg-neutral-700 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  aria-label={`Follow us on ${link.icon}`}
                >
                  <i className={`fab fa-${link.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-neutral-400">
              {FOOTER_LINKS.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-lg mb-4">Destinations</h4>
            <ul className="space-y-2 text-neutral-400">
              {FOOTER_LINKS.destinations.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-neutral-400">
              {FOOTER_LINKS.support.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-neutral-400">
              {FOOTER_LINKS.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-400 text-sm mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} {SITE_OPERATOR}. All rights reserved.</p>
            <p className="text-xs mt-1">{SITE_OPERATOR_SLOGAN}</p>
          </div>
          <div className="flex items-center">
            {PAYMENT_METHODS.map((method, index) => (
              <img 
                key={index}
                src={method.icon} 
                alt={method.name} 
                className={`h-8 w-auto ${index < PAYMENT_METHODS.length - 1 ? 'mr-2' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
