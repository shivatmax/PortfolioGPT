import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_TIMELINE, PROFILE } from '../constants';

const StoryPage: React.FC = () => {
    const [mode, setMode] = useState<'timeline' | 'novel'>('timeline');

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pb-24">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 sm:mb-12"
            >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 dark:text-gray-100 mb-4">
                    My Journey
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base mb-8">
                    From a curious student to a Full-Stack LLM Engineer & Founder. <br className="hidden sm:block" />
                    A story of resilience, learning, and building.
                </p>

                {/* Toggle Controls */}
                <div className="inline-flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-xl border border-gray-200 dark:border-white/5 shadow-inner relative z-10">
                    <button
                        onClick={() => setMode('timeline')}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 z-10 flex items-center gap-2 ${mode === 'timeline' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        {mode === 'timeline' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-sm border border-black/5 dark:border-white/5 -z-10"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Timeline Mode
                    </button>

                    <button
                        onClick={() => setMode('novel')}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 z-10 flex items-center gap-2 ${mode === 'novel' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        {mode === 'novel' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-sm border border-black/5 dark:border-white/5 -z-10"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        Novel Mode
                    </button>
                </div>
            </motion.div>



            {/* Featured Story Video */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12 max-w-3xl mx-auto"
            >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#2a2a2a] ring-1 ring-gray-200 dark:ring-white/10 aspect-video group">
                    <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 group-hover:opacity-0 transition-opacity z-10 pointer-events-none mix-blend-overlay"></div>
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/-GRipNa8dHI"
                        title="Shiv's Story"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full bg-black/50"
                    ></iframe>
                </div>
                <p className="text-center text-xs text-gray-400 mt-3 font-medium tracking-wide uppercase">Watch the visual journey</p>
            </motion.div>

            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    {mode === 'timeline' ? (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                        >
                            {/* Vertical Line */}
                            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10 sm:-ml-0.5"></div>

                            <div className="space-y-12">
                                {STORY_TIMELINE.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative flex flex-col sm:flex-row gap-6 sm:gap-0 sm:items-center ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''
                                            }`}
                                    >
                                        {/* Spacer for Desktop alternating layout */}
                                        <div className="hidden sm:block sm:w-1/2" />

                                        {/* Timeline Dot */}
                                        <div className="absolute left-4 sm:left-1/2 w-8 h-8 -ml-3 sm:-ml-4 flex items-center justify-center rounded-full bg-white dark:bg-[#111] border-4 border-sky-100 dark:border-sky-900 shadow-sm z-10">
                                            <span className="text-lg" role="img" aria-label="icon">{item.icon}</span>
                                        </div>

                                        {/* Content Card */}
                                        <div className={`pl-12 sm:pl-0 sm:w-1/2 ${index % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'
                                            }`}>
                                            <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow relative group">
                                                {/* Year Tag */}
                                                <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-2 ${item.title === "Founder Mode" || item.title === "The Now" || item.title === "Global Impact"
                                                    ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
                                                    : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"
                                                    }`}>
                                                    {item.year}
                                                </div>

                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-sky-500 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="novel"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="bg-white dark:bg-[#1a1a1a] p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                {/* Decorative Pattern / Lighting */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-bl-[100px] pointer-events-none opacity-60"></div>

                                <div className="relative z-10">
                                    <div className="font-serif text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-300">
                                        {PROFILE.story.split('\n\n').filter(Boolean).map((paragraph, idx) => (
                                            <p key={idx} className={`mb-4 text-justify ${idx === 0
                                                ? "first-letter:text-6xl sm:first-letter:text-7xl first-letter:font-bold first-letter:text-gray-900 dark:first-letter:text-white first-letter:mr-3 sm:first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]"
                                                : ""
                                                }`}>
                                                {paragraph.trim()}
                                            </p>
                                        ))}
                                    </div>

                                    <div className="mt-8 sm:mt-12 flex items-center justify-center gap-4 text-gray-300 dark:text-gray-600">
                                        <span className="w-12 h-px bg-current"></span>
                                        <span className="text-xl">❖</span>
                                        <span className="w-12 h-px bg-current"></span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer CTA */}
            <motion.div
                layout
                className="mt-20 text-center p-8 rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-white/5 dark:to-white/5 border border-sky-100 dark:border-white/5"
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">And I'm just getting started.</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Check out my projects to see what I'm building right now.
                </p>
            </motion.div>
        </div >
    );
};

export default StoryPage;
