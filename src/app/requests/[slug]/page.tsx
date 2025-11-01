import { ServerHeader } from '@/components/Header/ServerHeader'
import { BidAuthorContact } from '@/components/Request/ContactButton'
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

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

interface Author {
	id: number
	name: string
	first_name?: string
	last_name?: string
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
		notFound: 'Заявку не знайдено',
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
		notFound: 'Request not found',
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
		notFound: 'Nie znaleziono zlecenia',
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
		notFound: 'Demande introuvable',
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
		notFound: 'Antrag nicht gefunden',
	},
} as const

type Params = {
	slug: string
}

// Server-side data fetching
async function getBid(slug: string, lang: Lang): Promise<BidDetail | null> {
	try {
		const apiParams = new URLSearchParams()
		apiParams.set('language', lang)

		const response = await fetch(
			`${API_ENDPOINTS.bidsV2}/?${apiParams.toString()}`,
			{
				next: { revalidate: 600 }, // Revalidate every 10 minutes
			}
		)

		if (!response.ok) {
			return null
		}

		const data = await response.json()
		const bids = data.results || []
		const foundBid = bids.find((b: any) => b.slug === slug)

		return foundBid || null
	} catch (error) {
		console.error('Error fetching bid:', error)
		return null
	}
}

async function getAuthor(ownerId: number): Promise<Author | null> {
	try {
		const response = await fetch(API_ENDPOINTS.userById(ownerId), {
			next: { revalidate: 3600 },
		})

		if (!response.ok) {
			return null
		}

		return await response.json()
	} catch (error) {
		console.error('Error fetching author:', error)
		return null
	}
}

async function getReferenceData(): Promise<{
	categories: Category[]
	subcategories: Subcategory[]
}> {
	try {
		const [catsRes, subcatsRes] = await Promise.all([
			fetch(`${API_BASE_URL}/check/categories`, {
				next: { revalidate: 86400 }, // 24 hours
			}),
			fetch(`${API_BASE_URL}/check/subcategories`, {
				next: { revalidate: 86400 },
			}),
		])

		if (!catsRes.ok || !subcatsRes.ok) {
			return { categories: [], subcategories: [] }
		}

		const [categories, subcategories] = await Promise.all([
			catsRes.json(),
			subcatsRes.json(),
		])

		return { categories, subcategories }
	} catch (error) {
		console.error('Error fetching reference data:', error)
		return { categories: [], subcategories: [] }
	}
}

// Generate metadata for SEO - ВАЖНО: noindex для заявок
export async function generateMetadata({
	params,
}: {
	params: Promise<Params>
}): Promise<Metadata> {
	const resolvedParams = await params
	const { slug } = resolvedParams

	// Get lang from headers
	const headersList = await headers()
	const lang = (headersList.get('x-locale') || 'en') as Lang

	// Fetch bid data
	const bid = await getBid(slug, lang)

	if (!bid) {
		return {
			title: T[lang].notFound,
			robots: {
				index: false,
				follow: true,
			},
		}
	}

	return {
		title: bid.title,
		description: bid.description?.substring(0, 160) || T[lang].title,
		robots: {
			index: false, // НЕ индексируем страницы заявок
			follow: true, // Но разрешаем переходить по ссылкам
		},
	}
}

export default async function RequestDetailPage({
	params,
}: {
	params: Promise<Params>
}) {
	const resolvedParams = await params
	const { slug } = resolvedParams

	// Get lang from headers
	const headersList = await headers()
	const lang = (headersList.get('x-locale') || 'en') as Lang
	const t = T[lang]

	// Fetch all data on server
	const [bid, referenceData] = await Promise.all([
		getBid(slug, lang),
		getReferenceData(),
	])

	if (!bid) {
		notFound()
	}

	// Fetch author
	const author = await getAuthor(bid.owner_id)

	const { categories, subcategories } = referenceData

	const getCategoryNames = (ids?: number[]) => {
		if (!ids || ids.length === 0) return '—'
		return (
			ids
				.map(id => {
					const category = categories.find(c => c.id === id)
					if (!category) return ''
					const langKey = `name_${lang}` as keyof Category
					return (
						(category[langKey] as string) || category.name_en || category.name
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
					const langKey = `name_${lang}` as keyof Subcategory
					return (
						(subcategory[langKey] as string) ||
						subcategory.name_en ||
						subcategory.name_uk ||
						''
					)
				})
				.filter(Boolean)
				.join(', ') || '—'
		)
	}

	const getLocationString = (
		city?: string | null,
		country?: string | null
	) => {
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

	const authorName =
		author?.name ||
		[author?.first_name, author?.last_name].filter(Boolean).join(' ') ||
		t.author

	return (
		<div className='min-h-screen'>
			<ServerHeader lang={lang} />
			<div className='max-w-4xl mx-auto px-4 py-8'>
				<Link
					href='/all?zayavki=True'
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
									? `${bid.cost || bid.subcprice}${
											bid.budget_type ? ` ${bid.budget_type}` : ''
									  }`
									: '—'}
							</p>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t.contact}
							</h3>
							{author && (
								<BidAuthorContact lang={lang} name={authorName} id={author.id} />
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
