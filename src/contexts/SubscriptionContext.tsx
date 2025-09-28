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

interface SubscriptionProviderProps {
  children: ReactNode;
  userId: string;
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
    }
  }, [userId]);

  const refreshSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.refreshSubscription(userId);
      setSubscription(response.subscription);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (email: string) => {
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
