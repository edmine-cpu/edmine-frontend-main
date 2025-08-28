'use client';

import React from 'react';

interface Category { 
  id: number; 
  name: string; 
}

interface Props {
  categories: Category[];
  selected: number[];
  onToggle: (id: number) => void;
  label: string;
}

export default function CategorySelector({ categories, selected, onToggle, label }: Props) {
  if (!categories || categories.length === 0) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="text-gray-500 text-sm p-3 border border-gray-300 rounded-md bg-gray-50">
          Немає доступних опцій
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
        {categories.map(cat => (
          <label 
            key={cat.id} 
            className="inline-flex items-center cursor-pointer select-none p-2 rounded hover:bg-white transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(cat.id)}
              onChange={() => onToggle(cat.id)}
              className="mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-2"
            />
            <span className="text-sm">{cat.name}</span>
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          Обрано: {selected.length}
        </div>
      )}
    </div>
  );
}


