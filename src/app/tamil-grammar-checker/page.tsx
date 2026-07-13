import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/home/NavBar';
import { Footer } from '@/components/home/Footer';
import { GrammarCheckerWidget } from '@/components/home/GrammarCheckerWidget';

export const metadata: Metadata = {
  title: 'Tamil Grammar Checker — Free AI Tool for Tamil Writing | SayTamil',
  description: 'Free AI-powered Tamil grammar checker. Instantly fix Tamil grammar errors, spelling mistakes, sandhi rules, and verb forms. No signup needed. Supports Tanglish input.',
  alternates: { canonical: 'https://www.saytamil.com/tamil-grammar-checker' },
  openGraph: {
    title: 'Tamil Grammar Checker — Free AI Tool for Tamil Writing | SayTamil',
    description: 'Free AI-powered Tamil grammar checker. Fix grammar, spelling, sandhi, and verb forms instantly. No signup needed.',
    url: 'https://www.saytamil.com/tamil-grammar-checker',
    type: 'website',
  },
};

const keywords = [
  'Tamil Grammar Checker',
  'Tamil Writing Tool',
  'Tamil Spell Checker',
  'Tanglish to Tamil',
  'Tamil Sandhi Checker',
  'Free Tamil AI Tool',
  'Tamil Verb Form Checker',
  'Online Tamil Proofreader',
];

const features = [
  { label: 'Grammar Check', desc: 'Verb forms, tense, person & gender agreement' },
  { label: 'Sandhi Rules', desc: 'Word boundary errors caught automatically' },
  { label: 'Spell Check', desc: 'ல/ள, ன/ண, ழ/ல confusion detected' },
  { label: 'Tanglish Input', desc: 'Type in English, get Tamil script' },
  { label: 'AI Explanations', desc: 'Every correction explained clearly' },
  { label: 'Free to Use', desc: '10 checks/day, no account needed' },
];

export default function TamilGrammarCheckerPage() {
  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <main className="pt-24 pb-20">

        {/* Hero */}
        <div className="px-4 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-600 border border-teal-200 mb-4 uppercase tracking-wide">
            Free AI Tool
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tamil Grammar Checker
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-6">
            SayTamil is a free AI-powered Tamil grammar and writing tool. Paste or type any Tamil text —
            including Tanglish — and get instant corrections for grammar, spelling, sandhi rules, and verb forms.
            No signup needed.
          </p>

          {/* Keyword tags */}
          <div className="flex flex-wrap gap-2">
            {keywords.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Live Interactive Tool */}
        <div className="max-w-6xl mx-auto px-4 mb-10">
          <GrammarCheckerWidget />
        </div>

        {/* What it checks */}
        <div className="px-4 max-w-3xl mx-auto mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">What the Tamil Grammar Checker Fixes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {features.map((f) => (
              <div key={f.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  <span className="text-teal-500 mr-1">✓</span>{f.label}
                </p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Internal links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/sandhi-rules" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Deep dive</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Tamil Sandhi Rules →</p>
            </Link>
            <Link href="/tanglish-to-tamil" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Related</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Tanglish Converter →</p>
            </Link>
            <Link href="/tamil-typing" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Related</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Tamil Typing Guide →</p>
            </Link>
          </div>

          {/* CTA */}
          <div className="mt-8 p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(0,212,180,0.08),rgba(124,106,247,0.08))', border: '1px solid rgba(0,212,180,0.2)' }}>
            <p className="text-gray-800 font-semibold mb-2">Ready to check your Tamil writing?</p>
            <p className="text-gray-500 text-sm mb-5">Free — 10 checks/day, no signup needed.</p>
            <Link
              href="/tool"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 16px rgba(0,212,180,0.25)' }}
            >
              Try Tamil Grammar Checker Free →
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
