import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	// Получаем путь из URL

	// Для всех остальных путей без локали - пропускаем (английская версия по умолчанию)
	return
}

export const config = {
	matcher: [
		// Пропускаем статические файлы и API роуты
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}
