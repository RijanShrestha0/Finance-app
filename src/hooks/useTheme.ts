import { useEffect, useState } from "react";

export type useTheme = 'light' | 'dark' | 'system';

export const useTheme = () => {
    const [ theme, settheme ] = useState<useTheme>('light');
    
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as useTheme | null;
        if (savedTheme) {
            settheme(savedTheme);
        }
        else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            settheme('dark');
        }
    }, []);
    
    useEffect(() => {
        if ( theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        settheme(prev => prev === 'light' ? 'dark' : 'light');
    };
    
    return { theme, toggleTheme };
}