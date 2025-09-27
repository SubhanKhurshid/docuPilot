import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { API_ENDPOINTS, apiCall } from '../../config/api';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Stripe configuration
const STRIPE_CONFIG = {
  PRICES: {
    YEARLY: 'price_1SBCiX83GuampwZSIV38fhCV',
  },
};

interface CheckoutFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm = ({ onSuccess, onError }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setLoading(true);

    try {
      // Confirm payment
      const { error: submitError } = await elements.submit();
      if (submitError) {
        onError(submitError.message || 'Failed to submit payment details');
        setLoading(false);
        return;
      }

      // Create setup intent for trial subscription
      const { setupIntentClientSecret, customerId } = await apiCall(API_ENDPOINTS.CREATE_SUBSCRIPTION, {
        method: 'POST',
        body: JSON.stringify({
          priceId: STRIPE_CONFIG.PRICES.YEARLY,
          clerkUserId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
        }),
      });

      // Confirm the setup intent (not payment - this is for trials)
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        clientSecret: setupIntentClientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?subscription=success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Setup failed');
        return;
      }

      // Complete the subscription creation
      await apiCall(API_ENDPOINTS.COMPLETE_SUBSCRIPTION, {
        method: 'POST',
        body: JSON.stringify({
          setupIntentId: setupIntent.id,
          clerkUserId: user.id,
          priceId: STRIPE_CONFIG.PRICES.YEARLY,
        }),
      });

      onSuccess();
    } catch (err) {
      console.error('Subscription error:', err);
      onError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
        <PaymentElement 
          options={{
            terms: {
              card: 'never',
            },
          }} 
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          `Start 7-Day Free Trial`
        )}
      </button>

      <p className="text-sm text-gray-400 text-center">
        Free for 7 days, then $167/year. Cancel anytime.
      </p>
    </form>
  );
};

interface SubscriptionCheckoutProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const SubscriptionCheckout = ({ onSuccess, onError }: SubscriptionCheckoutProps) => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check existing subscription
  useEffect(() => {
    if (user?.id) {
      apiCall(API_ENDPOINTS.REFRESH_SUBSCRIPTION, {
        method: 'POST',
        body: JSON.stringify({ clerkUserId: user.id }),
      }).then(response => {
        setSubscription(response.subscription);
      }).catch(() => {
        setSubscription(null);
      }).finally(() => {
        setSubscriptionLoading(false);
      });
    }
  }, [user?.id]);

  const handleCreateSetupIntent = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { clientSecret: setupClientSecret } = await apiCall(API_ENDPOINTS.CREATE_SETUP_INTENT, {
        method: 'POST',
        body: JSON.stringify({
          clerkUserId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
        }),
      });
      setClientSecret(setupClientSecret);
    } catch (err) {
      console.error('Setup intent error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    onSuccess?.();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    onError?.(errorMessage);
  };

  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-300">Loading subscription...</span>
      </div>
    );
  }

  if (subscription && (subscription.status === 'active' || subscription.status === 'trialing')) {
    return (
      <div className="text-center p-8 bg-green-900/20 rounded-lg border border-green-800">
        <h3 className="text-lg font-semibold text-green-400 mb-2">Already Subscribed!</h3>
        <p className="text-gray-300">
          You already have an active subscription. Status: {subscription.status}
        </p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        <h3 className="text-xl font-semibold text-white mb-4">DocuPilot Pro</h3>
        <div className="mb-6">
          <p className="text-3xl font-bold text-white">$167<span className="text-lg text-gray-400">/year</span></p>
          <p className="text-green-400 font-medium">7-day free trial</p>
        </div>
        <button
          onClick={handleCreateSetupIntent}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg transition-colors"
        >
          {loading ? 'Setting up...' : 'Start Free Trial'}
        </button>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#1f2937',
        colorText: '#f3f4f6',
        colorDanger: '#ef4444',
      },
    },
  };

  return (
    <div className="max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm onSuccess={handleSuccess} onError={handleError} />
      </Elements>
    </div>
  );
};
