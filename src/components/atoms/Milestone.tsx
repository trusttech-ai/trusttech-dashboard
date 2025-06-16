const Milestone = ({ 
  year,
  title, 
  description 
}: { 
  year: string; 
  title: string; 
  description: string; 
}) => {
  return (
    <div className="relative pl-8 pb-12 group">
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-purple-500 to-purple-900/20"></div>
      <div className="absolute left-0 top-2 w-6 h-6 rounded-full border-2 border-purple-500 bg-gray-900 group-hover:bg-purple-500 transition-colors duration-300"></div>
      <div className="text-purple-400 text-sm font-medium mb-1">{year}</div>
      <h4 className="text-white text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default Milestone;
