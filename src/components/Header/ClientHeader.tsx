'use client'

import { DesktopHeader } from '@/components/Header/DesktopHeader'
import { MobileHeader } from '@/components/Header/MobileHeader'
import { TabletHeader } from '@/components/Header/TabletHeader'
import { type Lang } from '@/hooks/headerTranslation'
import { checkAuth } from '@/utils/auth'
import { useEffect, useState } from 'react'

interface ClientHeaderProps {
	lang: Lang
	initialAuth?: boolean
}

/**
 * Client-side Header wrapper для использования в client components
 * Проверяет аутентификацию на клиенте если initialAuth не передан
 */
export function ClientHeader({ lang, initialAuth }: ClientHeaderProps) {
	const [isAuth, setIsAuth] = useState<boolean>(initialAuth ?? false)
	const [isLoading, setIsLoading] = useState(!initialAuth)

	useEffect(() => {
		// Если initialAuth не передан, проверяем на клиенте
		if (initialAuth === undefined) {
			checkAuth().then(auth => {
				setIsAuth(auth)
				setIsLoading(false)
			})
		}
	}, [initialAuth])

	// Не показываем хедер пока идет загрузка
	if (isLoading) {
		return <div className='h-16' /> // placeholder для избежания layout shift
	}

	return (
		<header>
			{/* Mobile: 0-768px */}
			<div className='block md:hidden'>
				<MobileHeader lang={lang} initialAuth={isAuth} />
			</div>

			{/* Tablet: 768-1024px */}
			<div className='hidden md:block lg:hidden'>
				<TabletHeader lang={lang} initialAuth={isAuth} />
			</div>

			{/* Desktop: 1024px+ */}
			<div className='hidden lg:block'>
				<DesktopHeader lang={lang} initialAuth={isAuth} />
			</div>
		</header>
	)
}
