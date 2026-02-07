import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, ViewType } from '../types';
import { PROFILE } from '../constants';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentView: ViewType;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onChangeView: (view: ViewType) => void;
  isOpen: boolean; // Mobile state
  onToggle: () => void; // Mobile toggle
  isDesktopOpen: boolean; // Desktop state
  onDesktopToggle: () => void; // Desktop toggle
  onClearHistory: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenContact: () => void;
  onOpenSettings: (tab?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  currentView,
  onNewChat,
  onSelectSession,
  onChangeView,
  isOpen,
  onToggle,
  isDesktopOpen,
  onDesktopToggle,
  onClearHistory,
  theme,
  toggleTheme,
  onOpenContact,
  onOpenSettings
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: ViewType) => {
    onChangeView(view);
    if (window.innerWidth < 768) onToggle();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-gray-600/50 backdrop-blur-sm z-20 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />

      {/* Sidebar Container */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-30 
          bg-gpt-sidebarLight dark:bg-gpt-sidebarDark 
          border-r border-black/5 dark:border-white/5
          transition-transform md:transition-[width,transform] duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isDesktopOpen ? 'md:w-[260px]' : 'md:w-0 md:overflow-hidden'}
          flex flex-col text-sm whitespace-nowrap
        `}
      >
        <div className="w-[260px] h-full flex flex-col">
          {/* Header / New Chat */}
          <div className="p-3 flex-shrink-0 pt-4 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 768) onToggle();
              }}
              className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#2A2B32] transition-all duration-200 group border border-transparent hover:border-black/5 dark:hover:border-white/5 shadow-sm hover:shadow-md bg-white dark:bg-transparent"
            >
              <div className="p-0.5 text-gray-600 dark:text-gray-300">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
              <span className="font-medium text-sm">New chat</span>
              <div className="flex-grow" />
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 dark:text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>

            {/* Close Sidebar Button (Desktop Only) */}
            <button
              onClick={onDesktopToggle}
              className="hidden md:flex p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2A2B32] transition-colors"
              title="Close sidebar"
            >
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            </button>
          </div>

          {/* Navigation & History */}
          <div className="flex-1 overflow-y-auto px-2 custom-scrollbar space-y-4 py-2">

            {/* Discover Section */}
            <div>
              <div className="px-2 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                Portfolio
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleNavClick('about')}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${currentView === 'about' ? 'bg-gray-200 dark:bg-[#2A2B32] text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2B32]'}`}
                >
                  <span className="text-sky-500 dark:text-sky-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></span>
                  About Me
                </button>
                <button
                  onClick={() => handleNavClick('story')}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${currentView === 'story' ? 'bg-gray-200 dark:bg-[#2A2B32] text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2B32]'}`}
                >
                  <span className="text-sky-500 dark:text-sky-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></span>
                  My Journey
                </button>
                <button
                  onClick={() => handleNavClick('experience')}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${currentView === 'experience' ? 'bg-gray-200 dark:bg-[#2A2B32] text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2B32]'}`}
                >
                  <span className="text-sky-500 dark:text-sky-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span>
                  Experience
                </button>
                <button
                  onClick={() => handleNavClick('projects')}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${currentView === 'projects' ? 'bg-gray-200 dark:bg-[#2A2B32] text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2B32]'}`}
                >
                  <span className="text-sky-500 dark:text-sky-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg></span>
                  Projects
                </button>
                <button
                  onClick={() => handleNavClick('services')}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${currentView === 'services' ? 'bg-gray-200 dark:bg-[#2A2B32] text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2B32]'}`}
                >
                  <span className="text-sky-500 dark:text-sky-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></span>
                  Services
                </button>

              </div>
            </div>

            <div>
              <div className="px-2 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest">History</div>
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 768) onToggle();
                  }}
                  className={`flex items-center gap-3 relative w-full px-3 py-2 rounded-lg cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2B32] transition-colors ${currentView === 'chat' && currentSessionId === session.id ? 'bg-gray-200 dark:bg-[#2A2B32]' : ''}`}
                >
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400 shrink-0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  <div className="flex-1 overflow-hidden text-left truncate opacity-90">
                    {session.title}
                  </div>
                </button>
              ))}
              {sessions.length === 0 && (
                <div className="text-gray-500 dark:text-gray-500 px-3 text-xs italic py-2">No chat history</div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-2 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-transparent space-y-1">

            {/* Social Links */}
            <div className="flex items-center justify-between px-3 py-2">
              <a href={`https://${PROFILE.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="GitHub" aria-label="Visit GitHub profile">
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
              </a>
              <a href={`https://${PROFILE.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" title="LinkedIn" aria-label="Visit LinkedIn profile">
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              <a href={`https://${PROFILE.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="X (Twitter)" aria-label="Visit X (Twitter) profile">
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
              </a>
              <a href={`mailto:${PROFILE.email}`} className="text-gray-400 hover:text-red-500 transition-colors" title="Email" aria-label="Send email">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>

            {/* Resume */}
            <a href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2B32] transition-colors" aria-label="Download resume PDF">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span>Download Resume</span>
            </a>

            {/* Get in Touch */}
            <button onClick={onOpenContact} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2B32] transition-colors" aria-label="Open contact form">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <span>Get in Touch</span>
            </button>

            <div className="h-px bg-black/5 dark:bg-white/5 my-0.5" />

            {/* Profile with Theme Toggle */}
            <div className="relative" ref={profileMenuRef}>
              {showProfileMenu && (
                <div className="absolute bottom-full left-0 w-full mb-1 bg-white dark:bg-[#202123] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <a href={PROFILE.calendly} target="_blank" rel="noopener noreferrer" className="w-full text-left px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    Book a Meeting
                  </a>
                  <button onClick={onOpenContact} className="w-full text-left px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Send Message
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />
                  <button onClick={() => { onOpenSettings('persona'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                    Settings
                  </button>
                </div>
              )}

              <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2.5 px-2 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2B32] cursor-pointer transition-colors">
                <img src="/photo.jpeg" alt="Shiv A" className="h-7 w-7 rounded-full object-cover border border-white/20" loading="lazy" decoding="async" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs truncate">Shiv A</div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Pro Plan</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleTheme(); }} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors" title={theme === 'dark' ? 'Light mode' : 'Dark mode'} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                  {theme === 'dark' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;