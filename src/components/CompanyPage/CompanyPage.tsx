import { API_BASE_URL } from '@/config/api'
import { Categories } from './Categories'
import { Description } from './Description'
import { OwnerData } from './OwnerData'

interface Company {
	id: number
	name: string
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
	slug_name: string
	city: string
	country: string
	owner_id: number
	description_uk: string
	description_en: string
	description_pl: string
	description_fr: string
	description_de: string
	categories?: any[]
	subcategories?: any[]
}

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'
type Params = { lang: Lang; slugname: string; id: string }

async function getCompany(slugname: string, id: string) {
	// Сначала пробуем получить по ID напрямую
	try {
		const res = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
			cache: 'no-store',
		})
		if (res.ok) {
			return res.json() as Promise<Company>
		}
	} catch (error) {
		console.log('Failed to get company by ID, trying slug method')
	}

	// Если не получилось по ID, пробуем по слагу
	try {
		const fullSlug = `${slugname}-${id}`
		const res = await fetch(`${API_BASE_URL}/api/companies/slug/${fullSlug}`, {
			cache: 'no-store',
		})
		if (res.ok) {
			return res.json() as Promise<Company>
		}
	} catch (error) {
		console.log('Failed to get company by slug')
	}

	throw new Error('Компания не найдена')
}

export async function CompanyPage({ params }: { params: Params }) {
	const { lang } = await params
	const { slugname } = await params
	const { id } = await params

	const company = await getCompany(slugname, id)

	const description: string =
		(company[`description_${lang}` as keyof Company] as string) ??
		company.description_uk

	// Получаем переведенное название компании
	const companyName: string =
		(company[`name_${lang}` as keyof Company] as string) ??
		company.name_uk ??
		company.name

	return (
		<div className='m-4 container mx-auto flex justify-center items-center h-screen'>
			<div className='max-w-300 w-full min-h-screen rounded-md shadow-md p-6 bg-white flex flex-col'>
				<OwnerData
					lang={lang}
					name={companyName}
					country={company.country}
					city={company.city}
					id={company.owner_id}
				/>
				<Categories
					lang={lang}
					categories={company.categories}
					subcategories={company.subcategories}
				/>
				<Description lang={lang} description={description} />
			</div>
		</div>
	)
}
