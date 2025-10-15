'use client'

import LanguageSwitcher, {
	LANG_LABELS,
	Lang as LangType,
} from '@/components/createRequest/LanguageSwitcher'
import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import { useTranslation, type Lang } from '@/translations'
import { checkAuth } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Profile {
	id: number
	name: string
	email: string
	avatar: string | null
	user_role: string
	profile_description: string | null
	city: string
	country: {
		id: number
		name_uk?: string
		name_en?: string
		name?: string
	} | null
	language: string
}

interface Company {
	id: number
	name: string // основное название для обратной совместимости
	name_uk?: string
	name_en?: string
	name_pl?: string
	name_fr?: string
	name_de?: string
	description_uk: string
	description_en: string
	description_pl: string
	description_fr: string
	description_de: string
	slug_name: string
	country: {
		id: number
		name_uk?: string
		name_en?: string
		name?: string
	} | null
	city: {
		id: number
		name_uk?: string
		name_en?: string
		name?: string
	} | null
	categories?: any[]
	subcategories?: any[]
}

interface Country {
	id: number
	name_uk?: string
	name_en?: string
	name?: string
}

interface City {
	id: number
	name_uk?: string
	name_en?: string
	name?: string
	country_id: number
}

interface ProfilePageProps {
	params: Promise<{ lang: Lang }>
}

interface EditStates {
	name: boolean
	description: boolean
	location: boolean
	role: boolean
}

interface FormData {
	name: string
	description: string
	country: string
	city: string
	role: string
}

interface CompanyFormData {
	name: string // основное название для обратной совместимости
	name_uk: string
	name_en: string
	name_pl: string
	name_fr: string
	name_de: string
	description_uk: string
	description_en: string
	description_pl: string
	description_fr: string
	description_de: string
	country: string
	city: string
	categories: number[]
	subcategories: number[]
}

// Custom hook for profile state management
const useProfileState = () => {
	const [profile, setProfile] = useState<Profile | null>(null)
	const [companies, setCompanies] = useState<Company[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [allCountries, setAllCountries] = useState<Country[]>([])
	const [allCities, setAllCities] = useState<City[]>([])
	const [allCategories, setAllCategories] = useState<any[]>([])
	const [allSubcategories, setAllSubcategories] = useState<any[]>([])

	// Clear messages after 5 seconds
	useEffect(() => {
		if (error || success) {
			const timer = setTimeout(() => {
				setError('')
				setSuccess('')
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [error, success])

	return {
		profile,
		setProfile,
		companies,
		setCompanies,
		loading,
		setLoading,
		error,
		setError,
		success,
		setSuccess,
		allCountries,
		setAllCountries,
		allCities,
		setAllCities,
		allCategories,
		setAllCategories,
		allSubcategories,
		setAllSubcategories,
	}
}

// Edit field component
interface EditableFieldProps {
	label: string
	value: string
	isEditing: boolean
	onEdit: () => void
	onSave: () => void
	onCancel: () => void
	children: React.ReactNode
	placeholder?: string
}

const EditableField: React.FC<EditableFieldProps> = ({
	label,
	value,
	isEditing,
	onEdit,
	onSave,
	onCancel,
	children,
	placeholder = '',
}) => (
	<div className='mb-6'>
		<div className='flex justify-between items-center mb-3'>
			<label className='text-sm font-medium text-gray-700'>{label}</label>
			{!isEditing && (
				<button
					onClick={onEdit}
					className='text-red-600 hover:text-red-800 text-sm'
				>
					Редагувати
				</button>
			)}
		</div>
		{isEditing ? (
			<div className='space-y-3'>
				{children}
				<div className='flex space-x-2'>
					<button
						onClick={onSave}
						className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm'
					>
						Зберегти
					</button>
					<button
						onClick={onCancel}
						className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm'
					>
						Скасувати
					</button>
				</div>
			</div>
		) : (
			<p className='text-gray-900 bg-gray-50 p-3 rounded-lg'>
				{value || placeholder}
			</p>
		)}
	</div>
)

export default function ProfilePage({ params }: ProfilePageProps) {
	
	
	const t = useTranslation("en")
	const router = useRouter()

	const {
		profile,
		setProfile,
		companies,
		setCompanies,
		loading,
		setLoading,
		error,
		setError,
		success,
		setSuccess,
		allCountries,
		setAllCountries,
		allCities,
		setAllCities,
		allCategories,
		setAllCategories,
		allSubcategories,
		setAllSubcategories,
	} = useProfileState()

	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

	// Edit states
	const [editStates, setEditStates] = useState<EditStates>({
		name: false,
		description: false,
		location: false,
		role: false,
	})

	// Form states
	const [formData, setFormData] = useState<FormData>({
		name: '',
		description: '',
		country: '',
		city: '',
		role: '',
	})

	const [avatarFile, setAvatarFile] = useState<File | null>(null)

	// Company states
	const [showCompanyForm, setShowCompanyForm] = useState(false)
	const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null)
	const [selectedLang, setSelectedLang] = useState<LangType>('uk')
	const [companyForm, setCompanyForm] = useState<CompanyFormData>({
		name: '',
		name_uk: '',
		name_en: '',
		name_pl: '',
		name_fr: '',
		name_de: '',
		description_uk: '',
		description_en: '',
		description_pl: '',
		description_fr: '',
		description_de: '',
		country: '',
		city: '',
		categories: [],
		subcategories: [],
	})

	const [categoryBlocks, setCategoryBlocks] = useState<
		{ category: number | ''; subcategory: number | '' }[]
	>([{ category: '', subcategory: '' }])

	// Authentication check
	useEffect(() => {
		const checkAuthentication = async () => {
			const isAuth = await checkAuth()
			setIsAuthenticated(isAuth)
			if (!isAuth) {
				router.push(`/login`)
			}
		}
		checkAuthentication()
	}, ["en", router])

	// API calls
	const fetchProfile = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.profile, {
				credentials: 'include',
			})
			if (response.ok) {
				const data: Profile = await response.json()
				setProfile(data)
				setFormData({
					name: data.name || '',
					description: data.profile_description || '',
					country: data.country?.id?.toString() || '',
					city: data.city || '',
					role: data.user_role || '',
				})
			}
		} catch (err) {
			setError('Failed to load profile')
		}
	}

	const fetchCompanies = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.companies_profile, {
				credentials: 'include',
			})
			if (response.ok) {
				const data: Company[] = await response.json()
				setCompanies(data || [])
			}
		} catch (err) {
			console.error('Error loading companies:', err)
		} finally {
			setLoading(false)
		}
	}

	const fetchCountries = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.countries)
			if (response.ok) {
				const data: Country[] = await response.json()
				setAllCountries(data)
			}
		} catch (error) {
			console.error('Error fetching countries:', error)
		}
	}

	const fetchCities = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.cities)
			if (response.ok) {
				const data: City[] = await response.json()
				setAllCities(data)
			}
		} catch (error) {
			console.error('Error fetching cities:', error)
		}
	}

	const fetchCategories = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.categories)
			if (response.ok) {
				const data = await response.json()
				setAllCategories(data)
			}
		} catch (error) {
			console.error('Error fetching categories:', error)
		}
	}

	const fetchSubcategories = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.subcategories)
			if (response.ok) {
				const data = await response.json()
				setAllSubcategories(data)
			}
		} catch (error) {
			console.error('Error fetching subcategories:', error)
		}
	}

	useEffect(() => {
		if (isAuthenticated) {
			fetchProfile()
			fetchCompanies()
			fetchCountries()
			fetchCities()
			fetchCategories()
			fetchSubcategories()
		}
	}, [isAuthenticated])

	// Generic update function
	const updateField = async (
		endpoint: string,
		fieldValue: string,
		successMessage: string,
		editField: keyof EditStates
	) => {
		try {
			const formDataObj = new FormData()
			formDataObj.append('value', fieldValue)

			const response = await fetch(endpoint, {
				method: 'PUT',
				body: formDataObj,
				credentials: 'include',
			})

			if (response.ok) {
				setSuccess(successMessage)
				setEditStates(prev => ({ ...prev, [editField]: false }))
				await fetchProfile()
			} else {
				const errorData = await response.json()
				setError(errorData.detail || `Failed to update ${editField}`)
			}
		} catch (err) {
			setError(`Error updating ${editField}`)
		}
	}

	const updateLocation = async () => {
		try {
			const formDataObj = new FormData()
			formDataObj.append('country_id', formData.country)
			formDataObj.append('city', formData.city)

			const response = await fetch(API_ENDPOINTS.profileLocation, {
				method: 'PUT',
				body: formDataObj,
				credentials: 'include',
			})

			if (response.ok) {
				setSuccess('Локацію оновлено успішно')
				setEditStates(prev => ({ ...prev, location: false }))
				await fetchProfile()
			} else {
				const errorData = await response.json()
				setError(errorData.detail || 'Failed to update location')
			}
		} catch (err) {
			setError('Error updating location')
		}
	}

	const updateAvatar = async () => {
		if (!avatarFile) return

		try {
			const formDataObj = new FormData()
			formDataObj.append('avatar', avatarFile)

			const response = await fetch(API_ENDPOINTS.profileAvatar, {
				method: 'PUT',
				body: formDataObj,
				credentials: 'include',
			})

			if (response.ok) {
				setSuccess('Аватар оновлено успішно')
				setAvatarFile(null)
				await fetchProfile()
			} else {
				setError('Failed to update avatar')
			}
		} catch (err) {
			setError('Error updating avatar')
		}
	}

	// Company management
	const resetCompanyForm = () => {
		setCompanyForm({
			name: '',
			name_uk: '',
			name_en: '',
			name_pl: '',
			name_fr: '',
			name_de: '',
			description_uk: '',
			description_en: '',
			description_pl: '',
			description_fr: '',
			description_de: '',
			country: '',
			city: '',
			categories: [],
			subcategories: [],
		})
		setCategoryBlocks([{ category: '', subcategory: '' }])
		setSelectedLang('uk')
		setEditingCompanyId(null)
		setShowCompanyForm(false)
	}

	const startEditCompany = (company: Company) => {
		const categories = (company as any).categories || []
		const subcategories = (company as any).subcategories || []

		setCompanyForm({
			name: company.name,
			name_uk: company.name_uk || company.name || '',
			name_en: company.name_en || company.name || '',
			name_pl: company.name_pl || company.name || '',
			name_fr: company.name_fr || company.name || '',
			name_de: company.name_de || company.name || '',
			description_uk: company.description_uk || '',
			description_en: company.description_en || '',
			description_pl: company.description_pl || '',
			description_fr: company.description_fr || '',
			description_de: company.description_de || '',
			country: company.country?.id?.toString() || '',
			city: company.city?.id?.toString() || '',
			categories: categories.map((c: any) => c.id),
			subcategories: subcategories.map((s: any) => s.id),
		})

		// Создаем categoryBlocks на основе существующих категорий
		const blocks = []
		const maxLength = Math.max(categories.length, subcategories.length, 1)
		for (let i = 0; i < maxLength; i++) {
			blocks.push({
				category: categories[i]?.id || '',
				subcategory: subcategories[i]?.id || '',
			})
		}
		setCategoryBlocks(blocks)

		setEditingCompanyId(company.id)
		setShowCompanyForm(true)
	}

	const saveCompany = async () => {
		try {
			const endpoint = editingCompanyId
				? `${API_ENDPOINTS.companies}/${editingCompanyId}`
				: API_ENDPOINTS.companies

			const method = editingCompanyId ? 'PUT' : 'POST'

			const requestData = {
				...companyForm,
				country: companyForm.country ? parseInt(companyForm.country) : null,
				city: companyForm.city ? parseInt(companyForm.city) : null,
				category: companyForm.categories,
				under_category: companyForm.subcategories,
			}

			const response = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData),
				credentials: 'include',
			})

			if (response.ok) {
				setSuccess(
					editingCompanyId
						? 'Компанію оновлено успішно'
						: 'Компанію створено успішно'
				)
				resetCompanyForm()
				await fetchCompanies()
			} else {
				const errorData = await response.json()
				setError(errorData.detail || 'Failed to save company')
			}
		} catch (err) {
			setError('Error saving company')
		}
	}

	const deleteCompany = async (companyId: number) => {
		if (!confirm('Ви впевнені, що хочете видалити цю компанію?')) return

		try {
			const response = await fetch(`${API_ENDPOINTS.companies}/${companyId}`, {
				method: 'DELETE',
				credentials: 'include',
			})

			if (response.ok) {
				setSuccess('Компанію видалено успішно')
				await fetchCompanies()
			} else {
				setError('Failed to delete company')
			}
		} catch (err) {
			setError('Error deleting company')
		}
	}

	const deleteAvatar = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.profileAvatar, {
				method: 'DELETE',
				credentials: 'include',
			})
			if (response.ok) {
				setSuccess('Аватар видалено')
				await fetchProfile()
			} else {
				setError('Failed to delete avatar')
			}
		} catch (err) {
			setError('Error deleting avatar')
		}
	}

	const updateFormData = (field: keyof FormData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const updateEditState = (field: keyof EditStates, value: boolean) => {
		setEditStates(prev => ({ ...prev, [field]: value }))
	}

	const updateCompanyDescription = (value: string) => {
		setCompanyForm(prev => ({
			...prev,
			[`description_${selectedLang}`]: value,
		}))
	}

	const handleCategoryChange = (index: number, value: number | '') => {
		setCategoryBlocks(prev =>
			prev.map((block, i) =>
				i === index ? { ...block, category: value, subcategory: '' } : block
			)
		)
		setCompanyForm(prev => {
			const newCategories = [...prev.categories]
			newCategories[index] = (value as number) || undefined
			return { ...prev, categories: newCategories.filter(Boolean) as number[] }
		})
	}

	const handleSubcategoryChange = (index: number, value: number | '') => {
		setCategoryBlocks(prev =>
			prev.map((block, i) =>
				i === index ? { ...block, subcategory: value } : block
			)
		)
		setCompanyForm(prev => {
			const newSubcats = [...prev.subcategories]
			newSubcats[index] = (value as number) || undefined
			return { ...prev, subcategories: newSubcats.filter(Boolean) as number[] }
		})
	}

	const addCategoryBlock = () => {
		setCategoryBlocks(prev => [...prev, { category: '', subcategory: '' }])
	}

	const getCurrentDescription = (): string => {
		return (
			companyForm[`description_${selectedLang}` as keyof CompanyFormData] || ''
		)
	}

	const getRoleDisplayName = (role: string): string => {
		switch (role) {
			case 'customer':
				return 'Замовник'
			case 'executor':
				return 'Виконавець'
			case 'both':
				return 'Замовник + Виконавець'
			default:
				return role
		}
	}

	const getCountryDisplayName = (
		country: Profile['country'] | Company['country']
	): string => {
		if (!country) return 'Країна не вказана'
		if (typeof country === 'string') return country // просто возвращаем строку
		return (
			country.name_uk || country.name_en || country.name || 'Невідома країна'
		)
	}

	const getCityDisplayName = (city: any): string => {
		if (!city) return 'Місто не вказане'
		if (typeof city === 'string') return city
		return city.name_uk || city.name_en || city.name || 'Невідоме місто'
	}

	const getFilteredCities = (countryId: string) => {
		if (!countryId) return []
		return allCities.filter(city => city.country_id === parseInt(countryId))
	}

	// Loading and auth states
	if (loading || isAuthenticated === null) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Header lang="en" />
				<div className='container mx-auto px-4 py-8'>
					<div className='flex items-center justify-center'>
						<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-red-500'></div>
					</div>
				</div>
			</div>
		)
	}

	if (isAuthenticated === false || !profile) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Header lang="en" />
				<div className='container mx-auto px-4 py-8'>
					<div className='text-center'>
						{isAuthenticated === false
							? 'Redirecting to login...'
							: 'Помилка завантаження профілю'}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen'>
			<Header lang="en" />
			<div className='container mx-auto px-4 py-8 max-w-6xl'>
				{/* Profile Header */}
				<div className='bg-white rounded-xl shadow-sm p-8 mb-8'>
					<div className='flex flex-col lg:flex-row items-center lg:items-start gap-8'>
						{/* Avatar Section */}
						<div className='flex flex-col items-center space-y-6'>
							<div className='relative'>
								{profile.avatar ? (
									<img
										src={`${API_ENDPOINTS.static}/${profile.avatar}`}
										alt='Avatar'
										className='w-32 h-32 rounded-full object-cover border-4 border-red-100 shadow-lg'
									/>
								) : (
									<div className='w-32 h-32 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-lg'>
										<svg
											className='w-16 h-16 text-red-400'
											fill='currentColor'
											viewBox='0 0 20 20'
										>
											<path
												fillRule='evenodd'
												d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
								)}
							</div>

							<div className='flex flex-col items-center space-y-3 w-full max-w-xs'>
								<div className='flex space-x-3 w-full'>
									<label
										htmlFor='avatar-upload'
										className='flex-1 cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-md flex items-center justify-center space-x-2 text-sm font-medium'
									>
										<svg
											className='w-4 h-4'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
											/>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
											/>
										</svg>
										<span>Змінити</span>
									</label>

									{profile.avatar && (
										<button
											onClick={deleteAvatar}
											className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md flex items-center justify-center text-sm font-medium'
										>
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
												/>
											</svg>
										</button>
									)}
								</div>

								<input
									id='avatar-upload'
									type='file'
									accept='image/*'
									onChange={e => setAvatarFile(e.target.files?.[0] || null)}
									className='hidden'
								/>

								{avatarFile && (
									<div className='w-full p-4 bg-blue-50 rounded-lg border border-blue-200'>
										<div className='flex items-center justify-between mb-3'>
											<span className='text-sm text-blue-800 font-medium truncate'>
												{avatarFile.name}
											</span>
											<button
												onClick={() => setAvatarFile(null)}
												className='text-blue-600 hover:text-blue-800'
											>
												<svg
													className='w-4 h-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M6 18L18 6M6 6l12 12'
													/>
												</svg>
											</button>
										</div>
										<div className='flex space-x-2'>
											<button
												onClick={updateAvatar}
												className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium'
											>
												Завантажити
											</button>
											<button
												onClick={() => setAvatarFile(null)}
												className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm'
											>
												Скасувати
											</button>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Profile Info */}
						<div className='flex-1 text-center lg:text-left'>
							<h1 className='text-4xl font-bold text-gray-900 mb-2'>
								{profile.name}
							</h1>
							<p className='text-lg text-gray-600 mb-2'>{profile.email}</p>
							<div className='flex flex-wrap justify-center lg:justify-start gap-2 mb-4'>
								<span className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium'>
									{getRoleDisplayName(profile.user_role)}
								</span>
								<span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm'>
									{getCityDisplayName(profile.city)}
								</span>
								<span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'>
									{profile.language?.toUpperCase()}
								</span>
							</div>
							{profile.profile_description && (
								<p className='text-gray-700 max-w-2xl leading-relaxed'>
									{profile.profile_description}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Alerts */}
				{(error || success) && (
					<div
						className={`border px-6 py-4 rounded-xl mb-6 ${
							error
								? 'bg-red-50 border-red-200 text-red-700'
								: 'bg-green-50 border-green-200 text-green-700'
						}`}
					>
						<div className='flex items-center'>
							<svg
								className='w-5 h-5 mr-3'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								{error ? (
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
										clipRule='evenodd'
									/>
								) : (
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
										clipRule='evenodd'
									/>
								)}
							</svg>
							{error || success}
						</div>
					</div>
				)}

				{/* Main Content Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Personal Information */}
					<div className='bg-white rounded-xl shadow-sm p-6'>
						<h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
							<svg
								className='w-6 h-6 mr-3 text-red-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
								/>
							</svg>
							Особиста інформація
						</h2>

						<EditableField
							label="Повне ім'я"
							value={profile.name}
							isEditing={editStates.name}
							onEdit={() => updateEditState('name', true)}
							onSave={() =>
								updateField(
									API_ENDPOINTS.profileName,
									formData.name,
									"Ім'я оновлено успішно",
									'name'
								)
							}
							onCancel={() => updateEditState('name', false)}
							placeholder="Ім'я не вказане"
						>
							<input
								type='text'
								value={formData.name}
								onChange={e => updateFormData('name', e.target.value)}
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
								placeholder="Введіть повне ім'я"
							/>
						</EditableField>

						<EditableField
							label='Опис'
							value={profile.profile_description || ''}
							isEditing={editStates.description}
							onEdit={() => updateEditState('description', true)}
							onSave={() =>
								updateField(
									API_ENDPOINTS.profileDescription,
									formData.description,
									'Опис оновлено успішно',
									'description'
								)
							}
							onCancel={() => updateEditState('description', false)}
							placeholder='Опис не вказаний'
						>
							<textarea
								rows={4}
								value={formData.description}
								onChange={e => updateFormData('description', e.target.value)}
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none'
								placeholder='Розкажіть про себе'
							/>
						</EditableField>

						{/* Role */}
						<EditableField
							label='Роль'
							value={getRoleDisplayName(profile.user_role)}
							isEditing={editStates.role}
							onEdit={() => updateEditState('role', true)}
							onSave={() =>
								updateField(
									API_ENDPOINTS.profileRole,
									formData.role,
									'Роль оновлено успішно',
									'role'
								)
							}
							onCancel={() => updateEditState('role', false)}
							placeholder='Роль не встановлена'
						>
							<select
								value={formData.role}
								onChange={e => updateFormData('role', e.target.value)}
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
							>
								<option value='customer'>Замовник</option>
								<option value='executor'>Виконавець</option>
								<option value='both'>Замовник + Виконавець</option>
							</select>
						</EditableField>

						{/* Location */}
						<div className='mb-6'>
							<div className='flex justify-between items-center mb-3'>
								<label className='text-sm font-medium text-gray-700'>
									Локація
								</label>
								{!editStates.location && (
									<button
										onClick={() => updateEditState('location', true)}
										className='text-red-600 hover:text-red-800 text-sm'
									>
										Редагувати
									</button>
								)}
							</div>
							{editStates.location ? (
								<div className='space-y-3'>
									<select
										value={formData.country}
										onChange={e => {
											updateFormData('country', e.target.value)
											updateFormData('city', '') // Reset city when country changes
										}}
										className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
									>
										<option value=''>Виберіть країну</option>
										{allCountries.map(country => (
											<option key={country.id} value={country.id}>
												{country.name_uk || country.name_en || country.name}
											</option>
										))}
									</select>
									<select
										value={formData.city}
										onChange={e => updateFormData('city', e.target.value)}
										disabled={!formData.country}
										className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
									>
										<option value=''>Виберіть місто</option>
										{getFilteredCities(formData.country).map(city => (
											<option key={city.id} value={city.id}>
												{city.name_uk || city.name_en || city.name}
											</option>
										))}
									</select>
									<div className='flex space-x-2'>
										<button
											onClick={updateLocation}
											className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm'
										>
											Зберегти
										</button>
										<button
											onClick={() => updateEditState('location', false)}
											className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm'
										>
											Скасувати
										</button>
									</div>
								</div>
							) : (
								<div className='bg-gray-50 p-3 rounded-lg'>
									<div className='flex items-center'>
										<svg
											className='w-4 h-4 mr-2 text-gray-500'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
											/>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
											/>
										</svg>
										<span className='text-gray-900'>
											{getCountryDisplayName(profile.country)},{' '}
											{getCityDisplayName(profile.city)}
										</span>
									</div>
								</div>
							)}
						</div>

						{/* Language - Read only */}
						<div>
							<label className='text-sm font-medium text-gray-700 mb-3 block'>
								Мова
							</label>
							<div className='bg-gray-50 p-3 rounded-lg'>
								<div className='flex items-center'>
									<svg
										className='w-4 h-4 mr-2 text-gray-500'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
										/>
									</svg>
									<span className='text-gray-900 uppercase'>
										{profile.language || 'Не встановлено'}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Companies Management */}
					<div className='bg-white rounded-xl shadow-sm p-6'>
						<div className='flex justify-between items-center mb-6'>
							<h2 className='text-xl font-semibold text-gray-900 flex items-center'>
								<svg
									className='w-6 h-6 mr-3 text-red-500'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
									/>
								</svg>
								Мої компанії
							</h2>
							{!showCompanyForm && (
								<button
									onClick={() => setShowCompanyForm(true)}
									className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2'
								>
									<svg
										className='w-5 h-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M12 4v16m8-8H4'
										/>
									</svg>
									<span>Додати</span>
								</button>
							)}
						</div>

						{/* Companies List */}
						{companies.length > 0 && !showCompanyForm && (
							<div className='space-y-4'>
								{companies.map(company => (
									<div
										key={company.id}
										className='border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors'
									>
										<div className='flex justify-between items-start'>
											<div className='flex-1'>
												<h3 className='font-semibold text-gray-900 mb-2'>
													{company.name}
												</h3>
												{company.description_uk && (
													<p className='text-gray-700 text-sm mb-2'>
														{company.description_uk}
													</p>
												)}
												<div className='flex items-center text-xs text-gray-500 mb-1'>
													<svg
														className='w-3 h-3 mr-1'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
														/>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
														/>
													</svg>
													{getCountryDisplayName(company.country)},{' '}
													{getCityDisplayName(company.city)}
												</div>
												<p className='text-xs text-gray-500'>
													Slug: {company.slug_name}
												</p>
												{/* Categories */}
												{company.categories &&
													company.categories.length > 0 && (
														<div className='mt-2'>
															<div className='flex flex-wrap gap-1'>
																{company.categories.map((category: any) => (
																	<span
																		key={category.id}
																		className='bg-red-100 text-red-800 px-2 py-1 rounded text-xs'
																	>
																		{category.name}
																	</span>
																))}
															</div>
														</div>
													)}
												{/* Subcategories */}
												{company.subcategories &&
													company.subcategories.length > 0 && (
														<div className='mt-1'>
															<div className='flex flex-wrap gap-1'>
																{company.subcategories.map(
																	(subcategory: any) => (
																		<span
																			key={subcategory.id}
																			className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'
																		>
																			{subcategory.name_uk || subcategory.name}
																		</span>
																	)
																)}
															</div>
														</div>
													)}
											</div>
											<div className='flex space-x-2 ml-4'>
												<button
													onClick={() => startEditCompany(company)}
													className='text-blue-600 hover:text-blue-800 p-2'
													title='Редагувати'
												>
													<svg
														className='w-4 h-4'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
														/>
													</svg>
												</button>
												<button
													onClick={() => deleteCompany(company.id)}
													className='text-red-600 hover:text-red-800 p-2'
													title='Видалити'
												>
													<svg
														className='w-4 h-4'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
														/>
													</svg>
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{/* No Companies Message */}
						{companies.length === 0 && !showCompanyForm && (
							<div className='text-center py-12 text-gray-500'>
								<svg
									className='w-16 h-16 mx-auto mb-4 text-gray-300'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
									/>
								</svg>
								<p className='text-lg font-medium mb-2'>
									У вас ще немає компаній
								</p>
								<p className='text-sm'>Додайте свою першу компанію</p>
							</div>
						)}

						{/* Create/Edit Company Form */}
						{showCompanyForm && (
							<div className='border-2 border-dashed border-red-300 rounded-lg p-6 bg-red-50'>
								<div className='flex justify-between items-center mb-4'>
									<h3 className='text-lg font-semibold text-gray-900'>
										{editingCompanyId
											? 'Редагувати компанію'
											: 'Створити компанію'}
									</h3>
									<button
										onClick={resetCompanyForm}
										className='text-gray-400 hover:text-gray-600'
									>
										<svg
											className='w-6 h-6'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M6 18L18 6M6 6l12 12'
											/>
										</svg>
									</button>
								</div>

								{/* Company Name - Multilingual */}
								<div className='mb-6'>
									<label className='text-sm font-medium text-gray-700 mb-3 block'>
										Назва компанії
									</label>

									{/* Language Switcher for Company Name */}
									<div className='mb-3'>
										<LanguageSwitcher
											current={selectedLang}
											onChange={setSelectedLang}
										/>
									</div>

									{/* Company Name Input for selected language */}
									<input
										type='text'
										value={
											companyForm[
												`name_${selectedLang}` as keyof CompanyFormData
											] as string
										}
										onChange={e => {
											const fieldName =
												`name_${selectedLang}` as keyof CompanyFormData
											setCompanyForm(prev => ({
												...prev,
												[fieldName]: e.target.value,
												// Обновляем основное поле для обратной совместимости
												name:
													selectedLang === 'uk'
														? e.target.value
														: prev.name || e.target.value,
											}))
										}}
										className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
										placeholder={`Назва компанії (${LANG_LABELS[selectedLang]})`}
									/>

									{/* Preview of filled languages */}
									<div className='mt-2 flex flex-wrap gap-2'>
										{(['uk', 'en', 'pl', 'fr', 'de'] as LangType[]).map(
											langCode => {
												const fieldName =
													`name_${langCode}` as keyof CompanyFormData
												const value = companyForm[fieldName] as string
												return value ? (
													<span
														key={langCode}
														className='inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full'
													>
														{LANG_LABELS[langCode]}: {value.substring(0, 20)}
														{value.length > 20 ? '...' : ''}
													</span>
												) : null
											}
										)}
									</div>
								</div>

								{/* Company Location */}
								<div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label className='text-sm font-medium text-gray-700 mb-2 block'>
											Країна
										</label>
										<select
											value={companyForm.country}
											onChange={e => {
												setCompanyForm(prev => ({
													...prev,
													country: e.target.value,
													city: '', // Reset city when country changes
												}))
											}}
											className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
										>
											<option value=''>Виберіть країну</option>
											{allCountries.map(country => (
												<option key={country.id} value={country.id}>
													{country.name_uk || country.name_en || country.name}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className='text-sm font-medium text-gray-700 mb-2 block'>
											Місто
										</label>
										<select
											value={companyForm.city}
											onChange={e =>
												setCompanyForm(prev => ({
													...prev,
													city: e.target.value,
												}))
											}
											disabled={!companyForm.country}
											className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
										>
											<option value=''>Виберіть місто</option>
											{getFilteredCities(companyForm.country).map(city => (
												<option key={city.id} value={city.id}>
													{city.name_uk || city.name_en || city.name}
												</option>
											))}
										</select>
									</div>
								</div>

								{/* Categories Selection */}
								<div className='mb-4'>
									<label className='text-sm font-medium text-gray-700 mb-2 block'>
										Категорії компанії
									</label>
									{categoryBlocks.map((block, index) => (
										<div key={index} className='mb-4 space-y-2'>
											<select
												value={block.category}
												onChange={e =>
													handleCategoryChange(
														index,
														Number(e.target.value) || ''
													)
												}
												className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
											>
												<option value=''>Виберіть категорію</option>
												{allCategories.map(cat => (
													<option key={cat.id} value={cat.id}>
														{(cat as any)[`name_${"en"}`] ||
															cat.name_en ||
															cat.name}
													</option>
												))}
											</select>

											{block.category && (
												<select
													value={block.subcategory}
													onChange={e =>
														handleSubcategoryChange(
															index,
															Number(e.target.value) || ''
														)
													}
													className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
												>
													<option value=''>Виберіть підкатегорію</option>
													{allSubcategories
														.filter(
															sc =>
																(sc as any).category_id === block.category ||
																(sc as any).full_category_id === block.category
														)
														.map(sc => (
															<option key={sc.id} value={sc.id}>
																{(sc as any)[`name_${"en"}`] ||
																	sc.name_en ||
																	sc.name}
															</option>
														))}
												</select>
											)}
										</div>
									))}
									<button
										type='button'
										onClick={addCategoryBlock}
										className='mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
									>
										➕ Додати ще одну категорію
									</button>
								</div>

								{/* Language Switcher for Description */}
								<div className='mb-4'>
									<label className='text-sm font-medium text-gray-700 mb-2 block'>
										Мова опису:
									</label>
									<LanguageSwitcher
										current={selectedLang}
										onChange={setSelectedLang}
									/>
								</div>

								{/* Company Description for Selected Language */}
								<div className='mb-6'>
									<label className='text-sm font-medium text-gray-700 mb-2 block'>
										Опис компанії ({LANG_LABELS[selectedLang]})
									</label>
									<textarea
										rows={4}
										value={getCurrentDescription()}
										onChange={e => updateCompanyDescription(e.target.value)}
										className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none'
										placeholder={`Опис компанії (${LANG_LABELS[selectedLang]})`}
									/>
								</div>

								{/* Action Buttons */}
								<div className='flex space-x-3'>
									<button
										onClick={saveCompany}
										disabled={
											!companyForm.name_uk.trim() &&
											!companyForm.name_en.trim() &&
											!companyForm.name_pl.trim() &&
											!companyForm.name_fr.trim() &&
											!companyForm.name_de.trim()
										}
										className='flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium'
									>
										{editingCompanyId
											? 'Оновити компанію'
											: 'Створити компанію'}
									</button>
									<button
										onClick={resetCompanyForm}
										className='px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium'
									>
										Скасувати
									</button>
								</div>

								{/* Language Preview */}
								{(companyForm.description_uk ||
									companyForm.description_en ||
									companyForm.description_pl ||
									companyForm.description_fr ||
									companyForm.description_de) && (
									<div className='mt-6 p-4 bg-white rounded-lg border'>
										<h4 className='text-sm font-medium text-gray-700 mb-3'>
											Попередній перегляд описів:
										</h4>
										<div className='space-y-2 text-sm'>
											{companyForm.description_uk && (
												<div>
													<span className='font-medium text-blue-600'>
														🇺🇦 UK:
													</span>{' '}
													{companyForm.description_uk}
												</div>
											)}
											{companyForm.description_en && (
												<div>
													<span className='font-medium text-green-600'>
														🇬🇧 EN:
													</span>{' '}
													{companyForm.description_en}
												</div>
											)}
											{companyForm.description_pl && (
												<div>
													<span className='font-medium text-red-600'>
														🇵🇱 PL:
													</span>{' '}
													{companyForm.description_pl}
												</div>
											)}
											{companyForm.description_fr && (
												<div>
													<span className='font-medium text-purple-600'>
														🇫🇷 FR:
													</span>{' '}
													{companyForm.description_fr}
												</div>
											)}
											{companyForm.description_de && (
												<div>
													<span className='font-medium text-orange-600'>
														🇩🇪 DE:
													</span>{' '}
													{companyForm.description_de}
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
