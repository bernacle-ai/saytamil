import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/home/NavBar';
import { Footer } from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'Tamil Sandhi Rules Explained — Examples & Free Checker | SayTamil',
  description: 'Learn all Tamil sandhi rules (punarchi) with clear before/after examples. Understand vowel sandhi, consonant doubling, and glide insertion. Check your writing free.',
  alternates: { canonical: 'https://www.saytamil.com/sandhi-rules' },
  openGraph: {
    title: 'Tamil Sandhi Rules Explained — Examples & Free Checker | SayTamil',
    description: 'Learn all Tamil sandhi rules with clear before/after examples. Check your sandhi automatically with our free AI Tamil grammar tool.',
    url: 'https://www.saytamil.com/sandhi-rules',
    type: 'article',
  },
};

const rules = [
  {
    name: 'Glide Insertion — யகர (Y-glide)',
    description: 'When a word ending in ஐ, ஏ, or ஒய் is followed by a vowel, the glide consonant ய் is inserted.',
    before: 'கை + அடி',
    after: 'கையடி',
    english: 'kai + adi → kaiyadi',
  },
  {
    name: 'Glide Insertion — வகர (V-glide)',
    description: 'When a word ending in ஆ, ஊ, or ஓ is followed by a vowel, the glide consonant வ் is inserted.',
    before: 'பூ + அழகு',
    after: 'பூவழகு',
    english: 'poo + azhagu → poovazhagu',
  },
  {
    name: 'Hard Consonant Doubling (வல்லினம் மிகும்)',
    description: 'After certain word endings, the following hard consonant (க, ச, ட, த, ப, ற) is doubled.',
    before: 'பாட்டு + கேட்டான்',
    after: 'பாட்டுக்கேட்டான்',
    english: 'paattu + kettaan → paattukkeттaan',
  },
  {
    name: 'Hard Consonant Not Doubled (வல்லினம் மிகா)',
    description: 'After certain word endings, the hard consonant is NOT doubled — a common source of over-correction.',
    before: 'வீடு + தெரு',
    after: 'வீடுதெரு',
    english: 'veedu + theru → veedutheru',
  },
  {
    name: 'Intervocalic Consonant Insertion',
    description: 'When a nasal-ending word is followed by a vowel, an intervocalic consonant is inserted to ease pronunciation.',
    before: 'மரம் + இலை',
    after: 'மரத்திலை',
    english: 'maram + ilai → marathilai',
  },
];

const errorTable = [
  { wrong: 'மரம்இலை', correct: 'மரத்திலை', rule: 'Intervocalic insertion' },
  { wrong: 'கைஅடி', correct: 'கையடி', rule: 'Y-glide insertion' },
  { wrong: 'பூஅழகு', correct: 'பூவழகு', rule: 'V-glide insertion' },
  { wrong: 'நாடுகதை', correct: 'நாட்டுக்கதை', rule: 'Hard consonant doubling' },
  { wrong: 'வீட்டுதெரு', correct: 'வீட்டுத்தெரு', rule: 'Hard consonant doubling' },
  { wrong: 'கடிதத்தை படிக்கவும்', correct: 'கடிதத்தைப் படிக்கவும்', rule: 'Sandhi before consonant' },
];

export default function SandhiRulesPage() {
  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Hero */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-600 border border-teal-200 mb-4 uppercase tracking-wide">
              Sandhi Rules
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tamil Sandhi Rules — புணர்ச்சி விதிகள்
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Sandhi (punarchi) rules govern how Tamil words join together. Master these 5 rule types
              and eliminate the most common errors in formal Tamil writing.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['Y-glide', 'V-glide', 'Consonant Doubling', 'Vowel Sandhi', 'Punarchi'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
              ))}
            </div>
          </div>

          {/* What is sandhi */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              What is Sandhi in Tamil?
            </h2>
            <div className="space-y-3 text-gray-600 leading-relaxed text-[15px]">
              <p>
                Sandhi (புணர்ச்சி, pronounced <em>punarchi</em>) is the set of phonological rules that
                govern how Tamil words combine at their boundaries. When two words are placed next to each
                other, the sounds at the junction often change — letters are added, dropped, or transformed.
              </p>
              <p>
                These changes follow strict rules codified in classical Tamil grammar (தொல்காப்பியம்).
                Sandhi errors are the #1 mistake in formal Tamil writing because the spoken form sounds
                natural even when the written form is wrong — making them hard to self-detect.
              </p>
            </div>
          </section>

          {/* 5 rule types */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
              5 Key Sandhi Rule Types
            </h2>
            <div className="space-y-5">
              {rules.map((r, i) => (
                <div key={i} className="p-5 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }}>{i + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{r.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-red-400 font-semibold mb-1">Before</p>
                      <p className="font-tamil font-medium text-gray-800">{r.before}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-teal-100">
                      <p className="text-xs text-teal-600 font-semibold mb-1">After</p>
                      <p className="font-tamil font-medium text-teal-700">{r.after}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-1">Phonetic</p>
                      <p className="font-mono text-gray-500 text-xs">{r.english}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Error table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
              Common Sandhi Errors at a Glance
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left p-3 font-semibold text-red-400">Wrong</th>
                    <th className="text-left p-3 font-semibold text-teal-600">Correct</th>
                    <th className="text-left p-3 font-semibold text-gray-400">Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {errorTable.map((e, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-tamil text-red-500">{e.wrong}</td>
                      <td className="p-3 font-tamil text-teal-700 font-medium">{e.correct}</td>
                      <td className="p-3 text-gray-400 text-xs">{e.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Internal links */}
          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/tamil-grammar-checker" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Related guide</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Full Tamil Grammar Guide →</p>
            </Link>
            <Link href="/tanglish-to-tamil" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Related tool</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Tanglish to Tamil Converter →</p>
            </Link>
          </div>

          {/* CTA */}
          <div className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(0,212,180,0.08),rgba(124,106,247,0.08))', border: '1px solid rgba(0,212,180,0.2)' }}>
            <p className="text-gray-800 font-semibold mb-2">Check sandhi errors automatically</p>
            <p className="text-gray-500 text-sm mb-5">Paste your Tamil text and the AI flags every sandhi mistake with an explanation — free, no signup.</p>
            <Link
              href="/tool"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 16px rgba(0,212,180,0.25)' }}
            >
              Check Sandhi Rules Free →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
