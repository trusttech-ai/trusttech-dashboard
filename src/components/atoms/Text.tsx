import React, { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'label';
  className?: string;
  color?: string;
}

const Text: React.FC<TextProps> = ({ 
  children, 
  variant = 'p', 
  className = '',
  color = ''
}) => {
const colorClass = color || 'text-white';  
  switch (variant) {
    case 'h1':
      return <h1 className={`text-2xl font-semibold ${colorClass} ${className} transition-colors duration-200`}>{children}</h1>;
    case 'h2':
      return <h2 className={`text-xl font-medium ${colorClass} ${className} transition-colors duration-200`}>{children}</h2>;
    case 'h3':
      return <h3 className={`text-lg font-medium ${colorClass} ${className} transition-colors duration-200`}>{children}</h3>;
    case 'h4':
      return <h4 className={`text-base font-medium ${colorClass} ${className} transition-colors duration-200`}>{children}</h4>;
    case 'label':
      return <label className={`text-sm ${colorClass} ${className} transition-colors duration-200`}>{children}</label>;
    case 'span':
      return <span className={`${colorClass} ${className} transition-colors duration-200`}>{children}</span>;
    default:
      return <p className={`${colorClass} ${className} transition-colors duration-200`}>{children}</p>;
  }
};

export default Text;
