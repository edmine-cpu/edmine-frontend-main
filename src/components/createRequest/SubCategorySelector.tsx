'use client';

import React from 'react';

interface SubCategory { 
  id: number; 
  name: string;
  full_category_id: number;
}

interface Props {
  subcategories: SubCategory[];
  selectedCategories: number[];
  selected: number[];
  onToggle: (id: number) => void;
  label: string;
}

export default function SubCategorySelector({ subcategories, selectedCategories, selected, onToggle, label }: Props) {
  // Фильтруем подкатегории только для выбранных категорий
  const filteredSubcategories = subcategories.filter(sub => 
    selectedCategories.includes(sub.full_category_id)
  );

  if (!filteredSubcategories || filteredSubcategories.length === 0) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="text-gray-500 text-sm p-3 border border-gray-300 rounded-md bg-gray-50">
          {selectedCategories.length > 0 ? 'Немає підкатегорій для обраних категорій' : 'Спочатку оберіть категорії'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
        {filteredSubcategories.map(sub => (
          <label 
            key={sub.id} 
            className="inline-flex items-center cursor-pointer select-none p-2 rounded hover:bg-white transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(sub.id)}
              onChange={() => onToggle(sub.id)}
              className="mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-2"
            />
            <span className="text-sm">{sub.name}</span>
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
