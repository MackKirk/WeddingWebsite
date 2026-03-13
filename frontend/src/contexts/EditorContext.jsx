import { createContext, useContext, useState, useCallback } from 'react'
import { useTheme } from './ThemeContext'

const EditorContext = createContext()

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider')
  }
  return context
}

export const EditorProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelType, setPanelType] = useState(null) // 'hero' | 'colors' | null
  const { refreshTheme } = useTheme()

  const openPanel = useCallback((type) => {
    setPanelType(type)
    setPanelOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    setPanelType(null)
  }, [])

  const refreshAfterSave = useCallback(() => {
    refreshTheme()
  }, [refreshTheme])

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev)
    if (panelOpen) {
      setPanelOpen(false)
      setPanelType(null)
    }
  }, [panelOpen])

  const value = {
    editMode,
    setEditMode,
    panelOpen,
    panelType,
    openPanel,
    closePanel,
    refreshAfterSave,
    toggleEditMode,
  }

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  )
}
