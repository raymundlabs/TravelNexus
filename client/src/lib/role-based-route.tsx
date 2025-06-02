import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

// Define possible user roles
export type UserRole = 'customer' | 'hotel_owner' | 'travel_agent' | 'admin';

// Role-based route component
export function RoleBasedRoute({
  path,
  allowedRoles,
  component: Component,
}: {
  path: string;
  allowedRoles: UserRole[];
  component: () => React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  console.log(`🔐 RoleBasedRoute - Path: ${path}, Checking user permissions`);
  console.log(`🔐 RoleBasedRoute - Allowed roles:`, allowedRoles);
  console.log(`🔐 RoleBasedRoute - User:`, user);

  // Show loading spinner while auth status is being determined
  if (isLoading) {
    console.log(`⏳ RoleBasedRoute - Auth still loading for path: ${path}`);
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log(`🚫 RoleBasedRoute - No user, redirecting from ${path} to /auth`);
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Get the role name using roleId - mapped to match server implementation
  const roleMap = {
    1: 'admin',
    2: 'hotel_owner',
    3: 'travel_agent',
    4: 'customer'
  };
  const roleId = Number(user.roleId);
  const roleName = roleMap[roleId as keyof typeof roleMap] || 'customer';
  console.log(`👤 RoleBasedRoute - User role: ${roleName.toUpperCase()} (ID: ${roleId})`);

  // Check if user's role is in the allowed roles
  const hasPermission = allowedRoles.includes(roleName as UserRole);
  console.log(`🔍 RoleBasedRoute - Has permission for ${path}: ${hasPermission}`);

  // Redirect to dashboard if user doesn't have permission
  if (!hasPermission) {
    console.log(`🚷 RoleBasedRoute - Access denied to ${path}, redirecting to /dashboard`);
    return (
      <Route path={path}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }

  // Render the component if authenticated and has permission
  console.log(`✅ RoleBasedRoute - Rendering component for ${path}`);
  // Use a wrapper to force component rendering
  return (
    <Route path={path}>
      <div className="dashboard-wrapper" style={{ minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative', zIndex: 10 }}>
        <Component />
      </div>
    </Route>
  );
}

// Dashboard route handler that redirects to the appropriate dashboard based on user role
export function DashboardRouter() {
  const { user, isLoading } = useAuth();
  
  // Enhanced logging with visual markers for easier debugging
  console.log('🔍 DashboardRouter - USER OBJECT:', user);
  console.log('🔍 DashboardRouter - IS LOADING:', isLoading);

  // Show loading spinner while auth status is being determined
  if (isLoading) {
    console.log('⏳ DashboardRouter - Auth is still loading, showing spinner');
    return (
      <Route path="/dashboard">
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('🚫 DashboardRouter - No user found, redirecting to auth page');
    return (
      <Route path="/dashboard">
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Determine which dashboard to redirect to based on database role ID
  // Force parse the roleId as a number and ensure it's a valid value
  const roleIdRaw = user.roleId;
  const roleId = Number(roleIdRaw);
  
  console.log('🔢 DashboardRouter - Raw roleId:', roleIdRaw, 'Type:', typeof roleIdRaw);
  console.log('🔢 DashboardRouter - Parsed roleId:', roleId, 'Type:', typeof roleId);

  // Role mapping - this should match the database roles
  const roleMap = {
    1: { name: 'admin', path: '/dashboard/admin' },
    2: { name: 'hotel_owner', path: '/dashboard/hotel' },
    3: { name: 'travel_agent', path: '/dashboard/agent' },
    4: { name: 'customer', path: '/dashboard/user' }
  };

  // Get redirect path from role map or default to user dashboard
  const role = roleMap[roleId as keyof typeof roleMap] || { name: 'customer', path: '/dashboard/user' };
  
  console.log(`✅ DashboardRouter - Detected ${role.name.toUpperCase()} role (ID: ${roleId})`);
  console.log(`✅ DashboardRouter - Redirecting to: ${role.path}`);

  return (
    <Route path="/dashboard">
      <Redirect to={role.path} />
    </Route>
  );
}