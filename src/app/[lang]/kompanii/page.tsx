'use client'

import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

interface Category {
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

interface Subcategory {
	id: number
	full_category_id: number
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
}

interface Country {
	id: number
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
}

interface City {
	id: number
	country_id: number
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
}

interface Company {
	id: number
	name: string
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
	description_uk?: string
	description_en?: string
	description_pl?: string
	description_fr?: string
	description_de?: string
	city?: string
	country?: string
	slug_name?: string
	owner_id?: number
	categories?: any[]
	subcategories?: any[]
}

const T = {
	uk: {
		title: 'Компанії',
		orders: 'Заявки',
		services: 'Послуги',
		filters: 'Фільтри',
		category: 'Категорія',
		subcategory: 'Підкатегорія',
		country: 'Країна',
		city: 'Місто',
		sort: 'Сортування',
		byDate: 'по даті',
		byTitle: 'за назвою',
		byRelevance: 'за релевантністю',
		popular: 'популярні',
		recent: 'нові',
		select: '-- обрати --',
		details: 'Детальніше',
		allCategories: 'Всі категорії',
		anyRegions: 'Будь-які регіони',
		search: 'Пошук',
		searchPlaceholder: 'Введіть ключові слова для пошуку...',
	},
	en: {
		title: 'Companies',
		orders: 'Orders',
		services: 'Services',
		filters: 'Filters',
		category: 'Category',
		subcategory: 'Subcategory',
		country: 'Country',
		city: 'City',
		sort: 'Sort',
		byDate: 'by date',
		byTitle: 'by title',
		byRelevance: 'by relevance',
		popular: 'popular',
		recent: 'recent',
		select: '-- select --',
		details: 'Details',
		allCategories: 'All categories',
		anyRegions: 'Any regions',
		search: 'Search',
		searchPlaceholder: 'Enter keywords to search...',
	},
	pl: {
		title: 'Firmy',
		orders: 'Zlecenia',
		services: 'Usługi',
		filters: 'Filtry',
		category: 'Kategoria',
		subcategory: 'Podkategoria',
		country: 'Kraj',
		city: 'Miasto',
		sort: 'Sortowanie',
		byDate: 'po dacie',
		byTitle: 'według tytułu',
		byRelevance: 'według trafności',
		popular: 'popularne',
		recent: 'najnowsze',
		select: '-- wybierz --',
		details: 'Szczegóły',
		allCategories: 'Wszystkie kategorie',
		anyRegions: 'Dowolne regiony',
		search: 'Szukaj',
		searchPlaceholder: 'Wpisz słowa kluczowe do wyszukiwania...',
	},
	fr: {
		title: 'Entreprises',
		orders: 'Demandes',
		services: 'Services',
		filters: 'Filtres',
		category: 'Catégorie',
		subcategory: 'Sous-catégorie',
		country: 'Pays',
		city: 'Ville',
		sort: 'Tri',
		byDate: 'par date',
		byTitle: 'par titre',
		byRelevance: 'par pertinence',
		popular: 'populaires',
		recent: 'récents',
		select: '-- sélectionnez --',
		details: 'Détails',
		allCategories: 'Toutes les catégories',
		anyRegions: 'Toutes régions',
		search: 'Recherche',
		searchPlaceholder: 'Entrez des mots-clés pour rechercher...',
	},
	de: {
		title: 'Unternehmen',
		orders: 'Aufträge',
		services: 'Leistungen',
		filters: 'Filter',
		category: 'Kategorie',
		subcategory: 'Unterkategorie',
		country: 'Land',
		city: 'Stadt',
		sort: 'Sortierung',
		byDate: 'nach Datum',
		byTitle: 'nach Titel',
		byRelevance: 'nach Relevanz',
		popular: 'beliebt',
		recent: 'neu',
		select: '-- wählen --',
		details: 'Details',
		allCategories: 'Alle Kategorien',
		anyRegions: 'Beliebige Regionen',
		search: 'Suche',
		searchPlaceholder: 'Suchbegriffe eingeben...',
	},
} as const

export default function KompaniiPage({
	params,
	searchParams,
}: {
	params: Promise<{ lang: string }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedParams = React.use(params)
	const resolvedSearchParams = searchParams ? React.use(searchParams) : {}
	const lang = ((resolvedParams.lang as string) || 'uk') as Lang
	const t = T[lang]
	const router = useRouter()

	const searchQuery = (resolvedSearchParams.search as string) || ''

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [countries, setCountries] = useState<Country[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [companies, setCompanies] = useState<Company[]>([])
	const [loading, setLoading] = useState(false)

	const [filters, setFilters] = useState({
		category: '',
		subcategory: '',
		country: '',
		city: '',
		sort: 'relevance',
		search: searchQuery,
	})

	const [searchDebounce, setSearchDebounce] = useState(searchQuery)

	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			setFilters(f => ({ ...f, search: searchDebounce }))
		}, 500)

		return () => clearTimeout(timer)
	}, [searchDebounce])

	useEffect(() => {
		Promise.all([
			fetch(API_ENDPOINTS.categories),
			fetch(API_ENDPOINTS.subcategories),
			fetch(API_ENDPOINTS.countries),
			fetch(API_ENDPOINTS.cities),
		])
			.then(async ([c1, s1, c2, c3]) => {
				setCategories(await c1.json())
				setSubcategories(await s1.json())
				setCountries(await c2.json())
				setCities(await c3.json())
			})
			.catch(console.error)
	}, [])

	const filteredSubcategories = useMemo(() => {
		if (!filters.category) return []
		const list = Array.isArray(subcategories) ? subcategories : []
		return list.filter(
			(s: any) =>
				String(s.full_category_id ?? s.full_category) === filters.category
		)
	}, [filters.category, subcategories])

	// Функция для получения slug'а категории
	const getCategorySlug = (categoryId: string) => {
		const category = categories.find(cat => String(cat.id) === categoryId)
		if (!category) return categoryId
		return (category[`name_${lang}`] || category.name_en || category.name)
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '')
	}

	// Функция для получения slug'а подкатегории
	const getSubcategorySlug = (subcategoryId: string) => {
		const subcategory = subcategories.find(
			sub => String(sub.id) === subcategoryId
		)
		if (!subcategory) return subcategoryId
		return (
			subcategory[`name_${lang}`] ||
			subcategory.name_en ||
			subcategory.name_uk ||
			''
		)
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '')
	}

	useEffect(() => {
		setLoading(true)
		// Создаем параметры для API (используем ID)
		const apiParams = new URLSearchParams()
		apiParams.set('limit', '20')
		apiParams.set('offset', '0')
		if (filters.category) apiParams.set('category', filters.category)
		if (filters.subcategory) apiParams.set('subcategory', filters.subcategory)
		if (filters.country) apiParams.set('country', filters.country)
		if (filters.city) apiParams.set('city', filters.city)
		if (filters.sort) apiParams.set('sort', filters.sort)
		if (filters.search) apiParams.set('search', filters.search)

		// Создаем параметры для URL (используем slug'и для SEO)
		const urlParams = new URLSearchParams()
		if (filters.category)
			urlParams.set('category', getCategorySlug(filters.category))
		if (filters.subcategory)
			urlParams.set('subcategory', getSubcategorySlug(filters.subcategory))
		if (filters.country) urlParams.set('country', filters.country)
		if (filters.city) urlParams.set('city', filters.city)
		if (filters.sort) urlParams.set('sort', filters.sort)
		if (filters.search) urlParams.set('search', filters.search)

		// Обновляем URL для SEO
		const newUrl = `/kompanii${
			urlParams.toString() ? '?' + urlParams.toString() : ''
		}`
		window.history.replaceState(null, '', newUrl)

		fetch(`${API_ENDPOINTS.companies}?${apiParams.toString()}`)
			.then(res => res.json())
			.then(data => {
				if (Array.isArray(data)) {
					setCompanies(data)
				} else {
					setCompanies([])
				}
			})
			.catch(console.error)
			.finally(() => setLoading(false))
	}, [filters, lang])

	// Утилиты для получения переводов
	const getName = (obj: any) =>
		obj?.[`name_${lang}`] ?? obj?.name_en ?? obj?.name_uk ?? obj?.name ?? ''
	const getDescription = (obj: any) =>
		obj?.[`description_${lang}`] ??
		obj?.description_en ??
		obj?.description_uk ??
		''
	const getCompanyName = (company: Company) =>
		(company?.[`name_${lang}` as keyof Company] as string) ??
		company?.name_uk ??
		company?.name

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang={lang} />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-6xl'>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-2xl font-semibold text-red-600'>{t.title}</h1>
						<div className='flex gap-3'>
							<button
								onClick={() => router.push(`/zayavki`)}
								className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold'
							>
								{t.orders}
							</button>
							<button
								onClick={() => router.push(`/kompanii`)}
								className='px-4 py-2 rounded-md bg-red-600 text-white font-semibold'
							>
								{t.title}
							</button>
						</div>
					</div>

					<section className='bg-gray-100 rounded-md p-4 mb-6'>
						{/* Поле поиска */}
						<div className='mb-4'>
							<label className='block text-sm text-gray-700 mb-1'>
								{t.search}
							</label>
							<input
								type='text'
								value={searchDebounce}
								onChange={e => setSearchDebounce(e.target.value)}
								placeholder={t.searchPlaceholder}
								className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'
							/>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-end'>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.category}
								</label>
								<select
									value={filters.category}
									onChange={e => {
										const categoryId = e.target.value
										setFilters(f => ({
											...f,
											category: categoryId,
											subcategory: '',
										}))

										// Обновляем URL для SEO
										if (categoryId) {
											const categorySlug = getCategorySlug(categoryId)
											router.push(`/kompanii/${categorySlug}`)
										} else {
											router.push(`/kompanii`)
										}
									}}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value=''>{t.allCategories}</option>
									{categories.map(c => (
										<option key={c.id} value={String(c.id)}>
											{getName(c)}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.subcategory}
								</label>
								<select
									value={filters.subcategory}
									onChange={e => {
										const subcategoryId = e.target.value
										setFilters(f => ({ ...f, subcategory: subcategoryId }))

										// Обновляем URL для SEO
										if (subcategoryId && filters.category) {
											const categorySlug = getCategorySlug(filters.category)
											const subcategorySlug = getSubcategorySlug(subcategoryId)
											router.push(
												`/kompanii/${categorySlug}/${subcategorySlug}`
											)
										}
									}}
									className='w-full rounded-md border px-3 py-2'
									disabled={!filters.category}
								>
									<option value=''>{t.select}</option>
									{filteredSubcategories.map(sc => (
										<option key={sc.id} value={String(sc.id)}>
											{getName(sc)}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.country}
								</label>
								<select
									value={filters.country}
									onChange={e =>
										setFilters(f => ({
											...f,
											country: e.target.value,
											city: '',
										}))
									}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value=''>{t.select}</option>
									{countries.map(c => (
										<option key={c.id} value={String(c.id)}>
											{getName(c)}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.city}
								</label>
								<select
									value={filters.city}
									onChange={e =>
										setFilters(f => ({ ...f, city: e.target.value }))
									}
									className='w-full rounded-md border px-3 py-2'
									disabled={!filters.country}
								>
									<option value=''>{t.select}</option>
									{cities
										.filter(c => String(c.country_id) === filters.country)
										.map(c => (
											<option key={c.id} value={String(c.id)}>
												{getName(c)}
											</option>
										))}
								</select>
							</div>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.sort}
								</label>
								<select
									value={filters.sort}
									onChange={e =>
										setFilters(f => ({ ...f, sort: e.target.value }))
									}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value='relevance'>{t.byRelevance} 🔥</option>
									<option value='popular'>{t.popular} ⭐</option>
									<option value='date_desc'>{t.recent} ↓</option>
									<option value='date_asc'>{t.byDate} ↑</option>
									<option value='title_asc'>{t.byTitle} A-Z</option>
									<option value='title_desc'>{t.byTitle} Z-A</option>
								</select>
							</div>
						</div>
					</section>

					{/* Индикатор загрузки */}
					{loading && (
						<div className='text-center py-8'>
							<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600'></div>
						</div>
					)}

					{/* Контент для компаний */}
					{!loading && (
						<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
							{companies.map(company => {
								const description = getDescription(company)
								const location =
									company.city && company.country
										? `${company.city}, ${company.country}`
										: company.city || company.country || ''

								// Исправленный URL без лишнего слеша и цифры
								const companySlug =
									company.slug_name ||
									company.name.toLowerCase().replace(/\s+/g, '-')
								const companyUrl = `/kompanii/${companySlug}-${company.id}`

								return (
									<a
										key={company.id || `company-${Math.random()}`}
										href={companyUrl}
										className='block text-left bg-white rounded-md shadow p-5 border border-gray-200 hover:shadow-md transition'
									>
										<div className='mb-2'>
											<h3 className='font-semibold text-blue-700 text-lg mb-1'>
												{getCompanyName(company)}
											</h3>
											{location && (
												<div className='text-sm text-gray-600 mb-2'>
													📍 {location}
												</div>
											)}
										</div>

										{description && (
											<p className='text-sm text-gray-600 mb-3 line-clamp-3'>
												{description}
											</p>
										)}

										{/* Показываем категории если есть */}
										{company.categories && company.categories.length > 0 && (
											<div className='mb-3'>
												<div className='text-xs text-gray-500 mb-1'>
													Категорії:
												</div>
												<div className='flex flex-wrap gap-1'>
													{company.categories
														.slice(0, 3)
														.map((cat: any, index: number) => (
															<span
																key={index}
																className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs'
															>
																{getName(cat)}
															</span>
														))}
													{company.categories.length > 3 && (
														<span className='text-xs text-gray-500'>
															+{company.categories.length - 3}
														</span>
													)}
												</div>
											</div>
										)}

										<div className='mt-auto text-xs text-blue-600 font-medium'>
											{t.details} →
										</div>
									</a>
								)
							})}
							{companies.length === 0 && !loading && (
								<div className='text-center text-gray-500 py-8 col-span-full'>
									Компанії не знайдено
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
