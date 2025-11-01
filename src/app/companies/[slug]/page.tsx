import { ServerHeader } from '@/components/Header/ServerHeader'
import { ContactButton } from '@/components/Company/ContactButton'
import { API_ENDPOINTS } from '@/config/api'
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
		notFound: 'Компанію не знайдено',
		requests: 'Заявки',
		reviews: 'Відгуки',
	},
	en: {
		backToList: 'Back to list',
		categories: 'Categories:',
		subcategories: 'Subcategories:',
		about: 'About us:',
		notFound: 'Company not found',
		requests: 'Requests',
		reviews: 'Reviews',
	},
	pl: {
		backToList: 'Powrót do listy',
		categories: 'Kategorie:',
		subcategories: 'Podkategorie:',
		about: 'O nas:',
		notFound: 'Nie znaleziono firmy',
		requests: 'Zlecenia',
		reviews: 'Opinie',
	},
	fr: {
		backToList: 'Retour à la liste',
		categories: 'Catégories:',
		subcategories: 'Sous-catégories:',
		about: 'À propos:',
		notFound: 'Entreprise introuvable',
		requests: 'Demandes',
		reviews: 'Avis',
	},
	de: {
		backToList: 'Zurück zur Liste',
		categories: 'Kategorien:',
		subcategories: 'Unterkategorien:',
		about: 'Über uns:',
		notFound: 'Unternehmen nicht gefunden',
		requests: 'Aufträge',
		reviews: 'Bewertungen',
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

// Server-side data fetching
async function getCompany(slug: string): Promise<CompanyDetail | null> {
	try {
		const response = await fetch(`${API_ENDPOINTS.company_by_slug(slug)}`, {
			next: { revalidate: 3600 }, // Revalidate every hour
		})

		if (!response.ok) {
			return null
		}

		return await response.json()
	} catch (error) {
		console.error('Error fetching company:', error)
		return null
	}
}

// Generate metadata for SEO
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

	// Fetch company data
	const company = await getCompany(slug)

	if (!company) {
		return {
			title: T[lang].notFound,
			robots: {
				index: false,
				follow: true,
			},
		}
	}

	// Get localized name and description
	const nameKey = `name_${lang}` as keyof CompanyDetail
	const descriptionKey = `description_${lang}` as keyof CompanyDetail

	const companyName = (company[nameKey] as string) || company.name_en || company.name
	const description = (company[descriptionKey] as string) || company.description_en || ''

	return {
		title: companyName,
		description: description.substring(0, 160), // Meta description limit
		robots: {
			index: true, // Индексируем страницы компаний
			follow: true,
		},
		openGraph: {
			title: companyName,
			description: description.substring(0, 160),
			type: 'website',
			locale: lang,
		},
	}
}

export default async function CompanyDetailPage({
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

	// Fetch company data on server
	const company = await getCompany(slug)

	if (!company) {
		notFound()
	}

	// Get localized name and description
	const nameKey = `name_${lang}` as keyof CompanyDetail
	const descriptionKey = `description_${lang}` as keyof CompanyDetail

	const companyName = (company[nameKey] as string) || company.name_en || company.name
	const description = (company[descriptionKey] as string) || company.description_en || ''

	const getCategoryName = (category: Category | Subcategory) => {
		const langKey = `name_${lang}` as keyof (Category | Subcategory)
		return (
			(category[langKey] as string) ||
			category.name_en ||
			category.name
		)
	}

	return (
		<div className='min-h-screen flex flex-col'>
			<ServerHeader lang={lang} />
			<div className='flex-1 flex items-start justify-center p-4'>
				<div className='w-full max-w-4xl'>
					{/* Header with back button */}
					<div className='flex justify-between items-center mb-6'>
						<Link
							href='/all'
							className='text-red-600 hover:text-red-700 font-semibold'
						>
							← {t.backToList}
						</Link>
						<Link
							href='/all?zayavki=True'
							className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold hover:bg-gray-100'
						>
							{t.requests}
						</Link>
					</div>

					{/* Main Content */}
					<div className='max-w-300 w-full min-h-screen rounded-md shadow-md p-6 bg-white flex flex-col'>
						{/* Owner Data Section */}
						<div className='w-auto flex mb-6'>
							<div>
								<div className='h-28 w-28 rounded-full bg-green-300 border-1 text-center flex justify-center items-center text-white font-bold text-3xl'>
									{getInitials(companyName)}
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
								{company.owner_id && (
									<ContactButton ownerId={company.owner_id} lang={lang} />
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
