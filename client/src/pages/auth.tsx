import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to home if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      return; // Password validation should show error
    }
    
    const { confirmPassword, ...userData } = registerData;
    registerMutation.mutate(userData);
  };

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Left column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Login to access your account and manage your bookings
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLoginSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username or Email</Label>
                      <Input 
                        id="username" 
                        name="username" 
                        placeholder="Enter your username or email"
                        value={loginData.username}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-sm text-primary hover:underline">
                          Forgot Password?
                        </a>
                      </div>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    
                    <div className="mt-6 p-3 bg-muted rounded-md border">
                      <h4 className="text-sm font-medium mb-2">Demo Accounts:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-background rounded border">
                          <p className="font-medium text-primary">Admin</p>
                          <p>Username: <span className="font-medium">admin</span></p>
                          <p>Password: <span className="font-medium">admin123</span></p>
                        </div>
                        <div className="p-2 bg-background rounded border">
                          <p className="font-medium text-primary">Regular User</p>
                          <p>Username: <span className="font-medium">testuser</span></p>
                          <p>Password: <span className="font-medium">password123</span></p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Each role has access to a different dashboard experience.</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Sign up to book tours, hotels, and packages in Puerto Galera
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegisterSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-fullName">Full Name</Label>
                      <Input 
                        id="reg-fullName" 
                        name="fullName" 
                        placeholder="Enter your full name"
                        value={registerData.fullName}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input 
                        id="reg-email" 
                        name="email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input 
                        id="reg-username" 
                        name="username" 
                        placeholder="Choose a username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input 
                        id="reg-password" 
                        name="password" 
                        type="password" 
                        placeholder="Create a strong password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-confirmPassword">Confirm Password</Label>
                      <Input 
                        id="reg-confirmPassword" 
                        name="confirmPassword" 
                        type="password" 
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                      />
                      {registerData.password !== registerData.confirmPassword && 
                        registerData.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">
                            Passwords do not match
                          </p>
                        )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={
                        registerMutation.isPending || 
                        registerData.password !== registerData.confirmPassword
                      }
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right column - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-primary to-primary-foreground">
        <div className="flex flex-col justify-center p-12 text-white">
          <h1 className="text-5xl font-bold mb-6">{SITE_NAME}</h1>
          <p className="text-xl mb-8">{SITE_TAGLINE}</p>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="rounded-full bg-white/10 p-3 mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium">Explore Beautiful White Beach</h3>
                <p>Discover the pristine white sands and crystal clear waters of Puerto Galera's most famous beach.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-white/10 p-3 mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium">Book Exciting Tours & Activities</h3>
                <p>From island hopping to scuba diving, find the perfect activities for your Puerto Galera vacation.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-white/10 p-3 mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium">Secure Your Perfect Hotel</h3>
                <p>Find accommodations to fit any budget - from luxury resorts to cozy beachfront cottages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}