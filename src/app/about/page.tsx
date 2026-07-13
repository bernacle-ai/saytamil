import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/home/NavBar';
import { Footer } from '@/components/home/Footer';

export const metadata: Metadata = {
  title: 'About SayTamil — Free AI Tamil Grammar Checker Built in Chennai',
  description: 'SayTamil is a free AI-powered Tamil grammar and spell checker. Built by an ML engineer in Chennai to help students, writers, and businesses write correct Tamil.',
  alternates: { canonical: 'https://www.saytamil.com/about' },
  openGraph: {
    title: 'About SayTamil — Free AI Tamil Grammar Checker',
    description: 'Built by an ML engineer in Chennai to make correct Tamil writing accessible to everyone.',
    url: 'https://www.saytamil.com/about',
    type: 'website',
  },
};

const features = [
  { title: 'Grammar Checking', desc: 'Catches verb form errors, subject-verb agreement issues, and case ending mistakes in formal Tamil.' },
  { title: 'Sandhi Rules', desc: 'Automatically detects and corrects word boundary errors (புணர்ச்சி) — the most common mistake in written Tamil.' },
  { title: 'Spell Checking', desc: 'Identifies confusion between similar-sounding letters: ல/ள, ன/ண, ழ/ல, ர/ற.' },
  { title: 'Tanglish Input', desc: 'Type Tamil phonetically in English letters — the tool converts to Tamil script before checking.' },
  { title: 'Explanations in Tamil', desc: 'Every correction comes with a reason written in Tamil, so you learn the rule — not just the fix.' },
  { title: 'No Signup Needed', desc: 'Free tier gives 10 checks/day with no account required. Start immediately.' },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-600 border border-teal-200 mb-4 uppercase tracking-wide">
              About
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About SayTamil</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              A free AI-powered Tamil grammar checker built to make correct Tamil writing accessible to everyone.
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Why We Built This</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
              <p>
                Tamil is one of the world&apos;s oldest classical languages — over 2,000 years of continuous literary
                tradition. Yet most digital writing tools treat it as an afterthought. Spell checkers miss Tamil-specific
                errors. Grammar tools don&apos;t understand sandhi rules. And explanations, when they exist, are in English
                — not Tamil.
              </p>
              <p>
                SayTamil was built by an ML engineer in Chennai to fix that. The goal is simple: give Tamil speakers
                the same quality of AI writing assistance that English speakers take for granted — without needing a
                grammar textbook or a human editor.
              </p>
              <p>
                The tool is strict about what it flags. It only corrects real grammatical errors — never style
                preferences. And every correction is explained in Tamil, so users learn the underlying rule rather
                than just copying a fix.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">What SayTamil Does</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-semibold text-gray-800 text-sm mb-1.5">
                    <span className="text-teal-500 mr-1.5">✓</span>{f.title}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Who Uses SayTamil</h2>
            <div className="space-y-3">
              {[
                { group: 'Students', desc: 'Tamil Nadu school and college students writing essays, assignments, and exam answers in formal Tamil.' },
                { group: 'Journalists & Writers', desc: 'Tamil bloggers, journalists, and content creators who need fast grammar verification before publishing.' },
                { group: 'Businesses', desc: 'Companies writing Tamil communications, marketing copy, and official letters who need professional-quality Tamil.' },
                { group: 'Tamil Diaspora', desc: 'Tamil speakers in Singapore, Malaysia, UK, USA, and Canada who want to maintain writing accuracy in their heritage language.' },
              ].map((u, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-teal-400 mt-2" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{u.group}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{u.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/#how-it-works" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">See it work</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Live Demo →</p>
            </Link>
            <Link href="/tamil-grammar-checker" className="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors group">
              <p className="text-xs text-gray-400 mb-1">Learn</p>
              <p className="font-semibold text-gray-800 group-hover:text-teal-700 text-sm">Tamil Grammar Guide →</p>
            </Link>
          </div>

          <div className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(0,212,180,0.08),rgba(124,106,247,0.08))', border: '1px solid rgba(0,212,180,0.2)' }}>
            <p className="text-gray-800 font-semibold mb-2">Try it free — no signup needed</p>
            <p className="text-gray-500 text-sm mb-5">10 grammar checks per day, free forever.</p>
            <Link href="/tool"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 16px rgba(0,212,180,0.25)' }}>
              Try the Free Tamil Grammar Checker →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
