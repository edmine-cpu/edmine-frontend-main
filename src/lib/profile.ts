import { API_ENDPOINTS } from '@/config/api'
import { cookies } from 'next/headers'

export async function getProfile() {
	const cookieStore = cookies()

	try {
		const [profileRes, companiesRes, countriesRes, citiesRes] =
			await Promise.all([
				fetch(API_ENDPOINTS.profile, {
					headers: {
						Cookie: cookieStore.toString(),
					},
				}),
				fetch(API_ENDPOINTS.companies_profile, {
					headers: {
						Cookie: cookieStore.toString(),
					},
				}),
				fetch(API_ENDPOINTS.countries),
				fetch(API_ENDPOINTS.cities),
			])

		const profile = profileRes.ok ? await profileRes.json() : null
		const companies = companiesRes.ok ? await companiesRes.json() : []
		const countries = countriesRes.ok ? await countriesRes.json() : []
		const cities = citiesRes.ok ? await citiesRes.json() : []

		return { profile, companies, countries, cities }
	} catch (error) {
		console.error('Error fetching profile data:', error)
		return { profile: null, companies: [], countries: [], cities: [] }
	}
}
