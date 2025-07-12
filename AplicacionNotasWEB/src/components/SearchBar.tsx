import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Buscar en notas, etiquetas...",
  className = ""
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  const clearSearch = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {value && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar; 