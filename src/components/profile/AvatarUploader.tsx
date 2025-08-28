'use client'

import { API_ENDPOINTS } from '@/config/api'
import Image from 'next/image'
import { useState } from 'react'

interface AvatarUploaderProps {
	currentAvatar: string | null
	onAvatarUpdate: () => void
}

export default function AvatarUploader({
	currentAvatar,
	onAvatarUpdate,
}: AvatarUploaderProps) {
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const updateAvatar = async () => {
		if (!avatarFile) return

		setIsUploading(true)
		try {
			const formData = new FormData()
			formData.append('avatar', avatarFile)

			const response = await fetch(API_ENDPOINTS.profileAvatar, {
				method: 'PUT',
				body: formData,
				credentials: 'include',
			})

			if (response.ok) {
				setAvatarFile(null)
				onAvatarUpdate()
			}
		} catch (error) {
			console.error('Error updating avatar:', error)
		} finally {
			setIsUploading(false)
		}
	}

	const deleteAvatar = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.profileAvatar, {
				method: 'DELETE',
				credentials: 'include',
			})
			if (response.ok) {
				onAvatarUpdate()
			}
		} catch (error) {
			console.error('Error deleting avatar:', error)
		}
	}

	return (
		<div className='flex flex-col items-center space-y-6'>
			<div className='relative'>
				{currentAvatar ? (
					<Image
						src={`${API_ENDPOINTS.static}/${currentAvatar}`}
						alt='Avatar'
						width={128}
						height={128}
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
						<span>Змінити</span>
					</label>

					{currentAvatar && (
						<button
							onClick={deleteAvatar}
							className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md'
						>
							Видалити
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
						</div>
						<div className='flex space-x-2'>
							<button
								onClick={updateAvatar}
								disabled={isUploading}
								className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50'
							>
								{isUploading ? 'Завантаження...' : 'Завантажити'}
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
	)
}
