/**
 * Конфигурация многоязычных маршрутов для SEO-оптимизации
 * Маршруты для страниц компаний и заявок на всех поддерживаемых языках
 */

export type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

export const SUPPORTED_LANGS: Lang[] = ['uk', 'en', 'pl', 'fr', 'de']

/**
 * Переводы слова "компании" на всех языках
 */
export const COMPANY_ROUTES: Record<Lang, string> = {
	uk: 'kompanii',
	en: 'companies',
	pl: 'firmy',
	fr: 'entreprises',
	de: 'unternehmen',
}

/**
 * Переводы слова "заявки" на всех языках
 */
export const REQUEST_ROUTES: Record<Lang, string> = {
	uk: 'zayavki',
	en: 'requests',
	pl: 'zlecenia',
	fr: 'demandes',
	de: 'auftrage',
}

/**
 * Получить локализованный путь для детальной страницы компании
 * @param slug - slug компании
 * @param lang - язык
 * @returns полный путь к детальной странице компании
 * Пример: getCompanyDetailPath('test-company-123', 'uk') => '/kompanii/test-company-123'
 */
export function getCompanyDetailPath(slug: string, lang: Lang): string {
	return `/${COMPANY_ROUTES[lang]}/${slug}`
}

/**
 * Получить локализованный путь для детальной страницы заявки
 * @param slug - slug заявки
 * @param lang - язык
 * @returns полный путь к детальной странице заявки
 * Пример: getRequestDetailPath('test-request-123', 'uk') => '/zayavki/test-request-123'
 */
export function getRequestDetailPath(slug: string, lang: Lang): string {
	return `/${REQUEST_ROUTES[lang]}/${slug}`
}

/**
 * Получить язык по пути компаний
 * @param path - путь без слеша (например, "kompanii")
 * @returns язык или null если путь не распознан
 */
export function getLangByCompanyRoute(path: string): Lang | null {
	for (const [lang, route] of Object.entries(COMPANY_ROUTES)) {
		if (route === path) {
			return lang as Lang
		}
	}
	return null
}

/**
 * Получить язык по пути заявок
 * @param path - путь без слеша (например, "zayavki")
 * @returns язык или null если путь не распознан
 */
export function getLangByRequestRoute(path: string): Lang | null {
	for (const [lang, route] of Object.entries(REQUEST_ROUTES)) {
		if (route === path) {
			return lang as Lang
		}
	}
	return null
}

/**
 * Проверить, является ли путь маршрутом компаний
 */
export function isCompanyRoute(path: string): boolean {
	return Object.values(COMPANY_ROUTES).includes(path)
}

/**
 * Проверить, является ли путь маршрутом заявок
 */
export function isRequestRoute(path: string): boolean {
	return Object.values(REQUEST_ROUTES).includes(path)
}

/**
 * Получить внутренний путь для rewrite
 * @param pathname - исходный путь
 * @returns объект с rewritePath и lang или null
 */
export function getInternalRoute(pathname: string): {
	rewritePath: string
	lang: Lang
} | null {
	const segments = pathname.split('/').filter(Boolean)
	if (segments.length === 0) return null

	const firstSegment = segments[0]

	// Проверяем маршруты компаний
	const companyLang = getLangByCompanyRoute(firstSegment)
	if (companyLang) {
		// Перенаправляем на /companies с остальными сегментами
		const restPath = segments.slice(1).join('/')
		return {
			rewritePath: `/companies${restPath ? `/${restPath}` : ''}`,
			lang: companyLang,
		}
	}

	// Проверяем маршруты заявок
	const requestLang = getLangByRequestRoute(firstSegment)
	if (requestLang) {
		// Перенаправляем на /requests с остальными сегментами
		const restPath = segments.slice(1).join('/')
		return {
			rewritePath: `/requests${restPath ? `/${restPath}` : ''}`,
			lang: requestLang,
		}
	}

	return null
}
