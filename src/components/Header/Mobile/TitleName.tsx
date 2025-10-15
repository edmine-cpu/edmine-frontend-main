import Link from 'next/link'
import { getLangPath } from '@/utils/linkHelper'
import { Lang } from '@/app/(types)/lang'

interface TitleNameProps {
	lang?: Lang
}

export function TitleName({ lang = 'en' }: TitleNameProps) {
	return (
		<Link href={getLangPath('/', lang)}>
			<span className='text-red-600 font-bold cursor-pointer text-3xl'>M</span>
		</Link>
	)
}
