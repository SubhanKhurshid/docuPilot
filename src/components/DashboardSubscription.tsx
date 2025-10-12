import React, { useState, useEffect } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { apiClient } from '../lib/api';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  AlertCircleIcon,
  CalendarIcon,
  CrownIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  ClockIcon,
} from 'lucide-react';

interface DashboardSubscriptionProps {
  userId: string;
}

const DashboardSubscription: React.FC<DashboardSubscriptionProps> = ({ userId }) => {
  const { 
    subscription, 
    isLoading, 
    hasActiveSubscription, 
    refreshSubscription,
    cancelSubscription 
  } = useSubscription();
  
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    subscription_id?: string;
    current_period_end?: string;
    customer_id?: string;
  } | null>(null);

  // Fetch subscription details including trial days
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await apiClient.checkSubscription({
          clerk_user_id: userId
        });
        if (response.trial_days_left !== undefined) {
          setTrialDaysLeft(response.trial_days_left);
        }
        // Store all subscription details
        setSubscriptionDetails({
          subscription_id: response.subscription_id,
          current_period_end: response.current_period_end,
          customer_id: response.customer_id,
        });
      } catch (error) {
        console.error('Error fetching subscription details:', error);
      }
    };

    if (userId && hasActiveSubscription) {
      fetchSubscriptionDetails();
    }
  }, [userId, hasActiveSubscription]);

  const handleRefreshSubscription = async () => {
    setIsRefreshing(true);
    try {
      await refreshSubscription();
      // Also refresh trial days and subscription details
      const response = await apiClient.checkSubscription({
        clerk_user_id: userId
      });
      if (response.trial_days_left !== undefined) {
        setTrialDaysLeft(response.trial_days_left);
      }
      // Update subscription details
      setSubscriptionDetails({
        subscription_id: response.subscription_id,
        current_period_end: response.current_period_end,
        customer_id: response.customer_id,
      });
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;
    
    setIsCanceling(true);
    try {
      await cancelSubscription(subscription.stripe_subscription_id);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription. Please try again or contact support.');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">
          <AlertCircleIcon className="h-4 w-4" />
          No Subscription
        </span>
      );
    }

    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-900/30 text-green-400 border border-green-600">
            <CheckCircleIcon className="h-4 w-4" />
            Active
          </span>
        );
      case 'trialing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400 border border-blue-600">
            <CheckCircleIcon className="h-4 w-4" />
            Trial Period
          </span>
        );
      case 'canceled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-900/30 text-red-400 border border-red-600">
            <XCircleIcon className="h-4 w-4" />
            Canceled
          </span>
        );
      case 'incomplete':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-600">
            <AlertCircleIcon className="h-4 w-4" />
            Incomplete
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8dff2d] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
            <p className="text-gray-400">Manage your DocuPilot subscription and billing</p>
          </div>
          <button
            onClick={handleRefreshSubscription}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh subscription"
          >
            <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Current Subscription Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#8dff2d]/10 flex items-center justify-center">
                <CrownIcon className="h-6 w-6 text-[#8dff2d]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {hasActiveSubscription ? 'Professional Plan' : 'No Active Plan'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {hasActiveSubscription ? '$197/year' : 'Subscribe to access all features'}
                </p>
              </div>
            </div>
            {getStatusBadge(subscription?.status)}
          </div>

          {subscription && hasActiveSubscription && (
            <>
              {/* Trial Days Banner */}
              {subscription.status === 'trialing' && trialDaysLeft !== null && (
                <div className="mb-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-blue-300 mb-1">
                        {trialDaysLeft} {trialDaysLeft === 1 ? 'Day' : 'Days'} Left in Your Trial
                      </h3>
                      <p className="text-blue-200 text-sm">
                        Your trial ends on {formatDate(subscriptionDetails?.current_period_end || null)}. 
                        Enjoy full access to all features until then!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {subscription.status === 'trialing' ? 'Trial Ends' : 'Current Period Ends'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {formatDate(subscriptionDetails?.current_period_end || null)}
                  </p>
                </div>

                <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCardIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Subscription ID</span>
                  </div>
                  <p className="text-sm font-mono text-white truncate">
                    {subscriptionDetails?.subscription_id || 'N/A'}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Features List */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {hasActiveSubscription ? 'Your Plan Includes:' : 'Professional Plan Includes:'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Unlimited AI-powered case analysis',
                'Document generation and management',
                'Settlement calculator',
                'Case tracking and analytics',
                'Priority support',
                '7-day free trial',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-[#8dff2d] flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {hasActiveSubscription ? (
              <>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isCanceling}
                  className="px-6 py-3 bg-red-900/30 text-red-400 border border-red-600 rounded-lg hover:bg-red-900/50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Cancel subscription"
                >
                  {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                </button>
              </>
            ) : (
              <button
                onClick={handleUpgrade}
                className="flex items-center gap-2 px-6 py-3 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors font-semibold"
                aria-label="Subscribe now"
              >
                Subscribe Now
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Billing Information */}
        {subscription && hasActiveSubscription && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Billing Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Customer ID</span>
                <span className="text-white font-mono text-sm">
                  {subscriptionDetails?.customer_id || subscription.stripe_customer_id || 'N/A'}
                </span>
              </div>
              {subscription.status === 'trialing' && (
                <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircleIcon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-300 font-medium mb-1">Trial Period Active</p>
                      <p className="text-blue-200 text-sm">
                        {trialDaysLeft !== null && (
                          <span className="font-semibold">
                            {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} remaining.{' '}
                          </span>
                        )}
                        Your card will be charged $197 on {formatDate(subscriptionDetails?.current_period_end || null)} unless you cancel.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
          <p className="text-gray-400 mb-4">
            If you have any questions about your subscription or billing, please don't hesitate to reach out.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:support@docupilot.com"
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              aria-label="Contact support"
            >
              Contact Support
            </a>
            {!hasActiveSubscription && (
              <a
                href="/pricing"
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                aria-label="View pricing"
              >
                View Pricing
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCancelConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
        >
          <div 
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 id="cancel-modal-title" className="text-lg font-bold text-white mb-2">
                  Cancel Subscription?
                </h3>
                <p className="text-gray-400 text-sm">
                  Are you sure you want to cancel your subscription? You'll lose access to all premium features 
                  at the end of your current billing period on {formatDate(subscriptionDetails?.current_period_end || null)}.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCanceling}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
                aria-label="Keep subscription"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-600 rounded-lg hover:bg-red-900/50 transition-colors font-medium disabled:opacity-50"
                aria-label="Confirm cancel"
              >
                {isCanceling ? 'Canceling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSubscription;
