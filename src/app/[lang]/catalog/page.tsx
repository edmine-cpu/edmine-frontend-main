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
interface BidItem {
	id: number
	title_uk?: string
	title_en?: string
	title_pl?: string
	title_fr?: string
	title_de?: string
	description_uk?: string
	description_en?: string
	description_pl?: string
	description_fr?: string
	description_de?: string
	city?: number | null
	country_id?: number
	categories?: number[]
	under_categories?: number[]
	created_at?: string
	budget?: string
	budget_type?: string
	slug_uk?: string
	slug_en?: string
	slug_pl?: string
	slug_fr?: string
	slug_de?: string
}
interface Company {
	id: number
	name: string
	description_uk?: string
	description_en?: string
	description_pl?: string
	description_fr?: string
	description_de?: string
	city?: string
	country?: string
	slug_name?: string
	owner_id?: number
}

const T = {
	uk: {
		title: 'Каталог',
		orders: 'Замовлення',
		companies: 'Компанії',
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
		title: 'Catalog',
		orders: 'Orders',
		companies: 'Companies',
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
		title: 'Katalog',
		orders: 'Zlecenia',
		companies: 'Firmy',
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
		title: 'Catalogue',
		orders: 'Demandes',
		companies: 'Entreprises',
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
		title: 'Katalog',
		orders: 'Aufträge',
		companies: 'Unternehmen',
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

export default function CatalogPage({
	params,
	searchParams,
}: {
	params: Promise<{ lang: string }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedParams = React.use(params)
	const resolvedSearchParams = searchParams ? React.use(searchParams) : {}
	const lang = ((resolvedParams.lang as string) || 'en') as Lang
	const t = T[lang]
	const router = useRouter()

	const searchQuery = (resolvedSearchParams.search as string) || ''

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [countries, setCountries] = useState<Country[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [bids, setBids] = useState<BidItem[]>([])
	const [companies, setCompanies] = useState<Company[]>([])

	const [filters, setFilters] = useState({
		category: '',
		subcategory: '',
		country: '',
		city: '',
		sort: 'relevance',
		search: searchQuery,
	})

	const [activeTab, setActiveTab] = useState<
		'orders' | 'companies' | 'services'
	>('orders')

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

	useEffect(() => {
		if (activeTab === 'orders') {
			const params = new URLSearchParams()
			if (filters.category) params.set('category', filters.category)
			if (filters.subcategory) params.set('subcategory', filters.subcategory)
			if (filters.country) params.set('country', filters.country)
			if (filters.city) params.set('city', filters.city)
			if (filters.sort) params.set('sort', filters.sort)
			if (filters.search) params.set('search', filters.search)

			fetch(`${API_ENDPOINTS.bids}?${params.toString()}`)
				.then(res => res.json())
				.then(data => {
					if (typeof data === 'object' && !Array.isArray(data)) {
						setBids(Object.values(data))
					} else if (Array.isArray(data)) {
						setBids(data)
					} else {
						setBids([])
					}
				})
				.catch(console.error)
		}
	}, [filters, activeTab])

	useEffect(() => {
		if (activeTab === 'companies') {
			const params = new URLSearchParams()
			params.set('limit', '20')
			params.set('offset', '0')

			if (filters.search) params.set('search', filters.search)

			fetch(`${API_ENDPOINTS.companies}?${params.toString()}`)
				.then(res => res.json())
				.then(data => {
					if (Array.isArray(data)) {
						setCompanies(data)
					} else {
						setCompanies([])
					}
				})
				.catch(console.error)
		}
	}, [filters, activeTab])

	// Утилиты для получения переводов
	const getName = (obj: any) =>
		obj?.[`name_${lang}`] ?? obj?.name_en ?? obj?.name_uk ?? ''
	const getTitle = (obj: any) =>
		obj?.[`title_${lang}`] ?? obj?.title_en ?? obj?.title_uk ?? ''
	const getDescription = (obj: any) =>
		obj?.[`description_${lang}`] ??
		obj?.description_en ??
		obj?.description_uk ??
		''
	const getSlug = (obj: any) =>
		obj?.[`slug_${lang}`] ?? obj?.slug_en ?? obj?.slug_uk ?? ''

	// Функции для получения названий по ID
	const getCategoryNames = (ids?: number[]) => {
		if (!ids || ids.length === 0) return ''
		return ids
			.map(id => {
				const category = categories.find(c => c.id === id)
				if (!category) return ''
				return getName(category)
			})
			.filter(Boolean)
			.join(', ')
	}

	const getSubcategoryNames = (ids?: number[]) => {
		if (!ids || ids.length === 0) return ''
		return ids
			.map(id => {
				const subcategory = subcategories.find(s => s.id === id)
				if (!subcategory) return ''
				return getName(subcategory)
			})
			.filter(Boolean)
			.join(', ')
	}

	const getCountryName = (id?: number) => {
		if (!id) return ''
		const country = countries.find(c => c.id === id)
		if (!country) return ''
		return getName(country)
	}

	const getCityName = (id?: number | null) => {
		if (!id) return ''
		const city = cities.find(c => c.id === id)
		if (!city) return ''
		return getName(city)
	}

	const getLocationString = (cityId?: number | null, countryId?: number) => {
		const cityName = getCityName(cityId)
		const countryName = getCountryName(countryId)

		if (cityName && countryName) {
			return `${cityName}, ${countryName}`
		} else if (countryName) {
			return countryName
		} else {
			return t.anyRegions
		}
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang={lang} />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-6xl'>
					<h1 className='text-2xl font-semibold text-center text-red-600 mb-6'>
						{t.title}
					</h1>

					<div className='flex justify-start gap-3 mb-6'>
						<button
							onClick={() => setActiveTab('orders')}
							className={`px-4 py-2 rounded-md font-semibold ${
								activeTab === 'orders'
									? 'bg-red-600 text-white'
									: 'bg-white border text-gray-700'
							}`}
						>
							{t.orders}
						</button>
						<button
							onClick={() => setActiveTab('companies')}
							className={`px-4 py-2 rounded-md font-semibold ${
								activeTab === 'companies'
									? 'bg-red-600 text-white'
									: 'bg-white border text-gray-700'
							}`}
						>
							{t.companies}
						</button>
						<button
							className='px-4 py-2 rounded-md bg-white border font-semibold text-gray-400'
							disabled
						>
							{t.services}
						</button>
					</div>

					<section className='bg-gray-100 rounded-md p-4 mb-6'>
						{/* Поле поиска */}
						<div className='mb-4'>
							<label className='block text-sm text-gray-700 mb-1'>
								{t.search}
							</label>
							<input
								type='text'
								value={filters.search}
								onChange={e =>
									setFilters(f => ({ ...f, search: e.target.value }))
								}
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

										if (categoryId) {
											const category = categories.find(
												cat => String(cat.id) === categoryId
											)
											if (category) {
												const categoryName = getName(category)
													.toLowerCase()
													.replace(/\s+/g, '-')
												window.history.pushState(
													null,
													'',
													`/${lang}/catalog/${categoryName}`
												)
											}
										} else {
											window.history.pushState(null, '', `/${lang}/catalog`)
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
									onChange={e =>
										setFilters(f => ({ ...f, subcategory: e.target.value }))
									}
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

					{/* Контент для заявок - НЕ ТРОГАЮ */}
					{activeTab === 'orders' && (
						<div className='space-y-3'>
							{bids.map(bid => {
								const d = bid.created_at ? new Date(bid.created_at) : null
								const dateStr = d
									? `${String(d.getHours()).padStart(2, '0')}:${String(
											d.getMinutes()
									  ).padStart(2, '0')} · ${String(d.getDate()).padStart(
											2,
											'0'
									  )}.${String(d.getMonth() + 1).padStart(
											2,
											'0'
									  )}.${d.getFullYear()}`
									: ''

								const categoryNames = getCategoryNames(bid.categories)
								const subcategoryNames = getSubcategoryNames(
									bid.under_categories
								)

								const bidSlug = getSlug(bid) || `bid-${bid.id}`
								const bidUrl = `/${lang}/catalog/order/${bidSlug}`

								const location = getLocationString(bid.city, bid.country_id)

								return (
									<div
										key={bid.id}
										className='bg-white rounded-sm shadow p-4 border border-gray-200'
									>
										<div className='flex justify-between items-start mb-2'>
											<h3 className='text-blue-700 font-semibold pr-4'>
												{getTitle(bid) || '—'}
											</h3>
											<span className='text-xs text-gray-500 whitespace-nowrap'>
												{dateStr}
											</span>
										</div>

										<div className='text-xs text-gray-600 mb-2 space-y-1'>
											{categoryNames && (
												<div>
													<span className='font-medium'>Категорія:</span>{' '}
													{categoryNames}
												</div>
											)}
											{subcategoryNames && (
												<div>
													<span className='font-medium'>Підкатегорія:</span>{' '}
													{subcategoryNames}
												</div>
											)}
										</div>

										<p className='text-gray-700 mb-3'>{getDescription(bid)}</p>

										<div className='flex items-center justify-between text-sm text-gray-600'>
											<div className='flex items-center space-x-2'>
												<span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs'>
													📍 {location}
												</span>
												{bid.budget && bid.budget_type && (
													<span className='bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium'>
														💰 {bid.budget} {bid.budget_type}
													</span>
												)}
											</div>
											<a
												href={bidUrl}
												className='px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors inline-block'
											>
												{t.details}
											</a>
										</div>
									</div>
								)
							})}
							{bids.length === 0 && (
								<div className='text-center text-gray-500 py-8'>—</div>
							)}
						</div>
					)}

					{/* Контент для компаний */}
					{activeTab === 'companies' && (
						<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
							{companies.map(company => {
								const description = getDescription(company)
								const location =
									company.city && company.country
										? `${company.city}, ${company.country}`
										: company.city || company.country || ''

								const companyUrl = `/${lang}/kompanii/${company.slug_name}/${company.id}`

								return (
									<a
										key={company.id}
										href={companyUrl}
										className='block text-left bg-white rounded-md shadow p-5 border border-gray-200 hover:shadow-md transition'
									>
										<div className='mb-2'>
											<h3 className='font-semibold text-blue-700 text-lg mb-1'>
												{company.name}
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

										<div className='mt-auto text-xs text-blue-600 font-medium'>
											{t.details} →
										</div>
									</a>
								)
							})}
							{companies.length === 0 && (
								<div className='text-center text-gray-500 py-8 col-span-full'>
									—
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
