import { Lang } from '@/app/(types)/lang'
import Link from 'next/link'

interface OwnerPropsData {
	lang: Lang
	name: string
	country: string
	city: string
	id: number
}

function get_initials(name: string): string {
	const words = name.trim().split(/\s+/)
	let initials = ''

	for (let i = 0; i < words.length; i++) {
		if (words[i].length > 0) {
			initials += words[i][0].toUpperCase()
		}
	}

	return initials
}

export const TRANSLATIONS = {
	reviews: {
		uk: 'Відгуки',
		en: 'Reviews',
		pl: 'Opinie',
		fr: 'Avis',
		de: 'Bewertungen',
	},
	message: {
		uk: 'Написати',
		en: 'Write',
		pl: 'Napisz',
		fr: 'Écrire',
		de: 'Schreiben',
	},
}

export function OwnerData({ lang, name, country, city, id }: OwnerPropsData) {
	return (
		<div className='w-auto flex'>
			<div>
				<div className='h-28 w-28 rounded-full bg-green-300 border-1 text-center flex justify-center items-center text-white font-bold text-3xl'>
					{get_initials(name)}
				</div>
			</div>
			<div className='flex flex-col pl-3 pr-6'>
				<h1 className='justify-end font-bold text-xl'>{name}</h1>
				<div>
					{country}, {city}
				</div>
				<div className='flex items-center space-x-2'>
					{/* Звёзды */}
					<div className='flex text-yellow-400'>
						<span>★</span>
						<span>★</span>
						<span>★</span>
						<span>★</span>
						<span>★</span>
					</div>

					{/* Кол-во отзывов */}
					<span className='text-gray-600 text-sm'>
						(120 {TRANSLATIONS.reviews[lang]})
					</span>
				</div>
				<Link
					href={`/${lang}/chat/${id}`}
					className='flex justify-center items-center mr-auto bg-gray-100 rounded-md pr-3 pl-3 hover:bg-gray-200 transition durations-200'
				>
					<span className='text-3xl'>✉ </span>
					{TRANSLATIONS.message[lang]}
				</Link>
			</div>
		</div>
	)
}
