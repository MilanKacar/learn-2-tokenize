import { useState } from 'react'
import QuickExamples from './QuickExamples'
import HelpTooltip from './HelpTooltip'

interface InputPanelProps {
  onAnalyze: (text: string, vocabSize: number) => void
  loading: boolean
}

export default function InputPanel({ onAnalyze, loading }: InputPanelProps) {
  const [text, setText] = useState('Hello world')
  const [vocabSize, setVocabSize] = useState(50000)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAnalyze(text, vocabSize)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <QuickExamples onSelect={setText} />
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="text" className="block text-sm font-medium">
            Text to Tokenize
          </label>
          <HelpTooltip content="Enter any text you want to see tokenized. Try different examples to see how BPE handles various patterns.">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </HelpTooltip>
        </div>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={8}
          placeholder="Enter text to tokenize..."
        />
        <div className="mt-2 text-xs text-gray-500">
          {text.length} characters
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="vocabSize" className="block text-sm font-medium">
            Vocabulary Size: {vocabSize.toLocaleString()}
          </label>
          <HelpTooltip content="The maximum number of tokens in the vocabulary. Larger vocabularies can represent more complex patterns but take longer to process. ChatGPT uses ~100,000 tokens.">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </HelpTooltip>
        </div>
        <div className="space-y-2">
          <input
            id="vocabSize"
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={vocabSize}
            onChange={(e) => setVocabSize(Number(e.target.value))}
            className="w-full"
          />
          <input
            type="number"
            min="1000"
            max="100000"
            step="1000"
            value={vocabSize}
            onChange={(e) => setVocabSize(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Analyze Text</span>
          </>
        )}
      </button>
    </form>
  )
}

