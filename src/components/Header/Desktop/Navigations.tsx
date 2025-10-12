import { Lang } from '@/app/(types)/lang'
import Link from 'next/link'
import { texts } from '../translations'

type Props = {
	lang: Lang
}

export function Navigations({ lang }: Props) {
	const t = texts[lang]

	return (
		<>
			<Link
				href={`/${lang || 'uk'}/zayavki`}
				className='text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50'
			>
				{t.catalog}
			</Link>
			<Link
				href={`/${lang || 'uk'}/company`}
				className='text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50'
			>
				COMPANIES
			</Link>
			<Link
				href={`/${lang || 'uk'}/blog`}
				className='text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50'
			>
				{t.blog}
			</Link>
		</>
	)
}
