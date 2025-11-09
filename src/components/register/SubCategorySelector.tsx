'use client'

export type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de';
export type SubCategory = { id: string; name: string; categoryId: string };

type Props = {
    lang: Lang;
    subCategories: SubCategory[];
    selectedCategories: string[];
    selectedSubCategories: string[];
    setSelectedSubCategories: (val: (prev: string[]) => string[]) => void;
};

const texts: Record<Lang, { subCategoriesLabel: string }> = {
    uk: { subCategoriesLabel: 'Підкатегорії' },
    en: { subCategoriesLabel: 'Subcategories' },
    pl: { subCategoriesLabel: 'Podkategorie' },
    fr: { subCategoriesLabel: 'Sous-catégories' },
    de: { subCategoriesLabel: 'Unterkategorien' },
};

export function SubCategorySelector({
                                        lang,
                                        subCategories,
                                        selectedCategories,
                                        selectedSubCategories,
                                        setSelectedSubCategories,
                                    }: Props) {
    const filteredSubCategories = subCategories.filter(sub =>
        selectedCategories.includes(sub.categoryId)
    );

    function toggleSubCategory(id: string) {
        setSelectedSubCategories(prev =>
            prev.includes(id) ? prev.filter(sc => sc !== id) : [...prev, id]
        );
    }

    if (filteredSubCategories.length === 0) return null;

    return (
        <div className="mt-2 w-full max-w-full box-border">
            <p className="mb-2 font-semibold text-lg">
                {texts[lang].subCategoriesLabel}
            </p>
            <div className="flex flex-wrap gap-3 max-w-full">
                {filteredSubCategories.map(sub => {
                    const selected = selectedSubCategories.includes(sub.id);
                    return (
                        <button
                            key={sub.id}
                            type="button"
                            onClick={() => toggleSubCategory(sub.id)}
                            className={`px-4 py-2 rounded-md cursor-pointer select-none transition break-words max-w-full
                ${selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
              `}
                        >
                            {sub.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
