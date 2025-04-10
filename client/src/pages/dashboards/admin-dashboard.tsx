import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";
import { 
  BarChart4, 
  Building2, 
  Users, 
  Package, 
  Settings, 
  ShieldCheck,
  UserPlus,
  Sailboat
} from "lucide-react";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Admin Dashboard | {SITE_NAME}</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Administrator</h1>
          <p className="text-muted-foreground">Welcome back, {user?.fullName || user?.username}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <CardDescription>Active accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CardDescription>Services online</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">All systems operational</div>
            <p className="text-xs text-muted-foreground">Last checked: now</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all system users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <Users className="h-9 w-9 text-primary mr-4" />
                <div>
                  <h3 className="font-medium">Manage Users</h3>
                  <p className="text-sm text-muted-foreground">Create, edit, and manage user accounts</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">User Management</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage all site content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <Package className="h-9 w-9 text-primary mr-4" />
                <div>
                  <h3 className="font-medium">Manage Content</h3>
                  <p className="text-sm text-muted-foreground">Edit destinations, hotels, tours and packages</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">Content Management</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Manage system configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <Settings className="h-9 w-9 text-primary mr-4" />
                <div>
                  <h3 className="font-medium">System Configuration</h3>
                  <p className="text-sm text-muted-foreground">Payment gateways, email settings, and more</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">System Settings</Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
          <UserPlus className="h-8 w-8" />
          <span>Add User</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
          <Building2 className="h-8 w-8" />
          <span>Manage Hotels</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
          <Sailboat className="h-8 w-8" />
          <span>Manage Tours</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 gap-2">
          <ShieldCheck className="h-8 w-8" />
          <span>Security Logs</span>
        </Button>
      </div>
    </div>
  );
}