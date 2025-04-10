import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";
import { 
  BadgeDollarSign, 
  BarChart4, 
  ClipboardList, 
  CompassIcon, 
  Package, 
  PlusCircle,
  Sailboat,
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

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest tour and package bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <ClipboardList className="h-9 w-9 text-primary mr-4" />
                <div>
                  <h3 className="font-medium">No Recent Bookings</h3>
                  <p className="text-sm text-muted-foreground">You don't have any recent bookings</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">View All Bookings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tour Management</CardTitle>
            <CardDescription>Manage your tours and packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <CompassIcon className="h-9 w-9 text-primary mr-4" />
                <div>
                  <h3 className="font-medium">Manage Your Tours</h3>
                  <p className="text-sm text-muted-foreground">Update tour details, availability and pricing</p>
                </div>
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
          <BadgeDollarSign className="h-8 w-8" />
          <span>Update Pricing</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
          <BarChart4 className="h-8 w-8" />
          <span>View Reports</span>
        </Button>
      </div>
    </div>
  );
}