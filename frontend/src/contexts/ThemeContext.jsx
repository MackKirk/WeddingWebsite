import { createContext, useContext, useState, useEffect } from 'react'
import { getHomeContent } from '../services/content'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [textColor, setTextColor] = useState('#8B6F6D')
  const [navbarColor, setNavbarColor] = useState('#F8F4EC')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await getHomeContent()
        const data = response.data
        if (data.text_color) {
          setTextColor(data.text_color)
        }
        if (data.navbar_color) {
          setNavbarColor(data.navbar_color)
        }
      } catch (error) {
        console.error('Error fetching theme:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTheme()
  }, [])

  return (
    <ThemeContext.Provider value={{ textColor, navbarColor, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}

