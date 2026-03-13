import { createContext, useContext, useState, useEffect } from 'react'
import { getHomeContent } from '../services/content'

const CARD_BG_DEFAULT = '#F5E6D3' // champagne

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
  cardBgTimeline: CARD_BG_DEFAULT,
  cardBgInfo: CARD_BG_DEFAULT,
  cardBgRsvp: CARD_BG_DEFAULT,
}

const HERO_DEFAULTS = {
  heroText: '',
  heroImageUrl: '',
  subtitle: '',
  weddingDate: '',
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
  root.style.setProperty('--theme-card-bg-timeline', theme.cardBgTimeline || CARD_BG_DEFAULT)
  root.style.setProperty('--theme-card-bg-info', theme.cardBgInfo || CARD_BG_DEFAULT)
  root.style.setProperty('--theme-card-bg-rsvp', theme.cardBgRsvp || CARD_BG_DEFAULT)
}

const fetchAndApply = async (setTheme, setHeroContent, setLoading) => {
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
      cardBgTimeline: data.card_bg_timeline ?? CARD_BG_DEFAULT,
      cardBgInfo: data.card_bg_info ?? CARD_BG_DEFAULT,
      cardBgRsvp: data.card_bg_rsvp ?? CARD_BG_DEFAULT,
    }
    setTheme(next)
    setCssVariables(next)
    setHeroContent({
      heroText: data.hero_text ?? HERO_DEFAULTS.heroText,
      heroImageUrl: data.hero_image_url ?? HERO_DEFAULTS.heroImageUrl,
      subtitle: data.subtitle ?? HERO_DEFAULTS.subtitle,
      weddingDate: data.wedding_date ?? HERO_DEFAULTS.weddingDate,
    })
  } catch (error) {
    console.error('Error fetching theme:', error)
    setCssVariables(DEFAULTS)
  } finally {
    if (setLoading) setLoading(false)
  }
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULTS)
  const [heroContent, setHeroContent] = useState(HERO_DEFAULTS)
  const [loading, setLoading] = useState(true)

  const refreshTheme = () => fetchAndApply(setTheme, setHeroContent, null)

  useEffect(() => {
    fetchAndApply(setTheme, setHeroContent, setLoading)
  }, [])

  // Keep CSS variables in sync when theme updates (e.g. after admin save from another tab)
  useEffect(() => {
    setCssVariables(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ ...theme, ...heroContent, loading, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
