import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/client';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'patient' | 'doctor' | 'pharmacy' | 'caregiver';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('medvault_user');
        const token = localStorage.getItem('medvault_token');
        if (stored && token) {
            setUser(JSON.parse(stored));
            // Verify token is still valid
            authAPI.getMe()
                .then(({ data }) => {
                    setUser(data.user);
                    localStorage.setItem('medvault_user', JSON.stringify(data.user));
                })
                .catch(() => {
                    localStorage.removeItem('medvault_token');
                    localStorage.removeItem('medvault_refresh_token');
                    localStorage.removeItem('medvault_user');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem('medvault_token', data.token);
        localStorage.setItem('medvault_refresh_token', data.refreshToken);
        localStorage.setItem('medvault_user', JSON.stringify(data.user));
        setUser(data.user);
    };

    const register = async (regData: any) => {
        const { data } = await authAPI.register(regData);
        localStorage.setItem('medvault_token', data.token);
        localStorage.setItem('medvault_refresh_token', data.refreshToken);
        localStorage.setItem('medvault_user', JSON.stringify(data.user));
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('medvault_token');
        localStorage.removeItem('medvault_refresh_token');
        localStorage.removeItem('medvault_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
