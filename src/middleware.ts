import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware для мультиязычной поддержки
 *
 * Логика работы:
 * 1. Определяет язык из URL префикса (uk/pl/de/fr) или использует английский (без префикса)
 * 2. Добавляет язык в headers (x-locale) для использования в Server Components
 * 3. Обрабатывает редиректы для английского языка: /en/* -> /*
 *
 * Примеры URL:
 * - / -> английский (en)
 * - /uk/blog -> украинский (uk)
 * - /de/companies -> немецкий (de)
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

	// Определяем язык из URL
	let detectedLang = 'en' // Дефолтный язык - английский

	// Проверяем, является ли первый сегмент языковым префиксом
	if (firstSegment && supportedLangs.includes(firstSegment)) {
		detectedLang = firstSegment
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
