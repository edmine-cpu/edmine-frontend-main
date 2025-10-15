'use client'

import { Lang } from '@/app/(types)/lang'
import { API_ENDPOINTS } from '@/config/api'
import { useTranslationHeader } from '@/hooks/headerTranslation'
import { checkAuth, clearAuthCache } from '@/utils/auth'
import { getLangPath } from '@/utils/linkHelper'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import './btns.css'

// Cache admin status to reduce API calls
let adminCache: { isAdmin: boolean; timestamp: number } | null = null
const ADMIN_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const checkAdminStatus = async () => {
	// Return cached result if still valid
	if (adminCache && Date.now() - adminCache.timestamp < ADMIN_CACHE_DURATION) {
		return adminCache.isAdmin
	}

	try {
		const response = await fetch(API_ENDPOINTS.adminDashboard, {
			credentials: 'include',
		})
		const isAdmin = response.ok
		adminCache = { isAdmin, timestamp: Date.now() }
		return isAdmin
	} catch {
		adminCache = { isAdmin: false, timestamp: Date.now() }
		return false
	}
}

interface HeaderProps {
	lang: Lang
}

export function HeaderButtons({ lang }: HeaderProps) {
	const { t } = useTranslationHeader(lang)
	const [isAuth, setIsAuth] = useState<boolean | null>(null)
	const [isAdmin, setIsAdmin] = useState<boolean>(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)

	const checkAuthStatus = async () => {
		const auth = await checkAuth()
		setIsAuth(auth)
		if (auth) {
			const admin = await checkAdminStatus()
			setIsAdmin(admin)
		} else {
			setIsAdmin(false)
		}
	}

	useEffect(() => {
		checkAuthStatus()

		// Слушаем события изменения авторизации
		const handleAuthChange = () => {
			checkAuthStatus()
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('auth-changed', handleAuthChange)
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('auth-changed', handleAuthChange)
			}
		}
	}, [])

	// Close menu when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	// Проверяем, что функция t существует
	if (!t || typeof t !== 'function') {
		console.error('Translation function t is not available')
		return null
	}

	const handleLogout = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.logout, {
				method: 'POST',
				credentials: 'include',
			})
			if (response.ok) {
				// Дополнительно очищаем куки на клиенте и кэш
				document.cookie =
					'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;'
				document.cookie =
					'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
				clearAuthCache()

				// Уведомляем о смене авторизации
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new Event('auth-changed'))
				}

				setIsAuth(false)
				setIsAdmin(false)
				window.location.href = getLangPath('/', lang)
			}
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	if (isAuth === null) return null

	return (
		<div className='flex items-center space-x-4'>
			{/* Add Task Button - Always visible */}
			<Link href={getLangPath('/create-request', lang)}>
				<button className='buttonHead'>{t('addTask')}</button>
			</Link>

			{/* Auth-dependent buttons */}
			{isAuth ? (
				<>
					{/* Chats Button - Always visible when authenticated */}
					<Link href={getLangPath('/chats', lang)}>
						<button className='button-inverse-Head'>{t('chats')}</button>
					</Link>

					{/* Three dots menu */}
					<div className='relative' ref={menuRef}>
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition duration-200'
							aria-label={t('menu')}
						>
							<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
								<path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
							</svg>
						</button>

						{/* Dropdown Menu */}
						{isMenuOpen && (
							<div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50'>
								<div className='py-1'>
									<Link
										href={getLangPath('/profile', lang)}
										className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200'
									>
										{t('profile')}
									</Link>
									<Link
										href={getLangPath('/catalog', lang)}
										className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200'
									>
										{t('catalog')}
									</Link>
									<Link
										href={getLangPath('/blog', lang)}
										className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200'
									>
										{t('blog')}
									</Link>
									{isAdmin && (
										<Link
											href={getLangPath('/admin', lang)}
											className='block px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition duration-200 font-medium'
										>
											{t('admin')}
										</Link>
									)}
									<hr className='my-1' />
									<button
										onClick={handleLogout}
										className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200'
									>
										{t('logout')}
									</button>
								</div>
							</div>
						)}
					</div>
				</>
			) : (
				/* Login Button - When not authenticated */
				<Link href={getLangPath('/login', lang)}>
					<button className='button-inverse-Head'>{t('login')}</button>
				</Link>
			)}
		</div>
	)
}
