import React from 'react';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

interface InfoCardHeaderProps {
  icon: string;
  title: string;
  iconColor: string;
}

const InfoCardHeader: React.FC<InfoCardHeaderProps> = ({
  icon,
  title,
  iconColor
}) => {
  return (
    <div className="flex items-center">
      <div className={`flex-shrink-0 ${iconColor} rounded-lg p-3 shadow-lg`}>
        <Icon 
          name={icon} 
          className="h-6 w-6 text-white" 
        />
      </div>
      <div className="ml-5 w-0 flex-1">
        <Text variant="label" className="text-sm font-medium text-gray-300 truncate">
          {title}
        </Text>
      </div>
    </div>
  );
};

export default InfoCardHeader;
