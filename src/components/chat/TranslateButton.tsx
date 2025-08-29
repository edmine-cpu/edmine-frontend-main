'use client'

import { API_ENDPOINTS } from '@/config/api'
import { useState } from 'react'

interface TranslateButtonProps {
	messageId: string
	originalText: string
	targetLang: string
	chatId: number
	senderId: number
	currentUserId: number
	onTranslate: (translatedText: string) => void
}

const LANGUAGE_NAMES = {
	uk: 'українською',
	en: 'English',
	pl: 'Polski',
	fr: 'Français',
	de: 'Deutsch',
}

// Функция перевода через серверный API
const translateMessage = async (
	chatId: number,
	targetLang: string
): Promise<any> => {
	try {
		const formData = new FormData()
		formData.append('target_language', targetLang)

		const response = await fetch(`${API_ENDPOINTS.chats}/${chatId}/translate`, {
			method: 'POST',
			credentials: 'include',
			body: formData,
		})

		if (response.ok) {
			return await response.json()
		} else {
			throw new Error(`Translation failed: ${response.status}`)
		}
	} catch (error) {
		console.error('Server translation failed:', error)
		throw error
	}
}

export default function TranslateButton({
	messageId,
	originalText,
	targetLang,
	chatId,
	senderId,
	currentUserId,
	onTranslate,
}: TranslateButtonProps) {
	const [isTranslating, setIsTranslating] = useState(false)
	const [isTranslated, setIsTranslated] = useState(false)

	// Показывать кнопку перевода только для сообщений собеседника
	if (senderId === currentUserId) {
		return null
	}

	const handleTranslate = async () => {
		if (isTranslated) {
			// Показать оригинал
			onTranslate(originalText)
			setIsTranslated(false)
		} else {
			// Перевести через серверный API
			setIsTranslating(true)
			try {
				const translationResult = await translateMessage(chatId, targetLang)

				// Найти переведенное сообщение по ID
				const translatedMessage = translationResult.translated_messages?.find(
					(msg: any) => msg.id.toString() === messageId
				)

				if (translatedMessage && translatedMessage.translated_content) {
					onTranslate(translatedMessage.translated_content)
					setIsTranslated(true)
				} else {
					console.warn('Translation not found for message:', messageId)
					onTranslate(originalText)
				}
			} catch (error) {
				console.error('Translation failed:', error)
				// Fallback к оригинальному тексту при ошибке
				onTranslate(originalText)
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
