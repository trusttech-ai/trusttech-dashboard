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
    <div className="flex items-center">
      <div>
        <Image 
          src={avatarUrl} 
          alt={name} 
          className="inline-block h-9 w-9 rounded-full" 
          rounded
        />
      </div>
      <div className="ml-3">
        <Text variant="p" className="text-sm font-medium text-white">{name}</Text>
        <a href={profileLink} className="text-xs font-medium text-gray-300 hover:text-gray-200">
          Ver perfil
        </a>
      </div>
    </div>
  );
};

export default UserInfo;
