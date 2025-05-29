import { Droplets } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function AppLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2 p-2">
      <Droplets className="h-7 w-7 text-primary" />
      {!collapsed && (
        <h1 className="text-xl font-bold text-primary whitespace-nowrap">
          {siteConfig.name}
        </h1>
      )}
    </div>
  );
}
