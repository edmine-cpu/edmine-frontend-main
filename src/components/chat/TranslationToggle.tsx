'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

const texts = {
	uk: {
		translating: 'Перекладається...',
		showOriginal: 'Показати оригінал',
		translate: 'Перекласти',
	},
	en: {
		translating: 'Translating...',
		showOriginal: 'Show Original',
		translate: 'Translate',
	},
	pl: {
		translating: 'Tłumaczenie...',
		showOriginal: 'Pokaż oryginał',
		translate: 'Przetłumacz',
	},
	fr: {
		translating: 'Traduction...',
		showOriginal: "Afficher l'original",
		translate: 'Traduire',
	},
	de: {
		translating: 'Übersetzung...',
		showOriginal: 'Original anzeigen',
		translate: 'Übersetzen',
	},
} as const

interface TranslationToggleProps {
	isEnabled: boolean
	isLoading: boolean
	onToggle: () => void
	onLanguageChange: (lang: string) => void
	error?: string | null
	lang?: Lang
}

const SUPPORTED_LANGUAGES = {
	uk: 'Українська',
	en: 'English',
	pl: 'Polski',
	fr: 'Français',
	de: 'Deutsch',
} as const

export default function TranslationToggle({
	isEnabled,
	isLoading,
	onToggle,
	onLanguageChange,
	error,
	lang = 'uk',
}: TranslationToggleProps) {
	const params = useParams()
	const urlLang = params.lang as string
	const t = texts[lang]

	// Автоматически устанавливаем язык из URL при загрузке
	useEffect(() => {
		if (urlLang && urlLang in SUPPORTED_LANGUAGES) {
			onLanguageChange(urlLang)
		}
	}, [urlLang, onLanguageChange])

	return (
		<div className='flex items-center space-x-2'>
			<button
				onClick={onToggle}
				disabled={isLoading}
				className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
					isEnabled
						? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
				} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
				title={error || undefined}
			>
				{isLoading ? (
					<>
						<div className='w-4 h-4 border border-current border-t-transparent rounded-full animate-spin'></div>
						<span>{t.translating}</span>
					</>
				) : isEnabled ? (
					<>
						<svg
							className='w-4 h-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
							/>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
							/>
						</svg>
						<span>{t.showOriginal}</span>
					</>
				) : (
					<>
						<svg
							className='w-4 h-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
							/>
						</svg>
						<span>{t.translate}</span>
					</>
				)}
			</button>

			{error && (
				<div className='text-xs text-red-500 max-w-xs truncate' title={error}>
					⚠️ {error}
				</div>
			)}
		</div>
	)
}
