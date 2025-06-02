import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import HomePage2 from "@/pages/homepage2";
import Hotels from "@/pages/hotels";
import HotelDetail from "@/pages/hotel-detail";
import Tours from "@/pages/tours";
import TourDetail from "@/pages/tour-detail";
import Packages from "@/pages/packages";
import PackageDetail from "@/pages/package-detail";
import AuthPage from "@/pages/auth-page";
import UserDashboard from "@/pages/dashboards/user-dashboard";
import HotelDashboard from "@/pages/dashboards/hotel-dashboard";
import AgentDashboard from "@/pages/dashboards/agent-dashboard";
import AdminDashboard from "@/pages/dashboards/admin-dashboard";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { AuthProvider } from "./hooks/use-auth";
import { RoleBasedRoute, DashboardRouter } from "./lib/role-based-route";

// Main router component
function Router() {
  const [location] = useLocation();
  const isDashboardPath = location.includes('/dashboard');
  
  // Enhanced logging for routing
  console.log('🌐 App Router - Current location:', location);
  console.log('🌐 App Router - Is dashboard path:', isDashboardPath);
  
  // Define dashboard paths for clarity
  const dashboardPaths = [
    '/dashboard',
    '/dashboard/user',
    '/dashboard/hotel',
    '/dashboard/agent',
    '/dashboard/admin'
  ];
  
  // Check if current path is in our defined dashboard paths
  const isKnownDashboardPath = dashboardPaths.some(path => location.startsWith(path));
  console.log('🌐 App Router - Is known dashboard path:', isKnownDashboardPath);
  
  return (
    <>
      {/* Only render Header on non-dashboard paths */}
      {!isDashboardPath && <Header />}
      
      {/* Main route switch */}
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={HomePage2} />
        <Route path="/reviews" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/hotels" component={Hotels} />
        <Route path="/hotels/:id" component={HotelDetail} />
        <Route path="/tours" component={Tours} />
        <Route path="/tours/:id" component={TourDetail} />
        <Route path="/packages" component={Packages} />
        <Route path="/packages/:id" component={PackageDetail} />
        
        {/* Dashboard Router - redirects to appropriate dashboard based on role */}
        <DashboardRouter />
        
        {/* Role-protected Dashboard Routes */}
        <RoleBasedRoute 
          path="/dashboard/user" 
          allowedRoles={['customer', 'hotel_owner', 'travel_agent', 'admin']} 
          component={UserDashboard} 
        />
        <RoleBasedRoute 
          path="/dashboard/hotel" 
          allowedRoles={['hotel_owner', 'admin']} 
          component={HotelDashboard} 
        />
        <RoleBasedRoute 
          path="/dashboard/agent" 
          allowedRoles={['travel_agent', 'admin']} 
          component={AgentDashboard} 
        />
        <RoleBasedRoute 
          path="/dashboard/admin" 
          allowedRoles={['admin']} 
          component={AdminDashboard} 
        />

        {/* Fallback route */}
        <Route component={NotFound} />
      </Switch>
      
      {/* Only render Footer on non-dashboard paths */}
      {!isDashboardPath && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
