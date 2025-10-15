import { Lang } from '@/app/(types)/lang'
import { getLangPath } from '@/utils/linkHelper'
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
				href={getLangPath('/zayavki', lang)}
				className='text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50'
			>
				{t.catalog}
			</Link>
			<Link
				href={getLangPath('/company', lang)}
				className='text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50'
			>
				COMPANIES
			</Link>
			<Link
				href={getLangPath('/blog', lang)}
				className='text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50'
			>
				{t.blog}
			</Link>
		</>
	)
}
