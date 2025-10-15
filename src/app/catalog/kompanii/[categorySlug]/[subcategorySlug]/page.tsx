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

interface Subcategory {
	id: number
	full_category_id: number
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
}

interface Company {
	id: number
	name: string
	description_uk?: string
	description_en?: string
	description_pl?: string
	description_fr?: string
	description_de?: string
	city?: string
	country?: string
	slug_name?: string
	owner_id?: number
	categories?: any[]
	subcategories?: any[]
}

const T = {
	uk: {
		title: 'Компанії',
		orders: 'Заявки',
		services: 'Послуги',
		details: 'Детальніше',
	},
	en: {
		title: 'Companies',
		orders: 'Orders',
		services: 'Services',
		details: 'Details',
	},
	pl: {
		title: 'Firmy',
		orders: 'Zlecenia',
		services: 'Usługi',
		details: 'Szczegóły',
	},
	fr: {
		title: 'Entreprises',
		orders: 'Demandes',
		services: 'Services',
		details: 'Détails',
	},
	de: {
		title: 'Unternehmen',
		orders: 'Aufträge',
		services: 'Leistungen',
		details: 'Details',
	},
} as const

export default function KompaniiSubcategoryPage({
	params,
}: {
	params: Promise<{ categorySlug: string; subcategorySlug: string }>
}) {
	const resolvedParams = React.use(params)
	const lang = "en" as Lang
	const categorySlug = resolvedParams.categorySlug as string
	const subcategorySlug = resolvedParams.subcategorySlug as string
	const t = T[lang]
	const router = useRouter()

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [companies, setCompanies] = useState<Company[]>([])
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	)
	const [selectedSubcategory, setSelectedSubcategory] =
		useState<Subcategory | null>(null)

	useEffect(() => {
		Promise.all([
			fetch(API_ENDPOINTS.categories),
			fetch(API_ENDPOINTS.subcategories),
		])
			.then(async ([c1, s1]) => {
				const categoriesData = await c1.json()
				const subcategoriesData = await s1.json()

				setCategories(categoriesData)
				setSubcategories(subcategoriesData)

				// Находим категорию по slug (используем английское название)
				const category = categoriesData.find((cat: Category) => {
					const categoryName = (cat.name_en || cat.name)
						.toLowerCase()
						.replace(/\s+/g, '-')
						.replace(/[^a-z0-9-]/g, '')
					return categoryName === categorySlug
				})

				if (category) {
					setSelectedCategory(category)

					// Находим подкатегорию по slug (используем английское название)
					const subcategory = subcategoriesData.find((sub: Subcategory) => {
						const subcategoryName = (sub.name_en || sub.name_uk || '')
							.toLowerCase()
							.replace(/\s+/g, '-')
							.replace(/[^a-z0-9-]/g, '')
						return (
							subcategoryName === subcategorySlug &&
							sub.full_category_id === category.id
						)
					})

					setSelectedSubcategory(subcategory || null)
				}
			})
			.catch(console.error)
	}, [categorySlug, subcategorySlug, lang])

	useEffect(() => {
		if (selectedCategory && selectedSubcategory) {
			const params = new URLSearchParams()
			params.set('limit', '20')
			params.set('offset', '0')
			params.set('category', String(selectedCategory.id))
			params.set('subcategory', String(selectedSubcategory.id))

			fetch(`${API_ENDPOINTS.companies}?${params.toString()}`)
				.then(res => res.json())
				.then(data => {
					if (Array.isArray(data)) {
						setCompanies(data)
					} else {
						setCompanies([])
					}
				})
				.catch(console.error)
		}
	}, [selectedCategory, selectedSubcategory])

	// Утилиты для получения переводов
	const getName = (obj: any) =>
		obj?.[`name_`] ?? obj?.name_en ?? obj?.name_uk ?? ''
	const getDescription = (obj: any) =>
		obj?.[`description_`] ??
		obj?.description_en ??
		obj?.description_uk ??
		''

	if (!selectedCategory || !selectedSubcategory) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Header lang={lang as any} />
				<div className='container mx-auto px-4 py-8'>
					<div className='flex justify-center items-center h-64'>
						<div className='text-lg'>Підкатегорія не знайдена</div>
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
								{t.title}: {getName(selectedCategory)} →{' '}
								{getName(selectedSubcategory)}
							</h1>
							<p className='text-gray-600 mt-1'>
								Категорія: {getName(selectedCategory)} / Підкатегорія:{' '}
								{getName(selectedSubcategory)}
							</p>
						</div>
						<div className='flex gap-3'>
							<button
								onClick={() => router.push(`/catalog/zayavki`)}
								className='px-4 py-2 rounded-md bg-white border text-gray-700 font-semibold hover:bg-gray-50'
							>
								{t.orders}
							</button>
							<button
								onClick={() => router.push(`/catalog/kompanii`)}
								className='px-4 py-2 rounded-md bg-red-600 text-white font-semibold'
							>
								{t.title}
							</button>
							<button
								className='px-4 py-2 rounded-md bg-white border font-semibold text-gray-400'
								disabled
							>
								{t.services}
							</button>
						</div>
					</div>

					{/* Контент для компаний */}
					<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
						{companies.map(company => {
							const description = getDescription(company)
							const location =
								company.city && company.country
									? `${company.city}, ${company.country}`
									: company.city || company.country || ''

							const companyUrl = `//kompanii/${company.slug_name}/${company.id}`

							return (
								<a
									key={company.id}
									href={companyUrl}
									className='block text-left bg-white rounded-md shadow p-5 border border-gray-200 hover:shadow-md transition'
								>
									<div className='mb-2'>
										<h3 className='font-semibold text-blue-700 text-lg mb-1'>
											{company.name}
										</h3>
										{location && (
											<div className='text-sm text-gray-600 mb-2'>
												📍 {location}
											</div>
										)}
									</div>

									{description && (
										<p className='text-sm text-gray-600 mb-3 line-clamp-3'>
											{description}
										</p>
									)}

									{/* Показываем категории если есть */}
									{company.categories && company.categories.length > 0 && (
										<div className='mb-3'>
											<div className='text-xs text-gray-500 mb-1'>
												Категорії:
											</div>
											<div className='flex flex-wrap gap-1'>
												{company.categories
													.slice(0, 3)
													.map((cat: any, index: number) => (
														<span
															key={index}
															className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs'
														>
															{getName(cat)}
														</span>
													))}
												{company.categories.length > 3 && (
													<span className='text-xs text-gray-500'>
														+{company.categories.length - 3}
													</span>
												)}
											</div>
										</div>
									)}

									<div className='mt-auto text-xs text-blue-600 font-medium'>
										{t.details} →
									</div>
								</a>
							)
						})}
						{companies.length === 0 && (
							<div className='text-center text-gray-500 py-8 col-span-full'>
								—
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
