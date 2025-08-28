'use client'

import { useState } from 'react'

interface TranslateButtonProps {
	messageId: string
	originalText: string
	targetLang: string
	onTranslate: (translatedText: string) => void
}

const LANGUAGE_NAMES = {
	uk: 'українською',
	en: 'English',
	pl: 'Polski',
	fr: 'Français',
	de: 'Deutsch',
}

// Простая функция перевода с fallback
const translateText = async (
	text: string,
	targetLang: string
): Promise<string> => {
	// Сначала пробуем Google Translate API (через cors proxy)
	try {
		const response = await fetch(
			`https://api.allorigins.win/get?url=${encodeURIComponent(
				`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
					text
				)}`
			)}`
		)

		if (response.ok) {
			const data = await response.json()
			const contents = JSON.parse(data.contents)
			if (contents && contents[0] && contents[0][0] && contents[0][0][0]) {
				return contents[0][0][0]
			}
		}
	} catch (error) {
		console.log('Google Translate failed, trying LibreTranslate:', error)
	}

	// Fallback: пробуем LibreTranslate
	try {
		const response = await fetch('https://libretranslate.de/translate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				q: text,
				source: 'auto',
				target: targetLang === 'uk' ? 'uk' : targetLang,
			}),
		})

		if (response.ok) {
			const data = await response.json()
			return data.translatedText
		}
	} catch (error) {
		console.log('LibreTranslate failed:', error)
	}

	// Последний fallback: простой мок-перевод
	const mockTranslations: Record<string, Record<string, string>> = {
		uk: {
			Hello: 'Привіт',
			'How are you?': 'Як справи?',
			'Thank you': 'Дякую',
			'Good morning': 'Доброго ранку',
			'Good night': 'На добраніч',
		},
		en: {
			Привіт: 'Hello',
			'Як справи?': 'How are you?',
			Дякую: 'Thank you',
			'Доброго ранку': 'Good morning',
			'На добраніч': 'Good night',
		},
	}

	const translations = mockTranslations[targetLang]
	if (translations && translations[text]) {
		return translations[text]
	}

	return `[${targetLang.toUpperCase()}] ${text}`
}

export default function TranslateButton({
	messageId,
	originalText,
	targetLang,
	onTranslate,
}: TranslateButtonProps) {
	const [isTranslating, setIsTranslating] = useState(false)
	const [isTranslated, setIsTranslated] = useState(false)

	const handleTranslate = async () => {
		if (isTranslated) {
			// Показать оригинал
			onTranslate(originalText)
			setIsTranslated(false)
		} else {
			// Перевести
			setIsTranslating(true)
			try {
				const translated = await translateText(originalText, targetLang)
				onTranslate(translated)
				setIsTranslated(true)
			} catch (error) {
				console.error('Translation failed:', error)
			} finally {
				setIsTranslating(false)
			}
		}
	}

	return (
		<button
			onClick={handleTranslate}
			disabled={isTranslating}
			className='text-xs opacity-60 hover:opacity-100 transition-opacity flex items-center space-x-1 mt-1'
		>
			{isTranslating ? (
				<>
					<div className='w-3 h-3 border border-current border-t-transparent rounded-full animate-spin'></div>
					<span>Перекладається...</span>
				</>
			) : isTranslated ? (
				<>
					<svg
						className='w-3 h-3'
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
					<span>Показати оригінал</span>
				</>
			) : (
				<>
					<svg
						className='w-3 h-3'
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
					<span>
						Перекласти{' '}
						{LANGUAGE_NAMES[targetLang as keyof typeof LANGUAGE_NAMES] ||
							targetLang}
					</span>
				</>
			)}
		</button>
	)
}
