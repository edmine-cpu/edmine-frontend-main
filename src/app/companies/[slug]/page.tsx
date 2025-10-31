'use client'

import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import { useRouter, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getLangFromPathname, getLangPath } from '@/utils/linkHelper'
import { getCompanyDetailPath } from '@/lib/i18n-routes'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

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
	name: string
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
}

interface CompanyDetail {
	id: number
	name: string
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
	description_uk?: string
	description_en?: string
	description_pl?: string
	description_fr?: string
	description_de?: string
	category_ids?: number[]
	subcategory_ids?: number[]
	categories?: Category[]
	subcategories?: Subcategory[]
	country?: string
	city?: string
	slug: string
	slug_name?: string
	owner_id?: number
	created_at?: string
	updated_at?: string
}

const T = {
	uk: {
		backToList: 'Повернутися до списку',
		categories: 'Категорії:',
		subcategories: 'Підкатегорії:',
		about: 'Про нас:',
		loading: 'Завантаження...',
		notFound: 'Компанію не знайдено',
		requests: 'Заявки',
		reviews: 'Відгуки',
		message: 'Написати',
		loginToChat: 'Увійти для спілкування',
		cannotChatWithSelf: 'Неможливо створити чат з самим собою',
		chatError: 'Помилка створення чату. Спробуйте пізніше.',
		networkError: 'Помилка мережі. Перевірте підключення.',
	},
	en: {
		backToList: 'Back to list',
		categories: 'Categories:',
		subcategories: 'Subcategories:',
		about: 'About us:',
		loading: 'Loading...',
		notFound: 'Company not found',
		requests: 'Requests',
		reviews: 'Reviews',
		message: 'Write',
		loginToChat: 'Login to chat',
		cannotChatWithSelf: 'Cannot create chat with yourself',
		chatError: 'Chat creation error. Try again later.',
		networkError: 'Network error. Check your connection.',
	},
	pl: {
		backToList: 'Powrót do listy',
		categories: 'Kategorie:',
		subcategories: 'Podkategorie:',
		about: 'O nas:',
		loading: 'Ładowanie...',
		notFound: 'Nie znaleziono firmy',
		requests: 'Zlecenia',
		reviews: 'Opinie',
		message: 'Napisz',
		loginToChat: 'Zaloguj się, aby czatować',
		cannotChatWithSelf: 'Nie można utworzyć czatu z samym sobą',
		chatError: 'Błąd tworzenia czatu. Spróbuj ponownie później.',
		networkError: 'Błąd sieci. Sprawdź połączenie.',
	},
	fr: {
		backToList: 'Retour à la liste',
		categories: 'Catégories:',
		subcategories: 'Sous-catégories:',
		about: 'À propos:',
		loading: 'Chargement...',
		notFound: 'Entreprise introuvable',
		requests: 'Demandes',
		reviews: 'Avis',
		message: 'Écrire',
		loginToChat: 'Se connecter pour discuter',
		cannotChatWithSelf: 'Impossible de créer un chat avec soi-même',
		chatError: 'Erreur de création de chat. Réessayez plus tard.',
		networkError: 'Erreur réseau. Vérifiez votre connexion.',
	},
	de: {
		backToList: 'Zurück zur Liste',
		categories: 'Kategorien:',
		subcategories: 'Unterkategorien:',
		about: 'Über uns:',
		loading: 'Laden...',
		notFound: 'Unternehmen nicht gefunden',
		requests: 'Aufträge',
		reviews: 'Bewertungen',
		message: 'Schreiben',
		loginToChat: 'Anmelden zum Chatten',
		cannotChatWithSelf: 'Chat mit sich selbst nicht möglich',
		chatError: 'Chat-Erstellungsfehler. Versuchen Sie es später erneut.',
		networkError: 'Netzwerkfehler. Überprüfen Sie Ihre Verbindung.',
	},
} as const

type Params = {
	slug: string
}

// Helper function to get initials from name
function getInitials(name: string): string {
	const words = name.trim().split(/\s+/)
	let initials = ''
	for (let i = 0; i < words.length; i++) {
		if (words[i].length > 0) {
			initials += words[i][0].toUpperCase()
		}
	}
	return initials
}

export default function CompanyDetailPage({
	params,
}: {
	params: Promise<Params>
}) {
	const pathname = usePathname()
	const resolvedParams = React.use(params)
	const { slug } = resolvedParams
	const lang = getLangFromPathname(pathname)
	const t = T[lang]
	const router = useRouter()

	const [company, setCompany] = useState<CompanyDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [currentUserId, setCurrentUserId] = useState<number | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	// Fetch current user
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

	// Fetch company by slug
	useEffect(() => {
		setLoading(true)
		fetch(`${API_ENDPOINTS.company_by_slug(slug)}`)
			.then(res => {
				if (!res.ok) {
					throw new Error('Company not found')
				}
				return res.json()
			})
			.then((data: any) => {
				setCompany(data)
			})
			.catch(err => {
				console.error(err)
				setError(true)
			})
			.finally(() => setLoading(false))
	}, [slug])

	const handleCreateChat = async () => {
		if (!company?.owner_id) return

		// Check if user is trying to chat with themselves
		if (currentUserId === company.owner_id) {
			alert(t.cannotChatWithSelf)
			return
		}

		try {
			const formData = new FormData()
			formData.append('partner_id', company.owner_id.toString())

			const response = await fetch(API_ENDPOINTS.createChat, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})

			if (response.ok) {
				const data = await response.json()
				router.push(getLangPath(`/chat/${data.chat_id}`, lang))
			} else {
				const errorData = await response.json()
				console.error('Failed to create chat:', response.status, errorData)

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

	if (loading) {
		return (
			<div className='min-h-screen flex flex-col'>
				<Header lang={lang} />
				<div className='flex-1 flex items-center justify-center'>
					<div className='text-center'>
						<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600'></div>
						<p className='mt-4 text-gray-600'>{t.loading}</p>
					</div>
				</div>
			</div>
		)
	}

	if (error || !company) {
		return (
			<div className='min-h-screen flex flex-col'>
				<Header lang={lang} />
				<div className='flex-1 flex items-center justify-center'>
					<div className='text-center'>
						<p className='text-xl text-gray-600 mb-4'>{t.notFound}</p>
						<button
							onClick={() => router.push('/all')}
							className='px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700'
						>
							{t.backToList}
						</button>
					</div>
				</div>
			</div>
		)
	}

	// Get localized name and description
	const nameKey = `name_${lang}` as 'name_uk' | 'name_en' | 'name_pl' | 'name_fr' | 'name_de'
	const descriptionKey = `description_${lang}` as 'description_uk' | 'description_en' | 'description_pl' | 'description_fr' | 'description_de'

	const companyName: string = company[nameKey] || company.name_en || company.name
	const description: string = company[descriptionKey] || company.description_en || ''

	const getCategoryName = (category: Category | Subcategory) => {
		return (
			(category as any)[`name_${lang}`] ||
			category.name_en ||
			category.name
		)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang={lang} />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-4xl'>
					{/* Header with back button */}
					<div className='flex justify-between items-center mb-6'>
						<button
							onClick={() => router.push('/all')}
							className='text-red-600 hover:text-red-700 font-semibold'
						>
							← {t.backToList}
						</button>
						<button
							onClick={() => router.push('/all?zayavki=True')}
							className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold hover:bg-gray-100'
						>
							{t.requests}
						</button>
					</div>

					{/* Main Content */}
					<div className='max-w-300 w-full min-h-screen rounded-md shadow-md p-6 bg-white flex flex-col'>
						{/* Owner Data Section */}
						<div className='w-auto flex mb-6'>
							<div>
								<div className='h-28 w-28 rounded-full bg-green-300 border-1 text-center flex justify-center items-center text-white font-bold text-3xl'>
									{getInitials(companyName as string)}
								</div>
							</div>
							<div className='flex flex-col pl-3 pr-6'>
								<h1 className='justify-end font-bold text-xl'>
									{companyName}
								</h1>
								<div>
									{company.country}
									{company.country && company.city && ', '}
									{company.city}
								</div>
								<div className='flex items-center space-x-2'>
									{/* Stars */}
									<div className='flex text-yellow-400'>
										<span>★</span>
										<span>★</span>
										<span>★</span>
										<span>★</span>
										<span>★</span>
									</div>
									{/* Review count */}
									<span className='text-gray-600 text-sm'>
										(120 {t.reviews})
									</span>
								</div>
								{isAuthenticated ? (
									<button
										onClick={handleCreateChat}
										className='flex justify-center items-center mr-auto bg-gray-100 rounded-md pr-3 pl-3 hover:bg-gray-200 transition durations-200'
									>
										<span className='text-3xl'>✉ </span>
										{t.message}
									</button>
								) : (
									<button
										onClick={() => router.push(getLangPath('/login', lang))}
										className='flex justify-center items-center mr-auto bg-red-100 rounded-md pr-3 pl-3 hover:bg-red-200 transition durations-200'
									>
										<span className='text-3xl'>🔐 </span>
										{t.loginToChat}
									</button>
								)}
							</div>
						</div>

						{/* Categories Section */}
						{(company.categories || company.subcategories) && (
							<div className='mt-6'>
								{company.categories && company.categories.length > 0 && (
									<div className='mb-4'>
										<h3 className='font-semibold text-gray-800 mb-2'>
											{t.categories}
										</h3>
										<div className='flex flex-wrap gap-2'>
											{company.categories.map(category => (
												<span
													key={category.id}
													className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium'
												>
													{getCategoryName(category)}
												</span>
											))}
										</div>
									</div>
								)}

								{company.subcategories && company.subcategories.length > 0 && (
									<div>
										<h3 className='font-semibold text-gray-800 mb-2'>
											{t.subcategories}
										</h3>
										<div className='flex flex-wrap gap-2'>
											{company.subcategories.map(subcategory => (
												<span
													key={subcategory.id}
													className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
												>
													{getCategoryName(subcategory)}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						)}

						{/* Description Section */}
						{description && (
							<div className='mt-6'>
								<h2 className='ml-32 m-[20px] font-semibold flex justify-start items-center'>
									{t.about}
								</h2>
								<div className='flex justify-center items-center'>
									<span className='justify-center items-center max-w-[900px] h-auto'>
										{description}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
