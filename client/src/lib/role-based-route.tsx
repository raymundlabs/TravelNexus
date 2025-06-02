import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

// Define possible user roles
export type UserRole = 'user' | 'hotel' | 'agent' | 'admin';

// Role-based route component
export function RoleBasedRoute({
  path,
  allowedRoles,
  component: Component,
}: {
  path: string;
  allowedRoles: UserRole[];
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  // Show loading spinner while auth status is being determined
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Get the role name using roleId
  const roleNames = ['admin', 'hotel', 'agent', 'user'];
  const roleName = user.roleId && user.roleId > 0 && user.roleId <= roleNames.length 
    ? roleNames[user.roleId - 1] 
    : 'user';

  // Check if user's role is in the allowed roles
  const hasPermission = allowedRoles.includes(roleName as UserRole);

  // Redirect to dashboard if user doesn't have permission
  if (!hasPermission) {
    return (
      <Route path={path}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }

  // Render the component if authenticated and has permission
  return <Route path={path} component={Component} />;
}

// Dashboard route handler that redirects to the appropriate dashboard based on user role
export function DashboardRouter() {
  const { user, isLoading } = useAuth();

  // Show loading spinner while auth status is being determined
  if (isLoading) {
    return (
      <Route path="/dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Route path="/dashboard">
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Determine which dashboard to redirect to based on user role
  const roleId = user.roleId || 4; // Default to regular user if roleId is not present
  
  return (
    <Route path="/dashboard">
      {roleId === 1 && <Redirect to="/dashboard/admin" />}
      {roleId === 2 && <Redirect to="/dashboard/hotel" />}
      {roleId === 3 && <Redirect to="/dashboard/agent" />}
      {roleId === 4 && <Redirect to="/dashboard/user" />}
    </Route>
  );
}