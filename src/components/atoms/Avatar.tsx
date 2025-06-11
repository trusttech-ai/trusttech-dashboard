import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name, 
  size = 'md',
  className = '' 
}) => {
  // Função para gerar iniciais a partir do nome
  const getInitials = (name: string): string => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  // Tamanhos para diferentes variantes
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  };

  const initials = getInitials(name);

  return (
    <>
      {src ? (
        <img 
          src={src}
          alt={name}
          className={`rounded-full ring-2 ring-purple-600/30 ${sizeClasses[size]} ${className}`}
        />
      ) : (
        <div 
          className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white font-medium ring-2 ring-purple-600/30 ${sizeClasses[size]} ${className}`}
        >
          {initials}
        </div>
      )}
    </>
  );
};

export default Avatar;