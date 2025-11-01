'use client'

import { API_ENDPOINTS } from '@/config/api'
import { getLangPath } from '@/utils/linkHelper'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

const T = {
	uk: {
		message: 'Написати',
		loginToChat: 'Увійти для спілкування',
		cannotChatWithSelf: 'Неможливо створити чат з самим собою',
		chatError: 'Помилка створення чату. Спробуйте пізніше.',
		networkError: 'Помилка мережі. Перевірте підключення.',
	},
	en: {
		message: 'Write',
		loginToChat: 'Login to chat',
		cannotChatWithSelf: 'Cannot create chat with yourself',
		chatError: 'Chat creation error. Try again later.',
		networkError: 'Network error. Check your connection.',
	},
	pl: {
		message: 'Napisz',
		loginToChat: 'Zaloguj się, aby czатować',
		cannotChatWithSelf: 'Nie można utworzyć czatu z samym sobą',
		chatError: 'Błąd tworzenia czatu. Spróbuj ponownie później.',
		networkError: 'Błąd sieci. Sprawdź połączenie.',
	},
	fr: {
		message: 'Écrire',
		loginToChat: 'Se connecter pour discuter',
		cannotChatWithSelf: 'Impossible de créer un chat avec soi-même',
		chatError: 'Erreur de création de chat. Réessayez plus tard.',
		networkError: 'Erreur réseau. Vérifiez votre connexion.',
	},
	de: {
		message: 'Schreiben',
		loginToChat: 'Anmelden zum Chatten',
		cannotChatWithSelf: 'Chat mit sich selbst nicht möglich',
		chatError: 'Chat-Erstellungsfehler. Versuchen Sie es später erneut.',
		networkError: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.',
	},
} as const

interface ContactButtonProps {
	ownerId: number
	lang: Lang
}

export function ContactButton({ ownerId, lang }: ContactButtonProps) {
	const router = useRouter()
	const t = T[lang]
	const [currentUserId, setCurrentUserId] = useState<number | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const response = await fetch(API_ENDPOINTS.meApi, {
					credentials: 'include',
				})
				if (response.ok) {
					const userData = await response.json()
					setCurrentUserId(userData.id)
					setIsAuthenticated(true)
				} else {
					setIsAuthenticated(false)
				}
			} catch (error) {
				console.error('Error fetching current user:', error)
				setIsAuthenticated(false)
			}
		}
		fetchCurrentUser()
	}, [])

	const handleCreateChat = async () => {
		// Check if user is trying to chat with themselves
		if (currentUserId === ownerId) {
			alert(t.cannotChatWithSelf)
			return
		}

		try {
			const formData = new FormData()
			formData.append('partner_id', ownerId.toString())

			const response = await fetch(API_ENDPOINTS.createChat, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})

			if (response.ok) {
				const data = await response.json()
				router.push(getLangPath(`/chat/${data.chat_id}`, lang))
			} else {
				const errorData = await response.json()
				console.error('Failed to create chat:', response.status, errorData)

				if (
					response.status === 400 &&
					errorData.detail?.includes('с самим собой')
				) {
					alert(t.cannotChatWithSelf)
				} else {
					alert(t.chatError)
				}
			}
		} catch (error) {
			console.error('Error creating chat:', error)
			alert(t.networkError)
		}
	}

	if (isAuthenticated) {
		return (
			<button
				onClick={handleCreateChat}
				className='flex justify-center items-center mr-auto bg-gray-100 rounded-md pr-3 pl-3 hover:bg-gray-200 transition durations-200'
			>
				<span className='text-3xl'>✉ </span>
				{t.message}
			</button>
		)
	}

	return (
		<button
			onClick={() => router.push(getLangPath('/login', lang))}
			className='flex justify-center items-center mr-auto bg-red-100 rounded-md pr-3 pl-3 hover:bg-red-200 transition durations-200'
		>
			<span className='text-3xl'>🔐 </span>
			{t.loginToChat}
		</button>
	)
}
