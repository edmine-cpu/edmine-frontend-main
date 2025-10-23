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

interface CompanyItem {
	name: string
	description?: string
	category_ids?: number[]
	subcategory_ids?: number[]
	country?: string
	city?: string
	slug: string
	owner_id: number
}

interface ApiResponse {
	country: string | null
	city: string | null
	category: string | null
	subcategory: string | null
	country_id: number | null
	city_id: number | null
	category_id: number | null
	subcategory_id: number | null
	lang_search: string
	results: CompanyItem[]
	total: number
}

const T = {
	uk: {
		title: 'Компанії',
		requests: 'Заявки',
		filters: 'Фільтри',
		category: 'Категорія',
		subcategory: 'Підкатегорія',
		country: 'Країна',
		city: 'Місто',
		search: 'Пошук',
		searchPlaceholder: 'Введіть ключові слова для пошуку...',
		details: 'Детальніше',
		sort: 'Сортування',
		byRelevance: 'За релевантністю',
		byDate: 'За датою',
		recent: 'Нові',
		allCategories: 'Всі категорії',
		anyRegions: 'Будь-які регіони',
		allCountries: 'Всі країни',
		allCities: 'Всі міста',
		noResults: 'Компанії не знайдено',
		applyFilters: 'Застосувати',
		resetFilters: 'Скинути',
		totalResults: 'Знайдено',
	},
	en: {
		title: 'Companies',
		requests: 'Requests',
		filters: 'Filters',
		category: 'Category',
		subcategory: 'Subcategory',
		country: 'Country',
		city: 'City',
		search: 'Search',
		searchPlaceholder: 'Enter keywords to search...',
		details: 'Details',
		sort: 'Sort',
		byRelevance: 'By relevance',
		byDate: 'By date',
		recent: 'Recent',
		allCategories: 'All categories',
		anyRegions: 'Any regions',
		allCountries: 'All countries',
		allCities: 'All cities',
		noResults: 'No companies found',
		applyFilters: 'Apply',
		resetFilters: 'Reset',
		totalResults: 'Found',
	},
	pl: {
		title: 'Firmy',
		requests: 'Zlecenia',
		filters: 'Filtry',
		category: 'Kategoria',
		subcategory: 'Podkategoria',
		country: 'Kraj',
		city: 'Miasto',
		search: 'Szukaj',
		searchPlaceholder: 'Wpisz słowa kluczowe...',
		details: 'Szczegóły',
		sort: 'Sortowanie',
		byRelevance: 'Według trafności',
		byDate: 'Po dacie',
		recent: 'Najnowsze',
		allCategories: 'Wszystkie kategorie',
		anyRegions: 'Dowolne regiony',
		allCountries: 'Wszystkie kraje',
		allCities: 'Wszystkie miasta',
		noResults: 'Nie znaleziono firm',
		applyFilters: 'Zastosuj',
		resetFilters: 'Resetuj',
		totalResults: 'Znaleziono',
	},
	fr: {
		title: 'Entreprises',
		requests: 'Demandes',
		filters: 'Filtres',
		category: 'Catégorie',
		subcategory: 'Sous-catégorie',
		country: 'Pays',
		city: 'Ville',
		search: 'Recherche',
		searchPlaceholder: 'Entrez des mots-clés...',
		details: 'Détails',
		sort: 'Tri',
		byRelevance: 'Par pertinence',
		byDate: 'Par date',
		recent: 'Récents',
		allCategories: 'Toutes les catégories',
		anyRegions: 'Toutes régions',
		allCountries: 'Tous les pays',
		allCities: 'Toutes les villes',
		noResults: 'Aucune entreprise trouvée',
		applyFilters: 'Appliquer',
		resetFilters: 'Réinitialiser',
		totalResults: 'Trouvé',
	},
	de: {
		title: 'Unternehmen',
		requests: 'Aufträge',
		filters: 'Filter',
		category: 'Kategorie',
		subcategory: 'Unterkategorie',
		country: 'Land',
		city: 'Stadt',
		search: 'Suche',
		searchPlaceholder: 'Suchbegriffe eingeben...',
		details: 'Details',
		sort: 'Sortierung',
		byRelevance: 'Nach Relevanz',
		byDate: 'Nach Datum',
		recent: 'Neu',
		allCategories: 'Alle Kategorien',
		anyRegions: 'Beliebige Regionen',
		allCountries: 'Alle Länder',
		allCities: 'Alle Städte',
		noResults: 'Keine Unternehmen gefunden',
		applyFilters: 'Anwenden',
		resetFilters: 'Zurücksetzen',
		totalResults: 'Gefunden',
	},
} as const

export default function CompaniesPage({
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
	const [companies, setCompanies] = useState<CompanyItem[]>([])
	const [loading, setLoading] = useState(false)
	const [total, setTotal] = useState(0)

	const [filters, setFilters] = useState({
		category: '',
		subcategory: '',
		country: '',
		city: '',
		search: searchQuery,
		sort: 'relevance',
	})

	// Direct search input without debounce - user will apply manually
	const [searchInput, setSearchInput] = useState(searchQuery)

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

	const filteredSubcategories = useMemo(() => {
		if (!filters.category) return []
		const list = Array.isArray(subcategories) ? subcategories : []
		return list.filter(
			(s: any) =>
				String(s.full_category_id ?? s.full_category) === filters.category
		)
	}, [filters.category, subcategories])

	const filteredCities = useMemo(() => {
		if (!filters.country) return []
		return cities.filter(c => String(c.country_id) === filters.country)
	}, [filters.country, cities])

	// Helper to create safe slug from text
	const createSlug = (text: string): string => {
		if (!text) return 'all'
		const result = text
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '')
		return result && result.length > 0 ? result : 'all'
	}

	// Get slug for category - returns 'all' if not found
	const getCategorySlug = (categoryId: string) => {
		if (!categoryId) return 'all'
		const category = categories.find(cat => String(cat.id) === categoryId)
		if (!category) return 'all'

		// Try slug first, then English name (fallback for non-latin chars)
		const slug =
			category[`slug_${lang}`] ||
			category.slug_en ||
			category.name_en ||
			category[`name_${lang}`] ||
			''
		return createSlug(slug)
	}

	// Get slug for subcategory - returns 'all' if not found
	const getSubcategorySlug = (subcategoryId: string) => {
		if (!subcategoryId) return 'all'
		const subcategory = subcategories.find(
			sub => String(sub.id) === subcategoryId
		)
		if (!subcategory) return 'all'

		// Use English name as fallback for non-latin chars
		const name = subcategory.name_en || subcategory[`name_${lang}`] || ''
		return createSlug(name)
	}

	// Get slug for country - returns 'all' if not found
	const getCountrySlug = (countryId: string) => {
		if (!countryId) return 'all'
		const country = countries.find(c => String(c.id) === countryId)
		if (!country) return 'all'

		// Try slug first, then English name
		const slug =
			country[`slug_${lang}`] ||
			country.slug_en ||
			country.name_en ||
			country[`name_${lang}`] ||
			''
		return createSlug(slug)
	}

	// Get slug for city - returns 'all' if not found
	const getCitySlug = (cityId: string) => {
		if (!cityId) return 'all'
		const city = cities.find(c => String(c.id) === cityId)
		if (!city) return 'all'

		// Try slug first, then English name
		const slug =
			city[`slug_${lang}`] || city.slug_en || city.name_en || city[`name_${lang}`] || ''
		return createSlug(slug)
	}

	// Get name by ID
	const getCategoryName = (id: string) => {
		const category = categories.find(c => String(c.id) === id)
		return category?.[`name_${lang}`] || category?.name_en || ''
	}

	const getSubcategoryName = (id: string) => {
		const subcategory = subcategories.find(s => String(s.id) === id)
		return subcategory?.[`name_${lang}`] || subcategory?.name_en || ''
	}

	const getCountryName = (id: string) => {
		const country = countries.find(c => String(c.id) === id)
		return country?.[`name_${lang}`] || country?.name_en || ''
	}

	const getCityName = (id: string) => {
		const city = cities.find(c => String(c.id) === id)
		return city?.[`name_${lang}`] || city?.name_en || ''
	}

	// Apply filters - just fetch data without navigation
	const applyFilters = () => {
		// Update filters with search input
		const updatedFilters = { ...filters, search: searchInput }
		setFilters(updatedFilters)

		// Fetch with new filters
		fetchCompaniesWithFilters(updatedFilters)

		// Update URL without navigation
		const queryParams = new URLSearchParams()
		if (searchInput) queryParams.set('search', searchInput)
		if (updatedFilters.sort && updatedFilters.sort !== 'relevance')
			queryParams.set('sort', updatedFilters.sort)

		// Always use pathname with 'all' for empty values
		const categorySlug = getCategorySlug(updatedFilters.category)
		const countrySlug = getCountrySlug(updatedFilters.country)
		const citySlug = getCitySlug(updatedFilters.city)
		const subcategorySlug = getSubcategorySlug(updatedFilters.subcategory)

		const path = `/${lang}/test/companies/${countrySlug}/${citySlug}/${categorySlug}/${subcategorySlug}`
		const queryString = queryParams.toString()
		const newUrl = queryString ? `${path}?${queryString}` : path

		// Update URL without page reload
		window.history.pushState({}, '', newUrl)
	}

	// Fetch companies with given filters
	const fetchCompaniesWithFilters = (filterParams: typeof filters) => {
		setLoading(true)
		const apiParams = new URLSearchParams()
		apiParams.set('language', lang)

		// Add all filters - send IDs to API
		if (filterParams.category) {
			apiParams.set('category_id', filterParams.category)
		}
		if (filterParams.subcategory) {
			apiParams.set('subcategory_id', filterParams.subcategory)
		}
		if (filterParams.country) {
			apiParams.set('country_id', filterParams.country)
		}
		if (filterParams.city) {
			apiParams.set('city_id', filterParams.city)
		}
		if (filterParams.search) apiParams.set('search', filterParams.search)
		if (filterParams.sort && filterParams.sort !== 'relevance')
			apiParams.set('sort', filterParams.sort)

		fetch(`${API_ENDPOINTS.companiesv2}/?${apiParams.toString()}`)
			.then(res => res.json())
			.then((data: ApiResponse) => {
				setCompanies(data.results || [])
				setTotal(data.total || 0)
			})
			.catch(console.error)
			.finally(() => setLoading(false))
	}

	// Fetch companies function
	const fetchCompanies = () => {
		fetchCompaniesWithFilters(filters)
	}

	// Reset filters
	const resetFilters = () => {
		const emptyFilters = {
			category: '',
			subcategory: '',
			country: '',
			city: '',
			search: '',
			sort: 'relevance',
		}
		setFilters(emptyFilters)
		setSearchInput('')

		// Fetch with empty filters
		fetchCompaniesWithFilters(emptyFilters)

		// Update URL without navigation
		window.history.pushState({}, '', `/${lang}/test/companies/all/all/all/all`)
	}

	// Fetch companies on initial load only
	useEffect(() => {
		if (categories.length > 0 && countries.length > 0) {
			fetchCompanies()
		}
	}, [categories, countries])

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang={lang} />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-6xl'>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-2xl font-semibold text-red-600'>{t.title}</h1>
						<div className='flex gap-3'>
							<button
								onClick={() => router.push(`/${lang}/test/requests`)}
								className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold'
							>
								{t.requests}
							</button>
							<button
								onClick={() => router.push(`/${lang}/test/companies`)}
								className='px-4 py-2 rounded-md bg-red-600 text-white font-semibold'
							>
								{t.title}
							</button>
						</div>
					</div>

					{/* Filters Section */}
					<section className='bg-gray-100 rounded-md p-4 mb-6'>
						<h2 className='text-lg font-semibold mb-4'>{t.filters}</h2>

						{/* Active Filters Display */}
						{(filters.category ||
							filters.subcategory ||
							filters.country ||
							filters.city) && (
							<div className='mb-4 flex flex-wrap gap-2'>
								{filters.country && (
									<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center'>
										{getCountryName(filters.country)}
										<button
											onClick={() =>
												setFilters(f => ({ ...f, country: '', city: '' }))
											}
											className='ml-2 hover:text-blue-900'
										>
											×
										</button>
									</span>
								)}
								{filters.city && (
									<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center'>
										{getCityName(filters.city)}
										<button
											onClick={() => setFilters(f => ({ ...f, city: '' }))}
											className='ml-2 hover:text-blue-900'
										>
											×
										</button>
									</span>
								)}
								{filters.category && (
									<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center'>
										{getCategoryName(filters.category)}
										<button
											onClick={() =>
												setFilters(f => ({
													...f,
													category: '',
													subcategory: '',
												}))
											}
											className='ml-2 hover:text-green-900'
										>
											×
										</button>
									</span>
								)}
								{filters.subcategory && (
									<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center'>
										{getSubcategoryName(filters.subcategory)}
										<button
											onClick={() =>
												setFilters(f => ({ ...f, subcategory: '' }))
											}
											className='ml-2 hover:text-green-900'
										>
											×
										</button>
									</span>
								)}
							</div>
						)}

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
										applyFilters()
									}
								}}
								placeholder={t.searchPlaceholder}
								className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
							{/* Category */}
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.category}
								</label>
								<select
									value={filters.category}
									onChange={e =>
										setFilters(f => ({
											...f,
											category: e.target.value,
											subcategory: '',
										}))
									}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value=''>{t.allCategories}</option>
									{categories.map(c => (
										<option key={c.id} value={String(c.id)}>
											{c[`name_${lang}`] || c.name_en}
										</option>
									))}
								</select>
							</div>

							{/* Subcategory */}
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
									<option value=''>{t.allCategories}</option>
									{filteredSubcategories.map(sc => (
										<option key={sc.id} value={String(sc.id)}>
											{sc[`name_${lang}`] || sc.name_en}
										</option>
									))}
								</select>
							</div>

							{/* Country */}
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
									<option value=''>{t.allCountries}</option>
									{countries.map(c => (
										<option key={c.id} value={String(c.id)}>
											{c[`name_${lang}`] || c.name_en}
										</option>
									))}
								</select>
							</div>

							{/* City */}
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
									<option value=''>{t.allCities}</option>
									{filteredCities.map(c => (
										<option key={c.id} value={String(c.id)}>
											{c[`name_${lang}`] || c.name_en}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Sort */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.sort}
								</label>
								<select
									value={filters.sort}
									onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value='relevance'>{t.byRelevance}</option>
									<option value='date_desc'>{t.byDate} (↓ {t.recent})</option>
									<option value='date_asc'>{t.byDate} (↑ {t.recent})</option>
								</select>
							</div>
						</div>

						{/* Buttons */}
						<div className='flex gap-3'>
							<button
								onClick={applyFilters}
								className='px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700'
							>
								{t.applyFilters}
							</button>
							<button
								onClick={resetFilters}
								className='px-6 py-2 rounded-md bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400'
							>
								{t.resetFilters}
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
							{companies.map((company, index) => (
								<div
									key={`${company.slug}-${index}`}
									className='bg-white rounded-sm shadow p-4 border border-gray-200'
								>
									<div className='flex justify-between items-start mb-2'>
										<h3 className='text-blue-700 font-semibold pr-4'>
											{company.name}
										</h3>
									</div>

									{company.description && (
										<p className='text-sm text-gray-600 mb-2'>
											{company.description}
										</p>
									)}

									<div className='text-xs text-gray-600 mb-2'>
										{company.category_ids && company.category_ids.length > 0 && (
											<div>
												<span className='font-medium'>{t.category}:</span>{' '}
												{company.category_ids
													.map(id => getCategoryName(String(id)))
													.join(', ')}
											</div>
										)}
										{company.subcategory_ids &&
											company.subcategory_ids.length > 0 && (
												<div>
													<span className='font-medium'>{t.subcategory}:</span>{' '}
													{company.subcategory_ids
														.map(id => getSubcategoryName(String(id)))
														.join(', ')}
												</div>
											)}
									</div>

									<div className='flex items-center justify-between text-sm text-gray-600'>
										{(company.city || company.country) && (
											<div className='flex items-center space-x-2'>
												<span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs'>
													📍 {company.city}
													{company.city && company.country && ', '}
													{company.country}
												</span>
											</div>
										)}
										<a
											href={`/${lang}/test/companies/detail/${company.slug}`}
											className='px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors inline-block'
										>
											{t.details}
										</a>
									</div>
								</div>
							))}
							{companies.length === 0 && !loading && (
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
