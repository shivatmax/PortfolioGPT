import React from 'react';
import { motion } from 'framer-motion';
import { PROJECTS, EXPERIENCE, SKILLS_DATA, STORY_TIMELINE, PROFILE } from '../constants';

const navigateTo = (view: string) => {
  window.dispatchEvent(new CustomEvent('navigate-view', { detail: view }));
};

// Helper to get simple icon URL
const getSkillIcon = (skill: string) => {
  const slug = skill.toLowerCase()
    .replace(/\s+/g, '')
    .replace('next.js', 'nextdotjs')
    .replace('node.js', 'nodedotjs')
    .replace('#', 'sharp') // C#
    .replace('++', 'plusplus'); // C++
  return `https://cdn.simpleicons.org/${slug}`;
};

export const ChatProjectsWidget: React.FC = () => {
  const visibleProjects = PROJECTS.slice(0, 3);

  return (
    <div className="w-full mt-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
      <div className="flex gap-3 w-max">
        {visibleProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-[200px] group bg-white dark:bg-[#202123] border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 cursor-default relative overflow-hidden"
          >
            {/* Show Tech Icons instead of generic emoji if available, or keep emoji for now if no project image */}
            <div className="h-24 w-full bg-gradient-to-br from-sky-500/5 to-blue-500/5 dark:from-sky-500/10 dark:to-blue-500/10 rounded-lg mb-3 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              {project.image ? (
                <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <span className="relative z-10">{['🚀', '💻', '🤖', '🔮'][index % 4]}</span>
                </>
              )}
            </div>

            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{project.name}</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2 h-7 line-clamp-2 leading-tight">{project.description}</p>

            <div className="mt-auto flex flex-col gap-2">
              <div className="flex flex-wrap gap-1">
                {project.tech.split(',').slice(0, 3).map((t, i) => (
                  <div key={i} className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-1 py-0.5 rounded border border-gray-200 dark:border-white/5">
                    <img src={getSkillIcon(t.trim())} alt="" className="w-2.5 h-2.5 opacity-70" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <span className="text-[9px] font-mono font-medium text-gray-500 dark:text-gray-400">
                      {t.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* View All Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigateTo('projects')}
          className="w-[120px] bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800/30 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-900/20 transition-colors gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-white dark:bg-sky-500/20 flex items-center justify-center text-sky-500 shadow-sm group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <span className="text-xs font-bold text-sky-700 dark:text-sky-400 text-center">View All</span>
        </motion.div>
      </div>
    </div>
  );
};

export const ChatExperienceWidget: React.FC = () => {
  return (
    <div className="mt-6 bg-white dark:bg-[#202123] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span> Recent Experience
      </h3>
      <div className="space-y-6 relative border-l-2 border-gray-100 dark:border-gray-700 ml-2 pl-6">
        {EXPERIENCE.slice(0, 3).map((exp, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            {/* Logo instead of dot */}
            <div className="absolute -left-[39px] top-0 w-8 h-8 rounded-full bg-white dark:bg-[#252628] border border-gray-200 dark:border-gray-600 p-0.5 flex items-center justify-center overflow-hidden">
              {typeof exp.logo === 'string' ? (
                <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
              ) : (
                <>
                  <img src={exp.logo.light} alt={exp.company} className="w-full h-full object-contain dark:hidden" />
                  <img src={exp.logo.dark} alt={exp.company} className="w-full h-full object-contain hidden dark:block" />
                </>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 dark:text-white">{exp.role}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-medium text-sky-600 dark:text-sky-400">{exp.company}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{exp.period}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => navigateTo('experience')}
        className="w-full mt-6 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
      >
        View Full Resume
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
      </button>
    </div>
  );
};

export const ChatSkillsWidget: React.FC = () => {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {SKILLS_DATA.slice(0, 4).map((cat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-[#202123] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{cat.icon}</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{cat.category}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.skills.slice(0, 4).map((skill, sIdx) => (
              <div key={sIdx} className="flex items-center gap-1.5 bg-gray-50 dark:bg-black/20 px-2 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 hover:border-sky-200 dark:hover:border-sky-500/30 transition-colors">
                <img src={getSkillIcon(skill)} alt="" className="w-3.5 h-3.5 opacity-80" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      <button
        onClick={() => navigateTo('about')}
        className="col-span-2 mt-2 py-2 text-xs font-semibold text-center text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition-colors flex items-center justify-center gap-1"
      >
        View All Skills & Profile
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
      </button>
    </div>
  );
};

export const ChatStoryWidget: React.FC = () => {
  return (
    <div className="mt-4 bg-white dark:bg-[#202123] rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

      <div className="relative z-10">
        <h3 className="font-serif text-lg text-gray-900 dark:text-white mb-2">My Journey</h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {PROFILE.shortBio}
        </p>

        <div className="mb-4 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 aspect-[16/9] max-h-[180px] relative bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${PROFILE.youtubeVideoId}`}
            title={`${PROFILE.name}'s Story`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        <button
          onClick={() => navigateTo('story')}
          className="w-full py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          Read Full Story
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        </button>
      </div>
    </div>
  );
};