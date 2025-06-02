import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE_NAME } from "@/lib/constants";
import { 
  Building2, 
  Bed, 
  Star, 
  Calendar, 
  DollarSign,
  Users,
  Settings,
  Plus,
  Edit,
  Wifi,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Coffee,
  Wind
} from "lucide-react";

export default function HotelDashboard() {
  const { user, logoutMutation, isLoading } = useAuth();

  // Create a reference to track if we've applied DOM changes
  const [domFixed, setDomFixed] = useState(false);

  // Enhanced debugging with visual markers
  console.log('🌊🌊🌊 HotelDashboard - COMPONENT RENDERING', new Date().toISOString());
  console.log('🌊🌊🌊 HotelDashboard - User:', user);
  console.log('🌊🌊🌊 HotelDashboard - Auth loading:', isLoading);
  console.log('🌊🌊🌊 HotelDashboard - Role ID:', user?.roleId);

  // DIRECT DOM MANIPULATION - emergency approach for blank screen
  useEffect(() => {
    console.log('🌊🌊🌊 HotelDashboard - useEffect RUNNING', new Date().toISOString());
    document.title = 'Hotel Dashboard | TravelNexus';

    // Emergency recovery - add a forced visible element to the document body
    if (!domFixed) {
      console.log('🌊🌊🌊 HotelDashboard - APPLYING EMERGENCY DOM FIX');

      // Create emergency container
      const emergencyContainer = document.createElement('div');
      emergencyContainer.id = 'emergency-hotel-dashboard';
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

      // Add header
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '20px';
      header.style.padding = '10px';
      header.style.borderBottom = '1px solid #e2e8f0';

      const title = document.createElement('h1');
      title.textContent = 'Hotel Owner Dashboard';
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.color = '#1e293b';

      const username = document.createElement('div');
      username.textContent = `Welcome, ${user?.fullName || user?.username || 'Hotel Owner'}`;
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
        console.log('🌊🌊🌊 HotelDashboard - Emergency logout clicked');
        logoutMutation.mutate();
      };

      // Add content
      const content = document.createElement('div');
      content.style.display = 'grid';
      content.style.gridTemplateColumns = 'repeat(2, 1fr)';
      content.style.gap = '20px';

      // Add cards
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

      content.appendChild(createCard('Active Listings', '12', '3 new this month'));
      content.appendChild(createCard('Total Bookings', '78', '+8% from last month'));
      content.appendChild(createCard('Revenue', '₱345,670', '+15% from last month'));
      content.appendChild(createCard('Average Rating', '4.7/5', 'Based on 156 reviews'));

      // Assemble the header
      const titleWrapper = document.createElement('div');
      titleWrapper.appendChild(title);
      titleWrapper.appendChild(username);

      header.appendChild(titleWrapper);
      header.appendChild(logoutBtn);

      // Assemble everything
      emergencyContainer.appendChild(header);
      emergencyContainer.appendChild(content);

      // Add a notice about emergency mode
      const notice = document.createElement('div');
      notice.style.marginTop = '30px';
      notice.style.padding = '12px';
      notice.style.backgroundColor = '#fef3c7';
      notice.style.borderRadius = '4px';
      notice.style.color = '#92400e';
      notice.textContent = 'Dashboard is running in emergency display mode. Please contact support if you continue to experience issues.';

      emergencyContainer.appendChild(notice);

      // Append to body
      document.body.appendChild(emergencyContainer);

      // Update state to avoid duplicate creation
      setDomFixed(true);

      // Cleanup function
      return () => {
        console.log('🌊🌊🌊 HotelDashboard - REMOVING EMERGENCY DOM FIX');
        const element = document.getElementById('emergency-hotel-dashboard');
        if (element && element.parentNode === document.body) {
          document.body.removeChild(element);
        }
      };
    }
  }, [user, logoutMutation, domFixed]);

  interface Hotel {
    id: string;
    name: string;
    address: string;
    price?: number;
    featured?: boolean;
    rating?: number;
    amenities?: string[];
  }

  const { data: hotels, isLoading: isHotelsLoading } = useQuery<Hotel[]>({
    queryKey: ['/api/hotels'],
  });

  // Filter hotels for this hotel owner (in real app, filter by owner ID)
  const myHotels = hotels || [];

  // Handle user logout
  const handleLogout = () => {
    console.log('🟢 HotelDashboard - Logging out user');
    logoutMutation.mutate();
  };
  
  // If still loading user data, show a temporary loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'block', 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        position: 'relative', 
        zIndex: 999,
        textAlign: 'center',
        paddingTop: '100px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Loading Hotel Dashboard...</h1>
        <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #3498db', borderRadius: '50%' }}></div>
      </div>
    );
  }

  // If no user data available, show an error state
  if (!user) {
    return (
      <div style={{ 
        display: 'block', 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        position: 'relative', 
        zIndex: 999,
        textAlign: 'center',
        paddingTop: '100px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#e74c3c' }}>Authentication Error</h1>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>Unable to load user data. Please try logging in again.</p>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Return to Login
        </button>
      </div>
    );
  }

  const amenityIcons = {
    'Free WiFi': <Wifi className="h-4 w-4" />,
    'Parking': <Car className="h-4 w-4" />,
    'Restaurant': <Utensils className="h-4 w-4" />,
    'Pool': <Waves className="h-4 w-4" />,
    'Gym': <Dumbbell className="h-4 w-4" />,
    'Breakfast': <Coffee className="h-4 w-4" />,
    'Air Conditioning': <Wind className="h-4 w-4" />
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto py-8 px-4 lg:px-8" style={{ display: 'block', minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative', zIndex: 10 }}>
          <Helmet>
            <title>Hotel Dashboard | {SITE_NAME}</title>
          </Helmet>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Hotel Management</h1>
              <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.username}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">My Hotels</CardTitle>
                <CardDescription>Properties managed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myHotels.length}</div>
                <p className="text-xs text-muted-foreground">Active properties</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <CardDescription>Guest reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.5</div>
                <p className="text-xs text-muted-foreground">Based on 127 reviews</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bookings This Month</CardTitle>
                <CardDescription>New reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₱186,500</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="properties" className="space-y-4">
            <TabsList>
              <TabsTrigger value="properties">My Properties</TabsTrigger>
              <TabsTrigger value="amenities">Amenities Management</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Hotel Properties</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Hotel
                </Button>
              </div>
              
              <div className="grid gap-6">
                {myHotels.map((hotel: any) => (
                  <Card key={hotel.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold">{hotel.name}</h3>
                          <p className="text-gray-600 mt-1">{hotel.address}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <Badge variant="secondary">₱{hotel.price?.toLocaleString()}/night</Badge>
                            <Badge variant={hotel.featured ? "default" : "outline"}>
                              {hotel.featured ? "Featured" : "Standard"}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{hotel.rating}/5</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {(hotel.amenities || []).map((amenity: string, index: number) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {amenityIcons[amenity as keyof typeof amenityIcons] || <Star className="h-3 w-3" />}
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Amenities Management</h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Available Amenities</CardTitle>
                  <CardDescription>Manage the amenities offered by your hotels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(amenityIcons).map(([amenity, icon]) => (
                      <div key={amenity} className="flex items-center space-x-2 p-3 border rounded-lg">
                        {icon}
                        <span className="font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Add Custom Amenity</h4>
                    <div className="flex gap-2">
                      <Input placeholder="Enter amenity name" className="flex-1" />
                      <Button>Add Amenity</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Pricing & Availability</h2>
              </div>
              
              <div className="grid gap-6">
                {myHotels.map((hotel: any) => (
                  <Card key={hotel.id}>
                    <CardHeader>
                      <CardTitle>{hotel.name}</CardTitle>
                      <CardDescription>Update pricing and availability settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="base-price">Base Price (per night)</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">₱</span>
                            <Input 
                              id="base-price" 
                              defaultValue={hotel.price} 
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weekend-price">Weekend Price (per night)</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">₱</span>
                            <Input 
                              id="weekend-price" 
                              defaultValue={Math.round(hotel.price * 1.2)} 
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="special-offers">Special Offers / Discounts</Label>
                        <Textarea 
                          id="special-offers" 
                          placeholder="Enter any special offers or discounts for this property"
                          className="min-h-[80px]"
                        />
                      </div>
                      
                      <Button className="w-full">Update Pricing</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Guest Reviews</CardTitle>
                  <CardDescription>Monitor and respond to guest feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="font-medium">Sarah Johnson</span>
                        </div>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Amazing beachfront location with excellent service. The staff was incredibly helpful and the rooms were spotless. Highly recommend!"
                      </p>
                      <Button variant="outline" size="sm">Respond</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1,2,3,4].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <span className="font-medium">Mike Chen</span>
                        </div>
                        <span className="text-sm text-gray-500">1 week ago</span>
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Great location and facilities. The pool area was fantastic. Only minor issue was the WiFi connection in some areas."
                      </p>
                      <Button variant="outline" size="sm">Respond</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}