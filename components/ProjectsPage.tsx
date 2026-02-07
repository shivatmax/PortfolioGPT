import React from 'react';
import { motion } from 'framer-motion';
import { PROJECTS, CERTIFICATIONS, AWARDS } from '../constants';
import { SiGithub, SiReact } from 'react-icons/si';
import { FaExternalLinkAlt } from 'react-icons/fa';

// Map project names to their respective screenshot images (fallback for projects without image field)
const projectImages: Record<string, string> = {
   "QuickCareer.ai": "/images/projects/quickcareer.png",
   "SocialFlow AI": "/images/projects/linkedin-comment-menu.png",
   "Web3CLI - AI Smart Contract Generator": "/images/projects/web3ailogo.png",
   "ChitChatAI - Multi-Agent Platform": "/images/projects/chitchat.png",
   "Space Tourism App": "/images/projects/space.png",
   "MultiPDF- AI": "/images/projects/gemini.png",
   "B L O G Website": "/images/projects/blog.png",
   "University Attendance App": "/images/projects/flutter.png",
   "S C R A P Y - Job Scraper": "/images/projects/scrappy.png",
   "S T O C K Y - Stock Market AI": "/images/projects/stocky3-b.png",
   "I S I C - Skin Lesion Classification": "/images/projects/hugginface.png"
};

const ProjectsPage: React.FC = () => {
   return (
      <div className="w-full bg-white dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-100 min-h-full">

         {/* Hero Header */}
         <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-6 md:pb-8 text-center">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
            >
               <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-gray-400 uppercase mb-2 sm:mb-3">Case Studies</p>
               <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif">
                  <span className="text-gray-900 dark:text-white">Curated </span>
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">work</span>
               </h1>
            </motion.div>
         </div>

         {/* Projects List */}
         <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 pb-10 sm:pb-16 md:pb-20 space-y-10 sm:space-y-16 md:space-y-24">
            {PROJECTS.map((project, index) => {
               // Parse description into bullets if possible
               const bullets = project.description.split('. ').filter(b => b.trim().length > 0);
               const techList = project.tech.split(',').map(t => t.trim());
               // Get image from project data, then mapping, then fallback
               const imageSrc = (project as any).image || projectImages[project.name] || "/images/projects/portfolio.png";

               return (
                  <motion.div
                     key={index}
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     transition={{ duration: 0.7, ease: "easeOut" }}
                     className="group relative"
                  >
                     {/* Background Glow - Hidden on mobile */}
                     <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-[1.5rem] sm:rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 hidden sm:block"></div>

                     <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-8 xl:gap-12 items-center">

                        {/* Visual Card (Image) */}
                        <div className="w-full lg:w-1/2 relative group/image">
                           <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-900 aspect-video group-hover/image:shadow-xl sm:group-hover/image:shadow-2xl transition-all duration-500">
                              {/* Overlay Gradient on Hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 z-10"></div>

                              {/* Image with slight zoom on hover */}
                              <img
                                 src={imageSrc}
                                 alt={project.name}
                                 className="w-full h-full object-cover transform group-hover/image:scale-105 transition-transform duration-700"
                              />
                           </div>

                           {/* Decorative Floating Dots - Hidden on mobile */}
                           <div className="absolute -top-3 -right-3 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-full blur-xl -z-10 animate-pulse hidden sm:block"></div>
                           <div className="absolute -bottom-3 -left-3 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-tr from-sky-500/20 to-cyan-500/20 rounded-full blur-xl -z-10 animate-pulse delay-700 hidden sm:block"></div>
                        </div>

                        {/* Content */}
                        <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 md:space-y-6">

                           {/* Title & Line */}
                           <div>
                              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                 <span className="text-[10px] sm:text-xs font-bold text-sky-500 tracking-wider">0{index + 1}</span>
                                 <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                              </div>
                              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:to-sky-600 transition-colors duration-300">
                                 {project.name}
                              </h3>
                           </div>

                           {/* Tech Stack Pills */}
                           <div className="flex flex-wrap gap-1 sm:gap-2">
                              {techList.slice(0, 3).map((tech, tIdx) => (
                                 <span
                                    key={tIdx}
                                    className="px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-semibold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5"
                                 >
                                    {tech}
                                 </span>
                              ))}
                           </div>

                           {/* Description */}
                           <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed space-y-1 sm:space-y-2 line-clamp-3 sm:line-clamp-none">
                              {bullets.map((bullet, bIdx) => (
                                 <p key={bIdx}>{bullet.endsWith('.') ? bullet : bullet + '.'}</p>
                              ))}
                           </div>

                           {/* Action Buttons */}
                           <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                              {project.links && project.links.length > 0 && project.links.map((link, lIdx) => (
                                 <a
                                    key={lIdx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white border-b-2 border-transparent hover:border-sky-500 transition-all pb-0.5"
                                 >
                                    {link.url.includes('github') ? <SiGithub /> : <FaExternalLinkAlt className="text-xs" />}
                                    {link.label || (link.url.includes('github') ? 'Code' : 'Live Demo')}
                                    <span className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-sky-500">→</span>
                                 </a>
                              ))}
                              {/* If only one link exist, try to add github if available in constants but usually constants has a single link obj. Assuming separate logic if needed, but keeping it simple as per data structure. */}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               );
            })}
         </div>

         {/* Credentials Section - Minimalist */}
         <div className="border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#0c0c0c] py-10 sm:py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                  {/* Certifications */}
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                     <h4 className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">
                        <span className="w-6 sm:w-8 h-[1px] bg-sky-500"></span>
                        Certifications
                     </h4>
                     <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {CERTIFICATIONS.map((cert, i) => (
                           <motion.li
                              key={i}
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-2 sm:gap-3 group"
                           >
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 mt-1.5 sm:mt-2 rounded-full bg-gray-300 dark:bg-white/20 group-hover:bg-sky-500 transition-colors"></div>
                              <div className="flex flex-col">
                                 <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors hover:underline"
                                 >
                                    {cert.name}
                                 </a>
                                 <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 hidden sm:block">{cert.description}</span>
                              </div>
                           </motion.li>
                        ))}
                     </ul>
                  </div>

                  {/* Awards */}
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                     <h4 className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">
                        <span className="w-6 sm:w-8 h-[1px] bg-sky-500"></span>
                        Honors & Awards
                     </h4>
                     <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {AWARDS.slice(0, 4).map((award, i) => (
                           <motion.li
                              key={i}
                              whileHover={{ x: 5 }}
                              className="flex items-start gap-2 sm:gap-3 group cursor-default"
                           >
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 mt-1.5 sm:mt-2 rounded-full bg-gray-300 dark:bg-white/20 group-hover:bg-sky-500 transition-colors"></div>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{award}</span>
                           </motion.li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
         </div>

      </div>
   );
};

export default ProjectsPage;