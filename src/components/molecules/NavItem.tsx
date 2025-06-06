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
  const baseClasses = 'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200';
  const activeClasses = active 
    ? 'bg-sidebar-active text-foreground' 
    : 'text-foreground hover:bg-sidebar-hover hover:text-foreground';
  
  const iconColorClass = active ? 'text-primary' : 'text-foreground opacity-70';
  
  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      <Icon 
        name={icon} 
        className={`mr-3 flex-shrink-0 h-6 w-6 ${iconColorClass} transition-colors duration-200`} 
      />
      {label}
    </Link>
  );
};

export default NavItem;
