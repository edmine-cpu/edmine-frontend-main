'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from '@/config/api';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        async function logout() {
            try {
                const res = await fetch(API_ENDPOINTS.logout, {
                    method: 'POST',
                    credentials: 'include',
                });
                if (res.ok) {
                    router.push('/');
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        logout();
    }, [router]);

    return <p>Logging out...</p>;
}
