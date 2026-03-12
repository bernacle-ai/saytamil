'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/contexts/ToastContext';
import { analyzeText, Suggestion, AnalysisResult } from '@/lib/gemini';
import { SuggestionCard } from './SuggestionCard';
import { TransliterationDropdown } from './TransliterationDropdown';
import { transliterateLastWord, shouldShowSuggestions, TransliterationOption } from '@/lib/transliteration';

export function Editor({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [chatTitle, setChatTitle] = useState('Untitled Draft');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Transliteration states
  const [transliterationOptions, setTransliterationOptions] = useState<TransliterationOption[]>([]);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isTransliterating, setIsTransliterating] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentChatId, addMessage, updateMessage, currentMessages, currentChat, renameChat } = useChat();
  const { showToast } = useToast();

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim()).length;

  // Update title when chat changes
  useEffect(() => {
    if (currentChat) {
      setChatTitle(currentChat.title);
    }
  }, [currentChat]);

  // Handle transliteration on text change
  useEffect(() => {
    const handleTransliteration = async () => {
      if (!shouldShowSuggestions(content)) {
        setShowTransliteration(false);
        return;
      }

      setIsTransliterating(true);
      const result = await transliterateLastWord(content);
      
      if (result.suggestions.length > 0) {
        setTransliterationOptions(result.suggestions);
        
        // Calculate dropdown position based on cursor
        const textarea = textareaRef.current;
        if (textarea) {
          const { selectionStart } = textarea;
          const textBeforeCursor = content.substring(0, selectionStart);
          const lines = textBeforeCursor.split('\n');
          const currentLine = lines.length;
          const currentColumn = lines[lines.length - 1].length;
          
          // Approximate position
          const top = textarea.offsetTop + currentLine * fontSize * 1.6 + 60;
          const left = textarea.offsetLeft + Math.min(currentColumn * fontSize * 0.6, 400);
          
          setDropdownPosition({ top, left });
          setShowTransliteration(true);
        }
      } else {
        setShowTransliteration(false);
      }
      
      setIsTransliterating(false);
    };

    const debounceTimer = setTimeout(handleTransliteration, 800); // Increased delay to reduce API calls
    return () => clearTimeout(debounceTimer);
  }, [content, fontSize]);

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
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, showExportMenu]);

  const handleSave = () => {
    localStorage.setItem(`draft_${currentChatId}`, content);
    showToast('Draft saved', 'success');
  };

  // Helper function to get highlighted content with red underlines
  const getHighlightedContent = () => {
    if (!analysisResult || analysisResult.suggestions.length === 0) {
      return content;
    }

    let highlightedText = content;
    const replacements: Array<{ original: string; highlighted: string }> = [];

    analysisResult.suggestions.forEach((suggestion) => {
      const original = suggestion.original;
      const highlighted = `<span style="text-decoration: underline; text-decoration-color: red; text-decoration-thickness: 2px;">${original}</span>`;
      replacements.push({ original, highlighted });
    });

    // Apply replacements
    replacements.forEach(({ original, highlighted }) => {
      highlightedText = highlightedText.replace(original, highlighted);
    });

    return highlightedText;
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

  const handleTitleSave = () => {
    if (chatTitle.trim() && currentChatId) {
      renameChat(currentChatId, chatTitle.trim());
      setIsEditingTitle(false);
      showToast('Chat renamed', 'success');
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setChatTitle(currentChat?.title || 'Untitled Draft');
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

    setIsAnalyzing(true);
    setShowSuggestions(true);

    // Add user message
    addMessage({ text: content, sender: 'user' });

    try {
      // Call Gemini API
      const result = await analyzeText(content);
      setAnalysisResult(result);

      // Add AI response message
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
      
      addMessage({
        text: `❌ Error: ${errorMsg}\n\nPlease check:\n1. Your API key is valid\n2. You have internet connection\n3. The API key is in .env.local file`,
        sender: 'assistant',
        isLoading: false,
      });

      showToast(errorMsg, 'error');
      setShowSuggestions(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    // Replace the original text with the suggestion
    const newContent = content.replace(suggestion.original, suggestion.suggestion);
    setContent(newContent);
    
    // Remove the accepted suggestion from the list
    if (analysisResult) {
      const updatedSuggestions = analysisResult.suggestions.filter(s => s.id !== suggestion.id);
      setAnalysisResult({
        ...analysisResult,
        suggestions: updatedSuggestions,
      });
    }
    
    showToast('Suggestion applied!', 'success');
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
    
    let newContent = content;
    analysisResult.suggestions.forEach(suggestion => {
      newContent = newContent.replace(suggestion.original, suggestion.suggestion);
    });
    
    setContent(newContent);
    setAnalysisResult({ ...analysisResult, suggestions: [] });
    showToast('All suggestions applied!', 'success');
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
        <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'} flex items-center justify-between`}>
          <div className="flex-1">
            {isEditingTitle ? (
              <input
                type="text"
                value={chatTitle}
                onChange={(e) => setChatTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                autoFocus
                className={`text-lg font-semibold ${theme === 'dark' ? 'text-white bg-slate-800' : 'text-gray-900 bg-gray-100'} px-2 py-1 rounded border-2 border-cyan-500 focus:outline-none`}
              />
            ) : (
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{chatTitle}</h2>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className={`p-1 ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} rounded transition-colors`}
                  title="Rename chat"
                >
                  <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{wordCount} words</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`}>•</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{readingTime} min read</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`}>•</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{sentenceCount} sentences</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} rounded-lg transition-colors group`} title="Save (Ctrl+S)">
              <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400 group-hover:text-cyan-400' : 'text-gray-600 group-hover:text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            <div className="relative">
              <button onClick={() => setShowExportMenu(!showExportMenu)} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} rounded-lg transition-colors group`} title="Export (Ctrl+E)">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400 group-hover:text-cyan-400' : 'text-gray-600 group-hover:text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              {showExportMenu && (
                <div className={`absolute right-0 mt-2 w-48 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border py-2 z-10`}>
                  <button onClick={() => handleExport('txt')} className={`w-full px-4 py-2 text-left text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>Export as TXT</button>
                  <button onClick={() => handleExport('pdf')} className={`w-full px-4 py-2 text-left text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>Export as PDF</button>
                </div>
              )}
            </div>
            <button onClick={clearContent} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} rounded-lg transition-colors group`} title="Clear">
              <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400 group-hover:text-red-400' : 'text-gray-600 group-hover:text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`px-6 py-3 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'} flex items-center justify-between flex-wrap gap-2`}>
          <div className="flex gap-2">
            <button onClick={() => insertText('**', '**')} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'} rounded-lg transition-colors font-bold`} title="Bold">B</button>
            <button onClick={() => insertText('*', '*')} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'} rounded-lg transition-colors italic`} title="Italic">I</button>
            <button onClick={() => insertText('~~', '~~')} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'} rounded-lg transition-colors line-through`} title="Strikethrough">S</button>
            <div className={`w-px ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`} />
            <button onClick={() => insertText('# ', '')} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'} rounded-lg transition-colors text-sm`} title="Heading">H1</button>
            <button onClick={() => insertText('- ', '')} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'} rounded-lg transition-colors`} title="List">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button onClick={() => insertText('> ', '')} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'} rounded-lg transition-colors`} title="Quote">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'} rounded-lg transition-colors`} title="Decrease font size">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} w-8 text-center`}>{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'} rounded-lg transition-colors`} title="Increase font size">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

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
          <button onClick={handleAnalyze} disabled={isAnalyzing || !content.trim()} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95">
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

      <div className={`w-96 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-lg border flex flex-col overflow-hidden shadow-2xl`}>
        <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-100/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 ${isAnalyzing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'} rounded-full`} />
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {showSuggestions && analysisResult ? 'Suggestions' : 'AI Assistant'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {showSuggestions && analysisResult && analysisResult.suggestions.length > 0 && (
                <button
                  onClick={handleAcceptAll}
                  className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-xs font-medium transition-all"
                  title="Accept all suggestions"
                >
                  Accept All
                </button>
              )}
              <button onClick={() => setShowQuickActions(!showQuickActions)} className={`p-2 ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} rounded-lg transition-colors`} title="Quick Actions">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Score Display */}
          {showSuggestions && analysisResult && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1">
                <div className={`h-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <div 
                    className={`h-full transition-all duration-500 ${
                      analysisResult.score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      analysisResult.score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}
                    style={{ width: `${analysisResult.score}%` }}
                  />
                </div>
              </div>
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {analysisResult.score}/100
              </span>
            </div>
          )}
        </div>

        {showQuickActions && (
          <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50'} space-y-2`}>
            <button className={`w-full px-3 py-2 text-left text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition-colors flex items-center gap-2`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Grammar Check
            </button>
            <button className={`w-full px-3 py-2 text-left text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition-colors flex items-center gap-2`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Improve Writing
            </button>
            <button className={`w-full px-3 py-2 text-left text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition-colors flex items-center gap-2`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Translate
            </button>
            <button className={`w-full px-3 py-2 text-left text-sm ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition-colors flex items-center gap-2`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Summarize
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {showSuggestions && analysisResult ? (
            analysisResult.suggestions.length > 0 ? (
              <div className="space-y-4">
                <div className={`${theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-blue-900'}`}>
                    {analysisResult.summary}
                  </p>
                </div>
                
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
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Perfect!</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} max-w-xs`}>
                  {analysisResult.summary}
                </p>
              </div>
            )
          ) : currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Ready to Help</h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} max-w-xs`}>
                Type your Tamil text and click "Analyze" to get AI-powered suggestions and corrections
              </p>
              <div className="mt-6 space-y-2 w-full">
                <div className={`px-4 py-3 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50 border-blue-200'} rounded-lg border`}>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-blue-600'} mb-1`}>Tip</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-blue-900'}`}>Use Ctrl+Enter to quickly analyze</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-lg ${msg.sender === 'user' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : theme === 'dark' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-gray-100 text-gray-900 border border-gray-200'} ${msg.isLoading ? 'animate-pulse' : ''}`}>
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-slate-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                        <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-slate-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                        <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-slate-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`px-6 py-3 border-t ${theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50'}`}>
          <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'} space-y-1`}>
            <div className="flex justify-between">
              <span>Analyze</span>
              <kbd className={`px-2 py-0.5 ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'} rounded`}>Ctrl+Enter</kbd>
            </div>
            <div className="flex justify-between">
              <span>Save Draft</span>
              <kbd className={`px-2 py-0.5 ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'} rounded`}>Ctrl+S</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
