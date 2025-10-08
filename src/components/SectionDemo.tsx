import React from 'react';
import SectionMessage from './SectionMessage';

const SectionDemo: React.FC = () => {
  const sampleMessage = `I'm DocuPilot AI, your personal injury case assistant. I'm here to help you navigate through the process and ensure you receive the support you need. I'm sorry to hear you're dealing with a personal injury case; that can be a really tough and stressful experience.

To get started, could you tell me a bit about your injury and how it happened? **Accident Details**: What were you doing when you got injured, and what type of accident did you have?`;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-2xl border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Section Highlighting Demo</h3>
      <div className="bg-gray-800 text-white border border-gray-700 rounded-2xl px-6 py-4">
        <SectionMessage content={sampleMessage} />
      </div>
    </div>
  );
};

export default SectionDemo;
