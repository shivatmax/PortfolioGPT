import React from 'react';
import { SKILLS_DATA } from '../constants';

const SkillsWidget: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mt-10 px-4 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
          Technical Arsenal
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SKILLS_DATA.map((category, idx) => (
          <div
            key={idx}
            className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-white/5">
              <span className="text-lg">{category.icon}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                {category.category}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-1 bg-white dark:bg-black/20 rounded-md text-[11px] font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsWidget;