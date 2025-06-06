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
    <div className="bg-gray-800/70 border-t border-purple-900/20 px-6 py-3 transition-colors duration-200">
      <div className="text-sm">
        <a href={href} className={`font-medium ${color} flex items-center`}>
          {linkText}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default InfoCardFooter;
