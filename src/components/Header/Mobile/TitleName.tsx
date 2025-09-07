import Link from 'next/link'

interface TitleNameProps {
	lang?: string
}

export function TitleName({ lang = 'en' }: TitleNameProps) {
	return (
		<Link href={`/${lang}`}>
			<span className='text-red-600 font-bold cursor-pointer text-3xl'>M</span>
		</Link>
	)
}
