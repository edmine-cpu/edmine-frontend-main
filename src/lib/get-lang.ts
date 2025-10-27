import { headers } from 'next/headers'
import type { Lang } from './i18n-routes'

/**
 * Получить текущий язык из заголовков (Server Component)
 * Используется в серверных компонентах для определения языка
 * который был установлен middleware на основе URL
 */
export async function getLang(): Promise<Lang> {
	const headersList = await headers()
	const lang = headersList.get('x-current-lang')

	// Если язык установлен middleware, возвращаем его
	if (lang && ['uk', 'en', 'pl', 'fr', 'de'].includes(lang)) {
		return lang as Lang
	}

	// По умолчанию английский
	return 'en'
}
