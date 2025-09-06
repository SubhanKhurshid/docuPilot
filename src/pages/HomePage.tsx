import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, SendIcon } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
const HomePage = () => {
  const [messages, setMessages] = useState([{
    id: 1,
    text: "Hello! I'm Clario AI. I can help you take control of your finances.",
    isUser: false
  }, {
    id: 2,
    text: 'Would you like to learn how our platform works?',
    isUser: false
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const handleSendMessage = e => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    // Add user message
    setMessages([...messages, {
      id: Date.now(),
      text: inputValue,
      isUser: true
    }]);
    setInputValue('');
    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Great! To get started, you'll need to create an account or login.",
        isUser: false
      }]);
      setIsTyping(false);
    }, 1000);
  };
  return <div className="relative min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-[#111111]">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#8dff2d 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
          {/* Glow effect */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#8dff2d] opacity-10 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-[#8dff2d] opacity-5 blur-[80px]" />
        </div>
      </div>
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-[#1a1a1a] border border-[#333333]">
            <span className="text-[#8dff2d]">All-in-One Finance Toolkit</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Take control of your
            <br />
            finances — with clarity
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            All your money insights, finally in one place — track income,
            spending, and reach your goals with ease.
          </p>
          <Link to="/signup" className="inline-flex items-center px-6 py-3 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors">
            Get Started for Free
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
        {/* Chatbot Interface */}
        <div className="max-w-2xl mx-auto bg-[#191919] rounded-2xl shadow-xl overflow-hidden border border-[#333333]">
          <div className="p-4 border-b border-[#333333] flex items-center justify-between">
            <h3 className="font-semibold">Clario AI Assistant</h3>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-[#8dff2d] mr-2"></span>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
          <div className="h-96 overflow-y-auto p-4 flex flex-col gap-4" style={{
          scrollBehavior: 'smooth'
        }}>
            {messages.map(message => <ChatBubble key={message.id} message={message.text} isUser={message.isUser} />)}
            {isTyping && <div className="flex items-center gap-2 text-gray-400 ml-2">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="text-sm">Clario is typing...</span>
              </div>}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[#333333] flex gap-2">
            <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Type your message..." className="flex-1 bg-[#252525] border border-[#333333] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent" />
            <button type="submit" className="p-2 rounded-full bg-[#8dff2d] text-black hover:bg-[#7be525] transition-colors">
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
        {/* Call to action */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Ready to experience the full platform?
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="px-6 py-2 rounded-full border border-[#333333] text-white hover:bg-[#222222] transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-6 py-2 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default HomePage;