'use client';

import { useEffect, useRef, useState } from 'react';
import { TransliterationOption } from '@/lib/transliteration';

interface TransliterationDropdownProps {
  options: TransliterationOption[];
  onSelect: (option: string) => void;
  onClose: () => void;
  position: { top: number; left: number };
  theme?: 'dark' | 'light';
}

export function TransliterationDropdown({
  options,
  onSelect,
  onClose,
  position,
  theme = 'dark',
}: TransliterationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % options.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (options[selectedIndex]) {
          onSelect(options[selectedIndex].text);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [options, selectedIndex, onClose, onSelect]);

  if (options.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className={`fixed z-50 ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      } border rounded-lg shadow-2xl overflow-hidden min-w-[200px] max-w-[300px]`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div
        className={`px-3 py-2 text-xs font-medium ${
          theme === 'dark' ? 'bg-slate-900 text-slate-400' : 'bg-gray-50 text-gray-600'
        } border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}
      >
        Tamil Suggestions
        <span className={`ml-2 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`}>
          (↑↓ to navigate, Enter/Space to select)
        </span>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option.text)}
            className={`w-full px-4 py-3 text-left transition-colors ${
              index === selectedIndex
                ? theme === 'dark'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-cyan-500 text-white'
                : theme === 'dark'
                ? 'text-slate-200 hover:bg-slate-700'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-tamil">{option.text}</span>
              {index === selectedIndex && (
                <span className="text-xs opacity-75">
                  {index + 1}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      <div
        className={`px-3 py-2 text-xs ${
          theme === 'dark' ? 'bg-slate-900 text-slate-500' : 'bg-gray-50 text-gray-500'
        } border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}
      >
        Powered by Google Input Tools
      </div>
    </div>
  );
}
