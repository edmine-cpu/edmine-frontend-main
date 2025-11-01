import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getInternalRoute } from './lib/i18n-routes'

/**
 * Middleware для мультиязычной поддержки
 *
 * Логика работы:
 * 1. Определяет язык из URL префикса (uk/pl/de/fr) или использует английский (без префикса)
 * 2. Обрабатывает локализованные маршруты для компаний и заявок
 * 3. Добавляет язык в headers (x-locale) для использования в Server Components
 * 4. Обрабатывает редиректы для английского языка: /en/* -> /*
 *
 * Примеры URL:
 * - / -> английский (en)
 * - /uk/blog -> украинский (uk)
 * - /kompanii/test-123 -> rewrite на /companies/test-123 с lang=uk
 * - /firmy/test-123 -> rewrite на /companies/test-123 с lang=pl
 * - /zayavki/test-123 -> rewrite на /requests/test-123 с lang=uk
 * - /en/blog -> редирект на /blog (убираем префикс en)
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Список поддерживаемых языков
	const supportedLangs = ['uk', 'en', 'pl', 'fr', 'de']

	// Извлекаем первый сегмент пути
	const segments = pathname.split('/').filter(Boolean)
	const firstSegment = segments[0]

	// РЕДИРЕКТ: Если URL начинается с /en/ -> убираем префикс
	// Пример: /en/blog -> /blog
	if (firstSegment === 'en') {
		const newPathname = '/' + segments.slice(1).join('/')
		const url = request.nextUrl.clone()
		url.pathname = newPathname || '/'
		return NextResponse.redirect(url)
	}

	// РЕДИРЕКТ: Если URL это ТОЛЬКО языковой префикс (например /uk, /pl, /de, /fr)
	// редиректим на главную страницу /, middleware установит правильный header x-locale
	if (segments.length === 1 && supportedLangs.includes(firstSegment)) {
		const url = request.nextUrl.clone()
		url.pathname = '/'
		// При редиректе header не сохранится, поэтому главная страница должна читать из pathname
		// Но лучше сделать rewrite вместо redirect
		const response = NextResponse.rewrite(url)
		response.headers.set('x-locale', firstSegment)
		return response
	}

	// Проверяем, является ли путь локализованным маршрутом компаний или заявок
	const internalRoute = getInternalRoute(pathname)
	if (internalRoute) {
		// Делаем rewrite на внутренний маршрут с сохранением языка
		const url = request.nextUrl.clone()
		url.pathname = internalRoute.rewritePath

		const response = NextResponse.rewrite(url)
		response.headers.set('x-locale', internalRoute.lang)
		return response
	}

	// Определяем язык из URL
	let detectedLang = 'en' // Дефолтный язык - английский

	// Проверяем, является ли первый сегмент языковым префиксом
	if (firstSegment && supportedLangs.includes(firstSegment)) {
		detectedLang = firstSegment

		// REWRITE: Если URL начинается с языкового префикса (кроме 'en')
		// убираем префикс из pathname, но сохраняем язык в header
		// Пример: /uk/blog -> rewrite на /blog с header x-locale: uk
		if (segments.length > 1) {
			const newPathname = '/' + segments.slice(1).join('/')
			const url = request.nextUrl.clone()
			url.pathname = newPathname

			const response = NextResponse.rewrite(url)
			response.headers.set('x-locale', detectedLang)
			return response
		}
	}

	// Создаём response с добавлением языка в headers
	const response = NextResponse.next()
	response.headers.set('x-locale', detectedLang)

	return response
}

export const config = {
	matcher: [
		// Пропускаем статические файлы и API роуты
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|check|login|logout|me).*)',
	],
}
