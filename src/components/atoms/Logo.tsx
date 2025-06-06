import React from 'react';
import Image from './Image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image 
        src="/logo.svg" 
        alt="Trusttech" 
        className="h-8 w-auto" 
      />
      <span className="ml-2 text-white text-lg font-medium">Trusttech</span>
    </div>
  );
};

export default Logo;
