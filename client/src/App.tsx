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

// Admin pages will be added later
// import AdminDashboard from "@/pages/admin/dashboard";

function Router() {
  return (
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
        
        {/* Protected routes - will be implemented later */}
        {/* <ProtectedRoute path="/admin" component={AdminDashboard} roles={[USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN]} /> */}
        
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
