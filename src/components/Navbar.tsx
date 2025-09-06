import React from 'react';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return <nav className="w-full px-6 py-4 flex items-center justify-between bg-[#111111] border-b border-[#222222]">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-[#8dff2d] rounded-full p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="black" />
          </svg>
        </div>
        <span className="text-xl font-bold text-white">Clario</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-gray-300 hover:text-white transition-colors">
          Home
        </Link>
        <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
          Dashboard
        </Link>
        <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
          Pricing
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="px-4 py-2 rounded-full bg-[#222222] text-white hover:bg-[#333333] transition-colors">
          Login
        </Link>
        <Link to="/signup" className="px-4 py-2 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors">
          Signup
        </Link>
      </div>
    </nav>;
};
export default Navbar;