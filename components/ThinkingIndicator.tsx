import React from 'react';
import { motion } from 'framer-motion';

interface ThinkingIndicatorProps {
    isThinking: boolean;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ isThinking }) => {
    if (!isThinking) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full text-gray-800 dark:text-gray-100 group border-b border-black/5 dark:border-white/5 md:border-none"
        >
            <div className="text-sm sm:text-base gap-2 sm:gap-3 md:gap-4 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] p-3 sm:p-4 md:py-6 flex m-auto">
                {/* Avatar */}
                <div className="flex-shrink-0 flex flex-col relative items-end">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                        <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full items-center justify-center overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-transparent">
                            <img src="/photo.jpeg" alt="ShivGPT" className="h-full w-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 overflow-hidden">
                    {/* Name Label */}
                    <div className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 opacity-90">
                        ShivGPT
                    </div>

                    {/* Thinking Animation */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <motion.div
                                className="flex items-center gap-1"
                            >
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Thinking</span>
                                <div className="flex gap-0.5 ml-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            animate={{
                                                opacity: [0.3, 1, 0.3],
                                                y: [0, -3, 0],
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                                ease: "easeInOut"
                                            }}
                                            className="w-1.5 h-1.5 rounded-full bg-sky-500"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Brain/Sparkle Icon */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-sky-500"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ThinkingIndicator;
