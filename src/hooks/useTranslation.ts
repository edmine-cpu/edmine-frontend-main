'use client'

import { API_ENDPOINTS } from '@/config/api'
import { useCallback, useState } from 'react'

export interface TranslationState {
	isEnabled: boolean
	isLoading: boolean
	targetLanguage: string
	error: string | null
}

export interface TranslatedMessage {
	id: number
	originalContent: string
	translatedContent: string
	isTranslated: boolean
	detectedLanguage?: string
}

export const useTranslation = (chatId: number) => {
	const [state, setState] = useState<TranslationState>({
		isEnabled: false,
		isLoading: false,
		targetLanguage: 'pl',
		error: null,
	})

	const [translatedMessages, setTranslatedMessages] = useState<
		Map<number, TranslatedMessage>
	>(new Map())

	const updateState = useCallback((updates: Partial<TranslationState>) => {
		setState(prev => ({ ...prev, ...updates }))
	}, [])

	const toggleTranslation = useCallback(async () => {
		if (state.isLoading) return

		if (state.isEnabled) {
			// Отключить перевод
			updateState({ isEnabled: false })
			setTranslatedMessages(new Map())
			return
		}

		// Включить перевод
		updateState({ isLoading: true, error: null })

		try {
			const response = await fetch(
				`${API_ENDPOINTS.chats}/${chatId}/messages?translate_to=${state.targetLanguage}`,
				{
					credentials: 'include',
				}
			)

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			const data = await response.json()
			console.log('Translation API response:', data)

			// Создаем карту переведенных сообщений
			const translationMap = new Map<number, TranslatedMessage>()

			if (data.messages && Array.isArray(data.messages)) {
				data.messages.forEach((msg: any) => {
					if (msg.translated_content && msg.is_translated) {
						translationMap.set(msg.id, {
							id: msg.id,
							originalContent: msg.content || '',
							translatedContent: msg.translated_content,
							isTranslated: true,
							detectedLanguage: msg.detected_language,
						})
					}
				})
			}

			setTranslatedMessages(translationMap)
			updateState({
				isEnabled: true,
				isLoading: false,
			})

			console.log(
				`Translation enabled. ${translationMap.size} messages translated.`
			)
		} catch (error) {
			console.error('Translation error:', error)
			updateState({
				isLoading: false,
				error: error instanceof Error ? error.message : 'Translation failed',
			})
		}
	}, [
		chatId,
		state.isEnabled,
		state.isLoading,
		state.targetLanguage,
		updateState,
	])

	const getMessageContent = useCallback(
		(messageId: number, originalContent: string): string => {
			if (!state.isEnabled) return originalContent

			const translated = translatedMessages.get(messageId)
			return translated?.translatedContent || originalContent
		},
		[state.isEnabled, translatedMessages]
	)

	const isMessageTranslated = useCallback(
		(messageId: number): boolean => {
			return state.isEnabled && translatedMessages.has(messageId)
		},
		[state.isEnabled, translatedMessages]
	)

	const setTargetLanguage = useCallback(
		(language: string) => {
			updateState({ targetLanguage: language })
		},
		[updateState]
	)

	return {
		state,
		toggleTranslation,
		getMessageContent,
		isMessageTranslated,
		setTargetLanguage,
		translatedMessages: translatedMessages,
	}
}
