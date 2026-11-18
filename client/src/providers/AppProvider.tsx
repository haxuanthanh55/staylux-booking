'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  birthDate?: string; // Thêm dòng này vào
  role: 'CUSTOMER' | 'PARTNER' | 'ADMIN';
}

interface AppContextType {
  isDark: boolean;
  toggleTheme: () => void;
  user: UserInfo | null;
  setAuth: (user: UserInfo, token: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType>({
  isDark: false,
  toggleTheme: () => {},
  user: null,
  setAuth: () => {},
  logout: () => {},
});

export const useApp = () => useContext(AppContext);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('staylux_theme');
    if (savedTheme === 'dark') setIsDark(true);

    const savedUser = localStorage.getItem('staylux_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('staylux_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const setAuth = (userData: UserInfo, token: string) => {
    localStorage.setItem('staylux_token', token);
    localStorage.setItem('staylux_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('staylux_token');
    localStorage.removeItem('staylux_user');
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ isDark, toggleTheme, user, setAuth, logout }}>
        <ConfigProvider
          locale={viVN}
          theme={{
            algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
            token: {
              colorPrimary: '#FF7A00',
              borderRadius: 12,
              fontFamily: 'inherit',
              colorBgLayout: isDark ? '#121212' : '#FAF7F2',
              colorBgContainer: isDark ? '#1E1E1E' : '#FFFFFF',
            },
          }}
        >
          <AntdApp>
            <div
              style={{
                minHeight: '100vh',
                backgroundColor: isDark ? '#121212' : '#FAF7F2',
                color: isDark ? '#F5F5F5' : '#1F1F1F',
                transition: 'all 0.25s ease',
              }}
            >
              {children}
            </div>
          </AntdApp>
        </ConfigProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
}