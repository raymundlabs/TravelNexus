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
        
        {/* Public Dashboard Routes - accessible to all authenticated users */}
        <Route path="/dashboard/user" component={UserDashboard} />
        <Route path="/dashboard/hotel" component={HotelDashboard} />
        <Route path="/dashboard/agent" component={AgentDashboard} />
        <Route path="/dashboard/admin" component={AdminDashboard} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        
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
