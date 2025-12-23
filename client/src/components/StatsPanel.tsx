import type { AnalyzeResponse } from '../App'

interface StatsPanelProps {
  data: AnalyzeResponse
  currentStep: number
}

export default function StatsPanel({ data, currentStep }: StatsPanelProps) {
  const currentTokens = data.merge_history[currentStep]?.tokens || []
  const initialTokens = data.merge_history[0]?.tokens || []
  const compressionRatio = initialTokens.length > 0 
    ? ((1 - currentTokens.length / initialTokens.length) * 100).toFixed(1)
    : '0'

  const totalBytes = currentTokens.reduce((sum, token) => sum + token.byte_length, 0)
  const avgTokenLength = currentTokens.length > 0 
    ? (totalBytes / currentTokens.length).toFixed(2)
    : '0'

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-700/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Current Tokens</div>
        <div className="text-2xl font-bold text-blue-400">{currentTokens.length}</div>
      </div>
      <div className="bg-gradient-to-br from-gray-700/20 to-gray-800/10 border border-gray-700/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Initial Tokens</div>
        <div className="text-2xl font-bold text-gray-300">{initialTokens.length}</div>
      </div>
      <div className="bg-gradient-to-br from-green-600/20 to-green-700/10 border border-green-700/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Compression</div>
        <div className="text-2xl font-bold text-green-400">{compressionRatio}%</div>
      </div>
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/10 border border-purple-700/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Avg Token Size</div>
        <div className="text-2xl font-bold text-purple-400">{avgTokenLength} <span className="text-sm text-gray-500">bytes</span></div>
      </div>
    </div>
  )
}

