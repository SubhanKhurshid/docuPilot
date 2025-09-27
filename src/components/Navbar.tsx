import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full px-6 py-4 bg-[#111111] border-b border-[#222222] relative">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#8dff2d] rounded-full p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="black" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">DocuPilot</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>

          <Link to="/chat" className="text-gray-300 hover:text-white transition-colors">
            AI Chat
          </Link>
        

          <SignedIn>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
          </SignedIn>

          <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" redirectUrl="/dashboard">
              <button className="px-4 py-2 rounded-full bg-[#222222] text-white hover:bg-[#333333] transition-colors">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal" redirectUrl="/dashboard">
              <button className="px-4 py-2 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors">
                Signup
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorPrimary: "#8dff2d",
                  colorBackground: "#191919",
                  colorText: "#ffffff",
                  colorTextSecondary: "#9ca3af",
                  borderRadius: "0.75rem",
                },
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-[#333333] hover:border-[#8dff2d] transition-colors",
                  userButtonPopoverCard: "bg-[#191919] border border-[#333333] shadow-xl rounded-xl",
                  userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-[#222222] transition-colors rounded-lg",
                  userButtonPopoverActionButtonText: "text-gray-300 hover:text-white font-medium",
                  userButtonPopoverActionButtonIcon: "text-gray-400 hover:text-[#8dff2d]",
                  userButtonPopoverFooter: "border-t border-[#333333] bg-[#191919]",
                }
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#111111] border-b border-[#222222] shadow-lg z-50">
          <div className="px-6 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              className="block text-gray-300 hover:text-white hover:bg-[#222222] transition-colors py-3 px-4 rounded-lg text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/chat"
              className="block text-gray-300 hover:text-white hover:bg-[#222222] transition-colors py-3 px-4 rounded-lg text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Chat
            </Link>
         
            <SignedIn>
              <Link
                to="/dashboard"
                className="block text-gray-300 hover:text-white hover:bg-[#222222] transition-colors py-3 px-4 rounded-lg text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </SignedIn>

            <Link
              to="/pricing"
              className="block text-gray-300 hover:text-white hover:bg-[#222222] transition-colors py-3 px-4 rounded-lg text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-3 pt-6 border-t border-[#333333]">
              <SignedOut>
                <SignInButton mode="modal" redirectUrl="/dashboard">
                  <button 
                    className="px-6 py-3 rounded-full bg-[#222222] text-white hover:bg-[#333333] transition-colors text-center text-lg font-medium w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" redirectUrl="/dashboard">
                  <button 
                    className="px-6 py-3 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors text-center text-lg w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-between py-3 px-4">
                  <span className="text-gray-300 text-lg">Account</span>
                  <UserButton 
                    appearance={{
                      baseTheme: undefined,
                      variables: {
                        colorPrimary: "#8dff2d",
                        colorBackground: "#191919",
                        colorText: "#ffffff",
                        colorTextSecondary: "#9ca3af",
                        borderRadius: "0.75rem",
                      },
                      elements: {
                        avatarBox: "w-10 h-10 border-2 border-[#333333] hover:border-[#8dff2d] transition-colors",
                        userButtonPopoverCard: "bg-[#191919] border border-[#333333] shadow-xl rounded-xl",
                        userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-[#222222] transition-colors rounded-lg",
                        userButtonPopoverActionButtonText: "text-gray-300 hover:text-white font-medium",
                        userButtonPopoverActionButtonIcon: "text-gray-400 hover:text-[#8dff2d]",
                        userButtonPopoverFooter: "border-t border-[#333333] bg-[#191919]",
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;