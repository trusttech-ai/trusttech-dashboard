import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '',
  size = 'md',
  variant = 'light'
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  const textColorClass = variant === 'light' ? 'text-white' : 'text-gray-900';
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-purple-600 rounded-md p-2 flex items-center justify-center">
        <span className="font-bold text-white">Dashboard</span>
      </div>
      <span className={`ml-2 ${textColorClass} ${sizeClasses[size]} font-bold`}>
        Trusttech.AI
      </span>
    </div>
  );
};

export default Logo;
