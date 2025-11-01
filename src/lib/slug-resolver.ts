/**
 * Сервис для определения типа slug-а и получения данных
 * Работает с категориями, подкатегориями, странами, городами
 */

import { API_BASE_URL } from '@/config/api'
import type { Lang } from '@/app/(types)/lang'
import { transliterate } from '@/utils/transliterate'

export interface Category {
	id: number
	name: string
	name_uk: string
	name_en: string
	name_pl: string
	name_fr: string
	name_de: string
	slug_uk?: string
	slug_en?: string
	slug_pl?: string
	slug_fr?: string
	slug_de?: string
}

export interface Subcategory {
	id: number
	full_category_id: number
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
	slug_uk?: string
	slug_en?: string
	slug_pl?: string
	slug_fr?: string
	slug_de?: string
}

export interface Country {
	id: number
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
	slug_uk?: string
	slug_en?: string
	slug_pl?: string
	slug_fr?: string
	slug_de?: string
}

export interface City {
	id: number
	country_id: number
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
	slug_uk?: string
	slug_en?: string
	slug_pl?: string
	slug_fr?: string
	slug_de?: string
}

export type SegmentType = 'category' | 'subcategory' | 'country' | 'city' | 'company' | 'unknown'

export interface ResolvedSegment {
	type: SegmentType
	id: number
	slug: string
	data: Category | Subcategory | Country | City | null
}

/**
 * Кеш для хранения данных
 */
let categoriesCache: Category[] | null = null
let subcategoriesCache: Subcategory[] | null = null
let countriesCache: Country[] | null = null
let citiesCache: City[] | null = null

/**
 * Загрузка всех данных
 */
export async function loadAllData(): Promise<{
	categories: Category[]
	subcategories: Subcategory[]
	countries: Country[]
	cities: City[]
}> {
	if (categoriesCache && subcategoriesCache && countriesCache && citiesCache) {
		return {
			categories: categoriesCache,
			subcategories: subcategoriesCache,
			countries: countriesCache,
			cities: citiesCache,
		}
	}

	try {
		const [categoriesRes, subcategoriesRes, countriesRes, citiesRes] = await Promise.all([
			fetch(`${API_BASE_URL}/check/categories`, { cache: 'force-cache' }),
			fetch(`${API_BASE_URL}/check/subcategories`, { cache: 'force-cache' }),
			fetch(`${API_BASE_URL}/api/country`, { cache: 'force-cache' }),
			fetch(`${API_BASE_URL}/api/city`, { cache: 'force-cache' }),
		])

		categoriesCache = await categoriesRes.json()
		subcategoriesCache = await subcategoriesRes.json()
		countriesCache = await countriesRes.json()
		citiesCache = await citiesRes.json()

		return {
			categories: categoriesCache || [],
			subcategories: subcategoriesCache || [],
			countries: countriesCache || [],
			cities: citiesCache || [],
		}
	} catch (error) {
		console.error('Error loading data:', error)
		return {
			categories: [],
			subcategories: [],
			countries: [],
			cities: [],
		}
	}
}

/**
 * Создает slug из текста (для сравнения)
 * Использует транслитерацию для поддержки разных языков
 */
function createSlug(text: string): string {
	if (!text) return ''
	// Используем транслитерацию для создания SEO-friendly slug
	return transliterate(text)
}

/**
 * Проверяет соответствие slug-а для всех языков
 * Поддерживает как транслитерированные так и оригинальные (кириллица) slug'и для обратной совместимости
 */
function matchesSlug(item: any, slug: string, lang: Lang): boolean {
	const slugToCheck = slug.toLowerCase()

	// Проверяем существующие slug для всех языков (с транслитерацией)
	const slugs = [
		item[`slug_${lang}`],
		item.slug_uk,
		item.slug_en,
		item.slug_pl,
		item.slug_fr,
		item.slug_de,
	]
		.filter(Boolean)
		.map(s => createSlug(s))

	if (slugs.some(s => s === slugToCheck)) {
		return true
	}

	// Проверяем имена для всех языков с транслитерацией
	const names = [
		item[`name_${lang}`],
		item.name_uk,
		item.name_en,
		item.name_pl,
		item.name_fr,
		item.name_de,
		item.name,
	].filter(Boolean)

	// Проверяем транслитерированные имена
	if (names.map(n => createSlug(n)).some(n => n === slugToCheck)) {
		return true
	}

	// Для обратной совместимости: проверяем оригинальные имена с кириллицей
	// Создаем slug с сохранением Unicode символов (как было раньше)
	const unicodeSlugs = names.map(name =>
		name
			.toLowerCase()
			.trim()
			.replace(/[^\p{L}\p{N}\s-]/gu, '')
			.replace(/[\s_]+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '')
	)

	return unicodeSlugs.some(s => s === slugToCheck)
}

/**
 * Определяет тип сегмента и возвращает соответствующие данные
 */
export async function resolveSegment(
	slug: string,
	lang: Lang,
	previousSegment?: ResolvedSegment
): Promise<ResolvedSegment> {
	const data = await loadAllData()

	// Проверяем категории
	const category = data.categories.find(cat => matchesSlug(cat, slug, lang))
	if (category) {
		return {
			type: 'category',
			id: category.id,
			slug,
			data: category,
		}
	}

	// Проверяем подкатегории (только если предыдущий сегмент - категория)
	if (previousSegment?.type === 'category') {
		const subcategory = data.subcategories.find(
			sub =>
				sub.full_category_id === previousSegment.id && matchesSlug(sub, slug, lang)
		)
		if (subcategory) {
			return {
				type: 'subcategory',
				id: subcategory.id,
				slug,
				data: subcategory,
			}
		}
	}

	// Проверяем страны
	const country = data.countries.find(c => matchesSlug(c, slug, lang))
	if (country) {
		return {
			type: 'country',
			id: country.id,
			slug,
			data: country,
		}
	}

	// Проверяем города (только если предыдущий сегмент - страна)
	if (previousSegment?.type === 'country') {
		const city = data.cities.find(
			c => c.country_id === previousSegment.id && matchesSlug(c, slug, lang)
		)
		if (city) {
			return {
				type: 'city',
				id: city.id,
				slug,
				data: city,
			}
		}
	}

	// Если это последний сегмент и содержит ID в конце, возможно это компания/заявка
	if (slug.match(/-\d+$/)) {
		return {
			type: 'company',
			id: 0,
			slug,
			data: null,
		}
	}

	return {
		type: 'unknown',
		id: 0,
		slug,
		data: null,
	}
}

/**
 * Разбирает массив сегментов и определяет их типы
 */
export async function resolveSegments(
	segments: string[],
	lang: Lang
): Promise<ResolvedSegment[]> {
	const resolved: ResolvedSegment[] = []

	for (let i = 0; i < segments.length; i++) {
		const previousSegment = resolved[i - 1]
		const resolvedSegment = await resolveSegment(segments[i], lang, previousSegment)
		resolved.push(resolvedSegment)
	}

	return resolved
}

/**
 * Определяет структуру URL на основе разобранных сегментов
 * Новая структура: /prefix/категория/подкатегория/страна/город
 */
export function analyzeUrlStructure(segments: ResolvedSegment[]): {
	category?: ResolvedSegment
	subcategory?: ResolvedSegment
	country?: ResolvedSegment
	city?: ResolvedSegment
	company?: ResolvedSegment
	type: 'list' | 'detail' | 'mixed'
} {
	const result: any = {
		type: 'list' as const
	}

	for (const segment of segments) {
		if (segment.type === 'category') result.category = segment
		else if (segment.type === 'subcategory') result.subcategory = segment
		else if (segment.type === 'country') result.country = segment
		else if (segment.type === 'city') result.city = segment
		else if (segment.type === 'company') {
			result.company = segment
			result.type = 'detail'
		}
	}

	// Если есть и категории, и страны - mixed
	if ((result.category || result.subcategory) && (result.country || result.city)) {
		result.type = 'mixed'
	}

	return result
}

/**
 * Создает slug из ID и данных
 * Использует транслитерацию для SEO-friendly URL
 */
export function createSlugFromData(item: any, lang: Lang): string {
	if (!item) return 'all'

	// Проверяем существующие slug-и
	if (item[`slug_${lang}`]) return item[`slug_${lang}`]

	// Создаем из имени с транслитерацией
	const name = item[`name_${lang}`] || item.name_en || item.name || ''
	return createSlug(name)
}

/**
 * Создает URL на основе фильтров БЕЗ префиксов companies/zayavki
 * Структура: /lang/[category]/[subcategory]/[country]/[city]?zayavki=true
 * Если нет фильтров: /lang/all
 * Компании: /uk/category (без query) или /uk/all
 * Заявки: /uk/category?zayavki=true или /uk/all?zayavki=true
 */
export function buildFilterUrl(params: {
	category?: string
	subcategory?: string
	country?: string
	city?: string
	lang: Lang
	type: 'companies' | 'requests'
}): string {
	const { category, subcategory, country, city, lang, type } = params

	const segments: string[] = []

	// Добавляем язык только если не английский
	if (lang !== 'en') {
		segments.push(lang)
	}

	// Валидация и очистка слагов - убираем пустые и неправильные
	const cleanSlug = (slug?: string): string | undefined => {
		if (!slug || !slug.trim() || slug === '-' || slug === 'undefined') return undefined
		const cleaned = slug.trim().replace(/^-+|-+$/g, '') // убираем дефисы в начале/конце
		return cleaned && cleaned !== '-' ? cleaned : undefined
	}

	const cleanCategory = cleanSlug(category)
	const cleanSubcategory = cleanSlug(subcategory)
	const cleanCountry = cleanSlug(country)
	const cleanCity = cleanSlug(city)

	// Добавляем только валидные сегменты
	if (cleanCategory) {
		segments.push(cleanCategory)
		if (cleanSubcategory) {
			segments.push(cleanSubcategory)
		}
	}

	if (cleanCountry) {
		segments.push(cleanCountry)
		if (cleanCity) {
			segments.push(cleanCity)
		}
	}

	// Если нет фильтров - добавляем /all
	if (!cleanCategory && !cleanCountry) {
		segments.push('all')
	}

	// Базовый путь
	const basePath = `/${segments.join('/')}`

	// Для заявок добавляем query параметр
	if (type === 'requests') {
		return `${basePath}?zayavki=true`
	}

	return basePath
}

/**
 * Парсит URL и определяет фильтры гибко (как OLX)
 * Поддерживает любую комбинацию: только категория, только страна, или всё вместе
 * Структура: /[category]/[subcategory]/[country]/[city]
 * БЕЗ префиксов companies/zayavki!
 * /all означает отсутствие фильтров
 */
export async function parseFilterUrl(
	segments: string[],
	lang: Lang
): Promise<{
	category?: ResolvedSegment
	subcategory?: ResolvedSegment
	country?: ResolvedSegment
	city?: ResolvedSegment
	isValid: boolean
}> {
	const result: any = { isValid: true }

	if (segments.length === 0) return result

	// Загружаем данные
	const data = await loadAllData()

	// Отслеживаем, были ли валидные сегменты
	let hasValidSegments = false
	let unmatchedSegments = 0

	// Проходим по сегментам и определяем каждый независимо
	// Алгоритм: для КАЖДОГО сегмента проверяем ВСЕ типы данных (категории, страны, подкатегории, города)
	// Это гарантирует, что все сегменты будут проверены со всеми слагами

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i]

		// Пропускаем языковые префиксы и 'all'
		if (['uk', 'en', 'pl', 'fr', 'de', 'all'].includes(segment)) {
			hasValidSegments = true
			continue
		}

		let matched = false

		// 1. Проверяем категории (если еще нет категории)
		if (!result.category && !matched) {
			const category = data.categories.find(cat => matchesSlug(cat, segment, lang))
			if (category) {
				result.category = {
					type: 'category' as const,
					id: category.id,
					slug: segment,
					data: category
				}
				matched = true
				hasValidSegments = true
			}
		}

		// 2. Проверяем подкатегории (если уже есть категория и еще нет подкатегории)
		if (result.category && !result.subcategory && !matched) {
			const subcategory = data.subcategories.find(sub =>
				sub.full_category_id === result.category.id && matchesSlug(sub, segment, lang)
			)
			if (subcategory) {
				result.subcategory = {
					type: 'subcategory' as const,
					id: subcategory.id,
					slug: segment,
					data: subcategory
				}
				matched = true
				hasValidSegments = true
			}
		}

		// 3. Проверяем страны (если еще нет страны)
		if (!result.country && !matched) {
			const country = data.countries.find(c => matchesSlug(c, segment, lang))
			if (country) {
				result.country = {
					type: 'country' as const,
					id: country.id,
					slug: segment,
					data: country
				}
				matched = true
				hasValidSegments = true
			}
		}

		// 4. Проверяем города (если уже есть страна и еще нет города)
		if (result.country && !result.city && !matched) {
			const city = data.cities.find(c =>
				c.country_id === result.country.id && matchesSlug(c, segment, lang)
			)
			if (city) {
				result.city = {
					type: 'city' as const,
					id: city.id,
					slug: segment,
					data: city
				}
				matched = true
				hasValidSegments = true
			}
		}

		// Если сегмент не совпал ни с одним типом данных, это невалидный URL
		if (!matched) {
			unmatchedSegments++
		}
	}

	// URL невалиден, если есть несовпавшие сегменты и нет валидных сегментов
	// Это отсеет случайные URL вроде /static/avatars/file.png
	if (unmatchedSegments > 0 && !hasValidSegments) {
		result.isValid = false
	}

	return result
}
