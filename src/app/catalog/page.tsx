'use client'

import { Header } from '@/components/Header/Header'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

export default function CatalogPage() {
	const lang = "en" as Lang
	const router = useRouter()

	useEffect(() => {
		// Редирект на заявки по умолчанию
		router.replace(`/catalog/zayavki`)
	}, [router, lang])

	return (
		<div className='min-h-screen bg-gray-50'>
			<Header lang={lang as any} />
			<div className='container mx-auto px-4 py-8'>
				<div className='flex justify-center items-center h-64'>
					<div className='text-lg'>Перенаправлення...</div>
				</div>
			</div>
		</div>
	)
}
