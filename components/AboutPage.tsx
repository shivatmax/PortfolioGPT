import React from 'react';
import { motion } from 'framer-motion';
import { PROFILE, SKILLS_DATA, LEADERSHIP } from '../constants';
import {
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiNodedotjs,
  SiPython, SiAmazonwebservices, SiDocker,
  SiKubernetes, SiTerraform, SiPostgresql, SiMongodb, SiRedis,
  SiPytorch, SiLangchain, SiGithub, SiFigma, SiFramer, SiCplusplus,
  SiOpenjdk, SiNestjs, SiLinux, SiSplunk, SiWireshark, SiOpenai,
  SiJenkins, SiGit, SiVercel, SiSupabase, SiLinkedin, SiX
} from 'react-icons/si';
import { BsStars } from 'react-icons/bs';
import { FaBrain, FaShieldAlt, FaCloud, FaRobot } from 'react-icons/fa';

// Colorful icon configs with brand colors - adjusted for light/dark mode visibility
const skillIcons: { name: string; icon: React.ReactNode; color: string; lightBg: string; darkBg: string }[] = [
  { name: "React", icon: <SiReact />, color: "#61DAFB", lightBg: "rgba(97,218,251,0.15)", darkBg: "rgba(97,218,251,0.1)" },
  { name: "Next.js", icon: <SiNextdotjs />, color: "#000000", lightBg: "rgba(0,0,0,0.08)", darkBg: "rgba(255,255,255,0.1)" },
  { name: "TypeScript", icon: <SiTypescript />, color: "#3178C6", lightBg: "rgba(49,120,198,0.12)", darkBg: "rgba(49,120,198,0.15)" },
  { name: "Python", icon: <SiPython />, color: "#3776AB", lightBg: "rgba(55,118,171,0.12)", darkBg: "rgba(55,118,171,0.15)" },
  { name: "Tailwind", icon: <SiTailwindcss />, color: "#06B6D4", lightBg: "rgba(6,182,212,0.12)", darkBg: "rgba(6,182,212,0.15)" },
  { name: "Node.js", icon: <SiNodedotjs />, color: "#339933", lightBg: "rgba(51,153,51,0.12)", darkBg: "rgba(51,153,51,0.15)" },
  { name: "NestJS", icon: <SiNestjs />, color: "#E0234E", lightBg: "rgba(224,35,78,0.1)", darkBg: "rgba(224,35,78,0.15)" },
  { name: "AWS", icon: <SiAmazonwebservices />, color: "#FF9900", lightBg: "rgba(255,153,0,0.1)", darkBg: "rgba(255,153,0,0.15)" },
  { name: "Docker", icon: <SiDocker />, color: "#2496ED", lightBg: "rgba(36,150,237,0.12)", darkBg: "rgba(36,150,237,0.15)" },
  { name: "Kubernetes", icon: <SiKubernetes />, color: "#326CE5", lightBg: "rgba(50,108,229,0.12)", darkBg: "rgba(50,108,229,0.15)" },
  { name: "PostgreSQL", icon: <SiPostgresql />, color: "#4169E1", lightBg: "rgba(65,105,225,0.1)", darkBg: "rgba(65,105,225,0.15)" },
  { name: "MongoDB", icon: <SiMongodb />, color: "#47A248", lightBg: "rgba(71,162,72,0.12)", darkBg: "rgba(71,162,72,0.15)" },
  { name: "Redis", icon: <SiRedis />, color: "#DC382D", lightBg: "rgba(220,56,45,0.1)", darkBg: "rgba(220,56,45,0.15)" },
  { name: "PyTorch", icon: <SiPytorch />, color: "#EE4C2C", lightBg: "rgba(238,76,44,0.1)", darkBg: "rgba(238,76,44,0.15)" },
  { name: "LangChain", icon: <SiLangchain />, color: "#1C3C3C", lightBg: "rgba(28,60,60,0.1)", darkBg: "rgba(100,150,150,0.2)" },
  { name: "OpenAI", icon: <SiOpenai />, color: "#412991", lightBg: "rgba(65,41,145,0.1)", darkBg: "rgba(65,41,145,0.2)" },
  { name: "GitHub", icon: <SiGithub />, color: "#181717", lightBg: "rgba(0,0,0,0.08)", darkBg: "rgba(255,255,255,0.1)" },
  { name: "Figma", icon: <SiFigma />, color: "#F24E1E", lightBg: "rgba(242,78,30,0.1)", darkBg: "rgba(242,78,30,0.15)" },
  { name: "Framer", icon: <SiFramer />, color: "#0055FF", lightBg: "rgba(0,85,255,0.1)", darkBg: "rgba(0,85,255,0.15)" },
  { name: "Terraform", icon: <SiTerraform />, color: "#7B42BC", lightBg: "rgba(123,66,188,0.1)", darkBg: "rgba(123,66,188,0.15)" },
  { name: "Linux", icon: <SiLinux />, color: "#FCC624", lightBg: "rgba(252,198,36,0.15)", darkBg: "rgba(252,198,36,0.2)" },
  { name: "Splunk", icon: <SiSplunk />, color: "#000000", lightBg: "rgba(0,0,0,0.06)", darkBg: "rgba(255,255,255,0.1)" },
  { name: "Wireshark", icon: <SiWireshark />, color: "#1679A7", lightBg: "rgba(22,121,167,0.1)", darkBg: "rgba(22,121,167,0.15)" },
  { name: "C++", icon: <SiCplusplus />, color: "#00599C", lightBg: "rgba(0,89,156,0.1)", darkBg: "rgba(0,89,156,0.15)" },
  { name: "Java", icon: <SiOpenjdk />, color: "#ED8B00", lightBg: "rgba(237,139,0,0.1)", darkBg: "rgba(237,139,0,0.15)" },
  { name: "Jenkins", icon: <SiJenkins />, color: "#D24939", lightBg: "rgba(210,73,57,0.1)", darkBg: "rgba(210,73,57,0.15)" },
  { name: "Git", icon: <SiGit />, color: "#F05032", lightBg: "rgba(240,80,50,0.1)", darkBg: "rgba(240,80,50,0.15)" },
  { name: "Vercel", icon: <SiVercel />, color: "#000000", lightBg: "rgba(0,0,0,0.06)", darkBg: "rgba(255,255,255,0.1)" },
  { name: "Supabase", icon: <SiSupabase />, color: "#3ECF8E", lightBg: "rgba(62,207,142,0.12)", darkBg: "rgba(62,207,142,0.15)" },
  { name: "RAG", icon: <FaBrain />, color: "#EC4899", lightBg: "rgba(236,72,153,0.1)", darkBg: "rgba(236,72,153,0.15)" },
  { name: "GenAI", icon: <BsStars />, color: "#A855F7", lightBg: "rgba(168,85,247,0.1)", darkBg: "rgba(168,85,247,0.15)" },
  { name: "LLMs", icon: <FaRobot />, color: "#22D3EE", lightBg: "rgba(34,211,238,0.12)", darkBg: "rgba(34,211,238,0.15)" },
  { name: "Security", icon: <FaShieldAlt />, color: "#10B981", lightBg: "rgba(16,185,129,0.12)", darkBg: "rgba(16,185,129,0.15)" },
  { name: "Cloud", icon: <FaCloud />, color: "#6366F1", lightBg: "rgba(99,102,241,0.1)", darkBg: "rgba(99,102,241,0.15)" },
];

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-12 md:py-16 text-gray-800 dark:text-gray-100 font-sans">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center md:flex-row md:items-end gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-20"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-blue-500 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <motion.div
            whileHover={{ rotate: 3, scale: 1.02 }}
            className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl bg-gray-900 border-2 sm:border-4 border-white dark:border-[#1a1a1a] flex items-center justify-center overflow-hidden shadow-xl sm:shadow-2xl"
          >
            <img src="/photo.jpeg" alt={PROFILE.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </motion.div>
          {/* Social Icons - GitHub, LinkedIn, X */}
          <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-white dark:bg-[#1a1a1a] px-2 py-1.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex gap-2 sm:gap-4">
            <motion.a
              whileHover={{ scale: 1.2, y: -2 }}
              href={`https://${PROFILE.github}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <SiGithub className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, y: -2 }}
              href={`https://${PROFILE.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-[#0A66C2] transition-colors"
            >
              <SiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, y: -2 }}
              href={`https://${PROFILE.twitter}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <SiX className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-4"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-500 animate-pulse"></span>
            Available for new projects
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-1 sm:mb-2 text-gray-900 dark:text-white">
            Shiv <span className="italic font-light text-gray-400">Awasthi</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-medium text-gray-600 dark:text-gray-400 mb-3 sm:mb-6">
            Full-Stack LLM Engineer & Cybersecurity Expert
          </p>
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 bg-white dark:bg-[#121212] p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
            <div className="p-2 sm:p-3 bg-sky-50 dark:bg-sky-500/10 rounded-xl sm:rounded-2xl text-sky-600">
              <SiFramer className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Professional Summary</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">My Background</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg font-light">
            <p className="first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-gray-900 dark:first-letter:text-white first-letter:mr-2 sm:first-letter:mr-3 first-letter:float-left">
              {PROFILE.summary}
            </p>
          </div>

          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap gap-3 sm:gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={PROFILE.resumeUrl}
              className="inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
            >
              <SiTailwindcss className="w-4 h-4 sm:w-5 sm:h-5" />
              Download Resume
            </motion.a>
          </div>
        </motion.div>

        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-sky-600 text-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden group cursor-default"
          >
            <div className="relative z-10">
              <p className="text-sky-100 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 sm:mb-2">Operating from</p>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">{PROFILE.location}</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm bg-white/10 p-2 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-md border border-white/10">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Open to International Travel
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 dark:bg-white/5 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 hidden sm:block"
          >
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 sm:mb-6">Inbound Leadership</h4>
            <div className="space-y-4">
              {LEADERSHIP.slice(0, 3).map((l, i) => (
                <motion.div
                  key={i}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 flex items-center justify-center text-lg shadow-sm">
                    {['👑', '🎓', '🛠️'][i % 3]}
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-snug">{l}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ========== THE SECRET SAUCE - COLORFUL ICON GRID ========== */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center relative py-10 sm:py-16 md:py-20 overflow-hidden"
      >
        {/* Animated Background Glow */}
        {/* Animated Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/10 via-blue-500/10 to-sky-400/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 md:mb-16"
        >
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500 mb-2 sm:mb-4">My Skills</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 dark:text-white mb-2 sm:mb-4">
            The <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">Secret Sauce</span>
          </h2>
        </motion.div>

        {/* Colorful Icon Grid - Light/Dark Mode Aware */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto px-2">
          {skillIcons.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30, rotate: Math.random() * 10 - 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.03, type: "spring", stiffness: 200 }}
              whileHover={{
                scale: 1.15,
                rotate: 0,
                zIndex: 50,
              }}
              className="relative group cursor-pointer"
            >
              {/* Light mode card */}
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl md:text-2xl transition-all duration-300 shadow-md hover:shadow-xl dark:hidden"
                style={{
                  backgroundColor: skill.lightBg,
                  color: skill.color
                }}
              >
                {skill.icon}
              </div>

              {/* Dark mode card */}
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl md:text-2xl transition-all duration-300 shadow-md hover:shadow-xl hidden dark:flex border border-white/5"
                style={{
                  backgroundColor: skill.darkBg,
                  color: skill.color === "#000000" || skill.color === "#181717" ? "#ffffff" : skill.color
                }}
              >
                {skill.icon}
              </div>

              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-white text-white dark:text-gray-900 text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {skill.name}
              </div>

              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
                style={{ backgroundColor: skill.color, opacity: 0.3 }}
              ></div>
            </motion.div>
          ))}
        </div>

        {/* Floating Particles Effect - Hidden on mobile for performance */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 hidden md:block">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-sky-500/30 dark:bg-sky-400/20"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ========== EXPERTISE DOMAINS - Creative Visual Alternative ========== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-4 sm:mt-6 md:mt-8"
      >
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-2 sm:mb-3">What I Do Best</p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 dark:text-white">
            Expertise <span className="italic text-sky-500">Domains</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {SKILLS_DATA.map((group, gIdx) => {
            const gradients = [
              "from-sky-500/10 to-blue-500/10 dark:from-sky-500/20 dark:to-blue-500/20",
              "from-blue-500/10 to-sky-500/10 dark:from-blue-500/20 dark:to-sky-500/20",
              "from-gray-500/10 to-sky-500/10 dark:from-white/5 dark:to-sky-500/10",
              "from-sky-400/10 to-cyan-500/10 dark:from-sky-400/20 dark:to-cyan-500/20"
            ];
            const borderHover = [
              "hover:border-sky-300 dark:hover:border-sky-500/50",
              "hover:border-blue-300 dark:hover:border-blue-500/50",
              "hover:border-gray-300 dark:hover:border-white/20",
              "hover:border-cyan-300 dark:hover:border-cyan-500/50"
            ];

            return (
              <motion.div
                key={gIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gIdx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br ${gradients[gIdx % 4]} border border-gray-200 dark:border-white/10 ${borderHover[gIdx % 4]} transition-all duration-300 cursor-default overflow-hidden group`}
              >
                {/* Background Icon - Hidden on mobile */}
                <div className="absolute -right-4 -bottom-4 text-6xl sm:text-7xl md:text-8xl opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity hidden sm:block">
                  {group.icon}
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center text-base sm:text-xl md:text-2xl shadow-sm border border-gray-100 dark:border-white/10"
                    >
                      {group.icon}
                    </motion.div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-[10px] sm:text-xs md:text-sm uppercase tracking-tight">{group.category}</h4>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {group.skills.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 sm:px-2 py-0.5 bg-white/60 dark:bg-white/10 rounded-full text-[8px] sm:text-[10px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                    {group.skills.length > 4 && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-[8px] sm:text-[10px] font-bold">
                        +{group.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
};

export default AboutPage;