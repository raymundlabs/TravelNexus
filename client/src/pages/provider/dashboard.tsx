import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import { 
  Hotel, Building, Calendar, CreditCard, 
  Users, Settings, LogOut, BarChart3 
} from 'lucide-react';

export default function ProviderDashboard() {
  const { user, isLoading, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!isLoading && (!user || user.roleId !== 3)) {
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
  
  if (!user || user.roleId !== 3) {
    return null; // Will redirect in useEffect
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Mock data for hotel provider dashboard
  const mockData = {
    totalHotels: 3,
    totalRooms: 45,
    totalBookings: 125,
    totalRevenue: 850000,
    occupancyRate: 78,
    recentBookings: [
      { id: 1, guestName: 'Maria Santos', checkIn: '2025-04-15', checkOut: '2025-04-18', roomType: 'Deluxe', status: 'Confirmed' },
      { id: 2, guestName: 'John Smith', checkIn: '2025-04-16', checkOut: '2025-04-20', roomType: 'Superior', status: 'Pending' },
      { id: 3, guestName: 'Elena Rodriguez', checkIn: '2025-04-18', checkOut: '2025-04-21', roomType: 'Family', status: 'Confirmed' },
    ],
    propertyPerformance: [
      { name: 'White Beach Resort & Spa', bookings: 72, revenue: 520000 },
      { name: 'Sunset Beach Bungalows', bookings: 38, revenue: 210000 },
      { name: 'Palm Grove Beachfront', bookings: 15, revenue: 120000 },
    ]
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r">
        <div className="p-4">
          <Link href="/">
            <h2 className="text-xl font-bold flex items-center">
              White Beach
              <span className="ml-1 text-xs bg-primary text-white px-1 py-0.5 rounded">Provider</span>
            </h2>
          </Link>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link href="/provider/dashboard">
            <Button variant="default" className="w-full justify-start">
              <BarChart3 className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          
          <Link href="/provider/properties">
            <Button variant="ghost" className="w-full justify-start">
              <Hotel className="mr-2 h-5 w-5" />
              My Properties
            </Button>
          </Link>
          
          <Link href="/provider/rooms">
            <Button variant="ghost" className="w-full justify-start">
              <Building className="mr-2 h-5 w-5" />
              Rooms
            </Button>
          </Link>
          
          <Link href="/provider/bookings">
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-5 w-5" />
              Bookings
            </Button>
          </Link>
          
          <Link href="/provider/payments">
            <Button variant="ghost" className="w-full justify-start">
              <CreditCard className="mr-2 h-5 w-5" />
              Payments
            </Button>
          </Link>
          
          <Link href="/provider/guests">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-5 w-5" />
              Guests
            </Button>
          </Link>
          
          <Link href="/provider/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground">Hotel Provider</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1">
        <header className="border-b p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          
          {/* Mobile menu button would go here */}
          <div className="md:hidden">
            <Button variant="outline" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </Button>
          </div>
        </header>
        
        <main className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.totalHotels}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.totalRooms}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.occupancyRate}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.totalBookings}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Monthly revenue for your properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-60">
                    <div className="text-center">
                      <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Revenue charts will be available soon.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance</CardTitle>
                  <CardDescription>
                    Overview of your properties' performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 p-3 text-xs font-medium text-muted-foreground">
                      <div>Property Name</div>
                      <div>Bookings</div>
                      <div>Revenue (₱)</div>
                    </div>
                    <div className="divide-y">
                      {mockData.propertyPerformance.map((property, index) => (
                        <div key={index} className="grid grid-cols-3 p-3 text-sm">
                          <div className="font-medium">{property.name}</div>
                          <div>{property.bookings}</div>
                          <div>{property.revenue.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>
                    Your most recent bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-3 text-xs font-medium text-muted-foreground">
                      <div>ID</div>
                      <div>Guest</div>
                      <div>Dates</div>
                      <div>Room Type</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {mockData.recentBookings.map((booking) => (
                        <div key={booking.id} className="grid grid-cols-5 p-3 text-sm">
                          <div className="font-medium">#{booking.id}</div>
                          <div>{booking.guestName}</div>
                          <div>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</div>
                          <div>{booking.roomType}</div>
                          <div>
                            <span 
                              className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}