import React from 'react';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Badge from '../atoms/Badge';

interface TableRowProps {
  avatar?: string;
  name: string;
  subtitle?: string;
  message: string;
  status: 'Respondido' | 'Aguardando' | 'Não lido';
  time: string;
  actionLink: string;
}

const TableRow: React.FC<TableRowProps> = ({
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
    <tr className="hover:bg-hover-bg transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {avatar ? (
              <Image 
                src={avatar} 
                alt={name} 
                className="h-10 w-10 rounded-full" 
              />
            ) : (
              <div className="h-10 w-10 bg-hover-bg rounded-full flex items-center justify-center transition-colors duration-200">
                <svg className="h-6 w-6 text-foreground opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <div className="ml-4">
            <Text variant="p" className="text-sm font-medium text-foreground transition-colors duration-200">{name}</Text>
            {subtitle && <Text variant="p" className="text-sm text-foreground opacity-70 transition-colors duration-200">{subtitle}</Text>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Text variant="p" className="text-sm text-foreground transition-colors duration-200">{message}</Text>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground opacity-70 transition-colors duration-200">{time}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a href={actionLink} className="text-primary hover:text-opacity-90 transition-colors duration-200">Ver</a>
      </td>
    </tr>
  );
};

export default TableRow;
