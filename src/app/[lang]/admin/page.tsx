'use client'

import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface AdminStats {
	users_count: number
	bids_count: number
	chats_count: number
	categories_count: number
}

interface User {
	id: number
	name: string
	email: string
	user_role: string
	created_at: string
	avatar?: string
	city?: string
	country?: any
}

interface Category {
	id: number
	name_uk: string
	name_en: string
	name_pl: string
	name_fr: string
	name_de: string
}

interface Bid {
	id: number
	title: string
	description: string
	budget: number
	status: string
	user: User
	created_at: string
}

interface Blog {
	id: number
	title_uk: string
	title_en: string
	content_uk: string
	content_en: string
	is_published: boolean
	author: string
	created_at: string
}

export default function AdminPanel({
	params,
}: {
	params: Promise<{ lang: string }>
}) {
	const { lang } = React.use(params)
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [stats, setStats] = useState<AdminStats | null>(null)
	const [users, setUsers] = useState<User[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [bids, setBids] = useState<Bid[]>([])
	const [blogs, setBlogs] = useState<Blog[]>([])
	const [activeTab, setActiveTab] = useState<
		'dashboard' | 'users' | 'categories' | 'bids' | 'blogs'
	>('dashboard')
	const [editingUser, setEditingUser] = useState<User | null>(null)
	const [editForm, setEditForm] = useState({
		id: 0,
		name: '',
		email: '',
		user_role: '',
		nickname: '',
		city: '',
		profile_description: '',
	})

	useEffect(() => {
		const checkAccess = async () => {
			// Простая проверка админ токена
			const adminToken = localStorage.getItem('admin_token')
			if (adminToken !== 'admin_logged_in') {
				router.push(`/admin/login`)
				return
			}
			setLoading(false)
			await loadData()
		}

		checkAccess()
	}, [lang, router])

	const loadData = async () => {
		try {
			// Load stats
			const statsRes = await fetch(API_ENDPOINTS.adminStats, {
				credentials: 'include',
			})
			if (statsRes.ok) {
				const statsData = await statsRes.json()
				setStats(statsData)
			}

			// Load users
			const usersRes = await fetch(API_ENDPOINTS.adminUsers, {
				credentials: 'include',
			})
			if (usersRes.ok) {
				const usersData = await usersRes.json()
				setUsers(usersData)
			}

			// Load categories
			const categoriesRes = await fetch(API_ENDPOINTS.categories)
			if (categoriesRes.ok) {
				const categoriesData = await categoriesRes.json()
				setCategories(categoriesData)
			}

			// Load bids
			const bidsRes = await fetch(API_ENDPOINTS.bids)
			if (bidsRes.ok) {
				const bidsData = await bidsRes.json()
				setBids(bidsData.slice(0, 20)) // Limit to 20 items
			}

			// Load blogs
			const blogsRes = await fetch(API_ENDPOINTS.adminBlogs)
			if (blogsRes.ok) {
				const blogsData = await blogsRes.json()
				setBlogs(blogsData)
			}
		} catch (err) {
			console.error('Error loading data:', err)
		}
	}

	const handleEditUser = (user: User) => {
		setEditingUser(user)
		setEditForm({
			id: user.id,
			name: user.name || '',
			email: user.email || '',
			user_role: user.user_role || 'user',
			nickname: (user as any).nickname || '',
			city: (user as any).city || '',
			profile_description: (user as any).profile_description || '',
		})
	}

	const handleSaveUser = async () => {
		if (!editingUser) return

		try {
			const formData = new FormData()
			formData.append('name', editForm.name)
			formData.append('email', editForm.email)
			formData.append('user_role', editForm.user_role)
			formData.append('nickname', editForm.nickname)
			formData.append('city', editForm.city)
			formData.append('profile_description', editForm.profile_description)

			const response = await fetch(
				`${API_ENDPOINTS.adminUpdateUser(editForm.id)}`,
				{
					method: 'PUT',
					body: formData,
					credentials: 'include',
				}
			)

			if (response.ok) {
				setEditingUser(null)
				setEditForm({
					id: 0,
					name: '',
					email: '',
					user_role: '',
					nickname: '',
					city: '',
					profile_description: '',
				})
				await loadData() // Reload data
				alert('Пользователь обновлен')
			} else {
				alert('Ошибка при обновлении пользователя')
			}
		} catch (err) {
			console.error('Error updating user:', err)
			alert('Ошибка при обновлении пользователя')
		}
	}

	const handleDeleteUser = async (userId: number) => {
		if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
			return
		}

		try {
			const response = await fetch(`${API_ENDPOINTS.adminDeleteUser(userId)}`, {
				method: 'DELETE',
				credentials: 'include',
			})

			if (response.ok) {
				await loadData() // Reload data
				alert('Пользователь удален')
			} else {
				const errorData = await response.text()
				alert(`Ошибка при удалении: ${errorData}`)
			}
		} catch (err) {
			console.error('Error deleting user:', err)
			alert('Ошибка при удалении пользователя')
		}
	}

	const handleCreateTestBlog = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.adminCreateTestBlog, {
				method: 'POST',
				credentials: 'include',
			})

			if (response.ok) {
				await loadData() // Reload data
				alert('Тестовый блог создан')
			} else {
				alert('Ошибка при создании блога')
			}
		} catch (err) {
			console.error('Error creating blog:', err)
			alert('Ошибка при создании блога')
		}
	}

	const handleDeleteBlog = async (blogId: number) => {
		if (!confirm('Вы уверены, что хотите удалить этот блог?')) {
			return
		}

		try {
			const response = await fetch(`${API_ENDPOINTS.adminDeleteBlog(blogId)}`, {
				method: 'DELETE',
				credentials: 'include',
			})

			if (response.ok) {
				await loadData() // Reload data
				alert('Блог удален')
			} else {
				const errorData = await response.text()
				alert(`Ошибка при удалении: ${errorData}`)
			}
		} catch (err) {
			console.error('Error deleting blog:', err)
			alert('Ошибка при удалении блога')
		}
	}

	if (loading) {
		return (
			<div className='min-h-screen'>
				<Header lang={lang as any} />
				<div className='flex items-center justify-center py-12'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600'></div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<Header lang={lang as any} />

			<div className='max-w-7xl mx-auto py-6 px-4'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='text-3xl font-bold text-gray-900'>
						Панель адміністратора
					</h1>
					<button
						onClick={() => {
							localStorage.removeItem('admin_token')
							router.push(`/admin/login`)
						}}
						className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm'
					>
						🚪 Выйти
					</button>
				</div>

				{/* Tabs */}
				<div className='border-b border-gray-200 mb-6'>
					<nav className='-mb-px flex space-x-8'>
						<button
							onClick={() => setActiveTab('dashboard')}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === 'dashboard'
									? 'border-red-500 text-red-600'
									: 'border-transparent text-gray-500 hover:text-gray-700'
							}`}
						>
							📊 Дашборд
						</button>
						<button
							onClick={() => setActiveTab('users')}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === 'users'
									? 'border-red-500 text-red-600'
									: 'border-transparent text-gray-500 hover:text-gray-700'
							}`}
						>
							👥 Користувачі
						</button>
						<button
							onClick={() => setActiveTab('categories')}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === 'categories'
									? 'border-red-500 text-red-600'
									: 'border-transparent text-gray-500 hover:text-gray-700'
							}`}
						>
							🏷️ Категорії
						</button>
						<button
							onClick={() => setActiveTab('bids')}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === 'bids'
									? 'border-red-500 text-red-600'
									: 'border-transparent text-gray-500 hover:text-gray-700'
							}`}
						>
							📋 Заявки
						</button>
						<button
							onClick={() => setActiveTab('blogs')}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === 'blogs'
									? 'border-red-500 text-red-600'
									: 'border-transparent text-gray-500 hover:text-gray-700'
							}`}
						>
							📝 Блоги
						</button>
					</nav>
				</div>

				{/* Dashboard */}
				{activeTab === 'dashboard' && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						<div className='bg-white p-6 rounded-lg shadow'>
							<div className='flex items-center'>
								<span className='text-3xl mr-4'>👥</span>
								<div>
									<p className='text-gray-500'>Користувачі</p>
									<p className='text-2xl font-bold'>
										{stats?.users_count || 0}
									</p>
								</div>
							</div>
						</div>

						<div className='bg-white p-6 rounded-lg shadow'>
							<div className='flex items-center'>
								<span className='text-3xl mr-4'>📋</span>
								<div>
									<p className='text-gray-500'>Заявки</p>
									<p className='text-2xl font-bold'>{stats?.bids_count || 0}</p>
								</div>
							</div>
						</div>

						<div className='bg-white p-6 rounded-lg shadow'>
							<div className='flex items-center'>
								<span className='text-3xl mr-4'>💬</span>
								<div>
									<p className='text-gray-500'>Чати</p>
									<p className='text-2xl font-bold'>
										{stats?.chats_count || 0}
									</p>
								</div>
							</div>
						</div>

						<div className='bg-white p-6 rounded-lg shadow'>
							<div className='flex items-center'>
								<span className='text-3xl mr-4'>🏷️</span>
								<div>
									<p className='text-gray-500'>Категорії</p>
									<p className='text-2xl font-bold'>
										{stats?.categories_count || 0}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Users */}
				{activeTab === 'users' && (
					<div className='bg-white shadow rounded-lg overflow-hidden'>
						<div className='px-6 py-4 border-b'>
							<h3 className='text-lg font-medium'>
								Користувачі ({users.length})
							</h3>
						</div>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Користувач
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Email
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Роль
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Дата
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Действия
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									{users.map(user => (
										<tr key={user.id}>
											<td className='px-6 py-4'>
												<div className='flex items-center'>
													<div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-4'>
														<span className='text-sm font-medium'>
															{user.name?.charAt(0) || user.email.charAt(0)}
														</span>
													</div>
													<div>
														<div className='text-sm font-medium text-gray-900'>
															{user.name || 'Без імені'}
														</div>
														<div className='text-sm text-gray-500'>
															ID: {user.id}
														</div>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 text-sm text-gray-900'>
												{user.email}
											</td>
											<td className='px-6 py-4'>
												<span className='px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
													{user.user_role || 'Не встановлено'}
												</span>
											</td>
											<td className='px-6 py-4 text-sm text-gray-500'>
												{new Date(user.created_at).toLocaleDateString('uk-UA')}
											</td>
											<td className='px-6 py-4 text-sm font-medium space-x-2'>
												<button
													onClick={() => handleEditUser(user)}
													className='text-blue-600 hover:text-blue-900 transition-colors'
												>
													✏️ Редактировать
												</button>
												<button
													onClick={() => handleDeleteUser(user.id)}
													className='text-red-600 hover:text-red-900 transition-colors'
												>
													🗑️ Удалить
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Categories */}
				{activeTab === 'categories' && (
					<div className='bg-white shadow rounded-lg overflow-hidden'>
						<div className='px-6 py-4 border-b'>
							<h3 className='text-lg font-medium'>
								Категорії ({categories.length})
							</h3>
						</div>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											ID
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Українська
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											English
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Polski
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Deutsch
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Français
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									{categories.map(category => (
										<tr key={category.id}>
											<td className='px-6 py-4 text-sm text-gray-900'>
												{category.id}
											</td>
											<td className='px-6 py-4 text-sm text-gray-900'>
												{category.name_uk}
											</td>
											<td className='px-6 py-4 text-sm text-gray-900'>
												{category.name_en}
											</td>
											<td className='px-6 py-4 text-sm text-gray-900'>
												{category.name_pl}
											</td>
											<td className='px-6 py-4 text-sm text-gray-900'>
												{category.name_de}
											</td>
											<td className='px-6 py-4 text-sm text-gray-900'>
												{category.name_fr}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Bids */}
				{activeTab === 'bids' && (
					<div className='bg-white shadow rounded-lg overflow-hidden'>
						<div className='px-6 py-4 border-b'>
							<h3 className='text-lg font-medium'>Заявки ({bids.length})</h3>
						</div>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											ID
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Заголовок
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Бюджет
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Статус
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
											Дата
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200'>
									{bids.map(bid => (
										<tr key={bid.id}>
											<td className='px-6 py-4 text-sm text-gray-900'>
												{bid.id}
											</td>
											<td className='px-6 py-4 text-sm text-gray-900'>
												<div className='max-w-xs truncate'>{bid.title}</div>
											</td>
											<td className='px-6 py-4 text-sm text-gray-900'>
												{bid.budget || 'Не указан'}
											</td>
											<td className='px-6 py-4'>
												<span className='px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
													{bid.status || 'Активна'}
												</span>
											</td>
											<td className='px-6 py-4 text-sm text-gray-500'>
												{new Date(bid.created_at).toLocaleDateString('uk-UA')}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Blogs */}
				{activeTab === 'blogs' && (
					<div className='bg-white shadow rounded-lg overflow-hidden'>
						<div className='px-6 py-4 border-b flex justify-between items-center'>
							<div>
								<h3 className='text-lg font-medium'>Блоги ({blogs.length})</h3>
								<p className='text-sm text-gray-500 mt-1'>
									Управление блогами системы
								</p>
							</div>
							<button
								onClick={handleCreateTestBlog}
								className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
							>
								+ Создать тестовый блог
							</button>
						</div>

						{blogs.length === 0 ? (
							<div className='p-6 text-center text-gray-500'>
								<p>Блогов пока нет. Создайте тестовый блог для демонстрации.</p>
							</div>
						) : (
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-gray-50'>
										<tr>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
												ID
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
												Заголовок (UK)
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
												Заголовок (EN)
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
												Автор
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
												Статус
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
												Дата
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
												Действия
											</th>
										</tr>
									</thead>
									<tbody className='divide-y divide-gray-200'>
										{blogs.map(blog => (
											<tr key={blog.id}>
												<td className='px-6 py-4 text-sm text-gray-900'>
													{blog.id}
												</td>
												<td className='px-6 py-4 text-sm text-gray-900'>
													<div className='max-w-xs truncate'>
														{blog.title_uk}
													</div>
												</td>
												<td className='px-6 py-4 text-sm text-gray-900'>
													<div className='max-w-xs truncate'>
														{blog.title_en || 'Не переведено'}
													</div>
												</td>
												<td className='px-6 py-4 text-sm text-gray-900'>
													{blog.author}
												</td>
												<td className='px-6 py-4'>
													<span
														className={`px-2 py-1 text-xs font-semibold rounded-full ${
															blog.is_published
																? 'bg-green-100 text-green-800'
																: 'bg-yellow-100 text-yellow-800'
														}`}
													>
														{blog.is_published ? 'Опубликован' : 'Черновик'}
													</span>
												</td>
												<td className='px-6 py-4 text-sm text-gray-500'>
													{new Date(blog.created_at).toLocaleDateString(
														'uk-UA'
													)}
												</td>
												<td className='px-6 py-4 text-sm font-medium space-x-2'>
													<button
														onClick={() => handleDeleteBlog(blog.id)}
														className='text-red-600 hover:text-red-900 transition-colors'
													>
														🗑️ Удалить
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}

				{/* Edit User Modal */}
				{editingUser && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
						<div className='bg-white rounded-lg p-6 w-full max-w-md'>
							<h3 className='text-lg font-medium mb-4'>
								Редактировать пользователя
							</h3>

							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Имя
									</label>
									<input
										type='text'
										value={editForm.name}
										onChange={e =>
											setEditForm({ ...editForm, name: e.target.value })
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Email
									</label>
									<input
										type='email'
										value={editForm.email}
										onChange={e =>
											setEditForm({ ...editForm, email: e.target.value })
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Роль
									</label>
									<select
										value={editForm.user_role}
										onChange={e =>
											setEditForm({ ...editForm, user_role: e.target.value })
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
									>
										<option value='user'>Пользователь</option>
										<option value='executor'>Исполнитель</option>
										<option value='admin'>Администратор</option>
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Никнейм
									</label>
									<input
										type='text'
										value={editForm.nickname}
										onChange={e =>
											setEditForm({ ...editForm, nickname: e.target.value })
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Город
									</label>
									<input
										type='text'
										value={editForm.city}
										onChange={e =>
											setEditForm({ ...editForm, city: e.target.value })
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Описание профиля
									</label>
									<textarea
										value={editForm.profile_description}
										onChange={e =>
											setEditForm({
												...editForm,
												profile_description: e.target.value,
											})
										}
										rows={3}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
									/>
								</div>
							</div>

							<div className='flex justify-end space-x-3 mt-6'>
								<button
									onClick={() => {
										setEditingUser(null)
										setEditForm({
											id: 0,
											name: '',
											email: '',
											user_role: '',
											nickname: '',
											city: '',
											profile_description: '',
										})
									}}
									className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
								>
									Отмена
								</button>
								<button
									onClick={handleSaveUser}
									className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
								>
									Сохранить
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
