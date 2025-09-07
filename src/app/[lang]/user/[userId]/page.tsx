'use client'

import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import React, { useEffect, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

interface User {
	id: number
	name: string
	email?: string
	city?: string
	country_id?: number
	country?: { id: number; name_en?: string }
	created_at?: string
	categories?: any[]
	subcategories?: any[]
	profile_description?: string
	user_role?: string
}

const T = {
	uk: {
		title: 'Профіль виконавця',
		back: '← Назад до каталогу',
		contact: 'Контакти',
		location: 'Локація',
		role: 'Роль',
		categories: 'Категорії',
		subcategories: 'Підкатегорії',
		description: 'Опис',
		joined: 'Приєднався',
		customer: 'Замовник',
		executor: 'Виконавець',
		both: 'Замовник + Виконавець',
		actions: 'Дії',
		openChat: 'Відкрити чат',
	},
	en: {
		title: 'Executor Profile',
		back: '← Back to catalog',
		contact: 'Contact',
		location: 'Location',
		role: 'Role',
		categories: 'Categories',
		subcategories: 'Subcategories',
		description: 'Description',
		joined: 'Joined',
		customer: 'Customer',
		executor: 'Executor',
		both: 'Customer + Executor',
		actions: 'Actions',
		openChat: 'Open Chat',
	},
	pl: {
		title: 'Profil wykonawcy',
		back: '← Powrót do katalogu',
		contact: 'Kontakt',
		location: 'Lokalizacja',
		role: 'Rola',
		categories: 'Kategorie',
		subcategories: 'Podkategorie',
		description: 'Opis',
		joined: 'Dołączył',
		customer: 'Klient',
		executor: 'Wykonawca',
		both: 'Klient + Wykonawca',
		actions: 'Działania',
		openChat: 'Otwórz czat',
	},
	fr: {
		title: "Profil de l'exécutant",
		back: '← Retour au catalogue',
		contact: 'Contact',
		location: 'Localisation',
		role: 'Rôle',
		categories: 'Catégories',
		subcategories: 'Sous-catégories',
		description: 'Description',
		joined: 'Rejoint',
		customer: 'Client',
		executor: 'Exécutant',
		both: 'Client + Exécutant',
		actions: 'Actions',
		openChat: 'Ouvrir le chat',
	},
	de: {
		title: 'Ausführender Profil',
		back: '← Zurück zum Katalog',
		contact: 'Kontakt',
		location: 'Standort',
		role: 'Rolle',
		categories: 'Kategorien',
		subcategories: 'Unterkategorien',
		description: 'Beschreibung',
		joined: 'Beigetreten',
		customer: 'Kunde',
		executor: 'Ausführender',
		both: 'Kunde + Ausführender',
		actions: 'Aktionen',
		openChat: 'Chat öffnen',
	},
} as const

export default function UserPage({
	params,
}: {
	params: Promise<{ lang: string; userId: string }>
}) {
	const resolvedParams = React.use(params)
	const lang = ((resolvedParams.lang as string) || 'uk') as Lang
	const userId = resolvedParams.userId
	const t = T[lang]

	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch(`${API_ENDPOINTS.users}`)
				if (!response.ok) {
					throw new Error('Failed to fetch user')
				}
				const users = await response.json()
				const foundUser = users.find((u: User) => u.id === parseInt(userId))
				if (foundUser) {
					setUser(foundUser)
				} else {
					setError('User not found')
				}
			} catch (err) {
				setError('Failed to load user')
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		if (userId) {
			fetchUser()
		}
	}, [userId])

	const getRoleText = (role?: string) => {
		switch (role) {
			case 'customer':
				return t.customer
			case 'executor':
				return t.executor
			case 'both':
				return t.both
			default:
				return t.executor
		}
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Header lang={lang} />
				<div className='flex items-center justify-center min-h-screen'>
					<div className='text-lg'>Loading...</div>
				</div>
			</div>
		)
	}

	if (error || !user) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Header lang={lang} />
				<div className='flex items-center justify-center min-h-screen'>
					<div className='text-lg text-red-600'>
						{error || 'User not found'}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<Header lang={lang} />
			<div className='max-w-4xl mx-auto px-4 py-8'>
				<a
					href={`/${lang}/catalog`}
					className='inline-flex items-center text-blue-600 hover:text-blue-800 mb-6'
				>
					{t.back}
				</a>

				<div className='bg-white rounded-lg shadow-md p-8'>
					<div className='flex items-center mb-6'>
						<div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mr-6'>
							{user.name.charAt(0).toUpperCase()}
						</div>
						<div>
							<h1 className='text-3xl font-bold text-gray-900'>{user.name}</h1>
							<p className='text-gray-600'>{getRoleText(user.user_role)}</p>
						</div>
					</div>

					{user.profile_description && (
						<div className='mb-8'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.description}
							</h3>
							<p className='text-gray-700 leading-relaxed'>
								{user.profile_description}
							</p>
						</div>
					)}

					{/* Дополнительная информация о пользователе */}
					<div className='mb-8'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>
							Додаткова інформація
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='bg-gray-50 p-4 rounded-lg'>
								<h4 className='font-medium text-gray-800 mb-2'>
									Досвід роботи
								</h4>
								<p className='text-gray-600'>
									Професійний виконавець з досвідом у сфері послуг
								</p>
							</div>
							<div className='bg-gray-50 p-4 rounded-lg'>
								<h4 className='font-medium text-gray-800 mb-2'>
									Спеціалізація
								</h4>
								<p className='text-gray-600'>
									Фокус на якість та своєчасне виконання замовлень
								</p>
							</div>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.location}
							</h3>
							<p className='text-gray-700'>{user.city || '—'}</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.role}
							</h3>
							<p className='text-gray-700'>{getRoleText(user.user_role)}</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.joined}
							</h3>
							<p className='text-gray-700'>
								{user.created_at
									? new Date(user.created_at).toLocaleDateString(
											lang === 'uk'
												? 'uk-UA'
												: lang === 'en'
												? 'en-US'
												: lang === 'pl'
												? 'pl-PL'
												: lang === 'fr'
												? 'fr-FR'
												: 'de-DE'
									  )
									: '—'}
							</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.actions}
							</h3>
							<div className='flex gap-3'>
								<button
									onClick={async () => {
										try {
											const formData = new FormData()
											formData.append('partner_id', user.id.toString())

											const response = await fetch(API_ENDPOINTS.createChat, {
												method: 'POST',
												body: formData,
												credentials: 'include',
											})

											if (response.ok) {
												const result = await response.json()
												window.location.href = `/${lang}/chat/${result.chat_id}`
											} else {
												alert('Ошибка создания чата')
											}
										} catch (error) {
											console.error('Error creating chat:', error)
											alert('Ошибка создания чата')
										}
									}}
									className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'
								>
									{t.openChat}
								</button>
							</div>
						</div>
					</div>

					{user.categories && user.categories.length > 0 && (
						<div className='mb-8'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.categories}
							</h3>
							<div className='flex flex-wrap gap-2'>
								{user.categories.map((cat: any, index: number) => (
									<span
										key={index}
										className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
									>
										{cat.name}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
