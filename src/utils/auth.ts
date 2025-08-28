import { API_ENDPOINTS } from '@/config/api';

let authCache: { isAuth: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export async function checkAuth(): Promise<boolean> {
    // Проверяем кэш
    if (authCache && Date.now() - authCache.timestamp < CACHE_DURATION) {
        return authCache.isAuth;
    }

    try {
        const res = await fetch(API_ENDPOINTS.me, {
            method: "GET",
            credentials: "include",
        });
        const isAuth = res.ok;
        
        // Кэшируем результат
        authCache = { isAuth, timestamp: Date.now() };
        return isAuth;
    } catch {
        authCache = { isAuth: false, timestamp: Date.now() };
        return false;
    }
}

export function clearAuthCache(): void {
    authCache = null;
}

export function setAuthCache(isAuth: boolean): void {
    authCache = {
        isAuth,
        timestamp: Date.now()
    };
}

// Функция для получения токена из куки
export function getAuthToken(): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'jwt_token') {
            return value;
        }
    }
    return null;
}

// Функция для проверки авторизации с токеном
export async function checkAuthWithToken(): Promise<boolean> {
    const token = getAuthToken();
    if (!token) {
        setAuthCache(false);
        return false;
    }

    try {
        const res = await fetch(API_ENDPOINTS.meApi, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
        });

        const isAuth = res.ok;
        setAuthCache(isAuth);
        return isAuth;
    } catch {
        setAuthCache(false);
        return false;
    }
}
