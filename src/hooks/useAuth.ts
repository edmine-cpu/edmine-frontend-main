import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api';

interface User {
  id: number;
  email: string;
  name: string;
  nickname?: string;
  avatar?: string;
  user_role?: string;
  profile_description?: string;
  city?: string;
  country?: {
    id: number;
    name: string;
  };
  categories: Array<{ id: number; name: string }>;
  subcategories: Array<{ id: number; name_en: string }>;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
              const response = await fetch(API_ENDPOINTS.meApi, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
              await fetch(API_ENDPOINTS.logout, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    checkAuth,
    logout
  };
};
