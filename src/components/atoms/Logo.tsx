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
      <span className={`mt-2 ${textColorClass} ${sizeClasses[size]} font-bold`}>
        Trusttech
      </span>
      <div className="bg-purple-600 rounded-md p-2 flex items-center justify-center mb-1">
        <span className="font-bold text-white">Hub</span>
      </div>
    </div>
  );
};

export default Logo;
