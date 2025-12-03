import { useEffect } from 'react'
import { useAppSelector } from '../store/hooks'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useAppSelector(state => state.theme.mode)

  useEffect(() => {
    const el = document.documentElement
    if (mode === 'dark') {
      el.classList.add('dark')
      el.setAttribute('data-theme', 'dark')
    } else {
      el.classList.remove('dark')
      el.setAttribute('data-theme', 'light')
    }
  }, [mode])

  return <>{children}</>
}
