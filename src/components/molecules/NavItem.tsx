import React from 'react';
import Icon from '../atoms/Icon';
import Link from 'next/link';

interface NavItemProps {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  active = false
}) => {
  const baseClasses = 'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200';
  const activeClasses = active 
    ? 'bg-purple-900/30 text-white shadow-sm border-l-4 border-purple-500' 
    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white';
  
  const iconColorClass = active ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400';
  
  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      <Icon 
        name={icon} 
        className={`mr-3 flex-shrink-0 h-5 w-5 ${iconColorClass} transition-all duration-200`} 
      />
      {label}
    </Link>
  );
};

export default NavItem;
