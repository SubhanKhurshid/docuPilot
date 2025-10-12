// Utility function to parse and format section highlighting in chat messages

export interface SectionInfo {
  sectionName: string;
  content: string;
  isSection: boolean;
}

export const parseSectionHighlighting = (text: string): SectionInfo[] => {
  // Regex to match **Section Name**: content pattern
  const sectionRegex = /\*\*([^*]+)\*\*:\s*([^*]+?)(?=\*\*[^*]+\*\*:|$)/g;
  const parts: SectionInfo[] = [];
  let lastIndex = 0;
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    // Add any text before the section
    if (match.index > lastIndex) {
      const beforeText = text.slice(lastIndex, match.index).trim();
      if (beforeText) {
        parts.push({
          sectionName: '',
          content: beforeText,
          isSection: false
        });
      }
    }

    // Add the section
    parts.push({
      sectionName: match[1].trim(),
      content: match[2].trim(),
      isSection: true
    });

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text after the last section
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex).trim();
    if (remainingText) {
      parts.push({
        sectionName: '',
        content: remainingText,
        isSection: false
      });
    }
  }

  // If no sections found, return the whole text as non-section
  if (parts.length === 0) {
    parts.push({
      sectionName: '',
      content: text,
      isSection: false
    });
  }

  return parts;
};

export const getSectionColor = (sectionName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Personal Information': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'At-Fault Party Information': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Accident Details': 'bg-red-500/20 text-red-300 border-red-500/30',
    'Vehicle Information': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Injury Information': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Insurance Information': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'Witness Information': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Police/Accident Report': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'Accident Documentation': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'Additional Information': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    'Medical Treatment & Documentation': 'bg-teal-500/20 text-teal-300 border-teal-500/30'
  };

  return colorMap[sectionName] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};
