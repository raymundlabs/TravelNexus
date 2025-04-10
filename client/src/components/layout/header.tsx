import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Globe, 
  LogIn, 
  LogOut, 
  User,
  UserCircle,
  Menu as MenuIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logoutMutation, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Globe className="text-primary h-8 w-8 mr-2" />
              <span className="font-heading font-bold text-2xl text-primary">{SITE_NAME}</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`font-medium transition-colors ${
                  location === link.href ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center">
                  <UserCircle className="h-8 w-8 text-primary mr-2" />
                  <span className="font-medium">{user?.fullName || user?.username}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-1" /> 
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/auth">
                  <Button className="flex items-center">
                    <LogIn className="h-4 w-4 mr-1" /> Login
                  </Button>
                </Link>
              </div>
            )}
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`font-medium text-lg py-2 transition-colors ${
                        location === link.href ? 'text-primary' : 'hover:text-primary'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center mb-3">
                          <UserCircle className="h-8 w-8 text-primary mr-2" />
                          <span className="font-medium">{user?.fullName || user?.username}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center" 
                          onClick={() => {
                            logoutMutation.mutate();
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
                          className="w-full flex items-center justify-center"
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
    </header>
  );
}
