import React from 'react';
import Text from '../atoms/Text';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title
}) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Text variant="h1" className="text-2xl font-semibold text-foreground transition-colors duration-200">{title}</Text>
    </div>
  );
};

export default PageHeader;
