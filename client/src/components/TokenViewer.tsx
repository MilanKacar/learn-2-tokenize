import { useState, useEffect, useRef } from 'react'
import type { AnalyzeResponse, Token } from '../App'
import { generateTokenColor } from '../utils/colorHash'
import StatsPanel from './StatsPanel'

interface TokenViewerProps {
  data: AnalyzeResponse
}

export default function TokenViewer({ data }: TokenViewerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const tokenRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  
  const maxStep = data.merge_history.length - 1
  const currentTokens = data.merge_history[currentStep]?.tokens || []
  const currentMergeStep = data.merge_history[currentStep]

  const handleNext = () => {
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return // Don't handle shortcuts when typing in inputs
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1)
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        if (currentStep < maxStep) {
          setCurrentStep(currentStep + 1)
        }
      } else if (e.key === 'Home') {
        e.preventDefault()
        setCurrentStep(0)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentStep, maxStep])

  const getTokenBytes = (token: Token) => {
    const bytes = Array.from(token.value).map((char) => char.charCodeAt(0))
    return `[${bytes.join(', ')}]`
  }

  return (
    <>
      {/* Tooltip Portal - renders above token with high z-index like tutorial */}
      {hoveredTokenIndex !== null && tooltipPosition && currentTokens[hoveredTokenIndex] && (
        <div
          className="fixed px-3 py-2.5 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl pointer-events-none z-[9999] whitespace-nowrap min-w-[200px]"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
          }}
        >
          <div className="text-xs space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 font-medium">Token ID</span>
              <span className="font-mono font-semibold text-blue-400">{currentTokens[hoveredTokenIndex].id}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 font-medium">Text Value</span>
              <span className="font-mono font-semibold text-gray-100 max-w-[120px] truncate" title={JSON.stringify(currentTokens[hoveredTokenIndex].value)}>
                {JSON.stringify(currentTokens[hoveredTokenIndex].value)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 font-medium">Bytes</span>
              <span className="font-mono font-semibold text-green-400">{getTokenBytes(currentTokens[hoveredTokenIndex])}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 font-medium">Byte Length</span>
              <span className="font-mono font-semibold text-purple-400">{currentTokens[hoveredTokenIndex].byte_length}</span>
            </div>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-3 h-3 bg-gray-900 border-r border-b border-gray-700 rotate-45"></div>
        </div>
      )}
      
      <div className="h-full flex flex-col overflow-hidden bg-gray-900">
      {/* Stats Panel */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <StatsPanel data={data} currentStep={currentStep} />
      </div>

      {/* Main Content - Stacked vertically */}
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        {/* Token Display - Takes more space */}
        <div className="flex-[2] flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden min-h-0 shadow-xl">
          <div className="p-4 border-b border-gray-700/50 flex-shrink-0 flex items-center justify-between bg-gray-800/80">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-100">Tokens</h2>
              <span className="px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                {currentTokens.length}
              </span>
            </div>
            
          </div>
          
          {/* Prominent Navigation Controls */}
          <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-800/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                  title="Previous step (← or ↑)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
                
                <div className="px-6 py-3 bg-gray-700/50 rounded-xl border border-gray-600/50">
                  <div className="text-sm font-semibold text-gray-300">
                    Step <span className="text-blue-400">{currentStep}</span> of <span className="text-gray-400">{maxStep}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  disabled={currentStep === maxStep}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                  title="Next step (→ or ↓)"
                >
                  <span>Next</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-gray-700/50 hover:bg-gray-600 rounded-xl transition-all font-medium text-sm shadow-md hover:shadow-lg hover:scale-105"
                title="Reset to beginning (Home)"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Merge Info */}
          {currentMergeStep && currentStep > 0 && (
            <div className="px-4 py-3 border-b border-gray-700/50 bg-gradient-to-r from-blue-900/20 to-blue-800/10 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 font-medium">Merge:</span>
                <span className="font-mono bg-gray-700/50 px-2 py-1 rounded text-gray-200">
                  {currentMergeStep.pair[0]}
                </span>
                <span className="text-gray-500">+</span>
                <span className="font-mono bg-gray-700/50 px-2 py-1 rounded text-gray-200">
                  {currentMergeStep.pair[1]}
                </span>
                <span className="text-gray-500">→</span>
                <span className="font-mono bg-green-700/30 px-2 py-1 rounded text-green-300 border border-green-700/30">
                  {currentMergeStep.merged}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden relative">
            <div className="grid grid-cols-2 h-full relative">
              {/* Vertical Divider */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600/50"></div>
              
              {/* Text View - Left Side */}
              <div className="flex flex-col pr-6">
                <div className="text-sm text-gray-300 mb-3 font-semibold uppercase tracking-wider">Text Representation</div>
                <div className="flex-1 flex flex-wrap gap-3 content-start" style={{ overflowX: 'hidden' }}>
                  {currentTokens.map((token, index) => (
                    <div
                      key={`${token.id}-${index}-${currentStep}-text`}
                      ref={(el) => { tokenRefs.current[`text-${index}`] = el }}
                      className="group relative"
                      onMouseEnter={(e) => {
                        setHoveredTokenIndex(index)
                        const rect = e.currentTarget.getBoundingClientRect()
                        setTooltipPosition({ top: rect.top - 8, left: rect.left + rect.width / 2 })
                      }}
                      onMouseLeave={() => {
                        setHoveredTokenIndex(null)
                        setTooltipPosition(null)
                      }}
                    >
                        <div
                          className={`px-4 py-2 rounded-xl border-2 cursor-pointer transition-all hover:shadow-xl hover:scale-110 ${
                            hoveredTokenIndex === index
                              ? 'border-blue-400 shadow-blue-500/50 shadow-lg scale-110'
                              : 'border-gray-600/50 hover:border-gray-400'
                          }`}
                          style={{
                            backgroundColor: generateTokenColor(token.id),
                            color: '#000',
                          }}
                        >
                          <span className="font-mono text-sm font-semibold">
                            {token.value}
                          </span>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Bytes View - Right Side */}
              <div className="flex flex-col pl-6">
                <div className="text-sm text-gray-300 mb-3 font-semibold uppercase tracking-wider">Byte Representation</div>
                <div className="flex-1 flex flex-wrap gap-3 content-start" style={{ overflowX: 'hidden' }}>
                  {currentTokens.map((token, index) => (
                    <div
                      key={`${token.id}-${index}-${currentStep}-bytes`}
                      ref={(el) => { tokenRefs.current[`bytes-${index}`] = el }}
                      className="group relative"
                      onMouseEnter={(e) => {
                        setHoveredTokenIndex(index)
                        const rect = e.currentTarget.getBoundingClientRect()
                        setTooltipPosition({ top: rect.top - 8, left: rect.left + rect.width / 2 })
                      }}
                      onMouseLeave={() => {
                        setHoveredTokenIndex(null)
                        setTooltipPosition(null)
                      }}
                    >
                        <div
                          className={`px-4 py-2 rounded-xl border-2 cursor-pointer transition-all hover:shadow-xl hover:scale-110 bg-gray-700/40 ${
                            hoveredTokenIndex === index
                              ? 'border-blue-400 shadow-blue-500/50 shadow-lg scale-110 bg-gray-600/60'
                              : 'border-gray-600/50 hover:border-gray-400'
                          }`}
                        >
                          <span className="font-mono text-xs font-semibold text-gray-200">
                            {getTokenBytes(token)}
                          </span>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vocabulary Table - Takes less space */}
        <div className="flex-[1] flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden min-h-0 shadow-xl max-h-[40%]">
          <div className="p-4 border-b border-gray-700/50 flex-shrink-0 bg-gray-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-100">Vocabulary</h2>
              <span className="px-2.5 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs font-medium">
                {data.vocabulary.length}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              New tokens highlighted in blue
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 z-10">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Token (Text)</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Token (Bytes)</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                </tr>
              </thead>
              <tbody>
                {data.vocabulary.map(([token, id], idx) => {
                  const isNewlyAdded = currentStep > 0 && 
                    data.merge_history[currentStep]?.merged === token
                  const tokenBytes = `[${Array.from(token).map(c => c.charCodeAt(0)).join(', ')}]`
                  return (
                    <tr
                      key={`${token}-${id}`}
                      className={`hover:bg-gray-700/30 transition-colors ${isNewlyAdded ? 'bg-blue-900/20' : ''}`}
                    >
                      <td className="py-2.5 px-4 font-mono text-xs text-gray-200">
                        {JSON.stringify(token)}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-gray-400">
                        {tokenBytes}
                      </td>
                      <td className="py-2.5 px-4 text-gray-300 font-medium">{id}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

