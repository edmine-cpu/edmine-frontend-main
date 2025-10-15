import { API_ENDPOINTS } from '@/config/api'
import { cookies } from 'next/headers'

// Этот интерфейс нужно будет дополнить, если в User есть другие поля
export interface User {
	id: number
	email: string
	name: string
	nickname?: string
	avatar?: string
	user_role?: string
	profile_description?: string
	city?: string
	country?: {
		id: number
		name: string
	}
	categories: Array<{ id: number; name: string }>
	subcategories: Array<{ id: number; name_en: string }>
}

export async function getCurrentUser(): Promise<User | null> {
	const cookieStore = await cookies()
	// ПРОВЕРЬ ИМЯ COOKIE: Я предполагаю, что cookie называется 'jwt_token'.
	// Если у тебя она называется по-другому, замени 'jwt_token' на правильное имя.
	const sessionToken = cookieStore.get('jwt_token')

	if (!sessionToken?.value) {
		return null
	}

	try {
		const response = await fetch(API_ENDPOINTS.meApi, {
			headers: {
				// Передаем cookie вручную, т.к. fetch на сервере не делает это автоматически
				Cookie: `${sessionToken.name}=${sessionToken.value}`,
			},
			// Не кэшируем данные пользователя, чтобы они всегда были актуальными
			cache: 'no-store',
		})

		if (response.ok) {
			return await response.json()
		}
		return null
	} catch (error) {
		console.error('Failed to fetch current user:', error)
		return null
	}
}
