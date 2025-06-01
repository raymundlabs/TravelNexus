import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE_NAME } from "@/lib/constants";
import { 
  Calendar,
  MapPin,
  Star,
  Users,
  Clock,
  Phone,
  Mail,
  Edit,
  Heart,
  Share,
  Download,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Package
} from "lucide-react";

export default function UserDashboard() {
  const { user, logoutMutation } = useAuth();

  const { data: packages } = useQuery({
    queryKey: ['/api/packages'],
  });

  const { data: hotels } = useQuery({
    queryKey: ['/api/hotels'],
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Mock user booking data
  const userBookings = [
    {
      id: 1,
      packageName: "White Beach Paradise",
      destination: "Puerto Galera, Mindoro",
      bookingDate: "2024-06-15",
      checkIn: "2024-07-15",
      checkOut: "2024-07-18",
      guests: 2,
      status: "confirmed",
      amount: 15000,
      bookingReference: "WB001234",
      hotel: "White Beach Resort",
      inclusions: ["Airport Transfer", "3 Meals Daily", "Island Hopping"]
    },
    {
      id: 2,
      packageName: "Puerto Galera Adventure",
      destination: "Puerto Galera, Mindoro",
      bookingDate: "2024-05-20",
      checkIn: "2024-06-20",
      checkOut: "2024-06-23",
      guests: 4,
      status: "completed",
      amount: 22000,
      bookingReference: "WB001235",
      hotel: "Beach Front Resort",
      inclusions: ["Scuba Diving", "Snorkeling", "Beach Activities"]
    }
  ];

  const favoritePackages = packages?.filter((pkg: any) => pkg.featured).slice(0, 3) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>My Dashboard | {SITE_NAME}</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="text-muted-foreground">Hi {user?.fullName || user?.username}, plan your next adventure</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBookings.length}</div>
            <p className="text-xs text-muted-foreground">+1 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
            <CardDescription>Confirmed bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userBookings.filter(b => b.status === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">Next trip in 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CardDescription>All bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{userBookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across {userBookings.length} trips</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <CardDescription>Reward points earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">₱250 off next booking</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Points</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Bookings</h2>
            <Button>
              <Package className="h-4 w-4 mr-2" />
              Book New Trip
            </Button>
          </div>
          
          <div className="grid gap-6">
            {userBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{booking.packageName}</h3>
                      <p className="text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {booking.destination}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant={getStatusColor(booking.status)} className="flex items-center gap-1">
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500">₱{booking.amount.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{booking.guests} guests</span>
                        <span className="text-sm text-gray-500">Ref: {booking.bookingReference}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Check-in</p>
                        <p className="text-sm">{new Date(booking.checkIn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Check-out</p>
                        <p className="text-sm">{new Date(booking.checkOut).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Hotel</p>
                        <p className="text-sm">{booking.hotel}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Inclusions</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.inclusions.map((inclusion, index) => (
                          <Badge key={index} variant="outline">{inclusion}</Badge>
                        ))}
                      </div>
                    </div>

                    {booking.status === 'confirmed' && (
                      <div className="flex gap-2 mt-4">
                        <Button size="sm">View Itinerary</Button>
                        <Button variant="outline" size="sm">Contact Agent</Button>
                        <Button variant="outline" size="sm">Modify Booking</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Saved Favorites</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePackages.map((pkg: any) => (
              <Card key={pkg.id}>
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={pkg.imageUrl} 
                      alt={pkg.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{pkg.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{pkg.duration}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">₱{pkg.price?.toLocaleString()}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{pkg.rating}</span>
                        </div>
                      </div>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Profile Settings</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={user?.fullName?.split(' ')[0] || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={user?.fullName?.split(' ').slice(1).join(' ') || ''} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={user?.phone || ''} />
                </div>
                <Button className="w-full">Update Profile</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Travel Preferences</CardTitle>
                <CardDescription>Customize your travel experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination-preference">Preferred Destinations</Label>
                  <Input id="destination-preference" placeholder="Beach, Mountains, City, etc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget-range">Budget Range</Label>
                  <Input id="budget-range" placeholder="₱10,000 - ₱50,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travel-style">Travel Style</Label>
                  <Input id="travel-style" placeholder="Adventure, Relaxation, Family, etc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-size">Typical Group Size</Label>
                  <Input id="group-size" placeholder="2-4 people" />
                </div>
                <Button className="w-full">Save Preferences</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Rewards & Loyalty Points</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Points</CardTitle>
                <CardDescription>Available for redemption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">1,250</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Points expire in 6 months
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Points Value</CardTitle>
                <CardDescription>Equivalent cash value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₱250</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Use on your next booking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership Level</CardTitle>
                <CardDescription>Current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">Silver</div>
                <p className="text-sm text-muted-foreground mt-2">
                  750 points to Gold level
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available Rewards</CardTitle>
              <CardDescription>Redeem your points for these rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">₱500 Booking Discount</h4>
                  <p className="text-sm text-gray-600 mb-3">2,500 points required</p>
                  <Button variant="outline" size="sm" disabled>Not enough points</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Free Airport Transfer</h4>
                  <p className="text-sm text-gray-600 mb-3">800 points required</p>
                  <Button size="sm">Redeem Now</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">₱200 Booking Discount</h4>
                  <p className="text-sm text-gray-600 mb-3">1,000 points required</p>
                  <Button size="sm">Redeem Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}