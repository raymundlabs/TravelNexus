import { createContext, useContext, useEffect, ReactNode } from 'react';
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from '@tanstack/react-query';
import { z } from 'zod';
import { apiRequest, queryClient, getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { User } from '@shared/schema';

// Form schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(3),
  roleId: z.string(),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Query to get the current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ['/api/auth/user'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Login mutation
  const loginMutation = useMutation<User, Error, LoginData>({
    mutationFn: async (credentials) => {
      try {
        const response = await apiRequest('POST', '/api/auth/login', credentials);
        return await response.json();
      } catch (error) {
        throw error instanceof Error ? error : new Error('Login failed');
      }
    },
    onSuccess: (data) => {
      // Refetch user data after successful login
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      
      // Redirect to appropriate dashboard based on role
      setTimeout(() => {
        const role = data.role || 'user';
        let redirectPath = '/dashboard/user';
        
        if (role === 'admin' || role === 'superadmin') {
          redirectPath = '/dashboard/admin';
        } else if (role === 'hotel_owner' || role === 'hotel') {
          redirectPath = '/dashboard/hotel';
        } else if (role === 'travel_agent' || role === 'agent') {
          redirectPath = '/dashboard/agent';
        }
        
        window.location.href = redirectPath;
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Failed to login. Please check your credentials.',
        variant: 'destructive',
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation<User, Error, RegisterData>({
    mutationFn: async (userData) => {
      try {
        const response = await apiRequest('POST', '/api/auth/register', userData);
        return await response.json();
      } catch (error) {
        throw error instanceof Error ? error : new Error('Registration failed');
      }
    },
    onSuccess: () => {
      // Refetch user data after successful registration
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: 'Registration successful!',
        description: 'Your account has been created and you are now logged in.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Failed to register. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      try {
        await apiRequest('POST', '/api/auth/logout');
      } catch (error) {
        throw error instanceof Error ? error : new Error('Logout failed');
      }
    },
    onSuccess: () => {
      // Clear user data after successful logout
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Logout failed',
        description: error.message || 'Failed to logout. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error: error || null,
        loginMutation,
        registerMutation,
        logoutMutation,
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