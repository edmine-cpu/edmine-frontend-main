'use client'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

const texts = {
	uk: {
		translated: 'Переведено',
	},
	en: {
		translated: 'Translated',
	},
	pl: {
		translated: 'Przetłumaczone',
	},
	fr: {
		translated: 'Traduit',
	},
	de: {
		translated: 'Übersetzt',
	},
} as const

interface MessageTranslationStatusProps {
	isTranslated: boolean
	detectedLanguage?: string
	targetLanguage?: string
	isOwnMessage?: boolean
	lang?: Lang
}

export default function MessageTranslationStatus({
	isTranslated,
	detectedLanguage,
	targetLanguage,
	isOwnMessage = false,
	lang = 'uk',
}: MessageTranslationStatusProps) {
	if (!isTranslated) return null

	const t = texts[lang]

	return (
		<div className='text-xs opacity-70 mt-1 flex items-center space-x-1'>
			<span className='text-green-600'>🌍</span>
			<span className='text-green-600'>
				{t.translated}
				{detectedLanguage && targetLanguage && (
					<span className='ml-1 opacity-60'>
						({detectedLanguage} → {targetLanguage})
					</span>
				)}
			</span>
		</div>
	)
}
