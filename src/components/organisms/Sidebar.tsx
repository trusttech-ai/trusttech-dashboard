import React, { JSX, useState } from "react";

import UserInfo from "../molecules/UserInfo";

interface SidebarProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const getIcon = (iconName: string) => {
  const iconMap: Record<string, JSX.Element> = {
    dashboard: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    chat: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    analytics: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  };

  return iconMap[iconName] || iconMap.dashboard;
};

const Sidebar: React.FC<SidebarProps> = ({
  mobileMenuOpen,
  toggleMobileMenu,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const navigationItems = [
    { label: "Dashboard", icon: "dashboard", href: "/dashboard", active: true },
    { label: "Conversas", icon: "chat", href: "/conversations", active: false },
    { label: "Relatórios", icon: "analytics", href: "/reports", active: false },
    {
      label: "Configurações",
      icon: "settings",
      href: "/settings",
      active: false,
    },
  ];

  return (
    <>
      {/* Mobile background overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar wrapper */}
      <aside
        className={`${
          mobileMenuOpen ? "fixed z-50" : "hidden"
        } md:relative md:z-auto md:block top-0 bottom-0 left-0 bg-gray-900 md:bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/50
    transition-all duration-300 ease-in-out
    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo and collapse button */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } px-4 h-16 border-b border-gray-700/50`}
        >
          <div className="flex items-center">
            {!collapsed && (
              <span className="text-white font-bold text-lg">Trusttech.AI</span>
            )}
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:block p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700"
            aria-label={collapsed ? "Expandir" : "Colapsar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={collapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"}
              />
            </svg>
          </button>

          {/* Mobile close button */}
          <button
            className="md:hidden p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="relative flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent min-h-[calc(100vh-5em)]">
          {/* Navigation links */}
          <nav className="px-3 mt-6 space-y-1 flex-grow">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center ${
                  collapsed ? "justify-center" : ""
                } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                   ${
                     item.active
                       ? "bg-purple-700/20 text-purple-400 border-l-2 border-purple-500"
                       : "text-gray-300 hover:bg-gray-700 hover:text-white"
                   }`}
              >
                <div className={`${collapsed ? "" : "mr-3"}`}>
                  {getIcon(item.icon)}
                </div>
                {!collapsed && <span>{item.label}</span>}
              </a>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 w-full px-4">
            <UserInfo />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
