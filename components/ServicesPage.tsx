import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SERVICES, PROFILE } from '../constants';
import {
  SiOpenai, SiReact, SiPython, SiDocker,
} from 'react-icons/si';
import {
  FaRobot, FaCode, FaShieldAlt, FaBrain, FaCalendarAlt,
  FaEnvelope, FaArrowRight, FaCheck
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';

interface ServicesPageProps {
  onInquire: (serviceTitle: string) => void;
}

const serviceIcons: Record<string, { icon: React.ReactNode; gradient: string; accentColor: string }> = {
  "AI Agent Development": {
    icon: <FaRobot className="w-6 h-6" />,
    gradient: "from-sky-500 to-sky-600",
    accentColor: "#0EA5E9"
  },
  "Full-Stack Web App": {
    icon: <FaCode className="w-6 h-6" />,
    gradient: "from-sky-500 to-sky-600",
    accentColor: "#0EA5E9"
  },
  "Security Auditing": {
    icon: <FaShieldAlt className="w-6 h-6" />,
    gradient: "from-sky-500 to-sky-600",
    accentColor: "#0EA5E9"
  },
  "LLM Fine-Tuning": {
    icon: <FaBrain className="w-6 h-6" />,
    gradient: "from-sky-500 to-sky-600",
    accentColor: "#0EA5E9"
  }
};

const floatingIcons = [
  { Icon: SiOpenai, x: "10%", y: "20%", delay: 0 },
  { Icon: SiReact, x: "85%", y: "15%", delay: 0.5 },
  { Icon: SiPython, x: "75%", y: "75%", delay: 1 },
  { Icon: SiDocker, x: "15%", y: "80%", delay: 1.5 },
];

const ServicesPage: React.FC<ServicesPageProps> = ({ onInquire }) => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const handleBook = () => {
    if (PROFILE.calendly) {
      window.open(PROFILE.calendly, "_blank");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-100 min-h-full overflow-hidden">

      {/* ===== HERO SECTION (Compact) ===== */}
      <div className="relative py-8 sm:py-12 md:py-16 lg:py-20 flex items-center justify-center overflow-hidden">

        {/* Background Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-sky-500/5 to-sky-500/10 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        {/* Floating Icons (Hidden on mobile for performance) */}
        {floatingIcons.map(({ Icon, x, y, delay }, idx) => (
          <motion.div
            key={idx}
            className="absolute text-gray-200 dark:text-white/5 text-xl sm:text-2xl md:text-3xl hidden sm:block"
            style={{ left: x, top: y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{ delay, duration: 4, repeat: Infinity }}
          >
            <Icon />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] sm:text-xs font-bold mb-3 sm:mb-6">
              <HiSparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Open for Collaboration
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight mb-2 sm:mb-4">
              Turn Ideas Into <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">Reality</span>
            </h1>

            <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8 font-light px-2">
              Architecting autonomous AI agents and secure full-stack platforms that scale.
            </p>

            <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
              <button onClick={handleBook} className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-xl transition-all">
                Book a Free Call
              </button>
              <a href="#services" className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 sm:gap-2">
                Services <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== SERVICES GRID (Compact) ===== */}
      <div id="services" className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pb-10 sm:pb-16 md:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {SERVICES.map((service, index) => {
            const iconData = serviceIcons[service.title] || {
              icon: <FaCode className="w-6 h-6" />,
              gradient: "from-gray-500 to-gray-600",
              accentColor: "#6B7280"
            };
            const isHovered = hoveredService === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                className="group relative"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 overflow-hidden h-full flex flex-col hover:border-sky-500/30 transition-colors"
                >
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-200 dark:text-white/5 font-mono">0{index + 1}</div>

                  <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${iconData.gradient} text-white flex items-center justify-center mb-3 sm:mb-4 md:mb-6 shadow-md`}>
                    <div className="scale-75 sm:scale-90 md:scale-100">{iconData.icon}</div>
                  </div>

                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-sky-500 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 sm:mb-4 md:mb-6 font-light flex-1 line-clamp-3 sm:line-clamp-none">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-6">
                    {service.tags.slice(0, 2).map((tag, tIdx) => (
                      <span key={tIdx} className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[8px] sm:text-[10px] font-semibold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button onClick={handleBook} className="flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-[10px] sm:text-xs font-bold hover:opacity-90 transition-opacity">
                      Book Now
                    </button>
                    <button onClick={() => onInquire(service.title)} className="flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                      Inquire
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===== PROCESS (Horizontal & Compact) ===== */}
      <div className="border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0c0c0c] py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 text-center">
            {[
              { title: "Discovery", desc: "We align on vision & scope.", icon: <FaCalendarAlt /> },
              { title: "Plan & Build", desc: "Iterative development cycles.", icon: <HiLightningBolt /> },
              { title: "Deliver", desc: "Production-ready launch.", icon: <FaCheck /> },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 text-sm sm:text-base">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-[10px] sm:text-xs md:text-sm">{item.title}</h4>
                  <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ServicesPage;