'use client'

import { Lang } from '@/app/(types)/lang'
import { HeaderButtons } from '@/components/Header/Desktop/Buttons'
import { SearchBid } from '@/components/Header/Desktop/SearchBid'
import { TitleName } from '@/components/Header/Desktop/TitleName'
import { LanguageSwitcher } from '@/components/Header/LanguageSwitcher'
import { getLangPath } from '@/utils/linkHelper'
import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps {
	lang: Lang
	initialAuth: boolean
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

export function TabletHeader({ lang, initialAuth }: HeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const t = texts[lang] || texts.uk // fallback to Ukrainian

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return (
		<header className='flex items-center justify-between w-full max-w-7xl mx-auto mt-3 px-4'>
			{/* Logo */}
			<div className='flex-shrink-0'>
				<TitleName lang={lang} />
			</div>

			{/* Center section */}
			<div className='flex items-center space-x-4 flex-1 justify-center'>
				<LanguageSwitcher currentLang={lang} />
				<SearchBid lang={lang} />
				<Link
					href={getLangPath('/zayavki', lang)}
					className='text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50'
				>
					{t.catalog}
				</Link>
			</div>

			{/* Right section */}
			<div className='flex items-center space-x-1 md:space-x-2 flex-shrink-0'>
				{/* Add Task Button */}

				{/* Auth Buttons */}
				<HeaderButtons lang={lang || 'en'} initialAuth={initialAuth} />
			</div>

			{/* Overlay to close menu when clicking outside */}
			{isMenuOpen && (
				<div
					className='fixed inset-0 z-40'
					onClick={() => setIsMenuOpen(false)}
				/>
			)}
		</header>
	)
}
