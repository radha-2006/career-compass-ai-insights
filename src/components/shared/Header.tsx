
import React from 'react';
import { BriefcaseIcon, MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full py-4 px-4 md:px-6 border-b flex items-center justify-between bg-white">
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-6 w-6 text-brand-purple" />
          <h1 className="text-xl font-semibold text-gray-900">CareerCompass</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          About
        </Button>
        <Button className="bg-brand-purple hover:bg-brand-purple/90" size="sm">
          Sign In
        </Button>
      </div>
    </header>
  );
};

export default Header;
