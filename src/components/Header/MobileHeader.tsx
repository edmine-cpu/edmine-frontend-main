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
		<header className='flex items-center justify-between px-2 py-3 bg-white'>
			{/* 5 элементов равномерно распределенных */}
			<div className='flex items-center justify-between w-full'>
				{/* 1. Logo */}
				<div className='flex-1 flex justify-center'>
					<TitleName lang={lang} />
				</div>

				{/* 2. Language Switcher */}
				<div className='flex-1 flex justify-center'>
					<LanguageSwitcher currentLang={lang} />
				</div>

				{/* 3. Search */}
				<div className='flex-1 flex justify-center'>
					<SearchIcon lang={lang} />
				</div>

				{/* 4. Add Button */}
				<div className='flex-1 flex justify-center'>
					<Link href={`/${lang || 'en'}/create-request`}>
						<button className='text-3xl font-bold text-red-600 leading-none hover:text-red-700 transition-colors font-primary px-3 py-2 rounded-lg hover:bg-red-50 w-12 h-12 flex items-center justify-center'>
							+
						</button>
					</Link>
				</div>

				{/* 5. Burger Menu */}
				<div className='flex-1 flex justify-center'>
					<MobileButtons lang={lang} />
				</div>
			</div>
		</header>
	)
}
