import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getInternalRoute } from './lib/i18n-routes'

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Проверяем, является ли путь многоязычным маршрутом компаний или заявок
	const routeInfo = getInternalRoute(pathname)

	if (routeInfo) {
		// Создаем новый URL для rewrite (не редирект!)
		const url = request.nextUrl.clone()
		url.pathname = routeInfo.rewritePath

		// Сохраняем язык в заголовках для доступа в компонентах
		const response = NextResponse.rewrite(url)
		response.headers.set('x-current-lang', routeInfo.lang)

		return response
	}

	// Для всех остальных путей - пропускаем
	return NextResponse.next()
}

export const config = {
	matcher: [
		// Пропускаем статические файлы и API роуты
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|check|login|logout|me).*)',
	],
}
