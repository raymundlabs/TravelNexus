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
          
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All your bookings in one place
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground mt-1">
                  You have 2 upcoming bookings
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Previous bookings and trips
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">125</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Collect points with each booking
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">White Beach Resort & Spa</h4>
                        <p className="text-sm text-muted-foreground">Hotel booking</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>May 15 - May 18, 2023</span>
                      <span className="font-medium">₱18,500</span>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Island Hopping Adventure</h4>
                        <p className="text-sm text-muted-foreground">Tour booking</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>April 5, 2023</span>
                      <span className="font-medium">₱2,500</span>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Puerto Galera Explorer Package</h4>
                        <p className="text-sm text-muted-foreground">Package booking</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        Upcoming
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>June 12 - June 15, 2023</span>
                      <span className="font-medium">₱32,750</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link href="/account/bookings">
                    <Button variant="outline" className="w-full">View All Bookings</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Popular services and destinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
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
                      Book Hotels
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
                      Book Tours
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
                      Book Packages
                    </Button>
                  </Link>
                  
                  <Link href="/account/profile">
                    <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center">
                      <User className="h-8 w-8 mb-1" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}