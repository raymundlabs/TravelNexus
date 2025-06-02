import React, { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, Hotel, Briefcase, Settings } from "lucide-react";
import { Helmet } from "react-helmet";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    console.log('🔍 AdminDashboard - Component mounted');
    console.log('🔍 AdminDashboard - User:', user);
    console.log('🔍 AdminDashboard - isAuthenticated:', isAuthenticated);
    console.log('🔍 AdminDashboard - isLoading:', isLoading);
  }, [user, isAuthenticated, isLoading]);

  if (isLoading) {
    console.log('⏳ AdminDashboard - Loading auth state...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 AdminDashboard - Not authenticated, redirecting...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Not authenticated. Redirecting to login...</div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ AdminDashboard - No user data');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>No user data available</div>
      </div>
    );
  }

  console.log('✅ AdminDashboard - Rendering with user role:', user.roleId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto py-8 px-4 lg:px-8" style={{ display: 'block', minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative', zIndex: 10 }}>
          <Helmet>
            <title>My Dashboard | {SITE_NAME}</title>
          </Helmet>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dashboard Cards */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hotels</CardTitle>
                <Hotel className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <span className="text-muted-foreground">$</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">5 minutes ago</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">View</span>
                  </div>
                  {/* Add more activity items as needed */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}