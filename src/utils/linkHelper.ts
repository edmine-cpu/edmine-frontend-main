import { Lang } from '@/app/(types)/lang'
import {
	COMPANY_ROUTES,
	REQUEST_ROUTES,
	getLangByCompanyRoute,
	getLangByRequestRoute,
} from '@/lib/i18n-routes'

/**
 * Формирует правильный URL с учетом языка
 * Для компаний и заявок используются многоязычные URL без префикса
 * Для остальных страниц: английский язык (en) не требует префикса,
 * остальные языки требуют префикс /{lang}
 *
 * @param path - путь без языкового префикса (например: '/requests', '/blog')
 * @param lang - текущий язык
 * @returns полный путь с учетом языка
 */
export function getLangPath(path: string, lang: Lang): string {
	// Убираем слеши в начале и конце path для единообразия
	const cleanPath = path.replace(/^\/+|\/+$/g, '')

	// Разделяем путь на сегменты
	const segments = cleanPath.split('/')
	const firstSegment = segments[0]

	// Если это страница компаний, используем локализованный URL
	if (firstSegment === 'companies') {
		const localizedRoute = COMPANY_ROUTES[lang]
		segments[0] = localizedRoute
		return `/${segments.join('/')}`
	}

	// Если это страница заявок, используем локализованный URL
	if (firstSegment === 'requests') {
		const localizedRoute = REQUEST_ROUTES[lang]
		segments[0] = localizedRoute
		return `/${segments.join('/')}`
	}

	// Для остальных страниц: английский без префикса
	if (lang === 'en') {
		return `/${cleanPath}`
	}

	// Для остальных языков добавляем префикс
	return `/${lang}/${cleanPath}`
}

/**
 * Получает текущий язык из pathname
 * Учитывает многоязычные маршруты для компаний и заявок
 * Если в pathname есть префикс языка (/uk, /pl и т.д.), возвращает его
 * Если нет префикса - возвращает 'en' (английский по умолчанию)
 *
 * @param pathname - текущий pathname
 * @returns текущий язык
 */
export function getLangFromPathname(pathname: string): Lang {
	const segments = pathname.split('/').filter(Boolean)
	if (segments.length === 0) return 'en'

	const firstSegment = segments[0]

	// Проверяем, является ли первый сегмент маршрутом компаний
	const companyLang = getLangByCompanyRoute(firstSegment)
	if (companyLang) return companyLang

	// Проверяем, является ли первый сегмент маршрутом заявок
	const requestLang = getLangByRequestRoute(firstSegment)
	if (requestLang) return requestLang

	// Проверяем традиционные языковые префиксы
	const match = pathname.match(/^\/(uk|en|pl|fr|de)/)
	return match ? (match[1] as Lang) : 'en'
}

/**
 * Переключает язык в текущем URL
 * Убирает старый префикс языка (если есть) и добавляет новый (если нужно)
 * Корректно обрабатывает многоязычные маршруты для компаний и заявок
 *
 * @param currentPath - текущий pathname
 * @param newLang - новый язык
 * @returns новый путь с учетом нового языка
 */
export function switchLang(currentPath: string, newLang: Lang): string {
	const segments = currentPath.split('/').filter(Boolean)
	if (segments.length === 0) return getLangPath('/', newLang)

	const firstSegment = segments[0]

	// Если это маршрут компаний
	const companyLang = getLangByCompanyRoute(firstSegment)
	if (companyLang) {
		// Меняем первый сегмент на локализованную версию
		segments[0] = COMPANY_ROUTES[newLang]
		return `/${segments.join('/')}`
	}

	// Если это маршрут заявок
	const requestLang = getLangByRequestRoute(firstSegment)
	if (requestLang) {
		// Меняем первый сегмент на локализованную версию
		segments[0] = REQUEST_ROUTES[newLang]
		return `/${segments.join('/')}`
	}

	// Для остальных страниц: убираем префикс языка из текущего пути
	const pathWithoutLang = currentPath.replace(/^\/(uk|en|pl|fr|de)/, '')

	// Формируем новый путь
	return getLangPath(pathWithoutLang || '/', newLang)
}
