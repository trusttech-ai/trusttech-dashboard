import React from 'react';

interface InfoCardContentProps {
  value: string | number;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({
  value
}) => {
  return (
    <div className="text-lg font-medium text-foreground transition-colors duration-200">
      {value}
    </div>
  );
};

export default InfoCardContent;
