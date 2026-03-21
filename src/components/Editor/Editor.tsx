'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/contexts/ToastContext';
import type { Suggestion, AnalysisResult } from '@/lib/gemini';
import { SuggestionCard } from './SuggestionCard';
import { TransliterationDropdown } from './TransliterationDropdown';
import { transliterateLastWord, shouldShowSuggestions, TransliterationOption } from '@/lib/transliteration';

export function Editor({ theme = 'dark', onOpenSettings, globalFontSize }: { theme?: 'dark' | 'light'; onOpenSettings?: () => void; globalFontSize?: number }) {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTextStyleMenu, setShowTextStyleMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tamilMode, setTamilMode] = useState(true);
  const [fontSize, setFontSize] = useState(globalFontSize || 16);
  const [chatTitle, setChatTitle] = useState('Untitled Draft');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);
  // Undo history for accepted suggestions
  const [contentHistory, setContentHistory] = useState<string[]>([]);

  // Transliteration states
  const [transliterationOptions, setTransliterationOptions] = useState<TransliterationOption[]>([]);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isTransliterating, setIsTransliterating] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentChatId, addMessage, currentChat, renameChat } = useChat();
  const { showToast } = useToast();

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim()).length;

  // Auto-name chat intelligently (like GPT/Gemini) — only from complete words
  useEffect(() => {
    if (!currentChatId || !content.trim()) return;
    // Only auto-name while still on a default/untitled title
    const isDefaultTitle = !currentChat?.title ||
      currentChat.title === 'Untitled Draft' ||
      /^Chat\s/.test(currentChat.title);
    if (!isDefaultTitle) return;

    const allWords = content.trim().split(/\s+/);

    // Drop the last word if it's still English (being typed / not yet transliterated)
    const lastWord = allWords[allWords.length - 1];
    const completeWords = /[a-zA-Z]/.test(lastWord)
      ? allWords.slice(0, -1)
      : allWords;

    // Need at least 3 complete words to form a meaningful title
    if (completeWords.length < 3) return;

    // Take first 5 complete words, strip any leftover English fragments
    const titleWords = completeWords
      .slice(0, 5)
      .filter(w => !/^[a-zA-Z]+$/.test(w)); // skip pure-English words

    if (titleWords.length < 2) return;

    const raw = titleWords.join(' ');
    const smartTitle = raw.length > 40 ? raw.substring(0, 37) + '…' : raw;

    if (smartTitle && smartTitle !== currentChat?.title) {
      setChatTitle(smartTitle);
      renameChat(currentChatId, smartTitle);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // Sync font size from global settings
  useEffect(() => {
    if (globalFontSize) setFontSize(globalFontSize);
  }, [globalFontSize]);

  // Update title when chat changes
  useEffect(() => {
    if (currentChat) setChatTitle(currentChat.title);
  }, [currentChat]);

  // Fetch usage on mount
  useEffect(() => {
    fetch('/api/usage')
      .then(r => r.json())
      .then(data => { if (data.used !== undefined) setUsage(data); })
      .catch(() => {});
  }, []);

  // Get exact cursor pixel position using a mirror div
  const getCursorPixelPosition = (textarea: HTMLTextAreaElement): { top: number; left: number } => {
    const mirror = document.createElement('div');
    const style = window.getComputedStyle(textarea);

    // Copy all relevant styles
    ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
     'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
     'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
     'width', 'wordWrap', 'whiteSpace', 'overflowWrap'].forEach(prop => {
      mirror.style[prop as any] = style[prop as any];
    });

    mirror.style.position = 'absolute';
    mirror.style.visibility = 'hidden';
    mirror.style.overflow = 'hidden';
    mirror.style.height = 'auto';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordWrap = 'break-word';

    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);

    mirror.textContent = textBefore;

    // Add a span at cursor position
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    mirror.appendChild(cursor);

    document.body.appendChild(mirror);

    const mirrorRect = mirror.getBoundingClientRect();
    const cursorRect = cursor.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();

    document.body.removeChild(mirror);

    // Position relative to textarea, accounting for scroll
    const top = textareaRect.top + (cursorRect.top - mirrorRect.top) - textarea.scrollTop + cursor.offsetHeight + 4;
    const left = textareaRect.left + (cursorRect.left - mirrorRect.left);

    // Keep within viewport
    const dropdownWidth = 260;
    const clampedLeft = Math.min(left, window.innerWidth - dropdownWidth - 16);

    return { top, left: Math.max(8, clampedLeft) };
  };

  // Handle transliteration on text change
  const translitSeqRef = useRef(0);
  useEffect(() => {
    const seq = ++translitSeqRef.current;

    const handleTransliteration = async () => {
      if (!tamilMode || !shouldShowSuggestions(content)) {
        setShowTransliteration(false);
        return;
      }

      setIsTransliterating(true);
      const result = await transliterateLastWord(content);

      // Discard if a newer request has started
      if (seq !== translitSeqRef.current) return;

      if (result.suggestions.length > 0) {
        setTransliterationOptions(result.suggestions);
        
        const textarea = textareaRef.current;
        if (textarea) {
          const pos = getCursorPixelPosition(textarea);
          setDropdownPosition(pos);
          setShowTransliteration(true);
        }
      } else {
        setShowTransliteration(false);
      }
      
      setIsTransliterating(false);
    };

    const debounceTimer = setTimeout(handleTransliteration, 800);
    return () => {
      clearTimeout(debounceTimer);
      translitSeqRef.current++; // invalidate any in-flight call
    };
  }, [content, tamilMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAnalyze();
        } else if (e.key === 's') {
          e.preventDefault();
          handleSave();
        } else if (e.key === 'e') {
          e.preventDefault();
          setShowExportMenu(!showExportMenu);
        } else if (e.key === 'z' && contentHistory.length > 0) {
          // Only intercept if we have suggestion-based history to undo
          const activeEl = document.activeElement;
          if (activeEl === textareaRef.current) return; // let textarea handle its own undo
          e.preventDefault();
          const prev = contentHistory[contentHistory.length - 1];
          setContentHistory(h => h.slice(0, -1));
          setContent(prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, showExportMenu, contentHistory]);

  const handleSave = () => {
    localStorage.setItem(`draft_${currentChatId}`, content);
    showToast('Draft saved', 'success');
  };

  // Copy clean text — strips markdown symbols
  const handleCleanCopy = () => {
    const clean = content
      .replace(/\*\*(.*?)\*\*/g, '$1')   // bold
      .replace(/\*(.*?)\*/g, '$1')        // italic
      .replace(/~~(.*?)~~/g, '$1')        // strikethrough
      .replace(/^#{1,6}\s+/gm, '')        // headings
      .replace(/^[-*]\s+/gm, '')          // list bullets
      .replace(/^>\s+/gm, '')             // blockquotes
      .trim();
    navigator.clipboard.writeText(clean).then(() => {
      showToast('Copied clean text', 'success');
    });
  };

  const handleExport = (format: 'txt' | 'pdf') => {
    if (!content.trim()) {
      showToast('Nothing to export', 'warning');
      return;
    }

    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tamil-chat-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported as TXT', 'success');
    } else {
      showToast('PDF export coming soon', 'info');
    }
    setShowExportMenu(false);
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    // If there's selected text, wrap it
    if (selectedText) {
      const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
      setContent(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      }, 0);
    } else {
      // If no selection, just insert the markers
      const newText = content.substring(0, start) + before + after + content.substring(end);
      setContent(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length);
      }, 0);
    }
  };

  const clearContent = () => {
    if (confirm('Clear all content?')) {
      setContent('');
      showToast('Content cleared', 'success');
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      showToast('Please enter some text', 'warning');
      return;
    }

    // Check usage limit before calling API
    try {
      const usageRes = await fetch('/api/usage');
      if (usageRes.ok) {
        const usage = await usageRes.json();
        if (usage.remaining <= 0) {
          showToast(`Daily limit reached (${usage.limit}/day on free plan). Try again tomorrow.`, 'error');
          return;
        }
      }
    } catch {
      // If usage check fails, proceed anyway
    }

    setIsAnalyzing(true);
    setShowSuggestions(true);
    addMessage({ text: content, sender: 'user' });

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Analysis failed (${res.status})`);
      }
      const result: AnalysisResult = await res.json();
      setAnalysisResult(result);

      // Increment usage and refresh counter
      try {
        const usageRes = await fetch('/api/usage', { method: 'POST' });
        if (usageRes.ok) {
          const updated = await usageRes.json();
          setUsage(updated);
        }
      } catch { /* non-critical */ }

      addMessage({
        text: `Analysis Complete!\n\nScore: ${result.score}/100\n\n${result.summary}\n\n${result.suggestions.length > 0 ? `Found ${result.suggestions.length} suggestions.` : 'No issues found!'}`,
        sender: 'assistant',
        isLoading: false,
      });

      if (result.suggestions.length > 0) {
        showToast(`Found ${result.suggestions.length} suggestions!`, 'success');
      } else {
        showToast('Text looks great!', 'success');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to analyze text';
      addMessage({ text: `❌ ${errorMsg}`, sender: 'assistant', isLoading: false });
      showToast(errorMsg, 'error');
      setShowSuggestions(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    // Save current content to history before applying
    setContentHistory(h => [...h, content]);
    const newContent = content.replace(suggestion.original, suggestion.suggestion);
    setContent(newContent);
    
    if (analysisResult) {
      const updatedSuggestions = analysisResult.suggestions.filter(s => s.id !== suggestion.id);
      setAnalysisResult({ ...analysisResult, suggestions: updatedSuggestions });
    }
    showToast('Suggestion applied', 'success');
  };

  const handleIgnoreSuggestion = (id: string) => {
    if (analysisResult) {
      const updatedSuggestions = analysisResult.suggestions.filter(s => s.id !== id);
      setAnalysisResult({
        ...analysisResult,
        suggestions: updatedSuggestions,
      });
    }
    showToast('Suggestion ignored', 'info');
  };

  const handleAcceptAll = () => {
    if (!analysisResult) return;
    setContentHistory(h => [...h, content]);
    let newContent = content;
    analysisResult.suggestions.forEach(suggestion => {
      newContent = newContent.replace(suggestion.original, suggestion.suggestion);
    });
    setContent(newContent);
    setAnalysisResult({ ...analysisResult, suggestions: [] });
    showToast('All suggestions applied', 'success');
  };

  const handleTransliterationSelect = (tamilText: string) => {
    const words = content.split(/\s+/);
    if (words.length > 0) {
      words[words.length - 1] = tamilText;
      setContent(words.join(' ') + ' ');
    }
    setShowTransliteration(false);
    
    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <div className="flex h-full gap-4 p-6">
      {/* Transliteration Dropdown */}
      {showTransliteration && (
        <TransliterationDropdown
          options={transliterationOptions}
          onSelect={handleTransliterationSelect}
          onClose={() => setShowTransliteration(false)}
          position={dropdownPosition}
          theme={theme}
        />
      )}
      
      <div className={`flex-1 flex flex-col ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden shadow-2xl`}>

        {/* Unified Toolbar */}
        <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'} flex items-center gap-0.5 flex-wrap`}>

          {/* Undo */}
          <button
            onClick={() => {
              if (contentHistory.length > 0) {
                const prev = contentHistory[contentHistory.length - 1];
                setContentHistory(h => h.slice(0, -1));
                setContent(prev);
              }
            }}
            disabled={contentHistory.length === 0}
            title="Undo"
            className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6" />
            </svg>
          </button>
          <button title="Redo" disabled className={`p-2 rounded-lg opacity-30 cursor-not-allowed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6M21 10l-6-6" />
            </svg>
          </button>

          <div className={`w-px h-5 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`} />

          {/* Text Style dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowTextStyleMenu(!showTextStyleMenu); setShowAlignMenu(false); setShowExportMenu(false); }}
              title="Text style"
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors text-sm font-semibold ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              T
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTextStyleMenu && (
              <div className={`absolute left-0 top-full mt-1 w-40 rounded-xl shadow-xl border py-1 z-20 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                {[
                  { label: 'Heading 1', prefix: '# ' },
                  { label: 'Heading 2', prefix: '## ' },
                  { label: 'Heading 3', prefix: '### ' },
                  { label: 'Normal text', prefix: '' },
                ].map(({ label, prefix }) => (
                  <button key={label} onClick={() => { insertText(prefix, ''); setShowTextStyleMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`w-px h-5 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`} />

          {/* B I U S */}
          <button onClick={() => insertText('**', '**')} title="Bold"
            className={`p-2 rounded-lg transition-colors font-bold text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-teal-400' : 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'}`}>B</button>
          <button onClick={() => insertText('*', '*')} title="Italic"
            className={`p-2 rounded-lg transition-colors italic text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-teal-400' : 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'}`}>I</button>
          <button onClick={() => insertText('<u>', '</u>')} title="Underline"
            className={`p-2 rounded-lg transition-colors underline text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-teal-400' : 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'}`}>U</button>
          <button onClick={() => insertText('~~', '~~')} title="Strikethrough"
            className={`p-2 rounded-lg transition-colors line-through text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-teal-400' : 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'}`}>S</button>

          <div className={`w-px h-5 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`} />

          {/* Bullet / Numbered list */}
          <button onClick={() => insertText('- ', '')} title="Bullet list"
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </button>
          <button onClick={() => insertText('1. ', '')} title="Numbered list"
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
          </button>

          {/* Align dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowAlignMenu(!showAlignMenu); setShowTextStyleMenu(false); setShowExportMenu(false); }}
              title="Alignment"
              className={`flex items-center gap-0.5 p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h8" />
              </svg>
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showAlignMenu && (
              <div className={`absolute left-0 top-full mt-1 w-32 rounded-xl shadow-xl border py-1 z-20 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                {['Left', 'Center', 'Right'].map(align => (
                  <button key={align} onClick={() => setShowAlignMenu(false)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    {align}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`w-px h-5 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`} />

          {/* Link */}
          <button
            onClick={() => { const url = prompt('Enter URL:'); if (url) insertText('[', `](${url})`); }}
            title="Insert link"
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-teal-400' : 'text-gray-500 hover:bg-gray-100 hover:text-teal-600'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>

          {/* Search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            title="Search in text"
            className={`p-2 rounded-lg transition-colors ${showSearch
              ? (theme === 'dark' ? 'bg-teal-900/40 text-teal-400' : 'bg-teal-50 text-teal-600')
              : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900')}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Save / Copy / Export / Clear */}
          <button onClick={handleSave} title="Save (Ctrl+S)"
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-teal-400' : 'text-gray-500 hover:bg-gray-100 hover:text-teal-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
          <button onClick={handleCleanCopy} title="Copy clean text"
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-teal-400' : 'text-gray-500 hover:bg-gray-100 hover:text-teal-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
          <div className="relative">
            <button onClick={() => { setShowExportMenu(!showExportMenu); setShowTextStyleMenu(false); setShowAlignMenu(false); }} title="Export"
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-teal-400' : 'text-gray-500 hover:bg-gray-100 hover:text-teal-600'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            {showExportMenu && (
              <div className={`absolute right-0 top-full mt-1 w-44 rounded-xl shadow-xl border py-1.5 z-20 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <button onClick={() => handleExport('txt')} className={`w-full px-4 py-2 text-left text-sm transition-colors ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>Export as TXT</button>
                <button onClick={() => handleExport('pdf')} className={`w-full px-4 py-2 text-left text-sm transition-colors ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>Export as PDF</button>
              </div>
            )}
          </div>
          <button onClick={clearContent} title="Clear"
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-red-400' : 'text-gray-500 hover:bg-gray-100 hover:text-red-500'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <div className={`w-px h-5 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`} />

          {/* தமிழ் toggle pill */}
          <button
            onClick={() => setTamilMode(!tamilMode)}
            title={tamilMode ? 'Tamil transliteration ON' : 'Tamil transliteration OFF'}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              tamilMode
                ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}
          >
            <span>தமிழ்</span>
            <div className={`w-7 h-4 rounded-full relative transition-colors ${tamilMode ? 'bg-teal-500' : theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-200 ${tamilMode ? 'left-3.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/80' : 'border-gray-200 bg-gray-50'} flex items-center gap-2`}>
            <svg className={`w-4 h-4 flex-shrink-0 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search in text..."
              className={`flex-1 bg-transparent text-sm outline-none ${theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
            {searchQuery && (
              <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                {(content.match(new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length} found
              </span>
            )}
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}
              className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-200 text-gray-500'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="relative flex-1">
          <textarea 
            ref={textareaRef} 
            value={content} 
            onChange={(e) => {
              setContent(e.target.value);
              // Clear analysis when user edits
              if (analysisResult) {
                setAnalysisResult(null);
                setShowSuggestions(false);
              }
            }} 
            placeholder="Start typing in Tamil or English... (Ctrl+Enter to analyze)" 
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }} 
            className={`w-full h-full px-6 py-4 bg-transparent ${theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'} focus:outline-none resize-none`} 
          />
          
          {/* Highlight overlay for suggestions */}
          {analysisResult && analysisResult.suggestions.length > 0 && (
            <div 
              className="absolute top-0 left-0 w-full h-full px-6 py-4 pointer-events-none overflow-hidden whitespace-pre-wrap"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
            >
              {content.split('').map((char, index) => {
                const isHighlighted = analysisResult.suggestions.some(s => {
                  const startIndex = content.indexOf(s.original);
                  const endIndex = startIndex + s.original.length;
                  return index >= startIndex && index < endIndex;
                });
                
                return (
                  <span 
                    key={index}
                    className={isHighlighted ? 'border-b-2 border-red-500' : 'text-transparent'}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{content.length} chars</span>
            <span className={`text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`}>•</span>
            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{wordCount} words</span>
          </div>
          <button onClick={handleAnalyze} disabled={isAnalyzing || !content.trim()} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {isAnalyzing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className={`w-96 flex flex-col rounded-2xl border overflow-hidden shadow-xl ${
        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center gap-3 ${
          theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        }`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-teal-900/60' : 'bg-teal-50'
          }`}>
            {isAnalyzing ? (
              <svg className="w-5 h-5 text-teal-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>
          <span className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            AI Assistant
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Analyzing spinner */}
          {isAnalyzing && (
            <div className={`rounded-2xl p-4 flex items-center gap-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
              <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Checking grammar…</span>
            </div>
          )}

          {/* Results summary card */}
          {!isAnalyzing && showSuggestions && analysisResult && (
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    {analysisResult.suggestions.length > 0
                      ? `${analysisResult.suggestions.length} suggestion${analysisResult.suggestions.length > 1 ? 's' : ''} found`
                      : 'No issues found'}
                  </span>
                </div>
                {analysisResult.suggestions.length > 0 && (
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Accept All
                  </button>
                )}
              </div>
              {/* Usage progress bar */}
              {usage && (
                <>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Daily suggestions used</span>
                    <span className={`font-medium ${usage.remaining === 0 ? 'text-red-500' : theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      {usage.used}/{usage.limit}
                    </span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        usage.remaining === 0 ? 'bg-red-500' :
                        usage.used / usage.limit > 0.7 ? 'bg-amber-500' : 'bg-gradient-to-r from-teal-500 to-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Limit reached card */}
          {usage && usage.remaining === 0 && (
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-teal-900/20 border border-teal-700/40' : 'bg-teal-50 border border-teal-200'}`}>
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-teal-800/60' : 'bg-teal-100'}`}>
                  <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-semibold mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    Daily limit reached
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Resets at midnight
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Suggestion cards */}
          {!isAnalyzing && showSuggestions && analysisResult && analysisResult.suggestions.length > 0 && (
            <div className="space-y-3">
              {analysisResult.suggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onAccept={handleAcceptSuggestion}
                  onIgnore={handleIgnoreSuggestion}
                  theme={theme}
                />
              ))}
            </div>
          )}

          {/* All clear */}
          {!isAnalyzing && showSuggestions && analysisResult && analysisResult.suggestions.length === 0 && (
            <div className={`rounded-2xl p-5 text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className={`font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Looks great!</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{analysisResult.summary}</p>
            </div>
          )}

          {/* Idle */}
          {!isAnalyzing && !showSuggestions && (
            <div className={`rounded-2xl p-5 text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${theme === 'dark' ? 'bg-teal-900/50' : 'bg-teal-50'}`}>
                <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className={`font-semibold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Ready to check</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Type your Tamil text and press Analyze
              </p>
              <div className={`mt-3 px-3 py-2 rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                Ctrl+Enter to analyze quickly
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}