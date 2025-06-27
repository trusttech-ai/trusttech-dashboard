import React from "react";

import { useAuth } from "@/context/AuthContext";

import Text from "../atoms/Text";

const UserInfo: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const normalizeUserName = (name: string): string => {
    if (!name) return "";

    const nameParts = name.trim().split(" ");

    if (nameParts.length === 1) {
      return nameParts[0].toUpperCase();
    }

    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];

    return `${firstName.charAt(0).toUpperCase()}${firstName
      .slice(1)
      .toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName
      .slice(1)
      .toLowerCase()}`;
  };

  const getInitials = (name: string): string => {
    if (!name) return "";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(
      0
    )}`.toUpperCase();
  };

  const initials = getInitials(user?.name ?? "John Doe");

  if (!user) return null;

  return (
<div className="w-full px-6 pl-0 overflow-hidden">
  <div className="flex items-center w-full max-w-full space-x-3">
    <div className="flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white font-medium ring-2 ring-purple-600/30">
      {initials}
    </div>
    <div className="flex flex-col truncate">
      <Text variant="p" className="text-sm font-medium text-white truncate">
        {normalizeUserName(user.name)}
      </Text>
      <button
        onClick={handleLogout}
        className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-all duration-200 flex items-center mt-1 cursor-pointer"
      >
        Sair do aplicativo
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</div>
  );
};

export default UserInfo;
