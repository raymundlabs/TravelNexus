import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  roles?: number[];
}

export function ProtectedRoute({
  path,
  component: Component,
  roles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !user ? (
        <Redirect to="/auth" />
      ) : roles && roles.length > 0 && !(user.roleId && roles.includes(user.roleId)) ? (
        <Redirect to="/" />
      ) : (
        <Component />
      )}
    </Route>
  );
}