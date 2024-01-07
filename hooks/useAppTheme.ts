import { useTheme } from 'next-themes';

export const useAppTheme = () => {
    const { theme, systemTheme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    function setCurrentTheme() {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    return [theme, setCurrentTheme] as const;
};
