import { Lang } from '@/app/(types)/lang'
import { HeaderButtons } from '@/components/Header/Desktop/Buttons'
import { SearchBid } from '@/components/Header/Desktop/SearchBid'
import { TitleName } from '@/components/Header/Desktop/TitleName'
import { LanguageSwitcher } from '@/components/Header/LanguageSwitcher'
import Link from 'next/link'

interface HeaderProps {
	lang: Lang
}

export const texts = {
	uk: {
		addTask: 'ДОДАТИ ЗАВДАННЯ',
		login: 'УВІЙТИ',
		howItWorks: 'ЯК ЦЕ ПРАЦЮЄ',
		catalog: 'КАТЕГОРІЇ',
		blog: 'БЛОГ',
	},
	en: {
		addTask: 'ADD TASK',
		login: 'LOGIN',
		howItWorks: 'HOW IT WORKS',
		catalog: 'CATEGORIES',
		blog: 'BLOG',
	},
	pl: {
		addTask: 'DODAJ ZADANIE',
		login: 'ZALOGUJ SIĘ',
		howItWorks: 'JAK TO DZIAŁA',
		catalog: 'KATEGORIE',
		blog: 'BLOG',
	},
	fr: {
		addTask: 'AJOUTER UNE TÂCHE',
		login: 'SE CONNECTER',
		howItWorks: 'COMMENT ÇA MARCHE',
		catalog: 'CATÉGORIES',
		blog: 'BLOG',
	},
	de: {
		addTask: 'AUFGABE HINZUFÜGEN',
		login: 'ANMELDEN',
		howItWorks: 'WIE ES FUNKTIONIERT',
		catalog: 'KATEGORIEN',
		blog: 'BLOG',
	},
} as const

export function DesktopHeader({ lang }: HeaderProps) {
	const t = texts[lang] || texts.uk // fallback to Ukrainian

	return (
		<header className='flex items-center justify-between container mx-auto mt-3'>
			<TitleName lang={lang} />
			<LanguageSwitcher currentLang={lang} />
			<SearchBid lang={lang} />
			<Link
				href={`/${lang || 'uk'}/zayavki`}
				className='text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50'
			>
				{t.catalog}
			</Link>
			<Link
				href={`/${lang || 'uk'}/blog`}
				className='text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50'
			>
				{t.blog}
			</Link>
			<HeaderButtons lang={lang || 'uk'} />
		</header>
	)
}
