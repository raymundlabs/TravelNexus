import { useState } from 'react';
import { Redirect } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from '@/lib/constants';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  roleId: z.string(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { toast } = useToast();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      fullName: '',
      roleId: '1', // Default to regular user
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        // Redirect will happen automatically due to auth state change
      },
      onError: (error) => {
        toast({
          title: 'Login failed',
          description: error.message || 'Failed to sign in. Please check your credentials.',
          variant: 'destructive',
        });
      },
    });
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Convert roleId from string to number
    const formattedData = {
      ...data,
      roleId: parseInt(data.roleId)
    };
    
    registerMutation.mutate(formattedData as any, {
      onError: (error) => {
        toast({
          title: 'Registration failed',
          description: error.message || 'Failed to register. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  // Redirect to home if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 px-6">
        <div className="hidden lg:flex flex-col justify-center">
          <h1 className="font-bold text-4xl">{SITE_NAME}</h1>
          <p className="text-2xl mb-2">{SITE_TAGLINE}</p>
          <p className="text-muted-foreground">{SITE_DESCRIPTION}</p>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Book Instantly</h3>
                <p className="text-muted-foreground text-sm">
                  Reserve tours, hotels, and packages with instant confirmation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground text-sm">
                  Your personal information and bookings are always protected.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Save Time</h3>
                <p className="text-muted-foreground text-sm">
                  With an account, check your booking history and manage reservations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                    Enter your username and password to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        {...loginForm.register('email')}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        {...loginForm.register('password')}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={loginMutation.isPending || isLoading}>
                      {loginMutation.isPending || isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </CardFooter>
                </form>
                <div className="px-6 pb-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Button variant="link" className="p-0" onClick={() => setActiveTab('register')}>
                      Register now
                    </Button>
                  </p>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Register to book tours, hotels, and packages in White Beach, Puerto Galera
                  </CardDescription>
                </CardHeader>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Your full name"
                        {...registerForm.register('fullName')}
                      />
                      {registerForm.formState.errors.fullName && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        {...registerForm.register('email')}
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input
                        id="reg-username"
                        type="text"
                        placeholder="Choose a username"
                        {...registerForm.register('username')}
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Choose a password"
                        {...registerForm.register('password')}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="roleId">Account Type</Label>
                      <Select 
                        onValueChange={(value) => registerForm.setValue('roleId', value)} 
                        defaultValue="1"
                        {...registerForm.register('roleId')}
                      >
                        <SelectTrigger id="roleId">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Regular User</SelectItem>
                          <SelectItem value="2">Hotel Owner/Manager</SelectItem>
                          <SelectItem value="3">Travel Agent</SelectItem>
                          <SelectItem value="4">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Select your account type. Special account types require approval.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={registerMutation.isPending || isLoading}
                    >
                      {registerMutation.isPending || isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </CardFooter>
                </form>
                <div className="px-6 pb-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Button variant="link" className="p-0" onClick={() => setActiveTab('login')}>
                      Sign in
                    </Button>
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}