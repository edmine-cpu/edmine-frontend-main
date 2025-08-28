import { CompanyPage } from '@/components/CompanyPage/CompanyPage'
import Header from '@/components/Header/Header'
import { Lang } from '@/translations'

type Params = { lang: Lang; slugname: string; id: string }

const SUPPORTED_LANGS: Lang[] = ['uk', 'en', 'pl', 'fr', 'de']

export default async function Page({ params }: { params: Params }) {
	const { lang } = await params
	const { slugname } = await params
	const { id } = await params

	return (
		<main>
			<Header lang={lang} />
			<CompanyPage params={{ lang, slugname, id }} />
		</main>
	)
}
