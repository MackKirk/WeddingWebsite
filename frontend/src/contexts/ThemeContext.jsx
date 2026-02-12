import { createContext, useContext, useState, useEffect } from 'react'
import { getHomeContent } from '../services/content'

const DEFAULTS = {
  textColor: '#8B6F6D',
  navbarColor: '#F8F4EC',
  navbarTextColor: '#8B6F6D',
  accentColor: '#D4B483',
  bodyBgColor: '#F8F4EC',
  bodyHeadingColor: '#8B6F6D',
  bodyTextColor: '#333333',
  footerBgColor: '#CFA7A4',
  footerTextColor: '#8B6F6D',
}

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

const setCssVariables = (theme) => {
  const root = document.documentElement
  root.style.setProperty('--theme-hero-text', theme.textColor || DEFAULTS.textColor)
  root.style.setProperty('--theme-navbar-bg', theme.navbarColor || DEFAULTS.navbarColor)
  root.style.setProperty('--theme-navbar-text', theme.navbarTextColor || DEFAULTS.navbarTextColor)
  root.style.setProperty('--theme-accent', theme.accentColor || DEFAULTS.accentColor)
  root.style.setProperty('--theme-body-bg', theme.bodyBgColor || DEFAULTS.bodyBgColor)
  root.style.setProperty('--theme-body-heading', theme.bodyHeadingColor || DEFAULTS.bodyHeadingColor)
  root.style.setProperty('--theme-body-text', theme.bodyTextColor || DEFAULTS.bodyTextColor)
  root.style.setProperty('--theme-footer-bg', theme.footerBgColor || DEFAULTS.footerBgColor)
  root.style.setProperty('--theme-footer-text', theme.footerTextColor || DEFAULTS.footerTextColor)
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await getHomeContent()
        const data = response.data
        const next = {
          textColor: data.text_color ?? DEFAULTS.textColor,
          navbarColor: data.navbar_color ?? DEFAULTS.navbarColor,
          navbarTextColor: data.navbar_text_color ?? DEFAULTS.navbarTextColor,
          accentColor: data.accent_color ?? DEFAULTS.accentColor,
          bodyBgColor: data.body_bg_color ?? DEFAULTS.bodyBgColor,
          bodyHeadingColor: data.body_heading_color ?? DEFAULTS.bodyHeadingColor,
          bodyTextColor: data.body_text_color ?? DEFAULTS.bodyTextColor,
          footerBgColor: data.footer_bg_color ?? DEFAULTS.footerBgColor,
          footerTextColor: data.footer_text_color ?? DEFAULTS.footerTextColor,
        }
        setTheme(next)
        setCssVariables(next)
      } catch (error) {
        console.error('Error fetching theme:', error)
        setCssVariables(DEFAULTS)
      } finally {
        setLoading(false)
      }
    }
    fetchTheme()
  }, [])

  // Keep CSS variables in sync when theme updates (e.g. after admin save from another tab)
  useEffect(() => {
    setCssVariables(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ ...theme, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}
