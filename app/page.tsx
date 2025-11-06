'use client';

import { useState } from 'react';
import VoiceDropdown from '@/components/VoiceDropdown';
import AudioPlayer from '@/components/AudioPlayer';

interface VoiceSettings {
  voice_id: string;
  stability: number;
  style: number;
  speed: number;
}

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings>({
    voice_id: '21m00Tcm4TlvDq8ikWAM',
    stability: 0.5,
    style: 0.0,
    speed: 1.0,
  });

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          ...settings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate speech');
      }

      setAudioUrl(data.audio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Text to Speech Demo
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Powered by ElevenLabs and Appwrite Sites
            </p>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label
              htmlFor="text-input"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Enter your text
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg 
                       bg-white dark:bg-slate-700 text-slate-900 dark:text-white 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       resize-none"
            />
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {text.length} characters
            </div>
          </div>

          {/* Settings Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showSettings ? 'Hide' : 'Show'} Advanced Settings
            </button>
          </div>

          {/* Advanced Settings */}
          {showSettings && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-4">
              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Voice
                </label>
                <VoiceDropdown
                  value={settings.voice_id}
                  onChange={(voiceId) =>
                    setSettings({ ...settings, voice_id: voiceId })
                  }
                />
              </div>

              {/* Stability */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Stability: {settings.stability.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.stability}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      stability: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Lower values make the voice more variable and expressive
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Style: {settings.style.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={settings.style}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      style: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Higher values add more style and emotion
                </div>
              </div>

              {/* Speed */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Speed: {settings.speed.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.7"
                  max="1.2"
                  step="0.01"
                  value={settings.speed}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      speed: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  1.0 is default speed. Range: 0.7x (slower) to 1.2x (faster)
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !text.trim()}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 
                     text-white font-medium rounded-lg transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Speech'}
          </button>

          {/* Audio Player */}
          {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
        </div>
      </div>
    </div>
  );
}
