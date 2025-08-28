import { Lang } from '@/translations'

interface FuncData {
	lang: Lang
	description: string
}

export const TRANSLATIONS = {
	about: {
		uk: 'Про нас:',
		en: 'About us:',
		pl: 'O nas:',
		fr: 'À propos:',
		de: 'Über uns:',
	},
}

export function Description({ lang, description }: FuncData) {
	return (
		<div>
			<h2 className='ml-32 m-[20px] font-semibold flex justify-start items-center'>
				{TRANSLATIONS.about[lang]}
			</h2>

			<div className='flex justify-center items-center'>
				<span className='justify-center items-center max-w-[900px] h-auto'>
					{description}
				</span>
			</div>
		</div>
	)
}
