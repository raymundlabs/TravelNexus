import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { 
  LayoutDashboard, Users, Hotel, Palmtree, Package, Calendar, 
  CreditCard, Settings, LogOut, Menu, BarChart3, MapPin
} from 'lucide-react';

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  requiredRoles?: number[];
};

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const isActive = (path: string) => {
    return location === path;
  };

  // Admin role IDs: 5 (superadmin), 4 (admin)
  const isSuperAdmin = user?.roleId === 5;
  const isAdmin = user?.roleId === 4;
  
  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="w-5 h-5" />,
      requiredRoles: [5] // Only superadmin
    },
    {
      title: "Destinations",
      href: "/admin/destinations",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      title: "Hotels",
      href: "/admin/hotels",
      icon: <Hotel className="w-5 h-5" />,
    },
    {
      title: "Tours",
      href: "/admin/tours",
      icon: <Palmtree className="w-5 h-5" />,
    },
    {
      title: "Packages",
      href: "/admin/packages",
      icon: <Package className="w-5 h-5" />,
    },
    {
      title: "Bookings",
      href: "/admin/bookings",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      title: "Payments",
      href: "/admin/payments",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: <BarChart3 className="w-5 h-5" />,
      requiredRoles: [5] // Only superadmin
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
      requiredRoles: [5] // Only superadmin
    },
  ];

  // Filter items based on user role
  const filteredItems = sidebarItems.filter(item => {
    // If no required roles specified, show to all admins
    if (!item.requiredRoles) return true;
    
    // If user is superadmin, show all items
    if (isSuperAdmin) return true;
    
    // Otherwise, check if user role is in the required roles
    return item.requiredRoles.includes(user?.roleId || 0);
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="px-3 py-4">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h2 className="text-xl font-bold">White Beach</h2>
            <span className="ml-1 text-xs bg-primary text-white px-1 py-0.5 rounded">Admin</span>
          </Link>
        </div>
        <div className="space-y-1">
          {filteredItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setOpen(false)}
            >
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                size="sm"
                className={cn("w-full justify-start", isActive(item.href) ? "bg-primary" : "")}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </Button>
        
        {user && (
          <div className="mt-4 flex items-center gap-2 rounded-md border px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground">
                {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Staff'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <ScrollArea className="h-full">
            <SidebarContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop View */}
      <aside className="hidden lg:flex h-screen w-64 flex-col border-r">
        <ScrollArea className="flex-1">
          <SidebarContent />
        </ScrollArea>
      </aside>
    </>
  );
}