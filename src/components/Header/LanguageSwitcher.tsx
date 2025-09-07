'use client'

import { Lang } from '@/app/(types)/lang'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const LANG_LABELS: Record<Lang, string> = {
	uk: 'UA',
	en: 'EN',
	pl: 'PL',
	fr: 'FR',
	de: 'DE',
}

interface LanguageSwitcherProps {
	currentLang: Lang
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
	const router = useRouter()
	const [open, setOpen] = useState(false)

	const handleLanguageChange = (newLang: Lang) => {
		const currentPath = window.location.pathname
		const pathWithoutLang = currentPath.replace(/^\/(uk|en|pl|fr|de)/, '')
		const newPath = `/${newLang}${pathWithoutLang}`
		window.location.href = newPath
	}

	return (
		<div className='relative inline-block text-left'>
			<button
				onClick={() => setOpen(!open)}
				className='px-3 py-2 text-sm font-semibold rounded border border-gray-300 bg-white hover:bg-gray-50 transition w-12 h-12 flex items-center justify-center'
			>
				{LANG_LABELS[currentLang]}
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
								currentLang === langKey
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
