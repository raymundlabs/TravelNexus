import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Hotels from "@/pages/hotels";
import HotelDetail from "@/pages/hotel-detail";
import Tours from "@/pages/tours";
import TourDetail from "@/pages/tour-detail";
import Packages from "@/pages/packages";
import PackageDetail from "@/pages/package-detail";
import Auth from "@/pages/auth";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./components/auth/protected-route";
import { USER_ROLES } from "./lib/constants";

// Admin and dashboard pages
import AdminDashboard from "@/pages/admin/dashboard";
import UserDashboard from "@/pages/account/dashboard";
import ProviderDashboard from "@/pages/provider/dashboard";

function Router() {
  return (
    <Switch>
      {/* Admin routes without header/footer */}
      <ProtectedRoute 
        path="/admin/dashboard" 
        component={AdminDashboard} 
        roles={[USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN]} 
      />
      
      {/* Provider routes without header/footer */}
      <ProtectedRoute 
        path="/provider/dashboard" 
        component={ProviderDashboard} 
        roles={[USER_ROLES.HOTEL_PROVIDER]} 
      />
      
      {/* Public and user routes with header/footer */}
      <ProtectedRoute 
        path="/account/dashboard" 
        component={() => (
          <>
            <Header />
            <UserDashboard />
            <Footer />
          </>
        )}
        roles={[USER_ROLES.CUSTOMER, USER_ROLES.TRAVEL_AGENT]} 
      />
      
      <Route path="/:rest*">
        <>
          <Header />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/hotels" component={Hotels} />
            <Route path="/hotels/:id" component={HotelDetail} />
            <Route path="/tours" component={Tours} />
            <Route path="/tours/:id" component={TourDetail} />
            <Route path="/packages" component={Packages} />
            <Route path="/packages/:id" component={PackageDetail} />
            <Route path="/auth" component={Auth} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </>
      </Route>
    </Switch>
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
