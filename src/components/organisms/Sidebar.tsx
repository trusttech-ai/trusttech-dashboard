import React from 'react';
import { usePathname } from 'next/navigation';
import Logo from '../atoms/Logo';
import NavItem from '../molecules/NavItem';
import UserInfo from '../molecules/UserInfo';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '../../hooks/use-mobile';

interface SidebarProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileMenuOpen, toggleMobileMenu }) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const navItems = [
    { icon: 'home', label: 'Dashboard', href: '/dashboard', active: pathname === '/dashboard' },
    { icon: 'calendar', label: 'Agendamentos', href: '/agendamentos', active: pathname === '/agendamentos' },
    { icon: 'message', label: 'Mensagens', href: '/mensagens', active: pathname === '/mensagens' },
    { icon: 'chart', label: 'Relatórios', href: '/relatorios', active: pathname === '/relatorios' },
    { icon: 'settings', label: 'Configurações', href: '/configuracoes', active: pathname === '/configuracoes' },
  ];

  // Sidebar para desktop
  const DesktopSidebar = (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 left-0">
      <div className="flex flex-col flex-grow pt-5 bg-gray-800 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Logo />
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
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
        <div className="flex-shrink-0 flex bg-gray-700 p-4">
          <UserInfo 
            name="Tom Cook"
            avatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {DesktopSidebar}
      {isMobile && <MobileMenu isOpen={mobileMenuOpen} onClose={toggleMobileMenu} />}
    </>
  );
};

export default Sidebar;
