import React from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
}

const Image: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  rounded = false 
}) => {
  const roundedClass = rounded ? 'rounded-full' : '';
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${roundedClass} ${className}`}
      width={width}
      height={height}
    />
  );
};

export default Image;
