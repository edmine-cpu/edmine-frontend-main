'use client'

import { Lang } from '@/app/(types)/lang'
import { getTranslation } from '@/hooks/headerTranslation'
import { TabLink } from '@/components/headersOLD/Buttons'

interface BurgerListProps {
	lang: Lang
	onClose: () => void
}

export function BurgerList({ lang, onClose }: BurgerListProps) {
	const t = (key: string) => getTranslation(lang, key as any)

	return (
		<div className='absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 min-w-[200px] z-50'>
			<div className='py-2'>
				<div className='flex justify-between items-center px-4 py-2 border-b border-gray-100'>
					<span className='font-semibold text-gray-700'>Меню</span>
					<button
						className='text-gray-400 hover:text-gray-600 text-xl'
						onClick={onClose}
					>
						×
					</button>
				</div>
				<div className='flex flex-col'>
					<TabLink href={`/${lang || 'en'}/zayavki`} name={t('catalog')} mobile />
					<TabLink href={`/${lang || 'en'}/blog`} name={t('blog')} mobile />
					<TabLink
						href={`/${lang || 'en'}/create-request`}
						name={t('addTask')}
						mobile
					/>
					<TabLink href={`/${lang || 'en'}/chats`} name={t('chats')} mobile />
					<TabLink href={`/${lang || 'en'}/profile`} name={t('profile')} mobile />
				</div>
			</div>
		</div>
	)
}
