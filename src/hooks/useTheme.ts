import { useEffect, useState } from "react";

export type useTheme = 'light' | 'dark' | 'system';

export const useTheme = () => {
    const [ theme, settheme ] = useState<useTheme>(() => {
        const savedTheme = localStorage.getItem('theme') as useTheme | null;

        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
            return savedTheme;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    });
    
    useEffect(() => {
        const resolvedTheme = theme === 'system'
            ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;

        if (resolvedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        document.documentElement.setAttribute('data-theme', resolvedTheme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        settheme(prev => prev === 'light' ? 'dark' : 'light');
    };
    
    return { theme, toggleTheme };
}