import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TutorialProps {
  onClose: () => void
}

export default function Tutorial({ onClose }: TutorialProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to LLM Tokenizer Playground!',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            This interactive tool helps you understand how Large Language Models (LLMs) like ChatGPT tokenize text using Byte Pair Encoding (BPE).
          </p>
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-200 mb-2">
              <strong>What is Tokenization?</strong> Tokenization breaks text into smaller pieces (tokens) that the model can process. Each token gets a unique ID.
            </p>
            <div className="mt-3 pt-3 border-t border-blue-800">
              <p className="text-xs text-blue-300 font-mono">
                Text → Tokens → Token IDs
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Step 1: Enter Your Text',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Type or paste any text in the input field on the left. Try examples like:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
            <li>"Hello world" - Simple text</li>
            <li>"The quick brown fox jumps over the lazy dog" - Common phrases</li>
            <li>"🚀 AI is amazing!" - Text with emojis</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Step 2: Set Vocabulary Size',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Choose how many tokens you want in the vocabulary. Larger vocabularies can represent more complex patterns.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-3">
              <strong>Tip:</strong> ChatGPT uses ~100,000 tokens. Start with 10,000-50,000 for faster processing.
            </p>
            <div className="bg-gray-900/50 rounded p-3 border border-gray-700/50">
              <p className="text-xs text-gray-500 mb-2 font-mono">Vocabulary Size Formula:</p>
              <div className="text-sm text-gray-300 font-mono bg-gray-950/50 p-2 rounded border border-gray-800">
                |V| = |V<sub>base</sub>| + N<sub>merges</sub>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Where |V| is vocabulary size, |V<sub>base</sub>| is base vocabulary (256 bytes), and N<sub>merges</sub> is number of merge operations.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Step 3: Understanding BPE Algorithm',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Byte Pair Encoding works by iteratively merging the most frequent pairs of tokens:
          </p>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">BPE Algorithm Steps:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>Initialize: Split text into individual characters</li>
                <li>Count: Find most frequent adjacent pair (A, B)</li>
                <li>Merge: Replace all occurrences of (A, B) with new token AB</li>
                <li>Repeat: Continue until vocabulary size is reached</li>
              </ol>
            </div>
            <div className="bg-gray-900/50 rounded p-3 border border-gray-700/50 mt-4">
              <p className="text-xs text-gray-500 mb-2 font-mono">Frequency Calculation:</p>
              <div className="text-sm text-gray-300 font-mono bg-gray-950/50 p-2 rounded border border-gray-800">
                freq(pair) = count(pair) / total_pairs
              </div>
              <p className="text-xs text-gray-500 mt-2">
                The pair with highest frequency gets merged first.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Step 4: Explore the Visualization',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            After clicking "Analyze Text", you'll see:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
            <li><strong>Tokens:</strong> Colored boxes showing each token with unique colors</li>
            <li><strong>Vocabulary:</strong> Complete list of all tokens and their IDs</li>
            <li><strong>Merge Steps:</strong> Use <strong>Previous/Next</strong> buttons to step through merges</li>
            <li><strong>Show Bytes:</strong> Toggle to see raw byte representation</li>
            <li><strong>Hover:</strong> See token details (ID, value, byte length)</li>
          </ul>
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-200">
              <strong>💡 Pro Tip:</strong> Use keyboard arrows (← →) to navigate through merge steps quickly!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Mathematical Foundation",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Understanding the math behind BPE helps you appreciate how it works:
          </p>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">1. Initial Tokenization:</p>
              <div className="text-sm text-gray-300 font-mono bg-gray-900/50 p-2 rounded border border-gray-700/50">
                T = [c₁, c₂, c₃, ..., cₙ] where cᵢ ∈ V<sub>base</sub>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Where T is the token sequence, cᵢ are characters, and V<sub>base</sub> is the base vocabulary (256 bytes).
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">2. Pair Frequency:</p>
              <div className="text-sm text-gray-300 font-mono bg-gray-900/50 p-2 rounded border border-gray-700/50">
                freq(AB) = |&#123;(i, i+1) : T[i]=A, T[i+1]=B&#125;| / (n-1)
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Count of positions where token A is followed by token B, divided by total pairs.
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">3. Merge Operation:</p>
              <div className="text-sm text-gray-300 font-mono bg-gray-900/50 p-2 rounded border border-gray-700/50">
                T' = merge(T, AB) where all (A, B) → AB
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">4. Compression Ratio:</p>
              <div className="text-sm text-gray-300 font-mono bg-gray-900/50 p-2 rounded border border-gray-700/50">
                compression = (1 - |T<sub>final</sub>| / |T<sub>initial</sub>|) × 100%
              </div>
            </div>
          </div>
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <p className="text-sm text-green-200">
              <strong>🎯 Key Insight:</strong> Common patterns merge first, creating a vocabulary that efficiently represents the training data!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "You're Ready!",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Start experimenting! Try different texts and vocabulary sizes to see how BPE adapts.
          </p>
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <p className="text-sm text-green-200">
              <strong>Pro Tip:</strong> Watch how common word pairs (like "th", "he", "in") merge first, then longer patterns emerge!
            </p>
          </div>
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <strong>Remember:</strong> Use the Previous/Next buttons prominently displayed above the tokens to navigate through merge steps!
            </p>
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onClose()
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {steps[step].title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6 min-h-[200px]">
              {steps[step].content}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i === step ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={step === 0}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {step === steps.length - 1 ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

