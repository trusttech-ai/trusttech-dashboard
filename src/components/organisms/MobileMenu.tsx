import React from 'react';
import { usePathname } from 'next/navigation';
import Icon from '../atoms/Icon';
import Logo from '../atoms/Logo';
import NavItem from '../molecules/NavItem';
import UserInfo from '../molecules/UserInfo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose
}) => {
  const pathname = usePathname();
  const navItems = [
    { icon: 'home', label: 'Dashboard', href: '/dashboard', active: pathname === '/dashboard' },
  ];

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 flex z-40">
      {/* Overlay de fundo */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={onClose}></div>
      </div>
      
      {/* Sidebar móvel */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Fechar menu</span>
            <Icon name="close" className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <Logo />
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item, index) => (
              <NavItem 
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={item.active}
              />
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <UserInfo 
            name="Tom Cook"
            avatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        </div>
      </div>
      
      <div className="flex-shrink-0 w-14" aria-hidden="true">
        {/* Força o botão fechar para fora da tela */}
      </div>
    </div>
  );
};

export default MobileMenu;
