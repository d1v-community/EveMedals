'use client'

import * as Toggle from '@radix-ui/react-toggle'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Toggle.Root
      aria-label="Toggle theme"
      onPressedChange={toggleTheme}
      className="inline-flex h-11 items-center gap-2 border border-white/10 bg-white/[0.04] px-3 text-[#f4efe2]/72 transition-colors hover:bg-white/[0.08] hover:text-white"
    >
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em]">
        {theme === 'dark' ? 'Light Grid' : 'Dark Grid'}
      </span>
      <span className="flex h-7 w-7 items-center justify-center border border-current/20">
        {theme === 'dark' ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </span>
    </Toggle.Root>
  )
}

export default ThemeSwitcher
