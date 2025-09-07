import { CompanyPage } from '@/components/CompanyPage/CompanyPage'
import Header from '@/components/Header/Header'
import { Lang } from '@/translations'

type Params = { lang: Lang; slug: string }

const SUPPORTED_LANGS: Lang[] = ['uk', 'en', 'pl', 'fr', 'de']

export default async function Page({ params }: { params: Promise<Params> }) {
	const { lang } = await params
	const { slug } = await params

	// Извлекаем ID из slug формата "test-url-5"
	const parts = slug.split('-')
	const id = parts[parts.length - 1]
	const slugname = parts.slice(0, -1).join('-')

	return (
		<main>
			<Header lang={lang} />
			<CompanyPage params={{ lang, slugname, id }} />
		</main>
	)
}
