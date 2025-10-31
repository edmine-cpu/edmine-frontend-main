import { Lang } from '@/app/(types)/lang'
import { getLangPath } from '@/utils/linkHelper'
import Link from 'next/link'

interface TitleNameProps {
	lang?: Lang
}

export function TitleName({ lang = 'en' }: TitleNameProps) {
	return (
		<Link href={getLangPath('/', lang)}>
			<span className='text-red-600 font-bold cursor-pointer text-3xl pl-3'>
				M
			</span>
		</Link>
	)
}
