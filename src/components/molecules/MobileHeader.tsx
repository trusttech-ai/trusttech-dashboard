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
    <div className="sticky top-0 z-10 md:hidden px-4 py-3 bg-header-bg border-b border-card-border flex items-center justify-between transition-colors duration-200">
      <button 
        type="button" 
        className="h-10 w-10 inline-flex items-center justify-center rounded-md text-foreground hover:bg-hover-bg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
        onClick={onMenuToggle}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Icon name="menu" className="h-6 w-6" />
      </button>
      
      <Text variant="h1" className="text-xl font-medium text-foreground text-center transition-colors duration-200">{title}</Text>
      
      {/* Elemento vazio com mesma largura do botão para equilibrar o layout */}
      <div className="h-10 w-10"></div>
    </div>
  );
};

export default MobileHeader;
