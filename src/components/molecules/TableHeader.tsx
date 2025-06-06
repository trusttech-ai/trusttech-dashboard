import React from 'react';

interface TableHeaderProps {
  columns: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns
}) => {
  return (
    <thead className="bg-table-header-bg transition-colors duration-200">
      <tr>
        {columns.map((column, index) => (
          <th 
            key={index}
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-foreground opacity-70 uppercase tracking-wider transition-colors duration-200"
          >
            {column}
          </th>
        ))}
        <th scope="col" className="relative px-6 py-3">
          <span className="sr-only">Ações</span>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
