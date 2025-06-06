import React from 'react';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Badge from '../atoms/Badge';

interface MobileListItemProps {
  avatar?: string;
  name: string;
  subtitle?: string;
  message: string;
  status: 'Respondido' | 'Aguardando' | 'Não lido';
  time: string;
  actionLink: string;
}

const MobileListItem: React.FC<MobileListItemProps> = ({
  avatar,
  name,
  subtitle,
  message,
  status,
  time,
  actionLink
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'Respondido':
        return <Badge variant="success">Respondido</Badge>;
      case 'Aguardando':
        return <Badge variant="warning">Aguardando</Badge>;
      case 'Não lido':
        return <Badge variant="info">Não lido</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800/50 border border-purple-900/30 shadow-lg rounded-xl overflow-hidden transition-all duration-200 hover:bg-gray-800/70">
      <div className="px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12">
              {avatar ? (
                <Image 
                  src={avatar} 
                  alt={name} 
                  className="h-12 w-12 rounded-full ring-2 ring-purple-500/20" 
                />
              ) : (
                <div className="h-12 w-12 bg-gray-700/50 rounded-full flex items-center justify-center shadow-inner border border-purple-800/30">
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="ml-3">
              <Text variant="p" className="text-sm font-medium text-white">{name}</Text>
              {subtitle && <Text variant="p" className="text-xs text-gray-400">{subtitle}</Text>}
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <p>{time}</p>
          </div>
        </div>
        <div className="mt-3">
          <Text variant="p" className="text-sm text-gray-300">{message}</Text>
        </div>
        <div className="mt-3 flex justify-between items-center">
          {getStatusBadge()}
          <a href={actionLink} className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-all duration-200 flex items-center">
            Ver
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileListItem;
