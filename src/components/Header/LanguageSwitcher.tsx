'use client'

import { Lang } from '@/app/(types)/lang'
import { switchLang, getLangFromPathname } from '@/utils/linkHelper'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const LANG_LABELS: Record<Lang, string> = {
	uk: 'UA',
	en: 'EN',
	pl: 'PL',
	fr: 'FR',
	de: 'DE',
}

interface LanguageSwitcherProps {
	currentLang?: Lang
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	// Определяем текущий язык из URL, а не из пропса
	const actualLang = getLangFromPathname(pathname)

	const handleLanguageChange = (newLang: Lang) => {
		const currentPath = window.location.pathname
		const newPath = switchLang(currentPath, newLang)
		window.location.href = newPath
	}

	return (
		<div className='relative inline-block text-left'>
			<button
				onClick={() => setOpen(!open)}
				className='flex justify-center items-center mx-auto text-center px-2 py-2 text-sm font-semibold rounded border border-gray-300 bg-white hover:bg-gray-50 transition sm:w-11.5 sm:h-11.5 w-10 h-10 '
			>
				{LANG_LABELS[actualLang]}
			</button>

			{open && (
				<div className='absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 border-black min-w-max flex flex-col'>
					{Object.entries(LANG_LABELS).map(([langKey, label]) => (
						<button
							key={langKey}
							onClick={() => {
								handleLanguageChange(langKey as Lang)
								setOpen(false)
							}}
							className={`inline-block text-center px-3 py-2 text-md transition-colors rounded ${
								actualLang === langKey
									? 'bg-red-600 text-white'
									: 'text-gray-700 hover:bg-red-50 hover:text-red-600'
							}`}
						>
							{label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
