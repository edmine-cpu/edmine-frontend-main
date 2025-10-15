'use client'

import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

interface Category {
	id: number
	name: string
	name_uk: string
	name_en: string
	name_pl: string
	name_fr: string
	name_de: string
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
	author?: number // ID автора задания
}

const T = {
	uk: {
		title: 'Заявки',
		companies: 'Компанії',
		services: 'Послуги',
		details: 'Детальніше',
		anyRegions: 'Будь-які регіони',
		startChat: 'Почати чат',
		loginToChat: 'Увійти для спілкування',
		cannotChatWithSelf: 'Неможливо створити чат з самим собою',
		chatError: 'Помилка створення чату. Спробуйте пізніше.',
		networkError: 'Помилка мережі. Перевірте підключення.',
	},
	en: {
		title: 'Orders',
		companies: 'Companies',
		services: 'Services',
		details: 'Details',
		anyRegions: 'Any regions',
		startChat: 'Start Chat',
		loginToChat: 'Login to chat',
		cannotChatWithSelf: 'Cannot create chat with yourself',
		chatError: 'Chat creation error. Try again later.',
		networkError: 'Network error. Check your connection.',
	},
	pl: {
		title: 'Zlecenia',
		companies: 'Firmy',
		services: 'Usługi',
		details: 'Szczegóły',
		anyRegions: 'Dowolne regiony',
		startChat: 'Rozpocznij czat',
		loginToChat: 'Zaloguj się, aby czatować',
		cannotChatWithSelf: 'Nie można utworzyć czatu z samym sobą',
		chatError: 'Błąd tworzenia czatu. Spróbuj ponownie później.',
		networkError: 'Błąd sieci. Sprawdź połączenie.',
	},
	fr: {
		title: 'Demandes',
		companies: 'Entreprises',
		services: 'Services',
		details: 'Détails',
		anyRegions: 'Toutes régions',
		startChat: 'Commencer le chat',
		loginToChat: 'Se connecter pour discuter',
		cannotChatWithSelf: 'Impossible de créer un chat avec soi-même',
		chatError: 'Erreur de création de chat. Réessayez plus tard.',
		networkError: 'Erreur réseau. Vérifiez votre connexion.',
	},
	de: {
		title: 'Aufträge',
		companies: 'Unternehmen',
		services: 'Leistungen',
		details: 'Details',
		anyRegions: 'Beliebige Regionen',
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
				router.push(`/chat/${data.chat_id}`)
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
					onClick={() => router.push(`/login`)}
					className='px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors text-sm'
				>
					🔐 {t.loginToChat}
				</button>
			)}
		</>
	)
}

export default function ZayavkiCategoryPage({
	params,
}: {
	params: Promise<{ categorySlug: string }>
}) {
	const resolvedParams = React.use(params)
	const lang = "en" as Lang
	const categorySlug = resolvedParams.categorySlug as string
	const t = T[lang]
	const router = useRouter()

	const [categories, setCategories] = useState<Category[]>([])
	const [bids, setBids] = useState<BidItem[]>([])
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	)

	useEffect(() => {
		fetch(API_ENDPOINTS.categories)
			.then(res => res.json())
			.then(data => {
				setCategories(data)
				// Находим категорию по slug (используем английское название)
				const category = data.find((cat: Category) => {
					const categoryName = (cat.name_en || cat.name)
						.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9-]/g, '')
					return categoryName === categorySlug
				})
				setSelectedCategory(category || null)
			})
			.catch(console.error)
	}, [categorySlug, lang])

	useEffect(() => {
		if (selectedCategory) {
			const params = new URLSearchParams()
			params.set('category', String(selectedCategory.id))

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
	}, [selectedCategory])

	// Утилиты для получения переводов
	const getName = (obj: any) =>
		obj?.[`name_`] ?? obj?.name_en ?? obj?.name_uk ?? ''
	const getTitle = (obj: any) =>
		obj?.[`title_`] ?? obj?.title_en ?? obj?.title_uk ?? ''
	const getDescription = (obj: any) =>
		obj?.[`description_`] ??
		obj?.description_en ??
		obj?.description_uk ??
		''
	const getSlug = (obj: any) =>
		obj?.[`slug_`] ?? obj?.slug_en ?? obj?.slug_uk ?? ''

	const getLocationString = (cityId?: number | null, countryId?: number) => {
		// Упрощенная версия для демонстрации
		return t.anyRegions
	}

	if (!selectedCategory) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Header lang={lang as any} />
				<div className='container mx-auto px-4 py-8'>
					<div className='flex justify-center items-center h-64'>
						<div className='text-lg'>Категорія не знайдена</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang="en" />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-6xl'>
					<div className='flex justify-between items-center mb-6'>
						<div>
							<h1 className='text-2xl font-semibold text-red-600'>
								{t.title}: {getName(selectedCategory)}
							</h1>
							<p className='text-gray-600 mt-1'>
								Категорія: {getName(selectedCategory)}
							</p>
						</div>
						<div className='flex gap-3'>
							<button
								onClick={() => router.push(`/zayavki`)}
								className='px-4 py-2 rounded-md bg-red-600 text-white font-semibold'
							>
								{t.title}
							</button>
							<button
								onClick={() => router.push(`/catalog/kompanii`)}
								className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold hover:bg-gray-50'
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
					</div>

					{/* Контент для заявок */}
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

							const bidSlug = getSlug(bid) || `bid-${bid.id}`
							const bidUrl = `//zayavki/order/${bidSlug}`

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
										<div className='flex items-center space-x-2'>
											<ChatButtonCard lang="en" authorId={bid.author} />
											<a
												href={bidUrl}
												className='px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors inline-block'
											>
												{t.details}
											</a>
										</div>
									</div>
								</div>
							)
						})}
						{bids.length === 0 && (
							<div className='text-center text-gray-500 py-8'>—</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
