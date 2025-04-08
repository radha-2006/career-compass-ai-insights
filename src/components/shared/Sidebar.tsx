
import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase, BarChart2, Award, Compass, Activity, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  
  const navItems = [
    { name: 'Dashboard', icon: Compass, active: true },
    { name: 'Job Trends', icon: BarChart2 },
    { name: 'Skills Analysis', icon: Award },
    { name: 'Job Opportunities', icon: Briefcase },
    { name: 'Career Path', icon: Activity },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out",
        isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
        !isMobile && "relative"
      )}
    >
      {isMobile && (
        <div className="absolute right-2 top-2">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      <div className="py-8 px-4">
        <div className="mb-8 flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-brand-purple" />
          <h2 className="text-xl font-semibold">CareerCompass</h2>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                item.active && "bg-brand-purple text-white hover:bg-brand-purple/90"
              )}
            >
              <item.icon className={cn("h-5 w-5", item.active ? "text-white" : "text-gray-500")} />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
