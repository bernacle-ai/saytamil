'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TransliterationDropdown } from '@/components/Editor/TransliterationDropdown';
import { transliterateLastWord, shouldShowSuggestions, type TransliterationOption } from '@/lib/transliteration';
import type { AnalysisResult, Suggestion } from '@/lib/gemini';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('demo_session');
  if (!id) { id = `demo_${Date.now()}_${Math.random().toString(36).slice(2)}`; sessionStorage.setItem('demo_session', id); }
  return id;
}

export function HeroSection() {
  const [content, setContent] = useState('');
  const [tamilMode, setTamilMode] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(3);
  const [limitHit, setLimitHit] = useState(false);
  const [contentHistory, setContentHistory] = useState<string[]>([]);
  const [transOptions, setTransOptions] = useState<TransliterationOption[]>([]);
  const [showTrans, setShowTrans] = useState(false);
  const [transPos, setTransPos] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const getCursorPos = (textarea: HTMLTextAreaElement) => {
    const mirror = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','paddingTop','paddingRight','paddingBottom','paddingLeft','width','wordWrap','whiteSpace','overflowWrap'].forEach(p => { mirror.style[p as any] = style[p as any]; });
    mirror.style.cssText += ';position:absolute;visibility:hidden;overflow:hidden;height:auto;white-space:pre-wrap;word-wrap:break-word;';
    mirror.textContent = textarea.value.substring(0, textarea.selectionStart);
    const cursor = document.createElement('span'); cursor.textContent = '|'; mirror.appendChild(cursor);
    document.body.appendChild(mirror);
    const mRect = mirror.getBoundingClientRect(), cRect = cursor.getBoundingClientRect(), tRect = textarea.getBoundingClientRect();
    document.body.removeChild(mirror);
    return { top: tRect.top + (cRect.top - mRect.top) - textarea.scrollTop + cursor.offsetHeight + 4, left: Math.max(8, Math.min(cRect.left - mRect.left + tRect.left, window.innerWidth - 276)) };
  };

  useEffect(() => {
    if (!tamilMode || !shouldShowSuggestions(content)) { setShowTrans(false); return; }
    const t = setTimeout(async () => {
      const res = await transliterateLastWord(content);
      if (res.suggestions.length > 0 && textareaRef.current) { setTransOptions(res.suggestions); setTransPos(getCursorPos(textareaRef.current)); setShowTrans(true); }
      else setShowTrans(false);
    }, 600);
    return () => clearTimeout(t);
  }, [content, tamilMode]);

  const handleTransSelect = (tamil: string) => {
    const words = content.split(/\s+/); words[words.length - 1] = tamil;
    setContent(words.join(' ') + ' '); setShowTrans(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const insertText = (before: string, after = '') => {
    const ta = textareaRef.current; if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd, sel = content.substring(s, e);
    setContent(content.substring(0, s) + before + sel + after + content.substring(e));
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + sel.length); }, 0);
  };

  const handleAnalyze = useCallback(async () => {
    if (!content.trim() || isAnalyzing || limitHit) return;
    setIsAnalyzing(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/demo/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: content, sessionId: getSessionId() }) });
      const data = await res.json();
      if (res.status === 429) { setLimitHit(true); setRemaining(0); setError(data.message); return; }
      if (!res.ok) { setError(data.error || 'Analysis failed'); return; }
      setResult(data); setRemaining(data.remaining ?? 0);
      if (data.remaining === 0) setLimitHit(true);
    } catch { setError('Network error. Please try again.'); }
    finally { setIsAnalyzing(false); }
  }, [content, isAnalyzing, limitHit]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleAnalyze(); } };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [handleAnalyze]);

  const handleAccept = (s: Suggestion) => {
    setContentHistory(h => [...h, content]);
    setContent(c => c.replace(s.original, s.suggestion));
    if (result) setResult({ ...result, suggestions: result.suggestions.filter(x => x.id !== s.id) });
  };
  const handleIgnore = (id: string) => { if (result) setResult({ ...result, suggestions: result.suggestions.filter(x => x.id !== id) }); };
  const handleAcceptAll = () => {
    if (!result) return;
    setContentHistory(h => [...h, content]);
    let c = content; result.suggestions.forEach(s => { c = c.replace(s.original, s.suggestion); });
    setContent(c); setResult({ ...result, suggestions: [] });
  };

  return (
    <section className="pt-16 bg-white">
      {/* Hero text */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6 bg-teal-50 border border-teal-200 text-teal-700">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          AI-powered Tamil writing assistant
        </div>

        <h1 className="font-tamil text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3">
          தமிழ் இலக்கணம் சரியாக எழுதுங்கள்
        </h1>
        <p className="text-2xl sm:text-3xl font-bold mb-5"
          style={{ background: 'linear-gradient(90deg,#00d4b4,#7c6af7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Write Perfect Tamil Grammar — Instantly
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Free AI-powered Tamil grammar checker. Catches verb form errors, sandhi mistakes, spelling issues — and explains every correction in plain language.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/tool" className="font-semibold px-8 py-3 rounded-xl text-lg text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 24px rgba(0,212,180,0.35)' }}>
            Get Full Access — Free
          </Link>
          <a href="#how-it-works" className="border border-gray-200 hover:border-teal-300 text-gray-600 hover:text-teal-600 font-semibold px-8 py-3 rounded-xl text-lg transition-colors bg-white">
            See How It Works ↓
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          {['10,000+ writers use it','No account needed','100% private'].map(t => (
            <span key={t} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
              <span className="text-teal-500">✓</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* Full embedded tool */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
          {/* Tool header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-800">Tamil Grammar Checker — Live Demo</p>
              <p className="text-xs text-gray-400 mt-0.5">Type in Tamil or Tanglish — transliteration is automatic</p>
            </div>
            <div className="flex items-center gap-3">
              {!limitHit && (
                <span className="text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
                  {remaining} free check{remaining !== 1 ? 's' : ''} left
                </span>
              )}
              <Link href="/tool" className="text-xs font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }}>
                Sign up for unlimited →
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row min-h-[480px]">
            {/* Editor pane */}
            <div className="flex-1 flex flex-col border-r border-gray-100">
              {/* Toolbar */}
              <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-0.5 flex-wrap bg-white">
                <button onClick={() => { if (contentHistory.length) { setContent(contentHistory[contentHistory.length-1]); setContentHistory(h => h.slice(0,-1)); } }}
                  disabled={!contentHistory.length} title="Undo"
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6" /></svg>
                </button>
                <div className="w-px h-5 mx-1 bg-gray-200" />
                <button onClick={() => insertText('**','**')} title="Bold" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-teal-600 font-bold text-sm transition-colors">B</button>
                <button onClick={() => insertText('*','*')} title="Italic" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-teal-600 italic text-sm transition-colors">I</button>
                <button onClick={() => insertText('- ','')} title="Bullet list" className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                </button>
                <div className="w-px h-5 mx-1 bg-gray-200" />
                <button onClick={() => navigator.clipboard.writeText(content)} title="Copy" className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-teal-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </button>
                <button onClick={() => setContent('')} title="Clear" className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <div className="flex-1" />
                <span className="text-xs text-gray-300 mr-2">{wordCount} words</span>
                <button onClick={() => setTamilMode(m => !m)} title={tamilMode ? 'Tanglish ON' : 'Tanglish OFF'}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${tamilMode ? 'bg-teal-50 border-teal-200 text-teal-600' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                  <span className="font-tamil">தமிழ்</span>
                  <div className={`w-7 h-4 rounded-full relative transition-colors ${tamilMode ? 'bg-teal-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-200 ${tamilMode ? 'left-3.5' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>

              {/* Textarea */}
              <div className="relative flex-1 bg-white">
                {showTrans && <TransliterationDropdown options={transOptions} onSelect={handleTransSelect} onClose={() => setShowTrans(false)} position={transPos} theme="light" />}
                <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)}
                  placeholder="Write or paste your Tamil text here. Type in English (Tanglish) for automatic transliteration — e.g. type 'vanakkam' to get 'வணக்கம்'"
                  className="font-tamil w-full h-full min-h-[360px] px-6 py-5 text-gray-800 text-base resize-none focus:outline-none leading-relaxed bg-transparent placeholder-gray-300"
                  style={{ fontFamily: 'var(--font-tamil), Noto Sans Tamil, sans-serif' }} />
              </div>

              {/* Analyze bar */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
                {limitHit ? (
                  <div className="flex-1 flex items-center gap-3">
                    <p className="text-sm text-amber-600 flex-1">Demo limit reached. Sign up for unlimited checks.</p>
                    <Link href="/tool" className="font-semibold px-5 py-2 rounded-lg text-sm text-white hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }}>Sign Up Free →</Link>
                  </div>
                ) : (
                  <>
                    <button onClick={handleAnalyze} disabled={isAnalyzing || !content.trim()}
                      className="flex-1 font-semibold py-2.5 rounded-xl transition-all text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                      style={!isAnalyzing && content.trim() ? { background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 16px rgba(0,212,180,0.25)' } : { background: '#e5e7eb', color: '#9ca3af' }}>
                      {isAnalyzing ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Analyzing...
                        </span>
                      ) : `Check Grammar (${remaining} left)`}
                    </button>
                    <span className="text-xs text-gray-300 hidden sm:block">Ctrl+Enter</span>
                  </>
                )}
              </div>
            </div>

            {/* AI Suggestions pane */}
            <div className="w-full lg:w-80 flex flex-col bg-white border-l border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-sm font-semibold text-gray-800">AI Assistant</span>
                {result && result.suggestions.length > 0 && (
                  <span className="ml-auto text-xs bg-teal-50 text-teal-600 border border-teal-200 font-semibold px-2 py-0.5 rounded-full">
                    {result.suggestions.length}
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {error && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                    {error}
                    {limitHit && <Link href="/tool" className="block mt-2 text-teal-600 font-semibold hover:underline">Sign up for unlimited →</Link>}
                  </div>
                )}

                {!result && !error && !isAnalyzing && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-sm text-gray-400">Grammar and style suggestions will show up here as you write.</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
                    <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24" style={{ color: '#00d4b4' }}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    <p className="text-sm text-gray-400">Analyzing your Tamil text...</p>
                  </div>
                )}

                {result && !isAnalyzing && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Grammar Score</span>
                        <span className={`text-lg font-bold ${result.score >= 80 ? 'text-teal-600' : result.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{result.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${result.score}%`, background: result.score >= 80 ? 'linear-gradient(90deg,#00d4b4,#7c6af7)' : result.score >= 60 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <p className="font-tamil text-xs text-gray-500 mt-2">{result.summary}</p>
                    </div>

                    {result.suggestions.length === 0 ? (
                      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
                        <p className="text-teal-700 font-semibold text-sm">✓ No grammar errors found</p>
                        <p className="font-tamil text-xs text-teal-600 mt-1">உங்கள் தமிழ் சரியாக உள்ளது!</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{result.suggestions.length} Suggestion{result.suggestions.length !== 1 ? 's' : ''}</p>
                          <button onClick={handleAcceptAll} className="text-xs text-teal-600 hover:text-teal-700 font-semibold">Accept all</button>
                        </div>
                        {result.suggestions.map(s => (
                          <div key={s.id} className="border border-gray-100 rounded-xl p-4 space-y-2 bg-white shadow-sm">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.type === 'grammar' ? 'bg-red-50 text-red-500' : s.type === 'spelling' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{s.type}</span>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-tamil line-through text-red-400">{s.original}</span>
                              <span className="text-gray-300">→</span>
                              <span className="font-tamil text-teal-600 font-medium">{s.suggestion}</span>
                            </div>
                            <p className="font-tamil text-xs text-gray-500 leading-relaxed">{s.reason}</p>
                            <div className="flex gap-2 pt-1">
                              <button onClick={() => handleAccept(s)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-all"
                                style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }}>Accept</button>
                              <button onClick={() => handleIgnore(s.id)} className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-semibold transition-colors">Ignore</button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    <div className="pt-2 border-t border-gray-100 text-center">
                      <p className="text-xs text-gray-400 mb-2">Want unlimited checks + chat history?</p>
                      <Link href="/tool" className="block w-full font-semibold py-2 rounded-lg text-sm text-white hover:opacity-90 transition-all"
                        style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)' }}>Sign Up Free →</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
