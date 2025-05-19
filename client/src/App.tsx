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

function Router() {
  const [location] = useLocation();

  return (
    <>
      {location !== '/reviews' && <Header />}
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
        
        {/* Role-specific Dashboards */}
        <RoleBasedRoute path="/dashboard/user" allowedRoles={['user', 'hotel', 'agent', 'superadmin']} component={UserDashboard} />
        <RoleBasedRoute path="/dashboard/hotel" allowedRoles={['hotel', 'superadmin']} component={HotelDashboard} />
        <RoleBasedRoute path="/dashboard/agent" allowedRoles={['agent', 'superadmin']} component={AgentDashboard} />
        <RoleBasedRoute path="/dashboard/admin" allowedRoles={['superadmin']} component={AdminDashboard} />
        
        <Route component={NotFound} />
      </Switch>
      <Footer />
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
