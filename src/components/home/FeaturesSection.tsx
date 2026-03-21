const features = [
  { icon: '🔍', title: 'Grammar Error Detection', description: 'Catches 12+ error types: subject-verb agreement, tense, case endings, and more. Explains why each correction is needed.' },
  { icon: '🔗', title: 'Sandhi Rule Checker (புணர்ச்சி)', description: 'Validates complex Tamil word-joining rules that no basic spell checker touches.' },
  { icon: '🔤', title: 'Spelling & Sound-Alike Words', description: 'Distinguishes confusable pairs (ல vs ள, ன vs ண) that trip up even fluent writers.' },
  { icon: '⌨️', title: 'Tanglish Input', description: 'Type in English phonetics — vanakkam, epdi irukinga — and get Tamil script back, grammar-checked.' },
  { icon: '🔒', title: 'Privacy First', description: 'Your text is never stored. Processed in real-time, deleted immediately.' },
  { icon: '📱', title: 'Works Everywhere', description: 'No install, no plugin. Browser-based. Works on mobile, tablet, desktop.' },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Writers Choose This Tamil Grammar Checker</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Tamil Grammar Checker is a free online tool that finds and fixes Tamil grammar errors in seconds.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="bg-white border border-gray-100 hover:border-teal-200 rounded-2xl p-6 transition-all group shadow-sm hover:shadow-md">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-tamil text-base font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
