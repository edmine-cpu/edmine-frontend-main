import { headers } from 'next/headers'

/**
 * Серверная функция для получения статуса аутентификации из middleware headers
 * Используется в Server Components для получения начального состояния auth
 */
export async function getServerAuthStatus(): Promise<boolean> {
	try {
		const headersList = await headers()
		const authHeader = headersList.get('x-user-authenticated')
		return authHeader === 'true'
	} catch (error) {
		console.error('Error getting server auth status:', error)
		return false
	}
}
