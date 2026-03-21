'use client';

import { useState } from 'react';

const faqs = [
  { q: 'Is this Tamil grammar checker free?', a: 'Yes. The basic grammar and spell check is 100% free with no signup required. A Pro plan is available for heavy users and teams.' },
  { q: 'Does it support Tanglish (romanized Tamil)?', a: 'Yes. You can type in English phonetics (Tanglish) and the tool converts it to Tamil script before checking grammar.' },
  { q: 'What grammar rules does it check?', a: 'It checks verb forms (வினைச்சொல்), sandhi rules (புணர்ச்சி), subject-verb agreement, spelling, and punctuation.' },
  { q: 'Does it work for formal and spoken Tamil?', a: 'Yes. It supports both formal written Tamil (எழுத்து தமிழ்) and colloquial spoken Tamil (பேச்சு தமிழ்).' },
  { q: 'Is my text stored or shared?', a: 'No. Your text is processed in real-time and never stored on our servers.' },
  { q: 'Can I use this for formal Tamil (செந்தமிழ்) writing?', a: 'Yes. SayTamil is optimized for formal written Tamil (செந்தமிழ்) and handles classical grammar rules accurately.' },
  { q: 'Does it support Sri Lankan Tamil dialect?', a: 'Yes. The tool understands both Indian Tamil and Sri Lankan Tamil dialects and checks grammar accordingly.' },
  { q: 'Is there a browser extension?', a: 'A Chrome extension is coming soon. For now, use the web tool at saytamil.com — it works on any browser.' },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions about the Tamil Grammar Checker</h2>
          <p className="text-gray-500">Everything you need to know about the free Tamil grammar checker.</p>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${open === i ? 'border-teal-300 bg-teal-50/40' : 'border-gray-200 bg-white'}`}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                <span className={`text-teal-500 text-xl transition-transform flex-shrink-0 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-4">
                  <p className="font-tamil text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
