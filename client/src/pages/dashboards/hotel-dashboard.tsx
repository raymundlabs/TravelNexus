import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
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
  const { user, logoutMutation } = useAuth();

  const { data: hotels } = useQuery({
    queryKey: ['/api/hotels'],
  });

  // Filter hotels for this hotel owner (in real app, filter by owner ID)
  const myHotels = hotels || [];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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
    <div className="container mx-auto py-8">
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
  );
}