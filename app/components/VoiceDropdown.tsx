'use client';

import { useState, useRef, useEffect } from 'react';
import { VOICES, Voice } from '@/app/constants/voices';

interface VoiceDropdownProps {
  value: string;
  onChange: (voiceId: string) => void;
}

export default function VoiceDropdown({ value, onChange }: VoiceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedVoice = VOICES.find((v) => v.id === value) || VOICES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (voice: Voice) => {
    onChange(voice.id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg 
                 bg-white dark:bg-slate-600 text-left
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {selectedVoice.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {selectedVoice.description}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {VOICES.map((voice) => (
            <button
              key={voice.id}
              type="button"
              onClick={() => handleSelect(voice)}
              className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                voice.id === value
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                  : ''
              }`}
            >
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                {voice.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {voice.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

