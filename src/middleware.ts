import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const locales = ['uk', 'en', 'pl', 'fr', 'de']

export function middleware(request: NextRequest) {
	// Получаем путь из URL
	const pathname = request.nextUrl.pathname

	// Проверяем, начинается ли путь с локали
	const pathnameHasLocale = locales.some(
		locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	)

	// Если путь содержит локаль - пропускаем
	if (pathnameHasLocale) return

	// Для всех остальных путей без локали - пропускаем (английская версия по умолчанию)
	return
}

export const config = {
	matcher: [
		// Пропускаем статические файлы и API роуты
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}
