import React from 'react';

interface InfoCardContentProps {
  value: string | number;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({
  value
}) => {
  return (
    <div className="text-lg font-medium text-gray-900">
      {value}
    </div>
  );
};

export default InfoCardContent;
