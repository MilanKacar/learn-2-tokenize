interface QuickExamplesProps {
  onSelect: (text: string) => void
}

export default function QuickExamples({ onSelect }: QuickExamplesProps) {
  const examples = [
    { label: 'English Simple', text: 'Hello world' },
    { label: 'German Simple', text: 'Hallo Welt' },
    { label: 'Serbian Simple', text: 'Zdravo svete' },
    { label: 'English Phrase', text: 'The quick brown fox jumps over the lazy dog' },
    { label: 'German Phrase', text: 'Der schnelle braune Fuchs springt über den faulen Hund' },
    { label: 'Serbian Phrase', text: 'Брза смеђа лисица скаче преко лењог пса' },
    { label: 'Mixed Languages', text: 'Hello! Guten Tag! Здраво! How are you? Wie geht es dir? Како си?' },
    { label: 'With Numbers', text: 'I have 42 apples, 3.14 pi, and 100€ (hundert Euro)' },
    { label: 'German Numbers', text: 'Ich habe 42 Äpfel und 3,14 Pi' },
    { label: 'Serbian Numbers', text: 'Имам 42 јабуке и 3,14 пи' },
    { label: 'With Emojis', text: '🚀 AI is amazing! 🎉 Künstliche Intelligenz! 🤖' },
    { label: 'Code Mixed', text: 'function hello() { return "Hallo Welt"; } // Здраво свете' },
    { label: 'Long Mixed', text: 'This is English. Das ist Deutsch. Ово је српски. BPE handles all languages! BPE behandelt alle Sprachen! BPE обрађује све језике!' },
  ]

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">Quick Examples</h3>
        <span className="text-xs text-gray-500">Click to try</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {examples.map((example, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(example.text)}
            className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors"
            title={example.text}
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  )
}

