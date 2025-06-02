import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard,
  Globe, 
  LogIn, 
  LogOut, 
  User,
  UserCircle,
  Menu as MenuIcon,
  Search,
  Heart,
  Bell,
  ChevronDown,
  Star,
  MapPin,
  Bed,
  Plane,
  UtensilsCrossed,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isLoading, logoutMutation, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 bg-white shadow-md`}>
      {/* Top navigation bar with brand and user actions */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Globe className={`h-8 w-8 mr-2 text-[#00aa6c]`} />
              <span className={`font-heading font-bold text-2xl text-gray-900`}>{SITE_NAME}</span>
            </Link>
          </div>
          
          {/* Search bar for desktop */}
          <div className={`hidden md:flex mx-auto max-w-md w-full px-4 relative ${isSearchExpanded ? 'flex-grow' : ''}`}>
            <div className="relative w-full">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
              <Input
                type="search"
                placeholder="Search destinations, hotels, activities..."
                className={`pl-10 pr-4 py-2 w-full border rounded-full transition-all bg-gray-100 border-gray-200 focus:border-[#00aa6c] text-gray-900`}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(false)}
              />
            </div>
          </div>
          
          {location !== '/' && (
            <nav className={`hidden md:flex space-x-1 ${isSearchExpanded ? 'hidden' : 'flex'}`}>
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`px-3 py-2 rounded-full font-medium transition-colors ${
                    location === link.href 
                      ? 'bg-gray-100 text-[#00aa6c]' 
                      : 'hover:bg-gray-100 text-gray-700 hover:text-[#00aa6c]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <button className={`p-2 rounded-full hover:bg-gray-100 text-gray-700`}>
                  <Bell className="h-5 w-5" />
                </button>
                <button className={`p-2 rounded-full hover:bg-gray-100 text-gray-700`}>
                  <Heart className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-700"
                    onClick={toggleDropdown}
                  >
                    <div className="h-7 w-7 rounded-full bg-[#00aa6c] text-white flex items-center justify-center">
                      <span className="text-sm">{(user?.fullName?.[0] || user?.username?.[0] || 'U').toUpperCase()}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          logoutMutation.mutate(undefined, {
                            onSuccess: () => {
                              window.location.href = '/auth';
                            },
                            onError: (error) => {
                              console.error('Logout failed:', error);
                              alert('Failed to logout. Please try again.');
                            },
                          });
                          setIsDropdownOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth">
                  <Button className={`rounded-full bg-[#00aa6c] hover:bg-[#00aa6c]/90 text-white`}>
                    <LogIn className="h-4 w-4 mr-1" /> Login
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu trigger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden text-gray-700">
                <Button variant="ghost" size="icon" className={scrolled ? "text-gray-700" : "text-white"}>
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[350px]">
                <div className="py-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search destinations, hotels, activities..."
                      className="pl-10 pr-4 py-2 w-full bg-gray-100 border-gray-200"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-1 mb-6">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`px-4 py-2 rounded-md font-medium ${
                          location === link.href ? 'bg-gray-100 text-[#00aa6c]' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center mb-3 px-4">
                          <div className="h-10 w-10 rounded-full bg-[#00aa6c] text-white flex items-center justify-center mr-3">
                            <span>{(user?.fullName?.[0] || user?.username?.[0] || 'U').toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user?.fullName || user?.username}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Star className="h-3 w-3 fill-[#00aa6c] text-[#00aa6c] mr-1" />
                              <span>0 reviews</span>
                            </div>
                          </div>
                        </div>
                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full flex items-center justify-center mb-2 rounded-md">
                            <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
                          </Button>
                        </Link>
                        <Button 
                          className="w-full flex items-center justify-center rounded-md bg-[#00aa6c] hover:bg-[#00aa6c]/90 text-white" 
                          onClick={() => {
                            logoutMutation.mutate(undefined, {
                              onSuccess: () => {
                                window.location.href = '/auth';
                              },
                              onError: (error) => {
                                console.error('Logout failed:', error);
                                alert('Failed to logout. Please try again.');
                              },
                            });
                            setIsMenuOpen(false);
                          }}
                          disabled={logoutMutation.isPending}
                        >
                          <LogOut className="h-4 w-4 mr-1" /> 
                          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                        </Button>
                      </>
                    ) : (
                      <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          className="w-full flex items-center justify-center rounded-md bg-[#00aa6c] hover:bg-[#00aa6c]/90 text-white"
                        >
                          <LogIn className="h-4 w-4 mr-1" /> Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Secondary navigation with categories - TripAdvisor style */}
      {/* <div className={`border-t ${scrolled ? 'border-gray-200 bg-white' : 'border-white/20 bg-[#00aa6c]'}`}>
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-1 -mx-2 md:justify-center hide-scrollbar">
            <Link href="/hotels" className={`flex flex-col items-center px-4 py-2 whitespace-nowrap ${
              scrolled ? 'text-gray-700 hover:text-[#00aa6c]' : 'text-white'
            }`}>
              <Bed className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Hotels</span>
            </Link>
            <Link href="/packages" className={`flex flex-col items-center px-4 py-2 whitespace-nowrap ${
              scrolled ? 'text-gray-700 hover:text-[#00aa6c]' : 'text-white'
            }`}>
              <Plane className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Packages</span>
            </Link>
            <Link href="/tours" className={`flex flex-col items-center px-4 py-2 whitespace-nowrap ${
              scrolled ? 'text-gray-700 hover:text-[#00aa6c]' : 'text-white'
            }`}>
              <MapPin className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Tours</span>
            </Link>
            <Link href="/destinations" className={`flex flex-col items-center px-4 py-2 whitespace-nowrap ${
              scrolled ? 'text-gray-700 hover:text-[#00aa6c]' : 'text-white'
            }`}>
              <Globe className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Destinations</span>
            </Link>
            <Link href="/reviews" className={`flex flex-col items-center px-4 py-2 whitespace-nowrap ${
              scrolled ? 'text-gray-700 hover:text-[#00aa6c]' : 'text-white'
            }`}>
              <Star className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Reviews</span>
            </Link>
          </div>
        </div>
      </div> */}
      
      {/* Add global styles for hiding scrollbar in a clean way */}
      <style>
        {`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        `}
      </style>
    </header>
  );
}
