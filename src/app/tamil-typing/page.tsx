import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/home/NavBar';
import { Footer } from '@/components/home/Footer';
import { GrammarCheckerWidget } from '@/components/home/GrammarCheckerWidget';

export const metadata: Metadata = {
  title: 'Tamil Typing Guide — How to Type Tamil Online | SayTamil',
  description: 'Learn how to type Tamil online using phonetic (Tanglish), inscript, and Tamil99 keyboard layouts. Free Tamil typing tool with grammar checking built in.',
  alternates: { canonical: 'https://www.saytamil.com/tamil-typing' },
  openGraph: {
    title: 'Tamil Typing Guide — How to Type Tamil Online | SayTamil',
    description: 'Learn how to type Tamil online using phonetic, inscript, and Tamil99 layouts. Free Tamil typing tool with grammar checking.',
    url: 'https://www.saytamil.com/tamil-typing',
    type: 'article',
  },
};

const methods = [
  {
    name: 'Phonetic / Tanglish (Recommended)',
    difficulty: 'Easiest',
    color: 'teal',
    desc: 'Type Tamil words using English letters the way they sound. The tool converts them to Tamil script automatically. No special keyboard needed.',
    example: { input: 'vanakkam', output: 'வணக்கம்' },
    bestFor: 'Beginners, diaspora Tamil speakers, anyone who types on a phone',
  },
  {
    name: 'Tamil99 Keyboard Layout',
    difficulty: 'Intermediate',
    color: 'blue',
    desc: 'A keyboard layout designed specifically for Tamil, standardized by the Tamil Nadu government. Efficient for frequent Tamil typists.',
    example: { input: 'Physical keyboard with Tamil99 layout', output: 'Direct Tamil script input' },
    bestFor: 'Office workers, government employees, frequent Tamil writers',
  },
  {
    name: 'Inscript Keyboard Layout',
    difficulty: 'Intermediate',
    color: 'purple',
    desc: 'The Indian government standard keyboard layout for all Indian scripts. Available natively on Windows and macOS.',
    example: { input: 'Built-in OS keyboard layout', output: 'Direct Tamil script input' },
    bestFor: 'Users who type multiple Indian languages',
  },
];

const shortcuts = [
  { key: 'அ, ஆ, இ, ஈ', desc: 'Short and long vowels — phonetic: a, aa, i, ii' },
  { key: 'க, ச, ட, த, ப, ற', desc: 'Hard consonants (வல்லினம்) — k, ch, t, th, p, tr' },
  { key: 'ங, ஞ, ண, ந, ம, ன', desc: 'Soft consonants (மெல்லினம்) — ng, ny, n, n, m, n' },
  { key: 'ய, ர, ல, வ, ழ, ள', desc: 'Medium consonants (இடையினம்) — y, r, l, v, zh, l' },
];

export default function TamilTypingPage() {
  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-600 border border-teal-200 mb-4 uppercase tracking-wide">
              Tamil Typing
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Type Tamil Online</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Three ways to type Tamil on any device — from the easiest phonetic method to professional keyboard layouts.
              SayTamil supports all of them.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['Tamil Typing', 'Phonetic Tamil', 'Tamil Keyboard', 'Tamil99', 'Inscript'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
              ))}
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
              3 Ways to Type Tamil
            </h2>
            <div className="space-y-5">
              {methods.map((m, i) => (
                <div key={i} className="p-5 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-800">{m.name}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      m.difficulty === 'Easiest' ? 'bg-teal-50 text-teal-600 border border-teal-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>{m.difficulty}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{m.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-1">Example Input</p>
                      <p className="font-mono text-gray-700 text-xs">{m.example.input}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-teal-100">
                      <p className="text-xs text-teal-600 font-semibold mb-1">Output</p>
                      <p className="font-tamil text-gray-800 text-xs">{m.example.output}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-400">Best for: {m.bestFor}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
              Tamil Script — Letter Groups
            </h2>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              Tamil has 12 vowels (உயிர் எழுத்துகள்), 18 consonants (மெய் எழுத்துகள்), and 216 combined letters (உயிர்மெய்).
              Understanding the three consonant groups helps you type faster with phonetic input.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left p-3 font-semibold text-gray-500">Letters</th>
                    <th className="text-left p-3 font-semibold text-gray-500">Phonetic Equivalent</th>
                  </tr>
                </thead>
                <tbody>
                  {shortcuts.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-tamil text-teal-700 font-medium">{s.key}</td>
                      <td className="p-3 text-gray-500 text-xs">{s.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Live Interactive Tool */}
          <div className="mb-10 -mx-4">
            <GrammarCheckerWidget />
          </div>

          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/tanglish-to-tamil" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Related</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Tanglish to Tamil Converter →</p>
            </Link>
            <Link href="/tamil-grammar-checker" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Learn more</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Tamil Grammar Guide →</p>
            </Link>
          </div>

          <div className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(0,212,180,0.08),rgba(124,106,247,0.08))', border: '1px solid rgba(0,212,180,0.2)' }}>
            <p className="text-gray-800 font-semibold mb-2">Type Tamil and check grammar — free</p>
            <p className="text-gray-500 text-sm mb-5">Use phonetic Tanglish input or paste Tamil text directly. AI grammar checking included.</p>
            <Link href="/tool"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 16px rgba(0,212,180,0.25)' }}>
              Start Typing Tamil Free →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
