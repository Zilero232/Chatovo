import { useLocalStorage, usePreferredDark } from '@siberiacancode/reactuse';
import { createContext, type ReactNode, useContext, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'solvex.theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider = ({ children, defaultTheme = 'dark' }: ThemeProviderProps) => {
  const { value: theme = defaultTheme, set: setTheme } = useLocalStorage<Theme>(
    STORAGE_KEY,
    defaultTheme,
  );
  const prefersDark = usePreferredDark();

  useEffect(() => {
    const root = document.documentElement;
    const resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
  }, [theme, prefersDark]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
