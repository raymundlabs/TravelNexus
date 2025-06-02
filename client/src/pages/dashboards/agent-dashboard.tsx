import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE_NAME } from "@/lib/constants";
import { 
  Package, 
  Users, 
  Calendar, 
  DollarSign,
  MapPin,
  Clock,
  Star,
  Plus,
  Edit,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function AgentDashboard() {
  const { user, logoutMutation, isLoading } = useAuth();

  interface Package {
    id: string;
    name: string;
    duration: string;
    price?: number;
    rating?: number;
  }
  
  interface Tour {
    id: string;
    name: string;
    duration: string;
    price?: number;
    rating?: number;
  }

  const [domFixed, setDomFixed] = useState(false);

  console.log('🔶🔶🔶 AgentDashboard - COMPONENT RENDERING', new Date().toISOString());
  console.log('🔶🔶🔶 AgentDashboard - User:', user);
  console.log('🔶🔶🔶 AgentDashboard - Auth loading:', isLoading);
  console.log('🔶🔶🔶 AgentDashboard - Role ID:', user?.roleId);

  useEffect(() => {
    console.log('🔶🔶🔶 AgentDashboard - useEffect RUNNING', new Date().toISOString());
    document.title = 'Travel Agent Dashboard | TravelNexus';
    
    if (!domFixed) {
      console.log('🔶🔶🔶 AgentDashboard - APPLYING EMERGENCY DOM FIX');
      
      const emergencyContainer = document.createElement('div');
      emergencyContainer.id = 'emergency-agent-dashboard';
      emergencyContainer.style.position = 'fixed';
      emergencyContainer.style.top = '0';
      emergencyContainer.style.left = '0';
      emergencyContainer.style.width = '100%';
      emergencyContainer.style.height = '100%';
      emergencyContainer.style.backgroundColor = '#ffffff';
      emergencyContainer.style.zIndex = '9999';
      emergencyContainer.style.padding = '20px';
      emergencyContainer.style.boxSizing = 'border-box';
      emergencyContainer.style.overflow = 'auto';
      
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '20px';
      header.style.padding = '10px';
      header.style.borderBottom = '1px solid #e2e8f0';
      
      const title = document.createElement('h1');
      title.textContent = 'Travel Agent Dashboard';
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.color = '#1e293b';
      
      const username = document.createElement('div');
      username.textContent = `Welcome, ${user?.fullName || user?.username || 'Agent'}`;
      username.style.fontSize = '16px';
      username.style.color = '#64748b';
      
      const logoutBtn = document.createElement('button');
      logoutBtn.textContent = 'Logout';
      logoutBtn.style.padding = '8px 16px';
      logoutBtn.style.backgroundColor = '#e2e8f0';
      logoutBtn.style.color = '#1e293b';
      logoutBtn.style.border = 'none';
      logoutBtn.style.borderRadius = '4px';
      logoutBtn.style.cursor = 'pointer';
      logoutBtn.onclick = () => {
        console.log('🔶🔶🔶 AgentDashboard - Emergency logout clicked');
        logoutMutation.mutate();
      };
      
      const content = document.createElement('div');
      content.style.display = 'grid';
      content.style.gridTemplateColumns = 'repeat(2, 1fr)';
      content.style.gap = '20px';
      
      const createCard = (title: string, value: string, description: string) => {
        const card = document.createElement('div');
        card.style.padding = '20px';
        card.style.backgroundColor = '#f8fafc';
        card.style.borderRadius = '8px';
        card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        
        const cardTitle = document.createElement('h2');
        cardTitle.textContent = title;
        cardTitle.style.fontSize = '14px';
        cardTitle.style.fontWeight = 'medium';
        cardTitle.style.color = '#64748b';
        cardTitle.style.marginBottom = '8px';
        
        const cardValue = document.createElement('div');
        cardValue.textContent = value;
        cardValue.style.fontSize = '24px';
        cardValue.style.fontWeight = 'bold';
        cardValue.style.color = '#1e293b';
        cardValue.style.marginBottom = '4px';
        
        const cardDesc = document.createElement('p');
        cardDesc.textContent = description;
        cardDesc.style.fontSize = '12px';
        cardDesc.style.color = '#94a3b8';
        
        card.appendChild(cardTitle);
        card.appendChild(cardValue);
        card.appendChild(cardDesc);
        
        return card;
      };
      
      content.appendChild(createCard('Active Bookings', '54', '8 new this week'));
      content.appendChild(createCard('Total Earnings', '₱45,890', '+12% from last month'));
      content.appendChild(createCard('Available Tours', '26', '4 new destinations'));
      content.appendChild(createCard('Client Satisfaction', '4.8/5', 'Based on 120 reviews'));
      
      const titleWrapper = document.createElement('div');
      titleWrapper.appendChild(title);
      titleWrapper.appendChild(username);
      
      header.appendChild(titleWrapper);
      header.appendChild(logoutBtn);
      
      emergencyContainer.appendChild(header);
      emergencyContainer.appendChild(content);
      
      const notice = document.createElement('div');
      notice.style.marginTop = '30px';
      notice.style.padding = '12px';
      notice.style.backgroundColor = '#fef3c7';
      notice.style.borderRadius = '4px';
      notice.style.color = '#92400e';
      notice.textContent = 'Dashboard is running in emergency display mode. Please contact support if you continue to experience issues.';
      
      emergencyContainer.appendChild(notice);
      
      document.body.appendChild(emergencyContainer);
      
      setDomFixed(true);
      
      return () => {
        console.log('🔶🔶🔶 AgentDashboard - REMOVING EMERGENCY DOM FIX');
        const element = document.getElementById('emergency-agent-dashboard');
        if (element && element.parentNode === document.body) {
          document.body.removeChild(element);
        }
      };
    }
  }, [user, logoutMutation, domFixed]);

  const { data: bookings = [] } = useQuery<any[]>({
    queryKey: ['/api/bookings'],
  });

  const { data: tours = [] } = useQuery<any[]>({
    queryKey: ['/api/tours'],
  });
  
  const { data: packages = [] } = useQuery<any[]>({
    queryKey: ['/api/packages'],
  });

  const handleLogout = () => {
    console.log('🔶🔶🔶 AgentDashboard - Regular logout called');
    logoutMutation.mutate();
  };

  const recentBookings = [
    {
      id: 1,
      customerName: "Maria Santos",
      email: "maria@email.com",
      phone: "+63 912 345 6789",
      package: "White Beach Paradise",
      status: "pending",
      amount: 15000,
      date: "2024-06-15",
      guests: 2
    },
    {
      id: 2,
      customerName: "John dela Cruz",
      email: "john@email.com", 
      phone: "+63 998 765 4321",
      package: "Puerto Galera Adventure",
      status: "confirmed",
      amount: 22000,
      date: "2024-06-18",
      guests: 4
    },
    {
      id: 3,
      customerName: "Anna Reyes",
      email: "anna@email.com",
      phone: "+63 977 123 4567",
      package: "Romantic Beach Getaway",
      status: "processing",
      amount: 18500,
      date: "2024-06-20",
      guests: 2
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'processing': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 lg:px-8" style={{ display: 'block', minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative', zIndex: 10 }}>
      <Helmet>
        <title>Agent Dashboard | {SITE_NAME}</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Travel Agent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.username}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <CardDescription>Current reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentBookings.length}</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <CardDescription>Commission earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱28,500</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <CardDescription>Average rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">Based on 24 reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CardDescription>Requires attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 confirmations, 1 follow-up</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
          <TabsTrigger value="packages">Available Packages</TabsTrigger>
          <TabsTrigger value="customers">Customer Relations</TabsTrigger>
          <TabsTrigger value="reports">Sales Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>
          
          <div className="grid gap-4">
            {recentBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{booking.customerName}</h3>
                      <p className="text-gray-600">{booking.package}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant={getStatusColor(booking.status)} className="flex items-center gap-1">
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500">₱{booking.amount.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{booking.guests} guests</span>
                        <span className="text-sm text-gray-500">{booking.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Email:</span> {booking.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {booking.phone}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm">Confirm Booking</Button>
                          <Button variant="outline" size="sm">Request Details</Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button variant="outline" size="sm">Send Itinerary</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Packages & Tours</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Travel Packages</h3>
              <div className="space-y-4">
                {packages?.slice(0, 3).map((pkg: any) => (
                  <Card key={pkg.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{pkg.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{pkg.duration}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary">₱{pkg.price?.toLocaleString()}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{pkg.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Day Tours</h3>
              <div className="space-y-4">
                {tours?.slice(0, 3).map((tour: any) => (
                  <Card key={tour.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{tour.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{tour.duration}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary">₱{tour.price?.toLocaleString()}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{tour.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Customer Relations</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Tasks</CardTitle>
                <CardDescription>Customers requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Maria Santos</span>
                    <Badge variant="outline">Follow-up</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Payment confirmation needed for White Beach Paradise package</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">John dela Cruz</span>
                    <Badge variant="outline">Check-in</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Scheduled to arrive today - ensure hotel is prepared</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call Hotel
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Update Customer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback</CardTitle>
                <CardDescription>Recent reviews and ratings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Anna Reyes</span>
                    <div className="flex items-center">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Amazing service from start to finish! The agent was very helpful and responsive."
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Mike Chen</span>
                    <div className="flex items-center">
                      {[1,2,3,4].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Good package overall. Would appreciate faster response times for inquiries."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Sales Reports & Analytics</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
                <CardDescription>June 2024 Performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Bookings:</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-semibold">₱185,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission:</span>
                  <span className="font-semibold">₱28,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Rating:</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Packages</CardTitle>
                <CardDescription>Most booked this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>White Beach Paradise</span>
                  <Badge>5 bookings</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Puerto Galera Adventure</span>
                  <Badge>4 bookings</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Romantic Getaway</span>
                  <Badge>3 bookings</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goals & Targets</CardTitle>
                <CardDescription>Monthly objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Bookings Target:</span>
                    <span>12/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Revenue Target:</span>
                    <span>₱185K/₱200K</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}