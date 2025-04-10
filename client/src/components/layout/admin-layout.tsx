import { ReactNode } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1">
        <ScrollArea className="h-screen">
          <main className="flex-1 p-6">{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}