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
    <div className="bg-card-bg border border-card-border overflow-hidden shadow rounded-lg transition-colors duration-200">
      <div className="p-5">
        <InfoCardHeader 
          icon={icon} 
          title={title} 
          iconColor={iconColor} 
        />
        <div className="mt-2">
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
