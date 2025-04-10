import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Calendar, CreditCard, MapPin, User } from 'lucide-react';

export default function UserDashboard() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="sticky top-4 flex flex-col gap-2">
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium leading-none mb-1">{user.username}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col">
                <Link href="/account/dashboard">
                  <Button variant="ghost" className="justify-start w-full rounded-none rounded-t-lg h-12 px-4">
                    <User className="mr-2 h-5 w-5" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/account/bookings">
                  <Button variant="ghost" className="justify-start w-full rounded-none h-12 px-4">
                    <Calendar className="mr-2 h-5 w-5" />
                    My Bookings
                  </Button>
                </Link>
                <Link href="/account/payments">
                  <Button variant="ghost" className="justify-start w-full rounded-none h-12 px-4">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment History
                  </Button>
                </Link>
                <Link href="/account/profile">
                  <Button variant="ghost" className="justify-start w-full rounded-none rounded-b-lg h-12 px-4">
                    <User className="mr-2 h-5 w-5" />
                    Profile Settings
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Welcome, {user.fullName || user.username}!</h1>
          
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>View your upcoming trips</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/account/bookings">
                  <Button className="w-full">View Bookings</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <MapPin className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Explore Destinations</CardTitle>
                  <CardDescription>Discover Puerto Galera</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/destinations">
                  <Button className="w-full">Browse Destinations</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your account</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/account/profile">
                  <Button className="w-full">Edit Profile</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Popular services and destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <Link href="/hotels">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-1">
                      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                      <path d="M2 21h20" />
                      <path d="M12 7v.01" />
                      <path d="M7 7v.01" />
                      <path d="M17 7v.01" />
                      <path d="M12 11v.01" />
                      <path d="M17 11v.01" />
                      <path d="M7 11v.01" />
                      <path d="M12 15v.01" />
                      <path d="M17 15v.01" />
                      <path d="M7 15v.01" />
                    </svg>
                    Hotels
                  </Button>
                </Link>
                
                <Link href="/tours">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-1">
                      <path d="M21 8h-2a2 2 0 0 0-2 2v2m0-4v4h4" />
                      <path d="M7 2h10" />
                      <path d="M12 14v8" />
                      <path d="M12 18H3" />
                      <path d="M9 5v9a2 2 0 0 0 2 2h1.9" />
                      <path d="M14 16v1" />
                    </svg>
                    Tours
                  </Button>
                </Link>
                
                <Link href="/packages">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-1">
                      <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
                      <path d="m7 16.5-4.74-2.85" />
                      <path d="m7 16.5 5-3" />
                      <path d="M7 16.5v5.17" />
                      <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
                      <path d="m17 16.5-5-3" />
                      <path d="m17 16.5 4.74-2.85" />
                      <path d="M17 16.5v5.17" />
                      <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
                      <path d="M12 8 7.26 5.15" />
                      <path d="m12 8 4.74-2.85" />
                      <path d="M12 13.5V8" />
                    </svg>
                    Packages
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}