'use client'

import { DesktopHeader } from '@/components/Header/DesktopHeader'
import { MobileHeader } from '@/components/Header/MobileHeader'
import { TabletHeader } from '@/components/Header/TabletHeader'
import { useTranslationHeader, type Lang } from '@/hooks/headerTranslation'

interface HeaderProps {
	lang: Lang
}

export function Header({ lang }: HeaderProps) {
	const { t } = useTranslationHeader(lang)

	return (
		<header>
			{/* Mobile: 0-768px */}
			<div className='block md:hidden'>
				<MobileHeader lang={lang} />
			</div>

			{/* Tablet: 768-1024px */}
			<div className='hidden md:block lg:hidden'>
				<TabletHeader lang={lang} />
			</div>

			{/* Desktop: 1024px+ */}
			<div className='hidden lg:block'>
				<DesktopHeader lang={lang} />
			</div>
		</header>
	)
}

export default Header
