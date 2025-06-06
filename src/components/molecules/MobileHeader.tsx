import React from 'react';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import ThemeToggle from '../atoms/ThemeToggle';

interface MobileHeaderProps {
  title: string;
  onMenuToggle: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  onMenuToggle
}) => {
  return (
    <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-header-bg border-b border-card-border flex items-center transition-colors duration-200">
      <button 
        type="button" 
        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-foreground hover:bg-hover-bg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
        onClick={onMenuToggle}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Icon name="menu" className="h-6 w-6" />
      </button>
      <div className="flex-1 flex justify-center">
        <Text variant="h1" className="text-xl font-medium text-foreground transition-colors duration-200">{title}</Text>
      </div>
      <div className="mr-2">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default MobileHeader;
