'use client'

import { Header } from '@/components/Header/Header'
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { useRouter, usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { getLangFromPathname, getLangPath } from '@/utils/linkHelper'

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
		sortBy: 'Сортувати',
		sortPriceAsc: 'Ціна: від низької до високої',
		sortPriceDesc: 'Ціна: від високої до низької',
		sortNewest: 'Найновіші',
		sortOldest: 'Найстаріші',
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
		sortBy: 'Sort by',
		sortPriceAsc: 'Price: Low to High',
		sortPriceDesc: 'Price: High to Low',
		sortNewest: 'Newest First',
		sortOldest: 'Oldest First',
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
		sortBy: 'Sortuj według',
		sortPriceAsc: 'Cena: od najniższej',
		sortPriceDesc: 'Cena: od najwyższej',
		sortNewest: 'Najnowsze',
		sortOldest: 'Najstarsze',
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
		sortBy: 'Trier par',
		sortPriceAsc: 'Prix: du plus bas au plus élevé',
		sortPriceDesc: 'Prix: du plus élevé au plus bas',
		sortNewest: 'Plus récents',
		sortOldest: 'Plus anciens',
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
		sortBy: 'Sortieren nach',
		sortPriceAsc: 'Preis: Niedrig bis Hoch',
		sortPriceDesc: 'Preis: Hoch bis Niedrig',
		sortNewest: 'Neueste zuerst',
		sortOldest: 'Älteste zuerst',
	},
} as const

type Params = {
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

	const { country, city, category, undercategory } = resolvedParams
	const pathname = usePathname()
	const lang = getLangFromPathname(pathname)
	const t = T[lang]
	const router = useRouter()

	const searchQuery = (resolvedSearchParams.search as string) || ''
	const minCost = (resolvedSearchParams.min_cost as string) || ''
	const maxCost = (resolvedSearchParams.max_cost as string) || ''
	const sortParam = (resolvedSearchParams.sort as string) || ''

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
	const [sortInput, setSortInput] = useState(sortParam)

	// Selected filters for pathname
	const [selectedCategory, setSelectedCategory] = useState(category)
	const [selectedSubcategory, setSelectedSubcategory] = useState(undercategory)
	const [selectedCountry, setSelectedCountry] = useState(country)
	const [selectedCity, setSelectedCity] = useState(city)

	// Sync state with URL params on change
	useEffect(() => {
		setSelectedCategory(category)
		setSelectedSubcategory(undercategory)
		setSelectedCountry(country)
		setSelectedCity(city)
	}, [category, undercategory, country, city])

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
			if (c[`slug_${lang}`] === slug) return true

			// Check the 'name' field (snake_case) - THIS IS THE KEY FIX
			if (c.name === normalizedSlug) return true

			// Check localized name converted to kebab-case
			const localizedKebab = c[`name_${lang}`]
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
			const localizedKebab = s[`name_${lang}`]
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
			if (c[`slug_${lang}`] === slug) return true

			// Check localized name converted to kebab-case
			const localizedKebab = c[`name_${lang}`]
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
			if (c[`slug_${lang}`] === slug) return true

			// Check localized name converted to kebab-case
			const localizedKebab = c[`name_${lang}`]
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
			if (c[`slug_${lang}`] === slug) return true
			if (c.name === normalizedSlug) return true
			const localizedKebab = c[`name_${lang}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '')
			if (localizedKebab === slug) return true
			return false
		})

		return cat?.[`name_${lang}`] || cat?.name_en || slug
	}

	const getSubcategoryName = (slug: string): string => {
		if (slug === 'all') return t.allCategories
		const subcat = subcategories.find(
			s =>
				s[`name_${lang}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return subcat?.[`name_${lang}`] || subcat?.name_en || slug
	}

	const getCountryName = (slug: string): string => {
		if (slug === 'all') return t.allCountries
		const country = countries.find(
			c =>
				c[`slug_${lang}`] === slug ||
				c[`name_${lang}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return country?.[`name_${lang}`] || country?.name_en || slug
	}

	const getCityName = (slug: string): string => {
		if (slug === 'all') return t.allCities
		const city = cities.find(
			c =>
				c[`slug_${lang}`] === slug ||
				c[`name_${lang}`]
					?.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '') === slug
		)
		return city?.[`name_${lang}`] || city?.name_en || slug
	}

	// Get name by ID for display
	const getCategoryNameById = (id: string) => {
		const cat = categories.find(c => String(c.id) === id)
		return cat?.[`name_${lang}`] || cat?.name_en || ''
	}

	const getSubcategoryNameById = (id: string) => {
		const subcat = subcategories.find(s => String(s.id) === id)
		return subcat?.[`name_${lang}`] || subcat?.name_en || ''
	}

	// Get slug from ID
	const getCategorySlugById = (id: string): string => {
		if (id === 'all' || !id) return 'all'
		const cat = categories.find(c => String(c.id) === id)
		if (!cat) return 'all'

		// Check slug field first
		const slug = cat[`slug_${lang}`]
		if (slug) return slug

		// Convert 'name' field from snake_case to kebab-case
		if (cat.name) return cat.name.replace(/_/g, '-')

		// Fallback to localized name
		return (
			cat[`name_${lang}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '') || 'all'
		)
	}

	const getSubcategorySlugById = (id: string): string => {
		if (id === 'all' || !id) return 'all'
		const subcat = subcategories.find(s => String(s.id) === id)
		return (
			subcat?.[`name_${lang}`]
				?.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '') || 'all'
		)
	}

	const getCountrySlugById = (id: string): string => {
		if (id === 'all' || !id) return 'all'
		const country = countries.find(c => String(c.id) === id)
		return (
			country?.[`slug_${lang}`] ||
			country?.[`name_${lang}`]
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
			city?.[`slug_${lang}`] ||
			city?.[`name_${lang}`]
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
		if (minCostInput) queryParams.set('min_cost', minCostInput)
		if (maxCostInput) queryParams.set('max_cost', maxCostInput)
		if (sortInput) queryParams.set('sort', sortInput)

		// Selected values are already slugs
		const categorySlug = selectedCategory || 'all'
		const subcategorySlug = selectedSubcategory || 'all'
		const countrySlug = selectedCountry || 'all'
		const citySlug = selectedCity || 'all'

		const queryString = queryParams.toString()
		const newUrl = getLangPath(`/requests/${countrySlug}/${citySlug}/${categorySlug}/${subcategorySlug}`, lang) + (queryString ? '?' + queryString : '')
		router.push(newUrl)
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
		apiParams.set('language', lang)

		// Convert slugs to IDs for API
		const categoryId = getCategoryIdFromSlug(category)
		const subcategoryId = getSubcategoryIdFromSlug(undercategory)
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
		lang,
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

	// Apply sorting to results
	const sortedBids = useMemo(() => {
		const sorted = [...bids]

		switch (sortParam) {
			case 'price_asc':
				return sorted.sort((a, b) => a.cost - b.cost)
			case 'price_desc':
				return sorted.sort((a, b) => b.cost - a.cost)
			default:
				return sorted
		}
	}, [bids, sortParam])

	// Update query params in URL when manually triggered
	const updateQueryParams = () => {
		updatePathnameFilters()
	}

	// Handle sort change
	const handleSortChange = (newSort: string) => {
		setSortInput(newSort)
		const queryParams = new URLSearchParams()
		if (searchQuery) queryParams.set('search', searchQuery)
		if (minCost) queryParams.set('min_cost', minCost)
		if (maxCost) queryParams.set('max_cost', maxCost)
		if (newSort) queryParams.set('sort', newSort)

		const queryString = queryParams.toString()
		const newUrl = getLangPath(`/requests/${country}/${city}/${category}/${undercategory}`, lang) + (queryString ? '?' + queryString : '')
		router.push(newUrl)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang={lang} />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-6xl'>
					{/* Header */}
					<div className='mb-6'>
						<div className='flex justify-between items-center mb-3'>
							<h1 className='text-2xl font-semibold text-red-600'>{t.title}</h1>
							<div className='flex gap-3'>
								<button
									onClick={() => router.push(getLangPath('/requests', lang))}
									className='px-4 py-2 rounded-md bg-red-600 text-white font-semibold'
								>
									{t.title}
								</button>
								<button
									onClick={() => router.push(getLangPath('/companies', lang))}
									className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold'
								>
									{t.companies}
								</button>
							</div>
						</div>

						{/* Breadcrumbs - Active Filters */}
						<div className='flex flex-wrap gap-2 items-center'>
							<button
								onClick={() => router.push(getLangPath('/requests', lang))}
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
														s[`name_${lang}`]
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
												cat[`slug_${lang}`] ||
												cat.name?.replace(/_/g, '-') ||
												cat[`name_${lang}`]
													?.toLowerCase()
													.replace(/\s+/g, '-')
													.replace(/[^a-z0-9-]/g, '')
											}
										>
											{cat[`name_${lang}`] || cat.name_en}
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
												subcat[`name_${lang}`]
													?.toLowerCase()
													.replace(/\s+/g, '-')
													.replace(/[^a-z0-9-]/g, '') || String(subcat.id)
											}
										>
											{subcat[`name_${lang}`] || subcat.name_en}
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
														(c[`slug_${lang}`] ||
															c[`name_${lang}`]
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
												c[`slug_${lang}`] ||
												c[`name_${lang}`]
													?.toLowerCase()
													.replace(/\s+/g, '-')
													.replace(/[^a-z0-9-]/g, '')
											}
										>
											{c[`name_${lang}`] || c.name_en}
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
													c[`slug_${lang}`] ||
													c[`name_${lang}`]
														?.toLowerCase()
														.replace(/\s+/g, '-')
														.replace(/[^a-z0-9-]/g, '')
												}
											>
												{c[`name_${lang}`] || c.name_en}
											</option>
										))}
								</select>
							</div>
						</div>

						{/* Price Range & Sort */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
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
									<option value='date_desc'>За датою (↓ Нові)</option>
									<option value='date_asc'>За датою (↑ Старі)</option>
									<option value='price_asc'>За ціною (↑)</option>
									<option value='price_desc'>За ціною (↓)</option>
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
									router.push(
										getLangPath('/requests/all/all/all/all', lang)
									)
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
							{sortedBids.map((bid, index) => (
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
											href={getLangPath(`/requests/order/${bid.slug}`, lang)}
											className='px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors inline-block'
										>
											{t.details}
										</a>
									</div>
								</div>
							))}
							{sortedBids.length === 0 && !loading && (
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
