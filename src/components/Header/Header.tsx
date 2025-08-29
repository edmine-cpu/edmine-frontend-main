'use client'

import { DesktopHeader } from '@/components/Header/DesktopHeader'
import { MobileHeader } from '@/components/Header/MobileHeader'
import { useTranslationHeader, type Lang } from '@/hooks/headerTranslation'

interface HeaderProps {
	lang: Lang
}

export function Header({ lang }: HeaderProps) {
	const { t } = useTranslationHeader(lang)

	return (
		<header>
			<div className='block md:hidden'>
				<MobileHeader lang={lang} />
			</div>
			<div className='hidden md:block'>
				<DesktopHeader lang={lang} />
			</div>
		</header>
	)
}

export default Header
