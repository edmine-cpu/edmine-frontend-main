import { Lang } from '@/app/(types)/lang'

/**
 * Формирует правильный URL с учетом языка
 * Английский язык (en) не требует префикса
 * Остальные языки требуют префикс /{lang}
 *
 * @param path - путь без языкового префикса (например: '/zayavki', '/blog')
 * @param lang - текущий язык
 * @returns полный путь с учетом языка
 */
export function getLangPath(path: string, lang: Lang): string {
	// Убираем слеши в начале и конце path для единообразия
	const cleanPath = path.replace(/^\/+|\/+$/g, '')

	// Для английского языка не добавляем префикс
	if (lang === 'en') {
		return `/${cleanPath}`
	}

	// Для остальных языков добавляем префикс
	return `/${lang}/${cleanPath}`
}

/**
 * Получает текущий язык из pathname
 * Если в pathname есть префикс языка (/uk, /pl и т.д.), возвращает его
 * Если нет префикса - возвращает 'en' (английский по умолчанию)
 *
 * @param pathname - текущий pathname
 * @returns текущий язык
 */
export function getLangFromPathname(pathname: string): Lang {
	const match = pathname.match(/^\/(uk|en|pl|fr|de)/)
	return match ? (match[1] as Lang) : 'en'
}

/**
 * Переключает язык в текущем URL
 * Убирает старый префикс языка (если есть) и добавляет новый (если нужно)
 *
 * @param currentPath - текущий pathname
 * @param newLang - новый язык
 * @returns новый путь с учетом нового языка
 */
export function switchLang(currentPath: string, newLang: Lang): string {
	// Убираем префикс языка из текущего пути
	const pathWithoutLang = currentPath.replace(/^\/(uk|en|pl|fr|de)/, '')

	// Формируем новый путь
	return getLangPath(pathWithoutLang || '/', newLang)
}
