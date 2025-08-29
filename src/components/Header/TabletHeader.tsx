'use client'

import { Lang } from '@/app/(types)/lang'
import { HeaderButtons } from '@/components/Header/Desktop/Buttons'
import { SearchBid } from '@/components/Header/Desktop/SearchBid'
import { TitleName } from '@/components/Header/Desktop/TitleName'
import { LanguageSwitcher } from '@/components/Header/LanguageSwitcher'
import { useState } from 'react'

interface HeaderProps {
	lang: Lang
}

export function TabletHeader({ lang }: HeaderProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return (
		<header className='flex items-center justify-between w-full max-w-7xl mx-auto mt-3 px-4'>
			{/* Logo */}
			<div className='flex-shrink-0'>
				<TitleName lang={lang} />
			</div>

			{/* Center section */}
			<div className='flex items-center space-x-2 md:space-x-4 flex-1 justify-center max-w-sm lg:max-w-md'>
				<LanguageSwitcher currentLang={lang} />
				<SearchBid lang={lang} />
			</div>

			{/* Right section */}
			<div className='flex items-center space-x-1 md:space-x-2 flex-shrink-0'>
				{/* Add Task Button */}

				{/* Auth Buttons */}
				<HeaderButtons lang={lang || 'en'} />
			</div>

			{/* Overlay to close menu when clicking outside */}
			{isMenuOpen && (
				<div
					className='fixed inset-0 z-40'
					onClick={() => setIsMenuOpen(false)}
				/>
			)}
		</header>
	)
}
