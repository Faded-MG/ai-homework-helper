import React from 'react'
import './ExplainButton.css'

interface ExplainButtonProps {
  onClick: () => void
  isLoading: boolean
  disabled: boolean
}

const ExplainButton: React.FC<ExplainButtonProps> = ({ onClick, isLoading, disabled }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={isLoading ? 'loading' : ''}
    >
      <span className="spinner" aria-hidden="true"></span>
      <span>{isLoading ? "Thinking..." : "Explain"}</span>
    </button>
  )
}

export default ExplainButton
