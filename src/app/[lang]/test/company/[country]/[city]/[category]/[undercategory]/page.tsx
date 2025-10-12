import { Lang } from '@/app/(types)/lang'
import { FiltersMenu } from '@/components/Filters/FiltersMenu'
import Header from '@/components/Header/Header'

type Params = {
	country: string
	city: string
	category: string
	undercategory: string
	lang: Lang
}

export default async function Page({ params }: { params: Promise<Params> }) {
	const { lang } = await params
	const { country } = await params
	const { city } = await params
	const { category } = await params
	const { undercategory } = await params

	return (
		<div>
			<Header lang={lang} />
			<FiltersMenu
				lang={lang}
				country={country}
				city={city}
				category={category}
				undercategory={undercategory}
			/>
		</div>
	)
}
