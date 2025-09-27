import React from 'react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, timestamp }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`p-3 rounded-2xl ${isUser ? 'bg-[#8dff2d] text-black rounded-br-none' : 'bg-[#252525] text-white rounded-bl-none'}`}>
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <div className={`text-xs text-gray-400 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;