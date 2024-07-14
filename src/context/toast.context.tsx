'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import Toast from '@/types/toats.type';

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Toast) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
    toasts: [],
    addToast: () => {},
    removeToast: () => {},
});

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

type ToastProviderProps = {
    children: React.ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Toast) => {
        setToasts([...toasts, toast]);
    };

    const removeToast = (id: string) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (toasts.length > 0) {
                setToasts(toasts.slice(1));
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [toasts]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};