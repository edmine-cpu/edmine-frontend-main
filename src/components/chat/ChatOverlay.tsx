'use client'

import { API_ENDPOINTS } from '@/config/api'
import { useEffect, useState } from 'react'

interface Message {
	id: number
	sender_id: number
	content?: string
	file_path?: string
	created_at: string
	isTranslated?: boolean
	translatedContent?: string
}

export default function ChatOverlay({
	chatId,
	onClose,
}: {
	chatId: number
	onClose: () => void
}) {
	const [messages, setMessages] = useState<Message[]>([])
	const [text, setText] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [currentUserId, setCurrentUserId] = useState<number | null>(null)

	useEffect(() => {
		// Получаем информацию о текущем пользователе
		const fetchCurrentUser = async () => {
			try {
				const response = await fetch(API_ENDPOINTS.meApi, {
					credentials: 'include',
				})
				if (response.ok) {
					const userData = await response.json()
					setCurrentUserId(userData.id)
				}
			} catch (error) {
				console.error('Error fetching user data:', error)
			}
		}

		let timer: any
		async function load() {
			const res = await fetch(`${API_ENDPOINTS.chats}/${chatId}/messages`, {
				credentials: 'include',
			})
			if (res.ok) {
				const data = await res.json()
				const messages = data.messages || data
				if (Array.isArray(messages)) {
					setMessages(messages.reverse())
				} else {
					console.error('Messages data is not an array:', data)
					setMessages([])
				}
			}
			timer = setTimeout(load, 2500)
		}

		fetchCurrentUser()
		load()
		return () => clearTimeout(timer)
	}, [chatId])

	async function send() {
		const form = new FormData()
		if (text.trim()) form.append('content', text.trim())
		if (file) form.append('file', file)
		const res = await fetch(`${API_ENDPOINTS.chats}/${chatId}/messages`, {
			method: 'POST',
			body: form,
			credentials: 'include',
		})
		if (res.ok) {
			const m = await res.json()
			setMessages(prev => [m, ...prev])
			setText('')
			setFile(null)
		}
	}

	return (
		<div
			className='fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-md shadow-lg max-w-2xl w-full flex flex-col'
				onClick={e => e.stopPropagation()}
			>
				<div className='px-4 py-2 bg-red-600 text-white flex justify-between items-center'>
					<h3 className='font-semibold'>Чат</h3>
					<button onClick={onClose} className='text-white text-xl'>
						×
					</button>
				</div>
				<div className='p-4 h-96 overflow-y-auto flex flex-col gap-3'>
					{messages.map(m => (
						<div
							key={m.id}
							className={`flex ${
								m.sender_id === currentUserId ? 'justify-end' : 'justify-start'
							}`}
						>
							<div
								className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
									m.sender_id === currentUserId
										? 'bg-red-500 text-white'
										: 'bg-gray-200 text-gray-800'
								}`}
							>
								{m.content && <div className='mb-1'>{m.content}</div>}
								{m.file_path && (
									<a
										href={`${API_ENDPOINTS.static}/${m.file_path}`}
										target='_blank'
										rel='noopener noreferrer'
										className={`underline ${
											m.sender_id === currentUserId
												? 'text-red-100'
												: 'text-blue-600'
										}`}
									>
										📎 Файл
									</a>
								)}
								<div
									className={`text-xs mt-1 ${
										m.sender_id === currentUserId
											? 'text-red-100'
											: 'text-gray-500'
									}`}
								>
									{new Date(m.created_at).toLocaleString()}
								</div>
							</div>
						</div>
					))}
				</div>
				<div className='p-4 border-t flex gap-2'>
					<input
						type='text'
						value={text}
						onChange={e => setText(e.target.value)}
						className='flex-1 rounded border px-3 py-2'
						placeholder='Повідомлення...'
					/>
					<input
						type='file'
						onChange={e => setFile(e.target.files?.[0] || null)}
					/>
					<button
						onClick={send}
						className='bg-red-600 text-white px-4 py-2 rounded'
					>
						Надіслати
					</button>
				</div>
			</div>
		</div>
	)
}
