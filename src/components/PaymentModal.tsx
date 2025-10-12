import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {
  XIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  LoaderIcon,
  CheckIcon,
  AlertCircleIcon
} from 'lucide-react';
import { apiClient } from '../lib/api';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail: string;
  userId: string;
}

const PaymentForm: React.FC<{
  onSuccess: () => void;
  onClose: () => void;
  userEmail: string;
  userId: string;
}> = ({ onSuccess, onClose, userEmail, userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating payment intent for user:', userId, 'email:', userEmail);
      
      // Create payment intent
      const response = await apiClient.createPaymentIntent({
        clerk_user_id: userId,
        email: userEmail,
        amount: 19700, // $197.00 in cents
        currency: 'usd'
      });

      console.log('Payment intent response:', response);
      const { client_secret } = response;

      // Confirm payment
      console.log('Confirming payment with client_secret:', client_secret);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      console.log('Stripe confirmation result:', { stripeError, paymentIntent });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message || 'Payment failed');
        setIsLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        setIsProcessing(true);
        
        try {
          console.log('Creating subscription record for payment:', paymentIntent.id);
          
          // Create subscription record
          const recordResponse = await apiClient.createSubscriptionRecord({
            clerk_user_id: userId,
            stripe_payment_intent_id: paymentIntent.id,
            amount: 19700,
            currency: 'usd',
            status: 'completed'
          });

          console.log('Subscription record created:', recordResponse);

          // Wait a moment for processing
          setTimeout(() => {
            console.log('Payment flow completed, redirecting to dashboard');
            onSuccess();
          }, 1000);
        } catch (recordError) {
          console.error('Error creating subscription record:', recordError);
          setError('Payment succeeded but failed to create subscription record. Please contact support.');
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8dff2d] flex items-center justify-center"
        >
          <CheckIcon className="h-8 w-8 text-black" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">Setting up your account...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
        <p className="text-sm text-gray-600 mb-4">
          You'll be charged $197/year after your 7-day free trial.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8dff2d] focus-within:border-transparent">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#374151',
                    '::placeholder': {
                      color: '#9CA3AF',
                    },
                  },
                  invalid: {
                    color: '#EF4444',
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800"
          >
            <AlertCircleIcon className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
            <ShieldCheckIcon className="h-4 w-4" />
            Secure Payment
          </div>
          <p className="text-sm text-green-700">
            Your payment information is encrypted and secure. You won't be charged during your free trial.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 px-4 py-3 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCardIcon className="h-4 w-4" />
              Start Free Trial
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userEmail,
  userId
}) => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Configuration Error</h2>
                <p className="text-gray-600 mb-4">
                  Stripe publishable key is missing. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Complete Your Subscription</h2>
                  <p className="text-gray-600">Get started with DocuPilot</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <Elements stripe={stripePromise}>
                <PaymentForm
                  onSuccess={onSuccess}
                  onClose={onClose}
                  userEmail={userEmail}
                  userId={userId}
                />
              </Elements>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
