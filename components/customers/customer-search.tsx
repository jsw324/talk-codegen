'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface CustomerSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomerSearch({ value, onChange, placeholder = 'Search customers...' }: CustomerSearchProps) {
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative max-w-md">
      <div className={`relative flex items-center border rounded-lg transition-colors ${
        focused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'
      }`}>
        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border-none rounded-lg focus:outline-none focus:ring-0"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
