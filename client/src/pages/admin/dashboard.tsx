import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest, getQueryFn } from '@/lib/queryClient';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart3,
  Users,
  Hotel,
  Palmtree,
  Package,
  Calendar,
  CreditCard,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!authLoading && (!user || (user.roleId !== 4 && user.roleId !== 5))) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: getQueryFn(),
    // Mock data for now until backend endpoint is fully implemented
    placeholderData: {
      totalUsers: 145,
      totalHotels: 12,
      totalTours: 24,
      totalPackages: 8,
      totalBookings: 328,
      totalRevenue: 1245000,
      recentBookings: [
        { id: 1, customerName: 'John Doe', type: 'Hotel', status: 'Confirmed', total: 12500 },
        { id: 2, customerName: 'Jane Smith', type: 'Tour', status: 'Pending', total: 4500 },
        { id: 3, customerName: 'James Wilson', type: 'Package', status: 'Confirmed', total: 25000 },
        { id: 4, customerName: 'Maria Garcia', type: 'Hotel', status: 'Completed', total: 8750 },
        { id: 5, customerName: 'Robert Johnson', type: 'Tour', status: 'Cancelled', total: 3200 },
      ],
      monthlyRevenue: [
        { month: 'Jan', amount: 120000 },
        { month: 'Feb', amount: 145000 },
        { month: 'Mar', amount: 165000 },
        { month: 'Apr', amount: 190000 },
        { month: 'May', amount: 210000 },
        { month: 'Jun', amount: 250000 },
        { month: 'Jul', amount: 165000 },
      ],
      popularHotels: [
        { name: 'White Beach Resort & Spa', bookings: 42 },
        { name: 'Sunset Bay Hotel', bookings: 28 },
        { name: 'Palm Grove Beach Resort', bookings: 23 },
      ],
      popularTours: [
        { name: 'Island Hopping Adventure', bookings: 56 },
        { name: 'Scuba Diving Tour', bookings: 38 },
        { name: 'Waterfall Trekking Tour', bookings: 27 },
      ]
    }
  });
  
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user || (user.roleId !== 4 && user.roleId !== 5)) {
    return null; // Will redirect in useEffect
  }

  const DashboardCard = ({ title, value, icon, description = "", className = "" }) => (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, <span className="font-medium">{user.username}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Properties"
          value={`${stats?.totalHotels || 0} Hotels / ${stats?.totalTours || 0} Tours`}
          icon={<Hotel className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue for the current year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] flex items-end justify-between">
                  {stats?.monthlyRevenue?.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-primary rounded-t"
                        style={{ 
                          height: `${Math.max(30, (item.amount / 250000) * 200)}px` 
                        }}
                      ></div>
                      <span className="mt-2 text-xs">{item.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Popular Properties</CardTitle>
                <CardDescription>
                  Most booked hotels and tours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Top Hotels</h4>
                    <div className="space-y-2">
                      {stats?.popularHotels?.map((hotel, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-xs font-medium flex-1">{hotel.name}</span>
                          <span className="text-xs text-muted-foreground mr-2">{hotel.bookings} bookings</span>
                          <Progress value={(hotel.bookings / 50) * 100} className="w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Top Tours</h4>
                    <div className="space-y-2">
                      {stats?.popularTours?.map((tour, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-xs font-medium flex-1">{tour.name}</span>
                          <span className="text-xs text-muted-foreground mr-2">{tour.bookings} bookings</span>
                          <Progress value={(tour.bookings / 60) * 100} className="w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed statistics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-60">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Advanced analytics will be available soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Latest booking activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-3 text-xs font-medium text-muted-foreground">
                  <div>ID</div>
                  <div>Customer</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="divide-y">
                  {stats?.recentBookings?.map((booking) => (
                    <div key={booking.id} className="grid grid-cols-5 p-3 text-sm">
                      <div className="font-medium">#{booking.id}</div>
                      <div>{booking.customerName}</div>
                      <div>{booking.type}</div>
                      <div>
                        <span 
                          className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-right font-medium">
                        {formatCurrency(booking.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}