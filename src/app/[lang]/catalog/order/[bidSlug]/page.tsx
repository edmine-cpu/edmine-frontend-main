'use client'

import { Header } from '@/components/Header/Header'
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

interface Bid {
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
	email?: string
	files?: string[]
	budget?: string
	budget_type?: string
	slug_uk?: string
	slug_en?: string
	slug_pl?: string
	slug_fr?: string
	slug_de?: string
	created_at?: string
	updated_at?: string
	author?: number // ID автора задания
}

interface Category {
	id: number
	name_uk: string
	name_en: string
	name_pl: string
	name_fr?: string
	name_de?: string
}

interface Subcategory {
	id: number
	full_category_id: number
	name_uk: string
	name_en: string
	name_pl: string
	name_fr?: string
	name_de?: string
}

interface Country {
	id: number
	name_uk: string
	name_en: string
	name_pl: string
	name_fr: string
	name_de: string
}

interface City {
	id: number
	name_uk: string
	name_en: string
	name_pl: string
	name_fr: string
	name_de: string
	country_id: number
}

const T = {
	uk: {
		title: 'Деталі заявки',
		back: '← Назад до категорії',
		category: 'Категорія',
		subcategory: 'Підкатегорія',
		location: 'Локація',
		contact: 'Контакти',
		budget: 'Бюджет',
		created: 'Створено',
		files: 'Файли',
		noFiles: 'Файлів немає',
		anyRegions: 'Будь-які регіони',
		startChat: 'Почати чат',
		loginToChat: 'Увійти для спілкування',
		cannotChatWithSelf: 'Неможливо створити чат з самим собою',
		chatError: 'Помилка створення чату. Спробуйте пізніше.',
		networkError: 'Помилка мережі. Перевірте підключення.',
	},
	en: {
		title: 'Bid Details',
		back: '← Back to category',
		category: 'Category',
		subcategory: 'Subcategory',
		location: 'Location',
		contact: 'Contact',
		budget: 'Budget',
		created: 'Created',
		files: 'Files',
		noFiles: 'No files',
		anyRegions: 'Any regions',
		startChat: 'Start Chat',
		loginToChat: 'Login to chat',
		cannotChatWithSelf: 'Cannot create chat with yourself',
		chatError: 'Chat creation error. Try again later.',
		networkError: 'Network error. Check your connection.',
	},
	pl: {
		title: 'Szczegóły zlecenia',
		back: '← Powrót do kategorii',
		category: 'Kategoria',
		subcategory: 'Podkategoria',
		location: 'Lokalizacja',
		contact: 'Kontakt',
		budget: 'Budżet',
		created: 'Utworzono',
		files: 'Pliki',
		noFiles: 'Brak plików',
		anyRegions: 'Dowolne regiony',
		startChat: 'Rozpocznij czat',
		loginToChat: 'Zaloguj się, aby czatować',
		cannotChatWithSelf: 'Nie można utworzyć czatu z samym sobą',
		chatError: 'Błąd tworzenia czatu. Spróbuj ponownie później.',
		networkError: 'Błąd sieci. Sprawdź połączenie.',
	},
	fr: {
		title: 'Détails de la demande',
		back: '← Retour à la catégorie',
		category: 'Catégorie',
		subcategory: 'Sous-catégorie',
		location: 'Localisation',
		contact: 'Contact',
		budget: 'Budget',
		created: 'Créé',
		files: 'Fichiers',
		noFiles: 'Aucun fichier',
		anyRegions: 'Toutes régions',
		startChat: 'Commencer le chat',
		loginToChat: 'Se connecter pour discuter',
		cannotChatWithSelf: 'Impossible de créer un chat avec soi-même',
		chatError: 'Erreur de création de chat. Réessayez plus tard.',
		networkError: 'Erreur réseau. Vérifiez votre connexion.',
	},
	de: {
		title: 'Angebotsdetails',
		back: '← Zurück zur Kategorie',
		category: 'Kategorie',
		subcategory: 'Unterkategorie',
		location: 'Standort',
		contact: 'Kontakt',
		budget: 'Budget',
		created: 'Erstellt',
		files: 'Dateien',
		noFiles: 'Keine Dateien',
		anyRegions: 'Beliebige Regionen',
		startChat: 'Chat starten',
		loginToChat: 'Anmelden zum Chatten',
		cannotChatWithSelf: 'Chat mit sich selbst nicht möglich',
		chatError: 'Chat-Erstellungsfehler. Versuchen Sie es später erneut.',
		networkError: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.',
	},
} as const

// Компонент кнопки чата
function ChatButton({ lang, authorId }: { lang: Lang; authorId?: number }) {
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
		<div className='mt-6 p-4 bg-gray-50 rounded-lg'>
			{isAuthenticated ? (
				<button
					onClick={handleCreateChat}
					className='w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2'
				>
					<span className='text-xl'>💬</span>
					<span>{t.startChat}</span>
				</button>
			) : (
				<button
					onClick={() => router.push(`/login`)}
					className='w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center space-x-2'
				>
					<span className='text-xl'>🔐</span>
					<span>{t.loginToChat}</span>
				</button>
			)}
		</div>
	)
}

export default function BidPage({
	params,
}: {
	params: Promise<{ lang: string; categorySlug: string; bidSlug: string }>
}) {
	const resolvedParams = React.use(params)
	const lang = "en" as Lang
	const categorySlug = resolvedParams.categorySlug
	const bidSlug = resolvedParams.bidSlug
	const t = T[lang]

	const [bid, setBid] = useState<Bid | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [countries, setCountries] = useState<Country[]>([])
	const [cities, setCities] = useState<City[]>([])

	useEffect(() => {
		const fetchReferenceData = async () => {
			try {
				const [catsRes, subcatsRes, countriesRes, citiesRes] =
					await Promise.all([
						fetch(API_ENDPOINTS.categories),
						fetch(API_ENDPOINTS.subcategories),
						fetch(API_ENDPOINTS.countries),
						fetch(API_ENDPOINTS.cities),
					])

				if (!catsRes.ok || !subcatsRes.ok || !countriesRes.ok || !citiesRes.ok)
					throw new Error('Failed to fetch reference data')

				setCategories(await catsRes.json())
				setSubcategories(await subcatsRes.json())
				setCountries(await countriesRes.json())
				setCities(await citiesRes.json())
			} catch (err) {
				console.error(err)
			}
		}

		fetchReferenceData()
	}, [])

	useEffect(() => {
		const fetchBid = async () => {
			try {
				const res = await fetch(API_ENDPOINTS.bids)
				if (!res.ok) throw new Error('Failed to fetch bids')

				const responseData = await res.json()

				// Проверяем, является ли responseData объектом с ключами "0", "1" и т.д.
				let bids: Bid[] = []
				if (typeof responseData === 'object' && !Array.isArray(responseData)) {
					// Преобразуем объект в массив
					bids = Object.values(responseData)
				} else if (Array.isArray(responseData)) {
					bids = responseData
				}

				const foundBid = bids.find(
					b =>
						[b.slug_uk, b.slug_en, b.slug_pl, b.slug_fr, b.slug_de].includes(
							bidSlug
						) || String(b.id) === bidSlug
				)

				if (foundBid) {
					setBid(foundBid)
				} else {
					const idMatch = bidSlug.match(/^bid-(\d+)$/)
					if (idMatch) {
						const bidId = parseInt(idMatch[1])
						const bidRes = await fetch(API_ENDPOINTS.bidById(bidId))
						if (bidRes.ok) setBid(await bidRes.json())
						else setError('Bid not found')
					} else {
						setError('Bid not found')
					}
				}
			} catch (err) {
				console.error(err)
				setError('Failed to load bid')
			} finally {
				setLoading(false)
			}
		}

		if (bidSlug) fetchBid()
	}, [bidSlug])

	const getTitle = (b: Bid) =>
		b[`title_${lang}` as keyof Bid] || b.title_en || b.title_uk || 'No title'
	const getDescription = (b: Bid) =>
		b[`description_${lang}` as keyof Bid] ||
		b.description_en ||
		b.description_uk ||
		'No description'

	const getCategoryNames = (ids?: number[]) => {
		if (!ids || ids.length === 0) return ''
		return (
			ids
				.map(id => {
					const category = categories.find(c => c.id === id)
					if (!category) return ''
					return (
						category[`name_${lang}` as keyof Category] ||
						category.name_en ||
						category.name_uk ||
						''
					)
				})
				.filter(Boolean)
				.join(', ') || ''
		)
	}

	const getSubcategoryNames = (ids?: number[]) => {
		if (!ids || ids.length === 0) return ''
		return (
			ids
				.map(id => {
					const subcategory = subcategories.find(s => s.id === id)
					if (!subcategory) return ''
					return (
						subcategory[`name_${lang}` as keyof Subcategory] ||
						subcategory.name_en ||
						subcategory.name_uk ||
						''
					)
				})
				.filter(Boolean)
				.join(', ') || ''
		)
	}

	const getCountryName = (id?: number) => {
		if (!id) return ''
		const country = countries.find(c => c.id === id)
		if (!country) return ''
		return (
			country[`name_${lang}` as keyof Country] ||
			country.name_en ||
			country.name_uk ||
			''
		)
	}

	const getCityName = (id?: number | null) => {
		if (!id) return ''
		const city = cities.find(c => c.id === id)
		if (!city) return ''
		return (
			city[`name_${lang}` as keyof City] || city.name_en || city.name_uk || ''
		)
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

	if (loading)
		return (
			<div className='min-h-screen'>
				<Header lang={lang} />
				<div className='flex items-center justify-center min-h-screen'>
					<div className='text-lg'>Loading...</div>
				</div>
			</div>
		)

	if (error || !bid)
		return (
			<div className='min-h-screen'>
				<Header lang={lang} />
				<div className='flex items-center justify-center min-h-screen'>
					<div className='text-lg text-red-600'>{error || 'Bid not found'}</div>
				</div>
			</div>
		)

	return (
		<div className='min-h-screen'>
			<Header lang={lang} />
			<div className='max-w-4xl mx-auto px-4 py-8'>
				<a
					href={`/catalog/`}
					className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-6'
				>
					{t.back}
				</a>

				<div className='bg-white rounded-lg shadow-md p-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-6'>
						{getTitle(bid)}
					</h1>

					<div className='prose max-w-none mb-8'>
						<p className='text-gray-700 text-lg leading-relaxed'>
							{getDescription(bid)}
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.category}
							</h3>
							<p className='text-gray-700'>
								{getCategoryNames(bid.categories) || '—'}
							</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.subcategory}
							</h3>
							<p className='text-gray-700'>
								{getSubcategoryNames(bid.under_categories) || '—'}
							</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.location}
							</h3>
							<p className='text-gray-700'>
								{getLocationString(bid.city, bid.country_id)}
							</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.budget}
							</h3>
							<p className='text-gray-700'>
								{bid.budget && bid.budget_type
									? `${bid.budget} ${bid.budget_type}`
									: '—'}
							</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.contact}
							</h3>
							<p className='text-gray-700'>{bid.email || '—'}</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.created}
							</h3>
							<p className='text-gray-700'>
								{bid.created_at
									? new Date(bid.created_at).toLocaleDateString()
									: '—'}
							</p>
						</div>
					</div>

					{/* Кнопка чата */}
					<ChatButton lang={lang} authorId={bid.author} />

					{bid.files && bid.files.length > 0 ? (
						<div className='mb-8'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.files}
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
								{bid.files.map((file, index) => {
									const fileName = file.split('/').pop() || ''
									const fileExt = fileName.split('.').pop()?.toLowerCase() || ''
									const isImage = [
										'jpg',
										'jpeg',
										'png',
										'gif',
										'webp',
										'svg',
										'bmp',
									].includes(fileExt)

									return (
										<div
											key={index}
											className='border border-gray-200 rounded-lg p-4'
										>
											{isImage ? (
												<button
													onClick={() => {
														const overlay = document.createElement('div')
														overlay.className =
															'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
														overlay.onclick = () =>
															document.body.removeChild(overlay)

														const img = document.createElement('img')
														img.src = `${API_BASE_URL}/${file}`
														img.className =
															'max-w-full max-h-full object-contain'
														img.onclick = e => e.stopPropagation()

														const closeBtn = document.createElement('button')
														closeBtn.innerHTML = '✕'
														closeBtn.className =
															'absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75'
														closeBtn.onclick = () =>
															document.body.removeChild(overlay)

														overlay.appendChild(img)
														overlay.appendChild(closeBtn)
														document.body.appendChild(overlay)
													}}
													className='text-blue-600 hover:text-blue-800 break-all w-full text-left'
												>
													🖼️ {fileName}
												</button>
											) : (
												<a
													href={`${API_ENDPOINTS.static}/${file}`}
													download={fileName}
													className='text-blue-600 hover:text-blue-800 break-all'
												>
													📎 {fileName}
												</a>
											)}
										</div>
									)
								})}
							</div>
						</div>
					) : (
						<div className='mb-8'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.files}
							</h3>
							<p className='text-gray-600'>{t.noFiles}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
