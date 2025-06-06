import React from 'react';
import Image from '../atoms/Image';
import Text from '../atoms/Text';

interface UserInfoProps {
  name: string;
  profileLink?: string;
  avatarUrl: string;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  profileLink = '#',
  avatarUrl
}) => {
  return (
    <div className="flex items-center bg-gray-800/40 p-3 rounded-lg">
      <div>
        <Image 
          src={avatarUrl} 
          alt={name} 
          className="inline-block h-10 w-10 rounded-full ring-2 ring-purple-600/30" 
          rounded
        />
      </div>
      <div className="ml-3">
        <Text variant="p" className="text-sm font-medium text-white">{name}</Text>
        <a href={profileLink} className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-all duration-200 flex items-center mt-1">
          Ver perfil
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default UserInfo;
