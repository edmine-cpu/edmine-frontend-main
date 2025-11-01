'use client'

import { API_ENDPOINTS } from '@/config/api'
import { getLangPath } from '@/utils/linkHelper'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

const CONTACT_TRANSLATIONS = {
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
		pl: 'Zaloguj się, aby czатować',
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

function getInitials(name: string): string {
	const words = name.trim().split(/\s+/)
	let initials = ''
	for (let i = 0; i < words.length; i++) {
		if (words[i].length > 0) {
			initials += words[i][0].toUpperCase()
		}
	}
	return initials
}

interface ContactButtonProps {
	lang: Lang
	name: string
	id: number
}

export function BidAuthorContact({ lang, name, id }: ContactButtonProps) {
	const router = useRouter()
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
		const t = CONTACT_TRANSLATIONS

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
				router.push(getLangPath(`/chat/${data.chat_id}`, lang))
			} else {
				const errorData = await response.json()
				console.error('Failed to create chat:', response.status, errorData)

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
				<div className='h-16 w-16 rounded-full bg-green-300 border-1 text-center flex justify-center items-center text-white font-bold text-lg'>
					{getInitials(name)}
				</div>
			</div>
			<div className='flex flex-col pl-3 pr-6'>
				<h2 className='font-medium text-lg text-gray-900'>{name}</h2>
				<div className='mt-2'>
					{isAuthenticated ? (
						<button
							onClick={handleCreateChat}
							className='flex justify-center items-center mr-auto bg-gray-100 rounded-md pr-3 pl-3 py-2 hover:bg-gray-200 transition durations-200'
						>
							<span className='text-2xl mr-1'>✉ </span>
							{CONTACT_TRANSLATIONS.message[lang]}
						</button>
					) : (
						<button
							onClick={() => router.push(getLangPath('/login', lang))}
							className='flex justify-center items-center mr-auto bg-red-100 rounded-md pr-3 pl-3 py-2 hover:bg-red-200 transition durations-200'
						>
							<span className='text-2xl mr-1'>🔐 </span>
							{CONTACT_TRANSLATIONS.loginToChat[lang]}
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
