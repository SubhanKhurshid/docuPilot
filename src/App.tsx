import { Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Disclaimer from './pages/Disclaimer';

// Get Clerk publishable key from environment
const clerkPubKey = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

// Wrapper component to provide subscription context
const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <SubscriptionProvider userId={user?.id}>
      <div className="bg-[#111111] min-h-screen text-white font-sans flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route 
                path="/login" 
                element={
                  <div className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="w-full max-w-md">
                      <SignIn 
                        appearance={{
                          elements: {
                            rootBox: 'w-full',
                            card: 'bg-white shadow-2xl border-0 rounded-2xl p-8',
                            headerTitle: 'text-2xl font-bold text-gray-900 text-center mb-2',
                            headerSubtitle: 'text-gray-600 text-center mb-8',
                            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl',
                            formFieldInput: 'border-2 border-gray-200 focus:border-blue-500 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors',
                            formFieldLabel: 'text-gray-700 font-medium text-sm mb-2',
                            socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-medium py-3 rounded-lg transition-all',
                            footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
                            identityPreviewText: 'text-gray-600',
                            formResendCodeLink: 'text-blue-600 hover:text-blue-700',
                            otpCodeFieldInput: 'border-2 border-gray-200 focus:border-blue-500 rounded-lg text-center font-mono text-lg',
                          }
                        }}
                      />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <div className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="w-full max-w-md">
                      <SignUp 
                        appearance={{
                          elements: {
                            rootBox: 'w-full',
                            card: 'bg-white shadow-2xl border-0 rounded-2xl p-8',
                            headerTitle: 'text-2xl font-bold text-gray-900 text-center mb-2',
                            headerSubtitle: 'text-gray-600 text-center mb-8',
                            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl',
                            formFieldInput: 'border-2 border-gray-200 focus:border-blue-500 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors',
                            formFieldLabel: 'text-gray-700 font-medium text-sm mb-2',
                            socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-medium py-3 rounded-lg transition-all',
                            footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
                            identityPreviewText: 'text-gray-600',
                            formResendCodeLink: 'text-blue-600 hover:text-blue-700',
                            otpCodeFieldInput: 'border-2 border-gray-200 focus:border-blue-500 rounded-lg text-center font-mono text-lg',
                          }
                        }}
                      />
                    </div>
                  </div>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </SubscriptionProvider>
  );
};

export function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ClerkProvider>
  );
}