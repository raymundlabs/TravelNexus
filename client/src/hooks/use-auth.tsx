import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface ReplitUser {
  id: string;
  name: string;
  bio: string;
  url: string;
  profileImage: string;
  roles: string[];
}

interface AuthContextType {
  user: ReplitUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ReplitUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      const userData = await response.json();
      setUser(userData);
      setError(null);
    } catch (err) {
      setUser(null);
      setError('Not authenticated');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const login = () => {
    window.location.href = `/api/auth/login?redirect=${window.location.pathname}`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}