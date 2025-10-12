'use client'

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

	return (
		<div className='flex justify-center'>
			<p className='font-semibold'>{title}</p>
		</div>
	)
}
