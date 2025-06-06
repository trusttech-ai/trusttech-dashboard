import React from 'react';

interface TableHeaderProps {
  columns: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns
}) => {
  return (
    <thead className="bg-gray-800/70 transition-colors duration-200">
      <tr>
        {columns.map((column, index) => (
          <th 
            key={index}
            scope="col" 
            className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            {column}
          </th>
        ))}
        <th scope="col" className="relative px-6 py-4">
          <span className="sr-only">Ações</span>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
