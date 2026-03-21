'use client';

import { useState, useEffect } from 'react';

const examples = [
  { label: 'Students', before: 'தோட்டத்தில் பல வண்ணப் பூக்கள் இருந்தது.', after: 'தோட்டத்தில் பல வண்ணப் பூக்கள் இருந்தன.', rule: 'Subject-verb agreement', explanation: 'பூக்கள் (plural) → இருந்தன' },
  { label: 'Writers', before: 'அவன் நேற்று வந்தான், இன்று போகிறான்.', after: 'அவன் நேற்று வந்தான்; இன்று போகிறான்.', rule: 'Punctuation', explanation: 'Independent clauses need a semicolon (;) not a comma' },
  { label: 'Business', before: 'கடிதத்தை படிக்கவும்.', after: 'கடிதத்தைப் படிக்கவும்.', rule: 'Sandhi rule (புணர்ச்சி)', explanation: 'கடிதத்தை + படிக்கவும் → கடிதத்தைப் படிக்கவும்' },
]

export function DemoSection() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setActive(prev => (prev + 1) % examples.length); setVisible(true); }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const ex = examples[active];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">See the Tamil Grammar Checker in Action</h2>
          <p className="text-gray-500">Real corrections, real explanations — in Tamil.</p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {examples.map((e, i) => (
            <button key={e.label} onClick={() => { setVisible(false); setTimeout(() => { setActive(i); setVisible(true); }, 150); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${active === i ? 'text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600'}`}
              style={active === i ? { background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' } : {}}>
              {e.label}
            </button>
          ))}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">Before</p>
            <p className="font-tamil text-xl text-gray-800 leading-relaxed">{ex.before}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
              <span className="text-sm text-red-400">Grammar error detected</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-sm">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-3">After</p>
            <p className="font-tamil text-xl text-gray-800 leading-relaxed">{ex.after}</p>
            <div className="mt-4 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-teal-600 mb-1">Why? — {ex.rule}</p>
              <p className="font-tamil text-sm text-gray-500">{ex.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
