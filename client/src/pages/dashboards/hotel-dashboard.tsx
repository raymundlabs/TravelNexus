import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";
import { 
  BadgeDollarSign, 
  BarChart4, 
  Building2, 
  Calendar, 
  Edit, 
  Hotel,
  ImagePlus,
  ListFilter,
  MessageSquare,
  PlusCircle,
  Settings,
  Star,
  TicketCheck,
  Users
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function HotelDashboard() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Hotel Manager Dashboard | {SITE_NAME}</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hotel Manager Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.username}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <CardDescription>Rooms & Packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total active listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="rooms">Room Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest hotel reservation requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-4 border rounded-lg">
                    <Calendar className="h-9 w-9 text-primary mr-4" />
                    <div className="flex-1">
                      <h3 className="font-medium">White Beach Weekend Package</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">May 15-17, 2025 • 2 Adults</p>
                        <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 font-medium">Pending</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg">
                    <Calendar className="h-9 w-9 text-primary mr-4" />
                    <div className="flex-1">
                      <h3 className="font-medium">Deluxe Ocean View Room</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">June 1-3, 2025 • 2 Adults</p>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Confirmed</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">View All Bookings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hotel Performance</CardTitle>
                <CardDescription>Current metrics and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Rating</span>
                      <span className="text-sm font-medium flex items-center"><Star className="h-3 w-3 fill-current text-amber-500 mr-1" /> 4.8/5.0</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Occupancy Rate</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Reviews</span>
                      <span className="text-sm font-medium">28 recent</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="flex items-center"><Star className="h-3 w-3 fill-current text-amber-500 mr-1" />5</span>
                      <Progress value={78} className="h-2 w-32" />
                      <span>78%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="flex items-center"><Star className="h-3 w-3 fill-current text-amber-500 mr-1" />4</span>
                      <Progress value={18} className="h-2 w-32" />
                      <span>18%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="flex items-center"><Star className="h-3 w-3 fill-current text-amber-500 mr-1" />3</span>
                      <Progress value={4} className="h-2 w-32" />
                      <span>4%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
              <PlusCircle className="h-8 w-8" />
              <span>Add Room</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
              <BadgeDollarSign className="h-8 w-8" />
              <span>Update Pricing</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
              <ImagePlus className="h-8 w-8" />
              <span>Upload Photos</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
              <MessageSquare className="h-8 w-8" />
              <span>Customer Messages</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Reservations</CardTitle>
                  <CardDescription>Manage all your hotel bookings</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ListFilter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <TicketCheck className="h-4 w-4 mr-2" />
                    New Booking
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 font-medium border-b">
                  <div>Booking ID</div>
                  <div>Guest</div>
                  <div>Check-in/out</div>
                  <div>Room</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="grid grid-cols-6 p-4 border-b items-center">
                  <div className="text-sm font-medium">#BK-2025001</div>
                  <div className="text-sm">John Santos</div>
                  <div className="text-sm">May 15-17, 2025</div>
                  <div className="text-sm">Deluxe Suite</div>
                  <div className="text-sm font-medium">₱8,500</div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 font-medium">Pending</span>
                  </div>
                </div>
                <div className="grid grid-cols-6 p-4 border-b items-center">
                  <div className="text-sm font-medium">#BK-2025002</div>
                  <div className="text-sm">Maria Garcia</div>
                  <div className="text-sm">June 1-3, 2025</div>
                  <div className="text-sm">Ocean View</div>
                  <div className="text-sm font-medium">₱9,200</div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Confirmed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Room Inventory</CardTitle>
                  <CardDescription>Manage rooms, availability, and pricing</CardDescription>
                </div>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Room
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 font-medium border-b">
                  <div>Room Type</div>
                  <div>Capacity</div>
                  <div>Price</div>
                  <div>Available</div>
                  <div>Features</div>
                  <div>Actions</div>
                </div>
                <div className="grid grid-cols-6 p-4 border-b items-center">
                  <div className="text-sm font-medium">Deluxe Suite</div>
                  <div className="text-sm">2 Adults, 1 Child</div>
                  <div className="text-sm">₱4,250/night</div>
                  <div className="text-sm">3 rooms</div>
                  <div className="text-sm">Ocean view, Mini bar</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ImagePlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 p-4 border-b items-center">
                  <div className="text-sm font-medium">Family Room</div>
                  <div className="text-sm">4 Adults</div>
                  <div className="text-sm">₱5,800/night</div>
                  <div className="text-sm">2 rooms</div>
                  <div className="text-sm">Balcony, Kitchen</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ImagePlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Settings</CardTitle>
              <CardDescription>Manage your hotel profile and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border p-4 rounded-lg space-y-2">
                  <h3 className="font-medium flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-primary" />
                    Property Information
                  </h3>
                  <p className="text-sm text-muted-foreground">Update your hotel's basic information, contact details, and location.</p>
                  <Button variant="outline" size="sm">Edit Property Details</Button>
                </div>
                
                <div className="border p-4 rounded-lg space-y-2">
                  <h3 className="font-medium flex items-center">
                    <BadgeDollarSign className="h-5 w-5 mr-2 text-primary" />
                    Payment Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">Configure your payment methods, taxes, and cancellation policies.</p>
                  <Button variant="outline" size="sm">Manage Payment Settings</Button>
                </div>
                
                <div className="border p-4 rounded-lg space-y-2">
                  <h3 className="font-medium flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-primary" />
                    Account Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">Update your account information, password, and notification preferences.</p>
                  <Button variant="outline" size="sm">Manage Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}