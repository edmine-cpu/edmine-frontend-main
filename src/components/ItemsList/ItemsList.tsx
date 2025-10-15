import { Lang } from '@/app/(types)/lang'

type ItemsListFilters = {
	lang: Lang
	country?: string
	city?: string
	category?: string
	subcategory?: string
	search?: string
	min_cost?: number
	max_cost?: number
}

export function ItemsList({
	country,
	city,
	category,
	subcategory,
	lang,
	search,
	min_cost,
	max_cost,
}: ItemsListFilters) {
	return (
		<div className=''>
			<p className='font-semibold text-xl'>{country}</p>
		</div>
	)
}
