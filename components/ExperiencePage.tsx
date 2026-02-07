import React from 'react';
import { motion, Variants } from 'framer-motion';
import { EXPERIENCE, EDUCATION } from '../constants';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 }
  }
};

// Helper to generate initials from company name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Helper for random color based on index
const getBgColor = (index: number) => {
  // Sky Blue Theme Variations
  const colors = [
    'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-200',
    'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-200',
  ];
  return colors[index % colors.length];
};

const ExperiencePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-16 lg:py-20 text-gray-800 dark:text-gray-100 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-10 md:mb-16 lg:mb-24 text-center md:text-left"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Career Trajectory
        </h1>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
          A timeline of my professional journey, building scalable AI systems and securing digital infrastructures.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12 lg:gap-16">

        {/* Experience Column */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
            <span className="p-1.5 sm:p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
              <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Experience</h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative border-l border-gray-200 dark:border-white/10 ml-2 sm:ml-3 md:ml-3.5 lg:ml-4 space-y-6 sm:space-y-8 md:space-y-12"
          >
            {EXPERIENCE.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative pl-4 sm:pl-6 md:pl-8 lg:pl-10 group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] sm:-left-[7px] md:-left-[9px] top-4 sm:top-5 md:top-6 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full border-2 sm:border-3 md:border-4 border-white dark:border-[#212121] bg-gray-300 dark:bg-gray-600 group-hover:bg-sky-500 transition-colors duration-300 shadow-sm z-10" />

                <div className="relative p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-sky-500/30 dark:hover:border-sky-500/30 shadow-sm hover:shadow-lg sm:hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-3 md:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      {/* Company Logo */}
                      {exp.logo ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:border-sky-500 transition-colors flex-shrink-0"
                        >
                          {typeof exp.logo === 'string' ? (
                            <img
                              src={exp.logo}
                              alt={exp.company}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `<span class="font-bold text-[10px] sm:text-xs md:text-sm tracking-wider ${getBgColor(index)} w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl">${getInitials(exp.company)}</span>`;
                              }}
                            />
                          ) : (
                            <>
                              <img
                                src={exp.logo.light}
                                alt={exp.company}
                                className="w-full h-full object-cover dark:hidden"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = `<span class="font-bold text-[10px] sm:text-xs md:text-sm tracking-wider ${getBgColor(index)} w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl">${getInitials(exp.company)}</span>`;
                                }}
                              />
                              <img
                                src={exp.logo.dark}
                                alt={exp.company}
                                className="w-full h-full object-cover hidden dark:block"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = `<span class="font-bold text-[10px] sm:text-xs md:text-sm tracking-wider ${getBgColor(index)} w-full h-full flex items-center justify-center rounded-lg sm:rounded-xl">${getInitials(exp.company)}</span>`;
                                }}
                              />
                            </>
                          )}
                        </a>
                      ) : (
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-[10px] sm:text-xs md:text-sm tracking-wider ${getBgColor(index)}`}>
                          {getInitials(exp.company)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white leading-tight">{exp.role}</h3>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                          {exp.companyUrl ? (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sky-600 dark:text-sky-400 text-xs sm:text-sm hover:text-sky-700 dark:hover:text-sky-300 hover:underline transition-colors"
                            >
                              {exp.company}
                            </a>
                          ) : (
                            <span className="font-medium text-sky-600 dark:text-sky-400 text-xs sm:text-sm">{exp.company}</span>
                          )}
                          <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
                          <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">{exp.location}</span>
                        </div>
                        {exp.subtitle && (
                          <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-500 mt-0.5 italic">{exp.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 whitespace-nowrap self-start">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
                    {exp.description.slice(0, 3).map((desc, i) => (
                      <li key={i} className="flex items-start gap-1.5 sm:gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-sky-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        <span className="line-clamp-2 sm:line-clamp-none">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Education Column (Sticky on Desktop) */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
              <span className="p-1.5 sm:p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 0 6-3 6-3s3 3 6 3v-5" /></svg>
              </span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Education</h2>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-4 sm:space-y-6 md:space-y-8"
            >
              {EDUCATION.map((edu, index) => (
                <div key={index} className="relative pl-4 sm:pl-5 md:pl-6 border-l border-sky-500/20 dark:border-sky-500/20">
                  <div className="absolute -left-[4px] sm:-left-[5px] top-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-sky-500" />

                  {edu.institutionUrl ? (
                    <a
                      href={edu.institutionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-gray-900 dark:text-white leading-tight text-sm sm:text-base mb-1 sm:mb-2 block hover:text-sky-600 dark:hover:text-sky-400 hover:underline transition-colors"
                    >
                      {edu.institution}
                    </a>
                  ) : (
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight text-sm sm:text-base mb-1 sm:mb-2">{edu.institution}</h3>
                  )}
                  <div className="text-xs sm:text-sm font-medium text-sky-600 dark:text-sky-400 mb-1 sm:mb-2">{edu.degree}</div>
                  <div className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 sm:mb-3">{edu.period}</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-2 sm:p-3 rounded-lg border border-gray-100 dark:border-white/5 line-clamp-3 sm:line-clamp-none">
                    {edu.details}
                  </p>
                </div>
              ))}

              {/* Decorative Element - Hidden on mobile */}
              <div className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-600 to-blue-600 text-white shadow-lg mt-6 sm:mt-8 md:mt-10 relative overflow-hidden group hidden sm:block">
                <div className="relative z-10">
                  <div className="font-bold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1">Always Learning</div>
                  <p className="text-sky-100 text-[10px] sm:text-xs md:text-sm opacity-90">Currently exploring advanced agentic workflows and multi-modal models.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-20 sm:w-24 h-20 sm:h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExperiencePage;