/**
 * Хук для автоматического определения языка в Client Components
 */

'use client'

import { usePathname } from 'next/navigation'
import type { Lang } from '@/app/(types)/lang'

const SUPPORTED_LANGS: Lang[] = ['uk', 'en', 'pl', 'fr', 'de']
const DEFAULT_LANG: Lang = 'en'

/**
 * Хук для получения текущего языка из URL
 * Автоматически определяет язык из pathname
 *
 * @returns текущий язык (en, uk, pl, fr, de)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const lang = useLanguage()
 *   return <div>Current language: {lang}</div>
 * }
 * ```
 */
export function useLanguage(): Lang {
	const pathname = usePathname()

	// Извлекаем первый сегмент пути
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
