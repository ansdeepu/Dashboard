import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { siteConfig } from '@/config/site';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link';

export function AppHeader() {
  const pathname = usePathname();
  const breadcrumbItems = pathname.split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="md:hidden"> {/* Only show trigger on mobile/tablet */}
        <SidebarTrigger />
      </div>
      
      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">GWD Kollam Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbItems.map((item, index) => {
              const href = "/" + breadcrumbItems.slice(0, index + 1).join('/');
              const isLast = index === breadcrumbItems.length - 1;
              const title = item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ');
              
              // Try to find a matching nav item title
              const navItem = siteConfig.navItems.find(nav => nav.href === href);
              const displayTitle = navItem ? navItem.title : title;

              return (
                <React.Fragment key={href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{displayTitle}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{displayTitle}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* User menu can be added here if needed, for now sidebar handles user info/logout */}
    </header>
  );
}
