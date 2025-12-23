import { useState, useEffect } from 'react'
import TokenViewer from './components/TokenViewer'
import InputPanel from './components/InputPanel'
import Tutorial from './components/Tutorial'

export interface Token {
  id: number
  value: string
  byte_length: number
}

export interface MergeStep {
  pair: [string, string]
  merged: string
  tokens: Token[]
  step_number: number
}

export interface AnalyzeResponse {
  final_tokens: Token[]
  merge_history: MergeStep[]
  vocabulary: [string, number][]
}

function App() {
  const [data, setData] = useState<AnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTutorial, setShowTutorial] = useState(true) // Always show tutorial first

  const handleAnalyze = async (text: string, vocabSize: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://127.0.0.1:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          vocab_size: vocabSize,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`)
      }

      const result: AnalyzeResponse = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTutorialClose = () => {
    setShowTutorial(false)
    localStorage.setItem('hasSeenTutorial', 'true')
  }

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex overflow-hidden">
      {showTutorial && <Tutorial onClose={handleTutorialClose} />}
      
      {/* Left Sidebar - Input */}
      <div className="w-96 flex-shrink-0 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LLM Tokenizer
              </h1>
              <p className="text-xs text-gray-500">BPE Playground</p>
            </div>
          </div>
          <button
            onClick={() => setShowTutorial(true)}
            className="text-gray-400 hover:text-gray-300 transition-colors p-2 hover:bg-gray-800 rounded-lg"
            title="Show Tutorial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <InputPanel onAnalyze={handleAnalyze} loading={loading} />
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-200 text-sm">Error: {error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Results */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {data ? (
          <TokenViewer data={data} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center max-w-md px-8">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-300">Ready to Tokenize!</h2>
              <p className="text-gray-400 mb-6">
                Enter your text in the left panel and click "Analyze Text" to see how BPE tokenization works.
              </p>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-400 mb-2">💡 Quick Tips:</p>
                <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                  <li>Try the quick examples for instant results</li>
                  <li>Use the tutorial button (ℹ️) if you need help</li>
                  <li>Watch how common patterns merge first</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

