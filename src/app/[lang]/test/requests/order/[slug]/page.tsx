'use client'

import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

interface BidDetail {
	id: number
	title: string
	description?: string
	cost: number
	category: number[]
	undercategory: number[]
	country: string
	city: string
	slug: string
	owner_id: number
	created_at?: string
	updated_at?: string
	budget_type?: string
	user?: {
		first_name?: string
		last_name?: string
		email?: string
		phone_number?: string
	}
}

const T = {
	uk: {
		title: 'Деталі заявки',
		backToList: 'Повернутися до списку',
		category: 'Категорія',
		subcategory: 'Підкатегорія',
		location: 'Місце',
		budget: 'Бюджет',
		contact: 'Контакт',
		description: 'Опис',
		created: 'Створено',
		loading: 'Завантаження...',
		notFound: 'Заявку не знайдено',
		companies: 'Компанії',
	},
	en: {
		title: 'Request Details',
		backToList: 'Back to list',
		category: 'Category',
		subcategory: 'Subcategory',
		location: 'Location',
		budget: 'Budget',
		contact: 'Contact',
		description: 'Description',
		created: 'Created',
		loading: 'Loading...',
		notFound: 'Request not found',
		companies: 'Companies',
	},
	pl: {
		title: 'Szczegóły zlecenia',
		backToList: 'Powrót do listy',
		category: 'Kategoria',
		subcategory: 'Podkategoria',
		location: 'Lokalizacja',
		budget: 'Budżet',
		contact: 'Kontakt',
		description: 'Opis',
		created: 'Utworzono',
		loading: 'Ładowanie...',
		notFound: 'Nie znaleziono zlecenia',
		companies: 'Firmy',
	},
	fr: {
		title: 'Détails de la demande',
		backToList: 'Retour à la liste',
		category: 'Catégorie',
		subcategory: 'Sous-catégorie',
		location: 'Emplacement',
		budget: 'Budget',
		contact: 'Contact',
		description: 'Description',
		created: 'Créé',
		loading: 'Chargement...',
		notFound: 'Demande introuvable',
		companies: 'Entreprises',
	},
	de: {
		title: 'Auftragsdetails',
		backToList: 'Zurück zur Liste',
		category: 'Kategorie',
		subcategory: 'Unterkategorie',
		location: 'Standort',
		budget: 'Budget',
		contact: 'Kontakt',
		description: 'Beschreibung',
		created: 'Erstellt',
		loading: 'Laden...',
		notFound: 'Auftrag nicht gefunden',
		companies: 'Unternehmen',
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
	const router = useRouter()

	const [bid, setBid] = useState<BidDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	useEffect(() => {
		setLoading(true)
		// Fetch bid by slug
		// Note: You may need to implement a proper API endpoint for fetching by slug
		// For now, we'll try to fetch from bids list and find by slug
		fetch(`${API_ENDPOINTS.bids}`)
			.then(res => res.json())
			.then((data: any) => {
				let bids: any[] = []
				if (Array.isArray(data)) {
					bids = data
				} else if (typeof data === 'object') {
					bids = Object.values(data)
				}

				const foundBid = bids.find(
					(b: any) => b.slug === slug || String(b.id) === slug
				)
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
	}, [slug])

	if (loading) {
		return (
			<div className='min-h-screen flex flex-col'>
				<Header lang={langTyped} />
				<div className='flex-1 flex items-center justify-center'>
					<div className='text-center'>
						<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600'></div>
						<p className='mt-4 text-gray-600'>{t.loading}</p>
					</div>
				</div>
			</div>
		)
	}

	if (error || !bid) {
		return (
			<div className='min-h-screen flex flex-col'>
				<Header lang={langTyped} />
				<div className='flex-1 flex items-center justify-center'>
					<div className='text-center'>
						<p className='text-xl text-gray-600 mb-4'>{t.notFound}</p>
						<button
							onClick={() => router.push(`/${langTyped}/test/requests`)}
							className='px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700'
						>
							{t.backToList}
						</button>
					</div>
				</div>
			</div>
		)
	}

	const formatDate = (dateString?: string) => {
		if (!dateString) return ''
		const d = new Date(dateString)
		return `${String(d.getDate()).padStart(2, '0')}.${String(
			d.getMonth() + 1
		).padStart(2, '0')}.${d.getFullYear()} ${String(d.getHours()).padStart(
			2,
			'0'
		)}:${String(d.getMinutes()).padStart(2, '0')}`
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<Header lang={langTyped} />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-4xl'>
					{/* Header */}
					<div className='flex justify-between items-center mb-6'>
						<button
							onClick={() => router.push(`/${langTyped}/test/requests`)}
							className='text-red-600 hover:text-red-700 font-semibold'
						>
							← {t.backToList}
						</button>
						<button
							onClick={() => router.push(`/${langTyped}/test/company`)}
							className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold'
						>
							{t.companies}
						</button>
					</div>

					{/* Main Content */}
					<div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
						<h1 className='text-3xl font-bold text-gray-800 mb-4'>
							{bid.title}
						</h1>

						{/* Budget */}
						<div className='mb-6'>
							<span className='inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-xl font-bold'>
								💰 ${bid.cost}
								{bid.budget_type && ` ${bid.budget_type}`}
							</span>
						</div>

						{/* Description */}
						{bid.description && (
							<div className='mb-6'>
								<h2 className='text-xl font-semibold text-gray-700 mb-2'>
									{t.description}
								</h2>
								<p className='text-gray-600 whitespace-pre-wrap'>
									{bid.description}
								</p>
							</div>
						)}

						{/* Details Grid */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
							{/* Location */}
							<div className='bg-gray-50 rounded-lg p-4'>
								<h3 className='text-sm font-semibold text-gray-500 mb-2'>
									{t.location}
								</h3>
								<p className='text-lg text-gray-800'>
									📍 {bid.city}, {bid.country}
								</p>
							</div>

							{/* Created */}
							{bid.created_at && (
								<div className='bg-gray-50 rounded-lg p-4'>
									<h3 className='text-sm font-semibold text-gray-500 mb-2'>
										{t.created}
									</h3>
									<p className='text-lg text-gray-800'>
										📅 {formatDate(bid.created_at)}
									</p>
								</div>
							)}
						</div>

						{/* Categories */}
						{(bid.category.length > 0 || bid.undercategory.length > 0) && (
							<div className='mb-6'>
								<div className='flex flex-wrap gap-2'>
									{bid.category.length > 0 && (
										<span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm'>
											{t.category}: {bid.category.join(', ')}
										</span>
									)}
									{bid.undercategory.length > 0 && (
										<span className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm'>
											{t.subcategory}: {bid.undercategory.join(', ')}
										</span>
									)}
								</div>
							</div>
						)}

						{/* Contact Info */}
						{bid.user && (
							<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
								<h3 className='text-lg font-semibold text-red-700 mb-3'>
									{t.contact}
								</h3>
								<div className='space-y-2'>
									{(bid.user.first_name || bid.user.last_name) && (
										<div className='text-gray-700'>
											<span className='font-medium'>
												{bid.user.first_name} {bid.user.last_name}
											</span>
										</div>
									)}
									{bid.user.email && (
										<div className='text-gray-700'>
											📧{' '}
											<a
												href={`mailto:${bid.user.email}`}
												className='text-red-600 hover:underline'
											>
												{bid.user.email}
											</a>
										</div>
									)}
									{bid.user.phone_number && (
										<div className='text-gray-700'>
											📞{' '}
											<a
												href={`tel:${bid.user.phone_number}`}
												className='text-red-600 hover:underline'
											>
												{bid.user.phone_number}
											</a>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
