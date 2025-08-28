'use client'

import { Lang } from '@/app/(types)/lang'
import { API_ENDPOINTS } from '@/config/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface OwnerPropsData {
	lang: Lang
	name: string
	country: string
	city: string
	id: number
}

function get_initials(name: string): string {
	const words = name.trim().split(/\s+/)
	let initials = ''

	for (let i = 0; i < words.length; i++) {
		if (words[i].length > 0) {
			initials += words[i][0].toUpperCase()
		}
	}

	return initials
}

export const TRANSLATIONS = {
	reviews: {
		uk: 'Відгуки',
		en: 'Reviews',
		pl: 'Opinie',
		fr: 'Avis',
		de: 'Bewertungen',
	},
	message: {
		uk: 'Написати',
		en: 'Write',
		pl: 'Napisz',
		fr: 'Écrire',
		de: 'Schreiben',
	},
	loginToChat: {
		uk: 'Увійти для спілкування',
		en: 'Login to chat',
		pl: 'Zaloguj się, aby czatować',
		fr: 'Se connecter pour discuter',
		de: 'Anmelden zum Chatten',
	},
	cannotChatWithSelf: {
		uk: 'Неможливо створити чат з самим собою',
		en: 'Cannot create chat with yourself',
		pl: 'Nie można utworzyć czatu z samym sobą',
		fr: 'Impossible de créer un chat avec soi-même',
		de: 'Chat mit sich selbst nicht möglich',
	},
	chatError: {
		uk: 'Помилка створення чату. Спробуйте пізніше.',
		en: 'Chat creation error. Try again later.',
		pl: 'Błąd tworzenia czatu. Spróbuj ponownie później.',
		fr: 'Erreur de création de chat. Réessayez plus tard.',
		de: 'Chat-Erstellungsfehler. Versuchen Sie es später erneut.',
	},
	networkError: {
		uk: 'Помилка мережі. Перевірте підключення.',
		en: 'Network error. Check your connection.',
		pl: 'Błąd sieci. Sprawdź połączenie.',
		fr: 'Erreur réseau. Vérifiez votre connexion.',
		de: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.',
	},
}

export function OwnerData({ lang, name, country, city, id }: OwnerPropsData) {
	const router = useRouter()
	const [currentUserId, setCurrentUserId] = useState<number | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	useEffect(() => {
		// Получаем информацию о текущем пользователе
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
		const t = TRANSLATIONS as any

		// Проверяем, не пытается ли пользователь создать чат с самим собой
		if (currentUserId === id) {
			alert(t.cannotChatWithSelf[lang])
			return
		}

		try {
			const formData = new FormData()
			formData.append('partner_id', id.toString())

			const response = await fetch(API_ENDPOINTS.createChat, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})

			if (response.ok) {
				const data = await response.json()
				router.push(`/${lang}/chat/${data.chat_id}`)
			} else {
				const errorData = await response.json()
				console.error(
					'Failed to create chat:',
					response.status,
					errorData.detail || errorData
				)

				// Показываем пользователю понятное сообщение на его языке
				if (
					response.status === 400 &&
					errorData.detail?.includes('с самим собой')
				) {
					alert(t.cannotChatWithSelf[lang])
				} else {
					alert(t.chatError[lang])
				}
			}
		} catch (error) {
			console.error('Error creating chat:', error)
			alert(t.networkError[lang])
		}
	}

	return (
		<div className='w-auto flex'>
			<div>
				<div className='h-28 w-28 rounded-full bg-green-300 border-1 text-center flex justify-center items-center text-white font-bold text-3xl'>
					{get_initials(name)}
				</div>
			</div>
			<div className='flex flex-col pl-3 pr-6'>
				<h1 className='justify-end font-bold text-xl'>{name}</h1>
				<div>
					{country}, {city}
				</div>
				<div className='flex items-center space-x-2'>
					{/* Звёзды */}
					<div className='flex text-yellow-400'>
						<span>★</span>
						<span>★</span>
						<span>★</span>
						<span>★</span>
						<span>★</span>
					</div>

					{/* Кол-во отзывов */}
					<span className='text-gray-600 text-sm'>
						(120 {TRANSLATIONS.reviews[lang]})
					</span>
				</div>
				{isAuthenticated ? (
					<button
						onClick={handleCreateChat}
						className='flex justify-center items-center mr-auto bg-gray-100 rounded-md pr-3 pl-3 hover:bg-gray-200 transition durations-200'
					>
						<span className='text-3xl'>✉ </span>
						{TRANSLATIONS.message[lang]}
					</button>
				) : (
					<button
						onClick={() => router.push(`/${lang}/login`)}
						className='flex justify-center items-center mr-auto bg-red-100 rounded-md pr-3 pl-3 hover:bg-red-200 transition durations-200'
					>
						<span className='text-3xl'>🔐 </span>
						{TRANSLATIONS.loginToChat[lang]}
					</button>
				)}
			</div>
		</div>
	)
}
