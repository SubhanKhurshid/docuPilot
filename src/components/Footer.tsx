import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#222222] py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#8dff2d] rounded-full p-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="black" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">DocuPilot</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your case, your settlement—AI powered. Maximize your personal injury settlements with our comprehensive AI-driven tools and expert guidance.
            </p>
           
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#8dff2d] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-[#8dff2d] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/pricing#faq" className="text-gray-400 hover:text-[#8dff2d] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-[#8dff2d] transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/disclaimer" className="text-gray-400 hover:text-[#8dff2d] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-[#8dff2d] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-[#8dff2d] transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#222222] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} DocuPilot. All rights reserved.
            </p>
            <div className="text-gray-400 text-sm">
              <p>
                <strong>Disclaimer:</strong> This website is not a law firm and does not provide legal advice. 
                We use AI tools to supply self-help information and organizational forms for personal injury claims. 
                Using this site does not create an attorney-client relationship. 
                For legal advice or representation, consult a licensed attorney.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
