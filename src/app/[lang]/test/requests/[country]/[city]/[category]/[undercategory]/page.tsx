'use client'

import { Header } from '@/components/Header/Header'
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
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
	slug_uk?: string
	slug_en?: string
	slug_pl?: string
	slug_fr?: string
	slug_de?: string
}

interface City {
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

interface BidItem {
	title: string
	subcprice: string
	cost: number
	category: number[]
	undercategory: number[]
	country: string
	city: string
	slug: string
	owner_id: number
}

interface ApiResponse {
	country: string | null
	city: string | null
	category: string | null
	subcategory: string | null
	lang_search: string
	min_cost: number
	max_cost: number
	results: BidItem[]
	total: number
}

const T = {
	uk: {
		title: 'Заявки',
		companies: 'Компанії',
		filters: 'Фільтри',
		category: 'Категорія',
		subcategory: 'Підкатегорія',
		country: 'Країна',
		city: 'Місто',
		search: 'Пошук',
		searchPlaceholder: 'Введіть ключові слова для пошуку...',
		minCost: 'Мін. ціна',
		maxCost: 'Макс. ціна',
		details: 'Детальніше',
		allCategories: 'Всі категорії',
		anyRegions: 'Будь-які регіони',
		allCountries: 'Всі країни',
		allCities: 'Всі міста',
		noResults: 'Заявки не знайдено',
		applyFilters: 'Застосувати',
		resetFilters: 'Скинути',
		backToAll: 'Всі заявки',
		totalResults: 'Знайдено',
	},
	en: {
		title: 'Requests',
		companies: 'Companies',
		filters: 'Filters',
		category: 'Category',
		subcategory: 'Subcategory',
		country: 'Country',
		city: 'City',
		search: 'Search',
		searchPlaceholder: 'Enter keywords to search...',
		minCost: 'Min. price',
		maxCost: 'Max. price',
		details: 'Details',
		allCategories: 'All categories',
		anyRegions: 'Any regions',
		allCountries: 'All countries',
		allCities: 'All cities',
		noResults: 'No requests found',
		applyFilters: 'Apply',
		resetFilters: 'Reset',
		backToAll: 'All requests',
		totalResults: 'Found',
	},
	pl: {
		title: 'Zlecenia',
		companies: 'Firmy',
		filters: 'Filtry',
		category: 'Kategoria',
		subcategory: 'Podkategoria',
		country: 'Kraj',
		city: 'Miasto',
		search: 'Szukaj',
		searchPlaceholder: 'Wpisz słowa kluczowe...',
		minCost: 'Min. cena',
		maxCost: 'Maks. cena',
		details: 'Szczegóły',
		allCategories: 'Wszystkie kategorie',
		anyRegions: 'Dowolne regiony',
		allCountries: 'Wszystkie kraje',
		allCities: 'Wszystkie miasta',
		noResults: 'Nie znaleziono zleceń',
		applyFilters: 'Zastosuj',
		resetFilters: 'Resetuj',
		backToAll: 'Wszystkie zlecenia',
		totalResults: 'Znaleziono',
	},
	fr: {
		title: 'Demandes',
		companies: 'Entreprises',
		filters: 'Filtres',
		category: 'Catégorie',
		subcategory: 'Sous-catégorie',
		country: 'Pays',
		city: 'Ville',
		search: 'Recherche',
		searchPlaceholder: 'Entrez des mots-clés...',
		minCost: 'Prix min.',
		maxCost: 'Prix max.',
		details: 'Détails',
		allCategories: 'Toutes les catégories',
		anyRegions: 'Toutes régions',
		allCountries: 'Tous les pays',
		allCities: 'Toutes les villes',
		noResults: 'Aucune demande trouvée',
		applyFilters: 'Appliquer',
		resetFilters: 'Réinitialiser',
		backToAll: 'Toutes les demandes',
		totalResults: 'Trouvé',
	},
	de: {
		title: 'Aufträge',
		companies: 'Unternehmen',
		filters: 'Filter',
		category: 'Kategorie',
		subcategory: 'Unterkategorie',
		country: 'Land',
		city: 'Stadt',
		search: 'Suche',
		searchPlaceholder: 'Suchbegriffe eingeben...',
		minCost: 'Min. Preis',
		maxCost: 'Max. Preis',
		details: 'Details',
		allCategories: 'Alle Kategorien',
		anyRegions: 'Beliebige Regionen',
		allCountries: 'Alle Länder',
		allCities: 'Alle Städte',
		noResults: 'Keine Aufträge gefunden',
		applyFilters: 'Anwenden',
		resetFilters: 'Zurücksetzen',
		backToAll: 'Alle Aufträge',
		totalResults: 'Gefunden',
	},
} as const

type Params = {
	lang: string
	country: string
	city: string
	category: string
	undercategory: string
}

export default function RequestsFilteredPage({
	params,
	searchParams,
}: {
	params: Promise<Params>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedParams = React.use(params)
	const resolvedSearchParams = searchParams ? React.use(searchParams) : {}

	const { lang, country, city, category, undercategory } = resolvedParams
	const langTyped = ((lang as string) || 'en') as Lang
	const t = T[langTyped]
	const router = useRouter()

	const searchQuery = (resolvedSearchParams.search as string) || ''
	const minCost = (resolvedSearchParams.min_cost as string) || ''
	const maxCost = (resolvedSearchParams.max_cost as string) || ''

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [countries, setCountries] = useState<Country[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [bids, setBids] = useState<BidItem[]>([])
	const [loading, setLoading] = useState(false)
	const [total, setTotal] = useState(0)

	// Direct input - no debounce, user applies manually
	const [searchInput, setSearchInput] = useState(searchQuery)
	const [minCostInput, setMinCostInput] = useState(minCost)
	const [maxCostInput, setMaxCostInput] = useState(maxCost)

	// Load initial data
	useEffect(() => {
		Promise.all([
			fetch(`${API_BASE_URL}/check/categories`),
			fetch(`${API_BASE_URL}/check/subcategories`),
			fetch(`${API_BASE_URL}/api/country`),
			fetch(`${API_BASE_URL}/api/city`),
		])
			.then(async ([c1, s1, c2, c3]) => {
				setCategories(await c1.json())
				setSubcategories(await s1.json())
				setCountries(await c2.json())
				setCities(await c3.json())
			})
			.catch(console.error)
	}, [])

	// Find IDs from slugs
	const getCategoryIdFromSlug = (slug: string): string | null => {
		if (slug === 'all' || !slug) return null
		const cat = categories.find(
			c =>
				c[`slug_${langTyped}`] === slug ||
				c[`name_${langTyped}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return cat ? String(cat.id) : null
	}

	const getSubcategoryIdFromSlug = (slug: string): string | null => {
		if (slug === 'all' || !slug) return null
		const subcat = subcategories.find(
			s =>
				s[`name_${langTyped}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return subcat ? String(subcat.id) : null
	}

	const getCountryIdFromSlug = (slug: string): string | null => {
		if (slug === 'all' || !slug) return null
		const country = countries.find(
			c =>
				c[`slug_${langTyped}`] === slug ||
				c[`name_${langTyped}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return country ? String(country.id) : null
	}

	const getCityIdFromSlug = (slug: string): string | null => {
		if (slug === 'all' || !slug) return null
		const city = cities.find(
			c =>
				c[`slug_${langTyped}`] === slug ||
				c[`name_${langTyped}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return city ? String(city.id) : null
	}

	// Get names from slugs
	const getCategoryName = (slug: string): string => {
		if (slug === 'all') return t.allCategories
		const cat = categories.find(
			c =>
				c[`slug_${langTyped}`] === slug ||
				c[`name_${langTyped}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return cat?.[`name_${langTyped}`] || cat?.name_en || slug
	}

	const getSubcategoryName = (slug: string): string => {
		if (slug === 'all') return t.allCategories
		const subcat = subcategories.find(
			s =>
				s[`name_${langTyped}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return subcat?.[`name_${langTyped}`] || subcat?.name_en || slug
	}

	const getCountryName = (slug: string): string => {
		if (slug === 'all') return t.allCountries
		const country = countries.find(
			c =>
				c[`slug_${langTyped}`] === slug ||
				c[`name_${langTyped}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return country?.[`name_${langTyped}`] || country?.name_en || slug
	}

	const getCityName = (slug: string): string => {
		if (slug === 'all') return t.allCities
		const city = cities.find(
			c =>
				c[`slug_${langTyped}`] === slug ||
				c[`name_${langTyped}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return city?.[`name_${langTyped}`] || city?.name_en || slug
	}

	// Get name by ID for display
	const getCategoryNameById = (id: string) => {
		const cat = categories.find(c => String(c.id) === id)
		return cat?.[`name_${langTyped}`] || cat?.name_en || ''
	}

	const getSubcategoryNameById = (id: string) => {
		const subcat = subcategories.find(s => String(s.id) === id)
		return subcat?.[`name_${langTyped}`] || subcat?.name_en || ''
	}

	// Fetch bids with pathname and query filters
	useEffect(() => {
		if (
			categories.length === 0 ||
			subcategories.length === 0 ||
			countries.length === 0 ||
			cities.length === 0
		) {
			return
		}

		setLoading(true)

		// Build API params from pathname
		const apiParams = new URLSearchParams()
		apiParams.set('language', langTyped)

		// Convert slugs to IDs/names for API
		const categoryId = getCategoryIdFromSlug(category)
		const subcategoryId = getSubcategoryIdFromSlug(undercategory)
		const countryId = getCountryIdFromSlug(country)
		const cityId = getCityIdFromSlug(city)

		// Get actual names for API (API expects names like "Ukraine", not IDs)
		if (countryId) {
			const countryObj = countries.find(c => String(c.id) === countryId)
			if (countryObj) {
				apiParams.set(
					'country',
					countryObj.name_en || countryObj.name_uk || ''
				)
			}
		}

		if (cityId) {
			const cityObj = cities.find(c => String(c.id) === cityId)
			if (cityObj) {
				apiParams.set('city', cityObj.name_en || cityObj.name_uk || '')
			}
		}

		if (categoryId) {
			const categoryObj = categories.find(c => String(c.id) === categoryId)
			if (categoryObj) {
				apiParams.set('category', categoryObj.name_en || categoryObj.name || '')
			}
		}

		if (subcategoryId) {
			const subcategoryObj = subcategories.find(
				s => String(s.id) === subcategoryId
			)
			if (subcategoryObj) {
				apiParams.set(
					'subcategory',
					subcategoryObj.name_en || subcategoryObj.name_uk || ''
				)
			}
		}

		// Add query params
		if (searchQuery) apiParams.set('search', searchQuery)
		if (minCost) apiParams.set('min_cost', minCost)
		if (maxCost) apiParams.set('max_cost', maxCost)

		fetch(`${API_ENDPOINTS.bidsV2}/?${apiParams.toString()}`)
			.then(res => res.json())
			.then((data: ApiResponse) => {
				setBids(data.results || [])
				setTotal(data.total || 0)
			})
			.catch(console.error)
			.finally(() => setLoading(false))
	}, [
		langTyped,
		category,
		undercategory,
		country,
		city,
		searchQuery,
		minCost,
		maxCost,
		categories,
		subcategories,
		countries,
		cities,
	])

	// Update query params in URL when manually triggered
	const updateQueryParams = () => {
		const queryParams = new URLSearchParams()
		if (searchInput) queryParams.set('search', searchInput)
		if (minCostInput) queryParams.set('min_cost', minCostInput)
		if (maxCostInput) queryParams.set('max_cost', maxCostInput)

		const queryString = queryParams.toString()
		const newUrl = `/${langTyped}/test/requests/${country}/${city}/${category}/${undercategory}${
			queryString ? '?' + queryString : ''
		}`
		router.push(newUrl)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang={langTyped} />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-6xl'>
					{/* Header */}
					<div className='mb-6'>
						<div className='flex justify-between items-center mb-3'>
							<h1 className='text-2xl font-semibold text-red-600'>{t.title}</h1>
							<div className='flex gap-3'>
								<button
									onClick={() => router.push(`/${langTyped}/test/requests`)}
									className='px-4 py-2 rounded-md bg-red-600 text-white font-semibold'
								>
									{t.title}
								</button>
								<button
									onClick={() => router.push(`/${langTyped}/test/company`)}
									className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold'
								>
									{t.companies}
								</button>
							</div>
						</div>

						{/* Breadcrumbs - Active Filters */}
						<div className='flex flex-wrap gap-2 items-center'>
							<button
								onClick={() => router.push(`/${langTyped}/test/requests`)}
								className='text-sm text-gray-600 hover:text-red-600 hover:underline'
							>
								{t.title}
							</button>
							<span className='text-gray-400'>/</span>

							{country !== 'all' && (
								<>
									<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200'>
										{getCountryName(country)}
									</span>
									<span className='text-gray-400'>/</span>
								</>
							)}

							{city !== 'all' && (
								<>
									<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200'>
										{getCityName(city)}
									</span>
									<span className='text-gray-400'>/</span>
								</>
							)}

							{category !== 'all' && (
								<>
									<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200'>
										{getCategoryName(category)}
									</span>
									{undercategory !== 'all' && (
										<>
											<span className='text-gray-400'>/</span>
											<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200'>
												{getSubcategoryName(undercategory)}
											</span>
										</>
									)}
								</>
							)}
						</div>
					</div>

					{/* Filters Section - Query params only */}
					<section className='bg-gray-100 rounded-md p-4 mb-6'>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='text-lg font-semibold'>{t.filters}</h2>
							<button
								onClick={() => router.push(`/${langTyped}/test/requests`)}
								className='text-sm text-red-600 hover:text-red-700 font-semibold'
							>
								← {t.backToAll}
							</button>
						</div>

						{/* Search */}
						<div className='mb-4'>
							<label className='block text-sm text-gray-700 mb-1'>
								{t.search}
							</label>
							<input
								type='text'
								value={searchInput}
								onChange={e => setSearchInput(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										updateQueryParams()
									}
								}}
								placeholder={t.searchPlaceholder}
								className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'
							/>
						</div>

						{/* Price Range */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.minCost}
								</label>
								<input
									type='number'
									value={minCostInput}
									onChange={e => setMinCostInput(e.target.value)}
									onKeyDown={e => {
										if (e.key === 'Enter') {
											updateQueryParams()
										}
									}}
									placeholder='0'
									className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'
								/>
							</div>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.maxCost}
								</label>
								<input
									type='number'
									value={maxCostInput}
									onChange={e => setMaxCostInput(e.target.value)}
									onKeyDown={e => {
										if (e.key === 'Enter') {
											updateQueryParams()
										}
									}}
									placeholder='10000'
									className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'
								/>
							</div>
						</div>

						{/* Apply Button */}
						<div>
							<button
								onClick={updateQueryParams}
								className='px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700'
							>
								{t.applyFilters}
							</button>
						</div>
					</section>

					{/* Loading indicator */}
					{loading && (
						<div className='text-center py-8'>
							<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600'></div>
						</div>
					)}

					{/* Results */}
					{!loading && (
						<div className='space-y-3'>
							<div className='text-sm text-gray-600 mb-2'>
								{t.totalResults}: {total} {t.title.toLowerCase()}
							</div>
							{bids.map((bid, index) => (
								<div
									key={`${bid.slug}-${index}`}
									className='bg-white rounded-sm shadow p-4 border border-gray-200'
								>
									<div className='flex justify-between items-start mb-2'>
										<h3 className='text-blue-700 font-semibold pr-4'>
											{bid.title}
										</h3>
										<span className='text-lg font-bold text-green-600'>
											${bid.cost}
										</span>
									</div>

									<div className='text-xs text-gray-600 mb-2'>
										<div>
											<span className='font-medium'>{t.category}:</span>{' '}
											{bid.category
												.map(id => getCategoryNameById(String(id)))
												.join(', ')}
										</div>
										{bid.undercategory.length > 0 && (
											<div>
												<span className='font-medium'>{t.subcategory}:</span>{' '}
												{bid.undercategory
													.map(id => getSubcategoryNameById(String(id)))
													.join(', ')}
											</div>
										)}
									</div>

									<div className='flex items-center justify-between text-sm text-gray-600'>
										<div className='flex items-center space-x-2'>
											<span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs'>
												📍 {bid.city}, {bid.country}
											</span>
										</div>
										<a
											href={`/${langTyped}/test/requests/order/${bid.slug}`}
											className='px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors inline-block'
										>
											{t.details}
										</a>
									</div>
								</div>
							))}
							{bids.length === 0 && !loading && (
								<div className='text-center text-gray-500 py-8'>
									{t.noResults}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
