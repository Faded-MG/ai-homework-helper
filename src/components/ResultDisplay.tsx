import React from 'react'
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
  return (
    <>
      <div className="result">{result}</div>
      <div className="result-actions">
        <button 
          className="secondary-btn" 
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
