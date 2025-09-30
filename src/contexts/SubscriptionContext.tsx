import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api';

interface Subscription {
  clerk_user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: string;
  current_period_end: string | null;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  hasActiveSubscription: boolean;
  refreshSubscription: () => Promise<void>;
  createSubscription: (email: string) => Promise<any>;
  completeSubscription: (setupIntentId: string, priceId: string) => Promise<any>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// Safe version that can be used outside of SubscriptionProvider
export const useSubscriptionSafe = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    return {
      subscription: null,
      isLoading: false,
      hasActiveSubscription: false,
      refreshSubscription: async () => {},
      createSubscription: async (_email: string) => ({}),
      completeSubscription: async (_setupIntentId: string, _priceId: string) => ({}),
      cancelSubscription: async (_subscriptionId: string) => {},
    };
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
  userId?: string;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ 
  children, 
  userId 
}) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      refreshSubscription();
    } else {
      setIsLoading(false);
      setSubscription(null);
    }
  }, [userId]);

  const refreshSubscription = async () => {
    if (!userId) {
      setIsLoading(false);
      setSubscription(null);
      return;
    }
    try {
      setIsLoading(true);
      const response = await apiClient.refreshSubscription(userId);
      setSubscription((response as any)?.subscription || null);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (email: string) => {
    if (!userId) {
      throw new Error('User ID is required to create a subscription');
    }
    try {
      const response = await apiClient.createSubscription({
        clerk_user_id: userId,
        email,
      });
      return response;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const completeSubscription = async (setupIntentId: string, priceId: string) => {
    if (!userId) {
      throw new Error('User ID is required to complete a subscription');
    }
    try {
      const response = await apiClient.completeSubscription({
        clerk_user_id: userId,
        setup_intent_id: setupIntentId,
        price_id: priceId,
      });
      await refreshSubscription();
      return response;
    } catch (error) {
      console.error('Error completing subscription:', error);
      throw error;
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    if (!userId) {
      throw new Error('User ID is required to cancel a subscription');
    }
    try {
      await apiClient.cancelSubscription(subscriptionId, userId);
      await refreshSubscription();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  };

  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    hasActiveSubscription,
    refreshSubscription,
    createSubscription,
    completeSubscription,
    cancelSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
