import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'
const Pricing = () => {
  const features = [
    'Unlimited expense tracking',
    'Budget planning tools',
    'Financial insights and reports',
    'Goal setting and tracking',
    'Bill reminders and alerts',
    'Investment portfolio tracking',
    'AI-powered financial assistant',
    'Bank account synchronization',
    'Export data to CSV/PDF',
  ]
  return (
    <div className="relative min-h-[calc(100vh-76px)] w-full">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#8dff2d 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
          {/* Glow effects */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#8dff2d] opacity-10 blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full bg-[#8dff2d] opacity-5 blur-[80px]" />
        </div>
      </div>
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-[#1a1a1a] border border-[#333333]">
            <span className="text-[#8dff2d]">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            One plan.
            <br />
            <span className="text-[#8dff2d]">Everything included.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get full access to AI-powered form filling, PDF generation, and document management all for one simple annual fee.
          </p>
        </div>
        {/* Pricing Card */}
        <div className="max-w-lg mx-auto bg-[#191919] rounded-2xl overflow-hidden border border-[#333333] shadow-xl mb-16">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Annual Plan</h2>
                <p className="text-gray-400">Full access to all features</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-5xl font-bold">$19</div>
                <div className="text-gray-400">per year</div>
              </div>
            </div>
            <div className="border-t border-[#333333] my-6"></div>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-[#8dff2d] mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                to="/signup"
                className="block w-full text-center px-6 py-4 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors"
              >
                Get Started Now
                <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
              </Link>
              <p className="text-center text-sm text-gray-400 mt-4">
                30-day money-back guarantee. No questions asked.
              </p>
            </div>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-[#191919] rounded-xl p-6 border border-[#333333]">
              <h3 className="text-xl font-semibold mb-2">
                What's included in the $19/year plan?
              </h3>
              <p className="text-gray-400">
                Everything. You’ll get unlimited access to our AI chatbot, automated PDF generation for all required forms, your member dashboard, and email reminders.
              </p>
            </div>
            <div className="bg-[#191919] rounded-xl p-6 border border-[#333333]">
              <h3 className="text-xl font-semibold mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-400">
                Absolutely. You can cancel your subscription at any time. If you
                cancel within the first 30 days, we'll refund your payment in
                full.
              </p>
            </div>
            <div className="bg-[#191919] rounded-xl p-6 border border-[#333333]">
              <h3 className="text-xl font-semibold mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-400">
                Absolutely. We use enterprise-grade encryption to protect your personal information, and your documents are stored securely.
              </p>
            </div>
            <div className="bg-[#191919] rounded-xl p-6 border border-[#333333]">
              <h3 className="text-xl font-semibold mb-2">
                Who is this service for?
              </h3>
              <p className="text-gray-400">
                Anyone who needs help completing multiple legal or claims documents — without the hassle of filling out endless forms by hand.
              </p>
            </div>
          </div>
        </div>
        {/* Call to action */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your future?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Join thousands of users who have already taken control of their
            documents with Clario.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-full bg-[#8dff2d] text-black font-medium hover:bg-[#7be525] transition-colors"
            >
              Start Your Free Trial
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-full border border-[#333333] text-white hover:bg-[#222222] transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Pricing
