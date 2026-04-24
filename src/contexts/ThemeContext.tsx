import { DarkColors, LightColors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';
const THEME_STORAGE_KEY = 'theme_mode';

interface ThemeContextType {
    mode: ThemeMode;
    colors: typeof LightColors;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    colors: LightColors,
    toggleTheme: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Stores current theme mode and exposes toggle helper.
    const [mode, setMode] = useState<ThemeMode>('light');

    useEffect(() => {
        // Restores saved theme preference on app start.
        const loadTheme = async () => {
            const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedMode === 'light' || savedMode === 'dark') {
                setMode(savedMode);
            }
        };

        loadTheme();
    }, []);

    const toggleTheme = () => {
        // Toggles mode and persists selection.
        setMode((prev) => {
            const nextMode: ThemeMode = prev === 'light' ? 'dark' : 'light';
            AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
            return nextMode;
        });
    };

    const colors = mode === 'light' ? LightColors : DarkColors;

    return (
        <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
