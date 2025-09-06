import React from 'react';
const ChatBubble = ({
  message,
  isUser
}) => {
  return <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-2xl ${isUser ? 'bg-[#8dff2d] text-black rounded-br-none' : 'bg-[#252525] text-white rounded-bl-none'}`}>
        <p>{message}</p>
      </div>
    </div>;
};
export default ChatBubble;