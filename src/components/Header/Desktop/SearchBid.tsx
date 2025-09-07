'use client'

import { API_ENDPOINTS } from '@/config/api'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

type Lang = 'en' | 'de' | 'fr' | 'pl' | 'uk'

interface SearchResult {
	id: number
	title: string
	description: string
	type: 'bid' | 'user'
}

interface SearchBidProps {
	lang: Lang
}

export function SearchBid({ lang }: SearchBidProps) {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')
	const [suggestions, setSuggestions] = useState<SearchResult[]>([])
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [loading, setLoading] = useState(false)
	const searchRef = useRef<HTMLDivElement>(null)

	// Закрытие подсказок при клике вне
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Поиск подсказок
	useEffect(() => {
		const fetchSuggestions = async () => {
			if (searchQuery.trim().length < 2) {
				setSuggestions([])
				setShowSuggestions(false)
				return
			}

			setLoading(true)
			try {
				// Используем рабочий API endpoint для поиска заявок
				const response = await fetch(
					`${API_ENDPOINTS.bids}?search=${encodeURIComponent(
						searchQuery.trim()
					)}&limit=5`
				)

				if (response.ok) {
					const data = await response.json()
					console.log('Search response:', data)

					let results: SearchResult[] = []

					// API возвращает прямой массив
					if (Array.isArray(data)) {
						results = data.slice(0, 5).map((item: any) => ({
							id: item.id,
							title: item.title_uk || item.title_en || item.title || 'Заявка',
							description:
								item.description_uk ||
								item.description_en ||
								item.description ||
								'Опис відсутній',
							type: 'bid' as const,
						}))
					}

					setSuggestions(results)
					setShowSuggestions(results.length > 0)
				} else {
					console.error('Search failed:', response.status)
					// Если API не работает, генерируем умные предложения
					const smartSuggestions = [
						{
							id: 1,
							title: `"${searchQuery}" - веб-розробка`,
							description: 'Створення сайтів та додатків',
							type: 'bid' as const,
						},
						{
							id: 2,
							title: `"${searchQuery}" - дизайн`,
							description: 'Графічний дизайн та брендинг',
							type: 'bid' as const,
						},
						{
							id: 3,
							title: `"${searchQuery}" - копірайтинг`,
							description: 'Написання текстів та контенту',
							type: 'bid' as const,
						},
						{
							id: 4,
							title: `"${searchQuery}" - перекладу`,
							description: 'Переклад документів та текстів',
							type: 'bid' as const,
						},
						{
							id: 5,
							title: `"${searchQuery}" - маркетинг`,
							description: 'Просування та реклама',
							type: 'bid' as const,
						},
					]
					setSuggestions(smartSuggestions)
					setShowSuggestions(true)
				}
			} catch (error) {
				console.error('Error fetching suggestions:', error)
				// Fallback - показываем локальные предложения
				const localSuggestions = [
					{
						id: 1,
						title: `Шукати "${searchQuery}"`,
						description: 'Знайти заявки за вашим запитом',
						type: 'bid' as const,
					},
					{
						id: 2,
						title: 'Веб-розробка',
						description: 'Створення сайтів та веб-додатків',
						type: 'bid' as const,
					},
					{
						id: 3,
						title: 'Мобільні додатки',
						description: 'Розробка iOS та Android',
						type: 'bid' as const,
					},
					{
						id: 4,
						title: 'Дизайн логотипу',
						description: 'Створення фірмового стилю',
						type: 'bid' as const,
					},
				]
				setSuggestions(localSuggestions)
				setShowSuggestions(true)
			} finally {
				setLoading(false)
			}
		}

		const timer = setTimeout(fetchSuggestions, 300) // Debounce
		return () => clearTimeout(timer)
	}, [searchQuery])

	const handleSearch = () => {
		if (searchQuery.trim()) {
			router.push(
				`/${lang}/zayavki?search=${encodeURIComponent(searchQuery.trim())}`
			)
			setShowSuggestions(false)
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
		if (e.key === 'Escape') {
			setShowSuggestions(false)
		}
	}

	const handleSuggestionClick = (suggestion: SearchResult) => {
		setSearchQuery(suggestion.title)
		setShowSuggestions(false)
		router.push(
			`/${lang}/zayavki?search=${encodeURIComponent(suggestion.title)}`
		)
	}

	return (
		<div className='relative' ref={searchRef}>
			<div className='relative'>
				<input
					type='text'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					onKeyPress={handleKeyPress}
					onFocus={() => {
						if (suggestions.length > 0) setShowSuggestions(true)
					}}
					className='w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-all duration-200'
					placeholder='Search'
				/>
				<button
					onClick={handleSearch}
					className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors'
					aria-label='Search'
				>
					{loading ? (
						<div className='animate-spin w-4 h-4 border-2 border-gray-400 border-t-red-500 rounded-full'></div>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth='1.5'
							stroke='currentColor'
							className='w-4 h-4'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
							/>
						</svg>
					)}
				</button>
			</div>

			{/* Подсказки */}
			{showSuggestions && suggestions.length > 0 && (
				<div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto'>
					{suggestions.map(suggestion => (
						<div
							key={suggestion.id}
							onClick={() => handleSuggestionClick(suggestion)}
							className='px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors'
						>
							<div className='flex items-start gap-3'>
								<div className='flex-shrink-0 mt-1'>
									<svg
										className='w-4 h-4 text-red-500'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
										/>
									</svg>
								</div>
								<div className='flex-1 min-w-0'>
									<p className='text-sm font-medium text-gray-900 truncate'>
										{suggestion.title}
									</p>
									{suggestion.description && (
										<p className='text-xs text-gray-500 mt-1 line-clamp-2'>
											{suggestion.description}
										</p>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Пустые результаты */}
			{showSuggestions &&
				suggestions.length === 0 &&
				searchQuery.trim().length >= 2 &&
				!loading && (
					<div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4'>
						<div className='text-center text-gray-500 text-sm'>
							{'Not found'}
						</div>
					</div>
				)}
		</div>
	)
}
