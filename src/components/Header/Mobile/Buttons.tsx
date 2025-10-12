'use client'

import { Lang } from '@/app/(types)/lang'
import { API_ENDPOINTS } from '@/config/api'
import { useTranslationHeader } from '@/hooks/headerTranslation'
import { checkAuth, clearAuthCache } from '@/utils/auth'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import './mobile-fixes.css'

interface MobileButtonsProps {
	lang: Lang
}

export function MobileButtons({ lang }: MobileButtonsProps) {
	const { t } = useTranslationHeader(lang)
	const [isAuth, setIsAuth] = useState<boolean | null>(null)
	const [isAdmin, setIsAdmin] = useState<boolean>(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		checkAuthStatus()

		const handleAuthChange = () => checkAuthStatus()
		window.addEventListener('auth-changed', handleAuthChange)

		return () => {
			window.removeEventListener('auth-changed', handleAuthChange)
		}
	}, [])

	// Закрытие меню по клику вне
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Проверяем, что функция t существует
	if (!t || typeof t !== 'function') {
		console.error('Translation function t is not available')
		return null
	}

	const checkAuthStatus = async () => {
		const auth = await checkAuth()
		setIsAuth(auth)
		if (auth) {
			try {
				const response = await fetch(API_ENDPOINTS.adminDashboard, {
					credentials: 'include',
				})
				setIsAdmin(response.ok)
			} catch {
				setIsAdmin(false)
			}
		} else {
			setIsAdmin(false)
		}
	}

	useEffect(() => {
		checkAuthStatus()

		const handleAuthChange = () => checkAuthStatus()
		window.addEventListener('auth-changed', handleAuthChange)

		return () => {
			window.removeEventListener('auth-changed', handleAuthChange)
		}
	}, [])

	// Закрытие меню по клику вне
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleLogout = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.logout, {
				method: 'POST',
				credentials: 'include',
			})
			if (response.ok) {
				// удаляем токен
				document.cookie =
					'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
				clearAuthCache()

				window.dispatchEvent(new Event('auth-changed'))
				setIsAuth(false)
				setIsAdmin(false)
				setIsMenuOpen(false)
				window.location.href = `/${lang || 'uk'}`
			}
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	return (
		<div className='flex items-center'>
			<div className='relative' ref={menuRef}>
				{/* Кнопка всегда доступна */}
				<button
					onClick={e => {
						e.preventDefault()
						setIsMenuOpen(!isMenuOpen)
					}}
					className='flex flex-col justify-center w-12 h-12 cursor-pointer group p-3 space-y-1 bg-transparent hover:bg-gray-100 rounded-md transition-colors hamburger-button mobile-button'
					aria-label={t('home')}
					type='button'
				>
					<span className='hamburger-line'></span>
					<span className='hamburger-line'></span>
					<span className='hamburger-line'></span>
				</button>

				{/* Выпадающее меню */}
				{isMenuOpen && (
					<div className='absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200 z-50 font-primary'>
						<div className='py-2'>
							{isAuth === null ? (
								<div className='px-5 py-3 text-sm text-gray-400'>
									Loading...
								</div>
							) : isAuth ? (
								<>
									<Link
										href={`/${lang || 'uk'}/profile`}
										className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2'
										onClick={() => {
											setIsMenuOpen(false)
										}}
									>
										{t('profile')}
									</Link>
									<Link
										href={`/${lang || 'uk'}/chats`}
										className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2'
										onClick={() => {
											setIsMenuOpen(false)
										}}
									>
										{t('chat')}
									</Link>
									<Link
										href={`/${lang || 'uk'}/zayavki`}
										className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2'
										onClick={() => {
											setIsMenuOpen(false)
										}}
									>
										{t('catalog')}
									</Link>
									<Link
										href={`/${lang || 'uk'}/blog`}
										className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2'
										onClick={() => {
											setIsMenuOpen(false)
										}}
									>
										{t('blog')}
									</Link>
									<hr className='my-1' />
									<button
										onClick={e => {
											e.preventDefault()
											handleLogout()
										}}
										className='block w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-2'
										type='button'
									>
										{t('logout')}
									</button>
								</>
							) : (
								<>
									<Link
										href={`/${lang || 'uk'}/zayavki`}
										className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2'
										onClick={() => {
											setIsMenuOpen(false)
										}}
									>
										{t('catalog')}
									</Link>
									<Link
										href={`/${lang || 'uk'}/blog`}
										className='block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-2'
										onClick={() => {
											setIsMenuOpen(false)
										}}
									>
										{t('blog')}
									</Link>
									<hr className='my-1' />
									<Link
										href={`/${lang || 'uk'}/login`}
										className='block px-5 py-3 text-sm text-blue-600 hover:bg-blue-50 font-medium rounded-lg mx-2'
										onClick={() => {
											setIsMenuOpen(false)
										}}
									>
										{t('login')}
									</Link>
									<Link
										href={`/${lang || 'uk'}/forgot-password`}
										className='block px-5 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-2'
										onClick={() => {
											setIsMenuOpen(false)
										}}
									>
										Забули пароль?
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
