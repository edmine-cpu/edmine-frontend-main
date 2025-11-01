import { FilteredList } from '@/components/FilteredList/FilteredList'
import {
	getLangByCompanyRoute,
	getLangByRequestRoute,
	COMPANY_ROUTES,
	REQUEST_ROUTES,
	type Lang,
	SUPPORTED_LANGS,
} from '@/lib/i18n-routes'
import React from 'react'
import type { Metadata } from 'next'

/**
 * Универсальная страница для всех мультиязычных маршрутов
 *
 * Поддерживаемые структуры URL:
 *
 * АНГЛИЙСКИЙ (без префикса):
 * - /all - все компании
 * - /all?zayavki=true - все заявки
 * - /category - компании в категории
 * - /category?zayavki=true - заявки в категории
 * - /category/subcategory - компании в подкатегории
 * - /country/city - компании в городе
 * - /category/country/city - компании в категории и городе
 *
 * ДРУГИЕ ЯЗЫКИ (с префиксом):
 * - /uk/all - все компании (украинский)
 * - /uk/all?zayavki=true - все заявки (украинский)
 * - /de/category - компании в категории (немецкий)
 * - /fr/category?zayavki=true - заявки в категории (французский)
 * И т.д.
 */

/**
 * Генерация статических параметров для pre-rendering популярных страниц
 * Это улучшает SEO и производительность
 */
export async function generateStaticParams() {
	// Генерируем статические пути для всех языков
	const staticPaths: { segments: string[] }[] = []

	// Главные страницы для каждого языка
	SUPPORTED_LANGS.forEach(lang => {
		if (lang === 'en') {
			// Для английского - без префикса
			staticPaths.push({ segments: ['all'] })
		} else {
			// Для остальных - с префиксом языка
			staticPaths.push({ segments: [lang, 'all'] })
		}
	})

	return staticPaths
}

/**
 * Генерация SEO метаданных для мультиязычных страниц
 */
export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<{ segments?: string[] }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
	const resolvedParams = await params
	const resolvedSearchParams = await searchParams
	const allSegments = resolvedParams?.segments || []

	// Определяем язык
	let lang: Lang = 'en'
	const firstSegment = allSegments[0]

	if (firstSegment && SUPPORTED_LANGS.includes(firstSegment as Lang)) {
		lang = firstSegment as Lang
	} else if (firstSegment) {
		const companyLang = getLangByCompanyRoute(firstSegment)
		const requestLang = getLangByRequestRoute(firstSegment)
		lang = companyLang || requestLang || 'en'
	}

	// Определяем тип (поддерживаем true, True, TRUE)
	const isRequests = resolvedSearchParams?.zayavki?.toString().toLowerCase() === 'true'

	// Проверяем наличие фильтров (кроме page и zayavki)
	const filterParams = Object.keys(resolvedSearchParams || {}).filter(
		key => !['page', 'zayavki'].includes(key)
	)
	const hasFilters = filterParams.length > 0

	// Переводы для метаданных
	const titles = {
		companies: {
			uk: 'Компанії',
			en: 'Companies',
			pl: 'Firmy',
			fr: 'Entreprises',
			de: 'Unternehmen',
		},
		requests: {
			uk: 'Заявки',
			en: 'Requests',
			pl: 'Zlecenia',
			fr: 'Demandes',
			de: 'Aufträge',
		},
	}

	const descriptions = {
		companies: {
			uk: 'Знайдіть найкращі компанії для ваших потреб на нашій фріланс біржі',
			en: 'Find the best companies for your needs on our freelance marketplace',
			pl: 'Znajdź najlepsze firmy dla swoich potrzeb na naszym rynku freelancerów',
			fr: 'Trouvez les meilleures entreprises pour vos besoins sur notre plateforme de freelance',
			de: 'Finden Sie die besten Unternehmen für Ihre Bedürfnisse auf unserem Freelance-Marktplatz',
		},
		requests: {
			uk: 'Перегляньте актуальні заявки на роботу на нашій фріланс біржі',
			en: 'Browse current job requests on our freelance marketplace',
			pl: 'Przeglądaj aktualne zlecenia na naszym rynku freelancerów',
			fr: 'Parcourez les demandes d\'emploi actuelles sur notre plateforme de freelance',
			de: 'Durchsuchen Sie aktuelle Jobanfragen auf unserem Freelance-Marktplatz',
		},
	}

	const type = isRequests ? 'requests' : 'companies'
	const title = titles[type][lang]
	const description = descriptions[type][lang]

	// Формируем базовый URL без query параметров для canonical
	const baseUrl = `/${allSegments.join('/')}${isRequests ? '?zayavki=true' : ''}`

	// Если есть фильтры - noindex + canonical на родительскую страницу
	if (hasFilters) {
		return {
			title,
			description,
			robots: {
				index: false, // Не индексируем фильтрованные страницы
				follow: true, // Но разрешаем переходить по ссылкам
			},
			alternates: {
				canonical: baseUrl, // Canonical на родительскую страницу без фильтров
			},
			openGraph: {
				title,
				description,
				locale: lang,
				type: 'website',
			},
		}
	}

	// Чистая страница без фильтров - индексируем
	return {
		title,
		description,
		robots: {
			index: true,
			follow: true,
		},
		alternates: {
			languages: {
				'uk': `/uk/${allSegments.slice(1).join('/')}`,
				'en': `/${allSegments.slice(1).join('/')}`,
				'pl': `/pl/${allSegments.slice(1).join('/')}`,
				'fr': `/fr/${allSegments.slice(1).join('/')}`,
				'de': `/de/${allSegments.slice(1).join('/')}`,
			},
		},
		openGraph: {
			title,
			description,
			locale: lang,
			type: 'website',
		},
	}
}
export default function UniversalPage({
	params,
	searchParams,
}: {
	params: Promise<{ segments?: string[] }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedParams = React.use(params)
	const resolvedSearchParams = React.use(searchParams ?? Promise.resolve<{ [key: string]: string | string[] | undefined }>({}))
	const allSegments = resolvedParams?.segments || []

	// Определяем язык из URL
	let lang: Lang = 'en' // Дефолтный язык - английский
	let contentSegments: string[] = allSegments

	// Проверяем, является ли первый сегмент языковым префиксом
	const firstSegment = allSegments[0]
	if (firstSegment && SUPPORTED_LANGS.includes(firstSegment as Lang)) {
		lang = firstSegment as Lang
		// Убираем языковой префикс из сегментов контента
		contentSegments = allSegments.slice(1)
	}

	// Проверяем, является ли первый сегмент локализованным маршрутом компаний
	if (firstSegment) {
		const companyLang = getLangByCompanyRoute(firstSegment)
		if (companyLang) {
			lang = companyLang
			// Убираем маршрут компаний из сегментов
			contentSegments = allSegments.slice(1)
		}

		const requestLang = getLangByRequestRoute(firstSegment)
		if (requestLang) {
			lang = requestLang
			// Убираем маршрут заявок из сегментов
			contentSegments = allSegments.slice(1)
		}
	}

	// Определяем тип из query параметра (поддерживаем true, True, TRUE)
	const isRequests = resolvedSearchParams?.zayavki?.toString().toLowerCase() === 'true'
	const type = isRequests ? 'requests' : 'companies'

	return (
		<FilteredList
			type={type}
			segments={contentSegments}
			searchParams={resolvedSearchParams}
			lang={lang}
		/>
	)
}
