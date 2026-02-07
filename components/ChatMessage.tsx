import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Message } from '../types';
import { ChatProjectsWidget, ChatExperienceWidget, ChatSkillsWidget, ChatStoryWidget } from './ChatWidgets';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full text-gray-800 dark:text-gray-100 group border-b border-black/5 dark:border-white/5 md:border-none`}
    >
      <div className="text-sm sm:text-base gap-2 sm:gap-3 md:gap-4 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] p-3 sm:p-4 md:py-6 flex m-auto">

        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col relative items-end">
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
            <div className={`relative flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full items-center justify-center overflow-hidden border border-black/10 dark:border-white/10 ${isUser ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-transparent'}`}>
              {isUser ? (
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
              ) : (
                <img src="/photo.jpeg" alt="ShivGPT" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden">
          {/* Name Label */}
          <div className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 opacity-90">
            {isUser ? 'You' : 'ShivGPT'}
          </div>

          {isUser ? (
            <div className="whitespace-pre-wrap text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed">{message.content}</div>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown
                children={message.content
                  // Fix escaped newlines from OpenAI
                  .replace(/\\n/g, '\n')
                  // Clean up multiple blank lines
                  .replace(/\n{3,}/g, '\n\n')
                }
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent mb-4 mt-2 pb-2 border-b border-gray-200 dark:border-white/10" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 mt-4" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-base sm:text-lg font-semibold text-sky-600 dark:text-sky-400 mb-2 mt-3" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 space-y-1 mb-4 text-gray-700 dark:text-gray-300" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-4 space-y-1 mb-4 text-gray-700 dark:text-gray-300" {...props} />,
                  li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-bold text-purple-600 dark:text-purple-400" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-gray-50 dark:bg-white/5 rounded-r-lg italic text-gray-600 dark:text-gray-400" {...props} />
                  ),
                  code(props: any) {
                    const { node, inline, className, children, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline ? (
                      <div className="relative my-3 sm:my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm group/code">
                        <div className="flex items-center justify-between bg-gray-100 dark:bg-[#202123] text-gray-500 dark:text-gray-400 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium border-b border-gray-200 dark:border-gray-700">
                          <span className="uppercase tracking-wider font-mono text-purple-500">{match?.[1] || 'CODE'}</span>
                          <span className="cursor-pointer hover:text-purple-500 transition-colors opacity-0 group-hover/code:opacity-100">Copy</span>
                        </div>
                        <pre className="!mt-0 !mb-0 !rounded-none !bg-gray-50 dark:!bg-[#111] p-3 sm:p-4 overflow-x-auto text-[11px] sm:text-xs md:text-sm custom-scrollbar">
                          <code className={`${className} !text-gray-800 dark:!text-gray-200 font-mono`} {...rest}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <code className={`${className} bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded-md text-[11px] sm:text-xs md:text-sm font-mono border border-purple-100 dark:border-purple-800/30`} {...rest}>
                        {children}
                      </code>
                    )
                  },
                  a({ node, children, ...props }) {
                    return (
                      <a {...props} className="text-sky-500 dark:text-sky-400 hover:text-sky-600 hover:underline decoration-sky-500/30 underline-offset-2 transition-all font-medium" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    );
                  },
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-white/10">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10 text-sm" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => <th className="bg-gray-50 dark:bg-white/5 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white" {...props} />,
                  td: ({ node, ...props }) => <td className="px-4 py-3 border-t border-gray-100 dark:border-white/5 text-gray-700 dark:text-gray-300" {...props} />,
                  hr: ({ node, ...props }) => <hr className="my-6 border-gray-200 dark:border-white/10" {...props} />
                }}
              />

              {/* UI Widgets */}
              {message.uiComponent === 'projects' && <ChatProjectsWidget />}
              {message.uiComponent === 'experience' && <ChatExperienceWidget />}
              {message.uiComponent === 'skills' && <ChatSkillsWidget />}
              {message.uiComponent === 'story' && <ChatStoryWidget />}

            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default ChatMessage;