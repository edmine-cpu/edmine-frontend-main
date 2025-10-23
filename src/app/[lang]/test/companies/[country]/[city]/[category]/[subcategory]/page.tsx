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
		allCategories: 'Всі категорії',
		anyRegions: 'Будь-які регіони',
		allCountries: 'Всі країни',
		allCities: 'Всі міста',
		noResults: 'Компанії не знайдено',
		applyFilters: 'Застосувати',
		resetFilters: 'Скинути',
		backToAll: 'Всі компанії',
		totalResults: 'Знайдено',
		sortBy: 'Сортувати',
		sortDateDesc: 'За датою (↓ Нові)',
		sortDateAsc: 'За датою (↑ Старі)',
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
		allCategories: 'All categories',
		anyRegions: 'Any regions',
		allCountries: 'All countries',
		allCities: 'All cities',
		noResults: 'No companies found',
		applyFilters: 'Apply',
		resetFilters: 'Reset',
		backToAll: 'All companies',
		totalResults: 'Found',
		sortBy: 'Sort by',
		sortDateDesc: 'By date (↓ Newest)',
		sortDateAsc: 'By date (↑ Oldest)',
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
		allCategories: 'Wszystkie kategorie',
		anyRegions: 'Dowolne regiony',
		allCountries: 'Wszystkie kraje',
		allCities: 'Wszystkie miasta',
		noResults: 'Nie znaleziono firm',
		applyFilters: 'Zastosuj',
		resetFilters: 'Resetuj',
		backToAll: 'Wszystkie firmy',
		totalResults: 'Znaleziono',
		sortBy: 'Sortuj według',
		sortDateDesc: 'Po dacie (↓ Najnowsze)',
		sortDateAsc: 'Po dacie (↑ Najstarsze)',
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
		allCategories: 'Toutes les catégories',
		anyRegions: 'Toutes régions',
		allCountries: 'Tous les pays',
		allCities: 'Toutes les villes',
		noResults: 'Aucune entreprise trouvée',
		applyFilters: 'Appliquer',
		resetFilters: 'Réinitialiser',
		backToAll: 'Toutes les entreprises',
		totalResults: 'Trouvé',
		sortBy: 'Trier par',
		sortDateDesc: 'Par date (↓ Récents)',
		sortDateAsc: 'Par date (↑ Anciens)',
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
		allCategories: 'Alle Kategorien',
		anyRegions: 'Beliebige Regionen',
		allCountries: 'Alle Länder',
		allCities: 'Alle Städte',
		noResults: 'Keine Unternehmen gefunden',
		applyFilters: 'Anwenden',
		resetFilters: 'Zurücksetzen',
		backToAll: 'Alle Unternehmen',
		totalResults: 'Gefunden',
		sortBy: 'Sortieren nach',
		sortDateDesc: 'Nach Datum (↓ Neueste)',
		sortDateAsc: 'Nach Datum (↑ Älteste)',
	},
} as const

type Params = {
	lang: string
	country: string
	city: string
	category: string
	subcategory: string
}

export default function CompaniesFilteredPage({
	params,
	searchParams,
}: {
	params: Promise<Params>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedParams = React.use(params)
	const resolvedSearchParams = searchParams ? React.use(searchParams) : {}

	const { lang, country, city, category, subcategory } = resolvedParams
	const langTyped = ((lang as string) || 'en') as Lang
	const t = T[langTyped]
	const router = useRouter()

	const searchQuery = (resolvedSearchParams.search as string) || ''
	const sortParam = (resolvedSearchParams.sort as string) || ''

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [countries, setCountries] = useState<Country[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [companies, setCompanies] = useState<CompanyItem[]>([])
	const [loading, setLoading] = useState(false)
	const [total, setTotal] = useState(0)

	// Direct input - no debounce, user applies manually
	const [searchInput, setSearchInput] = useState(searchQuery)
	const [sortInput, setSortInput] = useState(sortParam)

	// Selected filters for pathname
	const [selectedCategory, setSelectedCategory] = useState(category)
	const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory)
	const [selectedCountry, setSelectedCountry] = useState(country)
	const [selectedCity, setSelectedCity] = useState(city)

	// Sync state with URL params on change
	useEffect(() => {
		setSelectedCategory(category)
		setSelectedSubcategory(subcategory)
		setSelectedCountry(country)
		setSelectedCity(city)
	}, [category, subcategory, country, city])

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

		// Normalize slug to snake_case for comparison with 'name' field
		const normalizedSlug = slug.toLowerCase().replace(/-/g, '_')

		const cat = categories.find(c => {
			// Check slug fields first (if they exist)
			if (c[`slug_${langTyped}`] === slug) return true

			// Check the 'name' field (snake_case)
			if (c.name === normalizedSlug) return true

			// Check localized name converted to kebab-case
			const localizedKebab = c[`name_${langTyped}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')
			if (localizedKebab === slug) return true

			return false
		})

		return cat ? String(cat.id) : null
	}

	const getSubcategoryIdFromSlug = (slug: string): string | null => {
		if (slug === 'all' || !slug) return null

		const subcat = subcategories.find(s => {
			// Check localized name converted to kebab-case
			const localizedKebab = s[`name_${langTyped}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')
			if (localizedKebab === slug) return true

			return false
		})

		return subcat ? String(subcat.id) : null
	}

	const getCountryIdFromSlug = (slug: string): string | null => {
		if (slug === 'all' || !slug) return null

		const country = countries.find(c => {
			// Check slug fields first
			if (c[`slug_${langTyped}`] === slug) return true

			// Check localized name converted to kebab-case
			const localizedKebab = c[`name_${langTyped}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')
			if (localizedKebab === slug) return true

			return false
		})

		return country ? String(country.id) : null
	}

	const getCityIdFromSlug = (slug: string): string | null => {
		if (slug === 'all' || !slug) return null

		const city = cities.find(c => {
			// Check slug fields first
			if (c[`slug_${langTyped}`] === slug) return true

			// Check localized name converted to kebab-case
			const localizedKebab = c[`name_${langTyped}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')
			if (localizedKebab === slug) return true

			return false
		})

		return city ? String(city.id) : null
	}

	// Get names from slugs
	const getCategoryName = (slug: string): string => {
		if (slug === 'all') return t.allCategories

		const normalizedSlug = slug.toLowerCase().replace(/-/g, '_')

		const cat = categories.find(c => {
			if (c[`slug_${langTyped}`] === slug) return true
			if (c.name === normalizedSlug) return true
			const localizedKebab = c[`name_${langTyped}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')
			if (localizedKebab === slug) return true
			return false
		})

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

	// Get slug from ID
	const getCategorySlugById = (id: string): string => {
		if (id === 'all' || !id) return 'all'
		const cat = categories.find(c => String(c.id) === id)
		if (!cat) return 'all'

		// Check slug field first
		const slug = cat[`slug_${langTyped}`]
		if (slug) return slug

		// Convert 'name' field from snake_case to kebab-case
		if (cat.name) return cat.name.replace(/_/g, '-')

		// Fallback to localized name
		return (
			cat[`name_${langTyped}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '') || 'all'
		)
	}

	const getSubcategorySlugById = (id: string): string => {
		if (id === 'all' || !id) return 'all'
		const subcat = subcategories.find(s => String(s.id) === id)
		return (
			subcat?.[`name_${langTyped}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '') || 'all'
		)
	}

	const getCountrySlugById = (id: string): string => {
		if (id === 'all' || !id) return 'all'
		const country = countries.find(c => String(c.id) === id)
		return (
			country?.[`slug_${langTyped}`] ||
			country?.[`name_${langTyped}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '') ||
			'all'
		)
	}

	const getCitySlugById = (id: string): string => {
		if (id === 'all' || !id) return 'all'
		const city = cities.find(c => String(c.id) === id)
		return (
			city?.[`slug_${langTyped}`] ||
			city?.[`name_${langTyped}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '') ||
			'all'
		)
	}

	// Get filtered subcategories based on selected category
	const filteredSubcategories = useMemo(() => {
		if (selectedCategory === 'all' || !selectedCategory) return subcategories
		const categoryId = getCategoryIdFromSlug(selectedCategory)
		if (!categoryId) return subcategories
		return subcategories.filter(
			s => String(s.full_category_id) === categoryId
		)
	}, [selectedCategory, subcategories])

	// Update pathname filters
	const updatePathnameFilters = () => {
		const queryParams = new URLSearchParams()
		if (searchInput) queryParams.set('search', searchInput)
		if (sortInput) queryParams.set('sort', sortInput)

		// Selected values are already slugs
		const categorySlug = selectedCategory || 'all'
		const subcategorySlug = selectedSubcategory || 'all'
		const countrySlug = selectedCountry || 'all'
		const citySlug = selectedCity || 'all'

		const queryString = queryParams.toString()
		const newUrl = `/${langTyped}/test/companies/${countrySlug}/${citySlug}/${categorySlug}/${subcategorySlug}${
			queryString ? '?' + queryString : ''
		}`
		router.push(newUrl)
	}

	// Fetch companies with pathname and query filters
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

		// Convert slugs to IDs for API
		const categoryId = getCategoryIdFromSlug(category)
		const subcategoryId = getSubcategoryIdFromSlug(subcategory)
		const countryId = getCountryIdFromSlug(country)
		const cityId = getCityIdFromSlug(city)

		// Send IDs to API
		if (countryId) {
			apiParams.set('country_id', countryId)
		}

		if (cityId) {
			apiParams.set('city_id', cityId)
		}

		if (categoryId) {
			apiParams.set('category_id', categoryId)
		}

		if (subcategoryId) {
			apiParams.set('subcategory_id', subcategoryId)
		}

		// Add query params
		if (searchQuery) apiParams.set('search', searchQuery)

		fetch(`${API_ENDPOINTS.companiesv2}/?${apiParams.toString()}`)
			.then(res => res.json())
			.then((data: ApiResponse) => {
				setCompanies(data.results || [])
				setTotal(data.total || 0)
			})
			.catch(console.error)
			.finally(() => setLoading(false))
	}, [
		langTyped,
		category,
		subcategory,
		country,
		city,
		searchQuery,
		categories,
		subcategories,
		countries,
		cities,
	])

	// Apply sorting to results
	const sortedCompanies = useMemo(() => {
		const sorted = [...companies]

		switch (sortParam) {
			case 'date_desc':
			case 'date_asc':
				// Sorting by date would require date field from API
				return sorted
			default:
				return sorted
		}
	}, [companies, sortParam])

	// Update query params in URL when manually triggered
	const updateQueryParams = () => {
		updatePathnameFilters()
	}

	// Handle sort change
	const handleSortChange = (newSort: string) => {
		setSortInput(newSort)
		const queryParams = new URLSearchParams()
		if (searchQuery) queryParams.set('search', searchQuery)
		if (newSort) queryParams.set('sort', newSort)

		const queryString = queryParams.toString()
		const newUrl = `/${langTyped}/test/companies/${country}/${city}/${category}/${subcategory}${
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
									className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold'
								>
									{t.requests}
								</button>
								<button
									onClick={() => router.push(`/${langTyped}/test/companies`)}
									className='px-4 py-2 rounded-md bg-red-600 text-white font-semibold'
								>
									{t.title}
								</button>
							</div>
						</div>

						{/* Breadcrumbs - Active Filters */}
						<div className='flex flex-wrap gap-2 items-center'>
							<button
								onClick={() => router.push(`/${langTyped}/test/companies`)}
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
									{subcategory !== 'all' && (
										<>
											<span className='text-gray-400'>/</span>
											<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200'>
												{getSubcategoryName(subcategory)}
											</span>
										</>
									)}
								</>
							)}
						</div>
					</div>

					{/* Filters Section */}
					<section className='bg-gray-100 rounded-md p-4 mb-6'>
						<h2 className='text-lg font-semibold mb-4'>{t.filters}</h2>

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

						{/* Category, Subcategory, Country, City */}
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.category}
								</label>
								<select
									value={selectedCategory}
									onChange={e => {
										setSelectedCategory(e.target.value)
										if (e.target.value === 'all') {
											setSelectedSubcategory('all')
										} else {
											const categoryId = getCategoryIdFromSlug(e.target.value)
											const validSubcategories = subcategories.filter(
												s => String(s.full_category_id) === categoryId
											)
											if (
												validSubcategories.length > 0 &&
												!validSubcategories.some(
													s =>
														s[`name_${langTyped}`]
															?.toLowerCase()
															.replace(/\s+/g, '-')
															.replace(/[^a-z0-9-]/g, '') ===
														selectedSubcategory
												)
											) {
												setSelectedSubcategory('all')
											}
										}
									}}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value='all'>{t.allCategories}</option>
									{categories.map(cat => (
										<option
											key={cat.id}
											value={
												cat[`slug_${langTyped}`] ||
												cat.name?.replace(/_/g, '-') ||
												cat[`name_${langTyped}`]
													?.toLowerCase()
													.replace(/\s+/g, '-')
													.replace(/[^a-z0-9-]/g, '')
											}
										>
											{cat[`name_${langTyped}`] || cat.name_en}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.subcategory}
								</label>
								<select
									value={selectedSubcategory}
									onChange={e => setSelectedSubcategory(e.target.value)}
									disabled={selectedCategory === 'all'}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value='all'>{t.allCategories}</option>
									{filteredSubcategories.map(subcat => (
										<option
											key={subcat.id}
											value={
												subcat[`name_${langTyped}`]
													?.toLowerCase()
													.replace(/\s+/g, '-')
													.replace(/[^a-z0-9-]/g, '') || String(subcat.id)
											}
										>
											{subcat[`name_${langTyped}`] || subcat.name_en}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.country}
								</label>
								<select
									value={selectedCountry}
									onChange={e => {
										setSelectedCountry(e.target.value)
										if (e.target.value === 'all') {
											setSelectedCity('all')
										} else {
											const countryId = getCountryIdFromSlug(e.target.value)
											const validCities = cities.filter(
												c => String(c.country_id) === countryId
											)
											if (
												validCities.length > 0 &&
												!validCities.some(
													c =>
														(c[`slug_${langTyped}`] ||
															c[`name_${langTyped}`]
																?.toLowerCase()
																.replace(/\s+/g, '-')
																.replace(/[^a-z0-9-]/g, '')) === selectedCity
												)
											) {
												setSelectedCity('all')
											}
										}
									}}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value='all'>{t.allCountries}</option>
									{countries.map(c => (
										<option
											key={c.id}
											value={
												c[`slug_${langTyped}`] ||
												c[`name_${langTyped}`]
													?.toLowerCase()
													.replace(/\s+/g, '-')
													.replace(/[^a-z0-9-]/g, '')
											}
										>
											{c[`name_${langTyped}`] || c.name_en}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.city}
								</label>
								<select
									value={selectedCity}
									onChange={e => setSelectedCity(e.target.value)}
									disabled={selectedCountry === 'all'}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value='all'>{t.allCities}</option>
									{cities
										.filter(c => {
											if (selectedCountry === 'all') return true
											const countryId = getCountryIdFromSlug(selectedCountry)
											return String(c.country_id) === countryId
										})
										.map(c => (
											<option
												key={c.id}
												value={
													c[`slug_${langTyped}`] ||
													c[`name_${langTyped}`]
														?.toLowerCase()
														.replace(/\s+/g, '-')
														.replace(/[^a-z0-9-]/g, '')
												}
											>
												{c[`name_${langTyped}`] || c.name_en}
											</option>
										))}
								</select>
							</div>
						</div>

						{/* Sort */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.sortBy}
								</label>
								<select
									value={sortInput}
									onChange={e => handleSortChange(e.target.value)}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value=''>За релевантністю</option>
									<option value='date_desc'>{t.sortDateDesc}</option>
									<option value='date_asc'>{t.sortDateAsc}</option>
								</select>
							</div>
						</div>

						{/* Apply & Reset Buttons */}
						<div className='flex gap-3'>
							<button
								onClick={updateQueryParams}
								className='px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700'
							>
								{t.applyFilters}
							</button>
							<button
								onClick={() =>
									router.push(`/${langTyped}/test/companies/all/all/all/all`)
								}
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
							{sortedCompanies.map((company, index) => (
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
													.map(id => getCategoryNameById(String(id)))
													.join(', ')}
											</div>
										)}
										{company.subcategory_ids &&
											company.subcategory_ids.length > 0 && (
												<div>
													<span className='font-medium'>{t.subcategory}:</span>{' '}
													{company.subcategory_ids
														.map(id => getSubcategoryNameById(String(id)))
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
											href={`/${langTyped}/test/companies/detail/${company.slug}`}
											className='px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors inline-block'
										>
											{t.details}
										</a>
									</div>
								</div>
							))}
							{sortedCompanies.length === 0 && !loading && (
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
