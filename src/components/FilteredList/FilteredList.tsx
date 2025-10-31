'use client'

import type { Lang } from '@/app/(types)/lang'
import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import { getCompanyDetailPath, getRequestDetailPath } from '@/lib/i18n-routes'
import {
	buildFilterUrl,
	loadAllData,
	parseFilterUrl,
	type Category,
	type City,
	type Country,
	type Subcategory,
} from '@/lib/slug-resolver'
import { getLangFromPathname } from '@/utils/linkHelper'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

interface FilteredListProps {
	type: 'companies' | 'requests'
	segments: string[]
	searchParams?: { [key: string]: string | string[] | undefined }
	lang?: Lang // Опциональный - если не передан, определяется автоматически из URL
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

interface BidItem {
	title: string
	subcprice: string
	cost: number
	category?: number[]
	undercategory?: number[]
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
	country_id: number | null
	city_id: number | null
	category_id: number | null
	subcategory_id: number | null
	lang_search: string
	min_cost?: number
	max_cost?: number
	results: CompanyItem[] | BidItem[]
	total: number
}

const T = {
	uk: {
		companiesTitle: 'Компанії',
		requestsTitle: 'Заявки',
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
		allCountries: 'Всі країни',
		allCities: 'Всі міста',
		noResults: 'Нічого не знайдено',
		applyFilters: 'Застосувати',
		resetFilters: 'Скинути',
		totalResults: 'Знайдено',
		sortBy: 'Сортувати',
	},
	en: {
		companiesTitle: 'Companies',
		requestsTitle: 'Requests',
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
		allCountries: 'All countries',
		allCities: 'All cities',
		noResults: 'No results found',
		applyFilters: 'Apply',
		resetFilters: 'Reset',
		totalResults: 'Found',
		sortBy: 'Sort by',
	},
	pl: {
		companiesTitle: 'Firmy',
		requestsTitle: 'Zlecenia',
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
		allCountries: 'Wszystkie kraje',
		allCities: 'Wszystkie miasta',
		noResults: 'Nie znaleziono wyników',
		applyFilters: 'Zastosuj',
		resetFilters: 'Resetuj',
		totalResults: 'Znaleziono',
		sortBy: 'Sortuj według',
	},
	fr: {
		companiesTitle: 'Entreprises',
		requestsTitle: 'Demandes',
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
		allCountries: 'Tous les pays',
		allCities: 'Toutes les villes',
		noResults: 'Aucun résultat trouvé',
		applyFilters: 'Appliquer',
		resetFilters: 'Réinitialiser',
		totalResults: 'Trouvé',
		sortBy: 'Trier par',
	},
	de: {
		companiesTitle: 'Unternehmen',
		requestsTitle: 'Aufträge',
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
		allCountries: 'Alle Länder',
		allCities: 'Alle Städte',
		noResults: 'Keine Ergebnisse gefunden',
		applyFilters: 'Anwenden',
		resetFilters: 'Zurücksetzen',
		totalResults: 'Gefunden',
		sortBy: 'Sortieren nach',
	},
} as const

export function FilteredList({
	type,
	segments,
	searchParams = {},
	lang: langProp,
}: FilteredListProps) {
	const pathname = usePathname()
	const router = useRouter()

	// Определяем язык: используем переданный проп или автоматически из URL
	const lang = langProp || getLangFromPathname(pathname)
	const t = T[lang]

	const searchQuery = (searchParams.search as string) || ''
	const minCost =
		type === 'requests' ? (searchParams.min_cost as string) || '' : ''
	const maxCost =
		type === 'requests' ? (searchParams.max_cost as string) || '' : ''

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [countries, setCountries] = useState<Country[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [items, setItems] = useState<CompanyItem[] | BidItem[]>([])
	const [loading, setLoading] = useState(false)
	const [total, setTotal] = useState(0)

	// Состояния для фильтров из URL (для отображения и API)
	const [urlCategoryId, setUrlCategoryId] = useState<string>('')
	const [urlSubcategoryId, setUrlSubcategoryId] = useState<string>('')
	const [urlCountryId, setUrlCountryId] = useState<string>('')
	const [urlCityId, setUrlCityId] = useState<string>('')

	// Состояния для выбора в UI (до нажатия "Применить")
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('')
	const [selectedCountryId, setSelectedCountryId] = useState<string>('')
	const [selectedCityId, setSelectedCityId] = useState<string>('')

	const [searchInput, setSearchInput] = useState(searchQuery)
	const [minCostInput, setMinCostInput] = useState(minCost)
	const [maxCostInput, setMaxCostInput] = useState(maxCost)

	// Загрузка всех данных и парсинг URL
	useEffect(() => {
		loadAllData().then(async data => {
			setCategories(data.categories)
			setSubcategories(data.subcategories)
			setCountries(data.countries)
			setCities(data.cities)

			// Парсим URL для получения фильтров
			const filters = await parseFilterUrl(segments, lang)

			// Устанавливаем фильтры из URL (для API)
			const categoryId = filters.category?.id.toString() || ''
			const subcategoryId = filters.subcategory?.id.toString() || ''
			const countryId = filters.country?.id.toString() || ''
			const cityId = filters.city?.id.toString() || ''

			setUrlCategoryId(categoryId)
			setUrlSubcategoryId(subcategoryId)
			setUrlCountryId(countryId)
			setUrlCityId(cityId)

			// Также устанавливаем выбор в UI
			setSelectedCategoryId(categoryId)
			setSelectedSubcategoryId(subcategoryId)
			setSelectedCountryId(countryId)
			setSelectedCityId(cityId)
		})
	}, [segments, lang])

	// Фильтрованные подкатегории на основе выбранной категории
	const filteredSubcategories = useMemo(() => {
		if (!selectedCategoryId) return []
		return subcategories.filter(
			s => String(s.full_category_id) === selectedCategoryId
		)
	}, [selectedCategoryId, subcategories])

	// Фильтрованные города на основе выбранной страны
	const filteredCities = useMemo(() => {
		if (!selectedCountryId) return []
		return cities.filter(c => String(c.country_id) === selectedCountryId)
	}, [selectedCountryId, cities])

	// Helper функции
	const getName = (item: any) =>
		item?.[`name_${lang}`] || item?.name_en || item?.name || ''

	const getCategoryName = (id: string) => {
		const category = categories.find(c => String(c.id) === id)
		return getName(category)
	}

	const getSubcategoryName = (id: string) => {
		const subcategory = subcategories.find(s => String(s.id) === id)
		return getName(subcategory)
	}

	const getSlugFromData = (item: any): string => {
		if (!item) return ''

		// Сначала проверяем slug для текущего языка
		const slugField = item[`slug_${lang}`]

		if (slugField && slugField.trim()) {
			return slugField.trim()
		}

		// Проверяем slug для других языков (fallback)
		const fallbackSlugs = [
			'slug_en',
			'slug_uk',
			'slug_pl',
			'slug_fr',
			'slug_de',
		]
		for (const slugKey of fallbackSlugs) {
			const fallbackSlug = item[slugKey]
			if (fallbackSlug && fallbackSlug.trim()) {
				return fallbackSlug.trim()
			}
		}

		// Иначе создаем из имени (поддерживаем Unicode символы)
		const name = getName(item)

		if (!name || !name.trim()) return ''

		// Создание slug с поддержкой Unicode: сохраняем все буквы и цифры (включая кириллицу, польские символы и т.д.)
		const slug = name
			.toLowerCase()
			.trim()
			.replace(/[^\p{L}\p{N}\s-]/gu, '') // убираем все кроме Unicode букв, цифр, пробелов и дефисов
			.replace(/[\s_]+/g, '-') // заменяем пробелы и подчеркивания на дефисы
			.replace(/-+/g, '-') // множественные дефисы на один
			.replace(/^-|-$/g, '') // убираем дефисы в начале и конце

		return slug
	}

	// Применение фильтров и обновление URL
	const applyFilters = () => {
		const categorySlug = selectedCategoryId
			? getSlugFromData(
					categories.find(c => String(c.id) === selectedCategoryId)
			  )
			: ''
		const subcategorySlug = selectedSubcategoryId
			? getSlugFromData(
					subcategories.find(s => String(s.id) === selectedSubcategoryId)
			  )
			: ''
		const countrySlug = selectedCountryId
			? getSlugFromData(countries.find(c => String(c.id) === selectedCountryId))
			: ''
		const citySlug = selectedCityId
			? getSlugFromData(cities.find(c => String(c.id) === selectedCityId))
			: ''

		// Строим новый URL (уже содержит ?zayavki=true для requests)
		const baseUrl = buildFilterUrl({
			category: categorySlug || undefined,
			subcategory: subcategorySlug || undefined,
			country: countrySlug || undefined,
			city: citySlug || undefined,
			lang,
			type,
		})

		// Парсим существующие query параметры из baseUrl
		const [path, existingQuery] = baseUrl.split('?')
		const queryParams = new URLSearchParams(existingQuery || '')

		// Добавляем дополнительные query параметры
		if (searchInput) {
			queryParams.set('search', searchInput)
		} else {
			queryParams.delete('search')
		}

		if (type === 'requests') {
			if (minCostInput) {
				queryParams.set('min_cost', minCostInput)
			} else {
				queryParams.delete('min_cost')
			}
			if (maxCostInput) {
				queryParams.set('max_cost', maxCostInput)
			} else {
				queryParams.delete('max_cost')
			}
		}

		const queryString = queryParams.toString()
		const finalUrl = path + (queryString ? '?' + queryString : '')

		router.push(finalUrl)
	}

	// Загрузка данных из API - ТОЛЬКО на основе URL параметров
	useEffect(() => {
		if (categories.length === 0 || countries.length === 0) return

		setLoading(true)

		const apiParams = new URLSearchParams()
		apiParams.set('language', lang)

		// Используем ТОЛЬКО параметры из URL (urlXxxId)
		// НЕ реагируем на изменения selectedXxxId в процессе выбора фильтров
		if (urlCategoryId) apiParams.set('category_id', urlCategoryId)
		if (urlSubcategoryId) apiParams.set('subcategory_id', urlSubcategoryId)
		if (urlCountryId) apiParams.set('country_id', urlCountryId)
		if (urlCityId) apiParams.set('city_id', urlCityId)
		if (searchQuery) apiParams.set('search', searchQuery)

		if (type === 'requests') {
			if (minCost) apiParams.set('min_cost', minCost)
			if (maxCost) apiParams.set('max_cost', maxCost)
		}

		const endpoint =
			type === 'companies' ? API_ENDPOINTS.companiesv2 : API_ENDPOINTS.bidsV2

		fetch(`${endpoint}/?${apiParams.toString()}`)
			.then(res => res.json())
			.then((data: ApiResponse) => {
				setItems(data.results || [])
				setTotal(data.total || 0)
			})
			.catch(console.error)
			.finally(() => setLoading(false))
	}, [
		// Зависимости только от параметров URL (urlXxxId, а не selectedXxxId)
		lang,
		type,
		urlCategoryId,
		urlSubcategoryId,
		urlCountryId,
		urlCityId,
		searchQuery,
		minCost,
		maxCost,
		categories,
		countries,
	])

	// Сброс фильтров
	const resetFilters = () => {
		if (type === 'requests') {
			router.push('/all?zayavki=true')
		} else {
			router.push('/all')
		}
	}

	const title = type === 'companies' ? t.companiesTitle : t.requestsTitle

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang={lang} />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-6xl'>
					{/* Header */}
					<div className='mb-6'>
						<div className='flex justify-center items-center mb-3'>
							{/* <h1 className='text-2xl font-semibold text-red-600'>{title}</h1> */}
							<div className='flex gap-3'>
								<button
									onClick={() => router.push('/all?zayavki=true')}
									className={`px-4 py-2 rounded-md font-semibold ${
										type === 'requests'
											? 'bg-red-600 text-white'
											: 'bg-white border text-gray-700'
									}`}
								>
									{t.requestsTitle}
								</button>
								<button
									onClick={() => router.push('/all')}
									className={`px-4 py-2 rounded-md font-semibold ${
										type === 'companies'
											? 'bg-red-600 text-white'
											: 'bg-white border text-gray-700'
									}`}
								>
									{t.companiesTitle}
								</button>
							</div>
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
									if (e.key === 'Enter') applyFilters()
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
									value={selectedCategoryId}
									onChange={e => {
										setSelectedCategoryId(e.target.value)
										setSelectedSubcategoryId('')
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

							{/* Subcategory */}
							<div>
								<label className='block text-sm text-gray-700 mb-1'>
									{t.subcategory}
								</label>
								<select
									value={selectedSubcategoryId}
									onChange={e => setSelectedSubcategoryId(e.target.value)}
									className='w-full rounded-md border px-3 py-2'
									disabled={!selectedCategoryId}
								>
									<option value=''>{t.allCategories}</option>
									{filteredSubcategories.map(sc => (
										<option key={sc.id} value={String(sc.id)}>
											{getName(sc)}
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
									value={selectedCountryId}
									onChange={e => {
										setSelectedCountryId(e.target.value)
										setSelectedCityId('')
									}}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value=''>{t.allCountries}</option>
									{countries.map(c => (
										<option key={c.id} value={String(c.id)}>
											{getName(c)}
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
									value={selectedCityId}
									onChange={e => setSelectedCityId(e.target.value)}
									className='w-full rounded-md border px-3 py-2'
									disabled={!selectedCountryId}
								>
									<option value=''>{t.allCities}</option>
									{filteredCities.map(c => (
										<option key={c.id} value={String(c.id)}>
											{getName(c)}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Price range for requests */}
						{type === 'requests' && (
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
											if (e.key === 'Enter') applyFilters()
										}}
										placeholder='0'
										className='w-full rounded-md border border-gray-300 px-3 py-2'
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
											if (e.key === 'Enter') applyFilters()
										}}
										placeholder='10000'
										className='w-full rounded-md border border-gray-300 px-3 py-2'
									/>
								</div>
							</div>
						)}

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
								{t.totalResults}: {total} {title.toLowerCase()}
							</div>
							{items.map((item, index) => {
								const isCompany = type === 'companies'
								const company = isCompany ? (item as CompanyItem) : null
								const bid = !isCompany ? (item as BidItem) : null

								return (
									<div
										key={`${item.slug}-${index}`}
										className='bg-white rounded-sm shadow p-4 border border-gray-200'
									>
										<div className='flex justify-between items-start mb-2'>
											<h3 className='text-blue-700 font-semibold pr-4'>
												{isCompany ? company?.name : bid?.title}
											</h3>
											{!isCompany && bid && (
												<span className='text-lg font-bold text-green-600'>
													${bid.cost}
												</span>
											)}
										</div>

										{isCompany && company?.description && (
											<p className='text-sm text-gray-600 mb-2'>
												{company.description}
											</p>
										)}

										<div className='text-xs text-gray-600 mb-2'>
											{isCompany &&
												company?.category_ids &&
												company.category_ids.length > 0 && (
													<div>
														<span className='font-medium'>{t.category}:</span>{' '}
														{company.category_ids
															.map(id => getCategoryName(String(id)))
															.join(', ')}
													</div>
												)}
											{!isCompany &&
												bid?.category &&
												bid.category.length > 0 && (
													<div>
														<span className='font-medium'>{t.category}:</span>{' '}
														{bid.category
															.map(id => getCategoryName(String(id)))
															.join(', ')}
													</div>
												)}
										</div>

										<div className='flex items-center justify-between text-sm text-gray-600'>
											<div className='flex items-center space-x-2'>
												<span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs'>
													📍 {isCompany ? company?.city : bid?.city}
													{isCompany &&
														company?.country &&
														`, ${company.country}`}
													{!isCompany && bid?.country && `, ${bid.country}`}
												</span>
											</div>
											<a
												href={
													isCompany
														? getCompanyDetailPath(item.slug, lang)
														: getRequestDetailPath(item.slug, lang)
												}
												className='px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors inline-block'
											>
												{t.details}
											</a>
										</div>
									</div>
								)
							})}
							{items.length === 0 && (
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
