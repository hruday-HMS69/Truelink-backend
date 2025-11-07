import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
    const userData = {
        id: '1',
        email: 'user@example.com',
       full_name: 'Test User',
        email_verified: false,
        created_at: new Date().toISOString()
      };
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, logout };
};
