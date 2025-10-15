'use client'

import { TabLink } from '@/components/headersOLD/Buttons'
import { getLangPath } from '@/utils/linkHelper'
import { useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

const texts = {
	uk: {
		profile: 'Профіль',
		chats: 'Чати',
		logout: 'Вийти',
		settings: 'Налаштування',
	},
	en: {
		profile: 'Profile',
		chats: 'Chats',
		logout: 'Logout',
		settings: 'Settings',
	},
	pl: {
		profile: 'Profil',
		chats: 'Czaty',
		logout: 'Wyloguj się',
		settings: 'Ustawienia',
	},
	fr: {
		profile: 'Profil',
		chats: 'Chats',
		logout: 'Déconnexion',
		settings: 'Paramètres',
	},
	de: {
		profile: 'Profil',
		chats: 'Chats',
		logout: 'Abmelden',
		settings: 'Einstellungen',
	},
} as const

interface BurgerListProps {
	lang: Lang
}

export function BurgerList({ lang }: BurgerListProps) {
	const [isOpen, setIsOpen] = useState(false)
	const t = texts[lang]

	function toggleDropdown() {
		setIsOpen(prev => !prev)
	}

	return (
		<>
			<div
				className='space-y-1 p-2 ml-3 cursor-pointer inline-block'
				onClick={toggleDropdown}
				style={{ lineHeight: 0 }}
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
				role='button'
				tabIndex={0}
				onKeyDown={e => {
					if (e.key === 'Enter' || e.key === ' ') {
						toggleDropdown()
					}
				}}
			>
				<div className='w-1.5 h-1.5 bg-gray-700 rounded-full'></div>
				<div className='w-1.5 h-1.5 bg-gray-700 rounded-full'></div>
				<div className='w-1.5 h-1.5 bg-gray-700 rounded-full'></div>
			</div>

			{isOpen && (
				<div className='border border-black absolute bg-white shadow-md rounded-lg top-16 right-58 z-50 w-40'>
					<span
						className='block text-xl font-bold px-3 cursor-pointer select-none text-right'
						onClick={toggleDropdown}
						aria-label='Close menu'
					>
						×
					</span>
					<div className='flex flex-col items-center justify-center space-y-2 p-2'>
						<TabLink
							href={getLangPath(`/${lang || 'en'}/profile`, 'en')}
							name={t.profile}
							mobile
						/>
						<TabLink
							href={getLangPath(`/${lang || 'en'}/chats`, 'en')}
							name={t.chats}
							mobile
						/>
						<TabLink
							href={getLangPath(`/${lang || 'en'}/logout`, 'en')}
							name={t.logout}
							mobile
						/>
						<TabLink
							href={getLangPath(`/${lang || 'en'}/profile/settings`, 'en')}
							name={t.settings}
							mobile
						/>
					</div>
				</div>
			)}
		</>
	)
}
