import React from 'react';
import InfoCard from './InfoCard';

interface InfoCardGridProps {
  cards: {
    icon: string;
    title: string;
    value: string | number;
    linkText: string;
    linkHref: string;
    iconColor: string;
    linkColor?: string;
  }[];
}

const InfoCardGrid: React.FC<InfoCardGridProps> = ({
  cards
}) => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <InfoCard 
          key={index}
          icon={card.icon}
          title={card.title}
          value={card.value}
          linkText={card.linkText}
          linkHref={card.linkHref}
          iconColor={card.iconColor}
          linkColor={card.linkColor}
        />
      ))}
    </div>
  );
};

export default InfoCardGrid;
