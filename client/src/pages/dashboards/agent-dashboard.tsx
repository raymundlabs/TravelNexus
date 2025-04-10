import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BadgeDollarSign, 
  BarChart4, 
  Calendar,
  ClipboardList, 
  CompassIcon, 
  CreditCard,
  FileText,
  Globe,
  ListFilter,
  MessageSquare,
  Package, 
  PackageCheck,
  Percent,
  PlusCircle,
  Sailboat,
  Search,
  Ship,
  StickyNote,
  Tag,
  Ticket,
  Users
} from "lucide-react";

export default function AgentDashboard() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Travel Agent Dashboard | {SITE_NAME}</title>
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
            <CardTitle className="text-sm font-medium">Active Tours</CardTitle>
            <CardDescription>Tours & Packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total active listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="tours">Tours & Packages</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest tour and package bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-4 border rounded-lg">
                    <Sailboat className="h-9 w-9 text-primary mr-4" />
                    <div className="flex-1">
                      <h3 className="font-medium">Island Hopping Adventure</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">May 20, 2025 • 4 People</p>
                        <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 font-medium">Pending</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg">
                    <Package className="h-9 w-9 text-primary mr-4" />
                    <div className="flex-1">
                      <h3 className="font-medium">White Beach 3-Day Package</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">June 5, 2025 • 2 People</p>
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
                <CardTitle>Popular Tours</CardTitle>
                <CardDescription>Your most booked tours this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <CompassIcon className="h-9 w-9 text-primary" />
                      <div>
                        <h3 className="font-medium">Island Hopping Adventure</h3>
                        <p className="text-sm text-muted-foreground">Puerto Galera Islands</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto">42 bookings</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Ship className="h-9 w-9 text-primary" />
                      <div>
                        <h3 className="font-medium">Snorkeling Tour</h3>
                        <p className="text-sm text-muted-foreground">Coral Reefs</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto">28 bookings</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">Manage Tours</Button>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
              <PlusCircle className="h-8 w-8" />
              <span>Add Tour</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
              <Package className="h-8 w-8" />
              <span>Add Package</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
              <Calendar className="h-8 w-8" />
              <span>Schedule Tour</span>
            </Button>
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
              <Percent className="h-8 w-8" />
              <span>Create Promotion</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Booking Management</CardTitle>
                  <CardDescription>Manage all your tour and package bookings</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ListFilter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <PackageCheck className="h-4 w-4 mr-2" />
                    New Booking
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 p-4 font-medium border-b">
                  <div>Booking ID</div>
                  <div>Customer</div>
                  <div>Tour/Package</div>
                  <div>Date</div>
                  <div>Guests</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="grid grid-cols-7 p-4 border-b items-center">
                  <div className="text-sm font-medium">#TB-2025001</div>
                  <div className="text-sm">Maria Santos</div>
                  <div className="text-sm">Island Hopping</div>
                  <div className="text-sm">May 20, 2025</div>
                  <div className="text-sm">4 adults</div>
                  <div className="text-sm font-medium">₱6,800</div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 font-medium">Pending</span>
                  </div>
                </div>
                <div className="grid grid-cols-7 p-4 border-b items-center">
                  <div className="text-sm font-medium">#TB-2025002</div>
                  <div className="text-sm">James Cruz</div>
                  <div className="text-sm">White Beach Package</div>
                  <div className="text-sm">June 5, 2025</div>
                  <div className="text-sm">2 adults</div>
                  <div className="text-sm font-medium">₱12,500</div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Confirmed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tours">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tour & Package Management</CardTitle>
                  <CardDescription>Manage your tours, packages, and special offers</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tours" className="w-full">
                <TabsList className="mb-4 w-full grid grid-cols-3">
                  <TabsTrigger value="tours">Tours</TabsTrigger>
                  <TabsTrigger value="packages">Packages</TabsTrigger>
                  <TabsTrigger value="offers">Special Offers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tours">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 p-4 font-medium border-b">
                      <div>Tour Name</div>
                      <div>Location</div>
                      <div>Duration</div>
                      <div>Price</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    <div className="grid grid-cols-6 p-4 border-b items-center">
                      <div className="text-sm font-medium">Island Hopping Adventure</div>
                      <div className="text-sm">Puerto Galera Islands</div>
                      <div className="text-sm">6 hours</div>
                      <div className="text-sm">₱1,700/person</div>
                      <div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Active</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 p-4 border-b items-center">
                      <div className="text-sm font-medium">Snorkeling Tour</div>
                      <div className="text-sm">Coral Reefs</div>
                      <div className="text-sm">4 hours</div>
                      <div className="text-sm">₱1,200/person</div>
                      <div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Active</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="packages" className="space-y-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 p-4 font-medium border-b">
                      <div>Package Name</div>
                      <div>Includes</div>
                      <div>Duration</div>
                      <div>Price</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    <div className="grid grid-cols-6 p-4 border-b items-center">
                      <div className="text-sm font-medium">White Beach Weekend</div>
                      <div className="text-sm">Hotel, 2 tours, transfers</div>
                      <div className="text-sm">3 days</div>
                      <div className="text-sm">₱6,250/person</div>
                      <div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Active</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="offers" className="space-y-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium border-b">
                      <div>Offer Name</div>
                      <div>Discount</div>
                      <div>Valid Until</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    <div className="grid grid-cols-5 p-4 border-b items-center">
                      <div className="text-sm font-medium">Summer Special</div>
                      <div className="text-sm">15% off all tours</div>
                      <div className="text-sm">June 30, 2025</div>
                      <div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Active</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <StickyNote className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>Manage your clients and customer relationships</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search Clients
                  </Button>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 font-medium border-b">
                  <div>Client Name</div>
                  <div>Email</div>
                  <div>Phone</div>
                  <div>Bookings</div>
                  <div>Total Spent</div>
                  <div>Actions</div>
                </div>
                <div className="grid grid-cols-6 p-4 border-b items-center">
                  <div className="text-sm font-medium">Maria Santos</div>
                  <div className="text-sm">maria@example.com</div>
                  <div className="text-sm">+63 912 345 6789</div>
                  <div className="text-sm">3 tours</div>
                  <div className="text-sm font-medium">₱18,450</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 p-4 border-b items-center">
                  <div className="text-sm font-medium">James Cruz</div>
                  <div className="text-sm">james@example.com</div>
                  <div className="text-sm">+63 923 456 7890</div>
                  <div className="text-sm">1 package</div>
                  <div className="text-sm font-medium">₱12,500</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Track revenue, payments, and financial reports</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="mb-4 w-full grid grid-cols-3">
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="bookings">Booking Summary</TabsTrigger>
                  <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="revenue">
                  <div className="rounded-md border p-6">
                    <h3 className="text-lg font-medium mb-4">Monthly Revenue (2025)</h3>
                    <div className="flex justify-between gap-4 mb-6">
                      <Card className="w-1/3">
                        <CardHeader className="py-2">
                          <CardDescription>Current Month</CardDescription>
                          <CardTitle className="text-2xl">₱32,450</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="w-1/3">
                        <CardHeader className="py-2">
                          <CardDescription>Previous Month</CardDescription>
                          <CardTitle className="text-2xl">₱28,750</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="w-1/3">
                        <CardHeader className="py-2">
                          <CardDescription>Year to Date</CardDescription>
                          <CardTitle className="text-2xl">₱156,300</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                    <div className="h-48 bg-muted/20 rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="bookings">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 p-4 font-medium border-b">
                      <div>Product Type</div>
                      <div>Number of Bookings</div>
                      <div>Total Revenue</div>
                      <div>Avg. Booking Value</div>
                    </div>
                    <div className="grid grid-cols-4 p-4 border-b items-center">
                      <div className="text-sm font-medium">Day Tours</div>
                      <div className="text-sm">48</div>
                      <div className="text-sm">₱86,400</div>
                      <div className="text-sm">₱1,800</div>
                    </div>
                    <div className="grid grid-cols-4 p-4 border-b items-center">
                      <div className="text-sm font-medium">Multi-day Packages</div>
                      <div className="text-sm">12</div>
                      <div className="text-sm">₱69,900</div>
                      <div className="text-sm">₱5,825</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="payments">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 p-4 font-medium border-b">
                      <div>Date</div>
                      <div>Booking ID</div>
                      <div>Payment Method</div>
                      <div>Amount</div>
                      <div>Status</div>
                    </div>
                    <div className="grid grid-cols-5 p-4 border-b items-center">
                      <div className="text-sm">May 10, 2025</div>
                      <div className="text-sm font-medium">#TB-2025001</div>
                      <div className="text-sm">Credit Card</div>
                      <div className="text-sm">₱6,800</div>
                      <div>
                        <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 font-medium">Pending</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 p-4 border-b items-center">
                      <div className="text-sm">May 8, 2025</div>
                      <div className="text-sm font-medium">#TB-2025002</div>
                      <div className="text-sm">Bank Transfer</div>
                      <div className="text-sm">₱12,500</div>
                      <div>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Completed</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}