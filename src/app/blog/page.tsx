'use client'

import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BlogArticle {
	id: number
	title: string
	description: string
	slug: string
	featured_image: string | null
	author_name: string
	created_at: string
	updated_at: string
}

const texts = {
	uk: {
		title: 'Блог',
		readMore: 'Читати далі',
		noArticles: 'Статей поки немає',
		by: 'Автор:',
		date: 'Дата:',
	},
	en: {
		title: 'Blog',
		readMore: 'Read more',
		noArticles: 'No articles yet',
		by: 'Author:',
		date: 'Date:',
	},
	pl: {
		title: 'Blog',
		readMore: 'Czytaj więcej',
		noArticles: 'Brak artykułów',
		by: 'Autor:',
		date: 'Data:',
	},
	fr: {
		title: 'Blog',
		readMore: 'Lire la suite',
		noArticles: 'Aucun article pour le moment',
		by: 'Auteur:',
		date: 'Date:',
	},
	de: {
		title: 'Blog',
		readMore: 'Weiterlesen',
		noArticles: 'Noch keine Artikel',
		by: 'Autor:',
		date: 'Datum:',
	},
}

export default function BlogPage() {
	const params = useParams()
	const lang = params.lang as string
	const t = texts[lang as keyof typeof texts] || texts.uk

	const [articles, setArticles] = useState<BlogArticle[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		fetchArticles()
	}, [lang])

	const fetchArticles = async () => {
		try {
			setLoading(true)
			const response = await fetch(`${API_ENDPOINTS.blogArticles}?lang=`)
			if (response.ok) {
				const data = await response.json()
				setArticles(data)
			} else {
				setError('Failed to fetch articles')
			}
		} catch (err) {
			setError('Error loading articles')
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	if (loading) {
		return (
			<div className='min-h-screen'>
				<Header lang={lang as any} />
				<div className='container mx-auto px-4 py-8'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto'></div>
						<p className='mt-4 text-gray-600'>Завантаження...</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen'>
			<Header lang={lang as any} />

			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
					{t.title}
				</h1>

				{error && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
						{error}
					</div>
				)}

				{articles.length === 0 ? (
					<div className='text-center py-12'>
						<p className='text-gray-600 text-lg'>{t.noArticles}</p>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{articles.map(article => (
							<article
								key={article.id}
								className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
							>
								{article.featured_image && (
									<div className='h-48 overflow-hidden'>
										<img
											src={article.featured_image}
											alt={article.title}
											className='w-full h-full object-cover'
										/>
									</div>
								)}

								<div className='p-6'>
									<h2 className='text-xl font-semibold text-gray-800 mb-3 line-clamp-2'>
										{article.title}
									</h2>

									{article.description && (
										<p className='text-gray-600 mb-4 line-clamp-3'>
											{article.description}
										</p>
									)}

									<div className='text-sm text-gray-500 mb-4'>
										<p>
											<span className='font-medium'>{t.by}</span>{' '}
											{article.author_name}
										</p>
										<p>
											<span className='font-medium'>{t.date}</span>{' '}
											{formatDate(article.created_at)}
										</p>
									</div>

									<Link href={`//blog/${article.id}`}>
										<button className='w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200'>
											{t.readMore}
										</button>
									</Link>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
