'use client'

import React from "react";

export type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';

export type Category = { id: string; name: string };
export type SubCategory = { id: string; name: string; categoryId: string };

type Props = {
    lang: Lang;
    categories: Category[];
    selectedCategories: string[];
    setSelectedCategories: (val: (prev: string[]) => string[]) => void;
    setSelectedSubCategories: (val: (prev: string[]) => string[]) => void;
    subCategories: SubCategory[];
};

const titles: Record<Lang, string> = {
    uk: 'Категорії:',
    en: 'Categories:',
    pl: 'Kategorie:',
    fr: 'Catégories :',
    de: 'Kategorien:',
};

export function CategorySelector({
                                     lang,
                                     categories,
                                     selectedCategories,
                                     setSelectedCategories,
                                     setSelectedSubCategories,
                                     subCategories,
                                 }: Props) {
    function toggleCategory(id: string) {
        setSelectedCategories(prev => {
            if (prev.includes(id)) {
                setSelectedSubCategories(sc =>
                    sc.filter(subId => {
                        const sub = subCategories.find(s => s.id === subId);
                        return sub?.categoryId !== id;
                    })
                );
                return prev.filter(c => c !== id);
            } else {
                return [...prev, id];
            }
        });
    }

    return (
        <div>
            <p className="mb-2 font-semibold text-lg">{titles[lang]}</p>
            <div className="flex gap-3 flex-wrap max-w-full">
                {categories.map(cat => {
                    const selected = selectedCategories.includes(cat.id);
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={`px-4 py-2 rounded-md cursor-pointer select-none transition
                ${selected ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}
              `}
                        >
                            {cat.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
