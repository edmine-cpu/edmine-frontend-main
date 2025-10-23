'use client'

import { Header } from '@/components/Header/Header'
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

function get_initials(name: string): string {
	const words = name.trim().split(/\s+/)
	let initials = ''
	for (let i = 0; i < words.length; i++) {
		if (words[i].length > 0) {
			initials += words[i][0].toUpperCase()
		}
	}
	return initials
}

const CONTACT_TRANSLATIONS = {
	message: {
		uk: 'Написати',
		en: 'Write',
		pl: 'Napisz',
		fr: 'Écrire',
		de: 'Schreiben',
	},
	loginToChat: {
		uk: 'Увійти для спілкування',
		en: 'Login to chat',
		pl: 'Zaloguj się, aby czatować',
		fr: 'Se connecter pour discuter',
		de: 'Anmelden zum Chatten',
	},
	cannotChatWithSelf: {
		uk: 'Неможливо створити чат з самим собою',
		en: 'Cannot create chat with yourself',
		pl: 'Nie można utworzyć czatu z samym sobą',
		fr: 'Impossible de créer un chat avec soi-même',
		de: 'Chat mit sich selbst nicht möglich',
	},
	chatError: {
		uk: 'Помилка створення чату. Спробуйте пізніше.',
		en: 'Chat creation error. Try again later.',
		pl: 'Błąd tworzenia czatu. Spróbuj ponownie później.',
		fr: 'Erreur de création de chat. Réessayez plus tard.',
		de: 'Chat-Erstellungsfehler. Versuchen Sie es später erneut.',
	},
	networkError: {
		uk: 'Помилка мережі. Перевірте підключення.',
		en: 'Network error. Check your connection.',
		pl: 'Błąd sieci. Sprawdź połączenie.',
		fr: 'Erreur réseau. Vérifiez votre connexion.',
		de: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.',
	},
}

function BidAuthorContact({
	lang,
	name,
	id,
}: {
	lang: Lang
	name: string
	id: number
}) {
	const router = useRouter()
	const [currentUserId, setCurrentUserId] = useState<number | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	useEffect(() => {
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
		const t = CONTACT_TRANSLATIONS as Record<string, Record<string, string>>

		if (currentUserId === id) {
			alert(t.cannotChatWithSelf[lang])
			return
		}

		try {
			const formData = new FormData()
			formData.append('partner_id', id.toString())

			const response = await fetch(API_ENDPOINTS.createChat, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})

			if (response.ok) {
				const data = await response.json()
				router.push(`/${lang}/chat/${data.chat_id}`)
			} else {
				const errorData = await response.json()
				console.error('Failed to create chat:', response.status, errorData)

				if (
					response.status === 400 &&
					errorData.detail?.includes('с самим собой')
				) {
					alert(t.cannotChatWithSelf[lang])
				} else {
					alert(t.chatError[lang])
				}
			}
		} catch (error) {
			console.error('Error creating chat:', error)
			alert(t.networkError[lang])
		}
	}

	return (
		<div className='w-auto flex'>
			<div>
				<div className='h-16 w-16 rounded-full bg-green-300 border-1 text-center flex justify-center items-center text-white font-bold text-lg'>
					{get_initials(name)}
				</div>
			</div>
			<div className='flex flex-col pl-3 pr-6'>
				<h2 className='font-medium text-lg text-gray-900'>{name}</h2>
				<div className='mt-2'>
					{isAuthenticated ? (
						<button
							onClick={handleCreateChat}
							className='flex justify-center items-center mr-auto bg-gray-100 rounded-md pr-3 pl-3 py-2 hover:bg-gray-200 transition durations-200'
						>
							<span className='text-2xl mr-1'>✉ </span>
							{CONTACT_TRANSLATIONS.message[lang]}
						</button>
					) : (
						<button
							onClick={() => router.push(`/${lang}/login`)}
							className='flex justify-center items-center mr-auto bg-red-100 rounded-md pr-3 pl-3 py-2 hover:bg-red-200 transition durations-200'
						>
							<span className='text-2xl mr-1'>🔐 </span>
							{CONTACT_TRANSLATIONS.loginToChat[lang]}
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

interface Category {
	id: number
	name: string
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
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

interface BidDetail {
	title: string
	description?: string
	cost?: number | null
	subcprice?: string | null
	category: number[]
	undercategory: number[]
	country?: string | null
	city?: string | null
	slug: string
	owner_id: number
	created_at?: string
	budget_type?: string
}

const T = {
	uk: {
		title: 'Деталі заявки',
		back: '← Назад до заявок',
		category: 'Категорія',
		subcategory: 'Підкатегорія',
		location: 'Локація',
		contact: 'Контакти',
		budget: 'Бюджет',
		created: 'Створено',
		anyRegions: 'Будь-які регіони',
		author: 'Автор заявки',
	},
	en: {
		title: 'Request Details',
		back: '← Back to requests',
		category: 'Category',
		subcategory: 'Subcategory',
		location: 'Location',
		contact: 'Contact',
		budget: 'Budget',
		created: 'Created',
		anyRegions: 'Any regions',
		author: 'Request author',
	},
	pl: {
		title: 'Szczegóły zlecenia',
		back: '← Powrót do zleceń',
		category: 'Kategoria',
		subcategory: 'Podkategoria',
		location: 'Lokalizacja',
		contact: 'Kontakt',
		budget: 'Budżet',
		created: 'Utworzono',
		anyRegions: 'Dowolne regiony',
		author: 'Autor zlecenia',
	},
	fr: {
		title: 'Détails de la demande',
		back: '← Retour aux demandes',
		category: 'Catégorie',
		subcategory: 'Sous-catégorie',
		location: 'Localisation',
		contact: 'Contact',
		budget: 'Budget',
		created: 'Créé',
		anyRegions: 'Toutes régions',
		author: 'Auteur de la demande',
	},
	de: {
		title: 'Auftragsdetails',
		back: '← Zurück zu Aufträgen',
		category: 'Kategorie',
		subcategory: 'Unterkategorie',
		location: 'Standort',
		contact: 'Kontakt',
		budget: 'Budget',
		created: 'Erstellt',
		anyRegions: 'Beliebige Regionen',
		author: 'Antragsautor',
	},
} as const

type Params = {
	lang: string
	slug: string
}

export default function RequestDetailPage({
	params,
}: {
	params: Promise<Params>
}) {
	const resolvedParams = React.use(params)
	const { lang, slug } = resolvedParams
	const langTyped = ((lang as string) || 'en') as Lang
	const t = T[langTyped]

	const [bid, setBid] = useState<BidDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [author, setAuthor] = useState<{
		id: number
		name: string
		first_name?: string
		last_name?: string
	} | null>(null)

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])

	// Load categories and subcategories
	useEffect(() => {
		const fetchReferenceData = async () => {
			try {
				const [catsRes, subcatsRes] = await Promise.all([
					fetch(`${API_BASE_URL}/check/categories`),
					fetch(`${API_BASE_URL}/check/subcategories`),
				])

				if (!catsRes.ok || !subcatsRes.ok)
					throw new Error('Failed to fetch reference data')

				setCategories(await catsRes.json())
				setSubcategories(await subcatsRes.json())
			} catch (err) {
				console.error(err)
			}
		}

		fetchReferenceData()
	}, [])

	// Fetch bid by slug
	useEffect(() => {
		setLoading(true)
		const apiParams = new URLSearchParams()
		apiParams.set('language', langTyped)

		fetch(`${API_ENDPOINTS.bidsV2}/?${apiParams.toString()}`)
			.then(res => res.json())
			.then((data: any) => {
				const bids = data.results || []
				const foundBid = bids.find((b: any) => b.slug === slug)

				if (foundBid) {
					setBid(foundBid)
				} else {
					setError(true)
				}
			})
			.catch(err => {
				console.error(err)
				setError(true)
			})
			.finally(() => setLoading(false))
	}, [slug, langTyped])

	// Load author data
	useEffect(() => {
		const fetchAuthor = async () => {
			if (bid?.owner_id) {
				try {
					const response = await fetch(API_ENDPOINTS.userById(bid.owner_id))
					if (response.ok) {
						const userData = await response.json()
						setAuthor(userData)
					}
				} catch (error) {
					console.error('Error fetching author data:', error)
				}
			}
		}

		fetchAuthor()
	}, [bid])

	const getCategoryNames = (ids?: number[]) => {
		if (!ids || ids.length === 0) return '—'
		return (
			ids
				.map(id => {
					const category = categories.find(c => c.id === id)
					if (!category) return ''
					return (
						category[`name_${langTyped}`] || category.name_en || category.name
					)
				})
				.filter(Boolean)
				.join(', ') || '—'
		)
	}

	const getSubcategoryNames = (ids?: number[]) => {
		if (!ids || ids.length === 0) return '—'
		return (
			ids
				.map(id => {
					const subcategory = subcategories.find(s => s.id === id)
					if (!subcategory) return ''
					return (
						subcategory[`name_${langTyped}`] ||
						subcategory.name_en ||
						subcategory.name_uk ||
						''
					)
				})
				.filter(Boolean)
				.join(', ') || '—'
		)
	}

	const getLocationString = (city?: string | null, country?: string | null) => {
		if (city && country) {
			return `${city}, ${country}`
		} else if (country) {
			return country
		} else if (city) {
			return city
		} else {
			return t.anyRegions
		}
	}

	if (loading)
		return (
			<div className='min-h-screen'>
				<Header lang={langTyped} />
				<div className='flex items-center justify-center min-h-screen'>
					<div className='text-lg'>Loading...</div>
				</div>
			</div>
		)

	if (error || !bid)
		return (
			<div className='min-h-screen'>
				<Header lang={langTyped} />
				<div className='flex items-center justify-center min-h-screen'>
					<div className='text-lg text-red-600'>Request not found</div>
				</div>
			</div>
		)

	return (
		<div className='min-h-screen'>
			<Header lang={langTyped} />
			<div className='max-w-4xl mx-auto px-4 py-8'>
				<Link
					href={`/${langTyped}/test/requests`}
					className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-6'
				>
					{t.back}
				</Link>

				<div className='bg-white rounded-lg shadow-md p-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-6'>{bid.title}</h1>

					{bid.description && (
						<div className='prose max-w-none mb-8'>
							<p className='text-gray-700 text-lg leading-relaxed'>
								{bid.description}
							</p>
						</div>
					)}

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.category}
							</h3>
							<p className='text-gray-700'>{getCategoryNames(bid.category)}</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.subcategory}
							</h3>
							<p className='text-gray-700'>
								{getSubcategoryNames(bid.undercategory)}
							</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.location}
							</h3>
							<p className='text-gray-700'>
								{getLocationString(bid.city, bid.country)}
							</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								{t.budget}
							</h3>
							<p className='text-gray-700'>
								{bid.cost || bid.subcprice
									? `${bid.cost || bid.subcprice}${bid.budget_type ? ` ${bid.budget_type}` : ''}`
									: '—'}
							</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.contact}
							</h3>
							{author && (
								<BidAuthorContact
									lang={langTyped}
									name={
										author.name ||
										[author.first_name, author.last_name]
											.filter(Boolean)
											.join(' ') ||
										t.author
									}
									id={author.id}
								/>
							)}
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
				</div>
			</div>
		</div>
	)
}
