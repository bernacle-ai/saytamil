const useCases = [
  { icon: '🎓', title: 'Free Tamil Grammar Checker for Students', subtitle: 'மாணவர்கள்', points: ['Submit error-free Tamil essays', 'Learn grammar by reading corrections', 'Works for school, college, university'] },
  { icon: '✍️', title: 'Tamil Grammar Checker for Content Creators', subtitle: 'Content Creators & Journalists', points: ['Publish polished Tamil articles', 'Catch errors before they go live', 'Handles formal and colloquial Tamil'] },
  { icon: '🏢', title: 'Tamil Grammar Checker for Businesses', subtitle: 'Businesses & Government', points: ['Professional Tamil communications', 'Error-free circulars, notices, emails', 'Team plan with shared checks (Pro)'] },
]

export function UseCasesSection() {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tamil Grammar Checker for Every Writer</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Whether you&apos;re a student, journalist, or business — SayTamil has you covered.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map(u => (
            <div key={u.title} className="bg-white border border-gray-100 hover:border-teal-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all group">
              <div className="text-4xl mb-4">{u.icon}</div>
              <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{u.title}</h3>
              <p className="font-tamil text-sm font-medium mb-4 text-teal-600">{u.subtitle}</p>
              <ul className="space-y-2">
                {u.points.map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-500">
                    <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
