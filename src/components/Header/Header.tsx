'use client'

import { DesktopHeader } from '@/components/Header/DesktopHeader'
import { MobileHeader } from '@/components/Header/MobileHeader'
import { useTranslation, type Lang } from '@/hooks/useTranslation'

interface HeaderProps {
	lang: Lang
}

export function Header({ lang }: HeaderProps) {
	const { t } = useTranslation(lang)

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
