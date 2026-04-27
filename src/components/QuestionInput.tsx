import React from 'react'
import './QuestionInput.css'

interface QuestionInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled: boolean
}

const QuestionInput: React.FC<QuestionInputProps> = ({ value, onChange, onSubmit, disabled }) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <>
      <label htmlFor="question">Your question</label>
      <textarea
        id="question"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={6}
        placeholder="Paste your question here"
        disabled={disabled}
      />
    </>
  )
}

export default QuestionInput
