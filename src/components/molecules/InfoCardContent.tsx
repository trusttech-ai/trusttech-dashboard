import React from 'react';

interface InfoCardContentProps {
  value: string | number;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({
  value
}) => {
  return (
    <div className="text-3xl font-bold text-white">
      {value}
    </div>
  );
};

export default InfoCardContent;
