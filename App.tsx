import React, { useState, useEffect, useRef } from 'react';
import { useAutoScroll } from './hooks/useAutoScroll';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ContactModal from './components/ContactModal';
import SettingsModal from './components/SettingsModal';
import VoiceModeOverlay from './components/VoiceModeOverlay';
import VoiceAssistantPanel from './components/VoiceAssistantPanel';
import ThinkingIndicator from './components/ThinkingIndicator';
import ExperiencePage from './components/ExperiencePage';
import ProjectsPage from './components/ProjectsPage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import StoryPage from './components/StoryPage';
import { Message, ChatSession, ViewType } from './types';
import { streamResponse, generateChatTitle } from './services/geminiService';
import { sendEmail } from './services/emailService';
import { SUGGESTIONS, SYSTEM_INSTRUCTION, CHATBOT_CAPABILITIES, UI_TEXT, APP_CONFIG, BANNER_DATA, CONFIG } from './constants';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Sidebar states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalContext, setContactModalContext] = useState({ subject: '', message: '' });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState('persona');
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shivgpt-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      // Default to System Preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    }
    return 'dark';
  });
  const [aiTone, setAiTone] = useState<'professional' | 'technical' | 'casual'>('professional');

  const bottomRef = useRef<HTMLDivElement>(null);
  const portfolioContentRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUpRef = useRef(false);

  // Auto-scroll effect: Runs after every render (when messages update)
  useEffect(() => {
    if (currentView === 'chat' && !userHasScrolledUpRef.current) {
      // Use requestAnimationFrame to ensure DOM painting is complete
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
      });
    }
  }, [sessions, currentView]); // Dependency on sessions triggers this on every chunk update

  // Auto-scroll logic for Voice Presentations
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  useAutoScroll(portfolioContentRef, isAutoScrolling, 0.5); // Slow, smooth scroll

  const handleVoiceNavigate = (viewOrData: any) => {
    if (typeof viewOrData === 'object' && viewOrData.view) {
      if (viewOrData.view === 'contact') {
        handleOpenContact();
      } else {
        setCurrentView(viewOrData.view);
        if (viewOrData.autoScroll) {
          setIsAutoScrolling(false);
          // Wait for view transition/render, then start scrolling
          setTimeout(() => setIsAutoScrolling(true), 500);
        }
      }
    } else {
      if (viewOrData === 'contact') {
        handleOpenContact();
      } else {
        setCurrentView(viewOrData);
        setIsAutoScrolling(false);
      }
    }
  };

  useEffect(() => {
    const savedSessions = localStorage.getItem('shivgpt-sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }



    const savedTone = localStorage.getItem('shivgpt-tone');
    if (savedTone === 'professional' || savedTone === 'technical' || savedTone === 'casual') {
      setAiTone(savedTone);
    }

    // Check saved sidebar state
    const savedSidebar = localStorage.getItem('shivgpt-sidebar-open');
    if (savedSidebar !== null) {
      setIsDesktopSidebarOpen(savedSidebar === 'true');
    }

    // Detect mobile/desktop
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    localStorage.setItem('shivgpt-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('shivgpt-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('shivgpt-tone', aiTone);
  }, [aiTone]);

  const toggleDesktopSidebar = () => {
    const newState = !isDesktopSidebarOpen;
    setIsDesktopSidebarOpen(newState);
    localStorage.setItem('shivgpt-sidebar-open', String(newState));
  };

  useEffect(() => {
    if (currentView === 'chat') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessions, currentSessionId, isLoading, currentView]);

  useEffect(() => {
    const handleNavigation = (e: CustomEvent) => {
      const view = e.detail;
      if (view === 'contact') {
        handleOpenContact();
      } else {
        setCurrentView(view as ViewType);
      }
    };
    window.addEventListener('navigate-view', handleNavigation as EventListener);
    return () => window.removeEventListener('navigate-view', handleNavigation as EventListener);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleOpenSettings = (tab = 'persona') => {
    setSettingsInitialTab(tab);
    setIsSettingsModalOpen(true);
  };

  const handleOpenContact = (subject = '', message = '') => {
    setContactModalContext({ subject, message });
    setIsContactModalOpen(true);
  }

  const handleServiceInquiry = (serviceTitle: string) => {
    handleOpenContact(
      `Inquiry: ${serviceTitle}`,
      `Hi Shiv,\n\nI'm interested in your ${serviceTitle} service. I'd like to discuss...`
    );
  };

  const getCurrentSession = () => sessions.find(s => s.id === currentSessionId);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setCurrentView('chat');
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setCurrentView('chat');
  };

  const getDynamicSystemInstruction = () => {
    let instruction = SYSTEM_INSTRUCTION;
    if (aiTone === 'technical') {
      instruction += `\n\nCURRENT PERSONA: TECHNICAL/ENGINEERING.
      - Speak like a senior engineer to another engineer.
      - Focus on architectural patterns, tech stack details, and implementation specifics.
      - Use technical jargon correctly (e.g., "microservices", "latency", "CAP theorem", "SOLID principles").
      - Be concise and precise.`;
    } else if (aiTone === 'casual') {
      instruction += `\n\nCURRENT PERSONA: CASUAL/FRIENDLY.
      - Be super relaxed, enthusiastic, and approachable.
      - Use emojis occasionally to lighten the mood.
      - Explain complex concepts simply, like you're talking to a friend over coffee.
      - Focus on the "why" and "cool factor" of projects rather than just specs.`;
    } else {
      instruction += `\n\nCURRENT PERSONA: PROFESSIONAL/RECRUITER.
      - Maintain a polished, confident, and professional tone.
      - Focus on business impact, leadership, and results (ROI, efficiency, growth).
      - Be helpful and courteous.`;
    }
    return instruction;
  };

  const handleSendMessage = async (content: string) => {
    // Ensure we are in chat view
    if (currentView !== 'chat') setCurrentView('chat');

    let activeSessionId = currentSessionId;
    let shouldGenerateTitle = false;

    // Check if we are starting a fresh conversation (either no session or empty session)
    const currentSession = sessions.find(s => s.id === activeSessionId);
    if (!activeSessionId || (currentSession && currentSession.messages.length === 0)) {
      shouldGenerateTitle = true;
    }

    if (!activeSessionId) {
      const newSession: ChatSession = {
        id: uuidv4(),
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        createdAt: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      activeSessionId = newSession.id;
      setCurrentSessionId(newSession.id);
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    // Add user message to state
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        // If it's the first message, set a temporary title based on content
        const newTitle = session.messages.length === 0 ? content.substring(0, 30) : session.title;
        return {
          ...session,
          title: newTitle,
          messages: [...session.messages, userMessage]
        };
      }
      return session;
    }));

    // If this is the start of a conversation, generate a smart title in the background
    if (shouldGenerateTitle && activeSessionId) {
      generateChatTitle(content).then(title => {
        if (title) {
          setSessions(prev => prev.map(s =>
            s.id === activeSessionId ? { ...s, title } : s
          ));
        }
      });
    }

    setIsLoading(true);
    setIsThinking(true);

    const currentHistory = sessions.find(s => s.id === activeSessionId)?.messages || [];
    const fullHistory = [...currentHistory, userMessage];

    // Placeholder for AI message
    const aiMessageId = uuidv4();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'model',
      content: '', // Start empty
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [...session.messages, aiMessage]
        };
      }
      return session;
    }));

    // Tool Implementations wrapped to access state
    const toolExecutor = async (name: string, args: any) => {
      console.log(`Executing tool: ${name}`, args);

      if (name === 'openContact' || name === 'bookMeeting') {
        handleOpenContact();
        return "Opened the contact/booking form.";
      }

      if (name === 'sendMessage') {
        try {
          const { name: senderName, email, message } = args;
          const success = await sendEmail({
            name: senderName,
            email: email,
            message: message
          });

          if (success) {
            return "Email sent successfully to Shiv.";
          } else {
            return "Failed to send email due to a technical error.";
          }
        } catch (e) {
          return "Failed to send email.";
        }
      }

      if (name === 'showProjects') {
        setSessions(prev => prev.map(session => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: session.messages.map(msg =>
                msg.id === aiMessageId ? { ...msg, uiComponent: 'projects' } : msg
              )
            };
          }
          return session;
        }));
        return "Displayed the projects widget.";
      }

      if (name === 'showExperience') {
        setSessions(prev => prev.map(session => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: session.messages.map(msg =>
                msg.id === aiMessageId ? { ...msg, uiComponent: 'experience' } : msg
              )
            };
          }
          return session;
        }));
        return "Displayed the experience timeline widget.";
      }

      if (name === 'showSkills') {
        setSessions(prev => prev.map(session => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: session.messages.map(msg =>
                msg.id === aiMessageId ? { ...msg, uiComponent: 'skills' } : msg
              )
            };
          }
          return session;
        }));
        return "Displayed the skills widget.";
      }

      if (name === 'showAbout') {
        setCurrentView('about');
        return "Displayed the About page.";
      }

      if (name === 'showStory') {
        setSessions(prev => prev.map(session => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: session.messages.map(msg =>
                msg.id === aiMessageId ? { ...msg, uiComponent: 'story' } : msg
              )
            };
          }
          return session;
        }));
        return "Displayed the personal story widget.";
      }

      return "Unknown tool";
    };

    try {
      await streamResponse(
        fullHistory,
        content,
        (chunkText) => {
          // Stop thinking animation once streaming starts
          setIsThinking(false);
          setSessions(prev => prev.map(session => {
            if (session.id === activeSessionId) {
              return {
                ...session,
                messages: session.messages.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + chunkText }
                    : msg
                )
              };
            }
            return session;
          }));
          // Note: Scrolling is now handled by the useEffect hook listening to 'sessions'
        },
        toolExecutor,
        getDynamicSystemInstruction() // Pass dynamic instruction
      );

    } catch (error) {
      console.error("Error generating response", error);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      userHasScrolledUpRef.current = false; // Reset scroll flag after streaming ends
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setSessions([]);
      setCurrentSessionId(null);
      localStorage.removeItem('shivgpt-sessions');
      // If we were viewing a chat, create a new one or show empty state
      if (currentView === 'chat') {
        setCurrentSessionId(null);
      }
    }
  };

  const currentMessages = getCurrentSession()?.messages || [];

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Mobile Header */}
      <div className="fixed top-0 w-full z-10 flex items-center justify-between border-b border-gray-200 dark:border-white/10 bg-white dark:bg-black p-3 md:hidden backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <button onClick={() => setIsMobileSidebarOpen(true)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 p-1">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="font-semibold text-lg tracking-tight">{APP_CONFIG.name}</div>
        <button onClick={handleNewChat} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 p-1">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>

      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        currentView={currentView}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onChangeView={setCurrentView}
        isOpen={isMobileSidebarOpen}
        onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isDesktopOpen={isDesktopSidebarOpen}
        onDesktopToggle={toggleDesktopSidebar}
        onClearHistory={handleClearHistory}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenContact={() => handleOpenContact()}
        onOpenSettings={handleOpenSettings}
      />

      <main className="flex-1 relative flex flex-col h-full md:pl-0 pt-12 md:pt-0 min-w-0 transition-all duration-300">

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between p-3 absolute top-0 left-0 w-full z-10 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            {!isDesktopSidebarOpen && (
              <button
                onClick={toggleDesktopSidebar}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
                title="Open sidebar"
              >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              </button>
            )}

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors text-lg font-semibold text-gray-700 dark:text-gray-200">
              <span>
                {currentView === 'chat' ? `${APP_CONFIG.name} ${APP_CONFIG.version}` :
                  currentView === 'experience' ? 'Experience & Education' :
                    currentView === 'services' ? 'Services' :
                      currentView === 'projects' ? 'Projects & Certifications' :
                        currentView === 'story' ? 'My Journey' : 'About Me'}
              </span>
              {currentView === 'chat' && <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {currentView === 'chat' ? (
          <>
            {currentMessages.length === 0 ? (
              /* Empty State / First Page - Redesigned to put content at bottom */
              <div className="flex-1 overflow-hidden flex flex-col relative bg-white dark:bg-[#0a0a0a]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="m-auto w-full max-w-3xl px-3 sm:px-4 md:px-6 flex flex-col items-center h-full pt-12 sm:pt-16 md:pt-20 pb-6"
                >
                  {/* Avatar & Welcome */}
                  <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6 text-center">
                    <div className="relative group cursor-pointer mb-3 sm:mb-4 md:mb-5" onClick={() => setIsVoiceModeOpen(true)}>
                      <div className="absolute inset-0 bg-sky-500 rounded-full blur-lg sm:blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <div className="relative bg-white dark:bg-[#111] p-1 rounded-full shadow-lg sm:shadow-2xl border border-gray-100 dark:border-white/10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 mx-auto">
                        <img src={UI_TEXT.emptyState.avatar} alt={APP_CONFIG.name} className="w-full h-full rounded-full object-cover" />
                        <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-sky-500 text-white p-1 sm:p-1.5 rounded-full shadow-lg border-2 border-white dark:border-black">
                          <svg width="8" height="8" className="sm:w-[10px] sm:h-[10px]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" /></svg>
                        </div>
                      </div>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 dark:text-gray-100">{UI_TEXT.welcomeMessage}</h2>
                    <p className="text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 font-medium mt-2">{UI_TEXT.tagline}</p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">{UI_TEXT.description}</p>
                  </div>

                  {/* STATIC CENTRAL INPUT */}
                  <div className="w-full mb-4 sm:mb-5 md:mb-6">
                    <ChatInput
                      onSend={handleSendMessage}
                      isLoading={isLoading}
                      onStartVoice={() => setIsVoiceModeOpen(true)}
                      mode="static"
                    />
                  </div>

                  {/* Suggestion Chips (Pills) - Now ABOVE Banner */}
                  <div className="w-full max-w-2xl mb-3 sm:mb-4">
                    <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * i, duration: 0.2 }}
                          onClick={() => handleSendMessage(s.prompt)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-500/15 hover:border-sky-300 dark:hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400 transition-all flex items-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md"
                        >
                          <span>{s.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* QuickCareer.ai Banner - More Blue and Visible */}
                  {CONFIG.showBanner && (
                  <a
                    href={BANNER_DATA.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-2xl block"
                  >

                    <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-900/30 dark:via-blue-900/30 dark:to-indigo-900/30 border border-sky-200 dark:border-sky-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-sky-400 dark:hover:border-sky-400/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-sky-500/10 backdrop-blur-sm">
                      {/* Grid Pattern */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                      {/* Blue Glow Background */}
                      <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:from-sky-400/30 group-hover:to-blue-500/30 transition-all z-0"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none z-0"></div>

                      <div className="flex items-center justify-between gap-3 sm:gap-5 relative z-10">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white dark:bg-black/60 rounded-xl p-2 flex items-center justify-center shadow-md border border-sky-100 dark:border-sky-500/20 shrink-0">
                            <img src={BANNER_DATA.logoDark} alt="QuickCareer" className="w-full h-full object-contain hidden dark:block" loading="lazy" decoding="async" />
                            <img src={BANNER_DATA.logoLight} alt="QuickCareer" className="w-full h-full object-contain dark:hidden" loading="lazy" decoding="async" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                              {BANNER_DATA.title}
                              <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-bold bg-sky-100 dark:bg-sky-600/30 text-sky-700 dark:text-sky-300 rounded">NEW</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">{BANNER_DATA.description}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-all group-hover:scale-110 shadow-lg shadow-sky-500/25">
                          <svg width="14" height="14" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </div>
                      </div>
                    </div>
                  </a>
                  )}
                </motion.div>
              </div>
            ) : (
              /* Message List */
              <div
                ref={chatContainerRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

                  // Sticky Logic:
                  // If we are close to bottom (< 20px), enable auto-scroll.
                  // If we are far from bottom (> 20px), disable auto-scroll.
                  // We use a small threshold (20px) to ensure the user can easily "break out" of the auto-scroll
                  // loop by scrolling up slightly. If the threshold is too large (e.g. 50px), the auto-scroll
                  // might pull them back down before they can escape.
                  const isAtBottom = distanceFromBottom < 20;

                  // Invert logic: userHasScrolledUp means "Auto-scroll is OFF"
                  userHasScrolledUpRef.current = !isAtBottom;
                }}
                className="flex-1 overflow-y-auto pb-40 pt-16 custom-scrollbar px-4 md:px-0"
              >
                <AnimatePresence>
                  {currentMessages.map((msg, idx) => {
                    // Don't render the last AI message if it's empty and we're still thinking
                    const isLastEmptyAI = isThinking &&
                      idx === currentMessages.length - 1 &&
                      msg.role === 'model' &&
                      msg.content === '';
                    if (isLastEmptyAI) return null;
                    return <ChatMessage key={msg.id} message={msg} />;
                  })}
                </AnimatePresence>

                {/* Thinking Indicator - Show when thinking */}
                <AnimatePresence>
                  {isThinking && (
                    <ThinkingIndicator isThinking={isThinking} />
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>
            )}

            {/* Input Area (Fixed Bottom - Only visible when there are messages) */}
            {currentMessages.length > 0 && (
              <ChatInput
                onSend={handleSendMessage}
                isLoading={isLoading}
                onStartVoice={() => setIsVoiceModeOpen(true)}
                mode="fixed"
              />
            )}
          </>
        ) : (
          /* Portfolio Views */
          <div ref={portfolioContentRef} className="flex-1 overflow-y-auto pt-16 pb-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              {currentView === 'experience' && CONFIG.showExperience && <ExperiencePage key="exp" />}
              {currentView === 'projects' && CONFIG.showProjects && <ProjectsPage key="proj" />}
              {currentView === 'services' && CONFIG.showServices && <ServicesPage key="services" onInquire={handleServiceInquiry} />}
              {currentView === 'story' && CONFIG.showStory && <StoryPage key="story" />}
              {currentView === 'about' && <AboutPage key="about" />}
            </AnimatePresence>
          </div>
        )}

        {/* Contact Modal */}
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          initialSubject={contactModalContext.subject}
          initialMessage={contactModalContext.message}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          initialTab={settingsInitialTab}
          theme={theme}
          setTheme={setTheme}
          onClearHistory={handleClearHistory}
          aiTone={aiTone}
          setAiTone={setAiTone}
        />

        {/* Voice Mode Overlay for Mobile only */}
        <AnimatePresence>
          {isVoiceModeOpen && isMobile && (
            <VoiceModeOverlay
              isOpen={isVoiceModeOpen}
              onClose={() => setIsVoiceModeOpen(false)}
              aiTone={aiTone}
              onNavigate={handleVoiceNavigate}
            />
          )}
        </AnimatePresence>

      </main>

      {/* Voice Assistant Panel for Desktop - Outside main for layout flow */}
      <AnimatePresence>
        {isVoiceModeOpen && !isMobile && (
          <VoiceAssistantPanel
            isOpen={isVoiceModeOpen}
            onClose={() => setIsVoiceModeOpen(false)}
            aiTone={aiTone}
            onNavigate={handleVoiceNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;