import React, { useState, useEffect, useCallback } from 'react'
import ThemeToggle from './components/ThemeToggle'
import QuestionInput from './components/QuestionInput'
import ExplainButton from './components/ExplainButton'
import ResultDisplay from './components/ResultDisplay'
import './App.css'

interface ExplanationResponse {
  explanation: string
}

const App: React.FC = () => {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState('Your explanation will appear here.')
  const [isLoading, setIsLoading] = useState(false)
  const [isLightTheme, setIsLightTheme] = useState(false)
  const [copyButtonText, setCopyButtonText] = useState('Copy answer')

  const API_BASE = (() => {
    const loc = window.location
    if (loc.protocol === "file:" || !loc.hostname) {
      return "http://localhost:3000"
    }
    return `${loc.protocol}//${loc.host}`
  })()

  useEffect(() => {
    const saved = localStorage.getItem("ai-homework-theme")
    if (saved === "light") {
      setIsLightTheme(true)
      document.body.classList.add("light")
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = !isLightTheme
    setIsLightTheme(newTheme)
    if (newTheme) {
      document.body.classList.add("light")
      localStorage.setItem("ai-homework-theme", "light")
    } else {
      document.body.classList.remove("light")
      localStorage.setItem("ai-homework-theme", "dark")
    }
  }, [isLightTheme])

  const copyAnswer = useCallback(async () => {
    const text = result.trim()
    if (!text || text === "Your explanation will appear here.") return

    try {
      await navigator.clipboard.writeText(text)
      setCopyButtonText("Copied!")
      setTimeout(() => {
        setCopyButtonText("Copy answer")
      }, 1200)
    } catch {
      setCopyButtonText("Copy failed")
      setTimeout(() => {
        setCopyButtonText("Copy answer")
      }, 1200)
    }
  }, [result])

  const sendQuestion = useCallback(async () => {
    if (!question.trim()) {
      setResult("Please enter a question.")
      return
    }

    setIsLoading(true)
    setResult("Thinking…")

    try {
      const response = await fetch(`${API_BASE}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })

      const text = await response.text()
      let data: ExplanationResponse
      try {
        data = JSON.parse(text)
      } catch {
        setResult("Server returned invalid JSON. Is the API running?")
        return
      }

      if (!response.ok) {
        setResult(data.explanation || `Request failed (${response.status}).`)
        return
      }

      setResult(data.explanation ?? "No explanation in response.")
    } catch (e) {
      setResult(
        `Could not reach the server (${e && (e as Error).message ? (e as Error).message : "unknown error"}). ` +
        `Make sure "npm start" is running, then open http://localhost:3000 (or keep using this page — requests go to ${API_BASE}).`
      )
    } finally {
      setIsLoading(false)
    }
  }, [question, API_BASE])

  return (
    <main className="card">
      <div className="topbar">
        <h1>AI Homework Explainer</h1>
        <ThemeToggle isLightTheme={isLightTheme} onToggle={toggleTheme} />
      </div>
      <p className="subtitle">Paste your homework question and get a simple step-by-step explanation.</p>

      <QuestionInput
        value={question}
        onChange={setQuestion}
        onSubmit={sendQuestion}
        disabled={isLoading}
      />

      <div className="actions">
        <ExplainButton
          onClick={sendQuestion}
          isLoading={isLoading}
          disabled={!question.trim()}
        />
      </div>

      <ResultDisplay
        result={result}
        onCopy={copyAnswer}
        copyButtonText={copyButtonText}
        copyDisabled={!result || result === "Your explanation will appear here."}
      />
      
      <p className="hint">Tip: more context usually gives better explanations.</p>
    </main>
  )
}

export default App
