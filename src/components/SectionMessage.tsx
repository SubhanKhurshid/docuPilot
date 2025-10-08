import React from 'react';
import { parseSectionHighlighting, getSectionColor, SectionInfo } from '../utils/sectionFormatter';

interface SectionMessageProps {
  content: string;
}

const SectionMessage: React.FC<SectionMessageProps> = ({ content }) => {
  const sections = parseSectionHighlighting(content);

  return (
    <div className="space-y-3">
      {sections.map((section, index) => (
        <div key={index}>
          {section.isSection ? (
            <div className="space-y-2">
              {/* Section Header */}
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getSectionColor(section.sectionName)}`}>
                <span className="w-2 h-2 rounded-full bg-current mr-2 opacity-70"></span>
                {section.sectionName}
              </div>
              {/* Section Content */}
              <div className="ml-2 pl-4 border-l-2 border-current/30">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-200">
                  {section.content}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-200">
              {section.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionMessage;
