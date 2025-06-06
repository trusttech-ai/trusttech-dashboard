import React from 'react';

interface InfoCardFooterProps {
  linkText: string;
  href: string;
  color?: string;
}

const InfoCardFooter: React.FC<InfoCardFooterProps> = ({
  linkText,
  href,
  color = 'text-indigo-600 hover:text-indigo-500'
}) => {
  return (
    <div className="bg-gray-50 px-5 py-3">
      <div className="text-sm">
        <a href={href} className={`font-medium ${color}`}>
          {linkText}
        </a>
      </div>
    </div>
  );
};

export default InfoCardFooter;
