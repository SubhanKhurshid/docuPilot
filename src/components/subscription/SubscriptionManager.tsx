import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { API_ENDPOINTS, apiCall } from '../../config/api';
import { format } from 'date-fns';

interface SubscriptionData {
  clerkUserId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  status: string;
  currentPeriodEnd?: string;
  createdAt?: string;
}

export const SubscriptionManager = () => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const refreshSubscription = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(API_ENDPOINTS.REFRESH_SUBSCRIPTION, {
        method: 'POST',
        body: JSON.stringify({
          clerkUserId: user.id,
        }),
      });

      if (response.subscription) {
        setSubscription(response.subscription);
      }
    } catch (err) {
      console.error('Refresh subscription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSubscription = async () => {
    try {
      setRefreshing(true);
      setRefreshError(null);
      
      const response = await apiCall(API_ENDPOINTS.REFRESH_SUBSCRIPTION, {
        method: 'POST',
        body: JSON.stringify({
          clerkUserId: user?.id,
        }),
      });

      if (response.subscription) {
        setSubscription(response.subscription);
      }
    } catch (err) {
      console.error('Refresh subscription error:', err);
      setRefreshError(err instanceof Error ? err.message : 'Failed to refresh subscription');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      refreshSubscription();
    }
  }, [user?.id]);

  const handleCancelSubscription = async () => {
    if (!subscription || !user) return;

    setCanceling(true);
    setCancelError(null);

    try {
      await apiCall(API_ENDPOINTS.CANCEL_SUBSCRIPTION, {
        method: 'POST',
        body: JSON.stringify({
          subscriptionId: subscription.stripeSubscriptionId,
          clerkUserId: user.id,
        }),
      });

      // Refresh subscription data
      await refreshSubscription();
    } catch (err) {
      console.error('Cancel subscription error:', err);
      setCancelError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setCanceling(false);
    }
  };


  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'trialing':
        return 'text-blue-400';
      case 'past_due':
        return 'text-yellow-400';
      case 'canceled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Free Trial';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      case 'incomplete':
        return 'Setup Required';
      case 'incomplete_expired':
        return 'Setup Expired';
      case 'unpaid':
        return 'Unpaid';
      default:
        return status;
    }
  };

  const getDaysRemaining = (endDate: string | null | undefined) => {
    if (!endDate) return null;
    try {
      const end = new Date(endDate);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-300">Loading subscription...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Subscription</h3>
        <p className="text-red-300">{error}</p>
        <button
          onClick={refreshSubscription}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">No Active Subscription</h3>
        <p className="text-gray-400 mb-4">You don't have an active subscription yet.</p>
        <button
          onClick={() => window.location.href = '/pricing'}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          View Plans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Subscription Details</h3>
          <button
            onClick={handleRefreshSubscription}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {refreshError && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{refreshError}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <p className={`text-lg font-semibold capitalize ${getStatusColor(subscription.status)}`}>
              {getStatusLabel(subscription.status)}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {subscription.status === 'trialing' ? 'Trial Ends' : 'Next Billing'}
            </label>
            <p className="text-lg text-white">
              {formatDate(subscription.currentPeriodEnd || null)}
            </p>
            {subscription.status === 'trialing' && (
              <p className="text-sm text-blue-400 font-medium">
                {(() => {
                  const daysLeft = getDaysRemaining(subscription.currentPeriodEnd || null);
                  if (daysLeft === null) return '';
                  if (daysLeft === 0) return 'Trial ends today';
                  if (daysLeft === 1) return '1 day remaining';
                  return `${daysLeft} days remaining`;
                })()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Plan</label>
            <p className="text-lg text-white">DocuPilot Pro</p>
            <p className="text-sm text-gray-400">$167/year</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Created</label>
            <p className="text-lg text-white">
              {formatDate(subscription.createdAt || null)}
            </p>
          </div>
        </div>
      </div>

      {subscription.status === 'trialing' && (
        <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-400 mb-2">Free Trial Active</h4>
          <div className="mb-3">
            {(() => {
              const daysLeft = getDaysRemaining(subscription.currentPeriodEnd || null);
              if (daysLeft === null) return null;
              return (
                <div className="text-2xl font-bold text-blue-300">
                  {daysLeft === 0 ? 'Last Day!' : daysLeft === 1 ? '1 Day Left' : `${daysLeft} Days Left`}
                </div>
              );
            })()}
          </div>
          <p className="text-gray-300">
            Your free trial ends on {formatDate(subscription.currentPeriodEnd || null)}. 
            You'll be automatically charged $167 for a full year unless you cancel before then.
          </p>
        </div>
      )}

      {(subscription.status === 'active' || subscription.status === 'trialing') && (
        <div className="p-6 bg-gray-800 rounded-lg">
          <h4 className="text-lg font-semibold text-white mb-4">Manage Subscription</h4>
          
          {cancelError && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400">{cancelError}</p>
            </div>
          )}

          <button
            onClick={handleCancelSubscription}
            disabled={canceling}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {canceling ? 'Canceling...' : 'Cancel Subscription'}
          </button>
          
          <p className="text-sm text-gray-400 mt-2">
            You'll retain access until the end of your current billing period.
          </p>
        </div>
      )}

      {subscription.status === 'past_due' && (
        <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
          <h4 className="text-lg font-semibold text-yellow-400 mb-2">Payment Required</h4>
          <p className="text-gray-300 mb-4">
            Your subscription payment failed. Please update your payment method to continue using DocuPilot Pro.
          </p>
          <button
            onClick={() => {
              // In a real app, you'd redirect to a payment update page
              window.location.href = '/pricing';
            }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Update Payment Method
          </button>
        </div>
      )}
    </div>
  );
};
