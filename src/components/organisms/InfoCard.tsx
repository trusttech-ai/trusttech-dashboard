import React from 'react';
import InfoCardHeader from '../molecules/InfoCardHeader';
import InfoCardContent from '../molecules/InfoCardContent';
import InfoCardFooter from '../molecules/InfoCardFooter';

interface InfoCardProps {
  icon: string;
  title: string;
  value: string | number;
  linkText: string;
  linkHref: string;
  iconColor: string;
  linkColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  value,
  linkText,
  linkHref,
  iconColor,
  linkColor
}) => {
  return (
    <div className="bg-gray-800/50 border border-purple-900/30 overflow-hidden shadow-lg rounded-xl backdrop-blur-sm transition-all duration-200 hover:shadow-purple-900/10">
      <div className="p-6">
        <InfoCardHeader 
          icon={icon} 
          title={title} 
          iconColor={iconColor} 
        />
        <div className="mt-3">
          <InfoCardContent value={value} />
        </div>
      </div>
      <InfoCardFooter 
        linkText={linkText} 
        href={linkHref} 
        color={linkColor} 
      />
    </div>
  );
};

export default InfoCard;
