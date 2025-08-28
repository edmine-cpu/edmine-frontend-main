import { API_BASE_URL } from '@/config/api'
import { Description } from './Description'
import { OwnerData } from './OwnerData'

interface Company {
	id: number
	name: string
	slug_name: string
	city: string
	country: string
	owner_id: number
	description_uk: string
	description_en: string
	description_pl: string
	description_fr: string
	description_de: string
}

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'
type Params = { lang: Lang; slugname: string; id: string }

async function getCompany(slugname: string, id: string) {
	const res = await fetch(
		`${API_BASE_URL}/api/companies/slug/${slugname}/${id}`,
		{ cache: 'no-store' }
	)
	if (!res.ok) throw new Error('Ошибка загрузки компании')
	return res.json() as Promise<Company>
}

export async function CompanyPage({ params }: { params: Params }) {
	const { lang } = await params
	const { slugname } = await params
	const { id } = await params

	const company = await getCompany(slugname, id)

	const description: string =
		(company[`description_${lang}` as keyof Company] as string) ??
		company.description_uk

	return (
		<div className='m-4 container mx-auto flex justify-center items-center h-screen'>
			<div className='max-w-300 w-full min-h-screen rounded-md shadow-md p-6 bg-white flex flex-col'>
				<OwnerData
					lang={lang}
					name={company.name}
					country={company.country}
					city={company.city}
					id={company.owner_id}
				/>
				<Description lang={lang} description={description} />
			</div>
		</div>
	)
}
