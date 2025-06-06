import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  className = ''
}) => {
  const variantClasses = {
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
  };
  
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${variantClasses[variant]} ${className} transition-all duration-200`}>
      {children}
    </span>
  );
};

export default Badge;
