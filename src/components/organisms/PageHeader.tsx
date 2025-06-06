import React from 'react';
import Text from '../atoms/Text';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <Text variant="h1" className="text-2xl font-semibold text-gray-900">{title}</Text>
    </div>
  );
};

export default PageHeader;
