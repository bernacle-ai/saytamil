import Link from 'next/link';

const plans = [
  { name: 'Free', price: '₹0', sub: '$0 / month', cta: 'Start Free', href: '/tool', highlight: false, features: ['10 checks/day','1,000 characters/check','Grammar & spelling','Tanglish input','1 seat'], missing: ['Chat history','API access','Priority support'] },
  { name: 'Pro', price: '₹299', sub: '/month', cta: 'Get Pro', href: '/tool', highlight: true, features: ['Unlimited checks','10,000 characters/check','Grammar & spelling','Tanglish input','30-day history','Priority support','1 seat'], missing: ['API access'] },
  { name: 'Team', price: '₹999', sub: '/month', cta: 'Contact Us', href: '/contact', highlight: false, features: ['Unlimited checks','10,000 characters/check','Grammar & spelling','Tanglish input','90-day history','API access','Priority support','Up to 10 seats'], missing: [] },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, Honest Pricing</h2>
          <p className="text-gray-500">Start free. Upgrade when you need more. No hidden fees.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map(p => (
            <div key={p.name}
              className={`rounded-2xl p-8 border transition-all ${p.highlight ? 'border-teal-300 scale-105 shadow-xl bg-white' : 'border-gray-200 bg-white shadow-sm'}`}
              style={p.highlight ? { boxShadow: '0 8px 40px rgba(0,212,180,0.15)' } : {}}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${p.highlight ? 'text-teal-500' : 'text-gray-400'}`}>{p.name}</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">{p.price}</span>
              </div>
              <p className={`text-sm mb-6 ${p.highlight ? 'text-teal-500' : 'text-gray-400'}`}>{p.sub}</p>
              <Link href={p.href}
                className={`block text-center font-semibold py-3 rounded-xl mb-6 transition-all text-sm ${p.highlight ? 'text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                style={p.highlight
                  ? { background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 16px rgba(0,212,180,0.25)' }
                  : { background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                {p.cta}
              </Link>
              <ul className="space-y-2">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-teal-500">✓</span>{f}
                  </li>
                ))}
                {p.missing.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span>✗</span>{f}
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
