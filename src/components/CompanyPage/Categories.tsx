interface Category {
	id: number
	name: string
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
}

interface Subcategory {
	id: number
	name: string
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
}

interface CategoriesProps {
	lang: string
	categories?: Category[]
	subcategories?: Subcategory[]
}

const TRANSLATIONS = {
	categories: {
		uk: 'Категорії:',
		en: 'Categories:',
		pl: 'Kategorie:',
		fr: 'Catégories:',
		de: 'Kategorien:',
	},
	subcategories: {
		uk: 'Підкатегорії:',
		en: 'Subcategories:',
		pl: 'Podkategorie:',
		fr: 'Sous-catégories:',
		de: 'Unterkategorien:',
	},
}

export function Categories({
	lang,
	categories,
	subcategories,
}: CategoriesProps) {
	const t = TRANSLATIONS as any

	if (!categories?.length && !subcategories?.length) {
		return null
	}

	const getCategoryName = (category: Category | Subcategory) => {
		return (category as any)[`name_${lang}`] || category.name
	}

	return (
		<div className='mt-6'>
			{categories && categories.length > 0 && (
				<div className='mb-4'>
					<h3 className='font-semibold text-gray-800 mb-2'>
						{t.categories[lang]}
					</h3>
					<div className='flex flex-wrap gap-2'>
						{categories.map(category => (
							<span
								key={category.id}
								className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium'
							>
								{getCategoryName(category)}
							</span>
						))}
					</div>
				</div>
			)}

			{subcategories && subcategories.length > 0 && (
				<div>
					<h3 className='font-semibold text-gray-800 mb-2'>
						{t.subcategories[lang]}
					</h3>
					<div className='flex flex-wrap gap-2'>
						{subcategories.map(subcategory => (
							<span
								key={subcategory.id}
								className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
							>
								{getCategoryName(subcategory)}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
