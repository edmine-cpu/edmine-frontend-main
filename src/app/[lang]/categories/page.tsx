'use client'

import { Header } from '@/components/Header/Header'
import React, { useEffect, useMemo, useState } from 'react'

import { API_ENDPOINTS } from '@/config/api'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

interface Category {
	id: number
	name: string
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
	city: string
	created_at?: string
	category?: string
	under_category_id?: number
	under_category?: { id: number }
	budget?: string
	currency?: string
}
interface UserItem {
	id: number
	name: string
	email?: string
	city?: string
	country_id?: number
	country?: { id: number }
	created_at?: string
	categories?: any[]
	subcategories?: any[]
	profile_description?: string
}

const T = {
	uk: {
		title: 'Категорії',
		orders: 'Замовлення',
		executors: 'Підрядники',
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
	},
	en: {
		title: 'Categories',
		orders: 'Orders',
		executors: 'Executors',
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
	},
	pl: {
		title: 'Kategorie',
		orders: 'Zlecenia',
		executors: 'Wykonawcy',
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
	},
	fr: {
		title: 'Catégories',
		orders: 'Demandes',
		executors: 'Exécutants',
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
	},
	de: {
		title: 'Kategorien',
		orders: 'Aufträge',
		executors: 'Ausführende',
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
	},
} as const

export default function CategoriesPage({
	params,
	searchParams,
}: {
	params: Promise<{ lang: string }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedParams = React.use(params)
	const resolvedSearchParams = searchParams ? React.use(searchParams) : {}
	const lang = "en" as Lang
	const t = T[lang]

	const searchQuery = (resolvedSearchParams.search as string) || ''

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [countries, setCountries] = useState<Country[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [bids, setBids] = useState<BidItem[]>([])
	const [users, setUsers] = useState<UserItem[]>([])

	const [filters, setFilters] = useState({
		category: '',
		subcategory: '',
		country: '',
		city: '',
		sort: 'relevance',
		search: searchQuery,
	})

	const [activeTab, setActiveTab] = useState<
		'orders' | 'executors' | 'services'
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

	// Separate useEffect for users with search filtering
	useEffect(() => {
		if (activeTab === 'executors') {
			const params = new URLSearchParams()
			if (filters.search) params.set('search', filters.search)

			fetch(`${API_ENDPOINTS.users}?${params.toString()}`)
				.then(res => res.json())
				.then(setUsers)
				.catch(console.error)
		}
	}, [filters.search, activeTab])

	// Initial load of users when component mounts and executors tab is active
	useEffect(() => {
		if (activeTab === 'executors' && users.length === 0) {
			fetch(API_ENDPOINTS.users)
				.then(res => res.json())
				.then(setUsers)
				.catch(console.error)
		}
	}, [activeTab, users.length])

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
				.then(setBids)
				.catch(console.error)
		}
	}, [filters, activeTab])

	// Утилиты для получения переводов (перемещаем ПЕРЕД useMemo)
	const getName = (obj: any) => obj?.[`name_${lang}`] ?? obj?.name_en ?? ''
	const getTitle = (obj: any) => obj?.[`title_${lang}`] ?? obj?.title_en ?? ''

	const filteredBids = useMemo(() => {
		if (activeTab !== 'orders') return [] as BidItem[]
		const list = Array.isArray(bids) ? bids : []
		return list.sort((a, b) => {
			const aTitle = getTitle(a) || ''
			const bTitle = getTitle(b) || ''
			const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
			const bDate = b.created_at ? new Date(b.created_at).getTime() : 0

			switch (filters.sort) {
				case 'title_asc':
					return aTitle.localeCompare(bTitle, lang)
				case 'title_desc':
					return bTitle.localeCompare(aTitle, lang)
				case 'date_asc':
					return aDate - bDate
				case 'date_desc':
					return bDate - aDate
				case 'relevance':
					// Сортировка по релевантности: новые + по названию
					const scoreDiff = bDate - aDate
					if (Math.abs(scoreDiff) < 86400000) {
						// если разница меньше дня
						return aTitle.localeCompare(bTitle, lang)
					}
					return scoreDiff
				case 'popular':
					// Популярные - можно добавить счетчик просмотров позже
					return bDate - aDate // пока по дате
				default:
					return bDate - aDate
			}
		})
	}, [bids, filters.sort, lang, activeTab])

	const filteredUsers = useMemo(() => {
		if (activeTab !== 'executors') return [] as UserItem[]
		const list = Array.isArray(users) ? users : []
		return list
			.filter(u =>
				filters.country
					? String(u.country_id ?? u.country?.id) === filters.country
					: true
			)
			.filter(u => (filters.city ? String(u.city) === filters.city : true))
			.filter(u => {
				if (!filters.category) return true
				const cats = (u.categories || []).map((c: any) => String(c.id ?? c))
				return cats.includes(filters.category)
			})
			.filter(u => {
				if (!filters.subcategory) return true
				const subs = (u.subcategories || []).map((s: any) => String(s.id ?? s))
				return subs.includes(filters.subcategory)
			})
			.sort((a, b) => {
				const aName = a.name || ''
				const bName = b.name || ''
				const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
				const bDate = b.created_at ? new Date(b.created_at).getTime() : 0

				switch (filters.sort) {
					case 'title_asc':
						return aName.localeCompare(bName, lang)
					case 'title_desc':
						return bName.localeCompare(aName, lang)
					case 'date_asc':
						return aDate - bDate
					case 'date_desc':
						return bDate - aDate
					case 'relevance':
						// Релевантность для исполнителей
						const userScoreDiff = bDate - aDate
						if (Math.abs(userScoreDiff) < 86400000) {
							return aName.localeCompare(bName, lang)
						}
						return userScoreDiff
					case 'popular':
						return bDate - aDate
					default:
						return bDate - aDate
				}
			})
	}, [users, filters, activeTab, lang])

	return (
		<div className='min-h-screen bg-gray-50 flex flex-col'>
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
							onClick={() => setActiveTab('executors')}
							className={`px-4 py-2 rounded-md font-semibold ${
								activeTab === 'executors'
									? 'bg-red-600 text-white'
									: 'bg-white border text-gray-700'
							}`}
						>
							{t.executors}
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
							<label className='block text-sm text-gray-700 mb-1'>Пошук</label>
							<input
								type='text'
								value={filters.search}
								onChange={e =>
									setFilters(f => ({ ...f, search: e.target.value }))
								}
								placeholder='Введіть ключові слова для пошуку...'
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

										// Обновляем URL без перезагрузки страницы
										if (categoryId) {
											const category = categories.find(
												cat => String(cat.id) === categoryId
											)
											if (category) {
												const categoryName = category.name
													.toLowerCase()
													.replace(/\s+/g, '-')
												window.history.pushState(
													null,
													'',
													`/zayavki/${categoryName}`
												)
											}
										} else {
											window.history.pushState(null, '', `/categories`)
										}
									}}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value=''>{t.select}</option>
									{categories
										.filter(c => (c as any).name !== 'other')
										.map(c => (
											<option key={c.id} value={String(c.id)}>
												{(c as any).name}
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

					{activeTab === 'orders' && (
						<div className='space-y-3'>
							{filteredBids.map(b => {
								const d = b.created_at ? new Date(b.created_at) : null
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
								// Ищем имя категории, если category = null/undefined/пустая то это "order"
								const catName =
									b.category && b.category !== null && b.category !== ''
										? categories.find(
												c => String((c as any).id) === String(b.category)
										  )?.name || ''
										: 'other'
								const subId = (b.under_category_id ??
									b.under_category?.id) as any
								const subList: any[] = Array.isArray(subcategories)
									? (subcategories as any[])
									: []
								const subItem = subList.find(
									sc => String((sc as any).id) === String(subId)
								)
								const subName = subItem ? getName(subItem) : ''

								// Find country and city names
								const countryName = (b as any).country_id
									? countries.find(
											(c: any) => String(c.id) === String((b as any).country_id)
									  )?.name_en || ''
									: ''
								const cityName = (b as any).city || ''

								return (
									<div
										key={b.id}
										className='bg-white rounded-sm shadow p-4 border border-gray-200'
									>
										<div className='flex justify-between items-start mb-2'>
											<h3 className='text-blue-700 font-semibold pr-4'>
												{getTitle(b) || '—'}
											</h3>
											<span className='text-xs text-gray-500 whitespace-nowrap'>
												{dateStr}
											</span>
										</div>
										<div className='text-xs text-gray-600 mb-2'>
											{[catName === 'other' ? 'Інше' : catName, subName]
												.filter(Boolean)
												.join(' • ')}
										</div>
										<p className='text-gray-700 mb-3'>
											{(b as any)[`description_${lang}`] || ''}
										</p>
										<div className='flex items-center justify-between text-sm text-gray-600'>
											<div className='flex items-center space-x-2'>
												{countryName && (
													<span className='bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs'>
														🌍 {countryName}
													</span>
												)}
												{cityName && (
													<span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs'>
														📍 {cityName}
													</span>
												)}
												{b.budget && b.currency && (
													<span className='bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium'>
														💰 {b.budget} {b.currency}
													</span>
												)}
											</div>
											<a
												href={`/zayavki/order/${
													catName && catName !== 'other'
														? catName.toLowerCase().replace(/\s+/g, '-') +
														  '-' +
														  b.id
														: 'other-' + b.id
												}`}
												className='px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors inline-block'
											>
												{t.details}
											</a>
										</div>
									</div>
								)
							})}
							{filteredBids.length === 0 && (
								<div className='text-center text-gray-500 py-8'>—</div>
							)}
						</div>
					)}

					{activeTab === 'executors' && (
						<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
							{filteredUsers.map(u => {
								const catStr = (u.categories || [])
									.map((c: any) => c.name)
									.slice(0, 3)
									.join(', ')
								const subStr = (u.subcategories || [])
									.map(
										(s: any) => (s as any)[`name_${lang}`] || s.name_en || ''
									)
									.slice(0, 3)
									.join(', ')
								return (
									<a
										key={u.id}
										href={`/user/${u.id}`}
										className='block text-left bg-white rounded-md shadow p-5 border border-gray-200 hover:shadow-md transition'
									>
										<div className='flex items-baseline justify-between mb-2'>
											<h3 className='font-semibold text-blue-700 truncate pr-3 text-lg'>
												{u.name}
											</h3>
											<span className='text-xs text-gray-500'>
												{u.created_at
													? new Date(u.created_at).toLocaleDateString()
													: ''}
											</span>
										</div>
										<div className='text-sm text-gray-700 mb-2'>
											{u.city || ''}
										</div>
										{u.profile_description && (
											<p className='text-sm text-gray-600 mb-2 line-clamp-2'>
												{u.profile_description}
											</p>
										)}
										<div className='text-xs text-gray-600 mb-1'>{catStr}</div>
										<div className='text-xs text-gray-500'>{subStr}</div>
										<div className='mt-2 text-xs text-blue-600 font-medium'>
											Детальніше →
										</div>
									</a>
								)
							})}
							{filteredUsers.length === 0 && (
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
