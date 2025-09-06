import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
const Signup = () => {
  return <div className="relative min-h-[calc(100vh-76px)] flex items-center justify-center px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#8dff2d 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
          {/* Glow effect */}
          <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-[#8dff2d] opacity-10 blur-[100px]" />
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#191919] rounded-2xl p-8 shadow-xl border border-[#333333]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create an account</h2>
            <p className="text-gray-400">
              Join Clario to take control of your finances
            </p>
          </div>
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input id="name" name="name" type="text" required className="block w-full pl-10 pr-3 py-3 bg-[#252525] border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent" placeholder="Enter your full name" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input id="email" name="email" type="email" autoComplete="email" required className="block w-full pl-10 pr-3 py-3 bg-[#252525] border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent" placeholder="Enter your email" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input id="password" name="password" type="password" autoComplete="new-password" required className="block w-full pl-10 pr-3 py-3 bg-[#252525] border border-[#333333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#8dff2d] focus:border-transparent" placeholder="Create a password" />
              </div>
            </div>
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 bg-[#252525] border-[#333333] rounded focus:ring-[#8dff2d] text-[#8dff2d]" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the{' '}
                <Link to="#" className="font-medium text-[#8dff2d] hover:text-[#7be525]">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="font-medium text-[#8dff2d] hover:text-[#7be525]">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <Link to="/dashboard" className="w-full flex justify-center items-center px-6 py-3 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors">
              Create account
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#8dff2d] hover:text-[#7be525]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default Signup;