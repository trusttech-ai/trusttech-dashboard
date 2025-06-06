import React from 'react';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

interface MobileHeaderProps {
  title: string;
  onMenuToggle: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  onMenuToggle
}) => {
  return (
    <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100 flex items-center">
      <button 
        type="button" 
        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={onMenuToggle}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Icon name="menu" className="h-6 w-6" />
      </button>
      <div className="flex-1 flex justify-center">
        <Text variant="h1" className="text-xl font-medium text-gray-900">{title}</Text>
      </div>
    </div>
  );
};

export default MobileHeader;
