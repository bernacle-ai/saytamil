'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { trackSignupClick } from '@/lib/analytics/events';

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthed = status === 'authenticated' && !!session;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/saytamil-logo.png" alt="SayTamil Tamil Grammar Checker logo" width={32} height={32} className="rounded-xl" />
          <span className="text-lg font-bold text-gray-900">SayTamil</span>
          <span className="hidden sm:inline px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-600 border border-teal-200">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {[['#features','Features'],['#pricing','Pricing'],['#how-it-works','How it Works'],['#faq','FAQ'],['/contact','Contact'],['/tamil-grammar-checker','Tamil Grammar'],['/tanglish-to-tamil','Tanglish']].map(([href, label]) => (
            <Link key={label} href={href} className="text-sm text-gray-500 hover:text-teal-600 transition-colors font-medium">{label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthed ? (
            <Link href="/tool" className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 16px rgba(0,212,180,0.30)' }}>
              Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/tool" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Login</Link>
              <Link href="/tool" className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 16px rgba(0,212,180,0.30)' }}
                onClick={() => trackSignupClick('nav')}>
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-lg">
          {[['#features','Features'],['#pricing','Pricing'],['#how-it-works','How it Works'],['#faq','FAQ'],['/contact','Contact'],['/tamil-grammar-checker','Tamil Grammar'],['/tanglish-to-tamil','Tanglish']].map(([href, label]) => (
            <Link key={label} href={href} className="text-sm text-gray-600 hover:text-teal-600 font-medium" onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <hr className="border-gray-100" />
          {isAuthed ? (
            <Link href="/tool" className="text-sm font-semibold px-4 py-2.5 rounded-xl text-white text-center"
              style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }} onClick={() => setMenuOpen(false)}>
              Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/tool" className="text-sm text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/tool" className="text-sm font-semibold px-4 py-2.5 rounded-xl text-white text-center"
                style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }} onClick={() => setMenuOpen(false)}>
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
