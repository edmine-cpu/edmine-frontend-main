'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation, type Lang } from '@/translations';
import { Header } from '@/components/Header/Header';
import Link from 'next/link';
import { checkAuth } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';

interface Chat {
    id: number;
    partner: {
        id: number;
        name: string;
        avatar?: string;
        email: string;
    };
    latest_message?: {
        content: string;
        created_at: string;
        is_file: boolean;
        sender_id: number;
    };
    unread_count: number;
    created_at: string;
}

interface ChatListProps {
    lang: Lang;
}

export default function ChatList({ lang }: ChatListProps) {
    const t = useTranslation(lang);
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        checkAuthAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAuthAndFetch = async () => {
        const auth = await checkAuth();
        setIsAuthenticated(auth);
        
        if (!auth) {
            router.push(`/${lang}/login`);
            return;
        }
        
        fetchChats();
    };

    const fetchChats = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.chats, {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setChats(data);
            } else if (response.status === 401) {
                // Пользователь не авторизован
                setIsAuthenticated(false);
                router.push(`/${lang}/login`);
                return;
            } else {
                setError('Failed to load chats');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    if (loading || isAuthenticated === null) {
        return (
            <>
                <Header lang={lang} />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl">{t('loading')}</div>
                </div>
            </>
        );
    }

    if (isAuthenticated === false) {
        // Перенаправление уже происходит, показываем загрузку
        return (
            <>
                <Header lang={lang} />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl">Redirecting to login...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header lang={lang} />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-red-500 text-xl">{error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header lang={lang} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">{t('chats')}</h1>
                    
                    {chats.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">
                                {t('noMessages')}
                            </div>
                            <p className="text-gray-400">
                                Start a conversation with other users
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {chats.map((chat) => (
                                <Link
                                    key={chat.id}
                                    href={`/${lang}/chat/${chat.id}`}
                                    className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center space-x-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                            {chat.partner.avatar ? (
                                                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                                                <img
                                                    src={`${API_ENDPOINTS.static}/${chat.partner.avatar}`}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-600 font-semibold">
                                                    {chat.partner.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        {/* Chat Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {chat.partner.name}
                                                </h3>
                                                <span className="text-sm text-gray-500">
                                                    {chat.latest_message && formatDate(chat.latest_message.created_at)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-gray-600 truncate">
                                                    {chat.latest_message ? (
                                                        chat.latest_message.is_file ? (
                                                            '📎 File'
                                                        ) : (
                                                            chat.latest_message.content
                                                        )
                                                    ) : (
                                                        'No messages yet'
                                                    )}
                                                </p>
                                                
                                                {chat.unread_count > 0 && (
                                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                        {chat.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
