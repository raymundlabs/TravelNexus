import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";
import { 
  User, 
  CalendarDays, 
  Package, 
  CreditCard, 
  Hotel,
  Sailboat,
  Map
} from "lucide-react";

export default function UserDashboard() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>User Dashboard | {SITE_NAME}</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.username}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
            <CardDescription>Active bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">January 1, 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
            <CardDescription>Available to redeem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Earn more with bookings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>View and manage your current bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <CalendarDays className="h-9 w-9 text-primary mr-4" />
                <div>
                  <h3 className="font-medium">No Active Bookings</h3>
                  <p className="text-sm text-muted-foreground">You don't have any active bookings</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">View All Bookings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View and update your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <User className="h-9 w-9 text-primary mr-4" />
                <div>
                  <h3 className="font-medium">{user?.fullName || user?.username}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">Edit Profile</Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
          <Hotel className="h-8 w-8" />
          <span>Browse Hotels</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
          <Sailboat className="h-8 w-8" />
          <span>Find Tours</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
          <Package className="h-8 w-8" />
          <span>Vacation Packages</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
          <Map className="h-8 w-8" />
          <span>Explore Destinations</span>
        </Button>
      </div>
    </div>
  );
}