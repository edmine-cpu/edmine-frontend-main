'use client'

import { FiltersButton } from './ui/FiltersButton'
import { Region } from './ui/Region'

type Props = {
	lang: string
	country: string
	city: string
	category: string
	undercategory: string
}

export function FiltersMenu({
	lang,
	country,
	city,
	category,
	undercategory,
}: Props) {
	let title = 'All companies'

	if (category !== '' && undercategory !== '') {
		title =
			category.charAt(0).toUpperCase() +
			category.slice(1) +
			', ' +
			undercategory
	}

	title = title.replace(/-/g, ' ')

	title = 'Програмирование, Веб-разработка'

	return (
		<div className=''>
			<p className='font-semibold text-md'>{title}</p>
			<div className='flex justify-between items-center'>
				<Region name={'Все регионы'} />
				<FiltersButton name={'Фильтры'} />
			</div>
		</div>
	)
}
