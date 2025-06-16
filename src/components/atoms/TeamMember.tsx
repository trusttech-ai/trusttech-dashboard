const TeamMember = ({ 
  name, 
  role, 
  bio, 
  imageUrl = undefined 
}: { 
  name: string; 
  role: string; 
  bio: string; 
  imageUrl?: string; 
}) => {
  const getInitials = (name: string): string => {
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex flex-col items-center text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
      <div className="mb-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/50" 
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-xl font-bold text-white">
            {getInitials(name)}
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-1">{name}</h3>
      <p className="text-purple-400 text-sm mb-3">{role}</p>
      <p className="text-gray-300 text-sm">{bio}</p>
    </div>
  );
};

export default TeamMember;