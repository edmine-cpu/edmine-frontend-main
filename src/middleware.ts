import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['uk', 'en', 'pl', 'fr', 'de']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
    // Получаем путь из URL
    const pathname = request.nextUrl.pathname
    
    // Проверяем, начинается ли путь с локали
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return

    // Если путь корневой, редиректим на дефолтную локаль
    if (pathname === '/') {
        return NextResponse.redirect(
            new URL(`/${defaultLocale}`, request.url)
        )
    }

    // Если путь не содержит локаль, добавляем дефолтную
    return NextResponse.redirect(
        new URL(`/${defaultLocale}${pathname}`, request.url)
    )
}

export const config = {
    matcher: [
        // Пропускаем статические файлы и API роуты
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}

