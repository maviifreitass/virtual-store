import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const THEME_STORAGE_KEY = 'online-shop.theme';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

const getStoredTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return localStorage.getItem(THEME_STORAGE_KEY) ?? 'light';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>(getStoredTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
