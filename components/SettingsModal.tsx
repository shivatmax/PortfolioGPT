import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROFILE } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onClearHistory: () => void;
  aiTone: 'professional' | 'technical' | 'casual';
  setAiTone: (tone: 'professional' | 'technical' | 'casual') => void;
}

const TABS = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'persona', label: 'AI Persona', icon: '🧠' },
  { id: 'account', label: 'Account', icon: '👤' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'persona',
  theme,
  setTheme,
  onClearHistory,
  aiTone,
  setAiTone
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        className="relative bg-white dark:bg-[#1a1a1a] w-full max-w-3xl h-auto max-h-[85vh] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Header (Mobile only) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111]">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-52 bg-gray-50 dark:bg-[#111] border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/5 p-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          <div className="hidden md:block px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Settings</div>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0 ${activeTab === tab.id
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5'
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative bg-white dark:bg-[#1a1a1a]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'persona' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Persona</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Choose how ShivGPT responds to visitors.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'professional',
                        label: 'Professional',
                        desc: 'Business-focused, highlights impact and leadership.',
                        icon: '👔',
                        color: 'sky'
                      },
                      {
                        id: 'technical',
                        label: 'Technical',
                        desc: 'Detailed architecture, stack, and code patterns.',
                        icon: '⚡',
                        color: 'amber'
                      },
                      {
                        id: 'casual',
                        label: 'Casual',
                        desc: 'Relaxed, uses emojis and simple analogies.',
                        icon: '☕',
                        color: 'pink'
                      }
                    ].map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setAiTone(option.id as any)}
                        className={`
                          flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200
                          ${aiTone === option.id
                            ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-500'
                            : 'bg-gray-50 dark:bg-white/5 border-transparent hover:border-gray-200 dark:hover:border-white/10'}
                        `}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${aiTone === option.id ? 'bg-sky-100 dark:bg-sky-500/20' : 'bg-gray-100 dark:bg-white/10'}`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${aiTone === option.id ? 'text-sky-700 dark:text-sky-300' : 'text-gray-900 dark:text-white'}`}>{option.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${aiTone === option.id ? 'border-sky-500 bg-sky-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {aiTone === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-100 dark:border-amber-500/20">
                    <span className="text-amber-500">💡</span>
                    <p className="text-xs text-amber-700 dark:text-amber-300">Changes apply to new messages only.</p>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View your profile information.</p>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 rounded-xl">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg flex-shrink-0">SA</div>
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Shiv A</div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">@shivawasthi0987</div>
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                        Pro Plan
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0 divide-y divide-gray-100 dark:divide-white/5">
                    {[
                      { label: "Email", value: PROFILE.email },
                      { label: "Location", value: PROFILE.location },
                      { label: "Role", value: PROFILE.role }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 py-3">
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white sm:text-right break-words">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">General</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">App preferences and controls.</p>
                  </div>

                  <div className="space-y-0 divide-y divide-gray-100 dark:divide-white/5">
                    {/* Theme */}
                    <div className="flex justify-between items-center py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Theme</span>
                      <div className="flex bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                        <button
                          onClick={() => setTheme('light')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'light' ? 'bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                          ☀️ Light
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'dark' ? 'bg-[#333] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                          🌙 Dark
                        </button>
                      </div>
                    </div>

                    {/* Language */}
                    <div className="flex justify-between items-center py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Language</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">English (US)</span>
                    </div>

                    {/* Clear History */}
                    <div className="flex justify-between items-center py-4">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white block">Clear chat history</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Remove all conversations</span>
                      </div>
                      <button
                        onClick={onClearHistory}
                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium px-4 py-2 rounded-lg border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;