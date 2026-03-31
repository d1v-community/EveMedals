'use client'

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type ThemeMode = 'dark' | 'light'

type ThemeModeContextValue = {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

const DEFAULT_THEME: ThemeMode = 'dark'
const STORAGE_KEY = 'theme'

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

const isThemeMode = (value: string | null): value is ThemeMode => {
  return value === 'dark' || value === 'light'
}

const resolveStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)

  return isThemeMode(storedTheme) ? storedTheme : DEFAULT_THEME
}

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<ThemeMode>(resolveStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
    }),
    [theme]
  )

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeModeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeModeProvider')
  }

  return context
}
