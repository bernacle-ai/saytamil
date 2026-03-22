import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/home/NavBar';
import { Footer } from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'Tanglish to Tamil Converter — Free Online Tool | SayTamil',
  description: 'Convert Tanglish (Tamil typed in English letters) to Tamil script instantly. Free online Tanglish to Tamil converter with AI grammar checking. No signup needed.',
  alternates: { canonical: 'https://www.saytamil.com/tanglish-to-tamil' },
  openGraph: {
    title: 'Tanglish to Tamil Converter — Free Online Tool | SayTamil',
    description: 'Convert Tanglish to Tamil script instantly. Free online converter with AI grammar checking. No signup needed.',
    url: 'https://www.saytamil.com/tanglish-to-tamil',
    type: 'article',
  },
};

const examples = [
  { tanglish: 'vanakkam', tamil: 'வணக்கம்', meaning: 'Hello / Greetings' },
  { tanglish: 'nandri', tamil: 'நன்றி', meaning: 'Thank you' },
  { tanglish: 'eppadi irukkeenga', tamil: 'எப்படி இருக்கீங்க', meaning: 'How are you?' },
  { tanglish: 'romba nalla irukku', tamil: 'ரொம்ப நல்லா இருக்கு', meaning: 'It is very good' },
  { tanglish: 'enna panreenga', tamil: 'என்ன பண்றீங்க', meaning: 'What are you doing?' },
  { tanglish: 'puriyala', tamil: 'புரியல', meaning: "I don't understand" },
  { tanglish: 'sollunga', tamil: 'சொல்லுங்க', meaning: 'Please tell me' },
  { tanglish: 'paakalam', tamil: 'பாக்கலாம்', meaning: "Let's see" },
  { tanglish: 'seri', tamil: 'சரி', meaning: 'OK / Alright' },
  { tanglish: 'saapteenga', tamil: 'சாப்பிட்டீங்க', meaning: 'Did you eat?' },
];

const steps = [
  { title: 'Open the free grammar checker', desc: 'Go to the tool — no account needed for the free tier (10 checks/day).' },
  { title: 'Type in Tanglish', desc: 'Type your Tamil text using English letters. The tool auto-detects Tanglish and converts it to Tamil script.' },
  { title: 'Get instant grammar feedback', desc: 'The AI checks the converted Tamil for grammar errors, spelling, and sandhi — and explains each fix.' },
];

export default function TanglishToTamilPage() {
  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-600 border border-teal-200 mb-4 uppercase tracking-wide">
              Tanglish Converter
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tanglish to Tamil Converter</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Type Tamil phonetically in English letters and get the correct Tamil script instantly — with AI grammar checking built in. Free, no signup needed.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['Tanglish', 'Tamil Typing', 'Phonetic Tamil', 'Tamil Transliteration', 'Free Tool'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
              ))}
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">What is Tanglish?</h2>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              Tanglish is the practice of writing Tamil words using English (Roman) letters — for example,
              typing <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-sm">vanakkam</span> instead of{' '}
              <span className="font-tamil text-gray-800">வணக்கம்</span>. It is widely used in WhatsApp, social media,
              and online communication by Tamil speakers who find it faster to type in English. SayTamil accepts
              Tanglish input directly — type naturally and the tool converts it to Tamil script before checking grammar.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
              How to Convert Tanglish to Tamil — 3 Steps
            </h2>
            <ol className="space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }}>{i + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-1">{s.title}</p>
                    <p className="text-gray-500 text-sm">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
              Tanglish to Tamil — 10 Common Examples
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left p-3 font-semibold text-gray-500">Tanglish (English)</th>
                    <th className="text-left p-3 font-semibold text-teal-600">Tamil Script</th>
                    <th className="text-left p-3 font-semibold text-gray-400">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {examples.map((e, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-mono text-gray-700">{e.tanglish}</td>
                      <td className="p-3 font-tamil font-medium text-teal-700">{e.tamil}</td>
                      <td className="p-3 text-gray-500">{e.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/tamil-grammar-checker" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Learn more</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Tamil Grammar Guide →</p>
            </Link>
            <Link href="/tamil-typing" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Related</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Tamil Typing Guide →</p>
            </Link>
          </div>

          <div className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(0,212,180,0.08),rgba(124,106,247,0.08))', border: '1px solid rgba(0,212,180,0.2)' }}>
            <p className="text-gray-800 font-semibold mb-2">Try Tanglish input now — free</p>
            <p className="text-gray-500 text-sm mb-5">Type in English, get Tamil script + grammar corrections instantly. No account needed.</p>
            <Link href="/tool"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 16px rgba(0,212,180,0.25)' }}>
              Open Free Tanglish Converter →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
