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
  const baseClasses = 'group flex items-center px-2 py-2 text-base font-medium rounded-md';
  const activeClasses = active 
    ? 'bg-gray-900 text-white' 
    : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  
  const iconColorClass = active ? 'text-gray-300' : 'text-gray-400';
  
  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      <Icon 
        name={icon} 
        className={`mr-3 flex-shrink-0 h-6 w-6 ${iconColorClass}`} 
      />
      {label}
    </Link>
  );
};

export default NavItem;
