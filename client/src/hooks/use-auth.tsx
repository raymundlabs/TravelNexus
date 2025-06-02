import { createContext, useContext, useEffect, ReactNode } from 'react';
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from '@tanstack/react-query';
import { z } from 'zod';
import { apiRequest, queryClient, getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
interface User {
  email: string;
  password: string;
  username: string;
  fullName: string | null;
  roleId: number;
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  phone: string | null;
  isActive: boolean | null;
  isEmailVerified: boolean | null;
  isPhoneVerified: boolean | null;
  authUserId: string | null;
  profilePicture: string | null;
  address: string | null;
  lastLogin: Date | null;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  verificationToken: string | null;
  profileImage: string | null;
}

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
    queryKey: ['/api/user'],
    queryFn: async () => {
      const response = await fetch('/api/user', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      return {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        fullName: userData.fullName,
        roleId: Number(userData.roleId),
        id: Number(userData.id),
        createdAt: userData.createdAt ? new Date(userData.createdAt) : null,
        updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : null,
        phone: userData.phone || null,
        isActive: userData.isActive || false,
        isEmailVerified: userData.isEmailVerified || false,
        isPhoneVerified: userData.isPhoneVerified || false,
        authUserId: userData.authUserId || null,
        profilePicture: userData.profilePicture || null,
        address: userData.address || null,
        lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : null,
        resetToken: userData.resetToken || null,
        resetTokenExpiry: userData.resetTokenExpiry ? new Date(userData.resetTokenExpiry) : null,
        verificationToken: userData.verificationToken || null,
        profileImage: userData.profileImage || null
      } as User;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Login mutation
  const loginMutation = useMutation<User, Error, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const loginData = await response.json();
      console.log('Login response data:', loginData);
      console.log('Role ID from login:', loginData.roleId, typeof loginData.roleId);
      return {
        email: loginData.email,
        password: loginData.password,
        username: loginData.username,
        fullName: loginData.fullName,
        roleId: Number(loginData.roleId),
        id: Number(loginData.id),
        createdAt: loginData.createdAt ? new Date(loginData.createdAt) : null,
        updatedAt: loginData.updatedAt ? new Date(loginData.updatedAt) : null,
        phone: loginData.phone || null,
        isActive: loginData.isActive || false,
        isEmailVerified: loginData.isEmailVerified || false,
        isPhoneVerified: loginData.isPhoneVerified || false,
        authUserId: loginData.authUserId || null,
        profilePicture: loginData.profilePicture || null,
        address: loginData.address || null
      } as User;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Just update the query cache
      // Let the DashboardRouter handle the routing
      toast({
        title: 'Login successful',
        description: 'Redirecting to dashboard...',
      });
    },
  });

  const registerMutation = useMutation<User, Error, RegisterData>({
    mutationFn: async (registerData: RegisterData) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registerData,
          role: Number(registerData.roleId) === 1 ? 'admin' : Number(registerData.roleId) === 2 ? 'hotel' : Number(registerData.roleId) === 3 ? 'agent' : 'user'
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const userData = await response.json();
      return {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        fullName: userData.fullName,
        roleId: Number(userData.roleId),
        id: Number(userData.id),
        createdAt: userData.createdAt ? new Date(userData.createdAt) : null,
        updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : null,
        phone: userData.phone || null,
        isActive: userData.isActive || false,
        isEmailVerified: userData.isEmailVerified || false,
        isPhoneVerified: userData.isPhoneVerified || false,
        authUserId: userData.authUserId || null,
        profilePicture: userData.profilePicture || null,
        address: userData.address || null
      } as User;
    },
    onSuccess: () => {
      toast({
        title: 'Registration successful',
        description: 'Please login with your new credentials',
      });
      // Redirect to login page
      window.location.href = '/auth';
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const userQuery = useQuery<User | null, Error>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/user', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      return {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        fullName: userData.fullName,
        roleId: Number(userData.roleId),
        id: Number(userData.id),
        createdAt: userData.createdAt ? new Date(userData.createdAt) : null,
        updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : null,
        phone: userData.phone || null,
        isActive: userData.isActive || false,
        isEmailVerified: userData.isEmailVerified || false,
        isPhoneVerified: userData.isPhoneVerified || false,
        authUserId: userData.authUserId || null,
        profilePicture: userData.profilePicture || null,
        address: userData.address || null,
        lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : null,
        resetToken: userData.resetToken || null,
        resetTokenExpiry: userData.resetTokenExpiry ? new Date(userData.resetTokenExpiry) : null,
        verificationToken: userData.verificationToken || null,
        profileImage: userData.profileImage || null
      } as User;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  // const loginMutation = useMutation<User, Error, LoginData>({
  //   mutationFn: async (credentials) => {
  //     try {
  //       const response = await apiRequest('POST', '/api/login', credentials);
  //       return await response.json();
  //     } catch (error) {
  //       throw error instanceof Error ? error : new Error('Login failed');
  //     }
  //   },
  //   onSuccess: (data) => {
  //     // Refetch user data after successful login
  //     queryClient.invalidateQueries({ queryKey: ['/api/user'] });
  //     toast({
  //       title: 'Welcome back!',
  //       description: 'You have successfully logged in.',
  //     });

  //     // Redirect to appropriate dashboard based on role
  //     setTimeout(() => {
  //       const role = data.roleName || 'user';
  //       let redirectPath = '/dashboard/user';

  //       if (role === 'admin' || role === 'superadmin') {
  //         redirectPath = '/dashboard/admin';
  //       } else if (role === 'hotel_owner' || role === 'hotel') {
  //         redirectPath = '/dashboard/hotel';
  //       } else if (role === 'travel_agent' || role === 'agent') {
  //         redirectPath = '/dashboard/agent';
  //       }

  //       window.location.href = redirectPath;
  //     }, 1000);
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: 'Login failed',
  //       description: error.message || 'Failed to login. Please check your credentials.',
  //       variant: 'destructive',
  //     });
  //   },
  // });

  // Register mutation
  // const registerMutation = useMutation<User, Error, RegisterData>({
  //   mutationFn: async (userData) => {
  //     try {
  //       const response = await apiRequest('POST', '/api/register', userData);
  //       return await response.json();
  //     } catch (error) {
  //       throw error instanceof Error ? error : new Error('Registration failed');
  //     }
  //   },
  //   onSuccess: () => {
  //     // Refetch user data after successful registration
  //     queryClient.invalidateQueries({ queryKey: ['/api/user'] });
  //     toast({
  //       title: 'Registration successful!',
  //       description: 'Your account has been created and you are now logged in.',
  //     });
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: 'Registration failed',
  //       description: error.message || 'Failed to register. Please try again.',
  //       variant: 'destructive',
  //     });
  //   },
  // });

  // Logout mutation
  // const logoutMutation = useMutation<void, Error>({
  //   mutationFn: async () => {
  //     try {
  //       await apiRequest('POST', '/api/logout');
  //     } catch (error) {
  //       throw error instanceof Error ? error : new Error('Logout failed');
  //     }
  //   },
  //   onSuccess: () => {
  //     // Clear user data after successful logout
  //     queryClient.invalidateQueries({ queryKey: ['/api/user'] });
  //     toast({
  //       title: 'Logged out',
  //       description: 'You have been successfully logged out.',
  //     });
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: 'Logout failed',
  //       description: error.message || 'Failed to logout. Please try again.',
  //       variant: 'destructive',
  //     });
  //   },
  // });

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