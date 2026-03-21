const testimonials = [
  { quote: 'Finally a tool that explains the sandhi rule instead of just changing the word.', name: 'Priya K.', role: 'Tamil blogger', location: 'Chennai, Tamil Nadu', initials: 'PK' },
  { quote: 'I use this before every press release. My editors have stopped sending back Tamil corrections.', name: 'Murugan S.', role: 'PR Manager', location: 'Coimbatore', initials: 'MS' },
  { quote: 'My students submit much better Tamil writing since I told them about this tool.', name: 'Meenakshi T.', role: 'Tamil Language Teacher', location: 'Singapore', initials: 'MT' },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by Tamil Writers Across India and Beyond</h2>
          <p className="text-gray-500">From Chennai to Singapore — writers rely on SayTamil every day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-teal-200 hover:shadow-md transition-all">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-base leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
