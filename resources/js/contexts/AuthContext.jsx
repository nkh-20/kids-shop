import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { getUser, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getUser()
                .then((res) => setUser(res.data.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (credentials) => {
        const res = await apiLogin(credentials);
        localStorage.setItem('token', res.data.data.token);
        setUser(res.data.data.user);
        return res.data;
    }, []);

    const register = useCallback(async (data) => {
        const res = await apiRegister(data);
        return res.data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await apiLogout();
        } catch {
            // ignore
        }
        localStorage.removeItem('token');
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user, loading, login, register, logout,
        isAdmin: user?.role === 'admin',
    }), [user, loading, login, register, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
