import React from 'react'
import './ThemeToggle.css'

interface ThemeToggleProps {
  isLightTheme: boolean
  onToggle: () => void
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isLightTheme, onToggle }) => {
  return (
    <button className="theme-toggle" type="button" onClick={onToggle}>
      Switch to {isLightTheme ? "Dark" : "Light"}
    </button>
  )
}

export default ThemeToggle
