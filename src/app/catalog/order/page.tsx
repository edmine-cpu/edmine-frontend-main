'use client'

import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import { getLangPath } from '@/utils/linkHelper'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

interface Category {
	id: number
	name: string
	slug_uk?: string
	slug_en?: string
	slug_pl?: string
	slug_fr?: string
	slug_de?: string
}

const CURRENCY_LABELS: Record<string, string> = {
	UAH: 'грн',
	USD: '$',
	EUR: '€',
	PLN: 'zł',
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
	category?: string | null
	under_category_id?: number
	under_category?: { id: number }
	budget?: string
	currency?: string
	slug_uk?: string
	slug_en?: string
	slug_pl?: string
	slug_fr?: string
	slug_de?: string
	author?: number // ID автора задания
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
		title: 'Інші заявки',
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
		allCategories: 'Всі категорії',
		back: '← Назад до каталогу',
		startChat: 'Почати чат',
		loginToChat: 'Увійти для спілкування',
		cannotChatWithSelf: 'Неможливо створити чат з самим собою',
		chatError: 'Помилка створення чату. Спробуйте пізніше.',
		networkError: 'Помилка мережі. Перевірте підключення.',
	},
	en: {
		title: 'Other Requests',
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
		allCategories: 'All categories',
		back: '← Back to catalog',
		startChat: 'Start Chat',
		loginToChat: 'Login to chat',
		cannotChatWithSelf: 'Cannot create chat with yourself',
		chatError: 'Chat creation error. Try again later.',
		networkError: 'Network error. Check your connection.',
	},
	pl: {
		title: 'Inne zlecenia',
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
		allCategories: 'Wszystkie kategorie',
		back: '← Powrót do katalogu',
		startChat: 'Rozpocznij czat',
		loginToChat: 'Zaloguj się, aby czatować',
		cannotChatWithSelf: 'Nie można utworzyć czatu z samym sobą',
		chatError: 'Błąd tworzenia czatu. Spróbuj ponownie później.',
		networkError: 'Błąd sieci. Sprawdź połączenie.',
	},
	fr: {
		title: 'Autres demandes',
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
		allCategories: 'Toutes les catégories',
		back: '← Retour au catalogue',
		startChat: 'Commencer le chat',
		loginToChat: 'Se connecter pour discuter',
		cannotChatWithSelf: 'Impossible de créer un chat avec soi-même',
		chatError: 'Erreur de création de chat. Réessayez plus tard.',
		networkError: 'Erreur réseau. Vérifiez votre connexion.',
	},
	de: {
		title: 'Andere Anfragen',
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
		allCategories: 'Alle Kategorien',
		back: '← Zurück zum Katalog',
		startChat: 'Chat starten',
		loginToChat: 'Anmelden zum Chatten',
		cannotChatWithSelf: 'Chat mit sich selbst nicht möglich',
		chatError: 'Chat-Erstellungsfehler. Versuchen Sie es später erneut.',
		networkError: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.',
	},
} as const

// Компонент кнопки чата для карточки
function ChatButtonCard({ lang, authorId }: { lang: Lang; authorId?: number }) {
	const router = useRouter()
	const [currentUserId, setCurrentUserId] = useState<number | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const t = T[lang]

	useEffect(() => {
		// Получаем информацию о текущем пользователе
		const fetchCurrentUser = async () => {
			try {
				const response = await fetch(API_ENDPOINTS.meApi, {
					credentials: 'include',
				})
				if (response.ok) {
					const userData = await response.json()
					setCurrentUserId(userData.id)
					setIsAuthenticated(true)
				} else {
					setIsAuthenticated(false)
				}
			} catch (error) {
				console.error('Error fetching current user:', error)
				setIsAuthenticated(false)
			}
		}

		fetchCurrentUser()
	}, [])

	const handleCreateChat = async () => {
		if (!authorId) return

		// Проверяем, не пытается ли пользователь создать чат с самим собой
		if (currentUserId === authorId) {
			alert(t.cannotChatWithSelf)
			return
		}

		try {
			const formData = new FormData()
			formData.append('partner_id', authorId.toString())

			const response = await fetch(API_ENDPOINTS.createChat, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})

			if (response.ok) {
				const data = await response.json()
				router.push(getLangPath(`/chat/${data.chat_id}`, 'en'))
			} else {
				const errorData = await response.json()
				console.error(
					'Failed to create chat:',
					response.status,
					errorData.detail || errorData
				)

				if (
					response.status === 400 &&
					errorData.detail?.includes('с самим собой')
				) {
					alert(t.cannotChatWithSelf)
				} else {
					alert(t.chatError)
				}
			}
		} catch (error) {
			console.error('Error creating chat:', error)
			alert(t.networkError)
		}
	}

	if (!authorId) return null

	return (
		<>
			{isAuthenticated ? (
				<button
					onClick={handleCreateChat}
					className='px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-colors text-sm'
				>
					💬 {t.startChat}
				</button>
			) : (
				<button
					onClick={() => router.push(getLangPath('/login', 'en'))}
					className='px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors text-sm'
				>
					🔐 {t.loginToChat}
				</button>
			)}
		</>
	)
}

export default function OtherCategoryPage() {
	const lang = "en" as Lang
	const t = T[lang]

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [countries, setCountries] = useState<Country[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [bids, setBids] = useState<BidItem[]>([])
	const [users, setUsers] = useState<UserItem[]>([])
	const [loading, setLoading] = useState(true)

	const [filters, setFilters] = useState({
		category: '',
		subcategory: '',
		country: '',
		city: '',
		sort: 'relevance',
		search: '',
	})

	const [activeTab, setActiveTab] = useState<
		'orders' | 'executors' | 'services'
	>('orders')

	useEffect(() => {
		// Загружаем все данные
		Promise.all([
			fetch(API_ENDPOINTS.categories),
			fetch(API_ENDPOINTS.subcategories),
			fetch(API_ENDPOINTS.countries),
			fetch(API_ENDPOINTS.cities),
			fetch(API_ENDPOINTS.users),
		])
			.then(async ([c1, s1, c2, c3, u1]) => {
				setCategories(await c1.json())
				setSubcategories(await s1.json())
				setCountries(await c2.json())
				setCities(await c3.json())
				setUsers(await u1.json())
				setLoading(false)
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
			// Загружаем заявки без категории с учетом других фильтров
			const params = new URLSearchParams()
			if (filters.country) params.set('country', filters.country)
			if (filters.city) params.set('city', filters.city)
			if (filters.sort) params.set('sort', filters.sort)
			if (filters.search) params.set('search', filters.search)

			fetch(`${API_ENDPOINTS.bids}?${params.toString()}`)
				.then(res => res.json())
				.then((allBids: BidItem[]) => {
					// Фильтруем заявки без категории (null, undefined, пустая строка)
					const bidsWithoutCategory = allBids.filter(
						bid =>
							bid.category === null ||
							bid.category === undefined ||
							bid.category === '' ||
							bid.category === 'null'
					)

					setBids(bidsWithoutCategory)
				})
				.catch(console.error)
		}
	}, [filters, activeTab])

	// Утилиты для получения переводов
	const getName = (obj: any) => obj?.[`name_`] ?? obj?.name_en ?? ''
	const getTitle = (obj: any) => obj?.[`title_`] ?? obj?.title_en ?? ''
	const getSlug = (obj: any) => obj?.[`slug_`] ?? obj?.slug_en ?? ''

	if (loading) {
		return (
			<div className='min-h-screen '>
				<Header lang="en" />
				<div className='flex items-center justify-center min-h-screen'>
					<div className='text-lg'>Loading...</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang="en" />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-6xl'>
					<Link
						href={getLangPath('/catalog', 'en')}
						className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-6'
					>
						{t.back}
					</Link>

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

					{/* Фильтры - такие же как на основной странице каталога */}
					<section className='bg-gray-100 rounded-md p-4 mb-6'>
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

										// Если выбрана категория - переходим на страницу этой категории
										if (categoryId) {
											const category = categories.find(
												cat => String(cat.id) === categoryId
											)
											if (category) {
												const categoryName = category.name
													.toLowerCase()
													.replace(/\s+/g, '-')
												window.location.href = getLangPath(`/catalog/${categoryName}`, 'en')
											}
										} else {
											// Если сброшена категория - переходим в основной каталог
											window.location.href = getLangPath('/catalog', 'en')
										}
									}}
									className='w-full rounded-md border px-3 py-2'
								>
									<option value=''>{t.allCategories}</option>
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

					{/* Контент для заявок */}
					{activeTab === 'orders' && (
						<div className='space-y-3'>
							{bids.map(b => {
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

								// Создаем SEO URL для заявки в категории "order"
								const bidSlug = getSlug(b) || `${b.id}`
								const bidUrl = getLangPath(`/catalog/other/${bidSlug}`, 'en')

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
										<div className='text-xs text-gray-600 mb-2'>Інше</div>
										<p className='text-gray-700 mb-3'>
											{(b as any)[`description_`] || ''}
										</p>
										<div className='flex items-center justify-between text-sm text-gray-600'>
											<div className='flex items-center space-x-2'>
												{b.city && (
													<span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs'>
														📍 {b.city}
													</span>
												)}
												{b.budget && b.currency && (
													<span className='bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium'>
														💰 {b.budget} {b.currency}
													</span>
												)}
											</div>
											<div className='flex items-center space-x-2'>
												<ChatButtonCard lang="en" authorId={b.author} />
												<Link
													href={bidUrl}
													className='px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors inline-block'
												>
													{t.details}
												</Link>
											</div>
										</div>
									</div>
								)
							})}
							{bids.length === 0 && (
								<div className='text-center text-gray-500 py-8'>
									В цій категорії заявок поки немає
								</div>
							)}
						</div>
					)}

					{/* Контент для исполнителей */}
					{activeTab === 'executors' && (
						<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
							{users.map(u => {
								const catStr = (u.categories || [])
									.map((c: any) => c.name)
									.slice(0, 3)
									.join(', ')
								const subStr = (u.subcategories || [])
									.map(
										(s: any) => (s as any)[`name_`] || s.name_en || ''
									)
									.slice(0, 3)
									.join(', ')
								return (
									<Link
										key={u.id}
										href={getLangPath(`/user/${u.id}`, 'en')}
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
									</Link>
								)
							})}
							{users.length === 0 && (
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
