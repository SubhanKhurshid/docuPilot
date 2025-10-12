import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import {
  CheckIcon,
  ArrowRightIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  LoaderIcon,
} from 'lucide-react';

interface SubscriptionFlowProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SubscriptionFlow: React.FC<SubscriptionFlowProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupIntent, setSetupIntent] = useState<any>(null);

  const handleCreateSubscription = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.createSubscription({
        clerk_user_id: user.id,
        email: user.email,
      });

      setSetupIntent(response);
      setStep(2);
    } catch (error: any) {
      setError(error.message || 'Failed to create subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSubscription = async () => {
    if (!setupIntent || !user) return;

    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, you would:
      // 1. Use Stripe Elements to collect payment method
      // 2. Confirm the setup intent
      // 3. Complete the subscription

      // For demo purposes, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await apiClient.completeSubscription({
        clerk_user_id: user.id,
        setup_intent_id: setupIntent.setup_intent_client_secret,
        price_id: 'price_1234567890', // This would come from your Stripe dashboard
      });

      setStep(3);
    } catch (error: any) {
      setError(error.message || 'Failed to complete subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      title: 'Create Account',
      description: 'Set up your DocuPilot account',
      icon: <CheckIcon className="h-6 w-6" />,
    },
    {
      title: 'Payment Method',
      description: 'Add your payment information',
      icon: <CreditCardIcon className="h-6 w-6" />,
    },
    {
      title: 'Complete Setup',
      description: 'Start your free trial',
      icon: <ShieldCheckIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Subscription</h2>
          <p className="text-gray-600">Get started with DocuPilot in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step > index + 1
                    ? 'bg-green-500 border-green-500 text-white'
                    : step === index + 1
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {step > index + 1 ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    stepItem.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <CheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to DocuPilot!
              </h3>
              <p className="text-gray-600 mb-6">
                You're about to start your 7-day free trial. No credit card required until your trial ends.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  What's included in your trial:
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• AI-powered case evaluation</li>
                  <li>• Document generation tools</li>
                  <li>• Step-by-step guidance</li>
                  <li>• Progress tracking</li>
                </ul>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              <button
                onClick={handleCreateSubscription}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Start Free Trial
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Add Payment Method
              </h3>
              <p className="text-gray-600 mb-6">
                Your payment method will be charged $197/year after your 7-day free trial ends.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Don't worry!</strong> You won't be charged during your free trial period.
                  You can cancel anytime before the trial ends.
                </p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              <button
                onClick={handleCompleteSubscription}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Complete Setup
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to DocuPilot!
              </h3>
              <p className="text-gray-600 mb-6">
                Your subscription is now active. You can start using all features immediately.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  <strong>Your trial ends in 7 days.</strong> You can cancel anytime before then.
                </p>
              </div>
              <button
                onClick={onSuccess}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Dashboard
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <div className="text-sm text-gray-500">
              Secure payment powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFlow;
