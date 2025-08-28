'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation, type Lang } from '@/translations';
import { Header } from '@/components/Header/Header';
import { API_ENDPOINTS } from '@/config/api';

interface AdminStats {
    users: {
        total: number;
        new_this_week: number;
    };
    bids: {
        total: number;
        new_this_week: number;
    };
    chats: {
        total: number;
        messages: number;
    };
    security: {
        banned_ips: number;
    };
}

interface AdminDashboardProps {
    lang: Lang;
}

export default function AdminDashboard({ lang }: AdminDashboardProps) {
    const t = useTranslation(lang);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.adminDashboard, {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                setError('Failed to load admin dashboard');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header lang={lang} />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-xl">{t('loading')}</div>
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
                <h1 className="text-3xl font-bold mb-8">{t('dashboard')}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Users Stats */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">{t('users')}</h3>
                        <div className="text-3xl font-bold text-blue-600">
                            {stats?.users.total || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                            {t('newUsers')}: {stats?.users.new_this_week || 0}
                        </div>
                    </div>

                    {/* Bids Stats */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">{t('bids')}</h3>
                        <div className="text-3xl font-bold text-green-600">
                            {stats?.bids.total || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                            {t('newUsers')}: {stats?.bids.new_this_week || 0}
                        </div>
                    </div>

                    {/* Chats Stats */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">{t('chats')}</h3>
                        <div className="text-3xl font-bold text-purple-600">
                            {stats?.chats.total || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                            {t('messages')}: {stats?.chats.messages || 0}
                        </div>
                    </div>

                    {/* Security Stats */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Security</h3>
                        <div className="text-3xl font-bold text-red-600">
                            {stats?.security.banned_ips || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                            Banned IPs
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            {t('users')}
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            {t('bids')}
                        </button>
                        <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                            {t('chats')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
