
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { siteConfig } from '@/config/site';
import { AppLogo } from '@/components/icons/app-logo';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react'; // UserCircle removed as FirebaseUser handles avatar
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth(); // user is now FirebaseUser | null
  const { state: sidebarState, isMobile, openMobile } = useSidebar();
  const collapsed = sidebarState === 'collapsed' && !isMobile && !openMobile;

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  const userDisplayName = user?.email || "User";

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <AppLogo collapsed={collapsed} />
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarMenu>
          {siteConfig.navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
                  tooltip={collapsed ? item.title : undefined}
                  aria-label={item.title}
                >
                  <item.icon />
                  {!collapsed && <span>{item.title}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
         {!collapsed && user && (
          <div className="flex items-center gap-2 p-2 border-t border-sidebar-border">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://placehold.co/40x40.png?text=${userInitial}`} alt={userDisplayName} data-ai-hint="abstract avatar" />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-sidebar-foreground truncate">{userDisplayName}</span>
          </div>
        )}
        {collapsed && user && (
           <div className="flex items-center justify-center p-2 border-t border-sidebar-border">
            <Avatar className="h-8 w-8">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${userInitial}`} alt={userDisplayName} data-ai-hint="abstract geometric" />
                <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
           </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={logout}
          aria-label="Logout"
        >
          <LogOut />
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
