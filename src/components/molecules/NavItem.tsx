import React from 'react';
import Link from 'next/link';
import Icon from '../atoms/Icon';

interface NavItemProps {
  icon: string;
  label: string;
  href: string;
  active: boolean;
  tooltip?: string;
  compact?: boolean;
  iconClassName?: string;
  activeClassName?: string;
  hoverClassName?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  href, 
  active, 
  tooltip,
  compact = false,
  iconClassName = "text-purple-400",
  activeClassName = "bg-purple-700 text-white",
  hoverClassName = "hover:bg-gray-800 hover:text-white"
}) => {
  const baseClasses = "flex items-center px-4 py-3 rounded-lg mb-1 transition-colors duration-200";
  
  const classes = active
    ? `${baseClasses} ${activeClassName}`
    : `${baseClasses} text-gray-300 ${hoverClassName}`;

  return (
    <Link href={href} title={tooltip}>
      <div className={classes}>
        <Icon 
          name={icon} 
          className={`${compact ? '' : 'mr-3'} h-5 w-5 ${iconClassName}`} 
        />
        {!compact && <span>{label}</span>}
      </div>
    </Link>
  );
};

export default NavItem;
