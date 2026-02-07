import React, { useState, useRef, useEffect } from 'react';
import { UI_TEXT, APP_CONFIG } from '../constants';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStartVoice: () => void;
  mode?: 'fixed' | 'static';
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, onStartVoice, mode = 'fixed' }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const containerClasses = mode === 'fixed'
    ? "w-full pt-2 md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent absolute bottom-0 left-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gpt-dark dark:via-gpt-dark dark:to-transparent pb-3 sm:pb-4 md:pb-6 px-3 sm:px-4 md:px-0 z-10"
    : "w-full relative z-10 px-3 sm:px-4 md:px-0"; // Static mode: no absolute, no gradient

  return (
    <div className={containerClasses}>
      <div className="mx-auto flex flex-1 gap-3 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
        <div className="w-full relative flex flex-col items-center">

          {/* Input Capsule */}
          <div
            className={`
              flex w-full items-end p-1.5 sm:p-2 md:p-3 rounded-[20px] sm:rounded-[24px] md:rounded-[26px] overflow-hidden transition-all duration-300
              ${isFocused
                ? 'bg-[#ebebeb] dark:bg-[#1a1a1a] shadow-lg ring-2 ring-sky-500/30 dark:ring-sky-500/40'
                : 'bg-[#f4f4f4] dark:bg-[#141414] border border-gray-200 dark:border-white/15 shadow-md'
              }
              md:max-w-3xl
            `}
          >

            {/* Attachment Icon (Visual Only) */}


            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${APP_CONFIG.name}...`}
              className="m-0 w-full resize-none border-0 bg-transparent py-2 sm:py-[10px] pr-1 sm:pr-2 focus:ring-0 focus:outline-none outline-none ring-0 shadow-none dark:bg-transparent max-h-[120px] sm:max-h-[200px] overflow-y-auto placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
              style={{ maxHeight: '150px', height: '36px', overflowY: 'hidden', boxShadow: 'none', outline: 'none', border: 'none' }}
              rows={1}
              disabled={isLoading}
            />

            {/* Voice Mode Button (Headphone Icon) */}
            <button
              onClick={onStartVoice}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity flex-shrink-0 flex items-center justify-center mr-1.5 sm:mr-2 md:mr-3 mb-0.5 sm:mb-1"
              title="Start Voice Conversation"
            >
              <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M8 8v8M16 8v8M4 12v0M20 12v0" />
              </svg>
            </button>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label={isLoading ? "Sending message" : "Send message"}
              className={`
                w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center mb-0.5 sm:mb-1
                ${input.trim()
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-md hover:scale-105 active:scale-95'
                  : 'bg-black/10 dark:bg-white/10 text-white dark:text-[#2f2f2f] cursor-default'}`}
            >
              {isLoading ? (
                <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <svg width="18" height="18" className="sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              )}
            </button>
          </div>

          <div className="text-[10px] sm:text-[11px] md:text-[12px] text-gray-400 dark:text-gray-500 mt-1.5 sm:mt-2 text-center hidden sm:block opacity-70">
            {UI_TEXT.emptyState.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;