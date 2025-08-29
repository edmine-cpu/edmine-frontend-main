'use client'

import { Header } from '@/components/Header/Header'
import { API_ENDPOINTS } from '@/config/api'
import { useAuth } from '@/hooks/useAuth'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Lang = 'uk' | 'en' | 'pl' | 'fr' | 'de'

const texts = {
	uk: {
		chat: 'Чат',
		loginRequired: 'Для доступу до чату потрібно увійти в систему',
		login: 'Увійти',
		loadingChats: 'Завантаження чатів...',
		chats: 'Чати',
		noChats: 'У вас поки немає чатів',
		findPerformers: 'Знайти виконавців',
		noMessages: 'Немає повідомлень',
		file: '📎 Файл',
		openFull: 'Відкрити повністю',
		enterMessage: 'Введіть повідомлення...',
		attachFile: 'Прикріпити файл',
		send: 'Відправити',
		delete: 'Видалити',
		selectChat: 'Оберіть чат для початку спілкування',
		fileTooLarge: 'Файл занадто великий. Максимальний розмір: 30 МБ',
		bytes: 'Bytes',
		kb: 'KB',
		mb: 'MB',
		gb: 'GB',
	},
	en: {
		chat: 'Chat',
		loginRequired: 'You need to log in to access the chat',
		login: 'Login',
		loadingChats: 'Loading chats...',
		chats: 'Chats',
		noChats: "You don't have any chats yet",
		findPerformers: 'Find performers',
		noMessages: 'No messages',
		file: '📎 File',
		openFull: 'Open full',
		enterMessage: 'Enter message...',
		attachFile: 'Attach file',
		send: 'Send',
		delete: 'Delete',
		selectChat: 'Select a chat to start chatting',
		fileTooLarge: 'File is too large. Maximum size: 30 MB',
		bytes: 'Bytes',
		kb: 'KB',
		mb: 'MB',
		gb: 'GB',
	},
	pl: {
		chat: 'Czat',
		loginRequired: 'Aby uzyskać dostęp do czatu, musisz się zalogować',
		login: 'Zaloguj się',
		loadingChats: 'Ładowanie czatów...',
		chats: 'Czaty',
		noChats: 'Nie masz jeszcze żadnych czatów',
		findPerformers: 'Znajdź wykonawców',
		noMessages: 'Brak wiadomości',
		file: '📎 Plik',
		openFull: 'Otwórz pełny',
		enterMessage: 'Wprowadź wiadomość...',
		attachFile: 'Załącz plik',
		send: 'Wyślij',
		delete: 'Usuń',
		selectChat: 'Wybierz czat, aby rozpocząć rozmowę',
		fileTooLarge: 'Plik jest za duży. Maksymalny rozmiar: 30 MB',
		bytes: 'Bytes',
		kb: 'KB',
		mb: 'MB',
		gb: 'GB',
	},
	fr: {
		chat: 'Chat',
		loginRequired: 'Vous devez vous connecter pour accéder au chat',
		login: 'Se connecter',
		loadingChats: 'Chargement des chats...',
		chats: 'Chats',
		noChats: "Vous n'avez pas encore de chats",
		findPerformers: 'Trouver des prestataires',
		noMessages: 'Aucun message',
		file: '📎 Fichier',
		openFull: 'Ouvrir complet',
		enterMessage: 'Entrez un message...',
		attachFile: 'Joindre un fichier',
		send: 'Envoyer',
		delete: 'Supprimer',
		selectChat: 'Sélectionnez un chat pour commencer à discuter',
		fileTooLarge: 'Le fichier est trop volumineux. Taille maximale: 30 MB',
		bytes: 'Bytes',
		kb: 'KB',
		mb: 'MB',
		gb: 'GB',
	},
	de: {
		chat: 'Chat',
		loginRequired: 'Sie müssen sich anmelden, um auf den Chat zuzugreifen',
		login: 'Anmelden',
		loadingChats: 'Chats werden geladen...',
		chats: 'Chats',
		noChats: 'Sie haben noch keine Chats',
		findPerformers: 'Anbieter finden',
		noMessages: 'Keine Nachrichten',
		file: '📎 Datei',
		openFull: 'Vollständig öffnen',
		enterMessage: 'Nachricht eingeben...',
		attachFile: 'Datei anhängen',
		send: 'Senden',
		delete: 'Löschen',
		selectChat: 'Wählen Sie einen Chat aus, um zu chatten',
		fileTooLarge: 'Datei ist zu groß. Maximale Größe: 30 MB',
		bytes: 'Bytes',
		kb: 'KB',
		mb: 'MB',
		gb: 'GB',
	},
} as const

interface Chat {
	id: number
	partner: {
		id: number
		name: string
		avatar?: string
	}
	latest_message?: {
		content: string
		created_at: string
		is_file: boolean
	}
	created_at: string
}

interface Message {
	id: number
	content: string
	file_path?: string
	file_name?: string
	file_size?: number
	sender_id: number
	created_at: string
}

export default function ChatMenuPage() {
	const params = useParams()
	const router = useRouter()
	const { user, isAuthenticated } = useAuth()
	const [chats, setChats] = useState<Chat[]>([])
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [newMessage, setNewMessage] = useState('')
	const [loading, setLoading] = useState(true)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const lang = params.lang as Lang
	const t = texts[lang]

	useEffect(() => {
		if (isAuthenticated) {
			fetchChats()
		}
	}, [isAuthenticated])

	useEffect(() => {
		if (selectedChat) {
			fetchMessages()
			const interval = setInterval(fetchMessages, 3000)
			return () => clearInterval(interval)
		}
	}, [selectedChat])

	const fetchChats = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.chats, {
				credentials: 'include',
			})
			if (response.ok) {
				const data = await response.json()
				setChats(data)
				// Auto-select first chat if available
				if (data.length > 0 && !selectedChat) {
					setSelectedChat(data[0])
				}
			}
		} catch (error) {
			console.error('Error fetching chats:', error)
		} finally {
			setLoading(false)
		}
	}

	const fetchMessages = async () => {
		if (!selectedChat) return

		try {
			const response = await fetch(
				`${API_ENDPOINTS.chats}/${selectedChat}/messages`,
				{
					credentials: 'include',
				}
			)
			if (response.ok) {
				const data = await response.json()
				setMessages(data.reverse())
			}
		} catch (error) {
			console.error('Error fetching messages:', error)
		}
	}

	const sendMessage = async () => {
		if ((!newMessage.trim() && !selectedFile) || !selectedChat) return

		const formData = new FormData()
		if (newMessage.trim()) {
			formData.append('content', newMessage)
		}
		if (selectedFile) {
			formData.append('file', selectedFile)
		}

		try {
			const response = await fetch(
				`${API_ENDPOINTS.chats}/${selectedChat}/messages`,
				{
					method: 'POST',
					body: formData,
					credentials: 'include',
				}
			)

			if (response.ok) {
				setNewMessage('')
				setSelectedFile(null)
				fetchMessages()
			}
		} catch (error) {
			console.error('Error sending message:', error)
		}
	}

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return `0 ${t.bytes}`
		const k = 1024
		const sizes = [t.bytes, t.kb, t.mb, t.gb]
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			sendMessage()
		}
	}

	if (!isAuthenticated) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Header lang={lang as any} />
				<div className='container mx-auto px-4 py-8'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold mb-4'>{t.chat}</h1>
						<p className='text-gray-600 mb-4'>{t.loginRequired}</p>
						<a
							href={`/${lang}/login`}
							className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors'
						>
							{t.login}
						</a>
					</div>
				</div>
			</div>
		)
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<Header lang={lang as any} />
				<div className='container mx-auto px-4 py-8'>
					<div className='text-center'>{t.loadingChats}</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<Header lang={lang as any} />

			<div className='container mx-auto px-4 py-8'>
				<div className='flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden'>
					{/* Chat List Sidebar */}
					<div className='w-1/3 border-r border-gray-200 flex flex-col'>
						<div className='p-4 border-b border-gray-200 bg-gray-50'>
							<h2 className='text-lg font-semibold'>
								{t.chats} ({chats.length})
							</h2>
						</div>

						<div className='flex-1 overflow-y-auto'>
							{chats.length === 0 ? (
								<div className='p-4 text-center text-gray-500'>
									<p>{t.noChats}</p>
									<p className='text-sm mt-2'>
										<a
											href={`/${lang}/catalog`}
											className='text-blue-500 hover:underline'
										>
											{t.findPerformers}
										</a>
									</p>
								</div>
							) : (
								chats.map(chat => (
									<div
										key={chat.id}
										onClick={() => setSelectedChat(chat)}
										className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
											selectedChat?.id === chat.id
												? 'bg-blue-50 border-l-4 border-l-blue-500'
												: ''
										}`}
									>
										<div className='flex items-center space-x-3'>
											<div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0'>
												{chat.partner.avatar ? (
													<img
														src={`${API_ENDPOINTS.static}/${chat.partner.avatar}`}
														alt={chat.partner.name}
														className='w-10 h-10 rounded-full object-cover'
													/>
												) : (
													<span className='text-gray-600 font-medium'>
														{chat.partner.name.charAt(0).toUpperCase()}
													</span>
												)}
											</div>

											<div className='flex-1 min-w-0'>
												<h3 className='font-medium text-sm truncate'>
													{chat.partner.name}
												</h3>
												{chat.latest_message ? (
													<p className='text-xs text-gray-600 truncate'>
														{chat.latest_message.is_file
															? t.file
															: chat.latest_message.content}
													</p>
												) : (
													<p className='text-xs text-gray-400'>
														{t.noMessages}
													</p>
												)}
											</div>

											<div className='text-xs text-gray-500'>
												{chat.latest_message
													? new Date(
															chat.latest_message.created_at
													  ).toLocaleTimeString('uk-UA', {
															hour: '2-digit',
															minute: '2-digit',
													  })
													: new Date(chat.created_at).toLocaleDateString(
															'uk-UA'
													  )}
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>

					{/* Chat Area */}
					<div className='flex-1 flex flex-col'>
						{selectedChat ? (
							<>
								{/* Chat Header */}
								<div className='p-4 border-b border-gray-200 bg-gray-50'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-3'>
											<div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
												{selectedChat.partner.avatar ? (
													<img
														src={`${API_ENDPOINTS.static}/${selectedChat.partner.avatar}`}
														alt={selectedChat.partner.name}
														className='w-8 h-8 rounded-full object-cover'
													/>
												) : (
													<span className='text-gray-600 font-medium text-sm'>
														{selectedChat.partner.name.charAt(0).toUpperCase()}
													</span>
												)}
											</div>
											<h3 className='font-semibold'>
												{selectedChat.partner.name}
											</h3>
										</div>

										<button
											onClick={() =>
												router.push(`/${lang}/chat/${selectedChat.id}`)
											}
											className='text-sm text-blue-500 hover:text-blue-700'
										>
											{t.openFull}
										</button>
									</div>
								</div>

								{/* Messages */}
								<div className='flex-1 p-4 overflow-y-auto space-y-3'>
									{messages.map(message => (
										<div
											key={message.id}
											className={`flex ${
												message.sender_id === user?.id
													? 'justify-end'
													: 'justify-start'
											}`}
										>
											<div
												className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
													message.sender_id === user?.id
														? 'bg-blue-500 text-white'
														: 'bg-gray-200 text-gray-800'
												}`}
											>
												{message.content && (
													<div className='whitespace-pre-wrap'>
														{message.content}
													</div>
												)}

												{message.file_path && (
													<div className='mt-2'>
														<a
															href={`${API_ENDPOINTS.static}/${message.file_path}`}
															target='_blank'
															rel='noopener noreferrer'
															className='text-blue-600 hover:text-blue-800 text-sm'
														>
															📎{' '}
															{message.file_name || t.file.replace('📎 ', '')}
														</a>
													</div>
												)}

												<div className='text-xs opacity-75 mt-1'>
													{new Date(message.created_at).toLocaleTimeString(
														'uk-UA'
													)}
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Message Input */}
								<div className='p-4 border-t border-gray-200 bg-gray-50'>
									{selectedFile && (
										<div className='mb-2 p-2 bg-white rounded flex items-center justify-between'>
											<span className='text-sm'>📎 {selectedFile.name}</span>
											<button
												onClick={() => setSelectedFile(null)}
												className='text-red-500 text-sm hover:text-red-700'
											>
												{t.delete}
											</button>
										</div>
									)}

									<div className='flex space-x-2'>
										<input
											type='file'
											id='file-input'
											onChange={e => {
												if (e.target.files && e.target.files[0]) {
													if (e.target.files[0].size > 30 * 1024 * 1024) {
														alert(t.fileTooLarge)
														return
													}
													setSelectedFile(e.target.files[0])
												}
											}}
											className='hidden'
										/>

										<button
											onClick={() =>
												document.getElementById('file-input')?.click()
											}
											className='px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors'
											title={t.attachFile}
										>
											📎
										</button>

										<input
											type='text'
											value={newMessage}
											onChange={e => setNewMessage(e.target.value)}
											onKeyPress={handleKeyPress}
											placeholder={t.enterMessage}
											className='flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
										/>

										<button
											onClick={sendMessage}
											disabled={!newMessage.trim() && !selectedFile}
											className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
										>
											{t.send}
										</button>
									</div>
								</div>
							</>
						) : (
							<div className='flex-1 flex items-center justify-center text-gray-500'>
								<div className='text-center'>
									<div className='text-4xl mb-4'>💬</div>
									<p>{t.selectChat}</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
