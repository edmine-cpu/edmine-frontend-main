/**
 * Утилиты для автоматического определения языка из URL
 * Работает как на сервере (SSR), так и на клиенте
 */

import { headers } from 'next/headers'
import type { Lang } from '@/app/(types)/lang'

export const SUPPORTED_LANGS: Lang[] = ['uk', 'en', 'pl', 'fr', 'de']
export const DEFAULT_LANG: Lang = 'en'

/**
 * Определяет язык из pathname для Server Components
 * Используется в page.tsx файлах
 */
export function detectLanguageFromPathname(pathname: string): Lang {
	// Убираем начальный слеш и разбиваем на сегменты
	const segments = pathname.split('/').filter(Boolean)

	if (segments.length === 0) {
		return DEFAULT_LANG
	}

	const firstSegment = segments[0]

	// Проверяем, является ли первый сегмент языковым префиксом
	if (SUPPORTED_LANGS.includes(firstSegment as Lang)) {
		return firstSegment as Lang
	}

	// Если префикса нет - английский по умолчанию
	return DEFAULT_LANG
}

/**
 * Получает язык из headers (установленных middleware)
 * Используется в Server Components
 */
export async function getLanguageFromHeaders(): Promise<Lang> {
	try {
		const headersList = await headers()
		const locale = headersList.get('x-locale')

		if (locale && SUPPORTED_LANGS.includes(locale as Lang)) {
			return locale as Lang
		}
	} catch (error) {
		// Если headers недоступны, возвращаем дефолтный язык
		console.error('Error reading headers:', error)
	}

	return DEFAULT_LANG
}

/**
 * Удаляет языковой префикс из pathname
 * Полезно для построения канонических URL
 */
export function removeLanguagePrefix(pathname: string): string {
	const segments = pathname.split('/').filter(Boolean)

	if (segments.length === 0) {
		return '/'
	}

	const firstSegment = segments[0]

	if (SUPPORTED_LANGS.includes(firstSegment as Lang)) {
		// Убираем языковой префикс
		return '/' + segments.slice(1).join('/')
	}

	return pathname
}

/**
 * Добавляет языковой префикс к pathname
 * Если язык английский - не добавляет префикс
 */
export function addLanguagePrefix(pathname: string, lang: Lang): string {
	// Для английского не добавляем префикс
	if (lang === 'en') {
		return pathname
	}

	// Убираем существующий префикс если есть
	const cleanPath = removeLanguagePrefix(pathname)

	// Добавляем новый префикс
	return `/${lang}${cleanPath}`
}

/**
 * Проверяет, содержит ли pathname языковой префикс
 */
export function hasLanguagePrefix(pathname: string): boolean {
	const segments = pathname.split('/').filter(Boolean)

	if (segments.length === 0) {
		return false
	}

	return SUPPORTED_LANGS.includes(segments[0] as Lang)
}
