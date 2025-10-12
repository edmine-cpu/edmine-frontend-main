'use client'

import { Lang } from '@/app/(types)/lang'
import { LanguageSwitcher } from '@/components/Header/LanguageSwitcher'
import { MobileButtons } from '@/components/Header/Mobile/Buttons'
import { SearchIcon } from '@/components/Header/Mobile/SearchIcon'
import { TitleName } from '@/components/Header/Mobile/TitleName'
import Link from 'next/link'

interface HeaderProps {
	lang: Lang
}

export function MobileHeader({ lang }: HeaderProps) {
	return (
		<header className='w-full bg-white py-3'>
			<div className='flex w-full items-center justify-between px-0'>
				{/* 1. Logo */}
				<TitleName lang={lang} />

				{/* 2. Language Switcher */}
				<LanguageSwitcher currentLang={lang} />

				{/* 3. Search */}
				<SearchIcon lang={lang} />

				{/* 4. Add Button */}
				<Link href={`/${lang || 'en'}/create-request`}>
					<button className='text-3xl font-bold text-red-600 leading-none hover:text-red-700 transition-colors font-primary py-2 rounded-lg hover:bg-red-50 w-12 h-12 flex items-center justify-center'>
						+
					</button>
				</Link>

				{/* 5. Burger Menu */}
				<MobileButtons lang={lang} />
			</div>
		</header>
	)
}
