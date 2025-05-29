
import type { NavItem } from '@/types';
import { LayoutDashboard, FilePlus2, Search, FileText, LogOut } from 'lucide-react';

export const siteConfig = {
  name: 'GWD Kollam Dashboard',
  description: 'Ground Water Department Kollam - Work Progress Dashboard',
  navItems: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Data Entry',
      href: '/data-entry',
      icon: FilePlus2,
    },
    {
      title: 'Search',
      href: '/search',
      icon: Search,
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: FileText,
    },
  ] satisfies NavItem[],
};
