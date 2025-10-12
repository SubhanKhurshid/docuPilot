import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { UserIcon, LogOutIcon } from 'lucide-react';
import { SignedIn } from '@clerk/clerk-react';
const Navbar = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
    setShowUserMenu(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <SignedIn>
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          </SignedIn>
          {!hasActiveSubscription && (
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#222222] text-white hover:bg-[#333333] transition-colors"
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#8dff2d] flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-black" />
                  </div>
                )}
                <span>{user?.firstName || user?.email}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#222222] rounded-lg shadow-lg border border-[#333333] z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-[#333333]">
                      {user?.email}
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-white hover:bg-[#333333] transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-[#333333] transition-colors flex items-center gap-2"
                    >
                      <LogOutIcon className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-full bg-[#222222] text-white hover:bg-[#333333] transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors">
                Signup
              </Link>
            </>
          )}
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
            <SignedIn>
            <Link
              to="/dashboard"
              className="block text-gray-300 hover:text-white hover:bg-[#222222] transition-colors py-3 px-4 rounded-lg text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            </SignedIn>
            {!hasActiveSubscription && (
              <Link
                to="/pricing"
                className="block text-gray-300 hover:text-white hover:bg-[#222222] transition-colors py-3 px-4 rounded-lg text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            )}

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-3 pt-6 border-t border-[#333333]">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-300">
                    {user?.email}
                  </div>
                  <Link
                    to="/dashboard"
                    className="px-6 py-3 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors text-center text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-6 py-3 rounded-full bg-[#222222] text-white hover:bg-[#333333] transition-colors text-center text-lg font-medium flex items-center justify-center gap-2"
                  >
                    <LogOutIcon className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-full bg-[#222222] text-white hover:bg-[#333333] transition-colors text-center text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-3 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors text-center text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;