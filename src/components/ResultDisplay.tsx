import React, { useState, useEffect } from 'react'
import './ResultDisplay.css'

interface ResultDisplayProps {
  result: string
  onCopy: () => void
  copyButtonText: string
  copyDisabled: boolean
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  result, 
  onCopy, 
  copyButtonText, 
  copyDisabled 
}) => {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (copyButtonText === "Copied!") {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [copyButtonText])

  return (
    <>
      <div className="result">{result}</div>
      <div className="result-actions">
        <button 
          className={`secondary-btn ${showSuccess ? 'success' : ''}`}
          type="button" 
          onClick={onCopy}
          disabled={copyDisabled}
        >
          {copyButtonText}
        </button>
      </div>
    </>
  )
}

export default ResultDisplay
