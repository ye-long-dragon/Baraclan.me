import { useState, useEffect } from 'react';
import { api, ApiClientError } from '../api/client';

interface AuthMeResponse {
  authenticated: boolean;
  email: string;
  role: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<AuthMeResponse>('/auth/me');
      if (data && data.authenticated) {
        setIsAuthenticated(true);
        setAdminEmail(data.email);
      } else {
        setIsAuthenticated(false);
        setAdminEmail(null);
      }
    } catch {
      setIsAuthenticated(false);
      setAdminEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    api
      .get<AuthMeResponse>('/auth/me')
      .then((data) => {
        if (!isMounted) return;
        if (data && data.authenticated) {
          setIsAuthenticated(true);
          setAdminEmail(data.email);
        } else {
          setIsAuthenticated(false);
          setAdminEmail(null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsAuthenticated(false);
        setAdminEmail(null);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post<{ success: boolean; email: string }>('/auth/login', { email, password });
      await checkAuth();
      return { success: true };
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Invalid credentials';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue even if network error on logout
    } finally {
      setIsAuthenticated(false);
      setAdminEmail(null);
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    adminEmail,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
  };
}
